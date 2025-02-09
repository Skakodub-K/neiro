import sharp, { Metadata } from "sharp";

export async function generateZones(inputPath: string, rowsCount: number, columnCount: number): Promise<Array<number> | undefined> {
    if (rowsCount <= 0 || columnCount <= 0) {
        return;
    }

    try {
        //Получаем метаданные изображения
        const metadata: Metadata = await sharp(inputPath).metadata();
        //Ширина картинки
        const width: number | undefined  = metadata.width;
        //Высота картинки
        const height: number | undefined = metadata.height;
        
        if(!width || !height) {
            return;
        }

        //Отступ по ширине
        const zoneSizeX: number = Math.floor(width / columnCount);
        //Отступ по высоте
        const zoneSizeY: number = Math.floor(height / rowsCount);

        // Читаем изображение в буфер
        const imageBuffer: Buffer = await sharp(inputPath).raw().toBuffer();
        console.log("Buffer size: ", imageBuffer.length);

        //Значение зон
        const zones: Array<number> = [];
        
        //Считаем отступа и добавляем в массив
        const calcXOffsetAndPush = async function(y: number, zoneSizeY: number) {
            let x = 0;
            for (let j = 0; j < columnCount - 1; j++) {
                zones.push(await checkZone(imageBuffer, x, y, zoneSizeX, zoneSizeY, width));
                x += zoneSizeX;
            }
            zones.push(await checkZone(imageBuffer, x, y, width - x, zoneSizeY, width));
        }

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
    } catch (error) {
        console.error(error);
    }
}

async function checkZone(buffer: Buffer, startX: number, startY: number, sizeX: number, sizeY: number, imgWidth: number): Promise<number> {
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
    return sumZone < 100 ? 0 : 1;
}