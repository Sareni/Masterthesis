import Generator from 'random-seed';


function randomSelection(population, count, generator) {
    const result = [];
    const indexHistory = [];

    while (result.length < count) {
        let index = generator.range(population.length); // care population.length != populationSize in some cases !!
        while (indexHistory.includes(index)) {
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
        if (tournamentIndexStorage.length === population.length) {
            tournamentIndexStorage = [];
        }

        const tournamentParticipant = []; 
        if ((population.length - tournamentIndexStorage.length) <= size) {
            while (tournamentParticipant.length < size) {
                let index = generator.range(population.length); // care population.length != populationSize in some cases !!
                while (tournamentIndexStorage.includes(index)) {
                    index = generator.range(population.length);
                }
                tournamentParticipant.push(population[index]);
                tournamentIndexStorage.push(index);
            }
        } else {
            for (let i = 0; i < population.length; i++) {
                if (!tournamentIndexStorage.includes(i)) {
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


}

function proportionalSelection(population, count, generator, allowNegativeFitness = false) {
    const result = [];
    const indexHistory = [];

    let sum = population.map(p => p.fitness).reduce((acc, cur) => {
        return acc + (cur > 0 ? cur : 0);
    });

    if (allowNegativeFitness) sum = Math.abs(sum);

    while (result.length < count) {
        const threshold = generator.range(sum) + 1;

        let index = 0;
        let curSum = 0;
        for(; index < population.length; index++) {
            if (allowNegativeFitness) {
                curSum += Math.abs(population[index].fitness);
            } else {
                curSum += population[index].fitness > 0 ? population[index].fitness : 0;
            }
    
            if (curSum > threshold) {
                if (!indexHistory.includes(index)) {
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
    const indexHistory = [];
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
        } else {
            result.push(oldPop[i]);
        }
    }

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