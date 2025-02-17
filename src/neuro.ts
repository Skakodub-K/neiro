import { promises as fs } from 'fs';
export class Neuro {
    private weights: Array<number> = [];
    private delta: number = 0;
    private numberOfSinopsis: number = 0;

    constructor(numberOfSinopsis: number, delta: number) {
        this.numberOfSinopsis = numberOfSinopsis;
        this.delta = delta;
        this.loadWeights();
    }

    private async loadWeights() {
        try {
            const data = await fs.readFile('weights.json', 'utf-8');
            this.weights = JSON.parse(data);
        } catch (error) {
            console.log("Weights file not found, initializing with zeros.");
            this.weights = Array(this.numberOfSinopsis).fill(0);
        }
    }

    private async saveWeights() {
        try {
            await fs.writeFile('weights.json', JSON.stringify(this.weights));
            console.log("Weights saved successfully.");
        } catch (error) {
            console.error("Error saving weights:", error);
        }
    }

    public getSumm(data: Array<number>): number {
        let summ = 0;
        for (let i = 0; i < this.numberOfSinopsis; ++i) {
            summ += this.weights[i] * data[i];
        }
        return summ;
    }

    public getAnswer(data: Array<number>): boolean {
        return this.getSumm(data) < this.delta;
    }

    public adjustWeights(data: Array<number>, upOrdown: boolean) {
        for (let i = 0; i < this.numberOfSinopsis; ++i) {
            this.weights[i] += upOrdown ? data[i] : -data[i];
        }
        this.saveWeights();
    }
}
