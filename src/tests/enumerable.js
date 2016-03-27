import {Enumerable} from '../linq6';
import 'should';

const ARRAY_OF_INTEGERS = [1, 2, 8, 3, 1, 16];
const MAP_OF_INTEGER_STRRING = [[1, 'One'], [5, 'Five'], [3, 'Three'], [12, 'Twelve']];

describe('Enumerable', function() {
    it('"from" should be able to create enumerable from iterables.', function() {
        (function() {
            Enumerable.from(ARRAY_OF_INTEGERS)
        }).should.not.throw();
        Enumerable.from(ARRAY_OF_INTEGERS).should.be.instanceOf(Enumerable);

        (function() {
            Enumerable.from(MAP_OF_INTEGER_STRRING)
        }).should.not.throw();
        Enumerable.from(MAP_OF_INTEGER_STRRING).should.be.instanceOf(Enumerable);
    });

    it('"from" should throw TypeError if source is not iterable.', function() {
        (function() {
            Enumerable.from({ name: 'test' })
        }).should.throw(TypeError);
    });

    it('should be iterable.', function() {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS);
        enumerable[Symbol.iterator].should.be.ok();
        enumerable[Symbol.iterator].should.be.type('function');
    });

    it('"aggregate" should be able to aggregate items in a sequence without a implicit seed.', function() {
        let sum = Enumerable.from(ARRAY_OF_INTEGERS).aggregate((sum, item) => sum + item);
        sum.should.be.exactly(31);
    });

    it('"aggregate" should be able to aggregate items in a sequence with a seed.', function() {
        let sum = Enumerable.from(ARRAY_OF_INTEGERS).aggregate((sum, item) => sum + item, 4);
        sum.should.be.exactly(35);
    });

    it('"aggregate" should be able to aggregate items in a sequence with a seed and result selector.', function() {
        let sum = Enumerable.from(ARRAY_OF_INTEGERS).aggregate((sum, item) => sum + item, 4, sum => sum * 2);
        sum.should.be.exactly(70);
    });

    it('"all" should be able to check if all item in a sequence satisfies a condition.', function() {
        Enumerable.from(ARRAY_OF_INTEGERS).all(x => x % 2 === 0).should.be.false();
        Enumerable.from(ARRAY_OF_INTEGERS).all(x => x < 20).should.be.true();
        Enumerable.from(ARRAY_OF_INTEGERS).all().should.be.true();
    });

    it('"any" should be able to check if any item in a sequence satisfies a cndition.', function() {
        Enumerable.from(ARRAY_OF_INTEGERS).any(x => x % 2 === 0).should.be.true();
        Enumerable.from(ARRAY_OF_INTEGERS).any(x => x > 20).should.be.false();
        Enumerable.from(ARRAY_OF_INTEGERS).any().should.be.true();
    });

    it('"count" should be able to return number of elements in the sequence.', function() {
        Enumerable.from(ARRAY_OF_INTEGERS).count().should.be.exactly(ARRAY_OF_INTEGERS.length);
    });

    it('"count" should be able to return number of elements in the sequence that satisfies a condition.', function() {
        Enumerable.from(ARRAY_OF_INTEGERS).count(x => x % 2 === 0).should.be.exactly(3);
    });

    it('"first" should be able to return the first element satisfying condition, throw error if none satisfies', function() {
        Enumerable.from(ARRAY_OF_INTEGERS).first().should.be.exactly(1);
        Enumerable.from(ARRAY_OF_INTEGERS).first(x => x > 5).should.be.exactly(8);
        (function() {
            Enumerable.from([]).first();
        }).should.throw('Sequence contains no matching element.');
        (function() {
            Enumerable.from(ARRAY_OF_INTEGERS).first(x => x > 100);
        }).should.throw('Sequence contains no matching element.');
    });
    
    it('"firstOrDefault" should be able to return the first element satisfying condition, or null if none satisfies', function() {
        Enumerable.from(ARRAY_OF_INTEGERS).firstOrDefault().should.be.exactly(1);
        Enumerable.from(ARRAY_OF_INTEGERS).firstOrDefault(x => x > 5).should.be.exactly(8);
        (Enumerable.from([]).firstOrDefault() === null).should.be.true();
        (Enumerable.from([]).firstOrDefault(x => x > 100) === null).should.be.true();
    });

    it('"toArray should be able to return the result in an array."', function() {
        let result = Enumerable.from(ARRAY_OF_INTEGERS).where(x => x > 5).select(x => x * 2).toArray();
        result.should.be.eql([16, 32]);
    });

    it('"select" should be able to project the iterable using selector.', function() {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).select(x => x * 2);
        enumerable.should.be.instanceOf(Enumerable);
        enumerable.toArray().should.be.eql([2, 4, 16, 6, 2, 32]);
    });

    it('"select" should be project the iterable as is if no selector is supplied.', function() {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).select();
        enumerable.should.be.instanceOf(Enumerable);
        enumerable.toArray().should.be.eql([1, 2, 8, 3, 1, 16]);
    });

    it('"skip" should be able to skip specified number of elements.', function() {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).skip(3);
        enumerable.should.be.instanceOf(Enumerable);
        enumerable.toArray().should.be.eql([3, 1, 16]);
    });

    it('"skipWhile" should be able to skip elements till condition satisfies, then return rest.', function() {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).skipWhile(x => x < 5);
        enumerable.should.be.instanceOf(Enumerable);
        enumerable.toArray().should.be.eql([8, 3, 1, 16]);
    });

    it('"take" should be able to return specified number of elements.', function() {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).take(3);
        enumerable.should.be.instanceOf(Enumerable);
        enumerable.toArray().should.be.eql([1, 2, 8]);
    });

    it('"takeWhile" should be able to return elements till condition satisfies.', function() {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).takeWhile(x => x != 3);
        enumerable.should.be.instanceOf(Enumerable);
        enumerable.toArray().should.be.eql([1, 2, 8]);
    });

    it('"where" should be able to filter the iterable using predicate.', function() {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).where(x => x > 2);
        enumerable.should.be.instanceOf(Enumerable);
        enumerable.toArray().should.be.eql([8, 3, 16]);
    });

    it('"where" should return all items in sequence if no predicate is supplied.', function() {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).where();
        enumerable.should.be.instanceOf(Enumerable);
        enumerable.toArray().should.be.eql([1, 2, 8, 3, 1, 16]);
    });
});