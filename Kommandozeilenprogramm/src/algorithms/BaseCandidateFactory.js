import Generator from 'random-seed';

class BaseCandidateFactory {
    constructor (seedValue) {
        this.generator = Generator.create(seedValue);
    }
    cross(c1, c2) {
        throw new Error('cross: not implemented');
    }

    mutate(c) {
        throw new Error('mutate: not implemented');
    }

    generate() {
        throw new Error('generateOne: not implemented');
    }

    evaluate(c) {
        throw new Error('evaluate: not implemented');
    }
}

export default BaseCandidateFactory;