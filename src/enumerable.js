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
 * @typedef {function} equalityComparer
 * @param {*} source Indivisual item in the sequence.
 * @param {*} target Target element to compare with.
 * @returns {boolean} If the source and target are equal.
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
 * A default [equalityComparer]{@link equalityComparer} function that uses default comparison.
 * @alias DEFAULT COMPARER
 * @returns {boolean} If the source and target are equal (is in == operator).
 */
const DEFAULT_EQUALITY_COMPARER = (source, target) => source == target;

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
     * Concatenates with another sequence.
     * @param {iterable} iterable The sequence to concatenate to the current sequence.
     * @returns {Enumerable}
     */
    concat(iterable) {
        if (!isIterable(iterable)) {
            throw new TypeError('Sequence to concat must be iterable.');
        }
        let currentIterable = this[Symbol.iterator](),
            iterableToConcat = iterable[Symbol.iterator](),
            isFirstIterableDone = false;

        const next = function () {
            let nextItem = currentIterable.next();
            if (nextItem.done && !isFirstIterableDone) {
                currentIterable = iterableToConcat;
                isFirstIterableDone = true;
                return next();
            } else if (nextItem.done && isFirstIterableDone) {
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
        return new Enumerable({
            [Symbol.iterator]() {
                return {
                    next: next
                };
            }
        });
    }

    /**
     * Determines if the sequence contains a specified element by using the equality comparer.
     * @param {*} element The element to compare with.
     * @param {equalityComparer} [equalityComparer] A function to determine equality of each element with specified element.
     */
    contains(element, equalityComparer = DEFAULT_EQUALITY_COMPARER) {
        for (let item of this) {
            if (equalityComparer(item, element)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the number of elements in a sequence.
     * If a condition is specified then returns a how many elements in the sequence satisfy it.
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
     * Returns distinct elements from the sequence.
     * @params {equalityComparer} [equalityComparer=DEFAULT_EQUALITY_COMPARER] A function to test if two elements in the sequence are equal.
     * @returns {Enumerable}
     */
    distinct(equalityComparer = DEFAULT_EQUALITY_COMPARER) {
        const currentIterable = this[Symbol.iterator]();
        const distinctItems = [];
        const next = function () {
            const nextItem = currentIterable.next();
            if (nextItem.done) {
                return {
                    done: true
                };
            } else {
                for (const distinctItem of distinctItems) {
                    if (equalityComparer(nextItem.value, distinctItem)) {
                        return next();
                    }
                }
                distinctItems.push(nextItem.value);
                return {
                    done: false,
                    value: nextItem.value
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
     * Correlates the elements current sequence with another sequences based on keys.
     * @param {iterable} innerIterable The sequence to join to current sequence.
     * @param {selector} outerKeySelector A function to extract key from current sequence.
     * @param {selector} innerKeySelector A function to extract key from the sequence to join.
     * @param {selector} resultSelector A function to generate result element from two matching element.
     * @param {equalityComparer} [keyComparer=DEFAULT_EQUALITY_COMPARER] A function to check equality of keys.
     */
    join(innerIterable, outerKeySelector, innerKeySelector, resultSelector, keyComparer = DEFAULT_EQUALITY_COMPARER) {
        if (!isIterable(innerIterable)) {
            throw new TypeError('Sequence to join must be iterable.');
        }
        const iterator = this[Symbol.iterator]();
        const next = function () {
            const nextOuterItem = iterator.next();
            if (nextOuterItem.done) {
                return {
                    done: true
                };
            } else {
                for (const nextInnerItem of innerIterable) {
                    if (keyComparer(
                        outerKeySelector(nextOuterItem.value),
                        innerKeySelector(nextInnerItem))) {
                        return {
                            value: resultSelector(nextOuterItem.value, nextInnerItem),
                            done: false
                        };
                    }
                }
                return next();
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
     * Projects each element of a sequence into a new form.
     * @param {selector} selector A transform function to apply to each element.
     * @returns {Enumerable}
     */
    select(selector = SELF_SELECTOR) {
        let iterator = this[Symbol.iterator]();
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
     * Projects a collection in each element of a sequence, flattens it,
     * and invokes a result selector function to project the resulting sequence.
     * @param {selector} collectionSelector A function to apply to each element to get the intermediate collection.
     * @param {selector} [resultSelector] A transform function to apply to each element of final flattened sequence.
     * @returns {Enumerable}
     * @throws {TypeError} If the collection is not iterable.
    */
    selectMany(collectionSelector = SELF_SELECTOR, resultSelector = SELF_SELECTOR) {
        let parentCollectionIterator = this.select(collectionSelector)[Symbol.iterator](),
            childCollectionIterator = Enumerable.empty()[Symbol.iterator](),
            next = function () {
                let nextChildItem = childCollectionIterator.next();
                if (nextChildItem.done) {
                    let nextParentCollection = parentCollectionIterator.next();
                    if (nextParentCollection.done) {
                        return {
                            done: true
                        };
                    } else {
                        if (!isIterable(nextParentCollection.value)) {
                            throw new TypeError('Collection must be iterable.');
                        }
                        childCollectionIterator = nextParentCollection.value[Symbol.iterator]();
                        return next();
                    }
                } else {
                    return {
                        value: resultSelector(nextChildItem.value),
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
        let iterator = this[Symbol.iterator](),
            index = 0,
            next = function () {
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
        let iterator = this[Symbol.iterator](),
            continueSkip = true,
            next = function () {
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
        let iterator = this[Symbol.iterator](),
            index = 0,
            next = function () {
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
        let iterator = this[Symbol.iterator](),
            continueTake = true,
            next = function () {
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
        let iterator = this[Symbol.iterator](),
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
     * Creates an Enumerable from iterable collections.
     * @param {iterable} source A iterable source.
     * @returns {Enumerable}
     */
    static from(source) {
        return new Enumerable(source);
    }

    /**
     * Returns an empty Enumerable.
     * @returns {Enumerable}
     */
    static empty() {
        return new Enumerable({
            [Symbol.iterator]() {
                return {
                    next() {
                        return {
                            done: true
                        };
                    }
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
}

function isIterable(obj) {
    return obj[Symbol.iterator] && (typeof obj[Symbol.iterator] === 'function');
}

export {Enumerable};