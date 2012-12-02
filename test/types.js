"use strict";

var edn = require('../edn');

// Run test w/ harmony enabled
// $ node --harmony ./node_modules/.bin/nodeunit test/types.js

exports.character = {
  "function": function (test) {
    var c = edn.Character('c');
    test.ok(c instanceof edn.Character);
    test.done();
  },

  "constructor": function (test) {
    var c = new edn.Character('c');
    test.ok(c instanceof edn.Character);
    test.done();
  },

  "valueOf": function (test) {
    test.equal("c", edn.Character('c').valueOf());
    test.done();
  },

  "toString": function (test) {
    test.equal("c", edn.Character('c').toString());
    test.done();
  },

  "equality": function (test) {
    var c1 = edn.Character('c');
    var c2 = edn.Character('c');
    var c3 = edn.Character('d');
    var s4 = 'c';

    test.equal(c1, c1);
    test.equal(c1, c2);
    test.equal(c1, s4);
    test.notEqual(c1, c3);

    test.strictEqual(c1, c1);
    test.strictEqual(c1, c2);
    test.notStrictEqual(c1, s4);
    test.notStrictEqual(c1, c3);

    test.deepEqual(c1, c1);
    test.deepEqual(c1, c2);
    test.notDeepEqual(c1, s4);
    test.notDeepEqual(c1, c3);

    test.done();
  },

  "function value is frozen": function (test) {
    var c = edn.Character('c');
    test.ok(Object.isFrozen(c));
    test.done();
  },

  "constructor object is not frozen": function (test) {
    var c = new edn.Character('c');
    test.ok(!Object.isFrozen(c));
    test.done();
  }
};

exports.symbol = {
  "function with name": function (test) {
    var sym = edn.Symbol('foo');
    test.ok(sym instanceof edn.Symbol);
    test.equal(null, sym.namespace);
    test.equal('foo', sym.name);
    test.done();
  },

  "function with namespaced name": function (test) {
    var sym = edn.Symbol('my-namespace/foo');
    test.ok(sym instanceof edn.Symbol);
    test.equal('my-namespace', sym.namespace);
    test.equal('foo', sym.name);
    test.done();
  },

  "function with namespace and name": function (test) {
    var sym = edn.Symbol('my-namespace', 'foo');
    test.ok(sym instanceof edn.Symbol);
    test.equal('my-namespace', sym.namespace);
    test.equal('foo', sym.name);
    test.done();
  },

  "constructor with name": function (test) {
    var sym = new edn.Symbol('foo');
    test.ok(sym instanceof edn.Symbol);
    test.equal(null, sym.namespace);
    test.equal('foo', sym.name);
    test.done();
  },

  "constructor with namespaced name": function (test) {
    var sym = new edn.Symbol('my-namespace/foo');
    test.ok(sym instanceof edn.Symbol);
    test.equal('my-namespace', sym.namespace);
    test.equal('foo', sym.name);
    test.done();
  },

  "constructor with namespace and name": function (test) {
    var sym = new edn.Symbol('my-namespace', 'foo');
    test.ok(sym instanceof edn.Symbol);
    test.equal('my-namespace', sym.namespace);
    test.equal('foo', sym.name);
    test.done();
  },

  "constructor with / name": function (test) {
    var sym = new edn.Symbol('/');
    test.ok(sym instanceof edn.Symbol);
    test.equal(null, sym.namespace);
    test.equal('/', sym.name);
    test.done();
  },

  "valueOf": function (test) {
    test.equal("foo", edn.Symbol('foo').valueOf());
    test.equal("my-namespace/foo", edn.Symbol('my-namespace/foo').valueOf());
    test.equal("my-namespace/foo", edn.Symbol('my-namespace', 'foo').valueOf());
    test.equal('string', typeof edn.Symbol('foo').valueOf());
    test.done();
  },

  "toString": function (test) {
    test.equal("foo", edn.Symbol('foo').toString());
    test.equal(
      "my-namespace/foo",
      edn.Symbol('my-namespace/foo').toString()
    );
    test.equal(
      "my-namespace/foo",
      edn.Symbol('my-namespace', 'foo').toString());
    test.done();
  },

  "equality": function (test) {
    var s1 = edn.Symbol('foo');
    var s2 = edn.Symbol('foo');
    var s3 = edn.Symbol('bar');
    var s4 = 'foo';

    test.equal(s1, s1);
    test.equal(s1, s2);
    test.notEqual(s1, s3);
    test.equal(s1, s4);

    test.strictEqual(s1, s1);
    test.strictEqual(s1, s2);
    test.notStrictEqual(s1, s3);
    test.notStrictEqual(s1, s4);

    test.deepEqual(s1, s1);
    test.deepEqual(s1, s2);
    test.notDeepEqual(s1, s3);

    test.done();
  },

  "function value is frozen": function (test) {
    var s = edn.Symbol('foo');
    test.ok(Object.isFrozen(s));
    test.done();
  },

  "constructor object is not frozen": function (test) {
    var s = new edn.Symbol('foo');
    test.ok(!Object.isFrozen(s));
    test.done();
  }
};

