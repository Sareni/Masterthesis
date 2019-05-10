import BaseExecutor from '../BaseExecutor';

const charCode = 'A'.charCodeAt(0);

class ExecutorBF extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, mutationRate, candidateFactory, uiHandler, msgHandler) {
        super(populationSize, timeout, generationCount, seedValue, mutationRate, candidateFactory, uiHandler, msgHandler, true);
        this.strategy = 'A'.repeat(candidateFactory.treeDepth);
        this.maxCounter = Math.pow(candidateFactory.strategyCount, candidateFactory.treeDepth);
        this.bestCandidate = {
            strategy: this.strategy,
            fitness: 0,
        }
        this.bestCandidate.fitness = candidateFactory.evaluate(this.bestCandidate);
    }


    runCycle(that) {
        //const index = Math.floor(that.counter / that.candidateFactory.strategyCount);
        //const newStrategy = that.strategy.substring(0, index) + String.fromCharCode(that.strategy.charCodeAt(index)+1);

        const newCandidate = {
            strategy: '',
            fitness: 0,
        }

        for(let i = 0; i < that.candidateFactory.treeDepth; i++) {
            newCandidate.strategy =  String.fromCharCode(charCode + Math.floor(that.counter / Math.pow(that.candidateFactory.strategyCount,i)) % that.candidateFactory.strategyCount)
                                     + newCandidate.strategy;
        }


        newCandidate.fitness = that.candidateFactory.evaluate(newCandidate);

        if(newCandidate.fitness > that.bestCandidate.fitness) {
            that.bestCandidate = newCandidate;
        }

        //that.uiHandler({x: that.counter, y: that.population[0].fitness});
        //that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(that.population[0])}`);
        that.counter += 1;

        if (that.counter >= that.maxCounter) {
            that.stop();
            that.msgHandler(0, 'fin', `Best Candidate: ${JSON.stringify(that.bestCandidate)}.`);
        }
    }
}

export default ExecutorBF;