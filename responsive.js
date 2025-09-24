function adjustElementSize() 
{
    const aspectRatio = window.innerWidth / window.innerHeight;
    const thresholdRatio = 1 / 1;

    const minWidthGrid = 650;
    const maxWidthGrid = 900;
    const gridWidthToHeightMinRatio = 0.79;

    var pageWidth = document.body.clientWidth;

    if (aspectRatio >= thresholdRatio) /*LAND MODE---------------------*/
    {
        console.log("On Land mode");

        //document.getElementById("site-style-portrait").disabled = true;      

        //GENERAL P AND H3 SIZE RESPONSIVENESS
        //document.documentElement.style.setProperty('--header-font-size', `${pageWidth * 0.027}px`);
        //document.documentElement.style.setProperty('--body-font-size', `${pageWidth * 0.011}px`); 

        //CONTACT US
        //var contactUs = document.querySelector(".contactus");
        //var contactUsSize = parseFloat(getComputedStyle(contactUs).height)
        //document.documentElement.style.setProperty('--contact-font-size', `${contactUsSize * 0.13}px`);

        //GRID LAND RESPONSIVENESS
        var gridLand = document.querySelector(".container");
        gridLand.style.height = '100%';
        gridLand.style.width = `${clamp(gridLand.clientHeight * 0.69 + window.innerWidth * 0.1, minWidthGrid, maxWidthGrid)}px`;
        

        //GRID FOOTER RESPONSIVENESS
        //var gridFooter = document.querySelector(".mobile-footer");
        //gridFooter.style.width = '100%';
        //gridFooter.style.height = `${gridFooter.clientWidth / 7}px`;

        //GRID FOOTER SLIDER
        //var gridFooterSlider = document.querySelector(".mobile-footer .slider");
        //var footerBrandHeight = parseFloat(getComputedStyle(gridFooterSlider).height)
        //var footerBrandWidth = footerBrandHeight * 2;
    } 
    else /*PORTRAIT MODE---------------------*/
    {
        console.log("On Portrait mode");
        //document.getElementById("site-style-portrait").disabled = false; 
      

        //GENERAL P AND H3 SIZE RESPONSIVENESS
       // document.documentElement.style.setProperty('--header-font-size', `${pageWidth * 0.057}px`);
        //document.documentElement.style.setProperty('--body-font-size', `${pageWidth * 0.032}px`);

        //GRID LAND RESPONSIVENESS
        var gridLand = document.querySelector(".container");
        var targetWidthValue = gridLand.clientHeight * 0.69 + window.innerWidth * 0.1;

        if (aspectRatio < gridWidthToHeightMinRatio) 
        {
            console.log("On height adjustment mode");
            gridLand.style.width = '100%';
            gridLand.style.height = `${window.innerWidth / gridWidthToHeightMinRatio}px`;
            
        }
        else
        {
            console.log("On width adjustment mode");
            gridLand.style.height = '100%';
            gridLand.style.width = `${clamp(targetWidthValue, minWidthGrid, maxWidthGrid)}px`;
        }
        

        //GRID TOAST RESPONSIVENESS
        //var gridToast = document.querySelector(".toast");
       // gridToast.style.width = '100%';
        //gridToast.style.height = `${gridToast.clientWidth / 0.495}px`;

        //GRID PROJECTS RESPONSIVENESS
        //var gridProjects = document.querySelector(".mobile-proto"); 
        //gridProjects.style.width = `100%`;
        //gridProjects.style.height = `${gridProjects.clientWidth / 0.513}px`;

        //GRID FOOTER SLIDER
        //var gridFooterSlider = document.querySelector(".mobile-footer .slider");
        //var footerBrandHeight = parseFloat(getComputedStyle(gridFooterSlider).height)
        //var footerBrandWidth = footerBrandHeight * 2;     

    }   

    //document.documentElement.style.setProperty('--footer-brand-width', `${footerBrandWidth}px`);

    //var gridFooterSliderTrack = document.querySelector(".mobile-footer .slider .slide-track");

    //gridFooterSliderTrack.style.width = `${footerBrandWidth * 18}px`;
}

// Run on load and window resize
document.addEventListener("DOMContentLoaded", adjustElementSize);
window.addEventListener("load", adjustElementSize);
let resizeTimeout;
window.addEventListener("resize", () => {
    if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
    }
    resizeTimeout = requestAnimationFrame(adjustElementSize);
});

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}