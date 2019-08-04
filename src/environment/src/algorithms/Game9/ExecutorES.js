import BaseExecutor from '../BaseExecutor';

class ExecutorES extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
        this.population = this.generateBasePopulation();
        this.population = this.evaluateBasePopulation();

        this.maxSigma = 4;
        this.minSigma = 0.001;
        this.sigma = 2;
        this.sigmaDelta = 1.2;
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
        return evaluatedPopulation;
    }

    runCycle(that) {
        const newPopulation = [];
        let tmpPopulation = [];
        let successCounter = 0;
        const baseFitness = new Array(that.candidateFactory.playerCount);
        const populationGroups = [];
        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
            const group = that.population.filter(candidate => candidate.playerNumber === i);
            populationGroups.push(group);
        }

        for (let j = 0; j < that.populationSize * that.selectionPressure; j++) {
            const candidateArray = [];
            for (let k = 0; k < that.candidateFactory.playerCount; k++) {
                const candidate = that.selectionFunction(that.population, 1, that.generator, j === 0);
                baseFitness[k] = candidate[0].fitness;
                let newCandidate = {
                    fitness: candidate[0].fitness,
                    strategy: candidate[0].strategy,
                    playerNumber: candidate[0].playerNumber,
                }
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate, that.useOptimization ? that.sigma : 1);
                }

                candidateArray.push(newCandidate);
            }

            const results = that.candidateFactory.evaluate(candidateArray);
            for (let k = 0; k < that.candidateFactory.playerCount; k++) {
                candidateArray[k].fitness = results[k];
                newPopulation.push(candidateArray[k]);

                if (baseFitness < candidateArray[k].fitness) {
                    successCounter += 1;
                }
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