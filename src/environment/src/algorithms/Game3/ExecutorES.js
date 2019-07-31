import BaseExecutor from '../BaseExecutor';

class ExecutorES extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
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
            let successCounter = 0;
            let baseFitness = 0;

            for (let j = 0; j < that.populationSize; j++) {
                const candidate = that.selectionFunction(that.population[h], 1, that.generator, j===0);

                let newCandidate = {
                    fitness: candidate[0].fitness,
                    properties: candidate[0].properties,
                    playerNumber: candidate[0].playerNumber,
                }
                baseFitness = newCandidate.fitness;
                
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate, that.useOptimization ? that.sigma[h] : 1);
                }
                newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);
                newPopulation.push(newCandidate);

                if (baseFitness < newCandidate.fitness) {
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

            that.population[h] = that.replacementFunction(that.population[h], newPopulation, that.generator);
            that.population[h] = that.sortByFitness(that.population[h]);

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