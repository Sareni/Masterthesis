import BaseExecutor from '../BaseExecutor';

class ExecutorES extends BaseExecutor {

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
    }

    runCycle(that) {
        const newPopulation = [];
        let tmpPopulation = [];
        const populationGroups = [];
        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
            const group = that.population.filter(candidate => candidate.playerNumber === i);
            populationGroups.push(group);
        }

        for (let j = 0; j < that.populationSize; j++) {
            const candidateArray = [];
            for (let k = 0; k < that.candidateFactory.playerCount; k++) {
                const candidateIndex = that.generator.range(that.populationSize);

                let newCandidate = {
                    fitness: that.population[candidateIndex].fitness,
                    strategy: that.population[candidateIndex].strategy,
                    playerNumber: that.population[candidateIndex].playerNumber,
                }
                // let newCandidate = JSON.parse(JSON.stringify(that.population[candidateIndex]));
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate);
                }

                candidateArray.push(newCandidate);
            }

            const results = that.candidateFactory.evaluate(candidateArray);
            for (let k = 0; k < that.candidateFactory.playerCount; k++) {
                candidateArray[k].fitness = results[k];
                newPopulation.push(candidateArray[k]);
            }
        }

        for (let i = 0; i < populationGroups.length; i++) {
            const partOfPopulation = that.select(that.population.concat(newPopulation).filter(candidate => candidate.playerNumber === i));
            that.uiHandler({x: that.counter, y: partOfPopulation[0].fitness, playerNumber: i});
            that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(partOfPopulation[0])}`);
            tmpPopulation = tmpPopulation.concat(partOfPopulation);
        }

        that.population = tmpPopulation;
        that.counter += 1;   

        if (that.counter >= that.generationCount) {
            that.stop();
            that.msgHandler(0, 'fin', 'Finished');
        }
    }
}

export default ExecutorES;