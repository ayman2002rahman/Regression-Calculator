class Token {
    constructor(lexeme) {
        this.lexeme = lexeme //Lexeme is a charcter for both types
        switch(lexeme) {
            case '^':
                this.type = "operator"
                this.precedence = 4;
                this.leftAssociativity = false;
                break;
            case '*':
                this.type = "operator"
                this.precedence = 3;
                this.leftAssociativity = true;
                break;
            case '/':
                this.type = "operator"
                this.precedence = 3;
                this.leftAssociativity = true;
                break;
            case '+':
                this.type = "operator"
                this.precedence = 2;
                this.leftAssociativity = true;
                break;
            case '-':
                this.type = "operator"
                this.precedence = 2;
                this.leftAssociativity = true;
                break;
            case '(':
                this.type = 'parentheses';
                this.precedence = null;
                this.leftAssociativity = null;
                break;
            case ')':
                this.type = 'parentheses';
                this.precedence = null;
                this.leftAssociativity = null  ;      
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
module.exports = Token;