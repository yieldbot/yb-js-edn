"use strict";

var edn = require('../edn');

exports.objects = {
  "string": function (test) {
    test.equal("hello", edn.convert("hello"));
    test.done();
  },

  "uuid": function (test) {
    test.deepEqual(
      new edn.Unknown('uuid', "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"),
      edn.convert(edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6"))
    );
    test.done();
  },

  "date": function (test) {
    test.deepEqual(
      new edn.Unknown('inst', "1985-04-12T23:20:50.520Z"),
      edn.convert(new Date(1985, 3, 12, 17, 20, 50, 520))
    );
    test.done();
  },

  "person as edn": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    var p = new Person("Fred", "Mertz");

    test.throws(function () { edn.convert(p); });

    Person.prototype.asEDN = function () {
      return new edn.Unknown(
        "myapp/Person",
        {first: this.first, last: this.last}
      );
    };

    test.deepEqual(
      new edn.Unknown("myapp/Person", {first: "Fred", last: "Mertz"}),
      edn.convert(p)
    );

    test.done();
  },

  "person converter": function (test) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    var p = new Person("Fred", "Mertz");

    function isPerson(obj) {
      return obj instanceof Person;
    }
    function convertPerson(p) {
      return new edn.Unknown(
        "myapp/Person",
        {first: p.first, last: p.last}
      );
    }

    test.throws(function () { edn.convert(p); });

    test.deepEqual(
      new edn.Unknown("myapp/Person", {first: "Fred", last: "Mertz"}),
      edn.convert(p, {
        types: { "myapp/Person": isPerson },
        converters: { "myapp/Person": convertPerson }
      })
    );

    test.done();
  }
};
