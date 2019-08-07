import BaseCandidateFactory from '../BaseCandidateFactory';

class CandidateFactory extends BaseCandidateFactory {
    constructor(playerCount, strategyCount, seedValue) {
        super(seedValue);

        if(strategyCount > 25) {
            console.log('Only 25 different strategys are allowed! Setting strategy count to 25...');
            this.strategyCount = 25+1;
        } else {
            this.strategyCount = strategyCount+1;
        }
        this.playerCount = playerCount;         
        this.strategyPool = '0ABCDEFGHIJKLMNOPQRSTUVWXY'; // add 0 as 'no production this round'
        this.gameRounds = 10; // !!

        this.maxMarketSize = 500;
        this.minMarketSize = 50;

        this.maxSaturation = 10;
        this.minSaturation = 1;

        this.maxCosts = 10;
        this.minCosts = 1;

        this.maxCapacity = 25;
        this.minCapacity = 0;

        this.populationCounter = 0;

        this.playerTables = this.generatePlayerTables();
        this.marketTable = this.generateMarketTable();
    }
    
    cross(c1, c2) {
        const newCandidate = {
            fitness: 0,
            strategy: '',
            playerNumber: c1.playerNumber,
        }

        const split = this.generator.range(this.gameRounds-2)+1; // every candidate has to give at least one block to the new candidate
        newCandidate.strategy = c1.strategy.substring(0, split) + c2.strategy.substring(split);

        return newCandidate;
    }

    mutate(c) {
        const newCandidate = {
            fitness: 0,
            strategy: '',
            playerNumber: c.playerNumber,
        }
        const strategy = this.strategyPool.charAt(this.generator.range(this.strategyCount));
        const round = this.generator.range(this.gameRounds);

        let newStrategy = c.strategy.substring(0, round) + strategy;
        newStrategy += (round+1) === this.gameRounds ? '' : c.strategy.substring(round+1);

        newCandidate.strategy = newStrategy;

        return newCandidate;
    }

    generate(perfect = false) {
        const candidate = {
            fitness: 0,
            strategy: '',
            playerNumber: this.populationCounter % this.playerCount,
        }
        if (perfect) {
            candidate.strategy = this.generatePerfectStrategy(candidate.playerNumber);
        } else {
            candidate.strategy = this.generateStrategy();
        }
        // candidate.fitness = this.evaluate(candidate);

        this.populationCounter += 1;

        return candidate;
    }

    // array of candidates, one for every player, which together form a market
    evaluate(candidates) {
        let counts = new Array(candidates.length).fill(0);

        for (let i = 0; i < this.gameRounds; i++) {
            const marketPrices = new Array(this.strategyCount-1).fill(0); // -1: remove '0' option cause its not a product
            for (let j = 0; j < marketPrices.length; j++) {
                let producedAmount = 0;
                for (let k = 0; k < candidates.length; k++) {
                    if (candidates[k].strategy.charAt(i) === this.strategyPool.charAt(j+1) &&
                        (i === 0 || candidates[k].strategy.charAt(i-1) === candidates[k].strategy.charAt(i))) {
                        producedAmount += this.playerTables[candidates[k].playerNumber][1][j];                 
                    }
                }
                marketPrices[j] = this.marketTable[j][0] - (this.marketTable[j][1] * producedAmount);
            }

            for (let j = 0; j < candidates.length; j++) {
                const idx = this.strategyPool.indexOf(candidates[j].strategy.charAt(i))-1;
                if (idx >= 0 /* && (i === 0 || candidates[j].strategy.charAt(i-1) === candidates[j].strategy.charAt(i)) */) {
                    const amount = this.playerTables[candidates[j].playerNumber][1][idx];
                    counts[j] += marketPrices[idx] * amount;
                    counts[j] -= this.playerTables[candidates[j].playerNumber][0][idx] * amount;
                }
            }
        }

        return counts;
    }

    // ---
    generateStrategy() {
        let strategy = '';
        for(let i = 0; i < this.gameRounds; i++) {
            strategy += this.strategyPool.charAt(this.generator.range(this.strategyCount));
        }

        return strategy;
    }

    generatePerfectStrategy(playerNumber) {
        const curCostTable = this.playerTables[playerNumber][0];
        let bestStrategy = 'A'
        curCostTable.forEach((c, idx, arr) => {
            if (c < arr[this.strategyPool.indexOf(bestStrategy)-1]) {
                bestStrategy = this.strategyPool.charAt(idx+1);
            }
        });

        return bestStrategy.repeat(this.gameRounds);
    }

    generatePlayerTables() {
        const playerTables = [];
        for(let i = 0; i < this.playerCount; i++) {
            const costTable = [];
            const capacityTable = [];
            for (let j = 0; j < (this.strategyCount-1); j++) { // -1: remove '0' option cause its not a product
                costTable.push(this.generator.range(this.maxCosts - this.minCosts) + this.minCosts);
                capacityTable.push(this.generator.range(this.maxCapacity - this.minCapacity) + this.minCapacity);
            }
            playerTables.push([costTable, capacityTable]);
        }

        return playerTables;
    }

    generateMarketTable() {
        const marketTable = [];
        for (let i = 0; i < (this.strategyCount-1); i++) { // -1: remove '0' option cause its not a product
            const size = this.generator.range(this.maxMarketSize - this.minMarketSize) + this.minMarketSize;
            const saturationRate = this.generator.range(this.maxSaturation - this.minSaturation) + this.minSaturation;
            marketTable.push([size, saturationRate]);
        }

        return marketTable;
    }

}

export default CandidateFactory;