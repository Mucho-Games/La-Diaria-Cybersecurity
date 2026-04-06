var elemProfilePic;
var elemUsername;
var elemUsernameURL;
var elemImage;
var elemImageFootNote;
var elemNewsHeader;
var elemNewsBody;
var elemContentImage;
var elemContentTypeA;
var elemContentTypeB;

class QuestionTypeA 
{
    constructor(intro, profilePic, username, usernameURL, image, footNote, header, body, correctOption, textsAnswer, subQuestions, finalMessage) 
    {
    	this.intro = intro;

    	this.profilePic = profilePic;
    	this.username = username;
    	this.usernameURL = usernameURL;
    	this.image = image;
    	this.footNote = footNote;
    	this.header = header;
    	this.body = body;

    	this.correctAnswer = correctOption;
    	this.textsAnswer = textsAnswer;
    	this.subQuestions = subQuestions;
    	this.finalMessage = finalMessage;
    }

    getDOMElements () 
	{
		elemContentTypeA = document.querySelector('#question-type-a .question-content-type-a');
		elemContentTypeB = document.querySelector('#question-type-a	.question-content-type-b');

		elemProfilePic = document.querySelector('#question-type-a .question-header img');
		elemUsername = document.querySelector('#question-type-a .question-profile h3');
		elemUsernameURL = document.querySelector('#question-type-a .question-profile p');
		elemImage = document.querySelector('#question-type-a .question-image img');
		elemImageFootNote = document.querySelector('#question-type-a .question-image p');
		elemNewsHeader = document.querySelector('#question-type-a .question-body h3');
		elemNewsBody = document.querySelector('#question-type-a .question-body p');
	}

	populate () 
	{
		elemContentTypeA.style.display = 'flex';
		elemContentTypeB.style.display = 'none';

		elemProfilePic.src = questionsImgDirectory + this.profilePic + '.png';
		elemUsername.innerHTML = this.username;
		elemUsernameURL.innerHTML = this.usernameURL;
		elemImage.src = questionsImgDirectory + this.image + '.png';
		elemImageFootNote.innerHTML = this.footNote;
		elemNewsHeader.innerHTML = this.header;
		elemNewsBody.innerHTML = this.body;
	}
}

class QuestionTypeB 
{
    constructor(intro, profilePic, username, usernameURL, contentImage, correctOption, textsAnswer, subQuestions, finalMessage) 
    {
    	this.intro = intro;

    	this.profilePic = profilePic;
    	this.username = username;
    	this.usernameURL = usernameURL;
    	this.contentImage = contentImage;

    	this.correctAnswer = correctOption;
    	this.textsAnswer = textsAnswer;
    	this.subQuestions = subQuestions;
    	this.finalMessage = finalMessage;
    }

    getDOMElements () 
	{
		elemContentTypeA = document.querySelector('#question-type-a .question-content-type-a');
		elemContentTypeB = document.querySelector('#question-type-a	.question-content-type-b');

		elemProfilePic = document.querySelector('#question-type-a .question-header img');
		elemUsername = document.querySelector('#question-type-a .question-profile h3');
		elemUsernameURL = document.querySelector('#question-type-a .question-profile p');
		elemContentImage = document.querySelector('#question-type-a	.question-content-type-b img');
	}

	populate () 
	{
		elemContentTypeA.style.display = 'none';
		elemContentTypeB.style.display = 'flex';

		elemProfilePic.src = questionsImgDirectory + this.profilePic + '.png';
		elemUsername.innerHTML = this.username;
		elemUsernameURL.innerHTML = this.usernameURL;
		elemContentImage.src = questionsImgDirectory + this.contentImage + '.png';
	}
}


