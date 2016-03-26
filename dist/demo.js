'use strict';

var _linq = require('./linq6');

console.log('-- Select & Where --');
let arr = [1, 3, 5, 6, 10, 35, 9, 8];
let map = new Map([[1, 'One'], [3, 'Three'], [5, 'Five'], [6, 'Six'], [10, 'Ten'], [35, 'Thirty Five'], [9, 'Nine'], [8, 'Eight']]);

let enumerable = _linq.Enumerable.from(arr).where(n => n >= 6).select(n => n * 2);
for (let item of enumerable) {
    console.log(item);
}

console.log('-- Aggregate --');
let sum = _linq.Enumerable.from(arr).aggregate((sum, item) => sum + item, 0, x => x * 2);
console.log(`Sum ${ sum }`);

let reverseSentence = _linq.Enumerable.from('My Name Is Subhajit Das').aggregate((sentence, item) => item + sentence, '', sentence => sentence.toUpperCase());
console.log(`Reverse ${ reverseSentence }`);

console.log('-- All --');
let isAll = _linq.Enumerable.from(arr).all(x => x < 20);
console.log(isAll);

console.log('-- Any --');
let isAny = _linq.Enumerable.from(arr).any(x => x > 20);
console.log(isAny);

console.log('-- Count --');
let numberOfElements = _linq.Enumerable.from(arr).count();
let numberOfElementsLessThanTen = _linq.Enumerable.from(arr).count(x => x < 10);
console.log(`Total: ${ numberOfElements }, Less Than 10: ${ numberOfElementsLessThanTen }`);

console.log('-- Skip --');
let skippedEnumerable = _linq.Enumerable.from(arr).skip(3);
for (let item of skippedEnumerable) {
    console.log(item);
}

console.log('-- SkipWhile --');
let skippedWhileEnumerable = _linq.Enumerable.from(arr).skipWhile(x => x < 10);
for (let item of skippedWhileEnumerable) {
    console.log(item);
}

console.log('-- Take --');
let takeEnumerable = _linq.Enumerable.from(arr).take(3);
for (let item of takeEnumerable) {
    console.log(item);
}

console.log('-- TakeWhile --');
let takeWhileEnumerable = _linq.Enumerable.from(arr).takeWhile(x => x != 10);
for (let item of takeWhileEnumerable) {
    console.log(item);
}
//# sourceMappingURL=demo.js.map