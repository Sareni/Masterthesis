// node.js modules
const readline = require('readline');
require("babel-core").transform("code");


import testGame1Execution from './testGame1';
import testGame2Execution from './testGame2';
import testGame3Execution from './testGame3';
import testGame6Execution from './testGame6';
import testGame7Execution from './testGame7';
import testGame8Execution from './testGame8';
import testGame9Execution from './testGame9';




const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



function testGame1() {
    testGame1Execution('NE');
    testGame1Execution('MAX');
}

function testGame2() {
    testGame2Execution();
}

function testGame3() {
    testGame3Execution();
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

function startTest(gameNumber) {
    rl.close();

    switch (gameNumber) {
        case '1': testGame1(); break;
        case '2': testGame2(); break;
        case '3': testGame3(); break;
        case '6': testGame6(); break;
        case '7': testGame7(); break;
        case '8': testGame8(); break;
        case '9': testGame9(); break;
        default: console.log('Error: False Input!');
    }
}

rl.question('Select Game (1-9): ', startTest);