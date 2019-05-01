import BaseCandidateFactory from '../BaseCandidateFactory';

class CandidateFactory extends BaseCandidateFactory {
    constructor(seedValue) {
        super(seedValue);
        this.playerTables = this.generatePlayerTables();
        this.optionCount = 4;
        this.maxDelta = 0.25;
        this.minDelta = -0.25;

        this.populationCounter = 0;
    }
    
    cross(c1, c2) {
        const newCandidate = {
            fitness: 0,
            properties: [],
            playerNumber: c1.playerNumber,
        }

        const split = this.generator.range(this.optionCount-2)+1; // every candidate has to give at least one block to the new candidate
        newCandidate.properties = c1.properties.slice(0, split).concat(c2.properties.slice(split));
        newCandidate.properties = this.fixProperties(newCandidate.properties);        

        return newCandidate;
    }

    mutate(c) {
        const newCandidate = {
            fitness: 0,
            properties: [],
            playerNumber: c.playerNumber,
        }

        const pos = this.generator.range(this.optionCount);
        const delta = (this.generator.random() * (this.maxDelta - this.minDelta)) + this.minDelta;

        let realDelta = delta;

        if (c.properties[pos] + delta > 1) {
            realDelta = 1 - c.properties[pos];
        } else if (c.properties[pos] + delta < 0) {
            realDelta = 0 - c.properties[pos];
        }

        const realDeltaParts = realDelta / (this.optionCount - 1);

        c.properties.forEach((p, idx) => {
            newCandidate.properties[idx] = p - realDeltaParts;
        });

        newCandidate.properties[pos] = + realDelta + realDeltaParts;
        newCandidate.properties = this.fixProperties(newCandidate.properties);

        return newCandidate;
    }

    generate() {
        const candidate = {
            fitness: 0,
            properties: [],
            playerNumber: this.populationCounter % 3,
        }
        
        for (let i = 0; i < this.optionCount; i++) {
            candidate.properties[i] = this.generator.random();
        }

        candidate.properties = this.fixProperties(candidate.properties);
        

        this.populationCounter += 1;
        return candidate;
    }

    evaluate(c1, c2, c3) {
        let count = 0;
        if (c1.playerNumber === 0) {
            for (let i = 0; i < c1.properties.length; i++) {
                count += c1.properties[i] * c2.properties[i] * this.playerTables[c1.playerNumber][1] +
                         c1.properties[i] * c3.properties[i] * this.playerTables[c1.playerNumber][0];
            }
        } else {
            for (let i = 0; i < c1.properties.length; i++) {
                count += this.playerTables[c1.playerNumber][i] * c1.properties[i] +
                         this.playerTables[c1.playerNumber][this.playerTables[c1.playerNumber].length-1] * c2.properties[i] * c1.properties[i];
            }
        }
        
        return count;
    }

    // ---
    fixProperties(p) {
        const newProperties = p.map(prop => {
            if (prop < 0) return 0;
            if (prop > 1) return 1;
            return prop;
        });

        const sum = newProperties.reduce((acc, cur) => {
            return acc + cur;
        });

        if (sum === 1) {
            return newProperties;
        }

        let counter = newProperties.length;
        let diff = sum - 1;

        while (diff > Math.abs(0.00001)) {
            const diffPart = diff / counter;
            for (let i = 0; i < newProperties.length; i++) {
                const newVal = newProperties[i] - diffPart;
                if (newVal > 1) {
                    if (newProperties[i] !== 1) {
                        counter -= 1;
                        diff -= 1 - newProperties[i];
                        newProperties[i] = 1;
                    }
          
                } else if (newVal < 0) {
                    if (newProperties[i] !== 0) {
                        counter -= 1;
                        diff -= newProperties[i];
                        newProperties[i] = 0;  
                    }
                } else {
                    newProperties[i] = newVal;
                    diff -= diffPart;
                }
            }
        }

        // correction for inaccuracy
        for (let i = 0; i < newProperties.length; i++) {
            const newVal = newProperties[i] - diff;
            if (newVal <= 1 || newVal >= 0) {
                newProperties[i] += newVal;
                break;
            }
        }

        return newProperties;
    }

    generatePlayerTables() {
        return [
            [6, -6],
            [7, 5, 6, 2, -6],
            [10, 2, 6, 0, -12],
        ]
    }
}

export default CandidateFactory;