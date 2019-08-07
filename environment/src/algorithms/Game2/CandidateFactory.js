import BaseCandidateFactory from '../BaseCandidateFactory';

class CandidateFactory extends BaseCandidateFactory {
    constructor(treeDepth, strategyCount, seedValue) {
        super(seedValue);
        if(strategyCount > 25) {
            console.log('Only 25 different strategys are allowed! Setting strategy count to 25...');
            this.strategyCount = 25;
        } else {
            this.strategyCount = strategyCount;
        }
        this.treeDepth = treeDepth;         
        this.strategyPool = 'ABCDEFGHIJKLMNOPQRSTUVWXY'; // limited to 25 different strategies per player
        this.max = 15;
        this.min = 0;
        this.maxFactor = 2;
        this.minFactor = 0.5;
        this.outputTablePlayer1 = this.generateOutputTable();
        this.outputTablePlayer2 = this.generateOutputTable();
    }
    
    cross(c1, c2) {
        const newCandidate = {
            fitness: 0,
            strategy: '',
        }

        const split = this.generator.range(this.treeDepth-2)+1; // every candidate has to give at least one block to the new candidate
        newCandidate.strategy = c1.strategy.substring(0, split) + c2.strategy.substring(split);

        return newCandidate;
    }

    mutate(c, sigma = 1) {
        const newCandidate = {
            fitness: 0,
            strategy: '',
        }

        for (let i = 0; i < sigma; i++) {        
            const strategy = this.strategyPool.charAt(this.generator.range(this.strategyCount));
            const layer = this.generator.range(this.treeDepth);

            let newStrategy = c.strategy.substring(0, layer) + strategy;
            newStrategy += (layer+1) === this.treeDepth ? '' : c.strategy.substring(layer+1);

            newCandidate.strategy = newStrategy;
        }

        return newCandidate;
    }

    generate() {
        const candidate = {
            fitness: 0,
            strategy: '',
        }
        candidate.strategy = this.generateStrategy();
        candidate.fitness = this.evaluate(candidate);

        return candidate;
    }

    evaluate(c) {
        let count = 0;
        let valuePlayer1 = 1;
        let valuePlayer2 = 1;

        for(let i = 0; i < this.treeDepth; i++) {
            const index = this.strategyPool.indexOf(c.strategy.charAt(i));

            if (i % 2 === 0) {
                valuePlayer1 *= this.outputTablePlayer1[i][index];
                count += valuePlayer1;
            } else {
                valuePlayer2 *= this.outputTablePlayer2[i][index];
                count += valuePlayer2;
            }
        }
        return count;
    }

    // ---
    generateStrategy() {
        let strategy = '';
        for(let i = 0; i < this.treeDepth; i++) {
            strategy += this.strategyPool.charAt(this.generator.range(this.strategyCount));
        }

        return strategy;
    }

    generateOutputTable() {
        const outputTable = [];
        let layerTable = [];
        // inital output
        for(let i = 0; i < this.strategyCount; i++) {
            layerTable.push(this.generator.range(this.max - this.min) + this.min);
        }
        outputTable.push(layerTable);
        // multiplication factors
        for(let i = 1; i < this.treeDepth; i++) {
            layerTable = [];
            for(let j = 0; j < this.strategyCount; j++) {
                layerTable.push((this.generator.random()*(this.maxFactor - this.minFactor)) + this.minFactor);
            }
            outputTable.push(layerTable)
        }

        return outputTable;
    }
}

export default CandidateFactory;