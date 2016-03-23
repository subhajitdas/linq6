'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @typedef {function} predicate
 * @param {*} item Indivisual item in the sequence.
 * @returns {boolean} If the item satisfies the filter criteria.
 */

/**
 * @typedef {function} selector
 * @param {*} item Indivisual item in the sequence.
 * @returns {*} The transformed item.
 */

/**
 * @typedef {function} aggregator
 * @param {*} aggregate The aggregated value.
 * @param {*} item Indivisual item in the sequence.
 * @returns {*} The aggregated value.
 */

/**
 * A default projection function.
 * @param {*} item The item that will be projected back.
 * @returns {*} The supplied value itself as is.
 */
const SELF_SELECTOR = x => x;
const ALWAYS_TRUE_PREDICATE = () => true;

/**
 * Represents a iterable itself. Provides a set of methods for querying collections.
 */
class Enumerable {
    /**
     * Creates a new enumerable.
     */
    constructor(iterable) {
        if (isIterable(iterable)) {
            this.iterable = iterable;
        } else {
            throw new TypeError('Must be iterable.');
        }
    }

    /**
     * Applies an aggregate function over a sequence. 
     * @param {aggregator} aggregateFn An aggregate function that will be invoked for each element.
     * @param {*} [seed=First element in the sequence] The specified seed value is used as the initial aggregate value.
     * @param {selector} [resultSelector=SELF_SELECTOR] The specified result selector is used to project the aggregated value.
     * @returns {*} The aggregated value.
     */
    aggregate(aggregateFn, seed) {
        let resultSelector = arguments.length <= 2 || arguments[2] === undefined ? SELF_SELECTOR : arguments[2];

        let iterator = this[Symbol.iterator]();
        if (seed === undefined) {
            let firstItem = iterator.next();
            if (firstItem.done) {
                return resultSelector();
            } else {
                seed = firstItem.value;
            }
        }

        for (let item = iterator.next(); !item.done; item = iterator.next()) {
            seed = aggregateFn(seed, item.value);
        }

        return resultSelector(seed);
    }

    /**
     * Projects each element of a sequence into a new form.
     * @param {selector} selector A transform function to apply to each element.
     * @returns {Enumerable}
     */
    select() {
        let selector = arguments.length <= 0 || arguments[0] === undefined ? SELF_SELECTOR : arguments[0];

        let iterator = this.iterable[Symbol.iterator]();
        return new Enumerable({
            [Symbol.iterator]() {
                return {
                    next() {
                        let nextItem = iterator.next();
                        if (nextItem.done) {
                            return {
                                done: true
                            };
                        } else {
                            return {
                                value: selector(nextItem.value),
                                done: false
                            };
                        }
                    }
                };
            }
        });
    }

    /**
     * Filters a collection of values based on a predicate.
     * @param {predicate} predicate A function to test each source element for a condition.
     * @returns {Enumerable}
     */
    where() {
        let predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];

        let iterator = this.iterable[Symbol.iterator](),
            next = function () {
            let nextItem = iterator.next();
            if (nextItem.done) {
                return {
                    done: true
                };
            } else {
                if (predicate(nextItem.value)) {
                    return {
                        value: nextItem.value,
                        done: false
                    };
                } else {
                    return next();
                }
            }
        };
        return new Enumerable({
            [Symbol.iterator]() {
                return {
                    next: next
                };
            }
        });
    }

    /**
     * Iterator
     */
    [Symbol.iterator]() {
        let iterator = this.iterable[Symbol.iterator]();
        return {
            next() {
                let nextItem = iterator.next();
                if (nextItem.done) {
                    return {
                        done: true
                    };
                } else {
                    return {
                        value: nextItem.value,
                        done: false
                    };
                }
            }
        };
    }

    /**
     * Creates an Enumerable from iterable collections.
     * @param {iterable} source A iterable source.
     * @returns {Enumerable}
     */
    static from(source) {
        return new Enumerable(source);
    }
}

function isIterable(obj) {
    return obj[Symbol.iterator] && typeof obj[Symbol.iterator] === 'function';
}

exports.Enumerable = Enumerable;
//# sourceMappingURL=enumerable.js.map