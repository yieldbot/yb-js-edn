/*jshint expr: true*/

'use strict';

var edn = require('../edn');

// Run test w/ harmony enabled
// $ node --harmony ./node_modules/.bin/nodeunit test/types.js

var edn = require('../edn'),
    chai = require('chai'),
    expect = chai.expect;
/* jshint ignore:start */
var assert = chai.assert;
/* jshint ignore:end */

describe('types', function () {

  describe('character', function () {

    it('should match for function', function (done) {
      expect(edn.Character('c')).to.be.an.instanceof(edn.Character);
      done();
    });

    it('should match for constructor', function (done) {
      expect(new edn.Character('c')).to.be.an.instanceof(edn.Character);
      done();
    });

    it('should match for valueOf', function (done) {
      expect(edn.Character('c').valueOf()).to.equal('c');
      done();
    });

    it('should match for toString', function (done) {
      expect(edn.Character('c').toString()).to.equal('c');
      done();
    });

    it('should match for equality', function (done) {
      var c1 = edn.Character('c');
      var c2 = edn.Character('c');
      var c3 = edn.Character('d');

      expect(c1).to.equal(c1);
      expect(c1).to.equal(c2);
      /* jshint ignore:start */
      var s4 = 'c';
      assert(c1 == s4, 'non strictly equal');
      /* jshint ignore:end */
      expect(c1).to.not.equal(c3);
      done();
    });

    it('function value is frozen', function (done) {
      expect(Object.isFrozen(edn.Character('c'))).to.be.true;
      done();
    });

    it('constructor object is not frozen', function (done) {
      expect(Object.isFrozen(new edn.Character('c'))).to.be.false;
      done();
    });

  });

  describe('symbol', function () {
    it('should match for function', function (done) {
      var sym = edn.Symbol('foo');
      expect(sym).to.be.an.instanceof(edn.Symbol);
      expect(sym.namespace).to.be.null;
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for function with namespaced name', function (done) {
      var sym = edn.Symbol('my-namespace/foo');
      expect(sym).to.be.an.instanceof(edn.Symbol);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for function with namespace', function (done) {
      var sym = edn.Symbol('my-namespace', 'foo');
      expect(sym).to.be.an.instanceof(edn.Symbol);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for constructor', function (done) {
      var sym = new edn.Symbol('foo');
      expect(sym).to.be.an.instanceof(edn.Symbol);
      expect(sym.namespace).to.be.null;
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for constructor with namespaced name', function (done) {
      var sym = new edn.Symbol('my-namespace/foo');
      expect(sym).to.be.an.instanceof(edn.Symbol);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for constructor with namespace', function (done) {
      var sym = new edn.Symbol('my-namespace', 'foo');
      expect(sym).to.be.an.instanceof(edn.Symbol);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('constructor with / name', function (done) {
      var sym = new edn.Symbol('/');
      expect(sym).to.be.an.instanceof(edn.Symbol);
      expect(sym.namespace).to.be.null;
      expect(sym.name).to.equal('/');
      done();
    });

    it('should match for valueOf', function (done) {
      expect(edn.Symbol('foo').valueOf()).to.equal('foo');
      expect(edn.Symbol('my-namespace/foo').valueOf()).to.equal('my-namespace/foo');
      expect(edn.Symbol('my-namespace', 'foo').valueOf()).to.equal('my-namespace/foo');
      expect(typeof edn.Symbol('foo').valueOf()).to.equal('string');
      done();
    });

    it('should match for toString', function (done) {
      expect(edn.Symbol('foo').toString()).to.equal('foo');
      expect(edn.Symbol('my-namespace/foo').toString()).to.equal('my-namespace/foo');
      expect(edn.Symbol('my-namespace', 'foo').toString()).to.equal('my-namespace/foo');
      done();
    });

    it('should match for equality', function (done) {
      var s1 = edn.Symbol('foo');
      var s2 = edn.Symbol('foo');
      var s3 = edn.Symbol('bar');
      var s4 = 'foo';

      expect(s1).to.equal(s1);
      expect(s1).to.equal(s2);
      expect(s1).to.not.equal(s3);
      /* jshint ignore:start */
      assert(s1 == s4, 'non strictly equal');
      /* jshint ignore:end */
      expect(s1).to.not.equal(s4);

      expect(s1).to.deep.equal(s1);
      expect(s1).to.deep.equal(s2);
      expect(s1).to.not.deep.equal(s3);
      done();
    });

    it('function value is frozen', function (done) {
      expect(Object.isFrozen(edn.Symbol('foo'))).to.be.true;
      done();
    });

    it('constructor object is not frozen', function (done) {
      expect(Object.isFrozen(new edn.Symbol('foo'))).to.be.false;
      done();
    });
  });

  describe('keyword', function () {
    it('should match for function', function (done) {
      var sym = edn.Keyword('foo');
      expect(sym).to.be.an.instanceof(edn.Keyword);
      expect(sym.namespace).to.be.null;
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for function with namespaced name', function (done) {
      var sym = edn.Keyword('my-namespace/foo');
      expect(sym).to.be.an.instanceof(edn.Keyword);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for function with namespace', function (done) {
      var sym = edn.Keyword('my-namespace', 'foo');
      expect(sym).to.be.an.instanceof(edn.Keyword);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for function with symbol', function (done) {
      var sym = edn.Keyword(edn.Symbol('my-namespace', 'foo'));
      expect(sym).to.be.an.instanceof(edn.Keyword);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for constructor', function (done) {
      var sym = new edn.Keyword('foo');
      expect(sym).to.be.an.instanceof(edn.Keyword);
      expect(sym.namespace).to.be.null;
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for constructor with namespaced name', function (done) {
      var sym = new edn.Keyword('my-namespace/foo');
      expect(sym).to.be.an.instanceof(edn.Keyword);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for constructor with namespace', function (done) {
      var sym = new edn.Keyword('my-namespace', 'foo');
      expect(sym).to.be.an.instanceof(edn.Keyword);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('should match for constructor with symbol', function (done) {
      var sym = new edn.Keyword(edn.Symbol('my-namespace', 'foo'));
      expect(sym).to.be.an.instanceof(edn.Keyword);
      expect(sym.namespace).to.equal('my-namespace');
      expect(sym.name).to.equal('foo');
      done();
    });

    it('constructor with / name', function (done) {
      var sym = new edn.Keyword('/');
      expect(sym).to.be.an.instanceof(edn.Keyword);
      expect(sym.namespace).to.be.null;
      expect(sym.name).to.equal('/');
      done();
    });

    it('should match for valueOf', function (done) {
      expect(edn.Keyword('foo').valueOf()).to.equal('foo');
      expect(edn.Keyword('my-namespace/foo').valueOf()).to.equal('my-namespace/foo');
      expect(edn.Keyword('my-namespace', 'foo').valueOf()).to.equal('my-namespace/foo');
      expect(typeof edn.Keyword('foo').valueOf()).to.equal('string');
      done();
    });

    it('should match for toString', function (done) {
      expect(edn.Keyword('foo').toString()).to.equal(':foo');
      expect(edn.Keyword('my-namespace/foo').toString()).to.equal(':my-namespace/foo');
      expect(edn.Keyword('my-namespace', 'foo').toString()).to.equal(':my-namespace/foo');
      done();
    });

    it('should match for equality', function (done) {
      var s1 = edn.Keyword('foo');
      var s2 = edn.Keyword('foo');
      var s3 = edn.Keyword('bar');
      var s4 = edn.Symbol('foo');

      expect(s1).to.equal(s1);
      expect(s1).to.equal(s2);
      expect(s1).to.not.equal(s3);
      expect(s1).to.not.equal(s4);

      expect(s1).to.deep.equal(s1);
      expect(s1).to.deep.equal(s2);
      expect(s1).to.not.deep.equal(s3);
      expect(s1).to.not.deep.equal(s4);
      done();
    });

    it('function value is frozen', function (done) {
      expect(Object.isFrozen(edn.Keyword('foo'))).to.be.true;
      done();
    });

    it('constructor object is not frozen', function (done) {
      expect(Object.isFrozen(new edn.Keyword('foo'))).to.be.false;
      done();
    });
  });

  describe('map', function () {
    it('should match for function', function (done) {
      expect(edn.Map()).to.be.an.instanceof(edn.Map);
      done();
    });

    it('should match for constructor', function (done) {
      expect(new edn.Map()).to.be.an.instanceof(edn.Map);
      done();
    });

    it('set', function (done) {
      var map = new edn.Map();
      var obj = {};
      expect(map.set('foo', 'bar')).to.be.equal('bar');
      expect(map.set(42, 'life')).to.be.equal('life');
      expect(map.set(obj, 'object')).to.be.equal('object');
      done();
    });

    it('get', function (done) {
      var map = new edn.Map();
      var obj = {};

      map.set('foo', 'bar');
      map.set(42, 'life');
      map.set(obj, 'object');

      expect(map.get('foo')).to.be.equal('bar');
      expect(map.get(42)).to.be.equal('life');
      expect(map.get(obj)).to.be.equal('object');
      expect(map.get('missing')).to.be.undefined;
      done();
    });

    it('has', function (done) {
      var map = new edn.Map();
      var obj = {};

      map.set('foo', 'bar');
      map.set(42, 'life');
      map.set(obj, 'object');

      expect(map.has('foo')).to.be.true;
      expect(map.has('bar')).to.be.false;
      expect(map.has(42)).to.be.true;
      expect(map.has('42')).to.be.false;
      expect(map.has(obj)).to.be.true;
      expect(map.has({})).to.be.false;
      done();
    });

    it('delete', function (done) {
      var map = new edn.Map();
      var obj = {};

      map.set('foo', 'bar');
      map.set(42, 'life');
      map.set(obj, 'object');

      expect(map.delete('foo')).to.be.true;
      expect(map.delete('foo')).to.be.false;
      expect(map.delete(obj)).to.be.true;

      expect(map.has('foo')).to.be.false;
      expect(map.has(42)).to.be.true;
      expect(map.has(obj)).to.be.false;
      done();
    });

    it('toString', function (done) {
      var map = new edn.Map();
      var obj = {};

      map.set('foo', 'bar');
      map.set(42, 'life');
      map.set(obj, 'object');

      expect(map.toString()).to.equal('[object Map]');
      done();
    });

    it('valueOf', function (done) {
      var map = new edn.Map();
      var obj = {};

      map.set('foo', 'bar');
      map.set(42, 'life');
      map.set(obj, 'object');

      expect(map.valueOf()).to.equal(map);
      done();
    });

    it('freeze', function (done) {
      var map = new edn.Map();

      expect(Object.isFrozen(map)).to.be.false;

      map.set('foo', 'bar');
      expect(map.has('foo')).to.be.true;

      Object.freeze(map);
      expect(Object.isFrozen(map)).to.be.true;

      map.set(42, 'life');

      // Freeze seems to be busted
      expect(map.has(42)).to.be.true;

      done();
    });

    it('equality', function (done) {
      var m1 = new edn.Map();
      m1.set('foo', 1);
      m1.set('bar', 2);

      var m2 = new edn.Map();
      m2.set('bar', 2);
      m2.set('foo', 1);

      var m3 = new edn.Map();
      m3.set('foo', 1);

      expect(m1).to.equal(m1);
      expect(m1).to.not.equal(m2);
      expect(m1).to.not.equal(m3);

      expect(m1).to.equal(m1);
      expect(m1).to.deep.equal(m2);
      expect(m1).to.not.deep.equal(m3);

      m2.delete('bar');
      m3.set('bar', 2);

      expect(m1).to.not.deep.equal(m2);
      expect(m1).to.deep.equal(m3);
      done();
    });

  });

  describe('Set', function () {
    it('should match for function', function (done) {
      expect(edn.Set()).to.be.an.instanceof(edn.Set);
      done();
    });

    it('should match for constructor', function (done) {
      expect(new edn.Set()).to.be.an.instanceof(edn.Set);
      done();
    });

    it('add', function (done) {
      var set = new edn.Set();
      var obj = {};

      expect(set.add('foo')).to.equal('undefined');
      expect(set.add(42)).to.equal('undefined');
      expect(set.add(obj)).to.equal('undefined');
      done();
    });

    it('has', function (done) {
      var set = new edn.Set();
      var obj = {};

      set.add('foo');
      set.add(42);
      set.add(obj);

      expect(set.has('foo')).to.true;
      expect(set.has('bar')).to.false;
      expect(set.has(42)).to.true;
      expect(set.has('42')).to.false;
      expect(set.has(obj)).to.true;
      expect(set.has({})).to.false;
      done();
    });

    it('delete', function (done) {
      var set = new edn.Set();
      var obj = {};

      set.add('foo');
      set.add(42);
      set.add(obj);

      expect(set.delete('foo')).to.equal('undefined');
      expect(set.delete('foo')).to.equal('undefined');
      expect(set.delete(obj)).to.equal('undefined');

      expect(set.has('foo')).to.false;
      expect(set.has(42)).to.true;
      expect(set.has(obj)).to.false;
      done();
    });

    it('toString', function (done) {
      var set = new edn.Set();
      var obj = {};

      set.add('foo');
      set.add(42);
      set.add(obj);

      expect(set.toString()).to.equal('[object Set]');
      done();
    });

    it('valueOf', function (done) {
      var set = new edn.Set();
      var obj = {};

      set.add('foo');
      set.add(42);
      set.add(obj);

      expect(set.valueOf()).to.equal(set);
      done();
    });

    it('freeze', function (done) {
      var set = new edn.Set();

      expect(Object.isFrozen(set)).to.be.false;

      set.add('foo');
      expect(set.has('foo')).to.be.true;

      Object.freeze(set);
      expect(Object.isFrozen(set)).to.be.true;

      set.add(42);

      // Freeze seems to be busted
      expect(set.has(42)).to.be.true;

      done();
    });

    it('equality', function (done) {
      var s1 = new edn.Set();
      s1.add('foo');
      s1.add('bar');

      var s2 = new edn.Set();
      s2.add('bar');
      s2.add('foo');

      var s3 = new edn.Set();
      s3.add('foo');

      expect(s1).to.equal(s1);
      expect(s1).to.not.equal(s2);
      expect(s1).to.not.equal(s3);

      expect(s1).to.equal(s1);
      expect(s1).to.deep.equal(s2);
      expect(s1).to.not.deep.equal(s3);

      s2.delete('bar');
      s3.add('bar');

      expect(s1).to.not.deep.equal(s2);
      expect(s1).to.deep.equal(s3);
      done();
    });
  });

  describe('uuid', function () {
    it('should match for function', function (done) {
      expect(edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')).to.be.an.instanceof(edn.UUID);
      done();
    });

    it('should match for constructor', function (done) {
      expect(new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')).to.be.an.instanceof(edn.UUID);
      done();
    });

    it('length', function (done) {
      expect(new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6').length).to.equal(36);
      done();
    });

    it('valueOf', function (done) {
      var uuid = new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      expect(uuid.valueOf()).to.equal('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      expect(typeof uuid.toString()).to.equal('string');
      done();
    });

    it('toString', function (done) {
      var uuid = new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      expect(uuid.toString()).to.equal('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      expect(typeof uuid.toString()).to.equal('string');
      done();
    });

    it('equality', function (done) {
      var u1 = new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      var u2 = new edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      var u3 = new edn.UUID('550e8400-e29b-41d4-a716-446655440000');

      expect(u1).to.equal(u1);
      expect(u1).to.not.equal(u2);
      expect(u1).to.not.equal(u3);

      expect(u1).to.deep.equal(u1);
      expect(u1).to.deep.equal(u2);
      expect(u1).to.not.deep.equal(u3);

      done();
    });
  });

  describe('generic', function () {
    it('should match for function', function (done) {
      var p = new edn.Map();
      p.set(edn.Keyword('first'), 'Fred');
      p.set(edn.Keyword('last'), 'Mertz');

      var generic = edn.Generic(edn.Symbol('myapp/Person'), p);
      expect(generic).to.be.an.instanceof(edn.Generic);
      done();
    });

    it('should match for constructor', function (done) {
      var p = new edn.Map();
      p.set(edn.Keyword('first'), 'Fred');
      p.set(edn.Keyword('last'), 'Mertz');

      var generic = new edn.Generic(edn.Symbol('myapp/Person'), p);
      expect(generic).to.be.an.instanceof(edn.Generic);
      done();
    });

    it('tag symbol', function (done) {
      var generic = new edn.Generic(edn.Symbol('myapp/Person'), null);
      expect(generic.tag).to.equal(edn.Symbol('myapp/Person'));
      expect(edn.typeOf(generic.tag)).to.equal('symbol');
      done();
    });

    it('tag string', function (done) {
      var generic = new edn.Generic('myapp/Person', null);
      expect(generic.tag).to.equal(edn.Symbol('myapp/Person'));
      expect(edn.typeOf(generic.tag)).to.equal('symbol');
      done();
    });

    it('element', function (done) {
      var p = new edn.Map();
      p.set(edn.Keyword('first'), 'Fred');
      p.set(edn.Keyword('last'), 'Mertz');

      var generic = new edn.Generic(edn.Symbol('myapp/Person'), p);
      expect(generic.element).to.equal(p);
      done();
    });

    it('valueOf', function (done) {
      var p = new edn.Map();
      p.set(edn.Keyword('first'), 'Fred');
      p.set(edn.Keyword('last'), 'Mertz');

      var generic = new edn.Generic(edn.Symbol('myapp/Person'), p);
      expect(generic.valueOf()).to.equal(p);
      done();
    });

    it('toString', function (done) {
      var p = new edn.Map();
      p.set(edn.Keyword('first'), 'Fred');
      p.set(edn.Keyword('last'), 'Mertz');

      var generic = new edn.Generic(edn.Symbol('myapp/Person'), p);
      expect(generic.toString()).to.equal('[object Generic]');
      expect(typeof generic.toString()).to.equal('string');
      done();
    });

  });
});
