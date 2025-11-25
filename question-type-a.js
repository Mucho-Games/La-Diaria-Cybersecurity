var elemProfilePic;
var elemUsername;
var elemUsernameURL;
var elemImage;
var elemImageFootNote;
var elemNewsHeader;
var elemNewsBody;

class QuestionTypeA {
    constructor(profilePic, username, usernameURL, image, footNote, header, body) {
    	this.profilePic = profilePic;
    	this.username = username;
    	this.usernameURL = usernameURL;
    	this.image = image;
    	this.footNote = footNote;
    	this.header = header;
    	this.body = body;
    }
}

function getDOMElements () 
{
	elemProfilePic = document.querySelector('#question-type-a .question-header img');
	elemUsername = document.querySelector('#question-type-a .question-profile h3');
	elemUsernameURL = document.querySelector('#question-type-a .question-profile p');
	elemImage = document.querySelector('#question-type-a .question-image img');
	elemImageFootNote = document.querySelector('#question-type-a .question-image p');
	elemNewsHeader = document.querySelector('#question-type-a .question-body h3');
	elemNewsBody = document.querySelector('#question-type-a .question-body p');
}
function populate (question) 
{
	elemProfilePic.src = questionsImgDirectory + question.profilePic + '.jpg';
	elemUsername.innerHTML = question.username;
	elemUsernameURL.innerHTML = question.usernameURL;
	elemImage.src = questionsImgDirectory + question.image + '.jpg';
	elemImageFootNote.innerHTML = question.footNote;
	elemNewsHeader.innerHTML = question.header;
	elemNewsBody.innerHTML = question.body;
}