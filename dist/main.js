"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const neuro_1 = require("./neuro");
const zoneGenerator_1 = require("./zoneGenerator");
async function main() {
    const rowsCount = 10;
    const columnCount = 6;
    //Нейрон
    const neuro = new neuro_1.Neuro(rowsCount * columnCount, 0);
    const dataSet = [
        {
            inputPath: path_1.default.join(__dirname, '../A.png'),
            correctAnswer: false
        },
        {
            inputPath: path_1.default.join(__dirname, '../B.png'),
            correctAnswer: true
        },
        {
            inputPath: path_1.default.join(__dirname, '../C.png'),
            correctAnswer: true
        },
        {
            inputPath: path_1.default.join(__dirname, '../D.png'),
            correctAnswer: true
        },
        {
            inputPath: path_1.default.join(__dirname, '../E.png'),
            correctAnswer: false
        }
    ];
    for (let data of dataSet) {
        const dataSectors = await (0, zoneGenerator_1.generateZones)(data.inputPath, rowsCount, columnCount);
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
