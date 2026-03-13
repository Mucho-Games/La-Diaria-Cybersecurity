var elemDialogueText = [];
var elemLines = [];

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

		let bubble = elemLines[i].querySelector('.character-bubble-space');
		let portrait = elemLines[i].querySelector('.character-portrait');

		hide(bubble);
		hide(portrait);
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

	coroutines.start(introAnimation)
}
function* introAnimation () 
{
	for (var i = 0; i < dialogueTexts.length; i++) 
	{
		yield* showLine(i);
		yield waitSeconds(2);
	}

	introAnimationPlaying = false;
}
function* showLine (index) 
{
	let bubble = elemLines[index].querySelector('.character-bubble-space');
	let portrait = elemLines[index].querySelector('.character-portrait');
	let portraitIMG = elemLines[index].querySelector('.character-portrait img');

	let characterIndex = characters[index];
	portraitIMG.src = charactersAvatars[characterIndex];
	charactersAvatarsStyles.forEach(s => portrait.classList.remove(s));
	portrait.offsetHeight;
  	portrait.classList.add(charactersAvatarsStyles[characterIndex]);

	elemLines[index].style.display = 'flex';
	show(portrait);

	yield waitSeconds(0.3);

	elemDialogueText[index].innerHTML = dialogueTexts[index];
	show(bubble);

	playSound('sfx-dialogue');

	linesShown[index] = true;
}
class Dialogue 
{
    constructor(elem, text) 
    {
        this.elem = elem;
        this.text = text;

        this.time = 0;
        this.writingSpeed = 0.005;
        this.charactersPerTick = 1000;
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
        	var currentTickCharacters = 0;

        	while(currentTickCharacters < this.charactersPerTick && this.currentIndex < this.text.length) 
        	{
	        	if (this.text[this.currentIndex] == '<')
	        	{
	        		do {
	        			this.currentText += this.text[this.currentIndex];
	            		this.currentIndex++;
	            		currentTickCharacters++;
	        		} while(this.text[this.currentIndex] != '>')
	        	}
	        	else
	        	{
		            this.currentText += this.text[this.currentIndex];
		            this.currentIndex++;
		            currentTickCharacters++;
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
        }

        if (this.currentIndex === this.text.length) 
        {
        	this.writing = false;
            unsubscribe(this.writeDialogue);
        }
    }
}