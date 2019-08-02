
import Generator from 'random-seed';
import fs from 'fs';
import CandidateFactory7 from './algorithms/Game7/CandidateFactory';
import { proportionalSelection, randomSelection, tournamentSelection, completeReplacement, randomReplacement, elitismReplacement } from './algorithms/util';


let parameters = {};
let csvStream;

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
let bestSetting = new Array(4);
let roundCounter = 0;


function log() {
    console.log(...arguments);
    [].forEach.call(arguments, function (arg) {
        output += arg;
    });
    output += '\n';
}

function newMessage(gen, type, msg) {
    if (type === 'fin') {
        resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex][roundIndex] = lastResult;
    }

    if (lastResult === 0) {
        zeroCount += 1;
    } else {
        noneZeroCount += 1;
    }

    result = lastResult;
    lastResult = 0;
}

function newGameState(data) {
    lastResult = data.y;
}

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

                            console.log(`${algoType};${type};${parameters.populationSizeArray[populationIndex]};${parameters.generationCountArray[generationCountIndex]};${parameters.gameRounds};${parameters.selectionPressureArray[selectionPressureIndex]};${parameters.mutationRateArray[mutationIndex]};${selectionFunctionArray[selectionFunctionIndex].name};${replacementFunctionArray[replacementFunctionIndex].name};${useOptimization};`);

                            for (let p = 0; p < parameters.maxRounds; p++) {
                                roundIndex = p;
                                const dynSeedValue = generator.range(10000);
                                const factory = new Factory(parameters.gameRounds, dynSeedValue);
                                const executor = new Executor(parameters.generationCountArray[generationCountIndex], dynSeedValue, parameters.populationSizeArray[populationIndex], timeout, parameters.selectionPressureArray[selectionPressureIndex], parameters.mutationRateArray[mutationIndex], factory, newGameState, newMessage, selectionFunctionArray[selectionFunctionIndex], replacementFunctionArray[replacementFunctionIndex], useOptimization);
                                executor.start();
                            }

                            const time = Date.now() - startDate;

                            const newOutputLine = `${algoType};${type};${parameters.populationSizeArray[populationIndex]};${parameters.generationCountArray[generationCountIndex]};${parameters.gameRounds};${parameters.selectionPressureArray[selectionPressureIndex]};${parameters.mutationRateArray[mutationIndex]};${selectionFunctionArray[selectionFunctionIndex].name};${replacementFunctionArray[replacementFunctionIndex].name};${useOptimization};${time};${result}\n`;
                            console.log('Line added', lineCount);
                            lineCount++;
                            csvStream.write(newOutputLine, 'utf-8');

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


function testGame7Execution(type='NE', candidateFactory, executorGA, executorES, executorBF, name) {
    let factory;

    const parametersFile = fs.readFileSync(`${name}.json`);
    parameters = JSON.parse(parametersFile);

    const seedValue = Math.random() * 10000; // = 6664.58;
    resultArray = new Array(3);

    const header = 'Algo;Type;Population;Generations;GameRounds;SelectionPressure;MutationRate;SelectionFunction;ReplacementFunction;Optimized;Time;Result\n'
    fs.writeFile(`results/${name}.csv`, header, function(err) {
        if(err) {
            return log(err);
        }
    });
    csvStream = fs.createWriteStream(`results/${name}.csv`, { flags : 'a' });


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

    log('\n-------------- Test Results ----------------');
    resultArray[2] = new Array(parameters.gameRounds);
    modeIndex = 2;

    for (let i = 0; i < parameters.gameRounds; i++) {
        const rounds = parameters.gameRounds[i];
        result = 0;
        roundCounter = i;
        resultArray[2][roundCounter] = new Array(parameters.maxRounds).fill(0);
        for (let j = 0; j < parameters.maxRounds; j++) {
            // const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory7(rounds, seedValue);
            const maxValue = factory.getMaxValue();
            resultArray[modeIndex][roundCounter][j] = maxValue;
            result += maxValue;
        }
        log('Result: ', result);

    }

    log('--------------------------------------');

    let gaDiff = 0;
    let esDiff = 0;

    let gaEq = 0;
    let esEq = 0;

    for (let i = 0; i < parameters.maxRounds; i++) {
        for (let j = 0; j < resultArray[0][i].length; j++) {
            if (resultArray[2][i][j] - resultArray[0][i][j] !== 0) {
                gaDiff += 1;
            } else {
                gaEq += 1;
            }
        }
    }

    for (let i = 0; i < parameters.maxRounds; i++) {
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

    fs.writeFile(`results/${name}.txt`, output, function(err) {
        if(err) {
            return log(err);
        }
    });
}

export default testGame7Execution;