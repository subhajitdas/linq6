import {Enumerable} from '../linq6';
import 'should';

describe('Enumerable', function() {
    it('"from()" should be able to create enumerable from iterables.', function() {
        let arr = [1, 2, 3, 4, 5],
            map = new Map([[1, 10], [2, 20], [3, 30]]);
        (function() {
            Enumerable.from(arr)
        }).should.not.throw();
        Enumerable.from(arr).should.be.instanceOf(Enumerable);

        (function() {
            Enumerable.from(arr)
        }).should.not.throw();
        Enumerable.from(map).should.be.instanceOf(Enumerable);
    });

    it('"from()" should throw TypeError if source is not iterable.', function() {
        (function() {
            Enumerable.from({ name: 'test' })
        }).should.throw(TypeError);
    });

    it('should be iterable.', function() {
        let enumerable = Enumerable.from([1, 2, 3, 4, 5]);
        enumerable[Symbol.iterator].should.be.ok();
        enumerable[Symbol.iterator].should.be.type('function');
    });

    it('"where" should be able to filter the iterable using predicate', function() {
        let enumerable = Enumerable.from([1, 2, 3, 4, 5]).where(x => x > 2);
        enumerable.should.be.instanceOf(Enumerable);
        Array.from(enumerable).should.be.eql([3, 4, 5]);
    });
    
    it('"select" should be able to project the iterable using selector', function() {
        let enumerable = Enumerable.from([1, 2, 3, 4, 5]).select(x => x * 2);
        enumerable.should.be.instanceOf(Enumerable);
        Array.from(enumerable).should.be.eql([2, 4, 6, 8, 10]);
    });
});