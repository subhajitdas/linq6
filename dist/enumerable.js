'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var SELF_SELECTOR = function SELF_SELECTOR(x) {
    return x;
};

/**
 * A default [predicate]{@link predicate} function that always returns true.
 * @alias ALWAYS TRUE
 * @returns {Boolean} Always returns true.
 */
var ALWAYS_TRUE_PREDICATE = function ALWAYS_TRUE_PREDICATE() {
    return true;
};

/**
 * A default [predicate]{@link predicate} function that always returns false.
 * @alias ALWAYS FALSE
 * @returns {Boolean} Always returns false.
 */
var ALWAYS_FALSE_PREDICATE = function ALWAYS_FALSE_PREDICATE() {
    return false;
};

/**
 * A default [equalityComparer]{@link equalityComparer} function that uses default comparison.
 * @alias DEFAULT COMPARER
 * @returns {boolean} If the source and target are equal (is in == operator).
 */
var DEFAULT_EQUALITY_COMPARER = function DEFAULT_EQUALITY_COMPARER(source, target) {
    return source == target;
};

/**
 * Represents a iterable itself. Provides a set of methods for querying collections.
 */

var Enumerable = function () {
    /**
     * Creates a new enumerable.
     */

    function Enumerable(iterable) {
        _classCallCheck(this, Enumerable);

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


    _createClass(Enumerable, [{
        key: 'aggregate',
        value: function aggregate(aggregateFn, seed) {
            var resultSelector = arguments.length <= 2 || arguments[2] === undefined ? SELF_SELECTOR : arguments[2];

            var iterator = this[Symbol.iterator]();
            if (seed === undefined) {
                var firstItem = iterator.next();
                if (firstItem.done) {
                    return resultSelector();
                } else {
                    seed = firstItem.value;
                }
            }

            for (var item = iterator.next(); !item.done; item = iterator.next()) {
                seed = aggregateFn(seed, item.value);
            }

            return resultSelector(seed);
        }

        /**
         * Determines whether all elements of a sequence satisfy a condition.
         * @param {predicate} [predicate=ALWAYS TRUE] A function to test each source element for a condition.
         * @returns {boolean}
         */

    }, {
        key: 'all',
        value: function all() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    if (!predicate(item)) {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return true;
        }

        /**
         * Determines whether any element of a sequence exists or satisfies a condition.
         * @param {predicate} predicate A function to test each source element for a condition.
         * @returns {boolean}
         */

    }, {
        key: 'any',
        value: function any() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var item = _step2.value;

                    if (predicate(item)) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return false;
        }

        /**
         * Concatenates with another sequence.
         * @param {iterable} iterable The sequence to concatenate to the current sequence.
         * @returns {Enumerable}
         */

    }, {
        key: 'concat',
        value: function concat(iterable) {
            if (!isIterable(iterable)) {
                throw new TypeError('Sequence to concat must be iterable.');
            }
            var currentIterable = this[Symbol.iterator](),
                iterableToConcat = iterable[Symbol.iterator](),
                isFirstIterableDone = false;

            var next = function next() {
                var nextItem = currentIterable.next();
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
            };
            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: next
                };
            }));
        }

        /**
         * Determines if the sequence contains a specified element by using the equality comparer.
         * @param {*} element The element to compare with.
         * @param {equalityComparer} [equalityComparer] A function to determine equality of each element with specified element.
         */

    }, {
        key: 'contains',
        value: function contains(element) {
            var equalityComparer = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_EQUALITY_COMPARER : arguments[1];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var item = _step3.value;

                    if (equalityComparer(item, element)) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
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

    }, {
        key: 'count',
        value: function count() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];

            var count = 0;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var item = _step4.value;

                    if (predicate(item)) {
                        count++;
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return count;
        }

        /**
         * Returns distinct elements from the sequence.
         * @params {equalityComparer} [equalityComparer=DEFAULT_EQUALITY_COMPARER] A function to test if two elements in the sequence are equal.
         * @returns {Enumerable}
         */

    }, {
        key: 'distinct',
        value: function distinct() {
            var equalityComparer = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_EQUALITY_COMPARER : arguments[0];

            var currentIterable = this[Symbol.iterator]();
            var distinctItems = [];
            var next = function next() {
                var nextItem = currentIterable.next();
                if (nextItem.done) {
                    return {
                        done: true
                    };
                } else {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = distinctItems[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var distinctItem = _step5.value;

                            if (equalityComparer(nextItem.value, distinctItem)) {
                                return next();
                            }
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    distinctItems.push(nextItem.value);
                    return {
                        done: false,
                        value: nextItem.value
                    };
                }
            };
            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: next
                };
            }));
        }

        /**
         * Returns the first element in a sequence that satisfies a specified condition.
         * @param {predicate} [predicate] A function to test each source element for a condition.
         * @returns {*}
         * @throws {Error} If the sequence is empty.
         * @throws {Error} If the sequence contains no matching element.
         */

    }, {
        key: 'first',
        value: function first() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var item = _step6.value;

                    if (predicate(item)) {
                        return item;
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            throw new Error('Sequence contains no matching element.');
        }

        /**
         * Returns the first element of the sequence that satisfies a condition or null if no such element is found.
         * @param {predicate} [predicate] A function to test each source element for a condition.
         * @returns {*}
         */

    }, {
        key: 'firstOrDefault',
        value: function firstOrDefault() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var item = _step7.value;

                    if (predicate(item)) {
                        return item;
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
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

    }, {
        key: 'join',
        value: function join(innerIterable, outerKeySelector, innerKeySelector, resultSelector) {
            var keyComparer = arguments.length <= 4 || arguments[4] === undefined ? DEFAULT_EQUALITY_COMPARER : arguments[4];

            if (!isIterable(innerIterable)) {
                throw new TypeError('Sequence to join must be iterable.');
            }
            var iterator = this[Symbol.iterator]();
            var next = function next() {
                var nextOuterItem = iterator.next();
                if (nextOuterItem.done) {
                    return {
                        done: true
                    };
                } else {
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = innerIterable[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var nextInnerItem = _step8.value;

                            if (keyComparer(outerKeySelector(nextOuterItem.value), innerKeySelector(nextInnerItem))) {
                                return {
                                    value: resultSelector(nextOuterItem.value, nextInnerItem),
                                    done: false
                                };
                            }
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }

                    return next();
                }
            };
            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: next
                };
            }));
        }

        /**
         * Projects each element of a sequence into a new form.
         * @param {selector} selector A transform function to apply to each element.
         * @returns {Enumerable}
         */

    }, {
        key: 'select',
        value: function select() {
            var selector = arguments.length <= 0 || arguments[0] === undefined ? SELF_SELECTOR : arguments[0];

            var iterator = this[Symbol.iterator]();
            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: function next() {
                        var nextItem = iterator.next();
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
            }));
        }

        /**
         * Projects a collection in each element of a sequence, flattens it,
         * and invokes a result selector function to project the resulting sequence.
         * @param {selector} collectionSelector A function to apply to each element to get the intermediate collection.
         * @param {selector} [resultSelector] A transform function to apply to each element of final flattened sequence.
         * @returns {Enumerable}
         * @throws {TypeError} If the collection is not iterable.
        */

    }, {
        key: 'selectMany',
        value: function selectMany() {
            var collectionSelector = arguments.length <= 0 || arguments[0] === undefined ? SELF_SELECTOR : arguments[0];
            var resultSelector = arguments.length <= 1 || arguments[1] === undefined ? SELF_SELECTOR : arguments[1];

            var parentCollectionIterator = this.select(collectionSelector)[Symbol.iterator](),
                childCollectionIterator = Enumerable.empty()[Symbol.iterator](),
                next = function next() {
                var nextChildItem = childCollectionIterator.next();
                if (nextChildItem.done) {
                    var nextParentCollection = parentCollectionIterator.next();
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
            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: next
                };
            }));
        }

        /**
         * Returns the only element of a sequence that satisfies the specified condition.
         * @param {predicate} [predicate] A function to test each source element for a condition.
         * @returns {*}
         * @throws {Error} If the sequence is empty.
         * @throws {Error} If the sequence contains no matching element.
         * @throws {Error} If the sequence contains more than one matching element.
         */

    }, {
        key: 'single',
        value: function single() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];

            var matched = null;
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = this[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var item = _step9.value;

                    if (predicate(item)) {
                        if (matched) {
                            throw new Error('Sequence contains more than one matching element');
                        } else {
                            matched = item;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
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

    }, {
        key: 'singleOrDefault',
        value: function singleOrDefault() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];

            var matched = null;
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = this[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var item = _step10.value;

                    if (predicate(item)) {
                        if (matched) {
                            throw new Error('Sequence contains more than one matching element');
                        } else {
                            matched = item;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
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

    }, {
        key: 'skip',
        value: function skip() {
            var count = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            var iterator = this[Symbol.iterator](),
                index = 0,
                next = function next() {
                var nextItem = iterator.next();
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
            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: next
                };
            }));
        }

        /**
         * Skips elements in a sequence as long as a specified condition is true and then returns the remaining elements.
         * @param {predicate} predicate A function to test each source element for a condition.
         * @returns {Enumerable}
         */

    }, {
        key: 'skipWhile',
        value: function skipWhile() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_FALSE_PREDICATE : arguments[0];

            var iterator = this[Symbol.iterator](),
                continueSkip = true,
                next = function next() {
                var nextItem = iterator.next();
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

            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: next
                };
            }));
        }

        /**
         * Returns a specified number of elements from the begining of a sequence.
         * @param {Number} [count=0] The number of elements to return.
         * @returns {Enumerable}
         */

    }, {
        key: 'take',
        value: function take() {
            var count = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            var iterator = this[Symbol.iterator](),
                index = 0,
                next = function next() {
                var nextItem = iterator.next();
                index++;
                if (nextItem.done || index > count) {
                    return { done: true };
                } else {
                    return {
                        value: nextItem.value,
                        done: false
                    };
                }
            };
            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: next
                };
            }));
        }

        /**
         * Returns elements in a sequence as long as a specified condition is true.
         * @param {predicate} predicate A function to test each source element for a condition.
         * @returns {Enumerable}
         */

    }, {
        key: 'takeWhile',
        value: function takeWhile() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];

            var iterator = this[Symbol.iterator](),
                continueTake = true,
                next = function next() {
                var nextItem = iterator.next();
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

            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: next
                };
            }));
        }

        /**
         * Returns an array. This method forces immediate evaluation and returns an array that contains the results. 
         * @returns {Array}
         */

    }, {
        key: 'toArray',
        value: function toArray() {
            return Array.from(this);
        }

        /**
         * Filters a collection of values based on a predicate.
         * @param {predicate} predicate A function to test each source element for a condition.
         * @returns {Enumerable}
         */

    }, {
        key: 'where',
        value: function where() {
            var predicate = arguments.length <= 0 || arguments[0] === undefined ? ALWAYS_TRUE_PREDICATE : arguments[0];

            var iterator = this[Symbol.iterator](),
                next = function next() {
                var nextItem = iterator.next();
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
            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: next
                };
            }));
        }

        /**
         * Creates an Enumerable from iterable collections.
         * @param {iterable} source A iterable source.
         * @returns {Enumerable}
         */

    }, {
        key: Symbol.iterator,


        /**
         * Iterator
         */
        value: function value() {
            var iterator = this.iterable[Symbol.iterator]();
            return {
                next: function next() {
                    var nextItem = iterator.next();
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
    }], [{
        key: 'from',
        value: function from(source) {
            return new Enumerable(source);
        }

        /**
         * Returns an empty Enumerable.
         * @returns {Enumerable}
         */

    }, {
        key: 'empty',
        value: function empty() {
            return new Enumerable(_defineProperty({}, Symbol.iterator, function () {
                return {
                    next: function next() {
                        return {
                            done: true
                        };
                    }
                };
            }));
        }
    }]);

    return Enumerable;
}();

function isIterable(obj) {
    return obj[Symbol.iterator] && typeof obj[Symbol.iterator] === 'function';
}

exports.Enumerable = Enumerable;
//# sourceMappingURL=enumerable.js.map