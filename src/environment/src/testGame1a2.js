
import Generator from 'random-seed';
import fs from 'fs';
import { proportionalSelection, randomSelection, tournamentSelection, completeReplacement, randomReplacement, elitismReplacement } from './algorithms/util';


let parameters = {};

const selectionFunctionArray = [proportionalSelection, randomSelection, tournamentSelection]; 
const replacementFunctionArray = [completeReplacement, randomReplacement, elitismReplacement];

let modeIndex = 0;
let populationIndex = 0;
let generationCountIndex = 0;
let mutationIndex = 0;
let selectionFunctionIndex = 0;
let replacementFunctionIndex = 0;
let selectionPressureIndex = 0;
let roundIndex = 0;

let lineCount = 0;

let result = 0;
let lastResult = 0;

let resultArray;

let zeroCount = 0;
let noneZeroCount = 0;

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

        if (modeIndex !== 4) {
            resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex][roundIndex] = lastResult;
            
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

function testLoop(Factory, Executor, seedValue, type, useOptimization, mi, algoType) {
    modeIndex = mi;
    resultArray[modeIndex] = new Array(parameters.populationSizeArray.length);
    const timeout = '0';

    for (let i = 0; i < parameters.populationSizeArray.length; i++) {
        populationIndex = i;
        resultArray[modeIndex][populationIndex] = new Array(parameters.generationCountArray.length);
        // log('Population: ', populationSizeArray[populationIndex]);
        
        for (let j = 0; j < parameters.generationCountArray.length; j++) {
            generationCountIndex = j;
            resultArray[modeIndex][populationIndex][generationCountIndex] = new Array(parameters.mutationRateArray.length);
            // log('GenerationCount: ', generationCountArray[generationCountIndex]);

            for (let k = 0; k < parameters.mutationRateArray.length; k++) {
                mutationIndex = k;
                resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex] = new Array(selectionFunctionArray.length);
                // log('Mutation: ', mutationRateArray[mutationIndex]);

                for (let l = 0; l < selectionFunctionArray.length; l++) {
                    selectionFunctionIndex = l;
                    resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex] = new Array(replacementFunctionArray.length);
                    // log('SelectionFunction: ', selectionFunctionArray[selectionFunctionIndex].name);

                    for (let m = 0; m < replacementFunctionArray.length; m++) {
                        replacementFunctionIndex = m;
                        resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex] = new Array(parameters.selectionPressureArray.length);
                        // log('ReplacementFunction: ', replacementFunctionArray[replacementFunctionIndex].name);

                        for (let n = 0; n < parameters.selectionPressureArray.length; n++) {
                            selectionPressureIndex = n;
                            resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex] = new Array(parameters.maxRounds);
                            bestSetting[modeIndex] = { populationIndex: -1 };

                            result = 0;
                            const startDate = Date.now();
                            const generator = Generator.create(seedValue);

                            console.log(`${algoType};${type};${parameters.populationSizeArray[populationIndex]};${parameters.generationCountArray[generationCountIndex]};${parameters.playerCount};${parameters.strategyCount};${parameters.selectionPressureArray[selectionPressureIndex]};${parameters.mutationRateArray[mutationIndex]};${selectionFunctionArray[selectionFunctionIndex].name};${replacementFunctionArray[replacementFunctionIndex].name};${useOptimization};`);

                            for (let p = 0; p < parameters.maxRounds; p++) {
                                roundIndex = p;
                                const dynSeedValue = generator.range(10000);
                                const factory = new Factory(parameters.playerCount || parameters.treeDepth, parameters.strategyCount, dynSeedValue, type);
                                const executor = new Executor(parameters.generationCountArray[generationCountIndex], dynSeedValue, parameters.populationSizeArray[populationIndex], timeout, parameters.selectionPressureArray[selectionPressureIndex], parameters.mutationRateArray[mutationIndex], factory, newGameState, newMessage, selectionFunctionArray[selectionFunctionIndex], replacementFunctionArray[replacementFunctionIndex], useOptimization);
                                executor.start();
                            }

                            const time = Date.now() - startDate;

                            const newOutputLine = `${algoType};${type};${parameters.populationSizeArray[populationIndex]};${parameters.generationCountArray[generationCountIndex]};${parameters.playerCount};${parameters.strategyCount};${parameters.selectionPressureArray[selectionPressureIndex]};${parameters.mutationRateArray[mutationIndex]};${selectionFunctionArray[selectionFunctionIndex].name};${replacementFunctionArray[replacementFunctionIndex].name};${useOptimization};${time};${result}\n`;
                            console.log('Line added', lineCount);
                            lineCount++;
                            fs.appendFile(`results/${name}.csv`, newOutputLine, function(err) {
                                if(err) {
                                    return log(err);
                                }
                            }); 

                            if (result > bestSetting[modeIndex].result || bestSetting[modeIndex].populationIndex === -1) {
                                bestSetting[modeIndex].time = time;
                                bestSetting[modeIndex].populationIndex = populationIndex;
                                bestSetting[modeIndex].generationCountIndex = generationCountIndex;
                                bestSetting[modeIndex].mutationIndex = mutationIndex;
                                bestSetting[modeIndex].selectionFunctionIndex = selectionFunctionIndex;
                                bestSetting[modeIndex].replacementFunctionIndex = replacementFunctionIndex;
                                bestSetting[modeIndex].selectionPressureIndex = selectionPressureIndex;
                                bestSetting[modeIndex].result = result;
                            }
                        }
                    }
                }
            }
        }
    }
    log('Population:', parameters.populationSizeArray[bestSetting[modeIndex].populationIndex]);
    log('Generations:', parameters.generationCountArray[bestSetting[modeIndex].generationCountIndex]);
    log('Mutation:', parameters.mutationRateArray[bestSetting[modeIndex].mutationIndex]);
    log('Selection Function:', selectionFunctionArray[bestSetting[modeIndex].selectionFunctionIndex].name);
    log('Replacement Function:', replacementFunctionArray[bestSetting[modeIndex].replacementFunctionIndex].name);
    log('Result:', bestSetting[modeIndex].result);
    log('Time:', bestSetting[modeIndex].time);
}


