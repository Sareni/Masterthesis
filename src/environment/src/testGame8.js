
import Generator from 'random-seed';
import fs from 'fs';
import ExecutorES8 from './algorithms/Game8/ExecutorES';
import ExecutorGA8 from './algorithms/Game8/ExecutorGA';
import CandidateFactory8 from './algorithms/Game8/CandidateFactory';


const roundArray = [5,50,250,1000];

let result = 0;
const playerCount = 3;
const lastResult = new Array(playerCount);
const lastResult2 = new Array(playerCount);

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
        for (let i = 0; i < playerCount; i++) {
            resultArray[mode][scaleCounter][roundCounter][i] = lastResult[i];
            result += lastResult2[i];
            lastResult[i] = 0;
            lastResult2[i] = 0;
        }
    }
}

function newGameState(data) {
    lastResult2[data.playerNumber] = data.y;
    lastResult[data.playerNumber] = data.properties;
}

function testGame8Execution(type='NE') {
    let executor;
    let startDate;
    let factory;
    let generator;

    const gameRounds = 10;
    const seedValue = Math.random() * 10000;
    
    const generationCount = 100;
    const populationSize = 100;
    const timeout = '0';

    const mutationRate = 0.2;

    const maxTestScaling = 4;

    resultArray = new Array(2);


    log('+--------------------------------+');
    log(`|              GAME8             |`);
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
        resultArray[0][scaleCounter] = new Array(rounds)
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            resultArray[0][scaleCounter][roundCounter] = new Array(3);
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory8(dynSeedValue);
            executor = new ExecutorGA8(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
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
            resultArray[1][scaleCounter][roundCounter] = new Array(3);
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory8(gameRounds, dynSeedValue);
            executor = new ExecutorES8(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        log('Result: ', result);
        log('Runtime: ', Date.now() - startDate);
        log('--------------');
    }

    log('\n-------------- Statistics ----------------');
    for (let i = 0; i < 2; i++) {
        log('\n-------------- ', i, ' ----------------');
        for (let j = 0; j < 3; j++) {
            log('\n----- Player ,', j, ' -----');
            const results = new Array(4).fill(0);
            for (let k = 0; k < 4; k++) {
                for (let l = 0; l < roundArray[k]; l++) {
                    for (let m = 0; m < results.length; m++) {
                        results[m] += parseFloat(resultArray[i][k][l][j][m]);
                    }
                }
            }
            log('1: ', (results[0] / 1305));
            log('2: ', (results[1] / 1305));
            log('3: ', (results[2] / 1305));
            log('4: ', (results[3] / 1305));
            log('\n---------------------------');
        }
        log('\n------------------------------------------');
    }
    log('\n------------------------------------------');

    fs.writeFile("results/game8.txt", output, function(err) {
        if(err) {
            return log(err);
        }
    }); 
}

export default testGame8Execution;