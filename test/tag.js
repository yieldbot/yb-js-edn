"use strict";

var edn = require('../edn');

exports.tag = {
  "inst": function (test) {
    test.deepEqual(
      new Date(Date.parse("1985-04-12T23:20:50.52Z")),
      edn.dispatchTag("inst", "1985-04-12T23:20:50.52Z")
    );
    test.done();
  },

  "uuid": function (test) {
    test.deepEqual(
      edn.uuid("f81d4fae-7dec-11d0-a765-00a0c91e6bf6"),
      edn.dispatchTag("uuid", "f81d4fae-7dec-11d0-a765-00a0c91e6bf6")
    );
    test.done();
  },

  "person": function (test) {
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
      edn.dispatchTag(
        "myapp/Person", attrs,
        { tags: { 'myapp/Person': toPerson } }
      )
    );

    test.done();
  },

  "generic": function (test) {
    test.deepEqual(
      edn.generic("myapp/Person", "Bob"),
      edn.dispatchTag("myapp/Person", "Bob")
    );
    test.done();
  },

  "throw": function (test) {
    test.throws(function () {
      edn.dispatchTag("myapp/Person", "Bob", {
        tags: { default: null }
      });
    });
    test.done();
  }
};
