import Generator from 'random-seed';

class BaseExecutor {
    constructor(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, candidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization, isBF) {
        this.interval = null;
        this.counter = 0;
        this.timeout = timeout;
        this.populationSize = populationSize;
        this.generationCount = generationCount;
        this.mutationRate = mutationRate;
        this.candidateFactory = candidateFactory;
        this.uiHandler = uiHandler;
        this.msgHandler = msgHandler;
        this.generator = Generator.create(seedValue);
        this.history = [];
        this.historyLength = 30;
        this.selectionFunction = selectionFunction;
        this.replacementFunction = replacementFunction;
        this.useOptimization = useOptimization;
        this.isBF = !!isBF;
        this.selectionPressure = selectionPressure;
    }
    generatePopulation() {
        throw new Error('generatePopulation: not implemented');
    }

    runCycle(that) {
        throw new Error('runCycle: not implemented');
    }

    start() {
        if(this.timeout === '0') {
            if (this.isBF) {
                do {
                    this.runCycle(this);
                } while (this.counter !== 0)
            } else {
                for(let i = 0; i < this.generationCount; i++) {
                    this.runCycle(this);
                    if (this.counter === 0) {
                        break;
                    }
                }
            }
        } else {
            this.interval = setInterval(this.runCycle, this.timeout, this);
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.counter = 0;   
    }

    sortByFitness(pop) {
        return pop.sort((a,b) => {
            if (a.fitness < b.fitness) {
                return 1;
            } else if (a.fitness > b.fitness) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    select(pop) {
        const filteredPopulation = this.sortByFitness(pop);
        return filteredPopulation.slice(0, this.populationSize);
    }

    addToHistory(candidate) {
        if (this.history.length === this.historyLength) {
            this.history.shift();
        }
        this.history.push(candidate);
    }

    noChangesInHistory() {
        /* if (this.history.length < this.historyLength) {
            return false;
        }
        for(var i = 0; i < this.history.length - 1; i++) {
            if(this.history[i].strategy !== this.history[i+1].strategy) {
                return false;
            }
        }
        return true; */
        return false;
    }
}

export default BaseExecutor;