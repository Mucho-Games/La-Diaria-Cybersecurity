//GAME VARS
var questionState = -1;
var currentView = 0;

var currentQuestion;
var currentQuestionsAmount = 0;
var currentPlayerScore = 0;

var multipleChoiceDisabled = false;

//DOM ELEMENTS--------------------------------------------
var elemRoot;
var elemGameContainer;

//HUD Elements
var elemGameHUDCont;
var elemPlayerLevel;
var elemPlayerLevelsAmount;
var elemPlayerScore;
var elemPlayerScoreCont;
var elemPlayerLevelCont;

//Question Elements
var elemQuestionCont;
var elemMultipleChoiceCont;
var elemSubQuestionCont;

var elemAnimationAnswer;

//END SCREEN ELEM
var elemFinalPlayerScore;

//DOM ELEMENTS--------------------------------------------

window.onClickOption = onClickOption;

function startGame () 
{
    if (!initialized) return;

    elemPlayerLevelsAmount.innerHTML = "/" + String(levelsAmount).padStart(2, "0");
    setView('game');
    newQuestion();
}

function endGame () 
{
    elemFinalPlayerScore.innerHTML = String(currentPlayerScore).padStart(3, "0");
    setView('endScreen');
}

function answerQuestion (state) 
{
    if (state == 1) //wrong answer
    {
        elemAnimationAnswer.style.backgroundColor = 'red';
        elemAnimationAnswer.querySelector('p').innerHTML = "EQUIVOCADO!";
        playAnimation(elemAnimationAnswer, 2);
    }
    else if (state == 0) //right answer
    {
        updatePlayerScore(currentPlayerScore + 100);

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

    elemPlayerLevel.innerHTML = "0"+currentQuestionsAmount;
}
function showSubQuestion (index) 
{
    elemSubQuestionCont.style.display = 'flex';

    currentQuestion.subQuestions[index].getDOMElements();
    currentQuestion.subQuestions[index].populate();
}
function answerSubQuestion (option, state) 
{
    var subQuestionIndex = questionState-1;

    if (state == 1) //wrong answer
    {
        currentQuestion.subQuestions[subQuestionIndex].markWrong(option);
        currentQuestion.subQuestions[subQuestionIndex].markCorrect(currentQuestion.subQuestions[subQuestionIndex].correctAnswer, false);

        // elemAnimationAnswer.style.backgroundColor = 'red';
        // elemAnimationAnswer.querySelector('p').innerHTML = "EQUIVOCADO!";
        // playAnimation(elemAnimationAnswer, 2);
    }
    else if (state == 0) //right answer
    {
        updatePlayerScore(currentPlayerScore + 30);

        currentQuestion.subQuestions[subQuestionIndex].markCorrect(option, true);

        // elemAnimationAnswer.style.backgroundColor = 'green';
        // elemAnimationAnswer.querySelector('p').innerHTML = "BIEN HECHO!";
        // playAnimation(elemAnimationAnswer, 2);
    }

    multipleChoiceDisabled = true;
    questionState++;

    setTimeout(function() 
    { 
        multipleChoiceDisabled = false;
        elemSubQuestionCont.style.display = 'none';

        if (questionState >= 4) 
        {
            if (currentQuestionsAmount >= levelsAmount) 
                endGame();
            else
                newQuestion();
        }
        else
        {
            showSubQuestion(questionState-1);
        }
    }, 
    3000); 
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
            answerSubQuestion(option, 0);
        }
        else
        {
            answerSubQuestion(option, 1);
        }
    }
}

var updatePlayerScore_currentT = 0;
var updatePlayerScore_currentTN = 0;
var updatePlayerScore_startValue = 0;
function updatePlayerScore (newValue) 
{
    updatePlayerScore_currentT = 0;
    updatePlayerScore_startValue = currentPlayerScore;
    currentPlayerScore = newValue;

    subscribe(_updatePlayerScore);
} 
function _updatePlayerScore (deltaTime)
{
    updatePlayerScore_currentT += deltaTime;
    updatePlayerScore_currentTN = clamp01(updatePlayerScore_currentT);

    var val = Math.floor(lerp(updatePlayerScore_startValue, currentPlayerScore, updatePlayerScore_currentTN));
    elemPlayerScore.innerHTML = String(val).padStart(3, "0");

    if (updatePlayerScore_currentTN >= 1) {
        unsubscribe(_updatePlayerScore);
    }
}
