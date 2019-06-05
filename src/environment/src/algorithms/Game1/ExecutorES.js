import BaseExecutor from '../BaseExecutor';

class ExecutorES extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
        this.population = this.generateBasePopulation();

        this.maxSigma = 4;
        this.minSigma = 0.001;
        this.sigma = 2;
        this.sigmaDelta = 1.2;
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
        let successCounter = 0;
        let baseFitness = 0;


        for (let j = 0; j < that.populationSize; j++) {
            const candidate = that.selectionFunction(that.population, 1, that.generator);

            let newCandidate = {
                fitness: candidate[0].fitness,
                strategy: candidate[0].strategy,
            }
            baseFitness = newCandidate.fitness;

            if (that.generator.random() < that.mutationRate) {
                newCandidate = that.candidateFactory.mutate(newCandidate, that.useOptimization ? that.sigma : 1);
            }
            newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);
            newPopulation.push(newCandidate);

            if (baseFitness < newCandidate.fitness) {
                successCounter += 1;
            }
        }
        if (successCounter < (that.populationSize / 5)) {
            that.sigma /= that.sigmaDelta;
        } else if  (successCounter > (that.populationSize / 5)) {
            that.sigma *= that.sigmaDelta;
        }

        if (that.sigma < that.minSigma) {
            that.sigma = that.minSigma;
        } else if (that.sigma > that.maxSigma) {
            that.sigma = that.maxSigma;
        }

        that.population = that.replacementFunction(that.population, newPopulation, that.generator);
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

export default ExecutorES;