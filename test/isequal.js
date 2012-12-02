"use strict";

var edn = require('../edn');

exports.values = {
  "nil": function (test) {
    test.ok(edn.isEqual(undefined, undefined));
    test.ok(edn.isEqual(null, null));
    test.ok(edn.isEqual(undefined, null));
    test.ok(edn.isEqual(null, undefined));

    test.ok(!edn.isEqual(undefined, true));
    test.ok(!edn.isEqual(true, undefined));
    test.ok(!edn.isEqual(false, undefined));
    test.ok(!edn.isEqual(null, false));
    test.ok(!edn.isEqual(false, null));

    test.done();
  },

  "booleans": function (test) {
    test.ok(edn.isEqual(true, true));
    test.ok(edn.isEqual(true, Object(true)));
    test.ok(edn.isEqual(Object(true), Object(true)));
    test.ok(edn.isEqual(false, false));
    test.ok(edn.isEqual(false, Object(false)));
    test.ok(edn.isEqual(Object(false), Object(false)));

    test.ok(!edn.isEqual(false, true));
    test.ok(!edn.isEqual(true, false));
    test.ok(!edn.isEqual(false, undefined));
    test.ok(!edn.isEqual(null, false));
    test.ok(!edn.isEqual(Object(true), Object(false)));

    test.done();
  },

  "string": function (test) {
    test.ok(edn.isEqual("hello", "hello"));
    test.ok(edn.isEqual("hello", Object("hello")));
    test.ok(edn.isEqual(Object("hello"), Object("hello")));

    test.ok(!edn.isEqual("hello", "goodbye"));
    test.ok(!edn.isEqual("hello", Object("goodbye")));
    test.ok(!edn.isEqual(Object("goodbye"), "hello"));
    test.ok(!edn.isEqual("true", true));
    test.ok(!edn.isEqual("nil", null));
    test.ok(!edn.isEqual(Object("hello"), Object("goodbye")));

    test.done();
  },

  "characters": function (test) {
    test.ok(edn.isEqual(edn.character('c'), edn.character('c')));

    test.ok(!edn.isEqual(edn.character('a'), edn.character('b')));
    test.ok(!edn.isEqual(edn.character('a'), 'a'));
    test.ok(!edn.isEqual('b', edn.character('b')));
    test.ok(!edn.isEqual(Object('b'), edn.character('b')));
    test.ok(!edn.isEqual(edn.character('b'), Object('b')));

    test.done();
  },

  "symbols": function (test) {
    test.ok(edn.isEqual(edn.Symbol('foo'), edn.Symbol('foo')));

    test.ok(!edn.isEqual(edn.Symbol('foo'), edn.Symbol('bar')));
    test.ok(!edn.isEqual(edn.Symbol('bar'), edn.Symbol('foo')));
    test.ok(!edn.isEqual(edn.Symbol('foo'), 'foo'));
    test.ok(!edn.isEqual('foo', edn.Symbol('foo')));
    test.ok(!edn.isEqual(Object('foo'), edn.Symbol('foo')));
    test.ok(!edn.isEqual(edn.Symbol('foo'), Object('foo')));

    test.done();
  },

  "keywords": function (test) {
    test.ok(edn.isEqual(edn.Keyword('foo'), edn.Keyword('foo')));

    test.ok(!edn.isEqual(edn.Keyword('foo'), edn.Keyword('bar')));
    test.ok(!edn.isEqual(edn.Keyword('bar'), edn.Keyword('foo')));
    test.ok(!edn.isEqual(edn.Keyword('foo'), edn.Symbol('foo')));
    test.ok(!edn.isEqual(edn.Keyword('foo'), 'foo'));
    test.ok(!edn.isEqual('foo', edn.Keyword('foo')));
    test.ok(!edn.isEqual(Object('foo'), edn.Keyword('foo')));
    test.ok(!edn.isEqual(edn.Keyword('foo'), Object('foo')));

    test.done();
  },

  "integers": function (test) {
    test.ok(edn.isEqual(0, 0));
    test.ok(edn.isEqual(42, 42));
    test.ok(edn.isEqual(-1, -1));
    test.ok(edn.isEqual(42, Object(42)));
    test.ok(edn.isEqual(Object(42), Object(42)));

    test.ok(!edn.isEqual(1, 2));
    test.ok(!edn.isEqual(1, '1'));
    test.ok(!edn.isEqual(Object(1), Object(2)));
    test.ok(!edn.isEqual(Object(1), Object('1')));

    test.done();
  },

  "floating point numbers": function (test) {
    test.ok(edn.isEqual(3.14, 3.14));
    test.ok(edn.isEqual(3.14, Object(3.14)));
    test.ok(edn.isEqual(Object(3.14), Object(3.14)));

    test.ok(!edn.isEqual(3.14, 3.15));
    test.ok(!edn.isEqual(1.1, '1.1'));
    test.ok(!edn.isEqual(Object(3.14), Object(3.15)));
    test.ok(!edn.isEqual(Object(3.14), Object('3.14')));

    test.done();
  },

  "lists": function (test) {
    test.ok(edn.isEqual(
      edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
      edn.list([edn.symbol('a'), edn.symbol('b'), 42])
    ));

    test.ok(!edn.isEqual(
      edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
      edn.list([edn.symbol('a'), edn.symbol('b'), 42, 100])
    ));

    test.ok(!edn.isEqual(
      edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
      edn.list([42, edn.symbol('a'), edn.symbol('b')])
    ));

    test.ok(!edn.isEqual(
      edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
      edn.list([edn.keyword('a'), edn.symbol('b'), 42])
    ));

    test.done();
  },

  "vectors": function (test) {
    test.ok(edn.isEqual(
      edn.vector([edn.symbol('a'), edn.symbol('b'), 42]),
      edn.vector([edn.symbol('a'), edn.symbol('b'), 42])
    ));

    test.ok(!edn.isEqual(
      edn.vector([edn.symbol('a'), edn.symbol('b'), 42]),
      edn.vector([42, edn.symbol('a'), edn.symbol('b')])
    ));

    test.ok(!edn.isEqual(
      edn.vector([edn.symbol('a'), edn.symbol('b'), 42]),
      edn.vector([edn.symbol('a'), edn.symbol('b'), 42, 100])
    ));

    test.ok(!edn.isEqual(
      edn.vector([edn.symbol('a'), edn.symbol('b'), 42]),
      edn.vector([edn.keyword('a'), edn.symbol('b'), 42])
    ));

    test.ok(!edn.isEqual(
      edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
      edn.vector([edn.symbol('a'), edn.symbol('b'), 42])
    ));

    test.done();
  },

  "maps": function (test) {
    test.ok(edn.isEqual(
      edn.map([
        edn.keyword('a'), 1,
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four')
      ]),
      edn.map([
        edn.keyword('a'), 1,
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four')
      ])
    ));

    test.ok(edn.isEqual(
      edn.map([
        edn.keyword('a'), 1,
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four')
      ]),
      edn.map([
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four'),
        edn.keyword('a'), 1
      ])
    ));

    test.ok(edn.isEqual(
      edn.map([
        edn.keyword('a'), 1,
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four')
      ]),
      edn.map([
        edn.vector([1, 2, 3]), edn.symbol('four'),
        edn.keyword('a'), 1,
        "foo", edn.keyword('bar')
      ])
    ));

    test.ok(!edn.isEqual(
      edn.map([
        edn.keyword('a'), 1,
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four')
      ]),
      edn.map([
        edn.keyword('b'), 2,
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four')
      ])
    ));

    test.ok(!edn.isEqual(
      edn.map([
        edn.keyword('a'), 1,
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four')
      ]),
      edn.map([
        edn.vector([1, 2, 3]), edn.symbol('four'),
        edn.keyword('a'), 1
      ])
    ));

    test.ok(!edn.isEqual(
      edn.map([
        edn.keyword('a'), 1,
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four')
      ]),
      edn.map([
        edn.keyword('a'), 1,
        "foo", edn.keyword('bar'),
        edn.vector([1, 2, 3]), edn.symbol('four'),
        'b', 2
      ])
    ));

    test.done();
  },

  "sets": function (test) {
    test.ok(edn.isEqual(
      edn.set([
        edn.symbol('a'),
        edn.symbol('b'),
        edn.vector([1, 2, 3])
      ]),
      edn.set([
        edn.symbol('a'),
        edn.symbol('b'),
        edn.vector([1, 2, 3])
      ])
    ));

    test.ok(edn.isEqual(
      edn.set([
        edn.symbol('a'),
        edn.symbol('b'),
        edn.vector([1, 2, 3])
      ]),
      edn.set([
        edn.vector([1, 2, 3]),
        edn.symbol('a'),
        edn.symbol('b')
      ])
    ));

    test.ok(edn.isEqual(
      edn.set([
        edn.symbol('a'),
        edn.symbol('b'),
        edn.vector([1, 2, 3])
      ]),
      edn.set([
        edn.symbol('b'),
        edn.vector([1, 2, 3]),
        edn.symbol('a')
      ])
    ));

    test.ok(!edn.isEqual(
      edn.set([
        edn.symbol('a'),
        edn.symbol('b'),
        edn.vector([1, 2, 3]),
      ]),
      edn.set([
        edn.symbol('a'),
        edn.symbol('b')
      ])
    ));

    test.ok(!edn.isEqual(
      edn.set([
        edn.symbol('a'),
        edn.symbol('b'),
        edn.vector([1, 2, 3]),
      ]),
      edn.set([
        edn.symbol('a'),
        edn.symbol('c'),
        edn.vector([1, 2, 3]),
      ])
    ));

    test.ok(!edn.isEqual(
      edn.set([
        edn.symbol('a'),
        edn.symbol('b'),
        edn.vector([1, 2, 3])
      ]),
      edn.set([
        edn.symbol('a'),
        edn.symbol('b'),
        edn.vector([1, 2, 3]),
        edn.symbol('c')
      ])
    ));

    test.done();
  },

  "inst": function (test) {
    test.ok(edn.isEqual(
      new Date(1985, 3, 12, 17, 20, 50, 520),
      new Date(1985, 3, 12, 17, 20, 50, 520)
    ));

    test.ok(!edn.isEqual(
      new Date(1985, 3, 12, 17, 20, 50, 520),
      new Date(1984, 3, 12, 17, 20, 50, 0)
    ));

    test.done();
  },

  "uuid": function (test) {
    test.ok(edn.isEqual(
      new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6"),
      new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6")
    ));

    test.ok(!edn.isEqual(
      new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6"),
      new edn.UUID("550e8400-e29b-41d4-a716-446655440000")
    ));

    test.ok(!edn.isEqual(
      new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6"),
      "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
    ));

    test.ok(!edn.isEqual(
      new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6"),
      Object("f81d4fae-7dec-11d0-a765-00a0c91e6bf6")
    ));

    test.ok(!edn.isEqual(
      Object("f81d4fae-7dec-11d0-a765-00a0c91e6bf6"),
      new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6")
    ));

    test.done();
  },

  "person": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    Person.prototype.asEDN = function () {
      return edn.Unknown("myapp/Person", {first: this.first, last: this.last});
    };

    var p1 = new Person("Fred", "Mertz");
    var p2 = new Person("Fred", "Mertz");
    var p3 = new Person("Bob", "Mertz");

    test.ok(edn.isEqual(p1, p1));
    test.ok(edn.isEqual(p1, p2));
    test.ok(!edn.isEqual(p1, p3));

    test.done();
  },

  "person converter": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    function isPerson(obj) {
      return obj instanceof Person;
    }
    function convertPerson(p) {
      return new edn.Unknown(
        "myapp/Person",
        {first: p.first, last: p.last}
      );
    }

    var options = {
      types: { "myapp/Person": isPerson },
      converters: { "myapp/Person": convertPerson }
    };

    var p1 = new Person("Fred", "Mertz");
    var p2 = new Person("Fred", "Mertz");
    var p3 = new Person("Bob", "Mertz");

    test.ok(edn.isEqual(p1, p1, options));
    test.ok(edn.isEqual(p1, p2, options));
    test.ok(!edn.isEqual(p1, p3, options));

    test.done();
  },

  "person equal": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    function isPerson(obj) {
      return obj instanceof Person;
    }
    function equalPerson(a, b) {
      return a.first == b.first && a.last == b.last;
    }

    var options = {
      types: { "myapp/Person": isPerson },
      equal: { "myapp/Person": equalPerson }
    };

    var p1 = new Person("Fred", "Mertz");
    var p2 = new Person("Fred", "Mertz");
    var p3 = new Person("Bob", "Mertz");

    test.ok(edn.isEqual(p1, p1, options));
    test.ok(edn.isEqual(p1, p2, options));
    test.ok(!edn.isEqual(p1, p3, options));

    test.done();
  }
};
