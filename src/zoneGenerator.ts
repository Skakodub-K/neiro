import sharp, { Metadata } from "sharp";

interface GenerateZonesParams {
    //Путь до картинки
    inputPath: string,
    //Кол-во строк у зоны
    rowsCount: number,
    //Кол-во стролбцов у зоны
    columnCount: number,
}

export async function generateZones(params: GenerateZonesParams): Promise<Array<number> | undefined> {
    if (params.rowsCount <= 0 || params.columnCount <= 0) {
        return;
    }

    try {
        //Получаем метаданные изображения
        const metadata: Metadata = await sharp(params.inputPath).metadata();
        //Ширина картинки
        const width: number | undefined  = metadata.width;
        //Высота картинки
        const height: number | undefined = metadata.height;

        if(!width || !height) {
            return;
        }

        //Считаем относительный порог в 5% от числа точек в одной зоне
        const relativeThreshold: number = Math.floor(5 * width * height ) / (100 * params.rowsCount * params.columnCount );

        //Отступ по ширине
        const zoneSizeX: number = Math.floor(width / params.columnCount);
        //Отступ по высоте
        const zoneSizeY: number = Math.floor(height / params.rowsCount);

        // Читаем изображение в буфер
        const imageBuffer: Buffer = await sharp(params.inputPath).raw().toBuffer();
        console.log("Buffer size: ", imageBuffer.length);

        //Значение зон
        const zones: Array<number> = [];
        
        //Считаем отступа и добавляем в массив
        const calcXOffsetAndPush = async function(y: number, zoneSizeY: number) {
            let x = 0;
            for (let j = 0; j < params.columnCount - 1; j++) {
                zones.push(await checkZone(imageBuffer, x, y, zoneSizeX, zoneSizeY, width, relativeThreshold));
                x += zoneSizeX;
            }
            zones.push(await checkZone(imageBuffer, x, y, width - x, zoneSizeY, width, relativeThreshold));
        }

        //Проходимся
        let y = 0;
        for (let i = 0; i < params.rowsCount - 1; i++) {
            await calcXOffsetAndPush(y, zoneSizeY);
            y += zoneSizeY;
        }
        await calcXOffsetAndPush(y, height - y);

        console.log(zones.length);
        console.log(zones);

        return zones;
    } catch (error) {
        console.error(error);
    }
}

async function checkZone(buffer: Buffer, startX: number, startY: number, sizeX: number, sizeY: number, imgWidth: number, treshold: number): Promise<number> {
    let sumZone: number = 0;
    for (let y = startY; y < startY + sizeY; y++) {
        for (let x = startX; x < startX + sizeX; x++) {
             // RGBA, поэтому умножаем на 4
            const offset: number = (y * imgWidth + x) * 4;
            //alpha канал прозрачный
            if (buffer[offset + 3] === 0) {
                continue;
            }
            sumZone += 1 - (buffer[offset] + buffer[offset + 1] + buffer[offset + 2]);
        }
    }
    return sumZone < treshold ? 0 : 1;
}