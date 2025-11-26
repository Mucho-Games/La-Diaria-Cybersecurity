var elemSubQuestionPopUp;
var elemSubQuestionHeader;
var elemSubQuestionOptions = [];

class SubQuestion 
{
    constructor(subQuestion, options, correctAnswer) 
    {
        this.subQuestion = subQuestion;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    getDOMElements () 
    {
        elemSubQuestionPopUp = document.getElementById('mulChoicePart2');
        elemSubQuestionHeader = document.getElementById('mulChoice2Question');
        elemSubQuestionOptions = document.querySelectorAll('.game > .option2 > p');
    }
    populate () 
    {
        elemSubQuestionHeader.innerHTML = this.subQuestion;

        for (var i = 0; i < elemSubQuestionOptions.length; i++) 
        {
            elemSubQuestionOptions[i].innerHTML = this.options[i];
        }
    }
}

