import BaseExecutor from '../BaseExecutor';

class ExecutorES extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, mutationRate, candidateFactory, uiHandler, msgHandler) {
        super(populationSize, timeout, generationCount, seedValue, mutationRate, candidateFactory, uiHandler, msgHandler);
        this.population = new Array(this.candidateFactory.playerCount);
        this.history = new Array(this.candidateFactory.playerCount);

        this.maxSigma = 4;
        this.minSigma = 0.001;
        this.sigma = new Array(this.candidateFactory.playerCount).fill(2);
        this.sigmaDelta = 1.2;

        for(let i = 0; i < this.population.length; i++) {
            this.history[i] = [];
            this.candidateFactory.setPlayerNumber(i);
            this.population[i] = this.generateBasePopulation();
        }
    }

    generateBasePopulation() {
        const population = [];
        for(let i = 0; i < this.populationSize; i++) {
            population.push(this.candidateFactory.generate());
        }
        return population;
    }

    runCycle(that) {
        for (let h = 0; h < that.candidateFactory.playerCount; h++) {
            const newPopulation = [];

            for (let j = 0; j < that.populationSize; j++) {
                const candidateIndex = that.generator.range(that.populationSize);

                let newCandidate = {
                    fitness: that.population[h][candidateIndex].fitness,
                    properties: that.population[h][candidateIndex].properties,
                    playerNumber: that.population[h][candidateIndex].playerNumber,
                }
                //let newCandidate = JSON.parse(JSON.stringify(that.population[h][candidateIndex]));
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate, that.sigma[h]);
                }
                newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);
                newPopulation.push(newCandidate);
            }

            const selectedPopulation = that.select(that.population[h].concat(newPopulation));
            let successCounter = 0;
            for (let j = 0; j < that.population[h].length; j++) { // TODO !!!
                if (!selectedPopulation.find(candidate => candidate === that.population[h][j])) {
                    successCounter += 1;
                }
            }
            if (successCounter < (that.populationSize / 5)) {
                that.sigma[h] /= that.sigmaDelta;
            } else if  (successCounter > (that.populationSize / 5)) {
                that.sigma[h] *= that.sigmaDelta;
            }

            if (that.sigma[h] < that.minSigma) {
                that.sigma[h] = that.minSigma;
            } else if (that.sigma[h] > that.maxSigma) {
                that.sigma[h] = that.maxSigma;
            }

            that.population[h] = selectedPopulation;
            that.uiHandler({x: that.counter, y: that.population[h][0].fitness, playerNumber: h});
            that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(that.population[h][0])}`);
            that.addToHistory(that.population[h][0], h);            
        } 
        
        that.counter += 1;
        
        if (that.noChangesInHistory() || that.counter >= that.generationCount) {
            that.stop();
            that.candidateFactory.fitnessType = that.candidateFactory.fitnessType === 'NE' ? 'MAX' : 'NE';
            that.msgHandler(0, 'fin', 'Finished!');            
        }
    }

    // override
    addToHistory(candidate, count) {
        if (this.history[count].length === this.historyLength) {
            this.history[count].shift();
        }
        this.history[count].push(candidate);
    }

    // override
    noChangesInHistory() {
        for (let h = 0; h < this.candidateFactory.playerCount; h++) {
            if (this.history[h].length < this.historyLength) {
                return false;
            }
            for(var i = 0; i < this.history[h].length - 1; i++) {
                if(this.history[h][i].properties !== this.history[h][i+1].properties) {
                    return false;
                }
            }
        }
        return true;
    }
}

export default ExecutorES;