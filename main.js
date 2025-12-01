var deltaTime = 0;
var lastTimeUpdate = 0;
var initialized = false;
var currentUpdate = null;
var aspectRatio = 0.0;

var questionBank = [];

var updateSubscribers = [];

// INITIALIZE GAME
document.addEventListener("DOMContentLoaded", initialize);

document.addEventListener('click', onClickAnywhere);

//RESPONSIVE 
let resizeTimeout;
window.addEventListener("resize", () => {
    if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
    }
    resizeTimeout = requestAnimationFrame(onScreenSizeChange);
});

async function initialize () 
{
    console.log("Initializing");

    var debugBar = document.querySelector(".debugBar");
    debugBar.style.display = debug ? "flex" : "none";

    elementDebugFPS = document.querySelector(".debugBar > #fps");
    elemDebugAspectRatio = document.querySelector(".debugBar > #aspectRatio");

    elemRoot = document.querySelector('.root');

    elemGameContainer = document.getElementById('gamePanel');

    elemGameHUDCont = document.getElementById("hud");
    elemScoreIcon = document.getElementById('scoreIcon');
    elemQuestionCont = document.getElementById("question");
    elemMultipleChoiceCont = document.getElementById("multipleChoice");
    elemSubQuestionCont = document.getElementById('subQuestions');

    elemPlayerScore = document.querySelector("#hud > #score > p");
    elemAnimationAnswer = document.querySelector('#answerAnim');

    setView('titleScreen');

    await loadQuestions();

    initialized = true;

    //RUN UPDATE
    currentUpdate = setInterval(update, 1000.0/fps);
}

async function loadQuestions() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();

        questionBank = data.questions.map(
            q => {
            if (q.questionType == 0) //contemplating future type of questions structure
            {
                return new QuestionTypeA 
                (
                    q.profilePic,
                    q.username,
                    q.usernameURL,
                    q.img,
                    q.footNote,
                    q.header,
                    q.body,
                    q.correctOption,
                    q.subQuestions.map(
                        sq => { 
                        return new SubQuestion(
                            sq.subQuestion,
                            sq.options,
                            sq.correctOption
                            );
                    })
                );
            }
            else
            {
                return null;
            }           
        });

        console.log("Question Bank:", questionBank);

    } catch (error) {
        console.error('Could not load questions:', error);
        document.getElementById('output').textContent = 'Error loading questions.';
    }
}

function update() 
{
    deltaTime = (performance.now() - lastTimeUpdate) * 0.001;
    lastTimeUpdate = performance.now();
    
	updateSubscribers.forEach(fn => fn(deltaTime));

    if (debug)
    {
        elementDebugFPS.innerHTML = 'FPS: ' + truncate(1/deltaTime, 1);
        elemDebugAspectRatio.innerHTML = 'ASPECT RATIO: ' + truncate(aspectRatio, 2);
    }
}

function subscribe(fn) {
    updateSubscribers.push(fn);
}

function unsubscribe(fn) {
    const index = updateSubscribers.indexOf(fn);
    if (index !== -1) updateSubscribers.splice(index, 1);
}

function setView (newView) 
{
    console.log("Setting new view: " + newView);

    for (var i = views.length - 1; i >= 0; i--) 
    {
        if (views[i] == newView) {
        	currentView = i;
        	break;
        }
    }

    for (var i = views.length - 1; i >= 0; i--) 
    {
        var viewGrid = document.querySelector(`.${views[i]}#container`);
        viewGrid.style.display = i == currentView ? `flex` : `none`;
    }

    elemRoot.style.backgroundColor = `var(${viewsColors[currentView]})`;

    onScreenSizeChange();
}

function playAnimation (animElement, duration) 
{
    animElement.style.display = 'inline';
    setTimeout(function() {animElement.style.display = 'none';}, duration * 1000);
}


function onClickAnywhere () 
{
    if (currentView == 0)
        showIntroAnimation();
}

function onScreenSizeChange() 
{
    aspectRatio = window.innerWidth / window.innerHeight;

    const thresholdRatio = 0.62; //added a little padding to avoid small gaps on layout at the borders

    var pageWidth = document.body.clientWidth;

    var main = document.querySelector(`.${views[currentView]}#container`);
    var widthMultiplier = currentView <= 1 ? 1.7 : 1; //title screen is wider

    var width = 0; //declaring this var here to be read and written all over the function execution and only here
    var height = 0; //declaring this var here to be read and written all over the function execution and only here

    var maxWidth = window.innerWidth - 60;

    if (aspectRatio >= thresholdRatio) /*LAND MODE---------------------*/
    {
        console.log("On Land mode");

        width = clamp(window.innerHeight * maxLandAspectRatio * widthMultiplier, 0, maxWidth); 

        main.style.height = '95%';
        main.style.width = `${width}px`;
        main.style.bottom = '2.5%'

    } 
    else /*PORTRAIT MODE---------------------*/
    {
        console.log("On Portrait mode");

        height = main.clientWidth / maxPortraitAspectRatio;
        main.style.height = `${height}px`;
        main.style.width = currentView == 0 ? '85%' : '95%';
        main.style.bottom = `${((window.innerHeight - height) / 2)}px`;
    }

    if (initialized) 
    {
        // elemQuestionCont.style.width = '95%';
        // elemQuestionCont.style.height = `${(elemQuestionCont.offsetWidth * 0.75)}px`;
        // elemQuestionCont.style.left  = '2.5%';
        // elemQuestionCont.style.top  = `${main.offsetWidth * 0.025}px`;

        elemScoreIcon.style.width = `${elemGameHUDCont.offsetHeight * 0.8}px`;
    }

    if (currentView == 0) //titlescreen layout updates
    {
        var buttonPlay = document.querySelector('.titleScreen#buttonPlay');
        buttonPlay.style.height = `${document.querySelector('.titleScreen#header').offsetHeight}px`;
    }
}