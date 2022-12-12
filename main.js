//Create a function that takes the string representing the expression that the user made and build an array of tokens. 
//Create a parser that validates the array of tokens is part of the CFG
//import Token from './Token.js';
//const Token = require("./Token.js");
//const Vector = require("./Vector.js");
//import { Token } from './Vector.js';
import { Token } from '/Token.js'
import { Vector } from './Vector.js'

function peek(stack) {
    return stack[stack.length - 1];
}

function shuntingYardAlgorithm(tokens) {
    var output = [];
    var operatorStack = [];
    for(var i = 0; i < tokens.length; i++) {
        if(tokens[i].getType() == "number")
            output.push(tokens[i]);
        else if(tokens[i].getType() == "function")
            operatorStack.push(tokens[i]);
        else if(tokens[i].getType() == "operator") {
            if(operatorStack.length > 0) {
                while(peek(operatorStack).getLexeme() != "(" && (peek(operatorStack).getPrecedence() > tokens[i].getPrecedence()) || (peek(operatorStack).getPrecedence() == tokens[i].getPrecedence() && tokens[i].getleftAssociativity())) { //check this condition
                    output.push(operatorStack.pop());
                    if(operatorStack.length == 0)
                        break;
                }
            }
            operatorStack.push(tokens[i]);
        }
        else if(tokens[i].getLexeme() == "(")
            operatorStack.push(tokens[i]);
        else if(tokens[i].getLexeme() == ")") {
            while(peek(operatorStack).getLexeme() != "(") {
                output.push(operatorStack.pop());
            } 
            operatorStack.pop();
            //Check "function" type token here. Ex: sin(x) log(x) ln(x) x!
            if(operatorStack.length > 0) {
                if(peek(operatorStack).getType() == "function") {
                    output.push(operatorStack.pop());
                }
            }
        }
    }
    while(operatorStack.length > 0) {
        output.push(operatorStack.pop());
    }
    return output;
}

//returns the token of the evaluated RPN
function evaluateRPN(expression) { //expression is an array of tokens in RPN
    if(expression.length == 1) //there are no operators in the expression and there is only one number
        return expression[0];
    //find the first operator, evaluate it with the left two most number tokens in place and then return the new expression
    var evaluatedExpression = []
    var i = 0;
    while(expression[i].getType() != "operator" && expression[i].getType() != "function") {
        evaluatedExpression.push(expression[i]);
        i++;
    }

    var value;
    switch(expression[i].getLexeme()) {
        case "^":
            value = parseFloat(expression[i - 2].getLexeme()) ** parseFloat(expression[i - 1].getLexeme());
            evaluatedExpression.pop()
            break;
        case "*":
            value = parseFloat(expression[i - 2].getLexeme()) * parseFloat(expression[i - 1].getLexeme());
            evaluatedExpression.pop()
            break;
        case "/":
            value = parseFloat(expression[i - 2].getLexeme()) / parseFloat(expression[i - 1].getLexeme());
            evaluatedExpression.pop()
            break;
        case "+":
            value = parseFloat(expression[i - 2].getLexeme()) + parseFloat(expression[i - 1].getLexeme());
            evaluatedExpression.pop()
            break;
        case "-":
            value = parseFloat(expression[i - 2].getLexeme()) - parseFloat(expression[i - 1].getLexeme());
            evaluatedExpression.pop()
            break;
        case "sin":
            value =  Math.sin(parseFloat(expression[i - 1].getLexeme())); //Takes in radians as input
            break;
        case "cos":
            value =  Math.cos(parseFloat(expression[i - 1].getLexeme())); 
            break;
        case "tan":
            value =  Math.tan(parseFloat(expression[i - 1].getLexeme()));
            break;
        case "csc":
            value =  1 / Math.sin(parseFloat(expression[i - 1].getLexeme()));
            break;
        case "sec":
            value =  1 / Math.cos(parseFloat(expression[i - 1].getLexeme()));
            break;
        case "cot":
            value =  1 / Math.tan(parseFloat(expression[i - 1].getLexeme()));
            break;
        case "log":
            value =  Math.log10(parseFloat(expression[i - 1].getLexeme()));
            break;
        case "ln":
            value =  Math.log(parseFloat(expression[i - 1].getLexeme())); //Math.log is ln
            break;
    }
    evaluatedExpression.pop()
    evaluatedExpression.push(new Token(value.toString()))
    i++;
    
    //Add the remaining tokens after the first operator to the output
    while(i < expression.length) {
        evaluatedExpression.push(expression[i]);
        i++;  
    }

    return evaluateRPN(evaluatedExpression);
}

//Be careful with inputs that are no tin the domain (need to catch that and throw some error in this function
//Evaluates the equation at a specified x value
//Ex: if the equation is 2/(x^2) then evaluating it at x = 3 returns 0.22222
function evaluateEquation(expression, x) { // WE ARE ACCIDRNTLY CHANGING THE Xs PERMANENTLY
    //Loops through the expression array and replaces the "x" tokens with the value inputed for x
    var replacedExpression = [];
    for(let i = 0; i < expression.length; i++)
        replacedExpression.push(expression[i].copy()); // Need a copy constructor for 
    for(let i = 0; i < replacedExpression.length; i++) {
        if(replacedExpression[i].getLexeme() == "x")
            replacedExpression[i].setLexeme(x.toString());
    }
    return evaluateRPN(replacedExpression).getLexeme();
}
//---------------------------------------------
//var expression = [new Token("3"), new Token("+"), new Token("4"), new Token("*"), new Token("2"), new Token("/"), new Token("("), new Token("1"), new Token("-"), new Token("5"), new Token(")"), new Token("^"), new Token("2"), new Token("^"), new Token("3")];
//var equation = [new Token("x"), new Token("^"), new Token("2")];
//var equation = [new Token("4"), new Token("+"), new Token("log"), new Token("("), new Token("x"), new Token(")")];
//var equation = [new Token("sin"), new Token("x"), new Token("^"), new Token("2")];
//document.body.innerHTML = '<h1>' + evaluateEquation(shuntingYardAlgorithm(equation), 3.1415) + '</h1>';

function applyFunction(vector, pdaEquation) { //f is in not PDA notation
    var appliedVector = [];
    for(var i = 0; i < vector.dimensions(); i++)
        appliedVector.push(evaluateEquation(pdaEquation, vector.getComponenet(i)));
    return new Vector(appliedVector);
}

//Pre-condition: x.length == y.length, f is a valid math equation in infix notation (list of tokens)
function calculateLeadingCoefficient(x, y, f) {
    var pdaEquation = shuntingYardAlgorithm(f);
    var xValues = new Vector(x);
    var yValues = new Vector(y);
    var appliedFunctionValues = applyFunction(xValues, pdaEquation);
    return appliedFunctionValues.dotProduct(yValues) / appliedFunctionValues.magnitude() ** 2; //Formula is correct
}

function calculateCoefficientOfDetermination(x, y, f) {
    
}

function calculateRegressionStats() {

}

var x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var y = [3, 6, 2, 8, 16, 3, 7, 9, 12, 7];
var equation = [new Token("x"), new Token("^"), new Token("3")];

document.body.innerHTML = '<h1>' + calculateLeadingCoefficient(x, y, equation) + '</h1>';


