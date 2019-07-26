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

        let j = 0;
        while ((j < (that.populationSize*that.selectionPressure) || offspringBuffer.length < offspringCount) && j < that.populationSize * 5) { // Remove?
            console.log('1');
            const candidates = that.selectionFunction(that.population, 2, that.generator);
            console.log('2');


            let newCandidate = that.candidateFactory.cross(...candidates);
            if (that.generator.random() < that.mutationRate) {
                newCandidate = that.candidateFactory.mutate(newCandidate);
            }
            newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);
            console.log('3');


            if (that.useOptimization && (newCandidate.fitness > candidates[0].fitness && newCandidate.fitness > candidates[1].fitness)) {
                offspringBuffer.push(newCandidate);
            } else {
                newPopulation.push(newCandidate);
            }
 
            j++;
        }

        const fillCandidates = that.replacementFunction(that.population, newPopulation, that.generator).slice(0, that.population.length - offspringBuffer.length);
        that.population = that.sortByFitness(offspringBuffer.concat(fillCandidates));

        that.uiHandler({x: that.counter, y: that.population[0].fitness});
        that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(that.population[0])}`);
        that.counter += 1;

        that.addToHistory(that.population[0]);
        
        if (that.noChangesInHistory() || that.counter >= that.generationCount) {
            that.stop();
            that.candidateFactory.fitnessType = that.candidateFactory.fitnessType === 'NE' ? 'MAX' : 'NE';
            that.msgHandler(0, 'fin', `Best Candidate alternative fitness (${that.candidateFactory.fitnessType}): ${that.candidateFactory.evaluate(that.population[0])}`);
        }

    }
}

export default ExecutorGA;