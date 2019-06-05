
import Generator from 'random-seed';
import ExecutorBF1 from './algorithms/Game1/ExecutorBF';
import ExecutorES1 from './algorithms/Game1/ExecutorES';
import ExecutorGA1 from './algorithms/Game1/ExecutorGA';
import CandidateFactory1 from './algorithms/Game1/CandidateFactory';
import { proportionalSelection, randomSelection, tournamentSelection, completeReplacement, randomReplacement, elitismReplacement } from './algorithms/util';


const roundArray = [5,50,250,1000];

const populationSizeArray = [100, 200];
const generationCountArray = [75, 150];
const mutationRateArray = [0.1, 0.3];


const playerCount = 5;
const strategyCount = 10;

const selectionFunctionArray = [proportionalSelection, randomSelection, tournamentSelection]; 
const replacementFunctionArray = [completeReplacement, randomReplacement, elitismReplacement]; 

let result = 0;
let lastResult = 0;

let resultArray;

const maxRounds = 10;


let modeIndex = 0;
let populationIndex = 0;
let generationCountIndex = 0;
let mutationIndex = 1;
let selectionFunctionIndex = 1;
let replacementFunctionIndex = 2;
let roundIndex = 0;

function newMessage(gen, type, msg) {
    if (type === 'fin') {

        /* if (modeIndex !== 4) {
            resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][roundIndex] = lastResult;
            
        } else {          
            resultArray[modeIndex][roundIndex] = lastResult;
        } */

        if (lastResult === 0) {
            result += 1;
        }
       
        // result += lastResult;
        lastResult = 0;
    }
  }

function newGameState(data) {
    lastResult = data.y;
}

let bestSetting = new Array(4);

function testLoop(Executor, seedValue, type, useOptimization, mi) {
    modeIndex = mi;
    resultArray[modeIndex] = new Array(populationSizeArray.length);
    const timeout = '0';

    for (let i = 0; i < populationSizeArray.length; i++) {
        populationIndex = i;
        resultArray[modeIndex][populationIndex] = new Array(generationCountArray.length);
        // console.log('Population: ', populationSizeArray[populationIndex]);
        
        for (let j = 0; j < generationCountArray.length; j++) {
            generationCountIndex = j;
            resultArray[modeIndex][populationIndex][generationCountIndex] = new Array(mutationRateArray.length);
            // console.log('GenerationCount: ', generationCountArray[generationCountIndex]);

            for (let k = 0; k < mutationRateArray.length; k++) {
                mutationIndex = k;
                resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex] = new Array(selectionFunctionArray.length);
                // console.log('Mutation: ', mutationRateArray[mutationIndex]);

                for (let l = 0; l < selectionFunctionArray.length; l++) {
                    selectionFunctionIndex = l;
                    resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex] = new Array(replacementFunctionArray.length);
                    // console.log('SelectionFunction: ', selectionFunctionArray[selectionFunctionIndex].name);

                    for (let m = 0; m < replacementFunctionArray.length; m++) {
                        replacementFunctionIndex = m;
                        resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex] = new Array(maxRounds);
                        // console.log('ReplacementFunction: ', replacementFunctionArray[replacementFunctionIndex].name);

                        bestSetting[modeIndex] = { populationIndex: -1 };

                        result = 0;
                        const startDate = Date.now();
                        const generator = Generator.create(seedValue);


                        for (let n = 0; n < maxRounds; n++) {
                            roundIndex = n
                            const dynSeedValue = generator.range(10000);
                            const factory = new CandidateFactory1(playerCount,strategyCount, dynSeedValue, type);
                            const executor = new Executor(generationCountArray[generationCountIndex], dynSeedValue, populationSizeArray[populationIndex], timeout, mutationRateArray[mutationIndex], factory, newGameState, newMessage, selectionFunctionArray[selectionFunctionIndex], replacementFunctionArray[replacementFunctionIndex], useOptimization);
                            executor.start();
                        }

                        if (result > bestSetting[modeIndex].result || bestSetting[modeIndex].populationIndex === -1) {
                            bestSetting[modeIndex].time = Date.now() - startDate;
                            bestSetting[modeIndex].populationIndex = populationIndex;
                            bestSetting[modeIndex].generationCountIndex = generationCountIndex;
                            bestSetting[modeIndex].mutationIndex = mutationIndex;
                            bestSetting[modeIndex].selectionFunctionIndex = selectionFunctionIndex;
                            bestSetting[modeIndex].replacementFunctionIndex = replacementFunctionIndex;
                            bestSetting[modeIndex].result = result;
                        }
                        //console.log('Result: ', result);
                        //console.log('Runtime: ', Date.now() - startDate);
                        //console.log('--------------');
                    }
                }
            }
        }
    }
    console.log('Population:', populationSizeArray[bestSetting[modeIndex].populationIndex]);
    console.log('Generations:', generationCountArray[bestSetting[modeIndex].generationCountIndex]);
    console.log('Mutation:', mutationRateArray[bestSetting[modeIndex].mutationIndex]);
    console.log('Selection Function:', selectionFunctionArray[bestSetting[modeIndex].selectionFunctionIndex].name);
    console.log('Replacement Function:', replacementFunctionArray[bestSetting[modeIndex].replacementFunctionIndex].name);
    console.log('Result:', bestSetting[modeIndex].result);
    console.log('Time:', bestSetting[modeIndex].time);
}


