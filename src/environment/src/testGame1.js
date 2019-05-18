
import Generator from 'random-seed';
import ExecutorBF1 from './algorithms/Game1/ExecutorBF';
import ExecutorES1 from './algorithms/Game1/ExecutorES';
import ExecutorGA1 from './algorithms/Game1/ExecutorGA';
import CandidateFactory1 from './algorithms/Game1/CandidateFactory';


const roundArray = [5,50,250,1000];

let result = 0;
let lastResult = 0;

let resultArray;
let mode = 0;
let scaleCounter = 0;
let roundCounter = 0;

function newMessage(gen, type, msg) {
    if (type === 'fin') {
        resultArray[mode][scaleCounter][roundCounter] = lastResult;
        result += lastResult;
        lastResult = 0;
    }
  }

function newGameState(data) {
    lastResult = data.y;
}


function testGame1Execution(type='NE') {

    let executor;
    let startDate;
    let factory;
    let generator;

    const playerCount = 5;
    const strategyCount = 10;
    const seedValue = 6664.58; //Math.random() * 10000;
    
    const generationCount = 100;
    const populationSize = 1000;
    const timeout = '0';

    const mutationRate = 0.2;

    const maxTestScaling = 4;

    resultArray = new Array(3);

    console.log('+--------------------------------+');
    console.log(`|              ${type}                |`);
    console.log('+--------------------------------+');

    console.log('-------------- GA ----------------');
    generator = Generator.create(seedValue);
    resultArray[0] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = roundArray[i];
        console.log('---------- ', rounds);
        result = 0;
        mode = 0;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[0][scaleCounter] = new Array(rounds).fill(0);
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory1(playerCount,strategyCount, dynSeedValue, type);
            executor = new ExecutorGA1(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        console.log('Result: ', result);
        console.log('Runtime: ', Date.now() - startDate);
        console.log('--------------');

    }

    console.log('\n-------------- ES ----------------');
    generator = Generator.create(seedValue);
    resultArray[1] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = roundArray[i];
        console.log('---------- ', rounds);
        result = 0;
        mode = 1;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[1][scaleCounter] = new Array(rounds).fill(0);
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory1(playerCount,strategyCount, dynSeedValue, type);
            executor = new ExecutorES1(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        console.log('Result: ', result);
        console.log('Runtime: ', Date.now() - startDate);
        console.log('--------------');
    }

    /* console.log('\n-------------- BF ----------------');
    generator = Generator.create(seedValue);
    resultArray[2] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = roundArray[i];
        console.log('---------- ', rounds);
        result = 0;
        mode = 2;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[2][scaleCounter] = new Array(rounds).fill(0);
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory1(playerCount,strategyCount, dynSeedValue, type);
            executor = new ExecutorBF1(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        console.log('Result: ', result);
        console.log('Runtime: ', Date.now() - startDate);
        console.log('--------------');

    }

    let gaDiff = 0;
    let esDiff = 0;

    let gaEq = 0;
    let esEq = 0;

    for (let i = 0; i < maxTestScaling; i++) {
        for (let j = 0; j < resultArray[0][i].length; j++) {
            if (resultArray[2][i][j] - resultArray[0][i][j] !== 0) {
                gaDiff += 1;
            }
            if (resultArray[0][i][j] === 0) {
                gaEq += 1;
            }
        }
    }

    for (let i = 0; i < maxTestScaling; i++) {
        for (let j = 0; j < resultArray[1][i].length; j++) {
            if (resultArray[2][i][j] - resultArray[1][i][j] !== 0) {
                esDiff += 1;
            }
            if (resultArray[1][i][j] === 0) {
                esEq += 1;
            }
        }
    } 

    console.log('Diff - GA: ', gaDiff, ', ES: ', esDiff);
    console.log('--------------\n');
    console.log('Eq - GA: ', gaEq, ', ES: ', esEq);
    console.log('--------------\n'); */
}

export default testGame1Execution;