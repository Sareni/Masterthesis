import BaseExecutor from '../BaseExecutor';

class ExecutorGA extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
        this.population = new Array(this.candidateFactory.playerCount);
        this.history = new Array(this.candidateFactory.playerCount);

        for(let i = 0; i < this.candidateFactory.playerCount; i++) { //this.population.length
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

        for(let h = 0; h < that.candidateFactory.playerCount; h++) {
            const newPopulation = [];
            const offspringBuffer = [];
            const offspringCount = that.useOptimization ? that.populationSize * 0.5 : 0;
            const multiplicator = Math.max(that.selectionPressure, 3);

            let j = 0;
            while ((j < (that.populationSize*that.selectionPressure) || offspringBuffer.length < offspringCount) && newPopulation.length < (that.populationSize*multiplicator)) {
                const candidates = that.selectionFunction(that.population[h], 2, that.generator, j===0);
    
                let newCandidate = that.candidateFactory.cross(...candidates);
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate);
                }
                newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);

                if (that.useOptimization && (newCandidate.fitness > candidates[0].fitness && newCandidate.fitness > candidates[1].fitness)) {
                    offspringBuffer.push(newCandidate);
                } else {
                    newPopulation.push(newCandidate);
                }

                j++;
            }

            if (offspringBuffer.length >= that.population.length) {
                that.population = that.sortByFitness(offspringBuffer).slice(0, that.population.length);
            } else {
                const fillCandidates = that.sortByFitness(that.replacementFunction(that.population, newPopulation, that.generator)).slice(0, that.population.length - offspringBuffer.length);
                const candidates = offspringBuffer.concat(fillCandidates);
                that.population = that.sortByFitness(candidates);
            }
    
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

export default ExecutorGA;