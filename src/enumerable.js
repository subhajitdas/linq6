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
 * A default [selector]{@link selector} function that returns the element back.
 * @alias RETURN SELF
 * @param {*} item The item that will be projected back.
 * @returns {*} The supplied value itself as is.
 */
const SELF_SELECTOR = x => x;

/**
 * A default [predicate]{@link predicate} function that always returns true.
 * @alias ALWAYS TRUE
 * @returns {Boolean} Always returns true.
 */
const ALWAYS_TRUE_PREDICATE = () => true;

/**
 * A default [predicate]{@link predicate} function that always returns false.
 * @alias ALWAYS FALSE
 * @returns {Boolean} Always returns false.
 */
const ALWAYS_FALSE_PREDICATE = () => false;

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
    aggregate(aggregateFn, seed, resultSelector = SELF_SELECTOR) {
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
     * Determines whether all elements of a sequence satisfy a condition.
     * @param {predicate} [predicate=ALWAYS TRUE] A function to test each source element for a condition.
     * @returns {boolean}
     */
    all(predicate = ALWAYS_TRUE_PREDICATE) {
        for (let item of this) {
            if (!predicate(item)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Determines whether any element of a sequence exists or satisfies a condition.
     * @param {predicate} predicate A function to test each source element for a condition.
     * @returns {boolean}
     */
    any(predicate = ALWAYS_TRUE_PREDICATE) {
        for (let item of this) {
            if (predicate(item)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the number of elements in a sequence.
     * If a condition is specified then returns a how many elemensts in the sequence satisfy it.
     * @param {predicate} [predicate] A function to test each source element for a condition.
     * @returns {Number}
     */
    count(predicate = ALWAYS_TRUE_PREDICATE) {
        let count = 0;
        for (let item of this) {
            if (predicate(item)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Returns the first element in a sequence that satisfies a specified condition.
     * @param {predicate} [predicate] A function to test each source element for a condition.
     * @returns {*}
     * @throws {Error} If the sequence is empty.
     * @throws {Error} If the sequence contains no matching element.
     */
    first(predicate = ALWAYS_TRUE_PREDICATE) {
        for (let item of this) {
            if (predicate(item)) {
                return item;
            }
        }

        throw new Error('Sequence contains no matching element.');
    }

    /**
     * Returns the first element of the sequence that satisfies a condition or null if no such element is found.
     * @param {predicate} [predicate] A function to test each source element for a condition.
     * @returns {*}
     */
    firstOrDefault(predicate = ALWAYS_TRUE_PREDICATE) {
        for (let item of this) {
            if (predicate(item)) {
                return item;
            }
        }

        return null;
    }

    /**
     * Projects each element of a sequence into a new form.
     * @param {selector} selector A transform function to apply to each element.
     * @returns {Enumerable}
     */
    select(selector = SELF_SELECTOR) {
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
                }
            }
        });
    }

    /**
     * Returns the only element of a sequence that satisfies the specified condition.
     * @param {predicate} [predicate] A function to test each source element for a condition.
     * @returns {*}
     * @throws {Error} If the sequence is empty.
     * @throws {Error} If the sequence contains no matching element.
     * @throws {Error} If the sequence contains more than one matching element.
     */
    single(predicate = ALWAYS_TRUE_PREDICATE) {
        let matched = null;
        for (let item of this) {
            if (predicate(item)) {
                if (matched) {
                    throw new Error('Sequence contains more than one matching element');
                } else {
                    matched = item;
                }
            }
        }

        if (matched) {
            return matched;
        }

        throw new Error('Sequence contains no matching element.');
    }

    /**
     * Returns the only element of a sequence that satisfies a specified condition or null if no such element exists.
     * @param {predicate} [predicate] A function to test each source element for a condition.
     * @returns {*}
     * @throws {Error} If the sequence contains more than one matching element.
     */
    singleOrDefault(predicate = ALWAYS_TRUE_PREDICATE) {
        let matched = null;
        for (let item of this) {
            if (predicate(item)) {
                if (matched) {
                    throw new Error('Sequence contains more than one matching element');
                } else {
                    matched = item;
                }
            }
        }
        
        if (matched) {
            return matched;
        }
        
        return null;
    }

    /**
     * Skips the specified number of elements of a sequence.
     * @param {Number} [count=0] The number of elements to skip.
     * @returns {Enumerable}
     */
    skip(count = 0) {
        let iterator = this.iterable[Symbol.iterator](),
            index = 0,
            next = function() {
                let nextItem = iterator.next();
                if (nextItem.done) {
                    return { done: true };
                } else if (index++ < count) {
                    return next();
                } else {
                    return {
                        value: nextItem.value,
                        done: false
                    };
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
     * Skips elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param {predicate} predicate A function to test each source element for a condition.
     * @returns {Enumerable}
     */
    skipWhile(predicate = ALWAYS_FALSE_PREDICATE) {
        let iterator = this.iterable[Symbol.iterator](),
            continueSkip = true,
            next = function() {
                let nextItem = iterator.next();
                if (nextItem.done) {
                    return { done: true };
                } else if (continueSkip && predicate(nextItem.value)) {
                    return next();
                } else {
                    continueSkip = false;
                    return {
                        value: nextItem.value,
                        done: false
                    };
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
     * Returns a specified number of elements from the begining of a sequence.
     * @param {Number} [count=0] The number of elements to return.
     * @returns {Enumerable}
     */
    take(count = 0) {
        let iterator = this.iterable[Symbol.iterator](),
            index = 0,
            next = function() {
                let nextItem = iterator.next();
                index++;
                if (nextItem.done || (index > count)) {
                    return { done: true };
                } else {
                    return {
                        value: nextItem.value,
                        done: false
                    };
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
     * Returns elements in a sequence as long as a specified condition is true.
     * @param {predicate} predicate A function to test each source element for a condition.
     * @returns {Enumerable}
     */
    takeWhile(predicate = ALWAYS_TRUE_PREDICATE) {
        let iterator = this.iterable[Symbol.iterator](),
            continueTake = true,
            next = function() {
                let nextItem = iterator.next();
                if (nextItem.done) {
                    return { done: true };
                } else if (continueTake && predicate(nextItem.value)) {
                    return {
                        value: nextItem.value,
                        done: false
                    };
                } else {
                    continueTake = false;
                    return { done: true };
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
     * Returns an array. This method forces immediate evaluation and returns an array that contains the results. 
     * @returns {Array}
     */
    toArray() {
        return Array.from(this);
    }

    /**
     * Filters a collection of values based on a predicate.
     * @param {predicate} predicate A function to test each source element for a condition.
     * @returns {Enumerable}
     */
    where(predicate = ALWAYS_TRUE_PREDICATE) {
        let iterator = this.iterable[Symbol.iterator](),
            next = function() {
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
    return obj[Symbol.iterator] && (typeof obj[Symbol.iterator] === 'function');
}

export {Enumerable};