import BaseExecutor from '../BaseExecutor';


/*
    TODOs: rewrite ES
           document changes


*/

class ExecutorGA extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, mutationRate, candidateFactory, uiHandler, msgHandler) {
        super(populationSize, timeout, generationCount, seedValue, mutationRate, candidateFactory, uiHandler, msgHandler);
        this.population = new Array(this.candidateFactory.playerCount);
        this.history = new Array(this.candidateFactory.playerCount);

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

        for(let h = 0; h < that.candidateFactory.playerCount; h++) {
            const newPopulation = [];
            const offspringBuffer = [];

            for (let j = 0; j < that.populationSize; j++) {
                const firstCandidateIndex = that.generator.range(that.populationSize);
                let secondCandidateIndex = that.generator.range(that.populationSize);
                while (firstCandidateIndex === secondCandidateIndex && that.populationSize > 1) {
                    secondCandidateIndex = that.generator.range(that.populationSize);;
                }
    
                let newCandidate = that.candidateFactory.cross(that.population[h][firstCandidateIndex], that.population[h][secondCandidateIndex]);
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate);
                }
                newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);

                if (newCandidate.fitness > that.population[h][firstCandidateIndex] && newCandidate.fitness >that.population[h][secondCandidateIndex]) {
                    offspringBuffer.push(newCandidate);
                } else {
                    newPopulation.push(newCandidate);
                }
                
            }
    
            that.population[h] = offspringBuffer;
            that.population[h] = that.population[h].concat(that.select(that.population[h].concat(newPopulation)).slice(0, that.populationSize - that.population[h].length));
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