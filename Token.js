//Maybe reorgine the switches into if else statements to make it more consice for sets since there is a lot of repeated code
export class Token {
    constructor(lexeme) {
        this.lexeme = lexeme //Lexeme is a charcter for both types
        switch(lexeme) {
            case "^":
                this.type = "operator"
                this.precedence = 4;
                this.leftAssociativity = false;
                break;
            case "*":
                this.type = "operator"
                this.precedence = 3;
                this.leftAssociativity = true;
                break;
            case "/":
                this.type = "operator"
                this.precedence = 3;
                this.leftAssociativity = true;
                break;
            case "+":
                this.type = "operator"
                this.precedence = 2;
                this.leftAssociativity = true;
                break;
            case "-":
                this.type = "operator"
                this.precedence = 2;
                this.leftAssociativity = true;
                break;
            case "(":
                this.type = "parentheses";
                this.precedence = null;
                this.leftAssociativity = null;
                break;
            case ")":
                this.type = "parentheses";
                this.precedence = null;
                this.leftAssociativity = null  ;      
                break;
            case "sin":
                this.type = "function";
                this.precedence = null;
                this.leftAssociativity = null;
                break;
            case "cos":
                this.type = "function";
                this.precedence = null;
                this.leftAssociativity = null;
                break;
            case "tan":
                this.type = "function";
                this.precedence = null;
                this.leftAssociativity = null;
                break;
            case "csc":
                this.type = "function";
                this.precedence = null;
                this.leftAssociativity = null;
                break;
            case "sec":
                this.type = "function";
                this.precedence = null;
                this.leftAssociativity = null;
                break;
            case "cot":
                this.type = "function";
                this.precedence = null;
                this.leftAssociativity = null;
                break;
            case "log":
                this.type = "function";
                this.precedence = null;
                this.leftAssociativity = null;
                break;
            case "ln":
                this.type = "function";
                this.precendence = null;
                this.leftAssociativty;
                break;
            default:
                this.type = "number";
                this.precedence = null;
                this.leftAssociativity = null;
        }
    }
    getLexeme() {
        return this.lexeme;
    }
    setLexeme(lexeme) {
        this.lexeme = lexeme;
    }
    getType() {
        return this.type;
    }
    getPrecedence() {
        return this.precedence;
    }
    getleftAssociativity() {
        return this.leftAssociativity;
    }
}
//module.exports = Token;

//perhaps can add more elementry functrions like inverse trig and hyperbolic trig later