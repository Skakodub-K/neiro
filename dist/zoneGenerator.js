"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZones = generateZones;
const sharp_1 = __importDefault(require("sharp"));
async function generateZones(inputPath, rowsCount, columnCount) {
    if (rowsCount <= 0 || columnCount <= 0) {
        return;
    }
    try {
        //Получаем метаданные изображения
        const metadata = await (0, sharp_1.default)(inputPath).metadata();
        //Ширина картинки
        const width = metadata.width;
        //Высота картинки
        const height = metadata.height;
        if (!width || !height) {
            return;
        }
        //Отступ по ширине
        const zoneSizeX = Math.floor(width / columnCount);
        //Отступ по высоте
        const zoneSizeY = Math.floor(height / rowsCount);
        // Читаем изображение в буфер
        const imageBuffer = await (0, sharp_1.default)(inputPath).raw().toBuffer();
        console.log("Buffer size: ", imageBuffer.length);
        //Значение зон
        const zones = [];
        //Считаем отступа и добавляем в массив
        const calcXOffsetAndPush = async function (y, zoneSizeY) {
            let x = 0;
            for (let j = 0; j < columnCount - 1; j++) {
                zones.push(await checkZone(imageBuffer, x, y, zoneSizeX, zoneSizeY, width));
                x += zoneSizeX;
            }
            zones.push(await checkZone(imageBuffer, x, y, width - x, zoneSizeY, width));
        };
        //Проходимся
        let y = 0;
        for (let i = 0; i < rowsCount - 1; i++) {
            await calcXOffsetAndPush(y, zoneSizeY);
            y += zoneSizeY;
        }
        await calcXOffsetAndPush(y, height - y);
        console.log(zones.length);
        console.log(zones);
        return zones;
    }
    catch (error) {
        console.error(error);
    }
}
async function checkZone(buffer, startX, startY, sizeX, sizeY, imgWidth) {
    let sumZone = 0;
    for (let y = startY; y < startY + sizeY; y++) {
        for (let x = startX; x < startX + sizeX; x++) {
            // RGBA, поэтому умножаем на 4
            const offset = (y * imgWidth + x) * 4;
            //alpha канал прозрачный
            if (buffer[offset + 3] === 0) {
                continue;
            }
            sumZone += 1 - (buffer[offset] + buffer[offset + 1] + buffer[offset + 2]);
        }
    }
    return sumZone < 100 ? 0 : 1;
}
