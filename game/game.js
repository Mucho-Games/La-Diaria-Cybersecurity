//GAME VARS
var questionState = -1;
var questionOptionSelected = -1;
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
var elemGainScore;

//Question Elements
var elemQuestionCont;
var elemMultipleChoiceCont;
var elemSubQuestionCont;

//Answer main Question Elms
var elemAnswerMainCont;
var elemAnswerMainBottom;
var elemAnswerMainCharacter;
var elemAnswerMainBubbleSpace;
var elemAnswerMainBubble;
var elemAnswerMainBubbleArrowWrapper;
var elemAnswerMainBubbleArrow;
var elemAnswerMainText;
var elemAnswerMainTitle;
var elemAnswerMainButtonsClone;

var elemAnimationAnswer;

//END SCREEN ELEM
var elemFinalPlayerScore;
var elemFinalCharacterPortrait;
var elemFinalCharacterBubble;
var elemFinalCharacterText;

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
    show(elemFinalCharacterPortrait)
    show(elemFinalCharacterBubble);

    new Dialogue(elemFinalCharacterText, "Increíble pero cierto!");

    setView('endScreen');
}



async function newQuestion () 
{
    document.removeEventListener('click', newQuestion);

    elemAnswerMainCont.style.display = 'none';

    if (currentQuestionsAmount >= levelsAmount)  {//<---------------------------------------- has to move this from here this is nasty
        endGame();
        return;
    }

    //currentQuestion = getRandomElement(questionBank);
    currentQuestion = questionBank[currentQuestionsAmount];

    showIntroAnimation(currentQuestion.intro);

    console.log(introAnimationPlaying);
    await waitFor(() => !introAnimationPlaying);
    console.log(introAnimationPlaying);

    currentQuestion.getDOMElements();
    currentQuestion.populate();

    questionState = 0;
    questionOptionSelected = -1;
    currentQuestionsAmount++;

    elemPlayerLevel.innerHTML = "0"+currentQuestionsAmount;

    elemAnswerMainCont.style.display = 'none';
    elemMultipleChoiceCont.style.display = 'flex';

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

    elemAnswerMainCont.style.display = 'flex';

    if (option == 0) 
    {
        elemAnswerMainCharacter.style.removeProperty('left');
        elemAnswerMainCharacter.style.right = '-2%';
        elemAnswerMainBubbleSpace.style.removeProperty('right');
        elemAnswerMainBubbleSpace.style.left = '6%';
    }
    else
    {
        elemAnswerMainCharacter.style.removeProperty('right');
        elemAnswerMainCharacter.style.left = '-2%';
        elemAnswerMainBubbleSpace.style.removeProperty('left');
        elemAnswerMainBubbleSpace.style.right = '6%';       
    }

    elemAnswerMainBubble.style.backgroundColor = 'var(--color-white)';
    elemAnswerMainBubbleArrow.src = option == 0 ? 
    'assets/text-box-bottom-white-right.svg' : 'assets/text-box-bottom-white-left.svg';
    elemAnswerMainBubbleArrowWrapper.style = option == 0 ? 'right: var(--round-corners)' : 'left: var(--round-corners)';

    elemAnswerMainButtonsClone.style.display = 'flex';
    //elemMultipleChoiceCont.style.display = 'none';

    var optionsClone = document.querySelectorAll(`#question-buttons-clone .option`);
    elemAnswerMainButtonsClone.style.flexDirection = option == 0 ? 'row' : 'row-reverse';
    optionsClone[0].style.display = option == 0 ? 'flex' : 'none';
    optionsClone[1].style.display = option == 1 ? 'flex' : 'none';

    show(elemAnswerMainBubble.parentElement);

    new Dialogue(elemAnswerMainText, currentQuestion.textsAnswer[option]);

    multipleChoiceDisabled = true;
    questionOptionSelected = option;
    questionState++;

    setTimeout(function() 
    { 
        document.addEventListener('click', endMainQuestion);
    }, 
    1000);    
}

function endMainQuestion () 
{ 
    showSubQuestion(); 
    document.removeEventListener('click', endMainQuestion);
}

function showSubQuestion () 
{
    multipleChoiceDisabled = false;
    elemAnswerMainCont.style.display = 'none';

    elemSubQuestionCont.style.display = 'flex';
    elemSubQuestionCont.style.height = '100%';
    elemSubQuestionCont.style.justifyContent = 'center';

    document.getElementById('subQuestions-container').style.height = '78%';
    document.getElementById('subQuestions-container').style.justifyContent = 'space-around';

    if (currentQuestion.subQuestions.length < 2)
        questionOptionSelected = 0;

    currentQuestion.subQuestions[questionOptionSelected].getDOMElements();
    currentQuestion.subQuestions[questionOptionSelected].populate();
}

