
import Generator from 'random-seed';
import ExecutorES8 from './algorithms/Game8/ExecutorES';
import ExecutorGA8 from './algorithms/Game8/ExecutorGA';
import CandidateFactory8 from './algorithms/Game8/CandidateFactory';


const roundArray = [5,50,250,1000];

let result = 0;
const playerCount = 3;
const lastResult = new Array(playerCount);

let resultArray;
let mode = 0;
let scaleCounter = 0;
let roundCounter = 0;

function newMessage(gen, type, msg) {
    if (type === 'fin') {
        for (let i = 0; i < playerCount; i++) {
            result += lastResult[i];
            lastResult[i] = 0;
        }

    }
}

function newGameState(data) {
    lastResult[data.playerNumber] = data.y;
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
            factory = new CandidateFactory8(dynSeedValue);
            executor = new ExecutorGA8(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
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
            factory = new CandidateFactory8(gameRounds, dynSeedValue);
            executor = new ExecutorES8(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        console.log('Result: ', result);
        console.log('Runtime: ', Date.now() - startDate);
        console.log('--------------');
    }
}

export default testGame8Execution;