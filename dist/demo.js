'use strict';

var _linq = require('./linq6');

console.log('-- Select & Where --');
var arr = [1, 3, 5, 6, 10, 35, 9, 8];
var map = new Map([[1, 'One'], [3, 'Three'], [5, 'Five'], [6, 'Six'], [10, 'Ten'], [35, 'Thirty Five'], [9, 'Nine'], [8, 'Eight']]);
var arrWithChildCollection = [{ Id: 1, children: [11, 12, 13, 14, 15] }, { Id: 2, children: [21, 22, 23, 24, 25] }, { Id: 3, children: [31, 32, 33, 34, 35] }];

var enumerable = _linq.Enumerable.from(arr).where(function (n) {
    return n >= 6;
}).select(function (n) {
    return n * 2;
});
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = enumerable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        console.log(item);
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

console.log('-- Aggregate --');
var sum = _linq.Enumerable.from(arr).aggregate(function (sum, item) {
    return sum + item;
}, 0, function (x) {
    return x * 2;
});
console.log('Sum ' + sum);

var reverseSentence = _linq.Enumerable.from('My Name Is Subhajit Das').aggregate(function (sentence, item) {
    return item + sentence;
}, '', function (sentence) {
    return sentence.toUpperCase();
});
console.log('Reverse ' + reverseSentence);

console.log('-- All --');
var isAll = _linq.Enumerable.from(arr).all(function (x) {
    return x < 20;
});
console.log(isAll);

console.log('-- Any --');
var isAny = _linq.Enumerable.from(arr).any(function (x) {
    return x > 20;
});
console.log(isAny);

console.log('-- Concat --');
console.log(_linq.Enumerable.from(arr).concat([23, 24, 25]).toArray());

console.log('-- Contains --');
console.log(_linq.Enumerable.from(arr).contains(3));
console.log(_linq.Enumerable.from(arrWithChildCollection).contains(3, function (source, target) {
    return source.Id === target;
}));

console.log('-- Count --');
var numberOfElements = _linq.Enumerable.from(arr).count();
var numberOfElementsLessThanTen = _linq.Enumerable.from(arr).count(function (x) {
    return x < 10;
});
console.log('Total: ' + numberOfElements + ', Less Than 10: ' + numberOfElementsLessThanTen);

console.log('-- First --');
console.log(_linq.Enumerable.from(arr).first());
console.log(_linq.Enumerable.from(arr).first(function (x) {
    return x > 10;
}));
try {
    _linq.Enumerable.from([]).first();
} catch (err) {
    console.log(err);
}

try {
    _linq.Enumerable.from(arr).first(function (x) {
        return x > 100;
    });
} catch (err) {
    console.log(err);
}

console.log('-- FirstOrDefault --');
console.log(_linq.Enumerable.from(arr).firstOrDefault());
console.log(_linq.Enumerable.from(arr).firstOrDefault(function (x) {
    return x > 100;
}));

console.log('-- Single --');
console.log(_linq.Enumerable.from(arr).single(function (x) {
    return x === 10;
}));
try {
    _linq.Enumerable.from([]).single();
} catch (err) {
    console.log(err);
}
try {
    _linq.Enumerable.from(arr).single(function (x) {
        return x % 2 === 0;
    });
} catch (err) {
    console.log(err);
}
try {
    _linq.Enumerable.from(arr).single(function (x) {
        return x > 100;
    });
} catch (err) {
    console.log(err);
}

console.log('-- SelectMany --');
console.log(_linq.Enumerable.from(arrWithChildCollection).selectMany(function (x) {
    return x.children;
}).toArray());
try {
    _linq.Enumerable.from(arrWithChildCollection).selectMany(function (x) {
        return x.Id;
    }).toArray();
} catch (err) {
    console.log(err);
}

console.log('-- SingleOrDefault --');
console.log(_linq.Enumerable.from(arr).singleOrDefault(function (x) {
    return x === 10;
}));
console.log(_linq.Enumerable.from([]).singleOrDefault());
console.log(_linq.Enumerable.from(arr).singleOrDefault(function (x) {
    return x > 100;
}));
try {
    _linq.Enumerable.from(arr).single(function (x) {
        return x % 2 === 0;
    });
} catch (err) {
    console.log(err);
}

console.log('-- Skip --');
var skippedEnumerable = _linq.Enumerable.from(arr).skip(3);
var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
    for (var _iterator2 = skippedEnumerable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _item = _step2.value;

        console.log(_item);
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

console.log('-- SkipWhile --');
var skippedWhileEnumerable = _linq.Enumerable.from(arr).skipWhile(function (x) {
    return x < 10;
});
var _iteratorNormalCompletion3 = true;
var _didIteratorError3 = false;
var _iteratorError3 = undefined;

try {
    for (var _iterator3 = skippedWhileEnumerable[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _item2 = _step3.value;

        console.log(_item2);
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

console.log('-- Take --');
var takeEnumerable = _linq.Enumerable.from(arr).take(3);
var _iteratorNormalCompletion4 = true;
var _didIteratorError4 = false;
var _iteratorError4 = undefined;

try {
    for (var _iterator4 = takeEnumerable[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _item3 = _step4.value;

        console.log(_item3);
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

console.log('-- TakeWhile --');
var takeWhileEnumerable = _linq.Enumerable.from(arr).takeWhile(function (x) {
    return x != 10;
});
var _iteratorNormalCompletion5 = true;
var _didIteratorError5 = false;
var _iteratorError5 = undefined;

try {
    for (var _iterator5 = takeWhileEnumerable[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _item4 = _step5.value;

        console.log(_item4);
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
//# sourceMappingURL=demo.js.map