var elemDialogueBoxDuck;
var elemDialogueBoxDog;
var elemDialogueBoxCat;

var elemDialogueText = [];

var elemCharactersLeft;
var elemCharactersRight;

var elemCharacterDuck;
var elemCharacterDog;
var elemCharacterCat;

var introAnimationTime = 0;
var introAnimationPlaying = false;
var dialogueTexts = [];


function showIntroAnimation () 
{
	setView('introAnimation');
	subscribe(introAnimation)

	var suffix = landscape ?  'landScape' : 'portrait';

	elemDialogueBoxDuck = document.getElementById('characterDialogueBoxDuck01-'+suffix);
	elemDialogueBoxDog = document.getElementById('characterDialogueBoxDog01-'+suffix);
	elemDialogueBoxCat = document.getElementById('characterDialogueBoxCat01-'+suffix);

	elemDialogueText = document.querySelectorAll('.introAnimation .'+suffix+ ' .characterDialogueBox p');

	elemCharactersLeft = document.getElementById('introCharactersLeft');
	elemCharactersRight = document.getElementById('introCharactersRight');

	elemCharacterDuck = document.getElementById('duck-'+suffix);
	elemCharacterDog = document.getElementById('dog-'+suffix);
	elemCharacterCat = document.getElementById('cat-'+suffix);

	for (var i = 0; i < elemDialogueText.length; i++) {
		dialogueTexts.push(elemDialogueText[i].innerHTML);
	}

	console.log(dialogueTexts);

	elemDialogueBoxDog.style.display = 'none';
	elemDialogueBoxCat.style.display = 'none';
	elemCharactersRight.style.display = 'none';
	elemCharacterCat.style.display = 'none';
	elemCharacterDog.style.display = 'none';

	introAnimationPlaying = true;
	introAnimationTime = 0;

	new Dialogue(elemDialogueText[0], dialogueTexts[0]);
}
function introAnimation (deltaTime) 
{
	introAnimationTime += deltaTime;

	if (introAnimationTime > 1.5 && elemDialogueBoxDog.style.display == 'none') 
	{
		elemDialogueBoxDog.style.display = 'flex';
		elemCharactersRight.style.display = 'flex';
		elemCharacterDog.style.display = 'flex';
		new Dialogue(elemDialogueText[1], dialogueTexts[1]);
	}
	if (introAnimationTime > 4 && elemDialogueBoxCat.style.display == 'none') 
	{
		elemDialogueBoxCat.style.display = 'flex';
		elemCharacterCat.style.display = 'flex';
		new Dialogue(elemDialogueText[2], dialogueTexts[2]);
	}
	if (introAnimationTime > 7) {
		unsubscribe(introAnimation);
		introAnimationPlaying = false;
	}
}

class Dialogue {
    constructor(elem, text) 
    {
        this.elem = elem;
        this.text = text;

        this.time = 0;
        this.writingSpeed = 0.005;
        this.currentText = "";
        this.currentIndex = 0;

        this.writeDialogue = this.writeDialogue.bind(this);

        subscribe(this.writeDialogue);
    }

    writeDialogue(deltaTime) 
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
            this.time -= this.writingSpeed;

            this.elem.innerHTML = this.currentText;
        }

        if (this.currentIndex === this.text.length) {
            unsubscribe(this.writeDialogue);
        }
    }
}