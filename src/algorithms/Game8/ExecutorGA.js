import BaseExecutor from '../BaseExecutor';

class ExecutorGA extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, mutationRate, CandidateFactory, uiHandler, msgHandler) {
        super(populationSize, timeout, generationCount, seedValue, mutationRate, CandidateFactory, uiHandler, msgHandler);
        this.population = this.generateBasePopulation();
        this.evaluateBasePopulation();

        this.imitationRate = 0.6;
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

        const firstPopulation = that.population.filter(candidate => candidate.playerNumber === 0);
        const secondPopulation = that.population.filter(candidate => candidate.playerNumber === 1);
        const thirdPopulation = that.population.filter(candidate => candidate.playerNumber === 2);

        const splittedPop = [firstPopulation, secondPopulation, thirdPopulation];

        for (let i = 0; i < splittedPop.length; i++) {
            for (let j = 0; j < splittedPop[i].length; j++) {
                const firstCandidateIndex = that.generator.range(splittedPop[i].length);
                let secondCandidateIndex = that.generator.range(splittedPop[i].length);
                while (firstCandidateIndex === secondCandidateIndex && splittedPop[i] > 1) {
                    secondCandidateIndex = that.generator.range(splittedPop[i].length);
                }
    
                let newCandidate;

                if (splittedPop[i][firstCandidateIndex].playerNumber > 0) {
                    if (that.generator.random() < that.imitationRate) {
                        let idx = that.generator.range(splittedPop[1].length + splittedPop[2].length);
                        while ((((i-1) * splittedPop[1].length) + firstCandidateIndex) === idx && splittedPop[i] > 1) {
                            idx = that.generator.range(splittedPop[1].length + splittedPop[2].length);
                        }
                        const thirdCandidate = idx >= splittedPop[1].length ? splittedPop[2][idx-splittedPop[1].length] : splittedPop[1][idx];
                        newCandidate = that.candidateFactory.imitate(splittedPop[i][firstCandidateIndex], thirdCandidate);
                    } else {
                        newCandidate = that.candidateFactory.cross(splittedPop[i][firstCandidateIndex], splittedPop[i][secondCandidateIndex]);
                    }
                } else {
                    newCandidate = that.candidateFactory.cross(splittedPop[i][firstCandidateIndex], splittedPop[i][secondCandidateIndex]);
                }
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate);
                }

                if (i === 0) {
                    splittedPop[i][j].fitness = that.candidateFactory.evaluate(splittedPop[i][j],
                        secondPopulation[that.generator.range(secondPopulation.length)], thirdPopulation[that.generator.range(thirdPopulation.length)]);
                } else {
                    splittedPop[i][j].fitness = that.candidateFactory.evaluate(splittedPop[i][j],
                        firstPopulation[that.generator.range(firstPopulation.length)]);
                }

                newPopulation.push(newCandidate);
            }
        }

        for (let i = 0; i < splittedPop.length; i++) {
            const partOfPopulation = that.select(that.population.concat(newPopulation).filter(candidate => candidate.playerNumber === i));
            that.uiHandler({x: that.counter, y: partOfPopulation[0].fitness, playerNumber: i});
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

export default ExecutorGA;