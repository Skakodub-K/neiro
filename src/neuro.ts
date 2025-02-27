import { promises as fs } from 'fs';

// Сигмоида
function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}

function binaryThreshold(value: number) {
    return value >= 0.5 ? 1 : 0;
}

class Neuro {
    private weights: Array<number> = [];
    private delta: number = 0;
    private numberOfSinopsis: number = 0;

    constructor(numberOfSinopsis: number) {
        this.numberOfSinopsis = numberOfSinopsis;
        this.delta = 5;
    }

    public getSumm(data: Array<number>): number {
        let summ = 0;
        for (let i = 0; i < this.numberOfSinopsis; ++i) {
            summ += this.weights[i] * data[i];
        }
        return summ;
    }

    // Возвращает сигмоиду от суммы
    public getAnswer(data: Array<number>): number {
        const summ: number = this.getSumm(data);
        return sigmoid(summ);
    }

    public adjustWeights(data: Array<number>, delta: number) {
        for (let i = 0; i < this.numberOfSinopsis; ++i) {
            this.weights[i] -= delta * data[i];
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
    private eta: number = 0.1;

    constructor(countOfNeurons: number, numberOfSinopsis: number) {
        for (let i = 0; i < countOfNeurons; ++i) {
            this.neurons.push(new Neuro(numberOfSinopsis));
        }
        this.getWeigts();
    }

    //Возвращает дискретный ответ 0 или 1
    public getAnswer(data: Array<number>): Array<number> {
        const result: Array<number> = [];
        this.neurons.forEach((neuro: Neuro) => result.push(binaryThreshold(neuro.getAnswer(data))));
        return result;
    }


    public adjustWeights(data: Array<number>, correctAnswer: Array<number>): boolean {
        let haveDiff = false;
        for (let i = 0; i < this.neurons.length; ++i) {
            // Результат нейрона = y'
            const neuroAnswer: number = this.neurons[i].getAnswer(data);
            // y - y'
            const diff: number = correctAnswer[i] - neuroAnswer;
            const diffSquare: number = diff * diff;
            // Боремся с градиентным затуханием
            if (diffSquare > 0.9 && diffSquare < 1) {
                haveDiff = true;
                this.neurons[i].adjustWeights(data, -this.eta * diff);
            } else if (diffSquare > 0.1){
                haveDiff = true;
                this.neurons[i].adjustWeights(data, -this.eta * diff * neuroAnswer * (1 - neuroAnswer));
            }
        }
        return haveDiff;
    }

    public async saveWeights() {
        const allWeights: Array<Array<number>> = [];

        for (let i = 0; i < this.neurons.length; i++) {
            const neuron: Neuro = this.neurons[i];
            const weights: Array<number> = neuron.getWeights();
            allWeights[i] = weights;
        }
        try {
            await fs.writeFile("weights.json", JSON.stringify(allWeights));
        } catch (error) {
            console.error("Error saving weights:", error);
        }
        console.log("Weights saved successfully.");
    }

    private async getWeigts() {
        let allWeights: any = [];
        try {
            const data = await fs.readFile("weights.json", "utf8");
            if (data) {
                allWeights = JSON.parse(data);
            } else {
                // Если файл пуст, генерируем новые веса
                allWeights = this.generateNewWeights();
            }
        } catch (error) {
            // Если файл не существует, генерируем новые веса
            allWeights = this.generateNewWeights();
        }

        this.neurons.forEach((neuro, index) => {
            const weights: Array<number> = allWeights[index];
            neuro.setWeights(weights);
        });
    }
    private generateNewWeights(): any {
        const allWeights: any = [];
        this.neurons.forEach((neuro, index) => {
            const weights: Array<number> = [];
            const numberOfSinopsis = neuro.getWeights().length; // Получаем количество синапсов
            for (let i = 0; i < numberOfSinopsis; i++) {
                weights.push(Math.random()); // Генерация весов в диапазоне от 0 до 1
            }
            allWeights[index] = weights; // Сохраняем веса для текущего нейрона
        });
        return allWeights;
    }
}