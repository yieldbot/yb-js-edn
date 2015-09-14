/*jshint expr: true*/
'use strict';

var edn = require('../edn'),
    expect = require('chai').expect;

describe('valueOf', function () {

  it('should handle nil', function (done) {
    expect(edn.valueOf(edn.parse('nil'))).to.be.null;
    done();
  });

  it('should handle booleans', function (done) {
    expect(edn.valueOf(edn.parse('true'))).to.be.true;
    expect(edn.valueOf(edn.parse('false'))).to.be.false;
    done();
  });

  it('should handle strings', function (done) {
    expect(edn.valueOf(edn.parse('"double quotes"'))).to.equal('double quotes');
    done();
  });

  it('should handle characters', function (done) {
    expect(edn.valueOf(edn.parse('\\c'))).to.equal('c');
    done();
  });

  it('should handle symbols', function (done) {
    expect(edn.valueOf(edn.parse('foo'))).to.equal('foo');
    done();
  });

  it('should handle keywords', function (done) {
    expect(edn.valueOf(edn.parse(':foo'))).to.equal('foo');
    done();
  });

  it('should handle integers', function (done) {
    expect(edn.valueOf(edn.parse('42'))).to.equal(42);
    done();
  });

  it('should handle floating point numbers', function (done) {
    expect(edn.valueOf(edn.parse('3.14'))).to.equal(3.14);
    done();
  });

  it('should handle lists', function (done) {
    expect(edn.valueOf(edn.parse('(a b 42)'))).to.deep.equal(['a', 'b', 42]);
    expect(edn.valueOf(edn.parse('(a b 42)'), false)).to.deep.equal([edn.Symbol('a'), edn.Symbol('b'), edn.integer(42)]);
    done();
  });

  it('should handle vectors', function (done) {
    expect(edn.valueOf(edn.parse('[a b 42]'))).to.deep.equal(['a', 'b', 42]);
    expect(edn.valueOf(edn.parse('[a b 42]'), false)).to.deep.equal([edn.Symbol('a'), edn.Symbol('b'), edn.integer(42)]);
    done();
  });

  it('should handle maps', function (done) {
    expect(edn.valueOf(edn.parse('{}'))).to.deep.equal({});
    expect(edn.valueOf(edn.parse('{:foo 1, :bar 2}'))).to.deep.equal({foo: 1, bar: 2});
    expect(edn.valueOf(edn.parse('{"foo" 1, "bar" 2}'))).to.deep.equal({foo: 1, bar: 2});
    expect(edn.valueOf(edn.parse('{1 2, 3 4}'))).to.deep.equal({1: 2, 3: 4});
    expect(edn.valueOf(edn.parse('{:foo :bar}'))).to.deep.equal({foo: 'bar'});
    expect(edn.valueOf(edn.parse('{:foo :bar}'), false)).to.deep.equal({foo: edn.keyword('bar')});

    var arrayMap = new edn.Map();
    arrayMap.set([1, 2, 3], 4);
    expect(edn.valueOf(arrayMap)).to.equal(arrayMap);
    done();
  });

  it('should handle sets', function (done) {
    // the nodeunit test uses == while chai uses ===
    expect(edn.valueOf(edn.parse('#{1 2 3}'))).to.deep.equal([1, 2, 3]);
    expect(edn.valueOf(edn.parse('#{\\a \\b \\c}'), false)).to.deep.equal([edn.Character('a'), edn.Character('b'), edn.Character('c')]);
    done();
  });

  it('should handle generic', function (done) {
    // the nodeunit test uses == while chai uses ===
    expect(edn.valueOf(edn.parse('#myapp/Person {:first "Fred", :last "Mertz"}'))).to.deep.equal({first: 'Fred', last: 'Mertz'});
    done();
  });

});
