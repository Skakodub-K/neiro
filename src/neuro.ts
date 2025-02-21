import { promises as fs } from 'fs';

class Neuro {
    private weights: Array<number> = [];
    private delta: number = 0;
    private numberOfSinopsis: number = 0;

    constructor(numberOfSinopsis: number) {
        this.numberOfSinopsis = numberOfSinopsis;
        this.delta = 0;
    }

    public getSumm(data: Array<number>): number {
        let summ = 0;
        for (let i = 0; i < this.numberOfSinopsis; ++i) {
            summ += this.weights[i] * data[i];
        }
        return summ;
    }

    public getAnswer(data: Array<number>): number {
        return Number(this.getSumm(data) < this.delta);
    }

    public adjustWeights(data: Array<number>, delta: number, indexNeuron: number) {
        if (delta === 0) {
            return;
        }
        for (let i = 0; i < this.numberOfSinopsis; ++i) {
            this.weights[i] += delta * data[i];
        }
    }

    public getWeights(): Array<number> {
        return this.weights;
    }

    public setWeights(weights: Array<number>) {
        if (weights.length !== this.numberOfSinopsis) {
            this.weights = new Array(30).fill(0);
        }
        this.weights = weights;
    }
}

export class Neurons {
    private neurons: Array<Neuro> = [];

    constructor(countOfNeurons: number, numberOfSinopsis: number) {
        for (let i = 0; i < countOfNeurons; ++i) {
            this.neurons.push(new Neuro(numberOfSinopsis));
        }
        this.getWeigts();
    }

    public getAnswer(data: Array<number>): Array<number> {
        const result: Array<number> = [];
        this.neurons.forEach(neuro => result.push(neuro.getAnswer(data)));
        return result;
    }

    public adjustWeights(data: Array<number>, correctAnswer: Array<number>): boolean {
        let haveDiff = false;
        for (let i = 0; i < data.length; ++i) {
            const neuroAnswer: number = Number(this.neurons[i].getAnswer(data));
            const diff: number = correctAnswer[i] - neuroAnswer;
            if (diff !== 0)
                haveDiff = true;
            this.neurons[i].adjustWeights(data, diff, i);
        }
        return haveDiff;
    }

    public async saveWeights() {
        // Объект для хранения весов всех нейронов
        const allWeights: any = {};

        for (let i = 0; i < this.neurons.length; i++) {
            const neuron = this.neurons[i];
            // Возвращаем массив весов
            const weights = neuron.getWeights();
            // Сохраняем веса под уникальным ключом
            allWeights[`${i}`] = weights;
        }
        try {
            await fs.writeFile("weights.json", JSON.stringify(allWeights));
        } catch (error) {
            console.error("Error saving weights:", error);
        }
        console.log("Weights saved successfully.");
    }

    private async getWeigts() {
        let allWeights: any = {};
        try {
            const data = await fs.readFile("weights.json", "utf8");
            allWeights = JSON.parse(data);
        } catch (error) {
            throw error;
        }
        
        this.neurons.forEach((neuro, index) => {
            const weights: Array<number> = allWeights[`${index}`];
            neuro.setWeights(weights);
        });
    }
}