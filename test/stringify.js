"use strict";

var edn = require('../edn');

exports.primitives = {
  "undefined": function (test) {
    test.equal('nil', edn.stringify(undefined));
    test.done();
  },

  "null": function (test) {
    test.equal('nil', edn.stringify(null));
    test.done();
  },

  "true": function (test) {
    test.equal('true', edn.stringify(true));
    test.done();
  },

  "false": function (test) {
    test.equal('false', edn.stringify(false));
    test.done();
  },

  "string": function (test) {
    test.equal('"hello"', edn.stringify("hello"));
    test.done();
  },

  "number": function (test) {
    test.equal('42', edn.stringify(42));
    test.equal('3.14', edn.stringify(3.14));
    test.done();
  }
};

exports.objects = {
  "true": function (test) {
    test.equal('true', edn.stringify(new Object(true)));
    test.done();
  },

  "false": function (test) {
    test.equal('false', edn.stringify(new Object(false)));
    test.done();
  },

  "string": function (test) {
    test.equal('"hello"', edn.stringify(new Object("hello")));
    test.done();
  },

  "number": function (test) {
    test.equal('42', edn.stringify(new Object(42)));
    test.equal('3.14', edn.stringify(new Object(3.14)));
    test.done();
  },

  "array": function (test) {
    test.equal('[1 2 3]', edn.stringify([1, 2, 3]));
    test.done();
  },

  "object": function (test) {
    test.equal('{:foo 1, :bar 2}', edn.stringify({foo: 1, bar: 2}));
    test.done();
  },

  "characters": function (test) {
    var c;

    c = edn.Character("c");
    test.equal('\\c', edn.stringify(c));

    c = edn.Character("\n");
    test.equal('\\newline', edn.stringify(c));

    c = edn.Character("\r");
    test.equal('\\return', edn.stringify(c));

    c = edn.Character(" ");
    test.equal('\\space', edn.stringify(c));

    c = edn.Character("\t");
    test.equal('\\tab', edn.stringify(c));

    test.done();
  },

  "symbols": function (test) {
    var s;

    s = edn.Symbol("foo");
    test.equal('foo', edn.stringify(s));

    s = edn.Symbol("my-namespace/foo");
    test.equal('my-namespace/foo', edn.stringify(s));

    test.done();
  },

  "keywords": function (test) {
    var k;

    k = edn.Keyword("fred");
    test.equal(':fred', edn.stringify(k));

    k = edn.Keyword("my/fred");
    test.equal(':my/fred', edn.stringify(k));

    test.done();
  },

  "lists": function (test) {
    var l = edn.list([edn.symbol('a'), edn.symbol('b'), 42]);
    test.equal('(a b 42)', edn.stringify(l));
    test.done();
  },

  "vectors": function (test) {
    var v = edn.vector([edn.symbol('a'), edn.symbol('b'), 42]);
    test.equal('[a b 42]', edn.stringify(v));
    test.done();
  },

  "map": function (test) {
    var map = new edn.Map();
    map.set('foo', 1);
    map.set('bar', 2);
    test.equal('{"foo" 1, "bar" 2}', edn.stringify(map));

    map = edn.map([
      edn.keyword('a'), 1,
      "foo", edn.keyword('bar'),
      edn.vector([1, 2, 3]),
      edn.symbol('four')
    ]);
    test.equal('{:a 1, "foo" :bar, [1 2 3] four}', edn.stringify(map));

    test.done();
  },

  "set": function (test) {
    var set = new edn.Set();
    set.add('a');
    set.add('b');
    set.add([1, 2, 3]);
    test.equal('#{"a" "b" [1 2 3]}', edn.stringify(set));

    set = edn.set([
      edn.symbol('a'),
      edn.symbol('b'),
      edn.vector([1, 2, 3])
    ]);
    test.equal('#{a b [1 2 3]}', edn.stringify(set));

    test.done();
  },

  "generic": function (test) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), "Fred");
    p.set(edn.Keyword('last'), "Mertz");
    test.equal(
      '{:first "Fred", :last "Mertz"}',
      edn.stringify(p)
    );

    p = edn.generic(edn.Symbol('myapp/Person'), p);
    test.equal(
      '#myapp/Person {:first "Fred", :last "Mertz"}',
      edn.stringify(p)
    );
    test.done();
  },

  "date": function (test) {
    var d = new Date(Date.parse("1985-04-12T23:20:50.52Z"));
    test.equal('#inst "1985-04-12T23:20:50.520Z"', edn.stringify(d));
    test.done();
  },

  "uuid": function (test) {
    var uuid = edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    test.equal(
      '#uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"',
      edn.stringify(uuid)
    );
    test.done();
  },

  "person toEDN": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    Person.prototype.toEDN = function () {
      return [
        "#myapp/Person",
        edn.stringify({first: this.first, last: this.last})
      ].join(" ");
    };

    var p = new Person("Fred", "Mertz");
    test.equal(
      '#myapp/Person {:first "Fred", :last "Mertz"}',
      edn.stringify(p)
    );

    test.done();
  },

  "person asEDN": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    Person.prototype.asEDN = function () {
      return edn.generic("myapp/Person", {first: this.first, last: this.last});
    };

    var p = new Person("Fred", "Mertz");
    test.equal(
      '#myapp/Person {:first "Fred", :last "Mertz"}',
      edn.stringify(p)
    );

    test.done();
  },

  "person printer": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    function isPerson(obj) {
      return obj instanceof Person;
    }
    function printPerson(p) {
      return [
        "#myapp/Person",
        edn.stringify({first: p.first, last: p.last})
      ].join(" ");
    }

    var p = new Person("Fred", "Mertz");
    test.equal(
      '#myapp/Person {:first "Fred", :last "Mertz"}',
      edn.stringify(p, {
        types: { "myapp/Person": isPerson },
        printers: { "myapp/Person": printPerson }
      })
    );

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
      return edn.generic(
        "myapp/Person",
        {first: p.first, last: p.last}
      );
    }

    var p = new Person("Fred", "Mertz");
    test.equal(
      '#myapp/Person {:first "Fred", :last "Mertz"}',
      edn.stringify(p, {
        types: { "myapp/Person": isPerson },
        converters: { "myapp/Person": convertPerson }
      })
    );

    test.done();
  }
};
