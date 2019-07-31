import BaseExecutor from '../BaseExecutor';

class ExecutorES extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
        
        // this.pressure = 1.5; used in every algo now
        this.population = this.generateBasePopulation();
        this.evaluateBasePopulation();

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
        for (let i = 0; i < this.candidateFactory.playerCount; i++) {
            const thisPopulation = this.population.filter(candidate => candidate.playerNumber === i);
            const thatPopulation = this.population.filter(candidate => candidate.playerNumber !== i);
            
            for(let j = 0; j < thisPopulation.length; j++) {
                thisPopulation[j].fitness = this.candidateFactory.evaluate(thisPopulation[j],
                    thatPopulation[this.generator.range(thatPopulation.length)]);
                evaluatedPopulation.push(thisPopulation[j]);
            }
        }

        this.population = evaluatedPopulation;
    }

    runCycle(that) {
        const newPopulation = [];
        let tmpPopulation = [];
        let successCounter = 0;
        let baseFitness = 0;


        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
            const thisPopulation = that.population.filter(candidate => candidate.playerNumber === i);
            const thatPopulation = that.population.filter(candidate => candidate.playerNumber !== i);

            
            for (let j = 0; j < (thisPopulation.length * that.selectionPressure); j++) {
                const candidate = that.selectionFunction(thisPopulation, 1, that.generator, j === 0);
    
                let newCandidate = {
                    fitness: candidate[0].fitness,
                    strategy: candidate[0].strategy,
                }
                baseFitness = newCandidate.fitness;

                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate, that.useOptimization ? that.sigma : 1);
                }
                newCandidate.fitness = that.candidateFactory.evaluate(newCandidate, thatPopulation[that.generator.range(thatPopulation.length)]);
                newPopulation.push(newCandidate);

                if (baseFitness < newCandidate.fitness) {
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

        that.uiHandler({ x: 0, y: 0, playerNumber: -1 });        
        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
            const partOfPopulation = that.replacementFunction(that.population.filter(candidate => candidate.playerNumber === i), newPopulation.filter(candidate => candidate.playerNumber === i), that.generator);
            that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(partOfPopulation[0])}`);

            for (let j = 0; j < 10; j++) {
                if (partOfPopulation.length > j) {
                    that.uiHandler({x: partOfPopulation[j].x, y: partOfPopulation[j].y, playerNumber: partOfPopulation[j].playerNumber+1, fitness: partOfPopulation[j].fitness});
                }
            }
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