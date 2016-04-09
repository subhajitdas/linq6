# linq6
> A javascript LINQ API built using es6 features with deferred execution support.

[![Build Status](https://travis-ci.org/subhajitdas/linq6.svg?branch=master)](https://travis-ci.org/subhajitdas/linq6)

## Why?
Language-Integrated Query (LINQ) provides powerful capabilities to query and manipulate any iterable data. Its easy, fast, fluent and supports lazy execution. Using this deferred execution capabilities linq6 could easily manilulate large collections.

## How?
This library uses es6 features, specially [iterator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols). It provides a fluent interface so that methods could be easily chained to create a process pipeline.

## Example
``` javascript
let result = Enumerable.from([1, 3, 4, 6, 8, 10])
    .where(x => x > 1)
    .skip(1)
    .select(x => x * 2)
    .toArray();    
    
```
## API
The library provides below methods to operate on a collection.
* [aggregate](http://subhajitdas.github.io/linq6/Enumerable.html#aggregate__anchor)
* [all](http://subhajitdas.github.io/linq6/Enumerable.html#all__anchor)
* [any](http://subhajitdas.github.io/linq6/Enumerable.html#any__anchor)
* [contains](http://subhajitdas.github.io/linq6/Enumerable.html#contains__anchor)
* [count](http://subhajitdas.github.io/linq6/Enumerable.html#count__anchor)
* [first](http://subhajitdas.github.io/linq6/Enumerable.html#first__anchor)
* [firstOrDefault](http://subhajitdas.github.io/linq6/Enumerable.html#firstOrDefault__anchor)
* [select](http://subhajitdas.github.io/linq6/Enumerable.html#select__anchor)
* [selectMany](http://subhajitdas.github.io/linq6/Enumerable.html#__anchor)
* [single](http://subhajitdas.github.io/linq6/Enumerable.html#single__anchor)
* [singleOrDefault](http://subhajitdas.github.io/linq6/Enumerable.html#singleOrDefault__anchor)
* [skip](http://subhajitdas.github.io/linq6/Enumerable.html#skip__anchor)
* [skipWhile](http://subhajitdas.github.io/linq6/Enumerable.html#skipWhile__anchor)
* [take](http://subhajitdas.github.io/linq6/Enumerable.html#take__anchor)
* [takeWhile](http://subhajitdas.github.io/linq6/Enumerable.html#takeWhile__anchor)
* [toArray](http://subhajitdas.github.io/linq6/Enumerable.html#toArray__anchor)
* [where](http://subhajitdas.github.io/linq6/Enumerable.html#where__anchor)

## Documentation
For complete documentation please visit [http://subhajitdas.github.io/linq6](http://subhajitdas.github.io/linq6/).

## Requirements
linq6 extensively uses es6 features. The distribution file is produced after limited transformation ([modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/), [parameter defaults](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/default_parameters) and [spread](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator)) using bable. This library is tested to work with nodejs 5.0.0 or higher.

 