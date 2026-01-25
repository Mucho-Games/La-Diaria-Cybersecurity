document.addEventListener('mousemove', e => eyesFollowMouse(e.clientX, e.clientY));

function eyesFollowMouse (mousePosX, mousePosY) 
{
    if (!initialized) return;
    if (currentView != 0) return;

    var eyesCenters = document.querySelectorAll('.titleScreen#header .eye');
    var eyes = document.querySelectorAll('.titleScreen#header .eye img');

    for (var i = eyesCenters.length - 1; i >= 0; i--) {
        var pos = getElementScreenPosition(eyesCenters[i]);
        var delta = {x: mousePosX - pos.x, y: mousePosY - pos.y};
        var dir = normalize(delta.x, delta.y);

        eyes[i].style.transform = `translate(${40 * dir.x}%,${40 * dir.y}%)`;
    }
    // console.log(eyes);
}