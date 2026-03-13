//GAME VARS
var questionState = -1;
var questionOptionSelected = -1;
var currentView = 0;

var questionsPool = [];
var currentQuestion;
var currentQuestionsAmount = 0;
var currentPlayerScore = 0;

var multipleChoiceDisabled = false;
var musicEnabled = true;
var soundEnabled = true; 

var abortController = new AbortController();

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

    questionsPool = [];
    for (var i = questionBank.length - 1; i >= 0; i--) {
        questionsPool.push(i);
    }

    elemPlayerScore.innerHTML = String(0).padStart(3, "0");
    elemPlayerLevelsAmount.innerHTML = "/" + String(levelsAmount).padStart(2, "0");

    coroutines.start(newQuestion);
}
function pickRandomQuestionIndex() {
    const randomIndex = Math.floor(Math.random() * questionsPool.length);
    return questionsPool.splice(randomIndex, 1)[0];
}
function* newQuestion () //coroutine
{
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('answer-sticker').style.display = 'none';
    elemAnswerMainCont.style.display = 'none';

    //currentQuestion = getRandomElement(questionBank);
    //currentQuestion = questionBank[currentQuestionsAmount];
    currentQuestion = questionBank[pickRandomQuestionIndex()];

    const introTexts = currentQuestion.intro.map(entry => entry.text);
    const introCharacters = currentQuestion.intro.map(entry => entry.character);

    showIntroAnimation(introTexts, introCharacters);

    while (introAnimationPlaying) yield;

    playSound("sfx-popUp-01");
    document.getElementById('next-button').style.display = 'flex';

    buttonNextAction = startMainQuestion;      
}
function startMainQuestion () 
{
    elemSubQuestionCont.style.display = 'none';
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('overlay-buttons').style.display = 'none';

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

function* answerQuestion (state, option, i)  //coroutine
{
    document.getElementById('next-button').style.display = 'none';

    if (i == 0) 
    {
        multipleChoiceDisabled = true;
        questionOptionSelected = option;
        questionState++;

        if (state == 1) //wrong answer
        {
            playSound("sfx-error");
        }
        else if (state == 0) //right answer
        {
            updatePlayerScore(currentPlayerScore + 100, elemGainScore, elemPlayerScore);
            playSound("sfx-success-01");
        }

        elemAnswerMainButtonsClone.style.display = 'flex';
        document.getElementById('overlay-buttons').style.display = 'flex';
        var optionsClone = document.querySelectorAll(`#question-buttons-clone .option`);
        elemAnswerMainButtonsClone.style.flexDirection = option == 0 ? 'row' : 'row-reverse';
        optionsClone[0].style.display = option == 0 ? 'flex' : 'none';
        optionsClone[1].style.display = option == 1 ? 'flex' : 'none';
    }

    console.log(questionOptionSelected);

    var rightSide = questionOptionSelected == 0;
    var dialogueAmount = currentQuestion.textsAnswer[option].length;
    var dialogueIndex = i;

    yield* characterTalk(currentQuestion.textsAnswer[option][dialogueIndex].text, currentQuestion.textsAnswer[option][dialogueIndex].character, false, rightSide);

    dialogueIndex += 1;

    yield waitSeconds(0.5);

    buttonNextAction = () => 
    {
        if (dialogueIndex < dialogueAmount) 
            coroutines.start(answerQuestion, state, option, dialogueIndex);
        else
            endMainQuestion();
    }

    document.getElementById('next-button').style.display = 'flex';
    playSound("sfx-popUp-01");
}

function* characterTalk (text, character, fullBody, rightSide) 
{
    let e_characterContainer = document.querySelector('#answer-animation-character');
    let e_characterImage = document.querySelector('#answer-animation-character img');
    let e_bubbleContainer = document.querySelector('#answerAnimation .character-bubble-space');
    let e_bubble = document.querySelector('#answerAnimation .character-bubble');
    let e_bubbleText = document.querySelector('#answerAnimation .character-bubble p');
    let e_bubbleArrow = document.querySelector('#answerAnimation .character-bubble .character-bubble-arrow-wrapper img');
    let e_bubbleArrowWrapper = document.querySelector('#answerAnimation .character-bubble .character-bubble-arrow-wrapper');

    elemAnswerMainCont.style.display = 'flex';

    if (fullBody) 
    {
        e_characterContainer.classList.add('full-body');
        e_bubbleContainer.classList.add('final-message');
    }
    else
    {
        e_characterContainer.classList.remove('full-body');
        e_bubbleContainer.classList.remove('final-message');
    }
    
    charactersAnswerStyles.forEach(s => e_characterContainer.classList.remove(s));
    e_characterContainer.offsetHeight;
    e_characterContainer.classList.add(charactersAnswerStyles[character]);
    e_characterImage.src = charactersAvatars[character];

    //set sides and textbox
    if (rightSide) 
    {
        e_characterContainer.style.removeProperty('left');
        e_characterContainer.style.right = '-2%';
        e_bubbleContainer.style.removeProperty('right');
        e_bubbleContainer.style.left = '6%';
        e_bubbleContainer.style.alignItems = 'flex-end';
    }
    else
    {
        e_characterContainer.style.removeProperty('right');
        e_characterContainer.style.left = '-2%';
        e_bubbleContainer.style.removeProperty('left');
        e_bubbleContainer.style.right = '6%'; 
        e_bubbleContainer.style.alignItems = 'flex-start';      
    }

    e_bubble.style.backgroundColor = 'var(--color-white)';
    e_bubbleArrow.src = rightSide ? 
    'assets/text-box-bottom-white-right.svg' : 'assets/text-box-bottom-white-left.svg';
    e_bubbleArrowWrapper.style = rightSide ? 'right: var(--round-corners)' : 'left: var(--round-corners)';

    hide(e_bubble.parentElement);

    yield waitSeconds(0.3);

    e_bubbleText.innerHTML = text;

    show(e_bubble.parentElement);

    yield waitSeconds(1);
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

    var subQuestionIndex = clampIndex(questionOptionSelected, currentQuestion.subQuestions);

    currentQuestion.subQuestions[subQuestionIndex].getDOMElements();
    currentQuestion.subQuestions[subQuestionIndex].populate();
    currentQuestion.subQuestions[subQuestionIndex].interactable(true);
}

function* answerSubQuestion (option, state, i)  //coroutine
{
    console.log(i);

    document.getElementById('next-button').style.display = 'none';
    var subQuestionIndex = clampIndex(questionOptionSelected, currentQuestion.subQuestions);

    if (i == 0) 
    {
        if (state == 1) //wrong answer
        {
            currentQuestion.subQuestions[subQuestionIndex].markWrong(option);

            for (var s = currentQuestion.subQuestions[subQuestionIndex].optionsValues.length - 1; s >= 0; s--) 
            {
                if (s == option) continue;

                if (currentQuestion.subQuestions[subQuestionIndex].optionsValues[s]) 
                {
                    currentQuestion.subQuestions[subQuestionIndex].markCorrect(s, false);
                }
            }

            playSound("sfx-error");
        }
        else if (state == 0) //right answer
        {
            updatePlayerScore(currentPlayerScore + 30, elemGainScore, elemPlayerScore);
            playSound("sfx-success-01");

            currentQuestion.subQuestions[subQuestionIndex].markCorrect(option, true);
        }

        currentQuestion.subQuestions[subQuestionIndex].interactable(false);

        multipleChoiceDisabled = true;
        questionState++;

        yield waitSeconds(2);
    }

    elemAnswerMainButtonsClone.style.display = 'none';

    var rightSide = questionOptionSelected != 0;
    var dialogueAmount = currentQuestion.subQuestions[subQuestionIndex].message.length;
    var dialogueIndex = i;

    yield* characterTalk(currentQuestion.subQuestions[subQuestionIndex].message[i].text, currentQuestion.subQuestions[subQuestionIndex].message[i].character, false, rightSide);

    dialogueIndex += 1;

    yield waitSeconds(0.5);

    buttonNextAction = () => 
    {
        if (dialogueIndex < dialogueAmount) 
            coroutines.start(answerSubQuestion, option, state, dialogueIndex);
        else
            endSubQuestion();
    }

    document.getElementById('next-button').style.display = 'flex';
    playSound("sfx-popUp-01");
}
function endSubQuestion () 
{
    multipleChoiceDisabled = false;
    elemSubQuestionCont.style.display = 'none';

    if (questionState >= currentQuestion.subQuestions.length) 
    {
        coroutines.start(endLevel, 0);
    }
    else
    {
        showSubQuestion(questionState-1);
    }
}

function* endLevel (i) //coroutine
{
    document.getElementById('next-button').style.display = 'none';
    var finalMessageIndex = clampIndex(questionOptionSelected, currentQuestion.finalMessage);

    if (i == 0) 
    {        
        elemAnswerMainButtonsClone.style.display = 'none';

        multipleChoiceDisabled = true;

        document.querySelector('#answer-sticker img').src = currentQuestion.correctAnswer == 0 ? 'assets/sticker-fake.svg' : 'assets/sticker-legit.svg';
    }

    var dialogueAmount = currentQuestion.finalMessage[finalMessageIndex].length;
    var dialogueIndex = i;

    yield* characterTalk(currentQuestion.finalMessage[finalMessageIndex][dialogueIndex].text, currentQuestion.finalMessage[finalMessageIndex][dialogueIndex].character, true, false);

    dialogueIndex += 1;

    yield waitSeconds(0.5);

    if (dialogueIndex < dialogueAmount) 
    {
        buttonNextAction = () => { coroutines.start(endLevel, dialogueIndex); };
    }
    else
    {
        buttonNextAction = () => { coroutines.start(endLevelScore); };
        document.getElementById('answer-sticker').style.display = 'flex';
        playSound("sfx-sticker");
        yield waitSeconds(1.5);
    }    

    document.getElementById('next-button').style.display = 'flex';
    playSound("sfx-popUp-01");
}

function* endLevelScore () //coroutine
{
    let b_endGame = currentQuestionsAmount >= levelsAmount;

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

    yield waitSeconds(1);

    document.getElementById('next-button').style.display = 'flex';

    if (b_endGame)
        buttonNextAction = () => { coroutines.start(endGame, currentPlayerScore); };
    else
        buttonNextAction = () => { coroutines.start(newQuestion); };
}

function* endGame (finalScore) //coroutine
{
    setView('end-game-screen');

    document.getElementById('next-button').style.display = 'none';
    document.getElementById('home-button-overlay').style.display = 'none';

    let e_playerScore = document.querySelector('.end-game-screen .results .your-score .final-score p');
    let e_dialogueBubble = document.querySelector('.end-game-screen .character-bubble-space');
    let e_dialogueText = document.querySelector('.end-game-screen .character-bubble p');
    let e_meterPoint = document.querySelectorAll('.end-game-screen .score-meter > *');
    console.log(e_meterPoint);

    //100 for answering the main question ok, 
    //30 for answering the subquestion ok, 
    //50 for finishing the question.
    let i_maxPossibleScore = levelsAmount * (100 + 30 + 50); 
    //7 because the visual counter is divided in 7 parts
    let i_playerCompletionLevel = Math.min(Math.floor((finalScore / i_maxPossibleScore) * 7.0), 6);
    //0, 1 -> bad text
    //2, 3, 4 -> good text
    //5, 6 -> excelent text
    let s_finalDialogueText = 
    i_playerCompletionLevel <= 1 ? completionLevelsTexts[0] :
    i_playerCompletionLevel <= 4 ? completionLevelsTexts[1] :
    completionLevelsTexts[2];

    e_playerScore.innerHTML = String(finalScore).padStart(3, "0");

    //Update score meter
    //Remove old data - clear
    for (var i = 0; i < e_meterPoint.length; i++) 
    {
        e_meterPoint[i].classList.remove("selected");
        e_meterPoint[i].classList.remove("nearby");
    }
    //Assign new classes to meter
    e_meterPoint[i_playerCompletionLevel].classList.add("selected");  
    if (i_playerCompletionLevel + 1 < e_meterPoint.length)
        e_meterPoint[i_playerCompletionLevel+1].classList.add("nearby");
    if (i_playerCompletionLevel - 1 >= 0)
        e_meterPoint[i_playerCompletionLevel-1].classList.add("nearby");
    
    //show(elemFinalCharacterPortrait)
    show(e_dialogueBubble);

    new Dialogue(e_dialogueText, s_finalDialogueText);

    playSound("sfx-success-01");

    yield waitSeconds(1);
   
    document.getElementById('home-button-overlay').style.display = 'flex';
}

function onClickOption (option) 
{
    console.log("Clicked option: " + option);

    if (!currentQuestion || multipleChoiceDisabled) return;

    if (questionState == 0) //On main question
    {
        if (currentQuestion.correctAnswer == option) 
        {
            coroutines.start(answerQuestion, 0, option, 0);
        }
        else
        {
            coroutines.start(answerQuestion, 1, option, 0);
        }
    }
    else if (questionState > 0) //On second instance of question
    {
        var subQuestionIndex = clampIndex(questionOptionSelected, currentQuestion.subQuestions);

        if (currentQuestion.subQuestions[subQuestionIndex].optionsValues[option])
        {
            coroutines.start(answerSubQuestion, option, 0, 0);
        }
        else
        {
            coroutines.start(answerSubQuestion, option, 1, 0);
        }
    }
}

function onClickButtonPlay () 
{
    if (currentView == 0)
        startGame();

    if (musicEnabled) 
        document.getElementById("bgMusic").play();
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

    abortController.abort();
    abortController = new AbortController();
    coroutines.stopAll();

    document.getElementById('credits-screen-main').style.display = "none";
    document.getElementById('settings-screen-main').style.display = "none";

    document.getElementById('next-button').style.display = 'none';
    document.getElementById('home-button-overlay').style.display = 'none';

    setView('titleScreen');
}

var updatePlayerScore_currentT = 0;
var updatePlayerScore_currentTN = 0;
var updatePlayerScore_startValue = 0;
var updatePlayerScore_soundT = 0;
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
function _updatePlayerScore (deltaTime, elapsedTime)
{
    updatePlayerScore_currentT += deltaTime;
    updatePlayerScore_soundT += deltaTime;
    updatePlayerScore_currentTN = clamp01(updatePlayerScore_currentT);

    var val = Math.floor(lerp(updatePlayerScore_startValue, currentPlayerScore, updatePlayerScore_currentTN));
    updatePlayerScore_targetScore.innerHTML = String(val).padStart(3, "0"); //elem player score

    if (updatePlayerScore_currentTN >= 1) {
        unsubscribe(_updatePlayerScore);
    }

    if (updatePlayerScore_soundT > 0.1) {
        playSound("sfx-score");
        updatePlayerScore_soundT = 0;
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
function hide(elem)
{
    elem.classList.remove("show");
    elem.offsetHeight;

    elem.classList.add("hidden");
}