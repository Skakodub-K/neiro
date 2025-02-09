export class Neuro {
    private weights: Array<number> = [];
    private delta: number = 0;
    private numberOfSinopsis: number = 0;
    
    constructor(numberOfSinopsis: number, delta: number) {
        this.numberOfSinopsis = numberOfSinopsis;
        this.delta = delta;
        this.weights = Array(numberOfSinopsis).fill(0);
    }

    public getAnswer(data: Array<number>): boolean {
        let summ = 0;
        for (let i = 0; i< this.numberOfSinopsis; ++i) {
            summ += this.weights[i] * data[i];
        }
        console.log("Summ of weigths: ", summ);
        return summ < this.delta;
    }

    public adjustWeights(data: Array<number>, upOrdown: boolean) {
        for (let i = 0; i< this.numberOfSinopsis; ++i) {
            this.weights[i] += upOrdown ? data[i] : -data[i];
        }
    }
};