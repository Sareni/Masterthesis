
import Generator from 'random-seed';
import fs from 'fs';
import { Calculator, proportionalSelection, randomSelection, tournamentSelection, completeReplacement, randomReplacement, elitismReplacement } from './algorithms/util';


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
let lastResult;

let resultArray;


let output = '';
let bestSetting = new Array(4);

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
            for (let i = 0; i < parameters.playerCount; i++) {
                resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex][roundIndex] = lastResult[i];
                lastResult[i] = 0;
                result += lastResult[i];
            }
        } else {
            for (let i = 0; i < parameters.playerCount; i++) {
                resultArray[modeIndex][roundIndex] = lastResult[i];
                lastResult[i] = 0;
                result += lastResult[i];
            }
        }

    }
}

function newGameState(data) {
    lastResult[data.playerNumber] = data.y;
}

function testLoop(Factory, Executor, seedValue, type, useOptimization, mi, algoType, calculator) {
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
                                const executor = new Executor(parameters.generationCountArray[generationCountIndex], dynSeedValue, parameters.populationSizeArray[populationIndex], timeout, parameters.selectionPressureArray[selectionPressureIndex], parameters.mutationRateArray[mutationIndex], factory, newGameState, newMessage, selectionFunctionArray[selectionFunctionIndex], replacementFunctionArray[replacementFunctionIndex], useOptimization, calculator);
                                executor.start();
                            }

                            const time = Date.now() - startDate;

                            const newOutputLine = `${algoType};${type};${parameters.populationSizeArray[populationIndex]};${parameters.generationCountArray[generationCountIndex]};${parameters.playerCount};${parameters.strategyCount};${parameters.selectionPressureArray[selectionPressureIndex]};${parameters.mutationRateArray[mutationIndex]};${selectionFunctionArray[selectionFunctionIndex].name};${replacementFunctionArray[replacementFunctionIndex].name};${useOptimization};${time};${result}\n`;
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

                                if (calculator) {
                                    calculator.lastIsBest();
                                }
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

function testGame9Execution(type='NE', candidateFactory, executorGA, executorES, executorBF, name) {

    let executor;
    let factory;

    let calculator = null;

    const parametersFile = fs.readFileSync(`${name}.json`);
    parameters = JSON.parse(parametersFile);

    lastResult = new Array(parameters.playerCount).fill(0);

    const seedValue = Math.random() * 10000; // = 6664.58;
    resultArray = new Array(5);

    const header = 'Algo;Type;Population;Generations;Players;Strategies;SelectionPressure;MutationRate;SelectionFunction;ReplacementFunction;Optimized;Time;Result\n'
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
    if (name === 'game9') {
        calculator = new Calculator();
    }
    testLoop(candidateFactory, executorGA, seedValue, type, false, 0, 'GA');
    log('-------------- optimiert');
    testLoop(candidateFactory, executorGA, seedValue, type, true, 1, 'GA');
    log('--------------');
    if (calculator) {
        calculator.finish(`results/${name}`);
        calculator = new Calculator();
    }
    log('-------------- ES ----------------');
    testLoop(candidateFactory, executorES, seedValue, type, false, 2, 'ES');
    log('-------------- optimiert');
    testLoop(candidateFactory, executorES, seedValue, type, true, 3, 'ES');
    log('--------------');

    if (calculator) {
        calculator.finish(`results/${name}`);
    }


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


    fs.writeFile(`results/${name}.txt`, output, function(err) {
        if(err) {
            return log(err);
        }
    }); 
}

export default testGame9Execution;