import Enumerable from './enumerable';
import 'should';
import * as sinon from 'sinon';
import 'should-sinon';

const ARRAY_OF_INTEGERS = [1, 2, 8, 3, 1, 16];
const ARRAY_ELEMENTS_WITH_COLLECTION = [
    { Id: 1, children: [11, 12, 13, 14, 15] },
    { Id: 2, children: [21, 22, 23, 24, 25] },
    { Id: 3, children: [31, 32, 33, 34, 35] }
];
const MAP_OF_INTEGER_STRRING = new Map([[1, 'One'], [5, 'Five'], [3, 'Three'], [12, 'Twelve']]);

describe('Enumerable', function () {
    describe('static method "empty"', function () {
        it('should return an empty Enumerable.', function () {
            let enumerable = Enumerable.empty();
            enumerable.should.be.instanceof(Enumerable);
            enumerable[Symbol.iterator]().next().done.should.be.true();
        });
    });

    describe('static method "from"', function () {
        it('should create and return Enumerable from an array.', function () {
            (function () {
                Enumerable.from(ARRAY_OF_INTEGERS)
            }).should.not.throw();
            Enumerable.from(ARRAY_OF_INTEGERS).should.be.instanceOf(Enumerable);
        });

        it('should create and return Enumerable from a map.', function () {
            (function () {
                Enumerable.from(MAP_OF_INTEGER_STRRING)
            }).should.not.throw();
            Enumerable.from(MAP_OF_INTEGER_STRRING).should.be.instanceOf(Enumerable);
        });

        it('should throw TypeError if source is not iterable.', function () {
            (function () {
                Enumerable.from({ name: 'test' })
            }).should.throw(TypeError);
        });
    });

    it('should be iterable.', function () {
        let enumerable = Enumerable.from(ARRAY_OF_INTEGERS);
        enumerable[Symbol.iterator].should.be.ok();
        enumerable[Symbol.iterator].should.be.type('function');
    });

    describe('method "aggregate"', function () {
        it('should aggregate items in a sequence without a implicit seed.', function () {
            let sum = Enumerable.from(ARRAY_OF_INTEGERS).aggregate((sum, item) => sum + item);
            sum.should.be.exactly(31);
        });
        it('should aggregate items in a sequence with a seed.', function () {
            let sum = Enumerable.from(ARRAY_OF_INTEGERS).aggregate((sum, item) => sum + item, 4);
            sum.should.be.exactly(35);
        });
        it('should aggregate items in a sequence with a seed and result selector.', function () {
            let sum = Enumerable.from(ARRAY_OF_INTEGERS).aggregate((sum, item) => sum + item, 4, sum => sum * 2);
            sum.should.be.exactly(70);
        });
    });

    describe('method "all"', function () {
        it('should check if all item in a sequence satisfies a condition.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).all(x => x % 2 === 0).should.be.false();
            Enumerable.from(ARRAY_OF_INTEGERS).all(x => x < 20).should.be.true();
        });
        it('should always return true if no predicate is provided.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).all().should.be.true();
        });
    });

    describe('method "any"', function () {
        it('should check if any item in a sequence satisfies a condition.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).any(x => x % 2 === 0).should.be.true();
            Enumerable.from(ARRAY_OF_INTEGERS).any(x => x > 20).should.be.false();

        });
        it('should always return true if no predicate is provided.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).any().should.be.true();
        });
    });

    describe('method "concat"', function () {
        it('should throw TypeError if the sequence to concatenate is not iterable.', function () {
            (function () {
                Enumerable.from(ARRAY_OF_INTEGERS).concat({ a: 1 }).toArray();
            }).should.throw('Sequence to concat must be iterable.');
        });
        it('should concatenate a sequence to current sequence', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).concat([5, 10, 15, 20]);
            enumerable.should.be.instanceof(Enumerable);
            enumerable.toArray().should.be.eql([1, 2, 8, 3, 1, 16, 5, 10, 15, 20]);

            Enumerable.from(ARRAY_OF_INTEGERS).concat([]).toArray()
                .should.be.eql([1, 2, 8, 3, 1, 16]);

            Enumerable.from(ARRAY_OF_INTEGERS).concat([{ a: 1 }, { b: 2 }]).toArray()
                .should.be.eql([1, 2, 8, 3, 1, 16, { a: 1 }, { b: 2 }]);
        });
    });

    describe('method "contains"', function () {
        it('should determine if sequence contains an element using default comparer',
            function () {
                Enumerable.from(ARRAY_OF_INTEGERS).contains(3).should.be.true();
                Enumerable.from(ARRAY_OF_INTEGERS).contains(5).should.be.false();
            });
        it('should determine if sequence contains an element using provided comparer',
            function () {
                Enumerable.from(ARRAY_ELEMENTS_WITH_COLLECTION)
                    .contains(3, (source, target) => source.Id === target).should.be.true();
                Enumerable.from(ARRAY_ELEMENTS_WITH_COLLECTION)
                    .contains(5, (source, target) => source.Id === target).should.be.false();
            });
    });

    describe('method "count"', function () {
        it('should return number of elements in the sequence.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).count().should.be.exactly(ARRAY_OF_INTEGERS.length);
        });

        it('should return number of elements in the sequence that satisfies the predicate is supplied.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).count(x => x % 2 === 0).should.be.exactly(3);
        });
    });

    describe('method "distinct"', function () {
        it('should return distinct elements in the sequence',
            function () {
                const enumerable = Enumerable.from([1, 2, 1, 9, 3, 3, 4, 7, 2]).distinct();
                enumerable.should.be.instanceOf(Enumerable);
                enumerable.toArray().should.be.eql([1, 2, 9, 3, 4, 7]);
            });
        it('should return distinct elements in the sequence, while comparing elements using supplied function',
            function () {
                const enumerable = Enumerable.from([
                    { value: 1 }, { value: 2 }, { value: 1 },
                    { value: 9 }, { value: 3 }, { value: 3 },
                    { value: 4 }, { value: 7 }, { value: 2 }
                ]).distinct((itema, itemb) => itema.value === itemb.value);
                enumerable.should.be.instanceOf(Enumerable);
                enumerable.toArray().should.be.eql([
                    { value: 1 }, { value: 2 }, { value: 9 },
                    { value: 3 }, { value: 4 }, { value: 7 }
                ]);
            });
    });

    describe('method "first"', function () {
        it('should return the first element if no predicate is provided.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).first().should.be.exactly(1);
        });
        it('should return the first element that satisfies supplied predicate.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).first(x => x > 5).should.be.exactly(8);
        });
        it('should throw error if the sequence is empty', function () {
            (function () {
                Enumerable.from(ARRAY_OF_INTEGERS).first(x => x > 100);
            }).should.throw('Sequence contains no matching element.');
        });
        it('should throw error is no element satisfies supplied predicate.', function () {
            (function () {
                Enumerable.from(ARRAY_OF_INTEGERS).first(x => x > 100);
            }).should.throw('Sequence contains no matching element.');
        });
    });

    describe('method "firstOrDefault"', function () {
        it('should return the first element if no predicate is provided.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).firstOrDefault().should.be.exactly(1);
        });
        it('should return the first element that satisfies supplied predicate.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).firstOrDefault(x => x > 5).should.be.exactly(8);
        });
        it('should return null if the sequence is empty', function () {
            (Enumerable.from([]).firstOrDefault() === null).should.be.true();
        });
        it('should return null if no element satisfies the predicate', function () {
            (Enumerable.from([]).firstOrDefault(x => x > 100) === null).should.be.true();
        });
    });

    describe('method "join"', function () {
        it('should throw TypeError if the inner sequence is not iterable.',
            function () {
                (function () {
                    Enumerable.from(ARRAY_OF_INTEGERS)
                        .join({ x: 1 }, outer => outer, inner => inner,
                        (outer, inner) => outer)
                        .toArray();
                }).should.throw('Sequence to join must be iterable.');
            });
        it('should join current sequence with another based on matching keys',
            function () {
                let enumerable = Enumerable.from(ARRAY_OF_INTEGERS)
                    .join([8, 1, 3, 16, 5, 12], outer => outer, inner => inner,
                    (outer, inner) => outer);
                enumerable.should.be.instanceof(Enumerable);
                enumerable.toArray().should.be.eql([1, 8, 3, 1, 16]);
            });
        it('should not fail while joining current sequence with a empty sequence',
            function () {
                let enumerable = Enumerable.from(ARRAY_OF_INTEGERS)
                    .join([], outer => outer, inner => inner,
                    (outer, inner) => outer);
                enumerable.should.be.instanceof(Enumerable);
                enumerable.toArray().should.be.empty();
            });
        it('should join current sequence with another with different structure',
            function () {
                let enumerable = Enumerable.from(ARRAY_OF_INTEGERS)
                    .join([{ a: 8 }, { a: 1 }, { a: 3 }, { a: 16 }, { a: 5 }, { a: 12 }],
                    outer => outer, inner => inner.a, (outer, inner) => outer);
                enumerable.should.be.instanceof(Enumerable);
                enumerable.toArray().should.be.eql([1, 8, 3, 1, 16]);
            });
        it('should join current sequence with another and project the result using result selector.',
            function () {
                let enumerable = Enumerable.from(ARRAY_OF_INTEGERS)
                    .join([{ a: 8 }, { a: 1 }, { a: 3 }, { a: 16 }, { a: 5 }, { a: 12 }],
                    outer => outer, inner => inner.a, (outer, inner) => ({ b: inner.a }));
                enumerable.should.be.instanceof(Enumerable);
                enumerable.toArray().should.be.eql([{ b: 1 }, { b: 8 }, { b: 3 }, { b: 1 }, { b: 16 }]);
            });
        it('should join current sequence with another by matching keys based on compare function.',
            function () {
                let enumerable = Enumerable.from([{ b: 1 }, { b: 2 }, { b: 8 }, { b: 3 }, { b: 1 }, { b: 16 }])
                    .join([{ a: 8 }, { a: 1 }, { a: 3 }, { a: 16 }, { a: 5 }, { a: 12 }],
                    outer => outer, inner => inner,
                    (outer, inner) => outer.b,
                    (outer, inner) => outer.b === inner.a);
                enumerable.should.be.instanceof(Enumerable);
                enumerable.toArray().should.be.eql([1, 8, 3, 1, 16]);
            });
    });

    describe('method "toArray"', function () {
        it('should return the result in an array."', function () {
            let result = Enumerable.from(ARRAY_OF_INTEGERS).where(x => x > 5).select(x => x * 2).toArray();
            result.should.be.instanceof(Array);
            result.should.be.eql([16, 32]);
        });
    });

    describe('method "select"', function () {
        it('should project the iterable using selector.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).select(x => x * 2);
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([2, 4, 16, 6, 2, 32]);
        });
        it('should project the iterable as is if no selector is supplied.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).select();
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([1, 2, 8, 3, 1, 16]);
        });
        it('should be lazy', function () {
            const selector = sinon.spy(function (x) {
                return x * 2;
            });
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).select(selector);
            selector.should.not.be.called();
            let result = enumerable.toArray();
            selector.should.be.called();
        });
    });

    describe('method "selectMany"', function () {
        it('should return flattened collection from a sequence using the collection selector.',
            function () {
                let enumerable = Enumerable.from(ARRAY_ELEMENTS_WITH_COLLECTION).selectMany(x => x.children);
                enumerable.should.be.instanceOf(Enumerable);
                enumerable.toArray().should.be.eql([11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35]);
            });

        it('should return flattened collection from a sequence using the collection selector and result selector.',
            function () {
                let enumerable = Enumerable.from(ARRAY_ELEMENTS_WITH_COLLECTION).selectMany(x => x.children, x => x * 2);
                enumerable.should.be.instanceOf(Enumerable);
                enumerable.toArray().should.be.eql([22, 24, 26, 28, 30, 42, 44, 46, 48, 50, 62, 64, 66, 68, 70]);
            });

        it('should return blank sequence if the sequence is empty.', function () {
            let enumerable1 = Enumerable.from([]).selectMany(x => x.children);
            enumerable1.should.be.instanceOf(Enumerable);
            enumerable1.count().should.be.exactly(0);
        });

        it('should throw error if the collection selected is not iterable.', function () {
            (function () {
                let enumerable = Enumerable.from(ARRAY_ELEMENTS_WITH_COLLECTION)
                    .selectMany(x => x.Id, x => x * 2)
                    .toArray();
            }).should.throw('Collection must be iterable.');
        });

        it('should be lazy.', function () {
            const collectionSelector = sinon.spy(function (x) {
                return x.children;
            }), resultSelector = sinon.spy(function (x) {
                return x * 2;
            });
            let enumerable = Enumerable.from(ARRAY_ELEMENTS_WITH_COLLECTION)
                .selectMany(collectionSelector, resultSelector);
            collectionSelector.should.not.be.called();
            resultSelector.should.not.be.called();
            let result = enumerable.toArray();
            collectionSelector.should.be.called();
            resultSelector.should.be.called();
        });
    });

    describe('method "single"', function () {
        it('should return only element of a sequence that satisfies the condition.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).single(x => x === 3).should.be.exactly(3);
        });
        it('should throw error if no element satisfies the condition.', function () {
            (function () {
                Enumerable.from(ARRAY_OF_INTEGERS).single(x => x > 100);
            }).should.throw('Sequence contains no matching element.');
        });
        it('should throw error if more than one element satisfies the condition.', function () {
            (function () {
                Enumerable.from(ARRAY_OF_INTEGERS).single(x => x === 1);
            }).should.throw('Sequence contains more than one matching element');
        });
        it('should throw error if the sequence is empty as no element satisfies the condition.', function () {
            (function () {
                Enumerable.from([]).single();
            }).should.throw('Sequence contains no matching element.');

            (function () {
                Enumerable.from([]).single(x => x > 100);
            }).should.throw('Sequence contains no matching element.');
        });
    });

    describe('method "singleOrDefault"', function () {
        it('should return only element of a sequence that satisfies the condition.', function () {
            Enumerable.from(ARRAY_OF_INTEGERS).single(x => x === 3).should.be.exactly(3);
        });
        it('should return null if no element satisfies the condition.', function () {
            (Enumerable.from([]).singleOrDefault(x => x > 100) === null).should.be.true();
        });
        it('should throw error if more than one element satisfies the condition.', function () {
            (function () {
                Enumerable.from(ARRAY_OF_INTEGERS).single(x => x === 1);
            }).should.throw('Sequence contains more than one matching element');
        });
        it('should return null if the sequence is empty, as no element satisfies the condition.', function () {
            (Enumerable.from([]).singleOrDefault() === null).should.be.true();
            (Enumerable.from([]).singleOrDefault(x => x === 1) === null).should.be.true();
        });
    });

    describe('method "skip"', function () {
        it('should skip specified number of elements in the sequence.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).skip(3);
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([3, 1, 16]);
        });

        it('should not skip any element if no number is provided.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).skip();
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([1, 2, 8, 3, 1, 16]);
        });
    });

    describe('method "skipWhile"', function () {
        it('should skip elements in sequence till condition satisfies.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).skipWhile(x => x < 5);
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([8, 3, 1, 16]);
        });
        it('should return all elements if no condition is provided.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).skipWhile();
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([1, 2, 8, 3, 1, 16]);
        });
        it('should be lazy.', function () {
            const predicate = sinon.spy(function (x) {
                return x < 5;
            });
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).skipWhile(predicate);
            predicate.should.not.be.called();
            let result = enumerable.toArray();
            predicate.should.be.called();
        });
    });

    describe('method "take"', function () {
        it('should return specified number of elements from beginning, then skip rest.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).take(3);
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([1, 2, 8]);
        });
        it('should not return elements if no number is provided.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).take();
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.count().should.be.exactly(0);
        });
    });

    describe('methid "takeWhile"', function () {
        it('should return elements till condition satisfies, the skip the rest.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).takeWhile(x => x != 3);
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([1, 2, 8]);
        });
        it('should return all elements if no condition is provided.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).takeWhile();
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([1, 2, 8, 3, 1, 16]);
        });
        it('should be lazy.', function () {
            const predicate = sinon.spy(function (x) {
                return x !== 3;
            });
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).takeWhile(predicate);
            predicate.should.not.be.called();
            let result = enumerable.toArray();
            predicate.should.be.called();
        });
    });

    describe('method "where"', function () {
        it('should filter the sequence using predicate.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).where(x => x > 2);
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([8, 3, 16]);
        });
        it('should return all items if no predicate is supplied.', function () {
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).where();
            enumerable.should.be.instanceOf(Enumerable);
            enumerable.toArray().should.be.eql([1, 2, 8, 3, 1, 16]);
        });
        it('should be lazy.', function () {
            const predicate = sinon.spy(function (x) {
                return x > 2;
            });
            let enumerable = Enumerable.from(ARRAY_OF_INTEGERS).where(predicate);
            predicate.should.not.be.called();
            let result = enumerable.toArray();
            predicate.should.be.called();
        });
    });
});