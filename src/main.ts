import path from "path";
import {Neuro} from "./neuro";
import {generateZones} from "./zoneGenerator"

async function main() {
    
    const rowsCount = 10;
    const columnCount = 6;
    
    //Нейрон
    const neuro = new Neuro(rowsCount * columnCount, 0);

    const dataSet = [
        {
            inputPath: path.join(__dirname, '../A.png'),
            correctAnswer: false
        },
        {
            inputPath: path.join(__dirname, '../B.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../C.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../D.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../E.png'),
            correctAnswer: false
        }
    ]

    for (let data of dataSet) {
        const dataSectors: Array<number> | undefined = await generateZones(data.inputPath, rowsCount, columnCount);
        if (!dataSectors) {
            console.log("Error!");
            return;
        }

        while (neuro.getAnswer(dataSectors) === data.correctAnswer) {
            neuro.adjustWeights(dataSectors, data.correctAnswer);
        }
        console.log("OK");
    }
}
main();