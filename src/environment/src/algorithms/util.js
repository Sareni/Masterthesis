import fs from 'fs';

function buildIndices(len) {
    const res = [];
    for (let i = 0; i < len; i++) {
        res.push(i);
    }
    return res;
}


function randomSelection(population, count, generator) {
    const result = [];
    let indexArray = buildIndices(population.length);

    while (result.length < count) {
        const arrayIndex = generator.range(indexArray.length);
        const index = indexArray[arrayIndex];
        result.push(population[index]);

        indexArray.splice(arrayIndex,1);
        if (indexArray.length === 0) {
            indexArray = buildIndices(population.length);
        }
    }

    return result;
}

let tournamentIndices= [];

function tournamentSelection(population, count, generator, first) {
    const result = [];
    const size = 3;

    if (first) {
        tournamentIndices = buildIndices(population.length);
    }

    while (result.length < count) {
        const tournamentParticipant = []; 

        while (tournamentParticipant.length < size) {
            const arrayIndex = generator.range(tournamentIndices.length);
            const index = tournamentIndices[arrayIndex];
            tournamentParticipant.push(population[index]);

            tournamentIndices.splice(arrayIndex,1);
            if (tournamentIndices.length === 0) {
                tournamentIndices = buildIndices(population.length);
            }
        }

        let winner = tournamentParticipant[0];
        tournamentParticipant.forEach((p) => {
            if (p.fitness > winner.fitness) {
                winner = p;
            }
        })
        result.push(winner);
    }

    return result;
}

function proportionalSelection(population, count, generator) {
    const result = [];

    let populationFitness = population.map(p => p.fitness);
    let indexArray = buildIndices(population.length);

    let min = populationFitness[0];
    populationFitness.forEach((f) => {
        if (f < min) {
            min = f;
        }
    });

    let shift = 0;
    if (min <= 0) {
        shift = Math.abs(min) + 1;
    }

    while (result.length < count) {
        let sum = 0;
        for (let i = 0; i < indexArray; i++) {
            sum += populationFitness[i] + shift;
        }
    
        const threshold = generator.random() * sum;

        let curSum = 0;
        for(let index = 0; index < indexArray.length; index++) {
            curSum += population[indexArray[index]].fitness + shift;
            if (curSum > threshold) {
                result.push(population[indexArray[index]]);

                indexArray.splice(index, 1);
                if (indexArray.length === 0) {
                    indexArray = buildIndices(population.length);
                }
                break;
            }
        }
    }

    return result;
}


function elitismReplacement(oldPop, newPop) {
    const pop = oldPop.concat(newPop);
    const filteredPopulation = pop.sort((a,b) => {
        if (a.fitness < b.fitness) {
            return 1;
        } else if (a.fitness > b.fitness) {
            return -1;
        } else {
            return 0;
        }
    });

    return filteredPopulation.slice(0, oldPop.length);
}

function randomReplacement(oldPop, newPop, generator) {
    const rate = 0.5;
    const result = [];
    let indexArray = buildIndices(oldPop.length);

    const threshold = oldPop.length * rate;

    for (let i = 0; i < threshold; i++) {
        let index = generator.range(indexArray.length); // care population.length != populationSize in some cases !!
        result.push(oldPop[indexArray[index]]);

        indexArray.splice(index, 1);
        if (indexArray.length === 0) {
            indexArray = buildIndices(oldPop.length);
        }
    }

    indexArray = buildIndices(newPop.length);
    for (let i = threshold; i < oldPop.length; i++) {
        let index = generator.range(indexArray.length); // care population.length != populationSize in some cases !!

        result.push(newPop[indexArray[index]]);

        indexArray.splice(index, 1);
        if (indexArray.length === 0) {
            indexArray = buildIndices(newPop.length);
        }
    }

    return result;
}

function completeReplacement(oldPop, newPop, generator) {
    const filteredPopulation = newPop.sort((a,b) => {
        if (a.fitness < b.fitness) {
            return 1;
        } else if (a.fitness > b.fitness) {
            return -1;
        } else {
            return 0;
        }
    });

    return filteredPopulation.slice(0, oldPop.length);
}

class Calculator {
    constructor (postfix) {
        this.aggregationArray = [];
        this.aggregationCountArray = [];
        this.lastArray = [];
        this.bestArray = [];
        this.postfix = postfix;
        this.lastGeneration = -1;
    }

    add(generation, fitness) {
        if (generation === 0) {
            this.lastArray = [];
        }

        this.lastArray[generation] = fitness;
        if (this.aggregationArray[generation]) {
            this.aggregationArray[generation] += fitness;
            if (this.lastGeneration !== generation) {
                this.aggregationCountArray[generation] += 1;
                this.lastGeneration = generation;
            }
        } else {
            this.aggregationArray[generation] = fitness;
            this.aggregationCountArray[generation] = 1;
        }
    }

    lastIsBest() {
        this.bestArray = [...this.lastArray];
    }

    finish(path) {
        let data = 'Generation;Fitness\n';
        for (let i = 0; i < this.aggregationCountArray.length; i++) {
            if (this.aggregationArray[i]) {
                const fitness = this.aggregationArray[i] / this.aggregationCountArray[i];
                data = `${data}${i};${fitness}\n`;
            } else {
                data = `${data}${i};0\n`;
            }
        }

        fs.writeFile(`${path}/average${this.postfix}.csv`, data, function(err) {
            if(err) {
                return console.log(err);
            }
        });

        data = 'Generation;Fitness\n';
        for (let i = 0; i < this.bestArray.length; i++) {
            if (this.bestArray[i]) {
                data = `${data}${i};${this.bestArray[i]}\n`;
            } else {
                data = `${data}${i};0\n`;
            }
        }

        fs.writeFile(`${path}/best${this.postfix}.csv`, data, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }
}


export {
    Calculator,
    randomReplacement,
    completeReplacement,
    elitismReplacement,
    randomSelection,
    proportionalSelection,
    tournamentSelection
}