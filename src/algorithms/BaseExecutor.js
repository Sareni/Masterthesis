class BaseExecutor {
    constructor(populationSize, timeout, generationCount, seedValue, candidateFactory, uiHandler, msgHandler) {
        this.interval = null;
        this.counter = 0;
        this.timeout = timeout;
        this.populationSize = populationSize;
        this.generationCount = generationCount;
        this.seedValue = seedValue;
        this.candidateFactory = candidateFactory;
        this.uiHandler = uiHandler;
        this.msgHandler = msgHandler;
    }
    generatePopulation() {
        throw new Error('generatePopulation: not implemented');
    }

    runCycle(that) {
        throw new Error('runCycle: not implemented');
    }

    start() {
        this.interval = setInterval(this.runCycle, this.timeout, this);
    }

    stop() {
        clearInterval(this.interval);
        this.counter = 0;
    }

    select(pop) {
        const filteredPopulation = pop.sort((a,b) => {
            if (a.fitness < b.fitness) {
                return 1;
            } else if (a.fitness > b.fitness) {
                return -1;
            } else {
                return 0;
            }
        });

        return filteredPopulation.slice(0, this.populationSize);
    }
}

export default BaseExecutor;