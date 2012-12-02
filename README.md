# js-edn

JavaScript [edn](https://github.com/edn-format/edn) (extensible data notation) serializer.

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

`edn.parse` parses a String into primitive, tagged and wrapped objects. The returned value should contain all the original type information, so passing it into the stringify function, should yield an equivalent result.

``` javascript
edn.parse('["foo", :bar, 123]')
// => edn.vector([
/       'foo',
//      edn.keyword('bar'),
//      123
//    ])
```

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



## See Also

* [edn-format/edn](https://github.com/edn-format/edn)
* [Clojure Reader](http://clojure.org/reader)
* [relevance/edn-ruby](https://github.com/relevance/edn-ruby)
* [shaunxcode/jsedn](https://github.com/shaunxcode/jsedn)
