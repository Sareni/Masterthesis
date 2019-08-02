
import Generator from 'random-seed';
import fs from 'fs';
import { proportionalSelection, randomSelection, tournamentSelection, completeReplacement, randomReplacement, elitismReplacement } from './algorithms/util';

let parameters = {};
let csvStream;

let result = 0;
const playerCount = 3;
const lastResults = new Array(playerCount);
const lastProperties = new Array(playerCount);
const propertyValueCount = 4;

const selectionFunctionArray = [proportionalSelection, randomSelection, tournamentSelection]; 
const replacementFunctionArray = [completeReplacement, randomReplacement, elitismReplacement];

let resultArray;
let propertyArray;

let output = '';

let modeIndex = 0;
let populationIndex = 0;
let generationCountIndex = 0;
let mutationIndex = 0;
let selectionFunctionIndex = 0;
let replacementFunctionIndex = 0;
let selectionPressureIndex = 0;
let roundIndex = 0;

let lineCount = 0;

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
        let tempResult = 0;
        for (let i = 0; i < playerCount; i++) {
            tempResult += lastResults[i];
            lastResults[i] = 0;
            console.log('Props', lastProperties[i]);
            propertyArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex][roundIndex][i] = lastProperties[i];
            lastProperties[i] = 0;
        }
        resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex][roundIndex] = tempResult;
        result += tempResult;

    }
}

function newGameState(data) {
    lastResults[data.playerNumber] = data.y;
    lastProperties[data.playerNumber] = data.properties;
}

function testLoop(Factory, Executor, seedValue, type, useOptimization, mi, algoType) {
    modeIndex = mi;
    resultArray[modeIndex] = new Array(parameters.populationSizeArray.length);
    propertyArray[modeIndex] = new Array(parameters.populationSizeArray.length);
    const timeout = '0';

    for (let i = 0; i < parameters.populationSizeArray.length; i++) {
        populationIndex = i;
        resultArray[modeIndex][populationIndex] = new Array(parameters.generationCountArray.length);
        propertyArray[modeIndex][populationIndex] = new Array(parameters.generationCountArray.length);
        // log('Population: ', populationSizeArray[populationIndex]);
        
        for (let j = 0; j < parameters.generationCountArray.length; j++) {
            generationCountIndex = j;
            resultArray[modeIndex][populationIndex][generationCountIndex] = new Array(parameters.mutationRateArray.length);
            propertyArray[modeIndex][populationIndex][generationCountIndex] = new Array(parameters.mutationRateArray.length);
            // log('GenerationCount: ', generationCountArray[generationCountIndex]);

            for (let k = 0; k < parameters.mutationRateArray.length; k++) {
                mutationIndex = k;
                resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex] = new Array(selectionFunctionArray.length);
                propertyArray[modeIndex][populationIndex][generationCountIndex][mutationIndex] = new Array(selectionFunctionArray.length);
                // log('Mutation: ', mutationRateArray[mutationIndex]);

                for (let l = 0; l < selectionFunctionArray.length; l++) {
                    selectionFunctionIndex = l;
                    resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex] = new Array(replacementFunctionArray.length);
                    propertyArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex] = new Array(replacementFunctionArray.length);
                    // log('SelectionFunction: ', selectionFunctionArray[selectionFunctionIndex].name);

                    for (let m = 0; m < replacementFunctionArray.length; m++) {
                        replacementFunctionIndex = m;
                        resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex] = new Array(parameters.selectionPressureArray.length);
                        propertyArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex] = new Array(parameters.selectionPressureArray.length);
                        // log('ReplacementFunction: ', replacementFunctionArray[replacementFunctionIndex].name);

                        for (let n = 0; n < parameters.selectionPressureArray.length; n++) {
                            selectionPressureIndex = n;
                            resultArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex] = new Array(parameters.maxRounds);
                            propertyArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex] = new Array(parameters.maxRounds);
                            bestSetting[modeIndex] = { populationIndex: -1 };

                            result = 0;

                            const startDate = Date.now();
                            const generator = Generator.create(seedValue);

                            const propertiesPlayers = new Array(playerCount);
                            for (let a = 0; a < playerCount; a++) {
                                propertiesPlayers[a] = new Array(propertyValueCount).fill(0);
                            }


                            console.log(`${algoType};${type};${parameters.populationSizeArray[populationIndex]};${parameters.generationCountArray[generationCountIndex]};${parameters.selectionPressureArray[selectionPressureIndex]};${parameters.mutationRateArray[mutationIndex]};${selectionFunctionArray[selectionFunctionIndex].name};${replacementFunctionArray[replacementFunctionIndex].name};${useOptimization};`);

                            for (let p = 0; p < parameters.maxRounds; p++) {
                                roundIndex = p;

                                    

                                propertyArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex][roundIndex] = new Array(playerCount);
                                const dynSeedValue = generator.range(10000);
                                const factory = new Factory(dynSeedValue);
                                const executor = new Executor(parameters.generationCountArray[generationCountIndex], dynSeedValue, parameters.populationSizeArray[populationIndex], timeout, parameters.selectionPressureArray[selectionPressureIndex], parameters.mutationRateArray[mutationIndex], factory, newGameState, newMessage, selectionFunctionArray[selectionFunctionIndex], replacementFunctionArray[replacementFunctionIndex], useOptimization);
                                executor.start();

                                for (let a = 0; a < playerCount; a++) {
                                    for (let b = 0; b < propertyValueCount; b++) {
                                        propertiesPlayers[a][b] += propertyArray[modeIndex][populationIndex][generationCountIndex][mutationIndex][selectionFunctionIndex][replacementFunctionIndex][selectionPressureIndex][roundIndex][a][b];
                                    }
                                }
                            }

                            const time = Date.now() - startDate;
                            let propertyString = '';

                            for (let a = 0; a < playerCount; a++) {
                                for (let b = 0; b < propertyValueCount; b++) {
                                    propertiesPlayers[a][b] /= parameters.maxRounds;
                                    propertyString += propertiesPlayers[a][b] + ';';
                                }
                            }

                            
                
                            const newOutputLine = `${algoType};${type};${parameters.populationSizeArray[populationIndex]};${parameters.generationCountArray[generationCountIndex]};${parameters.selectionPressureArray[selectionPressureIndex]};${parameters.mutationRateArray[mutationIndex]};${selectionFunctionArray[selectionFunctionIndex].name};${replacementFunctionArray[replacementFunctionIndex].name};${useOptimization};${propertyString};${time};${result}\n`;
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

