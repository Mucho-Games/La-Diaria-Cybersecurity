//GAME VARS
var questionState = -1;
var questionOptionSelected = -1;
var currentView = 0;

var currentQuestion;
var currentQuestionsAmount = 0;
var currentPlayerScore = 0;

var multipleChoiceDisabled = false;
var musicEnabled = true;
var soundEnabled = true; 

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
var elemAnswerMainCharacterIMG;
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

async function newQuestion () 
{
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('answer-sticker').style.display = 'none';
    elemAnswerMainCont.style.display = 'none';

    //currentQuestion = getRandomElement(questionBank);
    currentQuestion = questionBank[currentQuestionsAmount];

    const introTexts = currentQuestion.intro.map(entry => entry.text);
    const introCharacters = currentQuestion.intro.map(entry => entry.character);
    showIntroAnimation(introTexts, introCharacters);

    await waitFor(() => !introAnimationPlaying);

    document.getElementById('next-button').style.display = 'flex';

    buttonNextAction = startMainQuestion;      
}
function startMainQuestion () 
{
    document.getElementById('next-button').style.display = 'none';

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
    document.getElementById('next-button').style.display = 'flex';

    if (state == 1) //wrong answer
    {

    }
    else if (state == 0) //right answer
    {
        updatePlayerScore(currentPlayerScore + 100, elemGainScore, elemPlayerScore);
        playSound("sfx-success-01");
    }

    elemAnswerMainCont.style.display = 'flex';

    //set image of character
    var characterIndex = currentQuestion.textsAnswer[option].character;
    charactersAnswerStyles.forEach(s => elemAnswerMainCharacter.classList.remove(s));
    elemAnswerMainCharacter.offsetHeight;
    elemAnswerMainCharacter.classList.add(charactersAnswerStyles[characterIndex]);
    elemAnswerMainCharacterIMG.src = charactersAvatars[characterIndex];

    //set sides and textbox
    if (option == 0) 
    {
        elemAnswerMainCharacter.style.removeProperty('left');
        elemAnswerMainCharacter.style.right = '-2%';
        elemAnswerMainBubbleSpace.style.removeProperty('right');
        elemAnswerMainBubbleSpace.style.left = '6%';
        elemAnswerMainBubbleSpace.style.alignItems = 'flex-end';
    }
    else
    {
        elemAnswerMainCharacter.style.removeProperty('right');
        elemAnswerMainCharacter.style.left = '-2%';
        elemAnswerMainBubbleSpace.style.removeProperty('left');
        elemAnswerMainBubbleSpace.style.right = '6%'; 
        elemAnswerMainBubbleSpace.style.alignItems = 'flex-start';      
    }

    elemAnswerMainBubble.style.backgroundColor = 'var(--color-white)';
    elemAnswerMainBubbleArrow.src = option == 0 ? 
    'assets/text-box-bottom-white-right.svg' : 'assets/text-box-bottom-white-left.svg';
    elemAnswerMainBubbleArrowWrapper.style = option == 0 ? 'right: var(--round-corners)' : 'left: var(--round-corners)';

    elemAnswerMainButtonsClone.style.display = 'flex';
    //elemMultipleChoiceCont.style.display = 'none';

    document.getElementById('overlay-buttons').style.display = 'flex';
    var optionsClone = document.querySelectorAll(`#question-buttons-clone .option`);
    elemAnswerMainButtonsClone.style.flexDirection = option == 0 ? 'row' : 'row-reverse';
    optionsClone[0].style.display = option == 0 ? 'flex' : 'none';
    optionsClone[1].style.display = option == 1 ? 'flex' : 'none';

    show(elemAnswerMainBubble.parentElement);

    new Dialogue(elemAnswerMainText, currentQuestion.textsAnswer[option].text);

    multipleChoiceDisabled = true;
    questionOptionSelected = option;
    questionState++;

    setTimeout(function() 
    { 
        buttonNextAction = endMainQuestion;
    }, 
    1000);    
}

function endMainQuestion () 
{ 
    showSubQuestion(); 
}

function showSubQuestion () 
{
    document.getElementById('next-button').style.display = 'none';
    multipleChoiceDisabled = false;
    document.getElementById('overlay-buttons').style.display = 'none';
    elemAnswerMainCont.style.display = 'none';    
    document.getElementById('answer-sticker').style.display = 'none';

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
    document.getElementById('next-button').style.display = 'flex';

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
        updatePlayerScore(currentPlayerScore + 30, elemGainScore, elemPlayerScore);

        currentQuestion.subQuestions[questionOptionSelected].markCorrect(option, true);

        // elemAnimationAnswer.style.backgroundColor = 'green';
        // elemAnimationAnswer.querySelector('p').innerHTML = "BIEN HECHO!";
        // playAnimation(elemAnimationAnswer, 2);
    }

    multipleChoiceDisabled = true;
    questionState++;

    elemAnswerMainCont.style.display = 'flex';

    elemAnswerMainCharacter.classList.remove('full-body');
    elemAnswerMainBubbleSpace.classList.remove('final-message');

    if (option == 0) 
    {
        elemAnswerMainCharacter.style.removeProperty('left');
        elemAnswerMainCharacter.style.right = '-2%';
        elemAnswerMainBubbleSpace.style.removeProperty('right');
        elemAnswerMainBubbleSpace.style.left = '6%';
        elemAnswerMainBubbleSpace.style.alignItems = 'flex-end';
    }
    else
    {   
        elemAnswerMainCharacter.style.removeProperty('right');
        elemAnswerMainCharacter.style.left = '-2%';
        elemAnswerMainBubbleSpace.style.removeProperty('left');
        elemAnswerMainBubbleSpace.style.right = '6%';
        elemAnswerMainBubbleSpace.style.alignItems = 'flex-start';
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
         buttonNextAction = endSubQuestion;
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
}

