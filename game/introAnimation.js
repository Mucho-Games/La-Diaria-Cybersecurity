var elemDialogueText = [];
var elemLines = [];

var introAnimationCurrentLineIndex = 0;
var introAnimationCurrentDialogue;
var introAnimationTime = 0;
var introAnimationPlaying = false;
var dialogueTexts = [];
var characters = [];
var linesShown = [];

function showIntroAnimation (texts, char) 
{
	setView('introAnimation');

	elemDialogueText = document.querySelectorAll('.introAnimation .character-bubble p');
	elemLines = document.querySelectorAll('.introAnimation .line');

	for (var i = elemLines.length - 1; i >= 0; i--) {
		elemLines[i].style.display = 'none';
	}

	characters.length = 0;
	for (var i = 0; i < char.length; i++) {
		characters.push(char[i]);
	}

	dialogueTexts.length = 0;
	for (var i = 0; i < texts.length; i++) {
		dialogueTexts.push(texts[i]);
	}

	linesShown.length = 0;
	for (var i = 0; i < texts.length; i++) {
		elemLines[i].style.display = 'none';
		linesShown.push(false);
	}

	introAnimationPlaying = true;
	introAnimationTime = 0;

	introAnimationCurrentLineIndex = 0;

	subscribe(introAnimation)
}
function introAnimation (deltaTime, elapsedTime) 
{
	if (introAnimationCurrentLineIndex < linesShown.length) 
	{
		if (!linesShown[introAnimationCurrentLineIndex]) 
		{
			introAnimationCurrentDialogue = showLine(introAnimationCurrentLineIndex);
		}
		else if (!introAnimationCurrentDialogue.writing) 
		{
			introAnimationTime += deltaTime;
			if (introAnimationTime > 1) 
			{
				introAnimationCurrentLineIndex++;
				introAnimationTime = 0;
			}
		}
	}
	else 
	{
		introAnimationTime += deltaTime;
		if (introAnimationTime > 0.5) 
		{
			unsubscribe(introAnimation);
			introAnimationPlaying = false;
		}
	}
}
function showLine (index) 
{
	console.log(elemLines[index]);
	var dialogue = new Dialogue(elemDialogueText[index], dialogueTexts[index]);
	elemLines[index].style.display = 'flex';
	var bubble = elemLines[index].querySelector('.character-bubble-space');
	var portrait = elemLines[index].querySelector('.character-portrait');
	var portraitIMG = elemLines[index].querySelector('.character-portrait img');

	var characterIndex = characters[index];
	portraitIMG.src = charactersAvatars[characterIndex];
	charactersAvatarsStyles.forEach(s => portrait.classList.remove(s));
	portrait.offsetHeight;
  	portrait.classList.add(charactersAvatarsStyles[characterIndex]);

	show(bubble);
	show(portrait);
	linesShown[index] = true;

	return dialogue;
}
class Dialogue 
{
    constructor(elem, text) 
    {
        this.elem = elem;
        this.text = text;

        this.time = 0;
        this.writingSpeed = 0.005;
        this.currentText = "";
        this.currentIndex = 0;
        this.sound = 0;

        this.writeDialogue = this.writeDialogue.bind(this);

        this.writing = true;

        subscribe(this.writeDialogue);
        console.log("starting dialogue on element: " + this.elem);
    }

    writeDialogue(deltaTime, elapsedTime) 
    {
        this.time += deltaTime;
        
        if (this.time > this.writingSpeed) 
        {
        	if (this.text[this.currentIndex] == '<')
        	{
        		do {
        			this.currentText += this.text[this.currentIndex];
            		this.currentIndex++;
        		} while(this.text[this.currentIndex] != '>')
        	}
        	else
        	{
	            this.currentText += this.text[this.currentIndex];
	            this.currentIndex++;
        	}

        	this.sound++;
        	if (this.sound >= 3) 
        	{
        		playSound('sfx-dialogue');
        		this.sound = 0;
        	}

            this.time -= this.writingSpeed;

            this.elem.innerHTML = this.currentText;
        }

        if (this.currentIndex === this.text.length) 
        {
        	this.writing = false;
            unsubscribe(this.writeDialogue);
        }
    }
}