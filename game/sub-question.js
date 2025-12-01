var elemSubQuestionHeader;
var elemSubQuestionOptions = [];
var elemSubQuestionOptionsContent = [];
var elemSubQuestionOptionsWrongCircle = [];

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
        elemSubQuestionOptions = document.querySelectorAll('.option2');
        elemSubQuestionOptionsContent = document.querySelectorAll('.option2 p');
        elemSubQuestionOptionsWrongCircle = document.querySelectorAll('.option2 .wrong-answer-circle');
    }
    populate () 
    {
        elemSubQuestionHeader.innerHTML = this.subQuestion;

        for (var i = 0; i < elemSubQuestionOptionsContent.length; i++) 
        {
            elemSubQuestionOptionsContent[i].innerHTML = [i + 1] +". " + this.options[i];

            elemSubQuestionOptionsWrongCircle[i].style.display = 'none';
            elemSubQuestionOptions[i].style.boxShadow = '0 0 0 0';
            elemSubQuestionOptions[i].style.backgroundColor = 'var(--color-white)';
        }

    }
    markWrong (index) 
    {
        elemSubQuestionOptionsWrongCircle[index].style.display = 'flex';
        elemSubQuestionOptions[index].style.boxShadow = '0 0 0 0.2em var(--color-orange)';
        elemSubQuestionOptions[index].style.backgroundColor = 'var(--color-orange)';
    }
    markCorrect (index, selected)
    {
        if (selected)
            elemSubQuestionOptions[index].style.backgroundColor = 'var(--color-green)';
        else
        {
            elemSubQuestionOptions[index].style.boxShadow = '0 0 0 0.2em var(--color-green)';
        }
    }
}