exports.keyword = {
  "function with name": function (test) {
    var key = edn.Keyword('foo');
    test.ok(key instanceof edn.Keyword);
    test.equal(null, key.namespace);
    test.equal('foo', key.name);
    test.done();
  },

  "function with namespaced name": function (test) {
    var key = edn.Keyword('my-namespace/foo');
    test.ok(key instanceof edn.Keyword);
    test.equal('my-namespace', key.namespace);
    test.equal('foo', key.name);
    test.done();
  },

  "function with namespace and name": function (test) {
    var key = edn.Keyword('my-namespace', 'foo');
    test.ok(key instanceof edn.Keyword);
    test.equal('my-namespace', key.namespace);
    test.equal('foo', key.name);
    test.done();
  },

  "function with symbol": function (test) {
    var key = edn.Keyword(edn.Symbol('my-namespace', 'foo'));
    test.ok(key instanceof edn.Keyword);
    test.equal('my-namespace', key.namespace);
    test.equal('foo', key.name);
    test.done();
  },

  "constructor with name": function (test) {
    var key = new edn.Keyword('foo');
    test.ok(key instanceof edn.Keyword);
    test.equal(null, key.namespace);
    test.equal('foo', key.name);
    test.done();
  },

  "constructor with namespaced name": function (test) {
    var key = new edn.Keyword('my-namespace/foo');
    test.ok(key instanceof edn.Keyword);
    test.equal('my-namespace', key.namespace);
    test.equal('foo', key.name);
    test.done();
  },

  "constructor with namespace and name": function (test) {
    var key = new edn.Keyword('my-namespace', 'foo');
    test.ok(key instanceof edn.Keyword);
    test.equal('my-namespace', key.namespace);
    test.equal('foo', key.name);
    test.done();
  },

  "constructor with symbol": function (test) {
    var key = new edn.Keyword(edn.Symbol('my-namespace', 'foo'));
    test.ok(key instanceof edn.Keyword);
    test.equal('my-namespace', key.namespace);
    test.equal('foo', key.name);
    test.done();
  },

  "valueOf": function (test) {
    test.equal("foo", edn.Keyword('foo').valueOf());
    test.equal(
      "my-namespace/foo",
      edn.Keyword('my-namespace/foo').valueOf()
    );
    test.equal(
      "my-namespace/foo",
      edn.Keyword('my-namespace', 'foo').valueOf()
    );
    test.done();
  },

  "toString": function (test) {
    test.equal(":foo", edn.Keyword('foo').toString());
    test.equal(
      ":my-namespace/foo",
      edn.Keyword('my-namespace/foo').toString()
    );
    test.equal(
      ":my-namespace/foo",
      edn.Keyword('my-namespace', 'foo').toString()
    );
    test.done();
  },

  "equality": function (test) {
    var k1 = edn.Keyword('foo');
    var k2 = edn.Keyword('foo');
    var k3 = edn.Keyword('bar');
    var s4 = edn.Symbol('foo');

    test.equal(k1, k1);
    test.equal(k1, k2);
    test.notEqual(k1, k3);
    test.notEqual(k1, s4);

    test.strictEqual(k1, k1);
    test.strictEqual(k1, k2);
    test.notStrictEqual(k1, k3);
    test.notStrictEqual(k1, s4);

    test.deepEqual(k1, k1);
    test.deepEqual(k1, k2);
    test.notDeepEqual(k1, k3);
    test.notDeepEqual(k1, s4);

    test.done();
  },

  "function value is frozen": function (test) {
    var k = edn.Keyword('foo');
    test.ok(Object.isFrozen(k));
    test.done();
  },

  "constructor object is not frozen": function (test) {
    var k = new edn.Keyword('foo');
    test.ok(!Object.isFrozen(k));
    test.done();
  }
};

