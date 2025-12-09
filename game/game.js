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

//Answer main Question Elms
var elemAnswerMainCont;
var elemAnswerMainBottom;
var elemAnswerMainCharacter;
var elemAnswerMainBubble;
var elemAnswerMainBubbleArrow;
var elemAnswerMainText;
var elemAnswerMainTitle;

var elemAnimationAnswer;

//END SCREEN ELEM
var elemFinalPlayerScore;

//DOM ELEMENTS--------------------------------------------

window.onClickOption = onClickOption;

function startGame () 
{
    if (!initialized) return;

    elemPlayerLevelsAmount.innerHTML = "/" + String(levelsAmount).padStart(2, "0");

    newQuestion();
}

function endGame () 
{
    elemFinalPlayerScore.innerHTML = String(currentPlayerScore).padStart(3, "0");
    setView('endScreen');
}



async function newQuestion () 
{
    document.removeEventListener('click', newQuestion);

    currentQuestion = getRandomElement(questionBank);

    showIntroAnimation();

    console.log(introAnimationPlaying);
    await waitFor(() => !introAnimationPlaying);
    console.log(introAnimationPlaying);

    currentQuestion.getDOMElements();
    currentQuestion.populate();

    questionState = 0;
    currentQuestionsAmount++;

    elemPlayerLevel.innerHTML = "0"+currentQuestionsAmount;

    elemAnswerMainCont.style.display = 'none';

    multipleChoiceDisabled = false;

    setView('game');
}

async function answerQuestion (state, option) 
{
    if (state == 1) //wrong answer
    {
        // elemAnimationAnswer.style.backgroundColor = 'red';
        // elemAnimationAnswer.querySelector('p').innerHTML = "EQUIVOCADO!";
        // playAnimation(elemAnimationAnswer, 2);
    }
    else if (state == 0) //right answer
    {
        updatePlayerScore(currentPlayerScore + 100);

        // elemAnimationAnswer.style.backgroundColor = 'green';
        // elemAnimationAnswer.querySelector('p').innerHTML = "BIEN HECHO!";
        // playAnimation(elemAnimationAnswer, 2);
    }

    elemAnswerMainCont.style.display = 'block';
    elemAnswerMainBottom.style.backgroundColor = option == 0 ? 'var(--color-orange)' : option == 1 ? 'var(--color-blue)' : 'var(--color-green)';
    elemAnswerMainTitle.src = option == 0 ? 'assets/label-fake.svg' : option == 1 ? 'assets/label-sus.svg' : 'assets/label-true.svg';
    elemAnswerMainTitle.style.display = 'inline-block';
    elemAnswerMainBubble.style.backgroundColor = 'var(--color-white)';
    elemAnswerMainBubbleArrow.src = 'assets/text-box-bottom-white-left.svg';

    new Dialogue(elemAnswerMainText, currentQuestion.textsAnswer[option]);

    multipleChoiceDisabled = true;
    questionState++;

    setTimeout(function() 
    { 
        document.addEventListener('click', endMainQuestion);
    }, 
    1000);    
}

function endMainQuestion () 
{ 
    showSubQuestion(questionState-1); 
    document.removeEventListener('click', endMainQuestion);
}

function showSubQuestion (index) 
{
    multipleChoiceDisabled = false;
    elemAnswerMainCont.style.display = 'none';

    elemSubQuestionCont.style.display = 'flex';
    elemSubQuestionCont.style.height = '100%';

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

    elemAnswerMainCont.style.display = 'block';
    elemAnswerMainBottom.style.backgroundColor = 'var(--color-white)';
    elemAnswerMainTitle.style.display = 'none';
    elemAnswerMainBubble.style.backgroundColor = 'var(--color-yellow)';
    elemAnswerMainBubbleArrow.src = 'assets/text-box-bottom-yellow-left.svg';

    elemSubQuestionCont.style.height = '73%';

    new Dialogue(elemAnswerMainText, currentQuestion.subQuestions[subQuestionIndex].message);

    setTimeout(function() 
    { 
        document.addEventListener('click', endSubQuestion);
    }, 
    1000); 
}
function endSubQuestion () 
{
    multipleChoiceDisabled = false;
    elemSubQuestionCont.style.display = 'none';

    if (questionState >= currentQuestion.subQuestions.length) 
    {
        if (currentQuestionsAmount >= levelsAmount) 
            endGame();
        else
            endLevel();
    }
    else
    {
        showSubQuestion(questionState-1);
    }

    document.removeEventListener('click', endSubQuestion);
}

function endLevel () 
{
    multipleChoiceDisabled = true;

    elemAnswerMainCont.style.display = 'block';
    elemAnswerMainBottom.style.backgroundColor = 'var(--color-white)';
    elemAnswerMainTitle.style.display = 'none';
    elemAnswerMainBubble.style.backgroundColor = 'var(--color-yellow)';
    elemAnswerMainBubbleArrow.src = 'assets/text-box-bottom-yellow-left.svg';

    elemSubQuestionCont.style.height = '73%';

    new Dialogue(elemAnswerMainText, currentQuestion.finalMessage);

    setTimeout(function() 
    { 
        document.addEventListener('click', newQuestion);
    }, 
    1000); 
}




function onClickOption (option) 
{
    console.log("Clicked option: " + option);

    if (!currentQuestion || multipleChoiceDisabled) return;

    if (questionState == 0) //On main question
    {
        if (currentQuestion.correctAnswer == option) 
        {
            answerQuestion(0, option);
        }
        else
        {
            answerQuestion(1, option);
        }
    }
    else if (questionState > 0) //On second instance of question
    {
        if (currentQuestion.subQuestions[questionState-1].optionsValues[option])
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
