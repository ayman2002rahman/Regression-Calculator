//Create a function that takes the string representing the expression that the user made and build an array of tokens. 
//Create a parser that validates the array of tokens is part of the CFG

//import Token from './Token.js';
const Token = require("./Token.js");
var expression = [new Token('3'), new Token('+'), new Token('4'), new Token('*'), new Token('2'), new Token('/'), new Token('('), new Token('1'), new Token('-'), new Token('5'), new Token(')'), new Token('^'), new Token('2'), new Token('^'), new Token('3')];

function peek(stack) {
    return stack[stack.length - 1];
}

function shuntingYard(tokens) { //Returns the output of tokens in Reverse Polish Notation
    var output = [];
    var operatorStack = [];
    for(var i = 0; i < tokens.length; i++) {
        if(tokens[i].getType() === "number") {
            output.push(tokens[i]);
        }
        else { //Token is a parentheses or an operator
            if(tokens[i].getType() === "parentheses") {
                if(tokens[i].getLexeme() === '(') {
                    operatorStack.push(tokens[i]);
                }
                else { //Lexme is ')'
                    while(operatorStack[operatorStack.length - 1].getLexeme() != '(') { //Keep popping stack into output until '(' is found
                        output.push(operatorStack.pop());
                    }
                    operatorStack.pop() //Gets rid of the '(' token
                }
            }
            else { //Token is an operator
                //Check the presedence of the operator
                if(operatorStack.length > 0) {
                    while(operatorStack.length > 0 && tokens[i].getPrecedence() <= operatorStack[operatorStack.length - 1].getPrecedence()) { //Keep popping the stack into the output until the operator has a greater presedence at top
                        output.push(operatorStack.pop());
                    }
                }
                operatorStack.push(tokens[i]);
            }
        }
    }
    while(operatorStack.length > 0) { //Pops all the remaining operators into the output
        output.push(operatorStack.pop());
    }
    return output;
}

function shuntingYardAlgorithm(tokens) {
    var output = [];
    var operatorStack = [];
    for(var i = 0; i < tokens.length; i++) {
        if(tokens[i].getType() == 'number') {
            output.push(tokens[i]);
        }
        else if(tokens[i].getType() == 'operator') {
            if(operatorStack.length > 0) {
                while(operatorStack[operatorStack.length - 1].getLexeme() != '(' && (operatorStack[operatorStack.length - 1].getPrecedence() > tokens[i].getPrecedence()) || (operatorStack[operatorStack.length - 1].getPrecedence() == tokens[i].getPrecedence() && tokens[i].getleftAssociativity())) { //check this condition
                    console.log('yessirski');
                    output.push(operatorStack.pop());
                }
            }
            operatorStack.push(tokens[i]);
        }
        else if(tokens[i].getLexeme() == '(') {
            operatorStack.push(tokens[i]);
        }
        else if(tokens[i].getLexeme() == ')') {
            while(operatorStack[operatorStack.length - 1].getLexeme() != '(') {
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

var rpn = shuntingYardAlgorithm(expression);
for(var i = 0; i < rpn.length; i++) {
    console.log(rpn[i].getLexeme());
}

//console.log("hello world");