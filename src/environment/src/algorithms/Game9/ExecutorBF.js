import BaseExecutor from '../BaseExecutor';

const charCode = 'A'.charCodeAt(0);

class ExecutorBF extends BaseExecutor {
    constructor(generationCount, seedValue, populationSize, timeout, mutationRate, CandidateFactory, uiHandler, msgHandler) {
        super(populationSize, timeout, generationCount, seedValue, mutationRate, CandidateFactory, uiHandler, msgHandler);
        this.population = this.generateBasePopulation();
        this.population = this.evaluateBasePopulation();    
    }

    generateBasePopulation() {
        const population = [];

        for(let i = 0; i < this.candidateFactory.playerCount; i++) {
            population.push(this.candidateFactory.generate(true));
        }
        return population;
    }

    evaluateBasePopulation() {
        const results = this.candidateFactory.evaluate(this.population);
        for (let j = 0; j < this.candidateFactory.playerCount; j++) {
            this.population[j].fitness = results[j];
        }
        return this.population;
    }

    runCycle(that) {
        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
            const curPlayer = that.population.filter(p => p.playerNumber === i)[0];
            const curStrategy = curPlayer.strategy;
            const curFitness = curPlayer.fitness;

            that.uiHandler({x: that.counter, y: curFitness, playerNumber: i, strategy: curStrategy});
            that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(curPlayer)}`);
        }

        that.counter += 1;   

        if (that.counter >= that.generationCount) {
            that.stop();
            that.msgHandler(0, 'fin', 'Finished');
        }
    }
}

export default ExecutorBF;