function answerSubQuestion (option, state) 
{
    if (state == 1) //wrong answer
    {
        currentQuestion.subQuestions[questionOptionSelected].markWrong(option);

        for (var i = currentQuestion.subQuestions[questionOptionSelected].optionsValues.length - 1; i >= 0; i--) 
        {
            if (i == option) continue;

            if (currentQuestion.subQuestions[questionOptionSelected].optionsValues[i]) 
            {
                currentQuestion.subQuestions[questionOptionSelected].markCorrect(i, false);
            }
        }
        

        // elemAnimationAnswer.style.backgroundColor = 'red';
        // elemAnimationAnswer.querySelector('p').innerHTML = "EQUIVOCADO!";
        // playAnimation(elemAnimationAnswer, 2);
    }
    else if (state == 0) //right answer
    {
        updatePlayerScore(currentPlayerScore + 30);

        currentQuestion.subQuestions[questionOptionSelected].markCorrect(option, true);

        // elemAnimationAnswer.style.backgroundColor = 'green';
        // elemAnimationAnswer.querySelector('p').innerHTML = "BIEN HECHO!";
        // playAnimation(elemAnimationAnswer, 2);
    }

    multipleChoiceDisabled = true;
    questionState++;

    elemAnswerMainCont.style.display = 'flex';

    if (option == 0) 
    {
        elemAnswerMainCharacter.style.removeProperty('left');
        elemAnswerMainCharacter.style.right = '-2%';
        elemAnswerMainBubbleSpace.style.removeProperty('right');
        elemAnswerMainBubbleSpace.style.left = '6%';
    }
    else
    {   
        elemAnswerMainCharacter.style.removeProperty('right');
        elemAnswerMainCharacter.style.left = '-2%';
        elemAnswerMainBubbleSpace.style.removeProperty('left');
        elemAnswerMainBubbleSpace.style.right = '6%';
    }

    elemAnswerMainBubble.style.backgroundColor = 'var(--color-white)';
    elemAnswerMainBubbleArrow.src = option == 0 ? 
    'assets/text-box-bottom-white-right.svg' : 'assets/text-box-bottom-white-left.svg';
    elemAnswerMainBubbleArrowWrapper.style = option == 0 ? 'right: var(--round-corners)' : 'left: var(--round-corners)';

    elemAnswerMainButtonsClone.style.display = 'none';

    show(elemAnswerMainBubble.parentElement);

    //elemSubQuestionCont.style.height = '73%';
    //elemSubQuestionCont.style.justifyContent = 'flex-start';
    //document.getElementById('subQuestions-container').style.height = '100%';
    //document.getElementById('subQuestions-container').style.justifyContent = 'center';

    new Dialogue(elemAnswerMainText, currentQuestion.subQuestions[questionOptionSelected].message);

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

    elemAnswerMainCont.style.display = 'flex';

    elemAnswerMainCharacter.style.removeProperty('right');
    elemAnswerMainCharacter.style.left = '-2%';
    elemAnswerMainBubbleSpace.style.removeProperty('left');
    elemAnswerMainBubbleSpace.style.right = '6%';

    elemAnswerMainBubble.style.backgroundColor = 'var(--color-white)';
    elemAnswerMainBubbleArrow.src = 'assets/text-box-bottom-white-left.svg';
    elemAnswerMainBubbleArrowWrapper.style = 'left: var(--round-corners)';

    elemAnswerMainButtonsClone.style.display = 'none';

    //elemSubQuestionCont.style.height = '73%';

    show(elemAnswerMainBubble.parentElement);

    new Dialogue(elemAnswerMainText, currentQuestion.finalMessage[questionOptionSelected]);

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
        if (currentQuestion.subQuestions[questionOptionSelected].optionsValues[option])
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
    var diff = currentPlayerScore - updatePlayerScore_startValue;

    var points = elemGainScore.querySelector('p');
    points.innerHTML = "+" + diff;

    showOneShot(elemGainScore, 2.5);

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

async function showOneShot(elem, duration) 
{
  show(elem);

  await sleep(duration);

  elem.classList.remove("show");
  elem.classList.add("exit");

  await new Promise(resolve =>
    elem.addEventListener("transitionend", resolve, { once: true })
  );

  elem.classList.add("hidden");
  elem.classList.remove("exit");
}
function show (elem) 
{
  elem.classList.remove("hidden", "exit");
  elem.offsetHeight;

  elem.classList.add("show");
}
