import BaseExecutor from '../BaseExecutor';

class ExecutorGA extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
        this.population = this.generateBasePopulation();
        this.population = this.evaluateBasePopulation();        
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
        let offspringBuffer = new Array(that.candidateFactory.playerCount);
        const parentOneFitness = new Array(that.candidateFactory.playerCount);
        const parentTwoFitness = new Array(that.candidateFactory.playerCount);
        const offspringCount = that.useOptimization ? that.populationSize * 0.5 : 0;

        const populationGroups = [];
        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
            const group = that.population.filter(candidate => candidate.playerNumber === i);
            populationGroups.push(group);
            offspringBuffer[i] = [];

        }

        let j = 0;
        let offspringBufferFull = 0;


        while ((j < that.populationSize*that.selectionPressure || offspringBufferFull < that.candidateFactory.playerCount) && newPopulation.length < (that.populationSize.length*that.selectionPressure*Math.max(that.selectionPressure, 3)*that.candidateFactory.playerCount)) {
            offspringBufferFull = 0;            
            const candidateArray = [];
            for (let k = 0; k < that.candidateFactory.playerCount; k++) {
                const candidates = that.selectionFunction(populationGroups[k], 2, that.generator, j===0);
                let newCandidate = that.candidateFactory.cross(...candidates);
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate);
                }

                parentOneFitness[k] = candidates[0];
                parentTwoFitness[k] = candidates[1];

                candidateArray.push(newCandidate);
            }
            const results = that.candidateFactory.evaluate(candidateArray);
            for (let k = 0; k < that.candidateFactory.playerCount; k++) {
                candidateArray[k].fitness = results[k];

                if (that.useOptimization && (candidateArray[k].fitness > parentOneFitness[k].fitness && candidateArray[k].fitness > parentTwoFitness[k].fitness)) {
                    offspringBuffer[k].push(candidateArray[k]);         
                } else {
                    newPopulation.push(candidateArray[k]);
                }

                if (offspringBuffer[k].length >= offspringCount) {
                    offspringBufferFull++;
                }
            }
            j++;
        }

        for (let i = 0; i < populationGroups.length; i++) {
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
            that.uiHandler({x: that.counter, y: partOfPopulation[0].fitness, playerNumber: i});

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

export default ExecutorGA;