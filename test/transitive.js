"use strict";

var edn  = require('../edn');
var fs   = require('fs');
var exec = require('child_process').exec;

var filename = __dirname + "/transitive.clj";
var data = fs.readFileSync(filename, 'utf8');

var tests;
tests = data.split("\n");
tests = tests.slice(0, tests.length - 1);

function which(command, callback) {
  exec('which ' + command, function (err, stdout) {
    callback(stdout.length ? stdout.trim() : null);
  });
}

exports.transitive = {
  "clojure": function (test) {
    var expected = tests;

    var prog = "(require ['clojure.string :as 'str])" +
      '(println (str/join "\n" ' +
        '(map (fn [l] (pr-str (read-string l))) ' +
        '(str/split-lines (slurp "' + filename + '")))))';

    which('clj', function (path) {
      if (!path) {
        console.warn("Skipping transitive - clojure test");
        test.done();
        return;
      }

      exec(path + ' --eval ' + JSON.stringify(prog), function (error, actual) {
        test.ifError(error);
        actual = actual.split("\n");

        var i;
        for (i = 0; i < expected.length; i++) {
          test.equal(expected[i], actual[i]);
        }

        test.done();
      });
    });
  },

  "js": function (test) {
    var expected = tests;

    var i, obj;
    for (i = 0; i < expected.length; i++) {
      obj = edn.parse(expected[i]);
      test.equal(expected[i], edn.stringify(obj));
    }

    test.done();
  }
};
