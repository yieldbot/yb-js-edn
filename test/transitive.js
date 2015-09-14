/*jshint expr: true*/

'use strict';

var edn = require('../edn'),
    expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;

var filename = __dirname + '/transitive.clj';
var data = fs.readFileSync(filename, 'utf8');

var tests = data.split('\n');
tests = tests.slice(0, tests.length - 1);

function which(command, callback) {
  exec('which ' + command, function (err, stdout) {
    callback(stdout.length ? stdout.trim() : null);
  });
}

describe('convert', function () {

  it('should clojure', function (done) {
    var expected = tests;

    var prog = '(require [\'clojure.string :as \'str])' +
        '(println (str/join "\n" ' +
        '(map (fn [l] (pr-str (read-string l))) ' +
        '(str/split-lines (slurp "' + filename + '")))))';

    which('clj', function (path) {
      if (!path) {
        console.log('Skipping transitive - clojure test');
        done();
        return;
      }

      exec(path + ' --eval ' + JSON.stringify(prog), function (error, actual) {
        expect(error).to.not.exist;
        actual = actual.split('\n');

        var i;
        for (i = 0; i < expected.length; i++) {
          expect(actual[i]).to.equal(expected[i]);
        }

        done();
      });
    });
  });

  it('should js', function (done) {
    var expected = tests;

    var i, obj;
    for (i = 0; i < expected.length; i++) {
      obj = edn.parse(expected[i]);
      expect(edn.stringify(obj)).to.equal(expected[i]);
    }

    done();
  });
});