function endLevel () 
{
    multipleChoiceDisabled = true;

    elemAnswerMainCont.style.display = 'flex';

    elemAnswerMainCharacter.classList.add('full-body');
    elemAnswerMainBubbleSpace.classList.add('final-message');

    document.getElementById('next-button').style.display = 'flex';
    document.getElementById('answer-sticker').style.display = 'flex';
    document.querySelector('#answer-sticker img').src = currentQuestion.correctAnswer == 0 ? 'assets/sticker-fake.svg' : 'assets/sticker-legit.svg';

    elemAnswerMainCharacter.style.removeProperty('right');
    elemAnswerMainCharacter.style.left = '-2%';
    elemAnswerMainBubbleSpace.style.removeProperty('left');
    elemAnswerMainBubbleSpace.style.right = '6%';
    elemAnswerMainBubbleSpace.style.alignItems = 'flex-start';

    elemAnswerMainBubble.style.backgroundColor = 'var(--color-white)';
    elemAnswerMainBubbleArrow.src = 'assets/text-box-bottom-white-left.svg';
    elemAnswerMainBubbleArrowWrapper.style = 'left: var(--round-corners)';

    elemAnswerMainButtonsClone.style.display = 'none';

    //elemSubQuestionCont.style.height = '73%';

    show(elemAnswerMainBubble.parentElement);

    new Dialogue(elemAnswerMainText, currentQuestion.finalMessage[questionOptionSelected]);

    setTimeout(function() 
    { 
        buttonNextAction = endLevelScore;
    }, 
    1000); 
}

function endLevelScore () 
{
    var endGame = currentQuestionsAmount >= levelsAmount;

    setView('end-level-screen');

    document.getElementById('next-button').style.display = 'none';
    document.getElementById('home-button-overlay').style.display = 'none';

    elemFinalPlayerScore.innerHTML = String(currentPlayerScore).padStart(3, "0");
    show(elemFinalCharacterPortrait)
    show(elemFinalCharacterBubble);

    new Dialogue(elemFinalCharacterText, "Increíble pero cierto!");

    var popUpScore = document.querySelector('.end-level-screen .gainScore');
    var scoreElement = document.querySelector('.end-level-screen .final-score p')
    updatePlayerScore(currentPlayerScore + 50, popUpScore, scoreElement);

    playSound("sfx-success-01");

    setTimeout(function() 
    {           
        if (endGame) 
            document.getElementById('home-button-overlay').style.display = 'flex';
        else 
        {
            document.getElementById('next-button').style.display = 'flex';
            buttonNextAction = newQuestion;
        }
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

function onClickButtonPlay () {
    if (currentView == 0)
        startGame();
}
let buttonNextAction = null;
function onClickButtonNext () 
{
    console.log("button next");

    if (!buttonNextAction) return;
    const fn = buttonNextAction;
    buttonNextAction = null;
    fn();
}
function onClickButtonCredits () {
    document.getElementById('credits-screen-main').style.display = "flex";
}
function onClickButtonCloseCredits () {
    document.getElementById('credits-screen-main').style.display = "none";
}
function onClickButtonSettings () {
    document.getElementById('settings-screen-main').style.display = "flex";
}
function onClickButtonCloseSettings () {
    document.getElementById('settings-screen-main').style.display = "none";
}
function onToggleMusic (enabled) 
{
    musicEnabled = enabled; 
    var music = document.getElementById("bgMusic");
    if (musicEnabled) 
    {
      music.play();
    } else {
      music.pause();
    }
}
function onToggleSound (enabled) 
{
    soundEnabled = enabled; 
}
function playSound (sound) 
{
    if (!soundEnabled) return;

    var s = document.getElementById(sound);
    s.currentTime = 0;
    s.play();
}
function onClickButtonReturnToHome () 
{
    resetGame();
}

function resetGame () 
{
    questionState = -1;
    questionOptionSelected = -1;
    currentView = 0;

    currentQuestion;
    currentQuestionsAmount = 0;
    currentPlayerScore = 0;

    buttonNextAction = null;

    updateSubscribers = [];

    document.getElementById('credits-screen-main').style.display = "none";
    document.getElementById('settings-screen-main').style.display = "none";

    document.getElementById('next-button').style.display = 'none';
    document.getElementById('home-button-overlay').style.display = 'none';

    setView('titleScreen');
}

var updatePlayerScore_currentT = 0;
var updatePlayerScore_currentTN = 0;
var updatePlayerScore_startValue = 0;
var updatePlayerScore_targetScore = null;
function updatePlayerScore (newValue, targetPopUp, targetScore) 
{
    updatePlayerScore_currentT = 0;
    updatePlayerScore_startValue = currentPlayerScore;
    updatePlayerScore_targetScore = targetScore;

    currentPlayerScore = newValue;
    var diff = currentPlayerScore - updatePlayerScore_startValue;

    var points = targetPopUp.querySelector('p'); //elemGainScore.querySelector (p)
    points.innerHTML = "+" + diff;

    showOneShot(targetPopUp, 2.5);

    subscribe(_updatePlayerScore);
} 
function _updatePlayerScore (deltaTime)
{
    updatePlayerScore_currentT += deltaTime;
    updatePlayerScore_currentTN = clamp01(updatePlayerScore_currentT);

    var val = Math.floor(lerp(updatePlayerScore_startValue, currentPlayerScore, updatePlayerScore_currentTN));
    updatePlayerScore_targetScore.innerHTML = String(val).padStart(3, "0"); //elem player score

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
