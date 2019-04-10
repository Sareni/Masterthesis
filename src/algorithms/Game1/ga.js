

class Game1GA {
    Game1GA(playerCount, strategyCount, generationCount, seedValue, populationSize, uiHandler) {
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

        this.max = 10;
        this.min = -5;
        this.strategyPool = 'ABCDEFGHIJKLMNOPQRSTUVWXY'; // limited to 25 different strategies per player
        this.mutationRate = 0.1;
    }

    init() {
        this.population = this.generateBasePopulation();
        this.playerTables = this.generatePlayerTables();

        console.log(this.playerTables);
    }

    run() {
        for (let i = 0; i < this.generationCount; i++) {
            const newPopulation = [];

            for (let j = 0; j < this.populationSize; j++) {
                const firstCandidateIndex = Math.floor(Math.random() * this.populationSize);
                let secondCandidateIndex = Math.floor(Math.random() * this.populationSize);
                while (firstCandidateIndex === secondCandidateIndex && this.populationSize > 1) {
                    secondCandidateIndex = Math.floor(Math.random() * this.populationSize);
                }

                let newCandidate = this.cross(this.population[firstCandidateIndex], this.population[secondCandidateIndex]);
                if (Math.random() < this.mutationRate) {
                    newCandidate = this.mutate(newCandidate);
                }
                newCandidate.fitness = this.evaluate(newCandidate);
                newPopulation.push(newCandidate);
            }

            this.population = this.select(this.population.concat(newPopulation));
        }
    }

    // private
    cross(e1, e2) {

    }

    mutate(e) {

    }

    select(pop) {
        const filteredPopulation = pop.sort((a,b) => {
            if (a.value < b.value) {
                return -1;
            } else if (a.value > b.value) {
                return 1;
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
    }

    generateStrategy() {
        let strategy = '';
        for(let i = 0; i < this.playerCount; i++) {
            strategy += this.strategyPool.charAt(Math.floor(Math.random() * this.strategyPool.length));
        }

        return strategy;
    }

    evaluate(e) {
        let count = 0;
        for (let i = 0; i < this.playerCount; i++) {
            count += e.strategy.charAt(i) === this.getBestStrategyForPlayer(i, e.strategy) ? 0 : -1;
        }
        return count;
    }

    getBestStrategyForPlayer(playerNumber, baseStrategy) {
        const solution = {
            strategy: baseStrategy.charAt(playerNumber),
            value: this.evaluateStrategyForPlayer(playerNumber, baseStrategy),
        }
        for (let i = 0; i < this.strategyCount; i++) {
            if (i === playerNumber) continue;
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
                        outputTable.push(Math.floor(Math.random() * (this.max - this.min)) - this.min);
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