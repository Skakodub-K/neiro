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
            inputPath: path.join(__dirname, '../alphabet/A.png'),
            correctAnswer: false
        },
        {
            inputPath: path.join(__dirname, '../alphabet/B.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/C.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/D.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/E.png'),
            correctAnswer: false
        },
        {
            inputPath: path.join(__dirname, '../alphabet/F.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/G.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/H.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/I.png'),
            correctAnswer: false
        },
        {
            inputPath: path.join(__dirname, '../alphabet/J.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/K.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/L.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/M.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/N.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/O.png'),
            correctAnswer: false
        },
        {
            inputPath: path.join(__dirname, '../alphabet/P.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/Q.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/R.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/S.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/T.png'),
            correctAnswer: true
        }, {
            inputPath: path.join(__dirname, '../alphabet/U.png'),
            correctAnswer: false
        },
        {
            inputPath: path.join(__dirname, '../alphabet/V.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/W.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/X.png'),
            correctAnswer: true
        },
        {
            inputPath: path.join(__dirname, '../alphabet/Y.png'),
            correctAnswer: false
        },
        {
            inputPath: path.join(__dirname, '../alphabet/Z.png'),
            correctAnswer: true
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