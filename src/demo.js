import {Enumerable} from './linq6';

console.log('-- Select & Where --');
let arr = [1, 3, 5, 6, 10, 35, 9, 8];
let enumerable = Enumerable.from(arr).where(n => n >= 6).select(n => n * 2);
for (let item of enumerable) {
    console.log(item);
}

console.log('-- Aggregate --');
let sum = Enumerable.from(arr).aggregate((sum, item) => sum + item, 0, (x) => x * 2);
console.log(`Sum ${sum}`);

let reverseSentence = Enumerable.from('My Name Is Subhajit Das')
    .aggregate((sentence, item) => item + sentence, '', (sentence) => sentence.toUpperCase());
console.log(`Reverse ${reverseSentence}`);

console.log('-- All --');
let isAll = Enumerable.from(arr).all(x => x < 20);
console.log(isAll);

console.log('-- Any --');
let isAny = Enumerable.from(arr).any(x => x > 20);
console.log(isAny);

console.log('-- Skip --');
let skippedEnumerable = Enumerable.from(arr).skip(3);
for (let item of skippedEnumerable) {
    console.log(item);
}

console.log('-- SkipWhile --');
let skippedWhileEnumerable = Enumerable.from(arr).skipWhile(x => x < 10);
for (let item of skippedWhileEnumerable) {
    console.log(item);
}
