
import Generator from 'random-seed';
import ExecutorBF2 from './algorithms/Game2/ExecutorBF';
import ExecutorES2 from './algorithms/Game2/ExecutorES';
import ExecutorGA2 from './algorithms/Game2/ExecutorGA';
import CandidateFactory2 from './algorithms/Game2/CandidateFactory';
import { proportionalSelection, randomSelection, tournamentSelection, completeReplacement, randomReplacement, elitismReplacement } from './algorithms/util';


const populationSizeArray = [30, 60];
const generationCountArray = [50, 100];
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
let mutationIndex = 0;
let selectionFunctionIndex = 0;
let replacementFunctionIndex = 0;
let roundIndex = 0;

let zeroCount = 0;
let noneZeroCount = 0;

function newMessage(gen, type, msg) {
    if (type === 'fin') {

        if (modeIndex !== 4) {
            resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][roundIndex] = lastResult;
            
        } else {          
            resultArray[modeIndex][roundIndex] = lastResult;
        }
        if (lastResult === 0) {
            zeroCount += 1;
        } else {
            noneZeroCount += 1;
        }

        result += lastResult;
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
                            const factory = new CandidateFactory2(playerCount,strategyCount, dynSeedValue, type);
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

    const seedValue = Math.random() * 10000;
    resultArray = new Array(5);

    console.log('+--------------------------------+');
    console.log(`|              ${type}                |`);
    console.log('+--------------------------------+');

    console.log('-------------- GA ----------------');
    
    testLoop(ExecutorGA2, seedValue, type, false, 0);

    console.log('0:', zeroCount);
    zeroCount = 0;
    console.log('no 0:', noneZeroCount);
    noneZeroCount = 0;

    console.log('-------------- optimiert');
    
    testLoop(ExecutorGA2, seedValue, type, true, 1);

    console.log('0:', zeroCount);
    zeroCount = 0;
    console.log('no 0:', noneZeroCount);
    noneZeroCount = 0;

    console.log('--------------');


    console.log('-------------- ES ----------------');
    
    testLoop(ExecutorES2, seedValue, type, false, 2);

    console.log('0:', zeroCount);
    zeroCount = 0;
    console.log('no 0:', noneZeroCount);
    noneZeroCount = 0;

    console.log('-------------- optimiert');
    
    testLoop(ExecutorES2, seedValue, type, true, 3);

    console.log('0:', zeroCount);
    zeroCount = 0;
    console.log('no 0:', noneZeroCount);
    noneZeroCount = 0;

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
        factory = new CandidateFactory2(playerCount,strategyCount, dynSeedValue, type);
        executor = new ExecutorBF2(0, dynSeedValue, 0, '0', 0, factory, newGameState, newMessage);
        executor.start();
    }

    console.log('Result: ', result);
    console.log('Runtime: ', Date.now() - startDate);

    console.log('--------------');

    let gaDiff = 0;
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
                            for (let o = 0; o < 4; o++) {
                                if (resultArray[o][i][j][k][l][m][n] === 0) {
                                    if (o === 0) {
                                        gaEq += 1;
                                    } else if (o === 1) {
                                        gaOptEq += 1;
                                    } else if (o === 2) {
                                        esEq += 1;
                                    } else if (o === 3) {
                                        esOptEq += 1;
                                    }
                                }
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
            console.log(resultArray[i][bs.populationIndex][bs.generationCountIndex][bs.mutationIndex][bs.selectionFunctionIndex][bs.replacementFunctionIndex][j], '|', resultArray[4][j]);
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
    console.log('--------------\n');
}

export default testGame1Execution;