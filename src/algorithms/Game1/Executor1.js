import BaseExecutor from '../BaseExecutor';

class Executor1 extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, CandidateFactory, uiHandler, msgHandler) {
        super(populationSize, timeout, generationCount, seedValue, CandidateFactory, uiHandler, msgHandler);

        this.mutationRate = 0.1;

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
            const firstCandidateIndex = Math.floor(Math.random() * that.populationSize);
            let secondCandidateIndex = Math.floor(Math.random() * that.populationSize);
            while (firstCandidateIndex === secondCandidateIndex && that.populationSize > 1) {
                secondCandidateIndex = Math.floor(Math.random() * that.populationSize);
            }

            let newCandidate = that.candidateFactory.cross(that.population[firstCandidateIndex], that.population[secondCandidateIndex]);
            if (Math.random() < that.mutationRate) {
                newCandidate = that.candidateFactory.mutate(newCandidate);
            }
            newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);
            newPopulation.push(newCandidate);
        }

        that.population = that.select(that.population.concat(newPopulation));
        that.uiHandler({x: that.counter, y: that.population[0].fitness});
        that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(that.population[0])}`);
        that.counter += 1;
        if(that.counter >= that.generationCount) {
            that.stop();
        }
    }
}

export default Executor1;