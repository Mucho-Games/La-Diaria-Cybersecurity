var deltaTime = 0;
var lastTimeUpdate = 0;
var initialized = false;
var currentUpdate = null;
var aspectRatio = 0.0;
var landscape = true;

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

    elemQuestionCont = document.getElementById("question");
    elemMultipleChoiceCont = document.getElementById("multipleChoice");
    elemSubQuestionCont = document.getElementById('subQuestions');

    //HUD
    elemGameHUDCont = document.getElementById("hud");
    elemPlayerScore = document.querySelector('#hud > #score p');
    elemPlayerScoreCont = document.querySelector('#hud > #score');
    elemPlayerLevelCont = document.querySelector('#hud > #level');
    elemPlayerLevel = document.querySelector("#hud > #level > p");
    elemPlayerLevelsAmount = document.querySelector('#hud > #level > #goalLevel');
    elemGainScore = document.getElementById("gainScore");

    //Elems answer main question
    elemAnswerMainCont = document.getElementById("answer-main-animation-cont");
    elemAnswerMainBottom = document.getElementById("answerAnimation");
    elemAnswerMainCharacter = document.querySelector('#answer-animation-character');
    elemAnswerMainCharacterIMG = document.querySelector('#answer-animation-character img');
    elemAnswerMainBubbleSpace = document.querySelector('#answerAnimation .character-bubble-space');
    elemAnswerMainBubble = document.querySelector('#answerAnimation .character-bubble');
    elemAnswerMainBubbleArrowWrapper = document.querySelector('#answerAnimation .character-bubble .character-bubble-arrow-wrapper');
    elemAnswerMainBubbleArrow = document.querySelector('#answerAnimation .character-bubble .character-bubble-arrow-wrapper img');
    elemAnswerMainText = document.querySelector('#answerAnimation .character-bubble p');
    elemAnswerMainTitle = document.querySelector('#answer-animation-header img');
    elemAnswerMainButtonsClone = document.getElementById('question-buttons-clone');

    elemAnimationAnswer = document.querySelector('#answerAnim');

    //End Screen
    elemFinalPlayerScore = document.querySelector('.endScreen #results .your-score .final-score p');
    elemFinalCharacterPortrait = document.querySelector('.endScreen .character-portrait');
    elemFinalCharacterBubble = document.querySelector('.endScreen .character-bubble-space');
    elemFinalCharacterText = document.querySelector('.endScreen .character-bubble p');

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
                    q.intro,
                    q.profilePic,
                    q.username,
                    q.usernameURL,
                    q.img,
                    q.footNote,
                    q.header,
                    q.body,
                    q.correctOption,
                    q.textsAnswer,
                    q.subQuestions.map(
                        sq => { 
                        return new SubQuestion(
                            sq.subQuestion,
                            sq.options,
                            sq.optionsValues,
                            sq.message
                            );
                    }),
                    q.finalMessage
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
}

function subscribe(fn) 
{
    const index = updateSubscribers.indexOf(fn);
    if (index !== -1) updateSubscribers.splice(index, 1);

    updateSubscribers.push(fn);
}

function unsubscribe(fn) {
    const index = updateSubscribers.indexOf(fn);
    if (index !== -1) updateSubscribers.splice(index, 1);
}

function setView (newView) 
{
    console.log("Setting new view: " + newView);
    var inGameViewsAmount = 3;

    for (var i = inGameViewsAmount; i >= 0; i--) 
    {
        if (views[i] == newView) {
        	currentView = i;
        	break;
        }
    }

    for (var i = inGameViewsAmount; i >= 0; i--) 
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
    
}

