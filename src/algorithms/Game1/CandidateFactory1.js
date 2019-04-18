import BaseCandidateFactory from '../BaseCandidateFactory';

class CandidateFactory1 extends BaseCandidateFactory {
    constructor(playerCount, strategyCount) {
        super();

        if(strategyCount > 25) {
            console.log('Only 25 different strategys are allowed! Setting strategy count to 25...');
            this.strategyCount = 25;
        } else {
            this.strategyCount = strategyCount;
        }
        this.playerCount = playerCount;         
        this.strategyPool = 'ABCDEFGHIJKLMNOPQRSTUVWXY'; // limited to 25 different strategies per player
        this.max = 10;
        this.min = -5;
        this.playerTables = this.generatePlayerTables();
    }
    
    cross(c1, c2) {
        // TODO: better return both candidates?
        const newCandidate = {
            fitness: 0,
            strategy: '',
        }

        const split = Math.floor(Math.random() * (this.strategyCount-1)); // every candidate has to give at least one block to the new candidate
        newCandidate.strategy = c1.strategy.substring(0, split) + c2.strategy.substring(split);

        return newCandidate;
    }

    mutate(c) {
        const newCandidate = {
            fitness: 0,
            strategy: '',
        }
        const strategy = this.strategyPool.charAt(Math.floor(Math.random() * this.strategyCount));
        const player = Math.floor(Math.random() * this.playerCount);

        let newStrategy = c.strategy.substring(0, player) + strategy;
        newStrategy += (player+1) === this.playerCount ? '' : c.strategy.substring(player+1);

        newCandidate.strategy = newStrategy;

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
        for (let i = 0; i < this.playerCount; i++) {
            count += c.strategy.charAt(i) === this.getBestStrategyForPlayer(i, c.strategy) ? 0 : -1;
        }
        return count;
    }

    // ---
    generateStrategy() {
        let strategy = '';
        for(let i = 0; i < this.playerCount; i++) {
            strategy += this.strategyPool.charAt(Math.floor(Math.random() * this.strategyCount));
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
                            outputTable.push(Math.floor(Math.random() * (this.max - this.min)) + this.min);
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

export default CandidateFactory1;