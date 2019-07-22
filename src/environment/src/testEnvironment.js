// node.js modules
const readline = require('readline');
require("babel-core").transform("code");


import testGame1Execution from './testGame1';
//import testGame2Execution from './testGame2';
import testGame3Execution from './testGame3';
import testGame6Execution from './testGame6';
import testGame7Execution from './testGame7';
import testGame8Execution from './testGame8';
import testGame9Execution from './testGame9';

import CandidateFactory1 from './algorithms/Game1/CandidateFactory';
import CandidateFactory2 from './algorithms/Game2/CandidateFactory';
import CandidateFactory3 from './algorithms/Game3/CandidateFactory';
import ExecutorBF1 from './algorithms/Game1/ExecutorBF';
import ExecutorBF2 from './algorithms/Game2/ExecutorBF';
import ExecutorES1 from './algorithms/Game1/ExecutorES';
import ExecutorES2 from './algorithms/Game2/ExecutorES';
import ExecutorES3 from './algorithms/Game3/ExecutorES';
import ExecutorGA1 from './algorithms/Game1/ExecutorGA';
import ExecutorGA2 from './algorithms/Game2/ExecutorGA';
import ExecutorGA3 from './algorithms/Game3/ExecutorGA';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



function testGame1() {
    testGame1Execution('NE', CandidateFactory1, ExecutorGA1, ExecutorES1, ExecutorBF1);
    testGame1Execution('MAX', CandidateFactory1, ExecutorGA1, ExecutorES1, ExecutorBF1);
}

function testGame2() {
    testGame1Execution('', CandidateFactory2, ExecutorGA2, ExecutorES2, ExecutorBF2);
}

function testGame3() {
    //testGame3Execution();
    testGame1Execution('', CandidateFactory3, ExecutorGA3, ExecutorES3, null);
}

function testGame6() {
    testGame6Execution();
}

function testGame7() {
    testGame7Execution();
}

function testGame8() {
    testGame8Execution();
}

function testGame9() {
    testGame9Execution();
}

function startGame(gameNumber) {
    switch (gameNumber) {
        case 1: testGame1(); break;
        case 2: testGame2(); break;
        case 3: testGame3(); break;
        case 4:
        case 5:
        case 6: testGame6(); break;
        case 7: testGame7(); break;
        case 8: testGame8(); break;
        case 9: testGame9(); break;
        default: console.log('Error: False Input!');
    }
}

function startTest(gameNumberString) {
    rl.close();
    const gameNumber = parseInt(gameNumberString);
    startGame(gameNumber);
}

function start() {
    let inputPreString = '';
    if (process.argv.length > 2 && process.argv[2]) {
        const gameNumber = parseInt(process.argv[2]);
        if (gameNumber >= 1 || gameNumber <= 9) {
            startGame(gameNumber);
            return;
        } else {
            inputPreString = 'Input is false. ';
        }
    }
    rl.question(inputPreString + 'Select Game (1-9): ', startTest);
}

start();