exports.map = {
  "function": function (test) {
    var map = edn.Map();
    test.ok(map instanceof edn.Map);
    test.done();
  },

  "constructor": function (test) {
    var map = new edn.Map();
    test.ok(map instanceof edn.Map);
    test.done();
  },

  "set": function (test) {
    var map = new edn.Map();
    var obj = {};

    test.equal("bar", map.set("foo", "bar"));
    test.equal("life", map.set(42, "life"));
    test.equal("object", map.set(obj, "object"));

    test.done();
  },

  "get": function (test) {
    var map = new edn.Map();
    var obj = {};

    map.set("foo", "bar");
    map.set(42, "life");
    map.set(obj, "object");

    test.equal("bar", map.get("foo"));
    test.equal("life", map.get(42));
    test.equal("object", map.get(obj));
    test.equal(undefined, map.get("missing"));

    test.done();
  },

  "has": function (test) {
    var map = new edn.Map();
    var obj = {};

    map.set("foo", "bar");
    map.set(42, "life");
    map.set(obj, "object");

    test.equal(true, map.has("foo"));
    test.equal(false, map.has("bar"));
    test.equal(true, map.has(42));
    test.equal(false, map.has("42"));
    test.equal(true, map.has(obj));
    test.equal(false, map.has({}));

    test.done();
  },

  "delete": function (test) {
    var map = new edn.Map();
    var obj = {};

    map.set("foo", "bar");
    map.set(42, "life");
    map.set(obj, "object");

    test.equal(true, map.delete("foo"));
    test.equal(false, map.delete("foo"));
    test.equal(true, map.delete(obj));

    test.equal(false, map.has("foo"));
    test.equal(true, map.has(42));
    test.equal(false, map.has(obj));

    test.done();
  },

  "toString": function (test) {
    var map = new edn.Map();
    var obj = {};

    map.set("foo", "bar");
    map.set(42, "life");
    map.set(obj, "object");

    test.equal("[object Map]", map.toString());

    test.done();
  },

  "valueOf": function (test) {
    var map = new edn.Map();
    var obj = {};

    map.set("foo", "bar");
    map.set(42, "life");
    map.set(obj, "object");

    test.equal(map, map.valueOf());

    test.done();
  },

  "freeze": function (test) {
    var map = new edn.Map();

    test.equal(false, Object.isFrozen(map));
    map.set("foo", "bar");
    test.ok(map.has("foo"));

    Object.freeze(map);

    test.equal(true, Object.isFrozen(map));
    map.set(42, "life");
    // Freeze seems to be busted
    test.ok(map.has(42));

    test.done();
  },

  "equality": function (test) {
    var m1 = new edn.Map();
    m1.set('foo', 1);
    m1.set('bar', 2);

    var m2 = new edn.Map();
    m2.set('bar', 2);
    m2.set('foo', 1);

    var m3 = new edn.Map();
    m3.set('foo', 1);

    test.equal(m1, m1);
    test.notEqual(m1, m2);
    test.notEqual(m1, m3);

    test.deepEqual(m1, m1);
    test.deepEqual(m1, m2);
    test.notDeepEqual(m1, m3);

    m2.delete('bar');
    m3.set('bar', 2);

    test.notDeepEqual(m1, m2);
    test.deepEqual(m1, m3);

    test.done();
  }
};

exports.set = {
  "function": function (test) {
    var set = edn.Set();
    test.ok(set instanceof edn.Set);
    test.done();
  },

  "constructor": function (test) {
    var set = new edn.Set();
    test.ok(set instanceof edn.Set);
    test.done();
  },

  "add": function (test) {
    var set = new edn.Set();
    var obj = {};

    test.equal('undefined', set.add("foo"));
    test.equal('undefined', set.add(42));
    test.equal('undefined', set.add(obj));

    test.done();
  },

  "has": function (test) {
    var set = new edn.Set();
    var obj = {};

    set.add("foo");
    set.add(42);
    set.add(obj);

    test.equal(true, set.has("foo"));
    test.equal(false, set.has("bar"));
    test.equal(true, set.has(42));
    test.equal(false, set.has("42"));
    test.equal(true, set.has(obj));
    test.equal(false, set.has({}));

    test.done();
  },

  "delete": function (test) {
    var set = new edn.Set();
    var obj = {};

    set.add("foo");
    set.add(42);
    set.add(obj);

    test.equal('undefined', set.delete("foo"));
    test.equal('undefined', set.delete("foo"));
    test.equal('undefined', set.delete(obj));

    test.equal(false, set.has("foo"));
    test.equal(true, set.has(42));
    test.equal(false, set.has(obj));

    test.done();
  },

  "toString": function (test) {
    var set = new edn.Set();
    var obj = {};

    set.add("foo");
    set.add(42);
    set.add(obj);

    test.equal("[object Set]", set.toString());

    test.done();
  },

  "valueOf": function (test) {
    var set = new edn.Set();
    var obj = {};

    set.add("foo");
    set.add(42);
    set.add(obj);

    test.equal(set, set.valueOf());

    test.done();
  },

  "freeze": function (test) {
    var set = new edn.Set();

    test.equal(false, Object.isFrozen(set));
    set.add("foo");
    test.ok(set.has("foo"));

    Object.freeze(set);

    test.equal(true, Object.isFrozen(set));
    set.add(42);
    // Freeze seems to be busted
    test.ok(set.has(42));

    test.done();
  },

  "equality": function (test) {
    var s1 = new edn.Set();
    s1.add('foo');
    s1.add('bar');

    var s2 = new edn.Set();
    s2.add('bar');
    s2.add('foo');

    var s3 = new edn.Set();
    s3.add('foo');

    test.equal(s1, s1);
    test.notEqual(s1, s2);
    test.notEqual(s1, s3);

    test.deepEqual(s1, s1);
    test.deepEqual(s1, s2);
    test.notDeepEqual(s1, s3);

    s2.delete('bar');
    s3.add('bar');

    test.notDeepEqual(s1, s2);
    test.deepEqual(s1, s3);

    test.done();
  }
};