function testGame1Execution(type='NE') {

    let executor;
    let factory;

    const seedValue = 6664.58; //Math.random() * 10000;
    
    const generationCount = 100;
    const populationSize = 100;
    const timeout = '0';

    const mutationRate = 0.2;

    const maxTestScaling = 4;
    const generator = Generator.create(seedValue);

    resultArray = new Array(5);

    for (let n = 0; n < 100; n++) {
        roundIndex = n
        const dynSeedValue = generator.range(10000);
        const factory = new CandidateFactory1(playerCount,strategyCount, dynSeedValue, type);
        const executor = new ExecutorGA1(generationCountArray[generationCountIndex], dynSeedValue, populationSizeArray[populationIndex], timeout, mutationRateArray[mutationIndex], factory, newGameState, newMessage, selectionFunctionArray[selectionFunctionIndex], replacementFunctionArray[replacementFunctionIndex], false);
        executor.start();
    }

    console.log('Result: ', result);

    /*console.log('+--------------------------------+');
    console.log(`|              ${type}                |`);
    console.log('+--------------------------------+');

    console.log('-------------- GA ----------------');
    
    testLoop(ExecutorGA1, seedValue, type, false, 0);

    console.log('-------------- optimiert');
    
    testLoop(ExecutorGA1, seedValue, type, true, 1);

    console.log('--------------');


    console.log('-------------- ES ----------------');
    
    testLoop(ExecutorES1, seedValue, type, false, 2);

    console.log('-------------- optimiert');
    
    testLoop(ExecutorES1, seedValue, type, true, 3);

    console.log('--------------');

    console.log('-------------- BF ----------------');

    const generator = Generator.create(seedValue);
    modeIndex = 4;
    resultArray[modeIndex] = new Array(maxRounds).fill(0);
    const startDate = Date.now();
    result = 0;

    for (let i = 0; i < maxRounds; i++) {
        roundIndex = i;
        const dynSeedValue = generator.range(10000);
        factory = new CandidateFactory1(playerCount,strategyCount, dynSeedValue, type);
        executor = new ExecutorBF1(0, dynSeedValue, 0, '0', 0, factory, newGameState, newMessage);
        executor.start();
    }

    console.log('Result: ', result);
    console.log('Runtime: ', Date.now() - startDate);

    console.log('--------------');

    /* for (let i = 0; i < maxTestScaling; i++) {
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
            executor = new ExecutorES1(generationCount, dynSeedValue, populationSize, timeout, mutationRate*2, factory, newGameState, newMessage);
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

    } */

    /* let gaDiff = 0;
    let esDiff = 0;

    let gaEq = 0;
    let esEq = 0;

    let gaOptDiff = 0;
    let esOptDiff = 0;

    let gaOptEq = 0;
    let esOptEq = 0;


    let diffs = new Array(4).fill(0);
    let eqs = new Array(4).fill(0);


    for (let i = 0; i < populationSizeArray.length; i++) {
        for (let j = 0; j < generationCountArray.length; j++) {
            for (let k = 0; k < mutationRateArray.length; k++) {
                for (let l = 0; l < selectionFunctionArray.length; l++) {
                    for (let m = 0; m < replacementFunctionArray.length; m++) {
                        for (let n = 0; n < maxRounds; n++) {
                            if (resultArray[0][i][j][k][l][m][n] === 0) {
                                gaEq += 1;
                            }
                        }
                    }
                }
            }
        }
    }


    for (let i = 0; i < bestSetting.length; i++) {
        const bs = bestSetting[i];
        for (let j = 0; j < maxRounds; j++) {
            console.log(resultArray[i][bs.populationIndex][bs.generationCountIndex][bs.mutationIndex][bs.selectionFunctionIndex][bs.replacementFunctionIndex][j], resultArray[4][j]);
            console.log('--------------');
            if (resultArray[i][bs.populationIndex][bs.generationCountIndex][bs.mutationIndex][bs.selectionFunctionIndex][bs.replacementFunctionIndex][j] === resultArray[4][j]) {
                diffs[i] += 1;
            }
            if (resultArray[i][bs.populationIndex][bs.generationCountIndex][bs.mutationIndex][bs.selectionFunctionIndex][bs.replacementFunctionIndex][j] === 0) {
                eqs[i] += 1;
            }
        }
    }

    let bfEq = 0;

    for (let i = 0; i < maxRounds; i++) {
        if (resultArray[4][i] === 0) {
            bfEq += 1;
        }
    }

    console.log('Diff - GA: ', diffs[0], ', ES: ', diffs[2]);
    console.log('--------------\n');
    console.log('Diff - GA (opt): ', diffs[1], ', ES (opt): ', diffs[3]);
    console.log('--------------\n');
    console.log('Eq - GA: ', eqs[0], ', ES: ', eqs[2]);
    console.log('--------------\n');
    console.log('Eq - GA (opt): ', eqs[1], ', ES (opt): ', eqs[3]);
    console.log('--------------\n');

    console.log('Eq - GA (new): ', gaEq, ', BF (new): ', bfEq);
    console.log('--------------\n'); */
}

export default testGame1Execution;