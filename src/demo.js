import {Enumerable} from './linq6';
let arr = [1, 3, 5, 6, 8, 10, 35];
var enumerable = Enumerable.from(arr).where(n => n >= 6).select(n => n * 2);
for (let item of enumerable) {
    console.log(item);
}