import BaseExecutor from '../BaseExecutor';

class ExecutorES extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
        
        this.population = this.generateBasePopulation();
        this.evaluateBasePopulation();
        this.playerCount = 3;

        this.maxSigma = 4;
        this.minSigma = 0.001;
        this.sigma = new Array(this.playerCount).fill(2);
        this.sigmaDelta = 1.2;
    }

    generateBasePopulation() {
        const population = [];
        const totalSize = this.populationSize * 3;

        for(let i = 0; i < totalSize; i++) {
            population.push(this.candidateFactory.generate());
        }
        return population;
    }

    evaluateBasePopulation() {
        const evaluatedPopulation = [];
        const firstPopulation = this.population.filter(candidate => candidate.playerNumber === 0);
        const secondPopulation = this.population.filter(candidate => candidate.playerNumber === 1);
        const thirdPopulation = this.population.filter(candidate => candidate.playerNumber === 2);

        const splittedPop = [firstPopulation, secondPopulation, thirdPopulation];

        for (let i = 0; i < splittedPop.length; i++) {
            for(let j = 0; j < splittedPop[i].length; j++) {
                if (i === 0) {
                    splittedPop[i][j].fitness = this.candidateFactory.evaluate(splittedPop[i][j],
                        secondPopulation[this.generator.range(secondPopulation.length)], thirdPopulation[this.generator.range(thirdPopulation.length)]);
                } else {
                    splittedPop[i][j].fitness = this.candidateFactory.evaluate(splittedPop[i][j],
                        firstPopulation[this.generator.range(firstPopulation.length)]);
                }
                evaluatedPopulation.push(splittedPop[i][j]);
            }
        }

        this.population = evaluatedPopulation;
    }

    runCycle(that) {
        const newPopulation = [];
        let tmpPopulation = [];
        let successCounter = 0;
        let baseFitness = 0;

        const firstPopulation = that.population.filter(candidate => candidate.playerNumber === 0);
        const secondPopulation = that.population.filter(candidate => candidate.playerNumber === 1);
        const thirdPopulation = that.population.filter(candidate => candidate.playerNumber === 2);

        const splittedPop = [firstPopulation, secondPopulation, thirdPopulation];

        for (let i = 0; i < splittedPop.length; i++) {
            for (let j = 0; j < splittedPop[i].length * that.selectionPressure; j++) {
                const candidate = that.selectionFunction(splittedPop[i], 1, that.generator, j === 0);
               
                let newCandidate = {
                    fitness: candidate[0].fitness,
                    properties: candidate[0].properties,
                    playerNumber: candidate[0].playerNumber,
                }

                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate, that.useOptimization ? that.sigma[i] : 1);
                }

                if (i === 0) {
                    newCandidate.fitness = that.candidateFactory.evaluate(newCandidate,
                        secondPopulation[that.generator.range(secondPopulation.length)], thirdPopulation[that.generator.range(thirdPopulation.length)]);
                } else {
                    newCandidate.fitness = that.candidateFactory.evaluate(newCandidate,
                        firstPopulation[that.generator.range(firstPopulation.length)]);
                }

                newPopulation.push(newCandidate);
                if (baseFitness < newCandidate.fitness) {
                    successCounter += 1;
                }
            }

            if (successCounter < (that.populationSize / 5)) {
                that.sigma[i] /= that.sigmaDelta;
            } else if  (successCounter > (that.populationSize / 5)) {
                that.sigma[i] *= that.sigmaDelta;
            }
    
            if (that.sigma[i] < that.minSigma) {
                that.sigma[i] = that.minSigma;
            } else if (that.sigma[i] > that.maxSigma) {
                that.sigma[i] = that.maxSigma;
            }
        }

        for (let i = 0; i < splittedPop.length; i++) {
            const partOfPopulation = that.select(that.population.concat(newPopulation).filter(candidate => candidate.playerNumber === i));
            that.uiHandler({x: that.counter, y: partOfPopulation[0].fitness, playerNumber: i, properties: partOfPopulation[0].properties});
            that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(partOfPopulation[0])}`);
            tmpPopulation = tmpPopulation.concat(partOfPopulation);
        }
        that.population = tmpPopulation;
        that.counter += 1;        
        
        
        if (that.counter >= that.generationCount) {
            that.stop();
            that.msgHandler(0, 'fin', 'Finished!');
        }
    }
}

export default ExecutorES;