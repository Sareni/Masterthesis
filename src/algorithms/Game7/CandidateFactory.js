import BaseCandidateFactory from '../BaseCandidateFactory';

class CandidateFactory extends BaseCandidateFactory {
    constructor(gameRounds, seedValue) {
        super(seedValue);
        this.gameRounds = gameRounds;
        this.strategyPool = 'ABC'; 
        this.strategyCount = this.strategyPool.length;
        this.max = 10;
        this.min = 2;
        this.playerTable = this.generatePlayerTable();
    }
    
    cross(c1, c2) {
        const newCandidate = {
            fitness: 0,
            strategy: '',
        }

        const split = this.generator.range(this.gameRounds-2)+1; // every candidate has to give at least one block to the new candidate
        newCandidate.strategy = c1.strategy.substring(0, split) + c2.strategy.substring(split);

        return newCandidate;
    }

    mutate(c) {
        const newCandidate = {
            fitness: 0,
            strategy: '',
        }
        const strategy = this.strategyPool.charAt(this.generator.range(this.strategyCount));
        const round = this.generator.range(this.gameRounds);

        let newStrategy = c.strategy.substring(0, round) + strategy;
        newStrategy += (round+1) === this.roundCount ? '' : c.strategy.substring(round+1);

        newCandidate.strategy = newStrategy;

        return newCandidate;
    }

    generate() {
        const candidate = {
            fitness: 0,
            strategy: '',
        }
        candidate.strategy = this.generateStrategy();

        return candidate;
    }

    evaluate(c1, c2) {
        let count = 0;
        let trusted = true;

        for (let i = 0; i < c1.strategy.length; i++) {
            const stategy1Idx = this.strategyPool.indexOf(c1.stategy.charAt(i));
            let stategy2 = 'C';
            if (trusted) {
                stategy2 = c2.stategy.charAt(i);
            }
            const stategy2Idx = this.strategyPool.indexOf(stategy2);

            count += this.playerTable[stategy1Idx * this.strategyCount + stategy2Idx];
        }
        
        return count;
    }

    // ---
    generateStrategy() {
        let strategy = '';
        for(let i = 0; i < this.roundCount; i++) {
            strategy += this.strategyPool.charAt(this.generator.range(this.strategyCount));
        }

        return strategy;
    }

    generatePlayerTable() {
        let playerTable = [];
        
        const first = -1 * (this.generator.range(this.max - this.min + 1) + this.min);
        const second = first * 3;
        const third = first * 0.5;
        const fourth = 2 * second;
        const fifth = Math.round((first + second) / 2);

        playerTable = [first, fourth, fourth,
                       third, second, fourth,
                       fourth, fourth, fifth];

        return playerTable;
    }
}

export default CandidateFactory;