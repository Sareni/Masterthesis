import BaseCandidateFactory from '../BaseCandidateFactory';

class CandidateFactory extends BaseCandidateFactory {
    constructor(playerCount, strategyCount, seedValue) {
        super(seedValue);

        this.playerCount = playerCount;
        this.strategyCount = strategyCount;
        this.max = 10;
        this.min = -5;
        this.maxDelta = 0.5;
        this.minDelta = -0.5;
        this.playerNumber = 0;
        this.playerTables = this.generatePlayerTables();
    }
    
    cross(c1, c2) {
        const newCandidate = {
            fitness: 0,
            properties: [],
            playerNumber: c1.playerNumber,
        }

        const split = this.generator.range(this.strategyCount-2)+1; // every candidate has to give at least one block to the new candidate
        newCandidate.properties = c1.properties.slice(0, split).concat(c2.properties.slice(split));

        newCandidate.properties = this.fixProperties(newCandidate.properties);

        return newCandidate;
    }

    mutate(c) {
        const newCandidate = {
            fitness: 0,
            properties: [],
            playerNumber: c.playerNumber,
        }

        const delta = (this.generator.random() * (this.maxDelta - this.minDelta)) + this.minDelta;
        const deltaPart = delta / (this.strategyCount - 1);

        newCandidate.properties = c.properties.map(p => p - deltaPart);

        const index = this.generator.range(this.strategyCount);
        newCandidate.properties[index] += delta + deltaPart;

        newCandidate.properties = this.fixProperties(newCandidate.properties);

        return newCandidate;
    }

    fixProperties(p) {

        const newProperties = p.map(prop => {
            if (prop < 0) return 0;
            if (prop > 1) return 1;
            return prop;
        });

        const sum = newProperties.reduce((acc, cur) => {
            return acc + cur;
        });

        if(sum === 1) {
            return newProperties;
        }

        let counter = newProperties.length;
        let diff = sum - 1;
        const originalDiff = diff;

        let testcounter = 0;

        while (diff > Math.abs(0.00001)) {
            if(counter < 1) {
                console.log('counter fail');
                break;
            }
            const diffPart = diff / counter;
            for (let i = 0; i < newProperties.length; i++) {
                const newVal = newProperties[i] - diffPart;
                if (newVal > 1) {
                    if (newProperties[i] !== 1) {
                        counter -= 1;
                        diff -= 1 - newProperties[i];
                        newProperties[i] = 1;
                        if (Math.abs(originalDiff) < Math.abs(diff)) {
                            console.log('Fail > 1:', diff, originalDiff);
                            testcounter = 1000;
                        }     
                    }
          
                } else if (newVal < 0) {
                    if (newProperties[i] !== 0) {
                        const test = newProperties[i];
                        const test2 = diff;
                        counter -= 1;
                        diff -= newProperties[i];
                        newProperties[i] = 0;  
                        if (Math.abs(originalDiff) < Math.abs(diff)) {
                            console.log('Fail < 0:', diff, originalDiff, test, test2, newVal);
                            testcounter = 1000;
                        }     
                    }
                } else {
                    newProperties[i] = newVal;
                    diff -= diffPart;
                    if (Math.abs(originalDiff) < Math.abs(diff)) {
                        console.log('Fail --:', diff, originalDiff, diffPart);
                        testcounter = 1000;
                    }    
                }
            }

            

            testcounter++;
        }


        // correction for inaccuracy
        for (let i = 0; i < newProperties.length; i++) {
            const newVal = newProperties[i] - diff;
            if (newVal <= 1 || newVal >= 0) {
                newProperties[i] += newVal;
                break;
            }
        }
        
        return newProperties;
    }

    generate() {

        const candidate = {
            fitness: 0,
            properties: [],
            playerNumber: this.playerNumber,
        }
        candidate.properties = this.generateProperties();

        candidate.fitness = this.evaluate(candidate);

        return candidate;
    }

    evaluate(c) {
        let count = 0;

        for (let i = 0; i < this.playerCount; i++) {
            const counter = 0;
            const results = new Array(this.strategyCount); 

            for (let j = 0; j < this.strategyCount; j++) {
                results[j] = this.playerTables[i][c.playerNumber][counter*this.strategyCount + j] * c.properties[j];
            }
            const sum = results.reduce((acc, cur) => acc + cur);
            const mean = sum / results.length;

            for(let j = 0; j < results.length; j++) {
                count -= Math.abs(mean - results[j])
            }
        }
        
        return count;
    }

    setPlayerNumber(playerNumber) {
        this.playerNumber = playerNumber;
    }

    // ---
    generateProperties() {
        let properties = [];
        for(let i = 0; i < this.strategyCount; i++) {
            properties.push(this.generator.random());
        }

        return this.fixProperties(properties);
    }

    generatePlayerTables() {
        const playerTables = [];                    // Create
        for(let i = 0; i < this.playerCount; i++) { // for every player a table
            const playersTables = [];
            for(let j = 0; j < this.playerCount; j++) { // for every (other) player
                const outputTable = [];
                for(let k = 0; k < this.strategyCount; k++) { // with all strategies
                    for(let l = 0; l < this.strategyCount; l++) { // of both players
                        if(i === j) {
                            outputTable.push(0);
                        } else {
                            outputTable.push(this.generator.range(this.max - this.min) + this.min);
                        }
                    }
                }
                playersTables.push(outputTable);
            }
            playerTables.push(playersTables)
        }

        return playerTables;
    }
}

export default CandidateFactory;