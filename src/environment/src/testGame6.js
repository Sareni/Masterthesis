

import Generator from 'random-seed';
import fs from 'fs';
import { proportionalSelection, randomSelection, tournamentSelection, completeReplacement, randomReplacement, elitismReplacement } from './algorithms/util';


let parameters = {};


let resultX = 0;
let resultY = 0;
let lastResultsX;
let lastResultsY;
let lastResultsFitness;


let resultArray;
let mode = 0;
let scaleCounter = 0;
let roundCounter = 0;

const playerCount = 2;
lastResultsX = new Array(playerCount);
lastResultsY = new Array(playerCount);
lastResultsFitness = new Array(playerCount);

const xMax = 200;
const yMax = 200;

let gaEq = 0;
let esEq = 0;

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
        let avg = 0;

        for (let j = 0; j < playerCount; j++) {
            avg += lastResultsFitness[j];
        }
        avg = avg / playerCount;

        for (let i = 0; i < playerCount; i++) {
            resultX += Math.abs(lastResultsFitness[i] - avg);
            lastResultsFitness[i] = 0;
        }
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
                            fs.appendFile("results/game1.csv", newOutputLine, function(err) {
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

function testGame6Execution(type='NE') {
    let executor;
    let factory;

    const parametersFile = fs.readFileSync('game6.json');
    parameters = JSON.parse(parametersFile);

    const seedValue = Math.random() * 10000;
    resultArray = new Array(5);

    const header = 'Algo;Type;Population;Generations;Players;Strategys;SelectionPressure;MutationRate;SelectionFunction;ReplacementFunction;Optimized;Time;Result\n'
    fs.writeFile("results/game6.csv", header, function(err) {
        if(err) {
            return log(err);
        }
    }); 


    const seedValue = Math.random() * 10000;


    const generationCount = 200;
    const populationSize = 30;
    const timeout = '0';

    const mutationRate = 0.5;

    const maxTestScaling = 4;

    resultArray = new Array(3);


    log('+--------------------------------+');
    log(`|              GAME6             |`);
    log('+--------------------------------+');
    log(`|              ${type}                |`);
    log('+--------------------------------+');

    log('-------------- GA ----------------');
    generator = Generator.create(seedValue);
    resultArray[0] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = roundArray[i];
        log('---------- ', rounds);
        resultX = 0;
        resultY = 0;
        mode = 0;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[0][scaleCounter] = new Array(rounds).fill(0);
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory6(playerCount,xMax, yMax, dynSeedValue);
            executor = new ExecutorGA6(generationCount, dynSeedValue, populationSize, timeout, mutationRate, factory, newGameState, newMessage);
            executor.start();
        }
        log('Results: ', resultX, ', ', resultY);
        log('Runtime: ', Date.now() - startDate);
        log('--------------');

    }

    log('\n-------------- ES ----------------');
    generator = Generator.create(seedValue);
    resultArray[1] = new Array(maxTestScaling);

    for (let i = 0; i < maxTestScaling; i++) {
        const rounds = roundArray[i];
        log('---------- ', rounds);
        resultX = 0;
        resultY = 0;
        mode = 1;
        scaleCounter = i;
        roundCounter = 0;
        resultArray[1][scaleCounter] = new Array(rounds).fill(0);
        startDate = Date.now();
        for (let j = 0; j < rounds; j++) {
            roundCounter = j;
            const dynSeedValue = generator.range(10000);
            factory = new CandidateFactory6(playerCount, xMax, yMax, dynSeedValue);
            executor = new ExecutorES6(generationCount, dynSeedValue, populationSize, timeout, mutationRate*2, factory, newGameState, newMessage);
            executor.start();
        }
        log('Results: ', resultX, ', ', resultY);
        log('Runtime: ', Date.now() - startDate);
        log('--------------');
    }

    fs.writeFile("results/game6.txt", output, function(err) {
        if(err) {
            return log(err);
        }
    }); 
}

export default testGame6Execution;