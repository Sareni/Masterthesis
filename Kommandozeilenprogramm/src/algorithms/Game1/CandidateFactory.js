import BaseCandidateFactory from '../BaseCandidateFactory';

class CandidateFactory extends BaseCandidateFactory {
    constructor(playerCount, strategyCount, seedValue, fitnessType) {
        super(seedValue);

        if(strategyCount > 25) {
            console.log('Only 25 different strategys are allowed! Setting strategy count to 25...');
            this.strategyCount = 25;
        } else {
            this.strategyCount = strategyCount;
        }
        this.playerCount = playerCount;         
        this.strategyPool = 'ABCDEFGHIJKLMNOPQRSTUVWXY'; // limited to 25 different strategies per player
        this.max = 16;
        this.min = 1;
        this.fitnessType = fitnessType;
        this.playerTables = this.generatePlayerTables();
    }
    
    cross(c1, c2) {
        // TODO: better return both candidates?
        const newCandidate = {
            fitness: 0,
            strategy: '',
        }

        const split = this.generator.range(this.playerCount-2)+1; // every candidate has to give at least one block to the new candidate
        newCandidate.strategy = c1.strategy.substring(0, split) + c2.strategy.substring(split);

        return newCandidate;
    }

    mutate(c, sigma = 1) {
        const newCandidate = {
            fitness: c.fitness,
            strategy: c.strategy,
        }

        for (let i = 0; i < sigma; i++) {
            const strategy = this.strategyPool.charAt(this.generator.range(this.strategyCount));
            const player = this.generator.range(this.playerCount);
    
            let newStrategy = newCandidate.strategy.substring(0, player) + strategy;
            newStrategy += (player+1) === this.playerCount ? '' : newCandidate.strategy.substring(player+1);
    
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

        if (this.fitnessType === 'NE') {
            for (let i = 0; i < this.playerCount; i++) {
                count += c.strategy.charAt(i) === this.getBestStrategyForPlayer(i, c.strategy) ? 0 : -1;
            }
        } else if (this.fitnessType === 'MAX') {
            for (let i = 0; i < this.playerCount; i++) {
                count += this.evaluateStrategyForPlayer(i, c.strategy);
            }
        }
        
        return count;
    }

    // ---
    generateStrategy() {
        let strategy = '';
        for(let i = 0; i < this.playerCount; i++) {
            strategy += this.strategyPool.charAt(this.generator.range(this.strategyCount));
        }

        return strategy;
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


    getBestStrategyForPlayer(playerNumber, baseStrategy) {
        const solution = {
            strategy: baseStrategy.charAt(playerNumber),
            value: this.evaluateStrategyForPlayer(playerNumber, baseStrategy),
        }
        for (let i = 0; i < this.strategyCount; i++) {
            // if (i === playerNumber) continue; false !!
            const strategy = baseStrategy.substring(0, playerNumber) + this.strategyPool.charAt(i) + baseStrategy.substring(playerNumber + 1);
            if (this.evaluateStrategyForPlayer(playerNumber, strategy) > solution.value) {
                return this.strategyPool.charAt(i);
            }
        }

        return solution.strategy;
    }

    evaluateStrategyForPlayer(playerNumber, strategy) {
        let result = 0;
        const tables = this.playerTables[playerNumber];
        const myIndex = this.strategyPool.indexOf(strategy.charAt(playerNumber)) * this.strategyCount;
        const otherIndices = [...strategy].map(char => this.strategyPool.indexOf(char));

        tables.forEach((table, idx, arr) => {
            result += table[myIndex + otherIndices[idx]];
        });

        return result;
    }
}

export default CandidateFactory;