function onScreenSizeChange() 
{
    aspectRatio = window.innerWidth / window.innerHeight;

    var viewFinalScaling = ResizeView(currentView);
    ResizeView(4); //credits screen
    ResizeView(5); //settings screen

    if (!initialized) return; //layouts specifics

    if (currentView == 0) //titlescreen layout updates
    {
        var buttonPlay = document.querySelector('.titleScreen#buttonPlay');
        buttonPlay.style.height = `${document.querySelector('.titleScreen#header').offsetHeight}px`;
    }
    else if (currentView == 1)
    {

    }
    else if (currentView == 2)
    {
        var container = document.querySelector(`.game#container`);
        container.style.justifyContent = landscape ? 'center' : 'space-around';
        elemPlayerScoreCont.style.width = landscape ? '15%' : '18%';
        elemPlayerLevelCont.style.width = landscape ? '15%' : '18%';
        // var options = document.querySelectorAll(`.game .option`);
        // options.forEach(o => o.style.width = landscape ? '26%' : '30%');
        // var optionsClone = document.querySelectorAll(`#question-buttons-clone .option`);
        // optionsClone.forEach(o => o.style.width = landscape ? '26%' : '30%');

        if (landscape) 
        {
            elemAnswerMainBottom.style.height = `${answerOverlayRefResolution[1]}px`;
            elemAnswerMainBottom.style.width = `${answerOverlayRefResolution[0]}px`;
            elemAnswerMainBottom.style.transformOrigin = 'bottom center'
            elemAnswerMainBottom.style.transform = `scale(${viewFinalScaling})`;
        }
        else
        {
            elemAnswerMainBottom.style.height = `${answerOverlayRefResolutionPortrait[1]}px`;
            elemAnswerMainBottom.style.width = `${answerOverlayRefResolutionPortrait[0]}px`;
            elemAnswerMainBottom.style.transformOrigin = 'bottom center'
            elemAnswerMainBottom.style.transform = `scale(${viewFinalScaling})`;
        }

        overlayDiv(elemMultipleChoiceCont, elemAnswerMainButtonsClone);
    }
}

function ResizeView (index) 
{  
    var view = document.querySelector(`.${views[index]}#container`);
    var windowWidth = 0;
    var windowHeight = 0; 
    var _landscape = aspectRatio >= thresholdRatio;

    if (_landscape) /*LAND MODE---------------------*/
    {
        windowWidth = window.innerWidth - 80;
        windowHeight = window.innerHeight - 60;

        var viewRefSize = viewsRefResolutions[index];
        var viewScalingWidth = 1;
        var viewScalingHeight = 1;
        var viewFinalScaling = 1;


        viewScalingWidth = (windowWidth / viewRefSize[0]);
        viewScalingHeight = (windowHeight / viewRefSize[1]);

        if (viewScalingWidth < viewScalingHeight) 
        { 
            viewFinalScaling = viewScalingWidth;
            //view.style.backgroundColor = 'blue';
        }
        else 
        {
            viewFinalScaling = viewScalingHeight;
            //view.style.backgroundColor = 'red';
        }

        view.style.height = `${viewRefSize[1]}px`;
        view.style.width = `${viewRefSize[0]}px`;
        view.style.transformOrigin = 'bottom center'
        view.style.transform = `scale(${viewFinalScaling})`;

        var bottom = (window.innerHeight - (viewRefSize[1] * viewFinalScaling)) / 2;
        view.style.bottom  = `${bottom}px`;
    } 
    else /*PORTRAIT MODE---------------------*/
    {
        windowWidth = window.innerWidth - 30;
        windowHeight = (window.innerHeight * 0.9) - 60;

        var viewRefSize = viewsRefResolutionsPortrait[index];
        var viewScalingWidth = 1;
        var viewScalingHeight = 1;
        var viewFinalScaling = 1;

        viewScalingWidth = (windowWidth / viewRefSize[0]);
        viewScalingHeight = (windowHeight / viewRefSize[1]);

        if (viewScalingWidth < viewScalingHeight) 
        { 
            viewFinalScaling = viewScalingWidth;
            //view.style.backgroundColor = 'blue';
        }
        else 
        {
            viewFinalScaling = viewScalingHeight;
            //view.style.backgroundColor = 'red';
        }

        view.style.height = `${viewRefSize[1]}px`;
        view.style.width = `${viewRefSize[0]}px`;
        view.style.transformOrigin = 'bottom center'
        view.style.transform = `scale(${viewFinalScaling})`;

        var bottom = (window.innerHeight - (viewRefSize[1] * viewFinalScaling)) / 2;
        view.style.bottom  = `${bottom}px`;
    }

    return viewFinalScaling;
}