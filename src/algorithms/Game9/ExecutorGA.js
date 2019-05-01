import BaseExecutor from '../BaseExecutor';

class ExecutorGA extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, mutationRate, CandidateFactory, uiHandler, msgHandler) {
        super(populationSize, timeout, generationCount, seedValue, mutationRate, CandidateFactory, uiHandler, msgHandler);
        this.population = this.generateBasePopulation();
        this.evaluateBasePopulation();
    }

    generateBasePopulation() {
        const population = [];
        const totalSize = this.populationSize * this.candidateFactory.playerCount;

        for(let i = 0; i < totalSize; i++) {
            population.push(this.candidateFactory.generate());
        }
        return population;
    }

    evaluateBasePopulation() {
        const evaluatedPopulation = [];
        const populationGroups = [];
        for (let i = 0; i < this.candidateFactory.playerCount; i++) {
            const group = this.population.filter(candidate => candidate.playerNumber === i);
            populationGroups.push(group);
        }

        for (let i = 0; i < this.populationSize; i++) {
            const candidateArray = [];
            for (let j = 0; j < this.candidateFactory.playerCount; j++) {
                const pos = this.generator.range(this.populationSize - i);
                candidateArray.push(...populationGroups[j].splice(pos, 1));
            }

            const results = this.candidateFactory.evaluate(candidateArray);
            for (let j = 0; j < this.candidateFactory.playerCount; j++) {
                candidateArray[j].fitness = results[j];
                evaluatedPopulation.push(candidateArray[j]);
            }
        }

        this.population = evaluatedPopulation;
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
            that.candidateFactory.fitnessType = that.candidateFactory.fitnessType === 'NE' ? 'MAX' : 'NE';
            that.msgHandler(0, 'fin', `Best Candidate alternative fitness (${that.candidateFactory.fitnessType}): ${that.candidateFactory.evaluate(that.population[0])}`);
        }
    }
}

export default ExecutorGA;