exports.uuid = {
  "function": function (test) {
    var uuid = edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    test.ok(uuid instanceof edn.UUID);
    test.done();
  },

  "constructor": function (test) {
    var uuid = new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    test.ok(uuid instanceof edn.UUID);
    test.done();
  },

  "length": function (test) {
    var uuid = new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    test.equal(36, uuid.length);
    test.done();
  },

  "valueOf": function (test) {
    var uuid = new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    test.equal("f81d4fae-7dec-11d0-a765-00a0c91e6bf6", uuid.valueOf());
    test.equal('string', typeof uuid.toString());
    test.done();
  },

  "toString": function (test) {
    var uuid = new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    test.equal("f81d4fae-7dec-11d0-a765-00a0c91e6bf6", uuid.toString());
    test.equal('string', typeof uuid.toString());
    test.done();
  },

  "equality": function (test) {
    var u1 = new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    var u2 = new edn.UUID("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    var u3 = new edn.UUID("550e8400-e29b-41d4-a716-446655440000");

    test.equal(u1, u1);
    test.notEqual(u1, u2);
    test.notEqual(u1, u3);

    test.deepEqual(u1, u1);
    test.deepEqual(u1, u2);
    test.notDeepEqual(u1, u3);

    test.done();
  }
};

exports.generic = {
  "function": function (test) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), "Fred");
    p.set(edn.Keyword('last'), "Mertz");

    var generic = edn.Generic(edn.Symbol('myapp/Person'), p);
    test.ok(generic instanceof edn.Generic);
    test.done();
  },

  "constructor": function (test) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), "Fred");
    p.set(edn.Keyword('last'), "Mertz");

    var generic = new edn.Generic(edn.Symbol('myapp/Person'), p);
    test.ok(generic instanceof edn.Generic);
    test.done();
  },

  "tag symbol": function (test) {
    var generic = new edn.Generic(edn.Symbol('myapp/Person'), null);
    test.equal(edn.Symbol('myapp/Person'), generic.tag);
    test.equal('symbol', edn.typeOf(generic.tag));
    test.done();
  },

  "tag string": function (test) {
    var generic = new edn.Generic('myapp/Person', null);
    test.equal(edn.Symbol('myapp/Person'), generic.tag);
    test.equal('symbol', edn.typeOf(generic.tag));
    test.done();
  },

  "element": function (test) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), "Fred");
    p.set(edn.Keyword('last'), "Mertz");

    var generic = new edn.Generic(edn.Symbol('myapp/Person'), p);
    test.equal(p, generic.element);
    test.done();
  },

  "valueOf": function (test) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), "Fred");
    p.set(edn.Keyword('last'), "Mertz");

    var generic = new edn.Generic(edn.Symbol('myapp/Person'), p);
    test.equal(p, generic.valueOf());
    test.done();
  },

  "toString": function (test) {
    var p = new edn.Map();
    p.set(edn.Keyword('first'), "Fred");
    p.set(edn.Keyword('last'), "Mertz");

    var generic = new edn.Generic(edn.Symbol('myapp/Person'), p);
    test.equal("[object Generic]", generic.toString());
    test.equal('string', typeof generic.toString());
    test.done();
  }
};
