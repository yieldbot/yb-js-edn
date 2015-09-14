/*jshint expr: true*/

'use strict';

var edn = require('../edn'),
    expect = require('chai').expect;

describe('typeof', function () {

  it('should handle undefined', function (done) {
    expect(edn.typeOf(undefined)).to.equal('undefined');
    done();
  });

  it('should handle null', function (done) {
    expect(edn.typeOf(null)).to.equal('nil');
    done();
  });

  it('should handle true', function (done) {
    expect(edn.typeOf(true)).to.equal('boolean');
    done();
  });

  it('should handle false', function (done) {
    expect(edn.typeOf(false)).to.equal('boolean');
    done();
  });

  it('should handle string', function (done) {
    expect(edn.typeOf('hello')).to.equal('string');
    done();
  });

  it('should handle number', function (done) {
    expect(edn.typeOf(42)).to.equal('integer');
    expect(edn.typeOf(3.14)).to.equal('float');
    done();
  });

  it('should handle Object(true)', function (done) {
    expect(edn.typeOf(new Object(true))).to.equal('boolean');
    done();
  });

  it('should handle Object(false)', function (done) {
    expect(edn.typeOf(new Object(false))).to.equal('boolean');
    done();
  });

  it('should handle Object(string)', function (done) {
    expect(edn.typeOf(new Object('hello'))).to.equal('string');
    done();
  });

  it('should handle Object(number)', function (done) {
    expect(edn.typeOf(new Object(42))).to.equal('integer');
    expect(edn.typeOf(new Object(3.14))).to.equal('float');
    done();
  });

  it('should handle array', function (done) {
    expect(edn.typeOf([1, 2, 3])).to.equal('array');
    done();
  });

  it('should handle object', function (done) {
    expect(edn.typeOf({foo: 1, bar: 2})).to.equal('object');
    done();
  });

  it('should handle regex', function (done) {
    expect(edn.typeOf(/a/)).to.equal(null);
    done();
  });

  it('should handle character', function (done) {
    expect(edn.typeOf(edn.Character('c'))).to.equal('character');
    done();
  });

  it('should handle symbol', function (done) {
    expect(edn.typeOf(edn.Symbol('foo'))).to.equal('symbol');
    done();
  });

  it('should handle keyword', function (done) {
    expect(edn.typeOf(edn.Keyword('foo'))).to.equal('keyword');
    done();
  });

  it('should handle list', function (done) {
    expect(edn.typeOf(edn.list([1, 2, 3]))).to.equal('list');
    done();
  });

  it('should handle vector', function (done) {
    expect(edn.typeOf(edn.vector([1, 2, 3]))).to.equal('vector');
    done();
  });

  it('should handle map', function (done) {
    var map = new edn.Map();
    map.set('foo', 1);
    map.set('bar', 2);
    expect(edn.typeOf(map)).to.equal('map');
    done();
  });

  it('should handle set', function (done) {
    var set = new edn.Set();
    set.add('a');
    set.add('b');
    set.add([1, 2, 3]);
    expect(edn.typeOf(set)).to.equal('set');
    done();
  });

  it('should handle generic', function (done) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), 'Fred');
    p.set(edn.Keyword('last'), 'Mertz');

    expect(edn.typeOf(edn.generic(edn.Symbol('myapp/Person'), p))).to.equal('generic');
    done();
  });

  it('should handle inst', function (done) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), 'Fred');
    p.set(edn.Keyword('last'), 'Mertz');

    expect(edn.typeOf(new Date(1985, 3, 12, 17, 20, 50, 520))).to.equal('inst');
    done();
  });

  it('should handle uuid', function (done) {
    expect(edn.typeOf(edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'))).to.equal('uuid');
    done();
  });

  it('should handle person', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last = last;
    }

    expect(edn.typeOf(new Person('Fred', 'Mertz'))).to.equal(null);
    expect(edn.typeOf(new Person('Fred', 'Mertz'), {
      types: {
        'myapp/Person': function (obj) {
          return obj instanceof Person;
        }
      }
    })).to.equal('myapp/Person');
    done();
  });

  it('should handle conflicted types', function (done) {
    expect(function () {
      edn.typeOf('foo', {
        types: {'string2': edn.types.string}
      });
    }).to.throw(Error);
    done();
  });

});
