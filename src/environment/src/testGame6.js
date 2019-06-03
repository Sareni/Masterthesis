
import Generator from 'random-seed';
import ExecutorES6 from './algorithms/Game6/ExecutorES';
import ExecutorGA6 from './algorithms/Game6/ExecutorGA';
import CandidateFactory6 from './algorithms/Game6/CandidateFactory';


const roundArray = [1,10,25,50];

let resultX = 0;
let resultY = 0;
let lastResultsX;
let lastResultsY;
let lastResultsFitness;


let resultArray;
let mode = 0;
let scaleCounter = 0;
let roundCounter = 0;

const playerCount = 2;
lastResultsX = new Array(playerCount);
lastResultsY = new Array(playerCount);
lastResultsFitness = new Array(playerCount);

const xMax = 200;
const yMax = 200;

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

function newMessage2(gen, type, msg) {
    if (type === 'fin') {
        let avg = 0;

        for (let i = 0; i < playerCount; i++) {
            if (i === 0) {
                for (let j = 0; j < playerCount; j++) {
                    avg += lastResultsFitness[j];
                    // console.log(lastResultsFitness[j]);
                }
                avg = avg / playerCount;
            }
            resultX += Math.abs(lastResultsFitness[i] - avg);
            lastResultsFitness[i] = 0;
        }
    }
  }

function newGameState(data) {
    lastResultsX[data.playerNumber-1] = data.x;
    lastResultsY[data.playerNumber-1] = data.y;
    lastResultsFitness[data.playerNumber-1] = data.fitness;
}


function testGame3Execution(type='NE') {
    let executor;
    let startDate;
    let factory;
    let generator;


    const seedValue = Math.random() * 10000;


    const generationCount = 200;
    const populationSize = 30;
    const timeout = '0';

    const mutationRate = 0.5;

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
            executor = new ExecutorGA6(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage2);
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
            executor = new ExecutorES6(generationCount, dynSeedValue, populationSize, timeout, mutationRate*2, factory, newGameState, newMessage2);
            executor.start();
        }
        console.log('Results: ', resultX, ', ', resultY);
        console.log('Runtime: ', Date.now() - startDate);
        console.log('--------------');
    }
}

export default testGame3Execution;