import BaseExecutor from '../BaseExecutor';

class ExecutorGA extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, mutationRate, CandidateFactory, uiHandler, msgHandler) {
        super(populationSize, timeout, generationCount, seedValue, mutationRate, CandidateFactory, uiHandler, msgHandler);
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

        for (let j = 0; j < that.populationSize; j++) {
            const firstCandidateIndex = that.generator.range(that.populationSize);
            let secondCandidateIndex = that.generator.range(that.populationSize);
            while (firstCandidateIndex === secondCandidateIndex && that.populationSize > 1) {
                secondCandidateIndex = that.generator.range(that.populationSize);;
            }

            let newCandidate = that.candidateFactory.cross(that.population[firstCandidateIndex], that.population[secondCandidateIndex]);
            if (that.generator.random() < that.mutationRate) {
                newCandidate = that.candidateFactory.mutate(newCandidate);
            }
            newCandidate.fitness = that.candidateFactory.evaluate(newCandidate, that.population[that.generator.range(that.populationSize)]);
            newPopulation.push(newCandidate);
        }

        that.population = that.select(that.population.concat(newPopulation));
        that.uiHandler({x: that.counter, y: that.population[0].fitness});
        that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(that.population[0])}`);
        that.counter += 1;

        if (that.counter >= that.generationCount) {
            that.stop();
            that.msgHandler(0, 'fin', 'Finished');
        }
    }
}

export default ExecutorGA;