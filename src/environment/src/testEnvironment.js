// node.js modules
const readline = require('readline');
require("babel-core").transform("code");
import Generator from 'random-seed';

// custom modules
import CandidateFactory1 from './algorithms/Game1/CandidateFactory';
import CandidateFactory2 from './algorithms/Game2/CandidateFactory';
import CandidateFactory3 from './algorithms/Game3/CandidateFactory';
import CandidateFactory6 from './algorithms/Game6/CandidateFactory';
import CandidateFactory7 from './algorithms/Game7/CandidateFactory';
import CandidateFactory8 from './algorithms/Game8/CandidateFactory';
import CandidateFactory9 from './algorithms/Game9/CandidateFactory';

import ExecutorBF1 from './algorithms/Game1/ExecutorBF';
import ExecutorES1 from './algorithms/Game1/ExecutorES';
import ExecutorGA1 from './algorithms/Game1/ExecutorGA';

import ExecutorBF2 from './algorithms/Game2/ExecutorBF';
import ExecutorES2 from './algorithms/Game2/ExecutorES';
import ExecutorGA2 from './algorithms/Game2/ExecutorGA';




const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

function testGame1Execution(type) {

    let executor;
    let startDate;
    let factory;
    let generator;

    const playerCount = 5;
    const strategyCount = 10;
    const seedValue = 1002;

    const generationCount = 100;
    const populationSize = 100;
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
        const rounds = 5 * Math.pow(10, i);
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
        const rounds = 5 * Math.pow(10, i);
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

    console.log('\n-------------- BF ----------------');
    generator = Generator.create(seedValue);
    resultArray[2] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = 5 * Math.pow(10, i);
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

    for (let i = 0; i < maxTestScaling; i++) {
        for (let j = 0; j < resultArray[0][i].length; j++) {
            if (resultArray[2][i][j] - resultArray[0][i][j] !== 0) {
                gaDiff += 1;
            }
        }
    }

    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < resultArray[1][i].length; j++) {
            if (resultArray[2][i][j] - resultArray[1][i][j] !== 0) {
                esDiff += 1;
            }
        }
    }

    console.log('GA: ', gaDiff, ', ES: ', esDiff);
    console.log('--------------\n');
}



function testGame1() {
    testGame1Execution('NE');
    testGame1Execution('MAX');
}

function startTest(gameNumber) {
    rl.close();

    switch (gameNumber) {
        case '1': testGame1(); break;
        default: console.log('Error: False Input!');
    }
}

rl.question('Select Game (1-9): ', startTest);