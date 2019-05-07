class Game1GA {
    constructor(playerCount, strategyCount, generationCount, seedValue, populationSize, uiHandler, msgHandler) {
        if(strategyCount > 25) {
            console.log('Only 25 different strategys are allowed! Setting strategy count to 25...');
            this.strategyCount = 25;
        } else {
            this.strategyCount = strategyCount;
        }

        this.playerCount = playerCount;
        this.generationCount = generationCount;
        this.seedValue = seedValue;
        this.populationSize = populationSize;
        this.uiHandler = uiHandler;
        this.msgHandler = msgHandler;


        this.max = 10;
        this.min = -5;
        this.strategyPool = 'ABCDEFGHIJKLMNOPQRSTUVWXY'; // limited to 25 different strategies per player
        this.mutationRate = 0.1;

        this.interval = null;
        this.counter = 0;
    }

    init() {
        this.playerTables = this.generatePlayerTables();
        this.population = this.generateBasePopulation();
    }

    runCycle(that) {
        const newPopulation = [];

        for (let j = 0; j < that.populationSize; j++) {
            const firstCandidateIndex = Math.floor(Math.random() * that.populationSize);
            let secondCandidateIndex = Math.floor(Math.random() * that.populationSize);
            while (firstCandidateIndex === secondCandidateIndex && that.populationSize > 1) {
                secondCandidateIndex = Math.floor(Math.random() * that.populationSize);
            }

            let newCandidate = that.cross(that.population[firstCandidateIndex], that.population[secondCandidateIndex]);
            if (Math.random() < that.mutationRate) {
                newCandidate = that.mutate(newCandidate);
            }
            newCandidate.fitness = that.evaluate(newCandidate);
            newPopulation.push(newCandidate);
        }

        that.population = that.select(that.population.concat(newPopulation));
        that.uiHandler({x: that.counter, y: that.population[0].fitness});
        that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(that.population[0])}`);
        that.counter += 1;
        if(that.counter >= that.generationCount) {
            that.stop();
        }
    }

    run() {
        this.interval = setInterval(this.runCycle, 10, this);
    }

    stop() {
        clearInterval(this.interval);
        this.counter = 0;
    }

    

    select(pop) {
        const filteredPopulation = pop.sort((a,b) => {
            if (a.fitness < b.fitness) {
                return 1;
            } else if (a.fitness > b.fitness) {
                return -1;
            } else {
                return 0;
            }
        });

        return filteredPopulation.slice(0, this.populationSize);
    }

    generateBasePopulation() {
        const population = [];
        for(let i = 0; i < this.populationSize; i++) {
            population.push(this.generateCandidate());
        }
        return population;
    }

    generateCandidate() {
        const candidate = {
            fitness: 0,
            strategy: '',
        }
        candidate.strategy = this.generateStrategy();
        candidate.fitness = this.evaluate(candidate);

        return candidate;
    }

    generateStrategy() {
        let strategy = '';
        for(let i = 0; i < this.playerCount; i++) {
            strategy += this.strategyPool.charAt(Math.floor(Math.random() * this.strategyCount));
        }

        return strategy;
    }

    evaluate(c) {
        let count = 0;
        for (let i = 0; i < this.playerCount; i++) {
            count += c.strategy.charAt(i) === this.getBestStrategyForPlayer(i, c.strategy) ? 0 : -1;
        }
        return count;
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
}

export default Game1GA;