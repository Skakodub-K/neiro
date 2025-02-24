import path from "path";
import { Neurons } from "./neuro";
import { generateZones } from "./zoneGenerator";

interface InitialType {
  inputPath: string;
  correctAnswer: Array<number>;
}

interface DataSet {
  data: Array<number>,
  correctAnswer: Array<number>;
}

const rowsCount = 10;
const columnCount = 6;

async function main() {
  //Нейроны
  const neurons = new Neurons(5, rowsCount * columnCount);

  const initialSet: Array<InitialType> = [
    {
      inputPath: path.join(__dirname, "../alphabet/A.png"),
      correctAnswer: [0,0,0,0,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/B.png"),
      correctAnswer: [0,0,0,1,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/C.png"),
      correctAnswer: [0,0,0,1,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/D.png"),
      correctAnswer: [0,0,1,0,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/E.png"),
      correctAnswer: [0,0,1,0,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/F.png"),
      correctAnswer: [0,0,1,1,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/G.png"),
      correctAnswer: [0,0,1,1,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/H.png"),
      correctAnswer: [0,1,0,0,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/I.png"),
      correctAnswer: [0,1,0,0,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/J.png"),
      correctAnswer: [0,1,0,1,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/K.png"),
      correctAnswer: [0,1,0,1,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/L.png"),
      correctAnswer: [0,1,1,0,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/M.png"),
      correctAnswer: [0,1,1,0,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/N.png"),
      correctAnswer: [0,1,1,1,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/O.png"),
      correctAnswer: [0,1,1,1,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/P.png"),
      correctAnswer: [1,0,0,0,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/Q.png"),
      correctAnswer: [1,0,0,0,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/R.png"),
      correctAnswer: [1,0,0,1,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/S.png"),
      correctAnswer: [1,0,0,1,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/T.png"),
      correctAnswer: [1,0,1,0,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/U.png"),
      correctAnswer: [1,0,1,0,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/V.png"),
      correctAnswer: [1,0,1,1,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/W.png"),
      correctAnswer: [1,0,1,1,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/X.png"),
      correctAnswer: [1,1,0,0,0],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/Y.png"),
      correctAnswer: [1,1,0,0,1],
    },
    {
      inputPath: path.join(__dirname, "../alphabet/Z.png"),
      correctAnswer: [1,1,0,1,0],
    },
  ];
  
  if (process.argv.length === 4) {
    const dataSet: Array<DataSet> = await getAllZones(initialSet, false);
    if (process.argv[3] === "test") {
      for (let i = 1; i < 4; ++i) {
        console.log("Количество шумов -> ", i);
        await testWithNoise(neurons, dataSet, i);
      }
    } else {
      const index: number = Number(process.argv[3]);
      if (index < 0 || index >= 26) {
        console.log("Incorrect input.");
      }
      console.log("Answer: ", await neurons.getAnswer(dataSet[index].data));
    }
    return;
  } else {
    const dataSet: Array<DataSet> = await getAllZones(initialSet, false);
    await teach(neurons, dataSet);
  }
}
async function getAllZones(allInitialData: Array<InitialType>, isWithNoise: boolean): Promise<Array<DataSet>> {
  let resultZones: Array<DataSet> = [];
  
  for (let i = 0; i < allInitialData.length; ++i){
    const element = allInitialData[i];
    const dataSectors: Array<number> | undefined = await generateZones({
      inputPath: element.inputPath,
      rowsCount,
      columnCount
    });
    if(!dataSectors)
      continue;
    resultZones.push({
      data: dataSectors,
      correctAnswer: element.correctAnswer
    })
  }
  
  if (!isWithNoise)
    return resultZones;
    
  resultZones = [...resultZones, ...resultZones];
  for (let i = 0; i < rowsCount * columnCount; ++i) {
    for (let noiseIndex = 0; noiseIndex < 1; ++noiseIndex) {
      const randomIndex: number = Math.floor(Math.random() * rowsCount * columnCount);
      resultZones[i].data[randomIndex] = 1 - resultZones[i].data[randomIndex];
    }
  }
  
  return resultZones;
}
async function teach(neurons: Neurons, dataSet: Array<DataSet>) {
  let countErrors: number = -1;
  const start = new Date().getTime();
  //Количество эпох
  let countOfAges = 0;
  let haveError = true;

  while (haveError) {
    haveError = false;
    countOfAges++;
    for (let i = 0; i < dataSet.length; ++i) {
      if(neurons.adjustWeights(dataSet[i].data, dataSet[i].correctAnswer))
        haveError = true;
    }
  }
  console.log("OK");
  await neurons.saveWeights();
  const end = new Date().getTime();
  console.log("Количество эпох: ", countOfAges);
  console.log("Время обучения: ", end - start, "ms");
}

async function testWithNoise(neurons: Neurons, dataSet: Array<DataSet>, countNoise: number) {
  for (const inputData of dataSet) {
    // Кол-во ошибок
    let countErrors = 0;
    for (let testIndex = 0; testIndex < 10; ++testIndex) {
      const dataSectorsWithNoise: Array<number> = [...inputData.data];
      for (let noiseIndex = 0; noiseIndex < countNoise; ++noiseIndex) {
        const randomIndex: number = Math.floor(Math.random() * rowsCount * columnCount);
        dataSectorsWithNoise[randomIndex] = 1 - dataSectorsWithNoise[randomIndex];
      }
      for (let i = 0; i < inputData.correctAnswer.length; ++i) {
        if( neurons.getAnswer(dataSectorsWithNoise)[i] === inputData.correctAnswer[i]) {
          continue;
        }
        countErrors++;
        break;
      }
    console.log("Количество ошибок ", countErrors);
  }
}
}

main();
