class Vector {
    constructor(vector) {
        this.vector = vector;
    }

    getComponenet(i) {
        return this.vector[i];
    }

    dimensions() {
        return this.vector.length;
    }

    append(component) {
        this.vector.push(component);
    }

    magnitude() {
        var sum = 0;
        for(var i = 0; i < this.vector.length; i++)
            sum += vector[i] ** 2;
        return Math.sqrt(sum);
    }

    dotProduct(other) {
        if(this.vector.length != other.vector.length)
            throw "cannot computer dot product of vectors with different dimensions";
        sum = 0;
        for(var i = 0; i < this.vector.length; i++)
            sum += this.vector[i] * other.vector[i];
        return sum;
    }

    dotProduct(u, v) {
        if(u.vector.length != v.vector.length)
            throw "cannot computer dot product of vectors with different dimensions";
        sum = 0;
        for(var i = 0; i < u.vector.length; i++)
            sum += u.vector[i] * v.vector[i];
        return sum;
    }
}
module.exports = Token;