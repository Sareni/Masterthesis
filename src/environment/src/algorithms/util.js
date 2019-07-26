
function randomSelection(population, count, generator) {
    const result = [];
    const indexHistory = [];

    while (result.length < count) {
        let index = generator.range(population.length); // care population.length != populationSize in some cases !!
        while (indexHistory.includes(index) && population.length >= count) {
            index = generator.range(population.length);
        }
        result.push(population[index]);
        indexHistory.push(index);
    }

    return result;
}

let tournamentIndexStorage = [];

function tournamentSelection(population, count, generator) {
    const result = [];
    const size = 3;

    while (result.length < count) {
        if (tournamentIndexStorage.length >= population.length) {
            tournamentIndexStorage = [];
        }

        const tournamentParticipant = []; 

        if ((population.length - tournamentIndexStorage.length) <= size) {
            const tournamentTempIndexStorage = [];

            while (tournamentParticipant.length < size) {
                let index = generator.range(population.length); // care population.length != populationSize in some cases !!
                if (tournamentIndexStorage.length < population.length) {
                    while (tournamentIndexStorage.includes(index)) {
                        index = generator.range(population.length);
                    }
                } else {
                    while (tournamentTempIndexStorage.includes(index) && population.length >= count) {
                        index = generator.range(population.length);
                    }
                    tournamentTempIndexStorage.push(index);
                }

                tournamentParticipant.push(population[index]);
                tournamentIndexStorage.push(index);
            }
        } else {
            for (let i = 0; i < population.length; i++) {
                if (!tournamentIndexStorage.includes(i) || population.length < count) {
                    tournamentParticipant.push(population[i]);
                }
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
    const indexHistory = [];


    let populationFitness = population.map(p => p.fitness);

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

    const sum = populationFitness.reduce((acc, cur) => {
        return acc + (cur + shift);
    }, 0);

    while (result.length < count) {
        const threshold = generator.random() * sum;

        let curSum = 0;
        for(let index = 0; index < population.length; index++) {
            curSum += population[index].fitness + shift;
            if (curSum > threshold) {
                if (!indexHistory.includes(index) || population.length < count) {
                    result.push(population[index]);
                    indexHistory.push(index);
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
    const indices = [];
    let indexHistory = [];
    const result = [];

    const threshold = oldPop.length * rate;

    for (let i = 0; i < threshold; i++) {
        let index = generator.range(oldPop.length); // care population.length != populationSize in some cases !!
        while (indices.includes(index)) {
            index = generator.range(oldPop.length);
        }
        indices.push(index);
    }

    for (let i = 0; i < oldPop.length; i++) {
        if (indices.includes(i)) {
            let index = generator.range(newPop.length); // care population.length != populationSize in some cases !!
            while (indexHistory.includes(index)) {
                index = generator.range(newPop.length);
            }
            indexHistory.push(index);
            result.push(newPop[index]);
            if (indexHistory.length === newPop.length) {
                indexHistory = [];
            }
        } else {
            result.push(oldPop[i]);
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


export {
    randomReplacement,
    completeReplacement,
    elitismReplacement,
    randomSelection,
    proportionalSelection,
    tournamentSelection
}