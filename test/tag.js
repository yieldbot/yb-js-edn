/*jshint expr: true*/

'use strict';

var edn = require('../edn'),
    expect = require('chai').expect;

describe('dispatchTag', function () {

  it('should handle inst', function (done) {
    expect(edn.dispatchTag('inst', '1985-04-12T23:20:50.52Z')).to.deep.equal(new Date(Date.parse('1985-04-12T23:20:50.52Z')));
    done();
  });

  it('should handle uuid', function (done) {
    expect(edn.dispatchTag('uuid', 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6')).to.deep.equal(edn.uuid('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'));
    done();
  });

  it('should handle person', function (done) {
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
    attrs.set(edn.keyword('first'), 'Fred');
    attrs.set(edn.keyword('last'), 'Mertz');

    expect(edn.dispatchTag('myapp/Person', attrs, { tags: { 'myapp/Person': toPerson } } )).to.deep.equal(new Person('Fred', 'Mertz'));
    done();
  });

  it('should handle generic', function (done) {
    expect(edn.dispatchTag('myapp/Person', 'Bob')).to.deep.equal(edn.generic('myapp/Person', 'Bob'));
    done();
  });

  it('should throw', function (done) {
    expect(function () {
      edn.dispatchTag('myapp/Person', 'Bob', {
        tags: { default: null }
      });}).to.throw(Error);
    done();
  });

});
