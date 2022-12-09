//Create a function that takes the string representing the expression that the user made and build an array of tokens. 
//Create a parser that validates the array of tokens is part of the CFG
//import Token from './Token.js';
const Token = require("./Token.js");
//const Vector = require("./Vector.js");
//import { Token } from './Vector.js';

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
        else if(tokens[i].getType() == "function")
            operatorStack.push(tokens[i]);
        else if(tokens[i].getType() == "operator") {
            if(operatorStack.length > 0) {
                while(operatorStack[operatorStack.length - 1].getLexeme() != "(" && (operatorStack[operatorStack.length - 1].getPrecedence() > tokens[i].getPrecedence()) || (operatorStack[operatorStack.length - 1].getPrecedence() == tokens[i].getPrecedence() && tokens[i].getleftAssociativity())) { //check this condition
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
            while(operatorStack[operatorStack.length - 1].getLexeme() != "(") {
                output.push(operatorStack.pop());
            } 
            operatorStack.pop();
            //Check "function" type token here. Ex: sin(x) log(x) ln(x) x!
            if(operatorStack.length > 0) {
                if(operatorStack[operatorStack.length - 1].getType() == "function") {
                    //console.log("pushed");
                    output.push(operatorStack.pop());
                }
            }
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
            value =  Math.csc(parseFloat(expression[i - 1].getLexeme()));
            break;
        case "sec":
            value =  Math.sec(parseFloat(expression[i - 1].getLexeme()));
            break;
        case "cot":
            value =  Math.cot(parseFloat(expression[i - 1].getLexeme()));
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

/*
var rpn = shuntingYardAlgorithm(expression);
console.log(evaluateRPN(rpn).getLexeme());*/

//var equation = [new Token("x"), new Token("^"), new Token("2")];
//var equation = [new Token("4"), new Token("+"), new Token("log"), new Token("("), new Token("x"), new Token(")")];
var equation = [new Token("sin"), new Token("x"), new Token("^"), new Token("2")];
console.log(evaluateEquation(shuntingYardAlgorithm(equation), 3.1415).getLexeme());

function applyFunction(vector, f) { //f is in PDA notation
    var appliedVector = Vector();
    for(var i = 0; i < vector.getDimensions(); i++) {
        appliedVector.append(evaluateEquation(f, vector.getComponenet(i)));
    }
    return appliedVector;
}

//Pre-condition: x.length == y.length, f is a valid math equation in infix notation (list of tokens)
function calculateLeadingCoefficient(x, y, f) {
    var pdaEquation = shuntingYardAlgorithm(f);
    var xValues = new Vector(x);
    var yValues = new Vector(y);
    var appliedFunctionValues = applyFunction(xValues, pdaEquation);
    return appliedFunctionValues.dotProduct(yValues) / appliedFunctionValues.magnitude() ** 2;
}

function calculateCoefficientOfDetermination(x, y, f) {
    
}

function calculateRegressionStats() {

}
/*
x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
y = [3, 6, 2, 8, 16, 3, 7, 9, 12, 7];
var equation = [new Token("x")];
console.log(calculateLeadingCoefficient(x, y, equation));*/