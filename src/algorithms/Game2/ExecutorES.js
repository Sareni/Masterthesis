import BaseExecutor from '../BaseExecutor';

class ExecutorES extends BaseExecutor {

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
            const candidateIndex = that.generator.range(that.populationSize);

            let newCandidate = JSON.parse(JSON.stringify(that.population[candidateIndex]));
            if (that.generator.random() < that.mutationRate) {
                newCandidate = that.candidateFactory.mutate(newCandidate);
            }
            newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);
            newPopulation.push(newCandidate);
        }

        that.population = that.select(that.population.concat(newPopulation));
        that.uiHandler({x: that.counter, y: that.population[0].fitness});
        that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(that.population[0])}`);
        that.counter += 1;

        that.addToHistory(that.population[0]);
        
        if (that.noChangesInHistory() || that.counter >= that.generationCount) {
            that.stop();
            that.msgHandler(0, 'fin', '');
        }
    }
}

export default ExecutorES;