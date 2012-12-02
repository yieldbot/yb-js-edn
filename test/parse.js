"use strict";

var edn = require('../edn');

exports.parse = {
  "nil": function (test) {
    test.equal(null, edn.parse('nil'));
    test.done();
  },

  "booleans": function (test) {
    test.equal(true, edn.parse('true'));
    test.equal(false, edn.parse('false'));
    test.done();
  },

  "strings": function (test) {
    test.equal("double quotes", edn.parse('"double quotes"'));
    test.throws(function () { edn.parse('"missing quote'); });
    test.done();
  },

  "characters": function (test) {
    var c;

    c = edn.character("c");
    test.equal(c, edn.parse('\\c'));

    c = edn.character("\n");
    test.equal(c, edn.parse('\\newline'));

    c = edn.character("\r");
    test.equal(c, edn.parse('\\return'));

    c = edn.character(" ");
    test.equal(c, edn.parse('\\space'));

    c = edn.character("\t");
    test.equal(c, edn.parse('\\tab'));

    test.throws(function () { edn.parse('\\abc'); });

    test.done();
  },

  "symbols": function (test) {
    test.equal(edn.Symbol('foo'), edn.parse('foo'));
    test.equal(edn.symbol('my-namespace/foo'), edn.parse('my-namespace/foo'));
    test.done();
  },

  "keywords": function (test) {
    var k;

    k = edn.keyword("fred");
    test.equal(k, edn.parse(':fred'));

    k = edn.keyword("my/fred");
    test.equal(k, edn.parse(':my/fred'));

    test.done();
  },

  "integers": function (test) {
    test.equal(0, edn.parse('0'));
    test.equal(9, edn.parse('9'));
    test.equal(42, edn.parse('42'));
    test.equal(-1, edn.parse('-1'));
    test.done();
  },

  "floating point numbers": function (test) {
    test.equal(3.14, edn.parse('3.14'));
    test.equal(9.0, edn.parse('9.0'));
    test.done();
  },

  "lists": function (test) {
    var l;

    l = edn.list([edn.symbol('a'), edn.symbol('b'), edn.integer(42)]);
    test.deepEqual(l, edn.parse('(a b 42)'));

    test.throws(function () { edn.parse('(missing paren'); });

    test.done();
  },

  "vectors": function (test) {
    var v;

    v = edn.vector([edn.symbol('a'), edn.symbol('b'), edn.integer(42)]);
    test.deepEqual(v, edn.parse('[a b 42]'));

    test.throws(function () { edn.parse('[missing bracket'); });

    test.done();
  },

  "maps": function (test) {
    var m;

    m = edn.map([
      edn.keyword('a'), edn.integer(1),
      "foo", edn.keyword('bar'),
      edn.vector([edn.integer(1), edn.integer(2), edn.integer(3)]),
      edn.symbol('four')
    ]);
    test.deepEqual(m, edn.parse('{:a 1, "foo" :bar, [1 2 3] four}'));

    test.throws(function () { edn.parse('{missing brace'); });

    test.done();
  },

  "sets": function (test) {
    var s;

    s = edn.set([
      edn.symbol('a'),
      edn.symbol('b'),
      edn.vector([1, 2, 3]),
    ]);
    test.deepEqual(s, edn.parse('#{a b [1 2 3]}'));

    test.throws(function () { edn.parse('#{missing brace'); });

    test.done();
  },

  "generic tag": function (test) {
    var t;

    t = edn.generic('myapp/Person', edn.map([
      edn.keyword('first'), "Fred",
      edn.keyword('last'), "Mertz"
    ]));
    test.deepEqual(
      t,
      edn.parse('#myapp/Person {:first "Fred", :last "Mertz"}')
    );

    test.done();
  },

  "inst tag": function (test) {
    var t = new Date(Date.parse("1985-04-12T23:20:50.52Z"));
    test.deepEqual(t, edn.parse('#inst "1985-04-12T23:20:50.52Z"'));

    test.done();
  },

  "uuid tag": function (test) {
    var t;

    t = edn.uuid("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    test.deepEqual(
      t,
      edn.parse('#uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"')
    );

    test.done();
  },

  "person tag": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    function toPerson(attrs) {
      return new Person(
        attrs.get(edn.keyword('first')),
        attrs.get(edn.keyword('last'))
      );
    }

    var attrs = new edn.Map();
    attrs.set(edn.keyword('first'), "Fred");
    attrs.set(edn.keyword('last'), "Mertz");

    test.deepEqual(
      new Person("Fred", "Mertz"),
      edn.parse(
        '#myapp/Person {:first "Fred", :last "Mertz"}',
        { tags: { 'myapp/Person': toPerson } }
      )
    );

    test.done();
  },

  "discard": function (test) {
    var v;

    v = edn.vector([edn.symbol('a'), edn.symbol('b'), edn.integer(42)]);
    test.deepEqual(v, edn.parse('[a b #_foo 42]'));
    test.deepEqual(v, edn.parse('[a b #_ foo 42]'));
    test.deepEqual(v, edn.parse('[a b #_[1, 2, 3] 42]'));
    test.deepEqual(v, edn.parse('[a b #_ [1, 2, 3] 42]'));

    v = edn.vector([]);
    test.deepEqual(v, edn.parse('[#_foo]'));

    test.done();
  }
};