function testGame1a2Execution(type='NE', candidateFactory, executorGA, executorES, executorBF, name) {

    let executor;
    let factory;

    const parametersFile = fs.readFileSync(`${name}.json`);
    parameters = JSON.parse(parametersFile);

    const seedValue = Math.random() * 10000;
    resultArray = new Array(5);

    const header = 'Algo;Type;Population;Generations;Players;Strategys;SelectionPressure;MutationRate;SelectionFunction;ReplacementFunction;Optimized;Time;Result\n'
    fs.writeFile(`results/${name}.csv`, header, function(err) {
        if(err) {
            return log(err);
        }
    }); 
    log('+--------------------------------+');
    log(`|              ${name.toUpperCase()}             |`);
    log('+--------------------------------+');
    log(`|              ${type}                |`);
    log('+--------------------------------+');

    log('-------------- GA ----------------');
    
    testLoop(candidateFactory, executorGA, seedValue, type, false, 0, 'GA');

    log('0:', zeroCount);
    zeroCount = 0;
    log('no 0:', noneZeroCount);
    noneZeroCount = 0;

    log('-------------- optimiert');
    
    testLoop(candidateFactory, executorGA, seedValue, type, true, 1, 'GA');

    log('0:', zeroCount);
    zeroCount = 0;
    log('no 0:', noneZeroCount);
    noneZeroCount = 0;

    log('--------------');


    log('-------------- ES ----------------');
    testLoop(candidateFactory, executorES, seedValue, type, false, 2, 'ES');

    log('0:', zeroCount);
    zeroCount = 0;
    log('no 0:', noneZeroCount);
    noneZeroCount = 0;

    log('-------------- optimiert');
    
    testLoop(candidateFactory, executorES, seedValue, type, true, 3, 'ES');

    log('0:', zeroCount);
    zeroCount = 0;
    log('no 0:', noneZeroCount);
    noneZeroCount = 0;

    log('--------------');

    modeIndex = 4;
    resultArray[modeIndex] = new Array(parameters.maxRounds);

    if (executorBF) {
        log('-------------- BF ----------------');

        const generator = Generator.create(seedValue);
        const startDate = Date.now();
        result = 0;

        for (let k = 0; k < parameters.maxRounds; k++) {
            roundIndex = k;
            const dynSeedValue = generator.range(10000);
            factory = new candidateFactory(parameters.playerCount, parameters.strategyCount, dynSeedValue, type);
            executor = new executorBF(0, dynSeedValue, 0, '0', 0, 0, factory, newGameState, newMessage);
            executor.start();
        }

        log('Result: ', result);
        log('Runtime: ', Date.now() - startDate);
    
        log('--------------');
    }    

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


    for (let i = 0; i < parameters.populationSizeArray.length; i++) {
        for (let j = 0; j < parameters.generationCountArray.length; j++) {
            for (let k = 0; k < parameters.mutationRateArray.length; k++) {
                for (let l = 0; l < selectionFunctionArray.length; l++) {
                    for (let m = 0; m < replacementFunctionArray.length; m++) {
                        for (let n = 0; n < parameters.selectionPressureArray.length; n++) {
                            for (let p = 0; p < parameters.maxRounds; p++) {
                                for (let q = 0; q < 4; q++) {
                                    if (resultArray[q][i][j][k][l][m][n][p] === 0) {
                                        if (q === 0) {
                                            gaEq += 1;
                                        } else if (q === 1) {
                                            gaOptEq += 1;
                                        } else if (q === 2) {
                                            esEq += 1;
                                        } else if (q === 3) {
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
    }


    for (let i = 0; i < bestSetting.length; i++) {
        const bs = bestSetting[i];
        for (let j = 0; j < parameters.maxRounds; j++) {
            if (resultArray[i][bs.populationIndex][bs.generationCountIndex][bs.mutationIndex][bs.selectionFunctionIndex][bs.replacementFunctionIndex][bs.selectionPressureIndex][j] === resultArray[4][j]) {
                diffs[i] += 1;
            }
            if (resultArray[i][bs.populationIndex][bs.generationCountIndex][bs.mutationIndex][bs.selectionFunctionIndex][bs.replacementFunctionIndex][bs.selectionPressureIndex][j] === 0) {
                eqs[i] += 1;
            }
        }
    }

    let bfEq = 0;
    for (let k = 0; k < parameters.maxRounds; k++) {
        if (resultArray[4][k] === 0) {
            bfEq += 1;
        }
    }
    

    log('Diff - GA: ', diffs[0], ', ES: ', diffs[2]);
    log('--------------\n');
    log('Diff - GA (opt): ', diffs[1], ', ES (opt): ', diffs[3]);
    log('--------------\n');
    log('Eq - GA: ', eqs[0], ', ES: ', eqs[2]);
    log('--------------\n');
    log('Eq - GA (opt): ', eqs[1], ', ES (opt): ', eqs[3]);
    log('--------------\n');
    log('Eq - GA (new): ', gaEq, ', BF (new): ', bfEq);
    log('--------------\n');

    fs.writeFile(`results/${name}.txt`, output, function(err) {
        if(err) {
            return log(err);
        }
    });
}

export default testGame1a2Execution;