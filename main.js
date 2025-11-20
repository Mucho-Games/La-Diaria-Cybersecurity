import * as Utils from './utils.js';

window.onClickOption = onClickOption;

const questionsImgDirectory = './game/questions/img/';
const fps = 30;
const maxAspectRatio = 3/4;
const useTimer = false;
const debug = false;

var aspectRatio = 0.0;
var deltaTime = 0;
var lastTimeUpdate = 0;
var initialized = false;
var questionState = -1;
var currentView = 0;
const views = ["titleScreen", "game"];

//GAME VARS
var questionBank = [];
const questionDuration = 20;

var currentQuestion;
var currentPlayerScore = 0;
var currentQuestionTimer = 0;

var multipleChoiceDisabled = false;

//DOM ELEMENTS
var elemGameHUDCont;
var elemQuestionCont;
var elemMultipleChoiceCont;

var elemPlayerScore;
var elemGameQuestionTimer;
var elemGameQuestion;
var elemGameQuestionImg;
var elemGameQuestionOptions = [];
var elemGameQuestion2PopUp;
var elemGameQuestion2;
var elemGameQuestion2Options = [];

var elemAnimationAnswer;

//DEBUG VARS
var elementDebugFPS;
var elemDebugAspectRatio;

class Question {
    constructor(question, img, correctAnswer, subQuestions) {
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.img = img;
        this.subQuestions = subQuestions;
    }
}
class SubQuestion {
    constructor(subQuestion, options, correctAnswer) {
        this.subQuestion = subQuestion;
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
    elemGameQuestionImg = document.getElementById('questionImage');
    elemGameQuestionOptions = document.querySelectorAll('.game > .option > p');
    elemGameQuestion2PopUp = document.getElementById('mulChoicePart2');
    elemGameQuestion2 = document.getElementById('mulChoice2Question');
    elemGameQuestion2Options = document.querySelectorAll('.game > .option2 > p');

    elemAnimationAnswer = document.querySelector('#answerAnim');

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
                answerQuestion(2);
            }
        }
    }

    if (debug)
    {
        elementDebugFPS.innerHTML = 'FPS: ' + Utils.truncate(1/deltaTime, 1);
        elemDebugAspectRatio.innerHTML = 'ASPECT RATIO: ' + Utils.truncate(aspectRatio, 2);
    }
}

function answerQuestion (state) 
{

    if (state == 2) //missed by time
    {
        currentPlayerScore -= 20;
    }
    else if (state == 1) //wrong answer
    {
        currentPlayerScore -= 10;

        elemAnimationAnswer.style.backgroundColor = 'red';
        elemAnimationAnswer.querySelector('p').innerHTML = "EQUIVOCADO!";
        playAnimation(elemAnimationAnswer, 2);
    }
    else if (state == 0) //right answer
    {
        currentPlayerScore += 30;

        elemAnimationAnswer.style.backgroundColor = 'green';
        elemAnimationAnswer.querySelector('p').innerHTML = "BIEN HECHO!";
        playAnimation(elemAnimationAnswer, 2);
    }

    multipleChoiceDisabled = true;
    questionState++;

    setTimeout(function() 
    { 
        multipleChoiceDisabled = false;
        showSubQuestion(questionState-1);
    }, 
    2000);   
}
function newQuestion () 
{
    currentQuestion = Utils.getRandomElement(questionBank);

    elemGameQuestion.innerHTML = currentQuestion.question;
    elemGameQuestionImg.src = questionsImgDirectory + currentQuestion.img + '.jpg';
    elemGameQuestionImg.style.display = 'inline';

    // for (var i = 0; i < elemGameQuestionOptions.length; i++) 
    // {
    //     elemGameQuestionOptions[i].innerHTML = currentQuestion.options[i];
    // }

    currentQuestionTimer = questionDuration;
    questionState = 0;
}
function showSubQuestion (index) 
{
    elemGameQuestion2PopUp.style.display = 'flex';

    elemGameQuestion2.innerHTML = currentQuestion.subQuestions[index].subQuestion;

    for (var i = 0; i < elemGameQuestion2Options.length; i++) 
    {
        elemGameQuestion2Options[i].innerHTML = currentQuestion.subQuestions[index].options[i];
    }
}
function answerSubQuestion (state) 
{
    elemGameQuestion2PopUp.style.display = 'none';

    if (state == 2) //missed by time
    {
        currentPlayerScore -= 20;
    }
    else if (state == 1) //wrong answer
    {
        currentPlayerScore -= 0;

        elemAnimationAnswer.style.backgroundColor = 'red';
        elemAnimationAnswer.querySelector('p').innerHTML = "EQUIVOCADO!";
        playAnimation(elemAnimationAnswer, 2);
    }
    else if (state == 0) //right answer
    {
        currentPlayerScore += 10;

        elemAnimationAnswer.style.backgroundColor = 'green';
        elemAnimationAnswer.querySelector('p').innerHTML = "BIEN HECHO!";
        playAnimation(elemAnimationAnswer, 2);
    }

    multipleChoiceDisabled = true;
    questionState++;

    setTimeout(function() 
    { 
        multipleChoiceDisabled = false;
        if (questionState >= 4) 
        {
            newQuestion();
        }
        else
        {
            showSubQuestion(questionState-1);
        }
    }, 
    2000); 
}
export function onClickOption (option) 
{
    console.log("Clicked option: " + option);

    if (!currentQuestion || multipleChoiceDisabled) return;

    if (questionState == 0) //On main question
    {
        if (currentQuestion.correctAnswer == option) 
        {
            answerQuestion(0);
        }
        else
        {
            answerQuestion(1);
        }
    }
    else if (questionState > 0) //On second instance of question
    {
        if (currentQuestion.subQuestions[questionState-1].correctAnswer == option)
        {
            answerSubQuestion(0);
        }
        else
        {
            answerSubQuestion(1);
        }
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
function playAnimation (animElement, duration) 
{
    animElement.style.display = 'inline';
    setTimeout(function() {animElement.style.display = 'none';}, duration * 1000);
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
                q.img,
                q.correctOption,
                q.subQuestions.map(sq => { 
                    return new SubQuestion(
                        sq.subQuestion,
                        sq.options,
                        sq.correctOption
                        );
                })
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
            height = main.clientWidth * Utils.lerp(0.7, 0.9, 1-Utils.inverseLerp(aspectRatio, 0.6, 0.9));
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