"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neuro = void 0;
class Neuro {
    constructor(numberOfSinopsis, delta) {
        this.weights = [];
        this.delta = 0;
        this.numberOfSinopsis = 0;
        this.numberOfSinopsis = numberOfSinopsis;
        this.delta = delta;
        this.weights = Array(numberOfSinopsis).fill(0);
    }
    getAnswer(data) {
        let summ = 0;
        for (let i = 0; i < this.numberOfSinopsis; ++i) {
            summ += this.weights[i] * data[i];
        }
        console.log("Summ of weigths: ", summ);
        return summ < this.delta;
    }
    adjustWeights(data, upOrdown) {
        for (let i = 0; i < this.numberOfSinopsis; ++i) {
            this.weights[i] += upOrdown ? data[i] : -data[i];
        }
    }
}
exports.Neuro = Neuro;
;