function testGame8Execution(type='NE', candidateFactory, executorGA, executorES, executorBF, name) {

    const parametersFile = fs.readFileSync(`${name}.json`);
    parameters = JSON.parse(parametersFile);

    const seedValue = Math.random() * 10000;
    resultArray = new Array(4);
    propertyArray = new Array(4);

    const header = 'Algo;Type;Population;Generations;SelectionPressure;MutationRate;SelectionFunction;ReplacementFunction;Optimized;P1p1;P1p2;P1p3;P1p4;P2p1;P2p2;P2p3;P2p4;P3p1;P3p2;P3p3;P3p4;Time;Result\n'
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

    log('\n-------------- Statistics ----------------');
    /* for (let i = 0; i < propertyArray.length; i++) {
        for (let j = 0; j < propertyArray[i].length; j++) {
            for (let k = 0; k < propertyArray[i][j].length; k++) {
                for (let l = 0; l < propertyArray[i][j][k].length; l++) {
                    for (let m = 0; m < propertyArray[i][j][k][l].length; m++) {
                        for (let n = 0; n < propertyArray[i][j][k][l][m].length; n++) {
                            for (let o = 0; o < propertyArray[i][j][k][l][m][n].length; o++) {
                                for (let p = 0; p < propertyArray[i][j][k][l][m][n][o].length; p++) {
                                    for (let q = 0; q < propertyArray[i][j][k][l][m][n][o][p].length; q++) {
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
    } */
    log('\n------------------------------------------');

    fs.writeFile(`results/${name}.txt`, output, function(err) {
        if(err) {
            return log(err);
        }
    }); 
}

export default testGame8Execution;