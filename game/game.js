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
var elemPlayerScore;
var elemScoreIcon;

//Question Elements
var elemQuestionCont;
var elemMultipleChoiceCont;
var elemSubQuestionCont;

var elemAnimationAnswer;
//DOM ELEMENTS--------------------------------------------

window.onClickOption = onClickOption;

function startGame () 
{
    if (!initialized) return;

    setView('game');
    newQuestion();
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

    elemPlayerScore.innerHTML = "0"+currentQuestionsAmount;
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

    if (state == 2) //missed by time
    {
        currentPlayerScore -= 20;
    }
    else if (state == 1) //wrong answer
    {
        currentPlayerScore -= 0;

        currentQuestion.subQuestions[subQuestionIndex].markWrong(option);
        currentQuestion.subQuestions[subQuestionIndex].markCorrect(currentQuestion.subQuestions[subQuestionIndex].correctAnswer, false);

        // elemAnimationAnswer.style.backgroundColor = 'red';
        // elemAnimationAnswer.querySelector('p').innerHTML = "EQUIVOCADO!";
        // playAnimation(elemAnimationAnswer, 2);
    }
    else if (state == 0) //right answer
    {
        currentPlayerScore += 10;

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
