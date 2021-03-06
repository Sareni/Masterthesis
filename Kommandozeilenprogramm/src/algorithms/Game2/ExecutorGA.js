import BaseExecutor from '../BaseExecutor';

class ExecutorGA extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
        this.population = this.generateBasePopulation();
    }

    generateBasePopulation() {
        const population = [];
        for(let i = 0; i < this.populationSize; i++) {
            population.push(this.candidateFactory.generate());
        }
        return population;
    }

    runCycle(that) {
        const newPopulation = [];
        const offspringBuffer = [];
        const offspringCount = that.useOptimization ? that.populationSize * 0.5 : 0;
        const multiplicator = Math.max(that.selectionPressure, 3);

        let j = 0;
        while ((j < (that.populationSize*that.selectionPressure) || offspringBuffer.length < offspringCount) && newPopulation.length < (that.populationSize*multiplicator)) {
            const candidates = that.selectionFunction(that.population, 2, that.generator, j===0);

            let newCandidate = that.candidateFactory.cross(...candidates);
            if (that.generator.random() < that.mutationRate) {
                newCandidate = that.candidateFactory.mutate(newCandidate);
            }
            newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);

             // TODO fill up until a certain point
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

        that.uiHandler({x: that.counter, y: that.population[0].fitness});
        that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(that.population[0])}`);
        that.counter += 1;

        that.addToHistory(that.population[0]);
        
        if (that.noChangesInHistory() || that.counter >= that.generationCount) {
            that.stop();
            that.msgHandler(0, 'fin', 'Finished!');
        }
    }
}

export default ExecutorGA;