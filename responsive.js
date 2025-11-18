const fps = 30;
const debug = false;

var deltaTime = 0;
var lastTimeUpdate = 0;
var initialized = false;
var currentView = 0;
const views = ["titleScreen", "game"];

//GAME VARS
var questionBank = [];
const questionDuration = 20;

var currentQuestion;
var currentPlayerScore = 0;
var currentQuestionTimer = 0;

var elemPlayerScore;
var elemGameQuestionTimer;
var elemGameQuestion;
var elemGameQuestionOptions = [];

//DEBUG VARS
var elementDebugFPS;

class Question {
    constructor(question, options, correctAnswer) {
        this.question = question;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
}


//RUN UPDATE
const currentUpdate = setInterval(update, 1000.0/fps);

// INITIALIZE GAME
document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener('click', onClick);

let resizeTimeout;
window.addEventListener("resize", () => {
    if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
    }
    resizeTimeout = requestAnimationFrame(adjustElementSize);
});


async function initialize () 
{
    console.log("Initializing");

    var debugBar = document.querySelector(".debugBar");
    debugBar.style.display = debug ? "flex" : "none";

    elementDebugFPS = document.querySelector(".debugBar > #fps");

    elemPlayerScore = document.querySelector(".game > #score > p");
    elemGameQuestionTimer = document.querySelector(".game > #timer > p");
    elemGameQuestion = document.querySelector(".game > #header > p");
    elemGameQuestionOptions = document.querySelectorAll('.game > .option > p');

    // var buttons = document.querySelectorAll('.game > .option');
    // for (var i =  0; i < buttons.length; i++) 
    // {
    //     buttons[i].addEventListener('click', () => onClickOption(i));
    //     buttons[i].setAttribute('role', 'button');
    //     buttons[i].setAttribute('tabindex', i);
    // }

    setView(0);

    await loadQuestions();

    initialized = true;
}

function startGame () {
    setView(1);
    newQuestion();
}

function update() 
{
    if (!initialized) return;

    deltaTime = (performance.now() - lastTimeUpdate) * 0.001;
    lastTimeUpdate = performance.now();

    if (currentView == 1) 
    {
        currentQuestionTimer -= deltaTime;

        elemPlayerScore.innerHTML = "Puntaje: " + currentPlayerScore;
        elemGameQuestionTimer.innerHTML = Math.trunc(currentQuestionTimer);

        if (currentQuestionTimer < 0) {
            endQuestion(2);
        }
    }

    if (debug)
    {
        elementDebugFPS.innerHTML = deltaTime;
    }
}

function endQuestion (state) 
{

    if (state == 2) //missed by time
    {
        currentPlayerScore -= 20;
    }
    else if (state == 1) //wrong answer
    {
        currentPlayerScore -= 10;
    }
    else if (state == 0) //right answer
    {
        currentPlayerScore += 30;
    }

    newQuestion();
}
function newQuestion () 
{
    currentQuestion = getRandomElement(questionBank);

    elemGameQuestion.innerHTML = currentQuestion.question;

    for (var i = 0; i < elemGameQuestionOptions.length; i++) 
    {
        elemGameQuestionOptions[i].innerHTML = currentQuestion.options[i];
    }

    currentQuestionTimer = questionDuration;
}
function onClickOption (option) 
{
    console.log("Clicked option: " + option);

    if (!currentQuestion) return;

    if (currentQuestion.correctAnswer == option) 
    {
        endQuestion(0);
    }
    else
    {
        endQuestion(1);
    }
}
function setView (newView) 
{
    console.log("Setting new view: " + newView);

    currentView = newView;

    for (var i = views.length - 1; i >= 0; i--) {
        var viewGrid = document.querySelector(`.${views[i]}#container`);
        viewGrid.style.display = i == currentView ? `grid` : `none`;
    }

    adjustElementSize();
}

async function loadQuestions() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();

        questionBank = data.questions.map(q => {
            return new Question(
                q.question,
                q.options,
                q.correctOption
            );
        });

        console.log("Question Bank:", questionBank);

    } catch (error) {
        console.error('Could not load questions:', error);
        document.getElementById('output').textContent = 'Error loading questions.';
    }
}


function adjustElementSize() 
{
    const aspectRatio = window.innerWidth / window.innerHeight;
    const thresholdRatio = 1 / 1;

    const minWidthGrid = 650;
    const maxWidthGrid = 900;
    const gridWidthToHeightMinRatio = 0.79;

    var pageWidth = document.body.clientWidth;

    var grid = document.querySelector(`.${views[currentView]}#container`);

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
        
        grid.style.height = '100%';
        grid.style.width = `${clamp(grid.clientHeight * 0.69 + window.innerWidth * 0.1, minWidthGrid, maxWidthGrid)}px`;
        

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
        var targetWidthValue = grid.clientHeight * 0.69 + window.innerWidth * 0.1;

        if (aspectRatio < gridWidthToHeightMinRatio) 
        {
            console.log("On height adjustment mode");
            grid.style.width = '100%';
            grid.style.height = `${window.innerWidth / gridWidthToHeightMinRatio}px`;
            
        }
        else
        {
            console.log("On width adjustment mode");
            grid.style.height = '100%';
            grid.style.width = `${clamp(targetWidthValue, minWidthGrid, maxWidthGrid)}px`;
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

function onClick () 
{
    if (currentView == 0)
        startGame();
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}
function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}