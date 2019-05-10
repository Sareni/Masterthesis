
import Generator from 'random-seed';
import ExecutorES6 from './algorithms/Game6/ExecutorES';
import ExecutorGA6 from './algorithms/Game6/ExecutorGA';
import CandidateFactory6 from './algorithms/Game6/CandidateFactory';


const roundArray = [1,10,25,50];

let resultX = 0;
let resultY = 0;
let lastResultsX;
let lastResultsY;

let resultArray;
let mode = 0;
let scaleCounter = 0;
let roundCounter = 0;

const playerCount = 2;
lastResultsX = new Array(playerCount);
lastResultsY = new Array(playerCount);

const xMax = 400;
const yMax = 400;

let gaEq = 0;
let esEq = 0;

function newMessage(gen, type, msg) {
    if (type === 'fin') {
        for (let i = 0; i < playerCount; i++) {
            resultX += Math.abs(lastResultsX[i] - (xMax/2));
            resultY += Math.abs(lastResultsY[i] - (yMax/2));
            lastResultsX[i] = 0;
            lastResultsY[i] = 0;
        }
    }
  }

function newGameState(data) {
    lastResultsX[data.playerNumber-1] = data.x;
    lastResultsY[data.playerNumber-1] = data.y;
}


function testGame3Execution(type='NE') {
    let executor;
    let startDate;
    let factory;
    let generator;


    const seedValue = Math.random() * 10000;


    const generationCount = 500;
    const populationSize = 10;
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
        resultX = 0;
        resultY = 0;
        mode = 0;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[0][scaleCounter] = new Array(rounds).fill(0);
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory6(playerCount,xMax, yMax, dynSeedValue);
            executor = new ExecutorGA6(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        console.log('Results: ', resultX, ', ', resultY);
        console.log('Runtime: ', Date.now() - startDate);
        console.log('--------------');

    }

    console.log('\n-------------- ES ----------------');
    generator = Generator.create(seedValue);
    resultArray[1] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = roundArray[i];
        console.log('---------- ', rounds);
        resultX = 0;
        resultY = 0;
        mode = 1;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[1][scaleCounter] = new Array(rounds).fill(0);
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory6(playerCount, xMax, yMax, dynSeedValue);
            executor = new ExecutorES6(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        console.log('Results: ', resultX, ', ', resultY);
        console.log('Runtime: ', Date.now() - startDate);
        console.log('--------------');
    }
}

export default testGame3Execution;