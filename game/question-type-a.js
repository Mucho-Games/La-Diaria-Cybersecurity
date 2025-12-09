var elemProfilePic;
var elemUsername;
var elemUsernameURL;
var elemImage;
var elemImageFootNote;
var elemNewsHeader;
var elemNewsBody;

class QuestionTypeA 
{
    constructor(profilePic, username, usernameURL, image, footNote, header, body, correctOption, textsAnswer, subQuestions, finalMessage) 
    {
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
		elemProfilePic.src = questionsImgDirectory + this.profilePic + '.jpg';
		elemUsername.innerHTML = this.username;
		elemUsernameURL.innerHTML = this.usernameURL;
		elemImage.src = questionsImgDirectory + this.image + '.jpg';
		elemImageFootNote.innerHTML = this.footNote;
		elemNewsHeader.innerHTML = this.header;
		elemNewsBody.innerHTML = this.body;
	}
}


