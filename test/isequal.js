/*jshint expr: true*/

'use strict';

var edn = require('../edn'),
    expect = require('chai').expect;

describe('isEqual', function () {
  it('should check nil', function (done) {
    expect(edn.isEqual(undefined, undefined)).to.be.true;
    expect(edn.isEqual(null, null)).to.be.true;
    expect(edn.isEqual(undefined, null)).to.be.true;
    expect(edn.isEqual(null, undefined)).to.be.true;

    expect(edn.isEqual(undefined, true)).to.be.false;
    expect(edn.isEqual(true, undefined)).to.be.false;
    expect(edn.isEqual(false, undefined)).to.be.false;
    expect(edn.isEqual(null, false)).to.be.false;
    expect(edn.isEqual(false, null)).to.be.false;
    done();
  });

  it('should check booleans', function (done) {
    expect(edn.isEqual(true, true)).to.be.true;
    expect(edn.isEqual(true, Object(true))).to.be.true;
    expect(edn.isEqual(Object(true), Object(true))).to.be.true;
    expect(edn.isEqual(false, false)).to.be.true;
    expect(edn.isEqual(false, Object(false))).to.be.true;
    expect(edn.isEqual(Object(false), Object(false))).to.be.true;

    expect(edn.isEqual(false, true)).to.be.false;
    expect(edn.isEqual(true, false)).to.be.false;
    expect(edn.isEqual(false, undefined)).to.be.false;
    expect(edn.isEqual(null, false)).to.be.false;
    expect(edn.isEqual(Object(true), Object(false))).to.be.false;
    done();
  });

  it('should check strings', function (done) {
    expect(edn.isEqual('hello', 'hello')).to.be.true;
    expect(edn.isEqual('hello', Object('hello'))).to.be.true;
    expect(edn.isEqual(Object('hello'), Object('hello'))).to.be.true;

    expect(edn.isEqual('hello', 'goodbye')).to.be.false;
    expect(edn.isEqual('hello', Object('goodbye'))).to.be.false;
    expect(edn.isEqual(Object('goodbye'), 'hello')).to.be.false;
    expect(edn.isEqual('true', true)).to.be.false;
    expect(edn.isEqual('nil', null)).to.be.false;
    expect(edn.isEqual(Object('hello'), Object('goodbye'))).to.be.false;
    done();
  });

  it('should check characters', function (done) {
    expect(edn.isEqual(edn.character('c'), edn.character('c'))).to.be.true;

    expect(edn.isEqual(edn.character('a'), edn.character('b'))).to.be.false;
    expect(edn.isEqual(edn.character('a'), 'a')).to.be.false;
    expect(edn.isEqual('b', edn.character('b'))).to.be.false;
    expect(edn.isEqual(Object('b'), edn.character('b'))).to.be.false;
    expect(edn.isEqual(edn.character('b'), Object('b'))).to.be.false;
    done();
  });

  it('should check symbols', function (done) {
    expect(edn.isEqual(edn.Symbol('foo'), edn.Symbol('foo'))).to.be.true;

    expect(edn.isEqual(edn.Symbol('foo'), edn.Symbol('bar'))).to.be.false;
    expect(edn.isEqual(edn.Symbol('bar'), edn.Symbol('foo'))).to.be.false;
    expect(edn.isEqual(edn.Symbol('foo'), 'foo')).to.be.false;
    expect(edn.isEqual(Object('foo'), edn.Symbol('foo'))).to.be.false;
    expect(edn.isEqual(edn.Symbol('foo'), Object('foo'))).to.be.false;
    done();
  });

  it('should check keywords', function (done) {
    expect(edn.isEqual(edn.Keyword('foo'), edn.Keyword('foo'))).to.be.true;

    expect(edn.isEqual(edn.Keyword('foo'), edn.Keyword('bar'))).to.be.false;
    expect(edn.isEqual(edn.Keyword('bar'), edn.Keyword('foo'))).to.be.false;
    expect(edn.isEqual(edn.Keyword('bar'), edn.Symbol('foo'))).to.be.false;
    expect(edn.isEqual(edn.Keyword('foo'), 'foo')).to.be.false;
    expect(edn.isEqual(Object('foo'), edn.Keyword('foo'))).to.be.false;
    expect(edn.isEqual(edn.Keyword('foo'), Object('foo'))).to.be.false;
    done();
  });

  it('should check integers', function (done) {
    expect(edn.isEqual(0, 0)).to.be.true;
    expect(edn.isEqual(42, 42)).to.be.true;
    expect(edn.isEqual(-1, -1)).to.be.true;
    expect(edn.isEqual(42, Object(42))).to.be.true;
    expect(edn.isEqual(Object(42), Object(42))).to.be.true;

    expect(edn.isEqual(1, 2)).to.be.false;
    expect(edn.isEqual(1, '1')).to.be.false;
    expect(edn.isEqual(Object(1), Object(2))).to.be.false;
    expect(edn.isEqual(Object(1), Object('1'))).to.be.false;
    done();
  });

  it('should check floating point numbers', function (done) {
    expect(edn.isEqual(3.14, 3.14)).to.be.true;
    expect(edn.isEqual(3.14, Object(3.14))).to.be.true;
    expect(edn.isEqual(Object(3.14), Object(3.14))).to.be.true;

    expect(edn.isEqual(3.14, 3.15)).to.be.false;
    expect(edn.isEqual(1.1, '1.1')).to.be.false;
    expect(edn.isEqual(Object(3.14), Object(3.15))).to.be.false;
    expect(edn.isEqual(Object(3.14), Object('3.14'))).to.be.false;
    done();
  });

  it('should check lists', function (done) {
    expect(edn.isEqual(edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
        edn.list([edn.symbol('a'), edn.symbol('b'), 42]))).to.be.true;

    expect(edn.isEqual(edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
        edn.list([edn.symbol('a'), edn.symbol('b'), 42, 100]))).to.be.false;

    expect(edn.isEqual(edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
        edn.list([edn.symbol('a'), edn.symbol('b')]))).to.be.false;

    expect(edn.isEqual(edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
        edn.list([edn.keyword('a'), edn.symbol('b'), 42]))).to.be.false;

    done();
  });

  it('should check vectors', function (done) {
    expect(edn.isEqual(edn.vector([edn.symbol('a'), edn.symbol('b'), 42]),
        edn.vector([edn.symbol('a'), edn.symbol('b'), 42]))).to.be.true;

    expect(edn.isEqual(edn.vector([edn.symbol('a'), edn.symbol('b'), 42]),
        edn.vector([edn.symbol('a'), edn.symbol('b'), 42, 100]))).to.be.false;

    expect(edn.isEqual(edn.vector([edn.symbol('a'), edn.symbol('b'), 42]),
        edn.vector([edn.symbol('a'), edn.symbol('b')]))).to.be.false;

    expect(edn.isEqual(edn.vector([edn.symbol('a'), edn.symbol('b'), 42]),
        edn.vector([edn.keyword('a'), edn.symbol('b'), 42]))).to.be.false;

    expect(edn.isEqual(edn.list([edn.symbol('a'), edn.symbol('b'), 42]),
        edn.vector([edn.symbol('a'), edn.symbol('b'), 42]))).to.be.false;

    done();
  });

  it('should check maps', function (done) {
    expect(edn.isEqual(
        edn.map([
          edn.keyword('a'), 1,
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four')
        ]),
        edn.map([
          edn.keyword('a'), 1,
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four')
        ])
    )).to.be.true;

    expect(edn.isEqual(
        edn.map([
          edn.keyword('a'), 1,
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four')
        ]),
        edn.map([
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four'),
          edn.keyword('a'), 1
        ])
    )).to.be.true;

    expect(edn.isEqual(
        edn.map([
          edn.keyword('a'), 1,
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four')
        ]),
        edn.map([
          edn.vector([1, 2, 3]), edn.symbol('four'),
          edn.keyword('a'), 1,
          'foo', edn.keyword('bar')
        ])
    )).to.be.true;

    expect(edn.isEqual(
        edn.map([
          edn.keyword('a'), 1,
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four')
        ]),
        edn.map([
          edn.keyword('b'), 2,
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four')
        ])
    )).to.be.false;

    expect(edn.isEqual(
        edn.map([
          edn.keyword('a'), 1,
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four')
        ]),
        edn.map([
          edn.vector([1, 2, 3]), edn.symbol('four'),
          edn.keyword('a'), 1
        ])
    )).to.be.false;

    expect(edn.isEqual(
        edn.map([
          edn.keyword('a'), 1,
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four')
        ]),
        edn.map([
          edn.keyword('a'), 1,
          'foo', edn.keyword('bar'),
          edn.vector([1, 2, 3]), edn.symbol('four'),
          'b', 2
        ])
    )).to.be.false;

    done();
  });

  it('should check sets', function (done) {
    expect(edn.isEqual(
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
    )).to.be.true;

    expect(edn.isEqual(
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
    )).to.be.true;

    expect(edn.isEqual(
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
    )).to.be.true;

    expect(edn.isEqual(
        edn.set([
          edn.symbol('a'),
          edn.symbol('b'),
          edn.vector([1, 2, 3]),
        ]),
        edn.set([
          edn.symbol('a'),
          edn.symbol('b')
        ])
    )).to.be.false;

    expect(edn.isEqual(
        edn.set([
          edn.symbol('a'),
          edn.symbol('b'),
          edn.vector([1, 2, 3]),
        ]),
        edn.set([
          edn.symbol('a'),
          edn.symbol('b')
        ])
    )).to.be.false;

    expect(edn.isEqual(
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
    )).to.be.false;

    expect(edn.isEqual(
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
    )).to.be.false;

    done();
  });

  it('should check inst', function (done) {
    expect(edn.isEqual(
        new Date(1985, 3, 12, 17, 20, 50, 520),
        new Date(1985, 3, 12, 17, 20, 50, 520)
    )).to.be.true;

    expect(edn.isEqual(
        new Date(1985, 3, 12, 17, 20, 50, 520),
        new Date(1984, 3, 12, 17, 20, 50, 0)
    )).to.be.false;
    done();
  });

  it('should check uuid', function (done) {
    expect(edn.isEqual(
        new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'),
        new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    )).to.be.true;

    expect(edn.isEqual(
        new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'),
        new edn.UUID('550e8400-e29b-41d4-a716-446655440000')
    )).to.be.false;
    expect(edn.isEqual(
        new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'),
        'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
    )).to.be.false;
    expect(edn.isEqual(
        new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'),
        Object('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    )).to.be.false;
    expect(edn.isEqual(
        Object('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'),
        new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    )).to.be.false;
    done();
  });

  it('should check person', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last = last;
    }

    Person.prototype.asEDN = function () {
      return edn.generic('myapp/Person', {first: this.first, last: this.last});
    };

    var p1 = new Person('Fred', 'Mertz');
    var p2 = new Person('Fred', 'Mertz');
    var p3 = new Person('Bob', 'Mertz');

    expect(edn.isEqual(p1, p1)).to.be.true;
    expect(edn.isEqual(p1, p2)).to.be.true;
    expect(edn.isEqual(p1, p3)).to.be.false;

    done();
  });

  it('should check person converter', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last = last;
    }

    function isPerson(obj) {
      return obj instanceof Person;
    }

    function convertPerson(p) {
      return edn.generic(
          'myapp/Person',
          {first: p.first, last: p.last}
      );
    }

    var options = {
      types: {'myapp/Person': isPerson},
      converters: {'myapp/Person': convertPerson}
    };

    var p1 = new Person('Fred', 'Mertz');
    var p2 = new Person('Fred', 'Mertz');
    var p3 = new Person('Bob', 'Mertz');

    expect(edn.isEqual(p1, p1, options)).to.be.true;
    expect(edn.isEqual(p1, p2, options)).to.be.true;
    expect(edn.isEqual(p1, p3, options)).to.be.false;

    done();
  });

  it('should check person equal', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last = last;
    }

    function isPerson(obj) {
      return obj instanceof Person;
    }

    function equalPerson(a, b) {
      return a.first === b.first && a.last === b.last;
    }

    var options = {
      types: {'myapp/Person': isPerson},
      equal: {'myapp/Person': equalPerson}
    };

    var p1 = new Person('Fred', 'Mertz');
    var p2 = new Person('Fred', 'Mertz');
    var p3 = new Person('Bob', 'Mertz');

    expect(edn.isEqual(p1, p1, options)).to.be.true;
    expect(edn.isEqual(p1, p2, options)).to.be.true;
    expect(edn.isEqual(p1, p3, options)).to.be.false;

    done();
  });

});
