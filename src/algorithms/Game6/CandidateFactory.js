import BaseCandidateFactory from '../BaseCandidateFactory';

class CandidateFactory extends BaseCandidateFactory {
    constructor(playerCount, xMax, yMax, seedValue) {
        super(seedValue);

        this.playerCount = playerCount;
        this.xMax = xMax;
        this.yMax = yMax;

        this.deltaX = 2;
        this.deltaY = 2;

        this.maxDist = 1000;

        this.populationCounter = 0;
    }
    
    cross(c1, c2) {
        const newCandidate = {
            fitness: 0,
            x: c1.x,
            y: c2.y,
            playerNumber: c1.playerNumber,
        }

        return newCandidate;
    }

    mutate(c) {
        const newCandidate = {
            fitness: 0,
            x: c.x,
            y: c.y,
            playerNumber: c.playerNumber,
        }
        if (this.generator.random() < 0.5) {
            newCandidate.x += this.deltaX * (this.generator.random() - 0.5);
        } else {
            newCandidate.y += this.deltaY * (this.generator.random() - 0.5);
        }
        return newCandidate;
    }


    generate() {
        const candidate = {
            fitness: 0,
            x: 0,
            y: 0,
            playerNumber: 0,
        }
        candidate.x = this.generator.range(this.xMax) + 1;
        candidate.y = this.generator.range(this.yMax) + 1;

        candidate.playerNumber = this.populationCounter % this.playerCount;
        this.populationCounter += 1;


        // candidate.fitness = this.evaluate(candidate);

        return candidate;
    }

    evaluate(c1, c2) {
        let count = 0;
        for (let i = 0; i <= this.xMax; i++) {
            for (let j = 0; j <= this.yMax; j++) {
                const dist1 = Math.sqrt(Math.pow(c1.x - i, 2) + Math.pow(c1.y - j, 2));
                const dist2 = Math.sqrt(Math.pow(c2.x - i, 2) + Math.pow(c2.y - j, 2));
                if (dist1 < this.maxDist) {
                    if (dist1 < dist2) {
                        count += 1;
                    } else if (dist1 === dist2) {
                        count += 0.5;
                    }
                }
            }
        }

        return count;
    }
}

export default CandidateFactory;