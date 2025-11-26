var aspectRatio = 0.0;
var deltaTime = 0;
var lastTimeUpdate = 0;
var initialized = false;
var questionState = -1;
var currentView = 0;

//GAME VARS
var questionBank = [];

var currentQuestion;
var currentQuestionsAmount = 0;
var currentPlayerScore = 0;

var multipleChoiceDisabled = false;

//DOM ELEMENTS--------------------------------------------
var elemRoot;
var elemGameContainer;

//HUD Elements
var elemGameHUDCont;
var elemPlayerScore;
var elemScoreIcon;

//Question Elements
var elemQuestionCont;
var elemMultipleChoiceCont;

var elemAnimationAnswer;

//DEBUG VARS
var elementDebugFPS;
var elemDebugAspectRatio;
//DOM ELEMENTS--------------------------------------------

//RUN UPDATE
const currentUpdate = setInterval(update, 1000.0/fps);

window.onClickOption = onClickOption;

// INITIALIZE GAME
document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener('click', onClick);
document.addEventListener('mousemove', e => eyesFollowMouse(e.clientX, e.clientY));

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

    elemRoot = document.querySelector('.root');

    elemGameContainer = document.getElementById('gamePanel');

    elemGameHUDCont = document.querySelector("#hud");
    elemScoreIcon = document.getElementById('scoreIcon');
    elemQuestionCont = document.getElementById("question");
    elemMultipleChoiceCont = document.querySelector("#multipleChoice");

    elemPlayerScore = document.querySelector("#hud > #score > p");
    elemAnimationAnswer = document.querySelector('#answerAnim');

    setView(0);

    await loadQuestions();

    initialized = true;
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
        elemPlayerScore.innerHTML = "0"+currentQuestionsAmount;
    }

    if (debug)
    {
        elementDebugFPS.innerHTML = 'FPS: ' + truncate(1/deltaTime, 1);
        elemDebugAspectRatio.innerHTML = 'ASPECT RATIO: ' + truncate(aspectRatio, 2);
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
    currentQuestion = getRandomElement(questionBank);

    currentQuestion.getDOMElements();
    currentQuestion.populate();

    questionState = 0;
    currentQuestionsAmount++;
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
function onClickOption (option) 
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
        viewGrid.style.display = i == currentView ? `flex` : `none`;
    }

    elemRoot.style.backgroundColor = currentView == 0 ? 'var(--color-green)' : 'var(--color-blue)';

    adjustElementSize();
}
function playAnimation (animElement, duration) 
{
    animElement.style.display = 'inline';
    setTimeout(function() {animElement.style.display = 'none';}, duration * 1000);
}


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

function adjustElementSize() 
{
    aspectRatio = window.innerWidth / window.innerHeight;

    const thresholdRatio = 0.62; //added a little padding to avoid small gaps on layout at the borders

    var pageWidth = document.body.clientWidth;

    var main = document.querySelector(`.${views[currentView]}#container`);
    var widthMultiplier = currentView == 0 ? 1.5 : 1; //title screen is wider

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

function onClick () 
{
    if (currentView == 0)
        startGame();
}