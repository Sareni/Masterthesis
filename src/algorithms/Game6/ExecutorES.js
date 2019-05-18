import BaseExecutor from '../BaseExecutor';

class ExecutorES extends BaseExecutor {

    constructor(generationCount, seedValue, populationSize, timeout, mutationRate, candidateFactory, uiHandler, msgHandler) {
        super(populationSize, timeout, generationCount, seedValue, mutationRate, candidateFactory, uiHandler, msgHandler);

        this.pressure = 1.5;
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


        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
            const thisPopulation = that.population.filter(candidate => candidate.playerNumber === i);
            const thatPopulation = that.population.filter(candidate => candidate.playerNumber !== i);

            
            for (let j = 0; j < (thisPopulation.length * that.pressure); j++) {
                const firstCandidateIndex = that.generator.range(thisPopulation.length);
    
                let newCandidate = {
                    fitness: thisPopulation[firstCandidateIndex].fitness,
                    x: thisPopulation[firstCandidateIndex].x,
                    y: thisPopulation[firstCandidateIndex].y,
                    playerNumber: thisPopulation[firstCandidateIndex].playerNumber,
                }
                //let newCandidate = JSON.parse(JSON.stringify(that.population[firstCandidateIndex]));
                if (that.generator.random() < that.mutationRate) {
                    newCandidate = that.candidateFactory.mutate(newCandidate);
                }
                newCandidate.fitness = that.candidateFactory.evaluate(newCandidate, thatPopulation[that.generator.range(thatPopulation.length)]);
                newPopulation.push(newCandidate);
            }
        }

        that.uiHandler({ x: 0, y: 0, playerNumber: -1 });        
        for (let i = 0; i < that.candidateFactory.playerCount; i++) {
            const partOfPopulation = that.select(newPopulation.filter(candidate => candidate.playerNumber === i));
            that.msgHandler(that.counter, 'status', `Best Candidate: ${JSON.stringify(partOfPopulation[0])}`);

            for (let j = 0; j < 10; j++) {
                if (partOfPopulation.length > j) {
                    that.uiHandler({x: partOfPopulation[j].x, y: partOfPopulation[j].y, playerNumber: partOfPopulation[j].playerNumber+1});
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