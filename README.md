# js-edn

JavaScript [edn](https://github.com/edn-format/edn) (extensible data notation) serializer.


## Features

* Parse and stringify functions are transitive
* edn equality
* Extensible type system
* Tagged element dispatch hooks
* Robust Jison grammar
* ES5 compatibility
* Backport Harmony style Maps and Sets

## Installation

Via npm.

```
npm install git://github.com/josh/js-edn.git
```

**NOTE** At the moment, this package is not officially published to npm. I don't have any long term plans of maintaining this package.

For use in a browser, you can just download the [edn.js](https://github.com/josh/js-edn/blob/master/edn.js) file. There aren't any external dependencies.

```
curl -O https://raw.github.com/josh/js-edn/master/edn.js
```

## Usage

### parse

`edn.parse(str)` parses a String into primitive, tagged and wrapped objects. The returned value should contain all the original type information, so passing it into the stringify function, should yield an equivalent result.

``` javascript
edn.parse('["foo" :bar 123]')
// => edn.vector([
//      'foo',
//      edn.keyword('bar'),
//      123
//    ])
```

### stringify

`edn.stringify(obj)` converts the object into an edn String.

``` javascript
edn.stringify(["foo", edn.keyword('bar'), 123])
// => '["foo" :bar 123]'
```

### isEqual

`edn.isEqual(a, b)` compares to objects using [edn semantics](https://github.com/edn-format/edn#equality). For the most part, two values will be equal if they serialize to the same edn string. With the expection of maps and sets which may serialize in a different order.

### types

| type             | edn                  | js                                     |
| ---------------- | -------------------- | ---------------------------------------|
| nil              | `nil`                | `null`                                 |
| booleans         | `true`               | `true`                                 |
| strings          | `"hello"`            | `"hello"`                              |
| characters       | `\c`                 | `edn.character('c')`                   |
| symbols          | `?c`                 | `edn.symbol('?c')`                     |
| keywords         | `:name`              | `edn.keyword('name')`                  |
| integers         | `42`                 | `42`                                   |
| floats           | `3.14`               | `edn.float(3.14)`                      |
| lists            | `(1 2 3)`            | `edn.list([1, 2, 3])`                  |
| vectors          | `[1 2 3]`            | `edn.vector([1, 2, 3])`                |
| maps             | `{:foo "bar"}`       | `edn.map([edn.keyword('foo'), "bar"])` |
| sets             | `#{1 2 3}`           | `edn.set([1, 2 ,3])`                   |
| tagged elements  | `#my/foo [3, 4]`     | `edn.unknown('my/foo', [3, 4])`        |


#### nil

`nil` and `null` are equivalents. `undefined` is converted to `null`.

#### booleans

`true` and `true` are equivalents, as well as `false` and `false`. The parser always yields `boolean` primitives.

#### strings

`"hello"` and `"hello"` are equivalents. The parser always yields `string` primitives.

#### characters

`\c` and `edn.character('c')` are equivalents. A character is an `object`, but calling `valueOf` or `toString` will cast it to a `string` primitive. Since there are a limited number of single characters, character objects are interned so two of the same are always reference `==` equal to each other.

#### symbols

`?c` and `edn.symbol('?c')` are equivalents. A symbol is an `object`, but calling `valueOf` or `toString` will cast it to a `string` primitive. Symbols are interned so they are reference `==` equal to each other.

#### keywords

`:foo` and `edn.keyword('foo')` are equivalents. A keyword is an `object`, but calling `valueOf` will cast it to a `string` primitive. Calling `toString` will return a formatted `string` with a leading `:`. Keywords are interned so they are reference `==` equal to each other.

#### integers

`42` and `42` are equivalents. Integer numbers are not tagged. The parser always yeilds `number` primitives.

#### floats

`3.14` and `edn.float(3.14)` are equivalents. Floats are tagged so `6` and `6.0` can be distinguish. A float is an `object`, but calling `valueOf` will cast it to a `number` primitive. Float objects are not intered so, two float objects are not strictly equal.

#### lists

`(1 2 3)` and `edn.list([1, 2, 3])` are equivalents. Lists are tagged Arrays so you can access them as you'd expect.

#### vectors

`[1 2 3]` and `edn.vector([1, 2, 3])` are equivalents. Vectors are tagged Arrays so you can access them as you'd expect.

#### maps

`{:foo "bar"}` and `edn.map([edn.keyword('foo'), "bar"])` are equivalents. The Map object is a backported version of the proposed Harmony Map. A native Map may be returned in the future.

#### sets

`#{1 2 3}` and `edn.set([1, 2, 3])` are equivalents. The Set object is a backported version of the proposed Harmony Set. A native Set may be returned in the future.


## Compatibility

Targets Node.js 0.8.x and up. As well as ES5 browsers.


## See Also

* [edn-format/edn](https://github.com/edn-format/edn)
* [Clojure Reader](http://clojure.org/reader)
* [relevance/edn-ruby](https://github.com/relevance/edn-ruby)
* [shaunxcode/jsedn](https://github.com/shaunxcode/jsedn)
