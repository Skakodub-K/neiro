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

class Layer {
    // Нейроны слоя
    private neurons: Array<Neuro> = [];
    private inputs: Array<number> = [];
    private lastLayerAnswer: Array<number> = [];
    private eta = 0.6;
    
    constructor(countOfNeurons: number, numberOfSinopsis: number) {
        for (let i = 0; i < countOfNeurons; ++i) {
            this.neurons.push(new Neuro(numberOfSinopsis));
        }
    }

    //Возвращает ответ слоя
    public getAnswer(data: Array<number>): Array<number> {
        this.inputs = data;
        const result: Array<number> = [];
        this.neurons.forEach((neuro: Neuro) => result.push(neuro.getAnswer(this.inputs)));
        this.lastLayerAnswer = result;
        return this.lastLayerAnswer;
    }

    public adjustWeights(diffLayer: Array<number>): Array<number> {
    for (let i = 0; i < this.neurons.length; ++i) {
        // Результат нейрона = y'
        const neuroAnswer: number = this.lastLayerAnswer[i];
        // (y - y')
        const diff: number = diffLayer[i];
        // (y - y')* (y - y')
        const diffSquare: number = diff * diff;
        // Боремся с градиентным затуханием
        if (diffSquare > 0.9 && diffSquare < 1) {
            this.neurons[i].adjustWeights(this.inputs, -this.eta * diff);
        } else if (diffSquare > 0.1){
            this.neurons[i].adjustWeights(this.inputs, -this.eta * diff * neuroAnswer * (1 - neuroAnswer));
        }
    }
    const resultDiff: Array<number> = [];
    this.neurons.forEach((neuro: Neuro) => resultDiff.push(neuro.getAnswer(this.inputs) - this.lastLayerAnswer[i]));
    return resultDiff;
}

}

interface NeuronsConfig {
    // Количество слоев и нейроннов в них
    layers: Array<number>,
    // Количество синопсисов у первого слоя
    countOfInputData: number,
    // Параметр скорости "Эта"
    eta: number
}

export class Neurons {
    // Слои нейронной сети
    private layers: Array<Layer> = [];
    // Параметр скорости "Эта"
    private eta: number = 0.1;

    constructor(config: NeuronsConfig) {
        // Добавляем первый слой
        this.layers.push(new Layer(config.layers[0], config.countOfInputData));
        // Добавляем остальные слои
        for (let i = 1; i < config.layers.length; ++i) {
            this.layers.push(new Layer(config.layers[i], config.layers[i - 1]));
        }
        this.getWeigts();
    }

    //Возвращает дискретный ответ 0 или 1
    public getAnswer(data: Array<number>): Array<number> {
        this.layers.forEach((layer: Layer) => data = layer.getAnswer(data));
        return data;
    }

    public adjustWeights(data: Array<number>, correctAnswer: Array<number>): boolean {
        let haveDiff = false;
        const neuronsAnswer: Array<number> = this.getAnswer(data);
        let dif: Array<number> = neuronsAnswer.map((nAnswer: number, index: number) => {
            return correctAnswer[index] - nAnswer;
        })
        const error = dif.reduce((previousValue: number, currentValue: number) => {
            return previousValue + currentValue * currentValue;
        }, 0);
        if (error > 0.3)
            haveDiff = true;
        for (let i = this.layers.length -1 ; i >= 0; --i) {
            dif = this.layers[i].adjustWeights(dif);
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