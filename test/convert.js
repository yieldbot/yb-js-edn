/*jshint expr: true*/

'use strict';

var edn = require('../edn'),
    expect = require('chai').expect;

describe('convert', function () {
  it('should convert a string to itself', function (done) {
    expect(edn.convert('hello')).to.equal('hello');
    done();
  });

  it('should convert UUIDs', function (done) {
    expect(edn.convert(edn.UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'))).to.deep
        .equal(edn.generic('uuid', 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'));
    done();
  });

  it('should convert Dates', function (done) {
    expect(edn.convert(new Date(Date.parse('1985-04-12T23:20:50.52Z')))).to.deep
        .equal(edn.generic('inst', '1985-04-12T23:20:50.520Z'));
    done();
  });

  it('should convert a Person object', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last = last;
    }

    var p = new Person('Fred', 'Mertz');

    expect(function () {
      edn.convert(p);
    }).to.throw(Error);

    Person.prototype.asEDN = function () {
      return edn.generic(
          'myapp/Person',
          {first: this.first, last: this.last}
      );
    };

    expect(edn.convert(p)).to.deep.equal(edn.generic('myapp/Person', {first: 'Fred', last: 'Mertz'}));
    done();
  });

  it('should convert an object', function (done) {
    function Person(first, last) {
      this.first = first;
      this.last = last;
    }

    var p = new Person('Fred', 'Mertz');

    function isPerson(obj) {
      return obj instanceof Person;
    }

    function convertPerson(p) {
      return edn.generic(
          'myapp/Person',
          {first: p.first, last: p.last}
      );
    }

    expect(function () {
      edn.convert(p);
    }).to.throw(Error);

    expect(edn.convert(p, {
      types: {'myapp/Person': isPerson},
      converters: {'myapp/Person': convertPerson}
    }))
        .to.deep.equal(edn.generic('myapp/Person', {first: 'Fred', last: 'Mertz'}));
    done();

  });

});
