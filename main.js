//Create a function that takes the string representing the expression that the user made and build an array of tokens. 
//Create a parser that validates the array of tokens is part of the CFG
//import Token from './Token.js';
const Token = require("./Token.js");

function peek(stack) {
    return stack[stack.length - 1];
}

//Perhaps use peek() function instead of operatorStack[operatorStack.length - 1]
function shuntingYardAlgorithm(tokens) {
    var output = [];
    var operatorStack = [];
    for(var i = 0; i < tokens.length; i++) {
        if(tokens[i].getType() == "number")
            output.push(tokens[i]);
        else if(tokens[i].getType() == "operator") {
            if(operatorStack.length > 0) {
                while(operatorStack[operatorStack.length - 1].getLexeme() != "(" && (operatorStack[operatorStack.length - 1].getPrecedence() > tokens[i].getPrecedence()) || (operatorStack[operatorStack.length - 1].getPrecedence() == tokens[i].getPrecedence() && tokens[i].getleftAssociativity())) { //check this condition
                    output.push(operatorStack.pop());
                    if(operatorStack.length == 0) {
                        break;
                    }
                }
            }
            operatorStack.push(tokens[i]);
        }
        else if(tokens[i].getLexeme() == "(")
            operatorStack.push(tokens[i]);
        else if(tokens[i].getLexeme() == ")") {
            while(operatorStack[operatorStack.length - 1].getLexeme() != "(") {
                output.push(operatorStack.pop());
            } 
            operatorStack.pop();
            //Check "function" type token here. Ex: sin(x) log(x) ln(x) x!
        }
    }
    while(operatorStack.length > 0) {
        //console.log(operatorStack[operatorStack.length - 1].getLexeme());
        output.push(operatorStack.pop());
    }
    return output;
}

function evaluateRPN(expression) { //expression is an array of tokens in RPN
    if(expression.length == 1) //there are no operators in the expression and there is only one number
        return expression[0];
    //find the first operator, evaluate it wiht the left two most number tokens in place and then return the new expression
    var evaluatedExpression = []
    var i = 0;
    while(expression[i].getType() != "operator") {
        evaluatedExpression.push(expression[i]);
        i++;
    }

    var value;
    switch(expression[i].getLexeme()) {
        case "^":
            value = parseFloat(expression[i - 2].getLexeme()) ** parseFloat(expression[i - 1].getLexeme());
            break;
        case "*":
            value = parseFloat(expression[i - 2].getLexeme()) * parseFloat(expression[i - 1].getLexeme());
            break;
        case "/":
            value = parseFloat(expression[i - 2].getLexeme()) / parseFloat(expression[i - 1].getLexeme());
            break;
        case "+":
            value = parseFloat(expression[i - 2].getLexeme()) + parseFloat(expression[i - 1].getLexeme());
            break;
        case "-":
            value = parseFloat(expression[i - 2].getLexeme()) - parseFloat(expression[i - 1].getLexeme());
            break;
    }
    evaluatedExpression.pop()
    evaluatedExpression.pop()
    evaluatedExpression.push(new Token(value.toString()))
    i++;
    
    //Add the remainign tokens after the first operator to the output
    while(i < expression.length) {
        evaluatedExpression.push(expression[i]);
        i++;  
    }

    return evaluateRPN(evaluatedExpression);
}

//Evaluates the equation at a specified x value
//Ex: if the equation is 2/(x^2) then evaluating it at x = 3 returns 0.22222
function evaluateEquation(expression, x) {
    //Loops through the expression array and replaces the "x" tokens withe the value inputed for x
    for(var i = 0; i < expression.length; i++) {
        if(expression[i].getLexeme() == "x")
            expression[i].setLexeme(x.toString());
    }
    return evaluateRPN(expression);
}
//---------------------------------------------
var expression = [new Token("3"), new Token("+"), new Token("4"), new Token("*"), new Token("2"), new Token("/"), new Token("("), new Token("1"), new Token("-"), new Token("5"), new Token(")"), new Token("^"), new Token("2"), new Token("^"), new Token("3")];

var rpn = shuntingYardAlgorithm(expression);
console.log(evaluateRPN(rpn).getLexeme());

var equation = [new Token("x"), new Token("^"), new Token("2")];
console.log(evaluateEquation(shuntingYardAlgorithm(equation), 4).getLexeme());
