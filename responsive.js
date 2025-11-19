const fps = 30;
const maxAspectRatio = 3/4;
const useTimer = false;
const debug = false;

var aspectRatio = 0.0;
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

//DOM ELEMENTS
var elemGameHUDCont;
var elemQuestionCont;
var elemMultipleChoiceCont;

var elemPlayerScore;
var elemGameQuestionTimer;
var elemGameQuestion;
var elemGameQuestionOptions = [];

//DEBUG VARS
var elementDebugFPS;
var elemDebugAspectRatio;

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
    elemDebugAspectRatio = document.querySelector(".debugBar > #aspectRatio");

    elemGameHUDCont = document.querySelector(".game > #hud");
    elemQuestionCont = document.querySelector(".game > #question");
    elemMultipleChoiceCont = document.querySelector(".game > #multipleChoice");

    elemPlayerScore = document.querySelector(".game > #hud > p");
    elemGameQuestionTimer = document.querySelector(".game > #timer > p");
    elemGameQuestion = document.querySelector(".game > #question > p");
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
        elemPlayerScore.innerHTML = "Puntaje: " + currentPlayerScore;

        if (useTimer) 
        {
            currentQuestionTimer -= deltaTime;

            elemGameQuestionTimer.innerHTML = Math.trunc(currentQuestionTimer);

            if (currentQuestionTimer < 0) 
            {
                endQuestion(2);
            }
        }
    }

    if (debug)
    {
        elementDebugFPS.innerHTML = 'FPS: ' + truncate(1/deltaTime, 1);
        elemDebugAspectRatio.innerHTML = 'ASPECT RATIO: ' + truncate(aspectRatio, 2);
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
    aspectRatio = window.innerWidth / window.innerHeight;

    const thresholdRatio = maxAspectRatio + 0.1; //added a little padding to avoid small gaps on layout at the borders

    var pageWidth = document.body.clientWidth;

    var main = document.querySelector(`.${views[currentView]}#container`);

    var width = 0; //declaring this var here to be read and written all over the function execution and only here
    var height = 0; //declaring this var here to be read and written all over the function execution and only here

    if (aspectRatio >= thresholdRatio) /*LAND MODE---------------------*/
    {
        console.log("On Land mode");

        main.style.height = '100%';
        main.style.width = `${main.clientHeight * maxAspectRatio}px`;

        if (initialized) 
        {
            //QUESTION CONTAINER
            height = main.clientWidth * 0.7;
            elemQuestionCont.style.height = `${height}px`;
            elemQuestionCont.style.top = `${main.clientHeight * 0.5 - (height * 0.5)}px`;
        }
    } 
    else /*PORTRAIT MODE---------------------*/
    {
        console.log("On Portrait mode");

        var targetWidthValue = main.clientHeight * 0.69 + window.innerWidth * 0.1;

        main.style.height = '100%';
        main.style.width = '100%';

        if (initialized) 
        {
            //QUESTION CONTAINER
            height = main.clientWidth * lerp(0.7, 0.9, 1-inverseLerp(aspectRatio, 0.6, 0.9));
            elemQuestionCont.style.height = `${height}px`;
            elemQuestionCont.style.top = `${main.clientHeight * 0.5 - (height * 0.5)}px`;

            //MULTIPLE CHOICE CONTAINER
        }
    }   
}

function onClick () 
{
    if (currentView == 0)
        startGame();
}

function truncate(num, digits) {
    var multiplier = Math.pow(10, digits);
    return (Math[num < 0 ? 'ceil' : 'floor'](num * multiplier) / multiplier);
}
function inverseLerp (val, a, b) {
    return clamp((val - a) / (b - a), 0, 1);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}
function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}