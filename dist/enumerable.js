'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Enumerable {
    constructor(iterable) {
        if (isIterable(iterable)) {
            this.iterable = iterable;
        } else {
            throw new TypeError('Must be iterable.');
        }
    }

    where(predicate) {
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

    select(selector) {
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

    static from(source) {
        return new Enumerable(source);
    }
}

function isIterable(obj) {
    return obj[Symbol.iterator] && typeof obj[Symbol.iterator] === 'function';
}

exports.Enumerable = Enumerable;
//# sourceMappingURL=enumerable.js.map