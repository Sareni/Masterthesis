import BaseExecutor from '../BaseExecutor';

class ExecutorGA extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization) {
        super(populationSize, timeout, generationCount, seedValue, selectionPressure, mutationRate, CandidateFactory, uiHandler, msgHandler, selectionFunction, replacementFunction, useOptimization);
         
        // this.pressure = 2.0; used by all algos now
        this.population = this.generateBasePopulation();
        this.evaluateBasePopulation();
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
        let offspringBuffer = [];
        let tempOffspringBuffer = [];
        const offspringCount = that.useOptimization ? that.populationSize * 0.5 : 0;
        const offspringCountPerPlayer = offspringCount / that.candidateFactory.playerCount;

        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
            const thisPopulation = that.population.filter(candidate => candidate.playerNumber === i);
            const thatPopulation = that.population.filter(candidate => candidate.playerNumber !== i);

            let j = 0;
            while ((j < (thisPopulation.length*that.selectionPressure) || tempOffspringBuffer.length < offspringCountPerPlayer) && newPopulation.length < (thisPopulation.length*that.selectionPressure*Math.max(that.selectionPressure, 3)*that.candidateFactory.playerCount)) {
                const candidates = that.selectionFunction(thisPopulation, 2, that.generator, j===0);
    
                let newCandidate = that.candidateFactory.cross(...candidates);
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate);
                }

                const idx = that.generator.range(thatPopulation.length);
                newCandidate.fitness = that.candidateFactory.evaluate(newCandidate, thatPopulation[idx]);

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

        that.uiHandler({ x: 0, y: 0, playerNumber: -1 });        
        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
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

export default ExecutorGA;