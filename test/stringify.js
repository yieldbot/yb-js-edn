/*jshint expr: true*/

'use strict';

var edn = require('../edn'),
    expect = require('chai').expect;

describe('stringify', function () {
  it('should handle undefined', function (done) {
    expect(edn.stringify(undefined)).to.equal('nil');
    done();
  });

  it('should handle null', function (done) {
    expect(edn.stringify(null)).to.equal('nil');
    done();
  });

  it('should handle true', function (done) {
    expect(edn.stringify(true)).to.equal('true');
    done();
  });

  it('should handle false', function (done) {
    expect(edn.stringify(false)).to.equal('false');
    done();
  });

  it('should handle string', function (done) {
    expect(edn.stringify('hello')).to.equal('"hello"');
    done();
  });

  it('should handle Object(true)', function (done) {
    expect(edn.stringify(new Object(true))).to.equal('true');
    done();
  });

  it('should handle Object(false)', function (done) {
    expect(edn.stringify(new Object(false))).to.equal('false');
    done();
  });

  it('should handle Object(string)', function (done) {
    expect(edn.stringify(new Object('hello'))).to.equal('"hello"');
    done();
  });

  it('should handle Object(number)', function (done) {
    expect(edn.stringify(new Object(42))).to.equal('42');
    expect(edn.stringify(new Object(3.14))).to.equal('3.14');
    done();
  });

  it('should handle array', function (done) {
    expect(edn.stringify([1, 2, 3])).to.equal('[1 2 3]');
    done();
  });

  it('should handle object', function (done) {
    expect(edn.stringify({foo: 1, bar: 2})).to.equal('{:foo 1, :bar 2}');
    done();
  });

  it('should handle characters', function (done) {
    expect(edn.stringify(edn.Character('c'))).to.equal('\\c');
    expect(edn.stringify(edn.Character('\n'))).to.equal('\\newline');
    expect(edn.stringify(edn.Character('\r'))).to.equal('\\return');
    expect(edn.stringify(edn.Character(' '))).to.equal('\\space');
    expect(edn.stringify(edn.Character('\t'))).to.equal('\\tab');
    done();
  });

  it('should handle symbols', function (done) {
    expect(edn.stringify(edn.Symbol('foo'))).to.equal('foo');
    expect(edn.stringify(edn.Symbol('my-namespace/foo'))).to.equal('my-namespace/foo');
    done();
  });

  it('should handle keywords', function (done) {
    expect(edn.stringify(edn.keyword('fred'))).to.equal(':fred');
    expect(edn.stringify(edn.keyword('my/fred'))).to.equal(':my/fred');
    done();
  });

  it('should handle lists', function (done) {
    expect(edn.stringify(edn.list([edn.symbol('a'), edn.symbol('b'), 42]))).to.equal('(a b 42)');
    done();
  });

  it('should handle vectors', function (done) {
    expect(edn.stringify(edn.vector([edn.symbol('a'), edn.symbol('b'), 42]))).to.equal('[a b 42]');
    done();
  });

  it('should handle maps', function (done) {
    var map = new edn.Map();
    map.set('foo', 1);
    map.set('bar', 2);
    expect(edn.stringify(map)).to.equal('{"foo" 1, "bar" 2}');
    map = edn.map([
      edn.keyword('a'), 1,
      'foo', edn.keyword('bar'),
      edn.vector([1, 2, 3]),
      edn.symbol('four')
    ]);
    expect(edn.stringify(map)).to.equal('{:a 1, "foo" :bar, [1 2 3] four}');
    done();
  });

  it('should handle sets', function (done) {
    var set = new edn.Set();
    set.add('a');
    set.add('b');
    set.add([1, 2, 3]);
    expect(edn.stringify(set)).to.equal('#{"a" "b" [1 2 3]}');
    set = edn.set([
      edn.symbol('a'),
      edn.symbol('b'),
      edn.vector([1, 2, 3])
    ]);
    expect(edn.stringify(set)).to.equal('#{a b [1 2 3]}');
    done();
  });

  it('should handle generic', function (done) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), 'Fred');
    p.set(edn.Keyword('last'), 'Mertz');
    expect(edn.stringify(p)).to.equal('{:first "Fred", :last "Mertz"}');
    p = edn.generic(edn.Symbol('myapp/Person'), p);
    expect(edn.stringify(p)).to.equal('#myapp/Person {:first "Fred", :last "Mertz"}');
    done();
  });

  it('should handle inst', function (done) {
    expect(edn.stringify(new Date(Date.parse('1985-04-12T23:20:50.52Z')))).to.equal('#inst "1985-04-12T23:20:50.520Z"');
    done();
  });

  it('should handle uuid', function (done) {
    expect(edn.stringify(edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'))).to.equal('#uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"');
    done();
  });

  it('should handle person toEDN', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    Person.prototype.toEDN = function () {
      return [
        '#myapp/Person',
        edn.stringify({first: this.first, last: this.last})
      ].join(' ');
    };

    var p = new Person('Fred', 'Mertz');
    expect(edn.stringify(p)).to.equal('#myapp/Person {:first "Fred", :last "Mertz"}');
    done();
  });

  it('should handle person asEDN', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    Person.prototype.asEDN = function () {
      return edn.generic('myapp/Person', {first: this.first, last: this.last});
    };

    var p = new Person('Fred', 'Mertz');
    expect(edn.stringify(p)).to.equal('#myapp/Person {:first "Fred", :last "Mertz"}');
    done();
  });

  it('should handle person printer', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
    }
    function isPerson(obj) {
      return obj instanceof Person;
    }
    function printPerson(p) {
      return [
        '#myapp/Person',
        edn.stringify({first: p.first, last: p.last})
      ].join(' ');
    }

    var p = new Person('Fred', 'Mertz');
    expect(edn.stringify(p, {
      types: { 'myapp/Person': isPerson },
      printers: { 'myapp/Person': printPerson }
    })).to.equal('#myapp/Person {:first "Fred", :last "Mertz"}');
    done();
  });

  it('should handle person converter', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last  = last;
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

    var p = new Person('Fred', 'Mertz');
    expect(edn.stringify(p, {
      types: { 'myapp/Person': isPerson },
      converters: { 'myapp/Person': convertPerson }
    })).to.equal('#myapp/Person {:first "Fred", :last "Mertz"}');
    done();
  });

});
