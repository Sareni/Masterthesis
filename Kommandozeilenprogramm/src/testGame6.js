

import Generator from 'random-seed';
import fs from 'fs';
import { proportionalSelection, randomSelection, tournamentSelection, completeReplacement, randomReplacement, elitismReplacement } from './algorithms/util';


let parameters = {};
let csvStream;

let result = 0;
let lastResultsX;
let lastResultsY;
let lastResultsFitness;


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

let resultArray;


const playerCount = 2;
lastResultsX = new Array(playerCount);
lastResultsY = new Array(playerCount);
lastResultsFitness = new Array(playerCount);

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
        let avgX = 0;
        let avgY = 0;
        let tmpResult = 0;

        for (let j = 0; j < playerCount; j++) {
            avgX += lastResultsX[j];
            avgY += lastResultsY[j];
        }
        avgX = avgX / playerCount;
        avgY = avgY / playerCount;

        for (let i = 0; i < playerCount; i++) {
            tmpResult += Math.sqrt(Math.pow((lastResultsX[i] - avgX),2) + Math.pow((lastResultsY[i] - avgY),2));
            lastResultsFitness[i] = 0;
        }

        resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex][roundIndex] = tmpResult;
        result += tmpResult;
    }
  }

function newGameState(data) {
    lastResultsX[data.playerNumber-1] = data.x;
    lastResultsY[data.playerNumber-1] = data.y;
    lastResultsFitness[data.playerNumber-1] = data.fitness;
}


function testLoop(Factory, Executor, seedValue, type, useOptimization, mi, algoType) {
    modeIndex = mi;
    resultArray[modeIndex] = new Array(parameters.populationSizeArray.length);
    const timeout = '0';
    bestSetting[modeIndex] = { populationIndex: -1 };

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

                            result = 0;

                            const startDate = Date.now();
                            const generator = Generator.create(seedValue);

                            console.log(`${algoType};${type};${parameters.populationSizeArray[populationIndex]};${parameters.generationCountArray[generationCountIndex]};${parameters.playerCount};${parameters.xMax};${parameters.yMax};${parameters.selectionPressureArray[selectionPressureIndex]};${parameters.mutationRateArray[mutationIndex]};${selectionFunctionArray[selectionFunctionIndex].name};${replacementFunctionArray[replacementFunctionIndex].name};${useOptimization};`);

                            for (let p = 0; p < parameters.maxRounds; p++) {
                                roundIndex = p;
                                const dynSeedValue = generator.range(10000);
                                const factory = new Factory(parameters.playerCount, parameters.xMax, parameters.yMax, dynSeedValue);
                                const executor = new Executor(parameters.generationCountArray[generationCountIndex], dynSeedValue, parameters.populationSizeArray[populationIndex], timeout, parameters.selectionPressureArray[selectionPressureIndex], parameters.mutationRateArray[mutationIndex], factory, newGameState, newMessage, selectionFunctionArray[selectionFunctionIndex], replacementFunctionArray[replacementFunctionIndex], useOptimization);
                                executor.start();
                            }

                            const time = Date.now() - startDate;

                            const newOutputLine = `${algoType};${type};${parameters.populationSizeArray[populationIndex]};${parameters.generationCountArray[generationCountIndex]};${parameters.playerCount};${parameters.xMax};${parameters.yMax};${parameters.selectionPressureArray[selectionPressureIndex]};${parameters.mutationRateArray[mutationIndex]};${selectionFunctionArray[selectionFunctionIndex].name};${replacementFunctionArray[replacementFunctionIndex].name};${useOptimization};${time};${result}\n`;
                            console.log('Line added', lineCount);
                            lineCount++;
                            csvStream.write(newOutputLine, 'utf-8');


                            if (result < bestSetting[modeIndex].result || bestSetting[modeIndex].populationIndex === -1) {
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

function testGame6Execution(type='NE', candidateFactory, executorGA, executorES, executorBF, name) {

    const parametersFile = fs.readFileSync(`${name}.json`);
    parameters = JSON.parse(parametersFile);

    const seedValue = Math.random() * 10000;
    resultArray = new Array(4);

    const header = 'Algo;Type;Population;Generations;Players;xMax;yMax;SelectionPressure;MutationRate;SelectionFunction;ReplacementFunction;Optimized;Time;Result\n'
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

    log('-------------- optimiert');
    testLoop(candidateFactory, executorGA, seedValue, type, true, 1, 'GA');

    log('--------------');

    log('-------------- ES ----------------');
    testLoop(candidateFactory, executorES, seedValue, type, false, 2, 'ES');

    log('-------------- optimiert');
    testLoop(candidateFactory, executorES, seedValue, type, true, 3, 'ES');

    log('--------------');

    fs.writeFile(`results/${name}.txt`, output, function(err) {
        if(err) {
            return log(err);
        }
    }); 
}

export default testGame6Execution;