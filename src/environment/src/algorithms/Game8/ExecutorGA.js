import BaseExecutor from '../BaseExecutor';
import { randomSelection } from '../util';


class ExecutorGA extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
         
        this.population = this.generateBasePopulation();
        this.evaluateBasePopulation();

        this.imitationRate = 0.6;
        this.playerCount = 3;

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
        let offspringBuffer = [];
        let tempOffspringBuffer = [];
        const offspringCount = that.useOptimization ? that.populationSize * 0.5 : 0;

        const firstPopulation = that.population.filter(candidate => candidate.playerNumber === 0);
        const secondPopulation = that.population.filter(candidate => candidate.playerNumber === 1);
        const thirdPopulation = that.population.filter(candidate => candidate.playerNumber === 2);

        const splittedPop = [firstPopulation, secondPopulation, thirdPopulation];

        for (let i = 0; i < splittedPop.length; i++) {
            let j = 0;
            while ((j < (splittedPop[i].length*that.selectionPressure) || tempOffspringBuffer.length < offspringCount) && newPopulation.length < (splittedPop[i].length*that.selectionPressure*5*splittedPop.length)){
                const candidates = that.selectionFunction(splittedPop[i], 2, that.generator, j===0);               
                let newCandidate;

                if (candidates[0].playerNumber > 0) {
                    if (that.generator.random() < that.imitationRate) {
                        candidates[1] = randomSelection(splittedPop[1].concat(splittedPop[2]), 1, that.generator, j===0)[0];
                        newCandidate = that.candidateFactory.imitate(...candidates);
                    } else {
                        newCandidate = that.candidateFactory.cross(...candidates);
                    }
                } else {
                    newCandidate = that.candidateFactory.cross(...candidates);
                }
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate);
                }

                if (i === 0) {
                    newCandidate.fitness = that.candidateFactory.evaluate(newCandidate,
                        secondPopulation[that.generator.range(secondPopulation.length)], thirdPopulation[that.generator.range(thirdPopulation.length)]);
                } else {
                    newCandidate.fitness = that.candidateFactory.evaluate(newCandidate,
                        firstPopulation[that.generator.range(firstPopulation.length)]);
                }

                if (that.useOptimization && (newCandidate.fitness > candidates[0].fitness && newCandidate.fitness > candidates[1].fitness)) {
                    tempOffspringBuffer.push(newCandidate);
                } else {
                    newPopulation.push(newCandidate);
                }

                j++;
            }

            offspringBuffer = offspringBuffer.concat(tempOffspringBuffer);
            tempOffspringBuffer = [];
        }

        for (let i = 0; i < splittedPop.length; i++) {
            let partOfPopulation;
            const filteredOffspringBuffer = offspringBuffer.filter(candidate => candidate.playerNumber === i);
            const filteredPopulation = that.population.filter(candidate => candidate.playerNumber === i);
            if (filteredOffspringBuffer.length >= filteredPopulation.length) {
                partOfPopulation = that.sortByFitness(filteredOffspringBuffer).slice(0, filteredPopulation.length);
            } else {
                const newPopulationFiltered = newPopulation.filter(candidate => candidate.playerNumber === i);
                const fillCandidates = that.sortByFitness(that.replacementFunction(filteredPopulation, newPopulationFiltered, that.generator)).slice(0, filteredPopulation.length - filteredOffspringBuffer.length);
                const candidates = filteredOffspringBuffer.concat(fillCandidates);
                partOfPopulation = that.sortByFitness(candidates);
            }
            that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(partOfPopulation[0])}`);
            that.uiHandler({x: that.counter, y: partOfPopulation[0].fitness, playerNumber: i, properties: partOfPopulation[0].properties});

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