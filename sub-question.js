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
        elemSubQuestionHeader = document.querySelector('#subQuestions-header h3');
        elemSubQuestionOptions = document.querySelectorAll('.game > .option2 > p');
    }
    populate () 
    {
        elemSubQuestionHeader.innerHTML = this.subQuestion;

        for (var i = 0; i < elemSubQuestionOptions.length; i++) 
        {
            elemSubQuestionOptions[i].innerHTML = i +". " + this.options[i];
        }
    }
}

