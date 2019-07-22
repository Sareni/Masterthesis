
import Generator from 'random-seed';
import fs from 'fs';
import ExecutorES7 from './algorithms/Game7/ExecutorES';
import ExecutorGA7 from './algorithms/Game7/ExecutorGA';
import CandidateFactory7 from './algorithms/Game7/CandidateFactory';


const roundArray = [5,50,250,1000];

let result = 0;
let lastResult = 0;

let resultArray;
let mode = 0;
let scaleCounter = 0;
let roundCounter = 0;

let output = '';

function log() {
    console.log(...arguments);
    [].forEach.call(arguments, function (arg) {
        output += arg;
    });
    output += '\n';
}

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


function testGame7Execution(type='NE') {
    let executor;
    let startDate;
    let factory;
    let generator;

    const gameRounds = 10;
    const seedValue = 91769; // Math.random() * 10000; // good seed: 91769
    
    const generationCount = 100;
    const populationSize = 100;
    const timeout = '0';

    const mutationRate = 0.2;

    const maxTestScaling = 4;

    resultArray = new Array(3);


    log('+--------------------------------+');
    log(`|              GAME7             |`);
    log('+--------------------------------+');
    log(`|              ${type}                |`);
    log('+--------------------------------+');

    log('-------------- GA ----------------');
    generator = Generator.create(seedValue);
    resultArray[0] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = roundArray[i];
        log('---------- ', rounds);
        result = 0;
        mode = 0;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[0][scaleCounter] = new Array(rounds).fill(0);
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory7(gameRounds, dynSeedValue);
            executor = new ExecutorGA7(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        log('Result: ', result);
        log('Runtime: ', Date.now() - startDate);
        log('--------------');

    }

    log('\n-------------- ES ----------------');
    generator = Generator.create(seedValue);
    resultArray[1] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = roundArray[i];
        log('---------- ', rounds);
        result = 0;
        mode = 1;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[1][scaleCounter] = new Array(rounds).fill(0);
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory7(gameRounds, dynSeedValue);
            executor = new ExecutorES7(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        log('Result: ', result);
        log('Runtime: ', Date.now() - startDate);
        log('--------------');
    }

    log('\n-------------- Test Results ----------------');
    generator = Generator.create(seedValue);
    resultArray[2] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = roundArray[i];
        log('---------- ', rounds);
        result = 0;
        mode = 2;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[2][scaleCounter] = new Array(rounds).fill(0);
        for (let j = 0; j < rounds; j++) {
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory7(gameRounds, dynSeedValue);
            const maxValue = factory.getMaxValue();
            resultArray[mode][scaleCounter][j] = maxValue;
            result += maxValue;
        }
        log('Result: ', result);

    }

    log('--------------------------------------');

    let gaDiff = 0;
    let esDiff = 0;

    let gaEq = 0;
    let esEq = 0;

    for (let i = 0; i < maxTestScaling; i++) {
        for (let j = 0; j < resultArray[0][i].length; j++) {
            if (resultArray[2][i][j] - resultArray[0][i][j] !== 0) {
                gaDiff += 1;
            } else {
                gaEq += 1;
            }
        }
    }

    for (let i = 0; i < maxTestScaling; i++) {
        for (let j = 0; j < resultArray[1][i].length; j++) {
            if (resultArray[2][i][j] - resultArray[1][i][j] !== 0) {
                esDiff += 1;
            } else {
                esEq += 1;
            }
        }
    }

    log('Diff - GA: ', gaDiff, ', ES: ', esDiff);
    log('--------------\n');
    log('Eq - GA: ', gaEq, ', ES: ', esEq);
    log('--------------\n');

    fs.writeFile("results/game7.txt", output, function(err) {
        if(err) {
            return log(err);
        }
    });
}

export default testGame7Execution;