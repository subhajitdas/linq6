'use strict';

var _linq = require('./linq6');

let arr = [1, 3, 5, 6, 8, 10, 35];
let enumerable = _linq.Enumerable.from(arr).where(n => n >= 6).select(n => n * 2);
for (let item of enumerable) {
    console.log(item);
}

let sum = _linq.Enumerable.from(arr).aggregate((sum, item) => sum + item, 0, x => x * 2);
console.log(`Sum ${ sum }`);

let reverseSentence = _linq.Enumerable.from('My Name Is Subhajit Das').aggregate((sentence, item) => item + sentence, '', sentence => sentence.toUpperCase());
console.log(`Reverse ${ reverseSentence }`);

let isAll = _linq.Enumerable.from(arr).all(x => x < 20);
console.log(isAll);
//# sourceMappingURL=demo.js.map