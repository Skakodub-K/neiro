import path from "path";
import { Neuro } from "./neuro";
import { generateZones } from "./zoneGenerator";
interface dSType {
  inputPath: string;
  correctAnswer: boolean;
}
const rowsCount = 10;
const columnCount = 6;

async function main() {
  //Нейрон
  const neuro = new Neuro(rowsCount * columnCount, 0);

  const dataSet: Array<dSType> = [
    {
      inputPath: path.join(__dirname, "../alphabet/A.png"),
      correctAnswer: false,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/B.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/C.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/D.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/E.png"),
      correctAnswer: false,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/F.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/G.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/H.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/I.png"),
      correctAnswer: false,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/J.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/K.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/L.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/M.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/N.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/O.png"),
      correctAnswer: false,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/P.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/Q.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/R.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/S.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/T.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/U.png"),
      correctAnswer: false,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/V.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/W.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/X.png"),
      correctAnswer: true,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/Y.png"),
      correctAnswer: false,
    },
    {
      inputPath: path.join(__dirname, "../alphabet/Z.png"),
      correctAnswer: true,
    },
  ];
  console.log(process.argv.length);
  if (process.argv.length === 4) {
    if (process.argv[3] === "test") {
      for (let i = 1; i < 4; ++i) {
        console.log("Количество шумов -> ", i);
        await testWithNoise(neuro, dataSet, i);
      }
    } else {
      const dataSectors: Array<number> | undefined = await generateZones({
        inputPath: process.argv[3],
        rowsCount,
        columnCount,
      });
      if (!dataSectors) {
        console.log("Error!");
        return;
      }
      console.log(
        (await neuro.getAnswer(dataSectors)) ? "гласная" : "согласная"
      );
    }
    return;
  } else {
    await teach(neuro, dataSet);
  }
}
async function getZones(data: dSType, isWithNoise: boolean) {
  const dataSectors: Array<number> | undefined = await generateZones({
    inputPath: data.inputPath,
    rowsCount,
    columnCount,
  });

  if (isWithNoise && dataSectors) {
    for (let noiseIndex = 0; noiseIndex < 1; ++noiseIndex) {
      const randomIndex: number = Math.floor(
        Math.random() * rowsCount * columnCount
      );
      dataSectors[randomIndex] = 1 - dataSectors[randomIndex];
    }
  }

  return dataSectors;
}
async function teach(neuro: Neuro, dataSet: Array<dSType>) {
  let countErrors: number = -1;
  const start = new Date().getTime();
  //Количество эпох
  let countOfAges = 0;
  let newDataSet = [...dataSet, ...dataSet]
  while (countErrors !== 0) {
    countErrors = 0;
    countOfAges++;
    for (let i = 0; i < newDataSet.length; ++i) {
      const dataSectors: Array<number> | undefined = await getZones(
        newDataSet[i],
        i >= (newDataSet.length / 2)
      );
      if (!dataSectors) {
        console.log("Error!");
        return;
      }

      while (neuro.getAnswer(dataSectors) === newDataSet[i].correctAnswer) {
        countErrors++;
        neuro.adjustWeights(dataSectors, newDataSet[i].correctAnswer);
      }
      console.log("OK");
    }
  }
  const end = new Date().getTime();
  console.log("Количество эпох: ", countOfAges);
  console.log("Время обучения: ", end - start, "ms");
}

async function testWithNoise(
  neuro: Neuro,
  dataSet: Array<dSType>,
  countNoise: number
) {
  for (const data of dataSet) {
    const dataSectors: Array<number> | undefined = await generateZones({
      inputPath: data.inputPath,
      rowsCount,
      columnCount,
    });
    if (!dataSectors) {
      console.log("Error!");
      return;
    }

    let countErrors = 0;
    for (let testIndex = 0; testIndex < 10; ++testIndex) {
      const dataSectorsWithNoise = [...dataSectors];
      for (let noiseIndex = 0; noiseIndex < countNoise; ++noiseIndex) {
        const randomIndex: number = Math.floor(
          Math.random() * rowsCount * columnCount
        );
        dataSectorsWithNoise[randomIndex] =
          1 - dataSectorsWithNoise[randomIndex];
      }
      if (neuro.getAnswer(dataSectorsWithNoise) === data.correctAnswer) {
        countErrors++;
      }
    }
    console.log("Количество ошибок ", countErrors);
    if (countErrors > 2) {
      console.log("Сумма весов", neuro.getSumm(dataSectors));
    }
  }
}

main();
