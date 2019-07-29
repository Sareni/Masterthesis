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
    console.log('test8', newPop, oldPop);

    const threshold = oldPop.length * rate;

    for (let i = 0; i < threshold; i++) {
        let index = generator.range(indexArray.length); // care population.length != populationSize in some cases !!
        result.push(oldPop[indexArray[index]]);

        indexArray.splice(index, 1);
        if (indexArray.length === 0) {
            indexArray = buildIndices(oldPop.length);
        }
    }
    console.log('test7', result);

    indexArray = buildIndices(newPop.length);
    for (let i = threshold; i < oldPop.length; i++) {
        let index = generator.range(indexArray.length); // care population.length != populationSize in some cases !!

        result.push(newPop[indexArray[index]]);

        indexArray.splice(index, 1);
        if (indexArray.length === 0) {
            indexArray = buildIndices(oldPop.length);
        }
    }

    console.log('test6', result);

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


export {
    randomReplacement,
    completeReplacement,
    elitismReplacement,
    randomSelection,
    proportionalSelection,
    tournamentSelection
}