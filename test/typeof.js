"use strict";

var edn = require('../edn');

exports.primitives = {
  "undefined": function (test) {
    test.equal('nil', edn.typeOf(undefined));
    test.done();
  },

  "null": function (test) {
    test.equal('nil', edn.typeOf(null));
    test.done();
  },

  "true": function (test) {
    test.equal('boolean', edn.typeOf(true));
    test.done();
  },

  "false": function (test) {
    test.equal('boolean', edn.typeOf(false));
    test.done();
  },

  "string": function (test) {
    test.equal('string', edn.typeOf("hello"));
    test.done();
  },

  "number": function (test) {
    test.equal('integer', edn.typeOf(42));
    test.equal('float', edn.typeOf(3.14));
    test.done();
  }
};

exports.objects = {
  "true": function (test) {
    test.equal('boolean', edn.typeOf(new Object(true)));
    test.done();
  },

  "false": function (test) {
    test.equal('boolean', edn.typeOf(new Object(false)));
    test.done();
  },

  "string": function (test) {
    test.equal('string', edn.typeOf(new Object("hello")));
    test.done();
  },

  "number": function (test) {
    test.equal('integer', edn.typeOf(new Object(42)));
    test.equal('float', edn.typeOf(new Object(3.14)));
    test.done();
  },

  "array": function (test) {
    test.equal('array', edn.typeOf([1, 2, 3]));
    test.done();
  },

  "object": function (test) {
    test.equal('object', edn.typeOf({foo: 1, bar: 2}));
    test.done();
  },

  "regexp": function (test) {
    var re = new RegExp();
    test.equal(null, edn.typeOf(re));
    test.done();
  },

  "character": function (test) {
    test.equal('character', edn.typeOf(edn.Character("c")));
    test.done();
  },

  "symbol": function (test) {
    test.equal('symbol', edn.typeOf(edn.Symbol('foo')));
    test.done();
  },

  "keyword": function (test) {
    test.equal('keyword', edn.typeOf(edn.Keyword('foo')));
    test.done();
  },

  "list": function (test) {
    test.equal('list', edn.typeOf(edn.list([1, 2, 3])));
    test.done();
  },

  "vector": function (test) {
    test.equal('vector', edn.typeOf(edn.vector([1, 2, 3])));
    test.done();
  },

  "map": function (test) {
    var map = new edn.Map();
    map.set('foo', 1);
    map.set('bar', 2);
    test.equal('map', edn.typeOf(map));
    test.done();
  },

  "set": function (test) {
    var set = new edn.Set();
    set.add('a');
    set.add('b');
    set.add([1, 2, 3]);
    test.equal('set', edn.typeOf(set));
    test.done();
  },

  "unknown": function (test) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), "Fred");
    p.set(edn.Keyword('last'), "Mertz");

    var unknown = new edn.Unknown(edn.Symbol('myapp/Person'), p);
    test.equal('unknown', edn.typeOf(unknown));
    test.done();
  },

  "inst": function (test) {
    var d = new Date(1985, 3, 12, 17, 20, 50, 520);
    test.equal('inst', edn.typeOf(d));
    test.done();
  },

  "uuid": function (test) {
    var uuid = edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    test.equal('uuid', edn.typeOf(uuid));
    test.done();
  },

  "person": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }

    var p = new Person("Fred", "Mertz");
    test.equal(null, edn.typeOf(p));

    test.equal('myapp/Person', edn.typeOf(p, {
      types: {
        'myapp/Person': function (obj) {
          return obj instanceof Person;
        }
      }
    }));

    test.done();
  }
};
