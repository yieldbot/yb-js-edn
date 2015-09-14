/*jshint expr: true*/

'use strict';

var edn = require('../edn'),
    chai = require('chai'),
    expect = chai.expect;
/* jshint ignore:start */
var assert = chai.assert;
/* jshint ignore:end */

describe('parse', function () {
  it('should parse nil', function (done) {
    expect(edn.parse('nil')).to.equal(null);
    done();
  });

  it('should parse booleans', function (done) {
    expect(edn.parse('true')).to.equal(true);
    expect(edn.parse('false')).to.equal(false);
    done();
  });

  it('should parse strings', function (done) {
    expect(edn.parse('"double quotes"')).to.equal('double quotes');
    expect(function () { edn.parse('"missing quote'); }).to.throw(Error);
    done();
  });

  it('should parse characters', function (done) {
    expect(edn.parse('\\c')).to.equal(edn.character('c'));
    expect(edn.parse('\\newline')).to.equal(edn.character('\n'));
    expect(edn.parse('\\return')).to.equal(edn.character('\r'));
    expect(edn.parse('\\space')).to.equal(edn.character(' '));
    expect(edn.parse('\\tab')).to.equal(edn.character('\t'));
    expect(function () { edn.parse('"missing quote'); }).to.throw(Error);
    done();
  });

  it('should parse symbols', function (done) {
    expect(edn.parse('foo')).to.equal(edn.Symbol('foo'));
    expect(edn.parse('my-namespace/foo')).to.equal(edn.Symbol('my-namespace/foo'));
    done();
  });

  it('should parse keywords', function (done) {
    expect(edn.parse(':fred')).to.equal(edn.keyword('fred'));
    expect(edn.parse(':my/fred')).to.equal(edn.keyword('my/fred'));
    done();
  });

  it('should parse integers', function (done) {
    expect(edn.parse('0')).to.equal(0);
    expect(edn.parse('9')).to.equal(9);
    expect(edn.parse('42')).to.equal(42);
    expect(edn.parse('-1')).to.equal(-1);
    done();
  });

  it('should parse floating point numbers', function (done) {
    /* jshint ignore:start */
    assert(edn.parse('3.14') == 3.14, 'not strctly equal');
    assert(edn.parse('9.0') == 9.0, 'not strctly equal');
    /* jshint ignore:end */
    done();
  });

  it('should parse lists', function (done) {
    expect(edn.parse('(a b 42)')).to.deep.equal(edn.list([edn.symbol('a'), edn.symbol('b'), edn.integer(42)]));
    expect(function () { edn.parse('(missing paren'); }).to.throw(Error);
    done();
  });

  it('should parse vectors', function (done) {
    expect(edn.parse('[a b 42]')).to.deep.equal(edn.vector([edn.symbol('a'), edn.symbol('b'), edn.integer(42)]));
    expect(function () { edn.parse('[missing bracket'); }).to.throw(Error);
    done();
  });

  it('should parse maps', function (done) {
    expect(edn.parse('{:a 1, "foo" :bar, [1 2 3] four}')).to.deep
        .equal(edn.map([
          edn.keyword('a'), edn.integer(1),
          'foo', edn.keyword('bar'),
          edn.vector([edn.integer(1), edn.integer(2), edn.integer(3)]),
          edn.symbol('four')
        ]));
    expect(function () { edn.parse('[missing brace'); }).to.throw(Error);
    done();
  });

  it('should parse sets', function (done) {
    expect(edn.parse('#{a b [1 2 3]}')).to.deep
        .equal(edn.set([
          edn.symbol('a'),
          edn.symbol('b'),
          edn.vector([1, 2, 3]),
        ]));
    expect(function () { edn.parse('#{missing brace'); }).to.throw(Error);
    done();
  });

  it('should parse generic tag', function (done) {
    expect(edn.parse('#myapp/Person {:first "Fred", :last "Mertz"}')).to.deep
        .equal(edn.generic('myapp/Person', edn.map([
          edn.keyword('first'), 'Fred',
          edn.keyword('last'), 'Mertz'
        ])));
    done();
  });

  it('should parse inst tag', function (done) {
    expect(edn.parse('#inst "1985-04-12T23:20:50.52Z"')).to.deep
        .equal(new Date(Date.parse('1985-04-12T23:20:50.52Z')));
    done();
  });

  it('should parse uuid tag', function (done) {
    expect(edn.parse('#uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"')).to.deep
        .equal(edn.uuid('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'));
    done();
  });

  it('should parse person tag', function (done) {
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

    expect(edn.parse(
        '#myapp/Person {:first "Fred", :last "Mertz"}',
        { tags: { 'myapp/Person': toPerson } }
    )).to.deep
        .equal(new Person('Fred', 'Mertz'));
    done();
  });

  it('should discard', function (done) {
    var v = edn.vector([edn.symbol('a'), edn.symbol('b'), edn.integer(42)]);

    expect(edn.parse('[a b #_foo 42]')).to.deep.equal(v);
    expect(edn.parse('[a b #_ foo 42]')).to.deep.equal(v);
    expect(edn.parse('[a b #_[1, 2, 3] 42]')).to.deep.equal(v);
    expect(edn.parse('[a b #_ [1, 2, 3] 42]')).to.deep.equal(v);
    done();
  });

});
