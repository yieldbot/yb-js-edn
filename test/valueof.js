"use strict";

var edn = require('../edn');

exports.parse = {
  "nil": function (test) {
    test.strictEqual(null, edn.valueOf(edn.parse('nil')));
    test.done();
  },

  "booleans": function (test) {
    test.strictEqual(true, edn.valueOf(edn.parse('true')));
    test.strictEqual(false, edn.valueOf(edn.parse('false')));
    test.done();
  },

  "strings": function (test) {
    test.strictEqual(
      "double quotes",
      edn.valueOf(edn.parse('"double quotes"'))
    );
    test.done();
  },

  "characters": function (test) {
    test.strictEqual("c", edn.valueOf(edn.parse('\\c')));
    test.done();
  },

  "symbols": function (test) {
    test.strictEqual("foo", edn.valueOf(edn.parse('foo')));
    test.done();
  },

  "keywords": function (test) {
    test.strictEqual("foo", edn.valueOf(edn.parse(':foo')));
    test.done();
  },

  "integers": function (test) {
    test.strictEqual(42, edn.valueOf(edn.parse('42')));
    test.done();
  },

  "floating point numbers": function (test) {
    test.strictEqual(3.14, edn.valueOf(edn.parse('3.14')));
    test.done();
  },

  "lists": function (test) {
    test.deepEqual(
      ['a', 'b', 42],
      edn.valueOf(edn.parse('(a b 42)'))
    );
    test.deepEqual(
      [edn.Symbol('a'), edn.Symbol('b'), 42],
      edn.valueOf(edn.parse('(a b 42)'), false)
    );
    test.done();
  },

  "vectors": function (test) {
    test.deepEqual(
      ['a', 'b', 42],
      edn.valueOf(edn.parse('[a b 42]'))
    );
    test.deepEqual(
      [edn.Symbol('a'), edn.Symbol('b'), 42],
      edn.valueOf(edn.parse('[a b 42]'), false)
    );
    test.done();
  },

  "maps": function (test) {
    test.deepEqual(
      {},
      edn.valueOf(edn.parse('{}'))
    );
    test.deepEqual(
      {foo: 1, bar: 2},
      edn.valueOf(edn.parse('{:foo 1, :bar 2}'))
    );
    test.deepEqual(
      {foo: 1, bar: 2},
      edn.valueOf(edn.parse('{"foo" 1, "bar" 2}'))
    );
    test.deepEqual(
      {1: 2, 3: 4},
      edn.valueOf(edn.parse('{1 2, 3 4}'))
    );
    test.deepEqual(
      {foo: 'bar'},
      edn.valueOf(edn.parse('{:foo :bar}'))
    );
    test.deepEqual(
      {foo: edn.keyword('bar')},
      edn.valueOf(edn.parse('{:foo :bar}'), false)
    );

    var arrayMap = new edn.Map();
    arrayMap.set([1, 2, 3], 4);
    test.strictEqual(arrayMap, edn.valueOf(arrayMap));

    test.done();
  },

  "sets": function (test) {
    test.deepEqual(
      [1, 2, 3],
      edn.valueOf(edn.parse('#{1 2 3}'))
    );
    test.deepEqual(
      ['a', 'b', 'c'],
      edn.valueOf(edn.parse('#{\\a \\b \\c}'))
    );
    test.done();
  },

  "unknown": function (test) {
    test.deepEqual(
      {first: "Fred", last: "Mertz"},
      edn.valueOf(edn.parse('#myapp/Person {:first "Fred", :last "Mertz"}'))
    );

    test.done();
  },
};
