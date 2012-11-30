/*global parser:true */
"use strict";

if (typeof exports !== 'undefined') {
  var edn = exports;
} else {
  var edn = window.edn = {};
}


// Public: Parse edn String.
//
// str - edn String
//
// Returns a value.
edn.parse = function (str) {
  return parser.parse(str);
};

// Public: Registered printer functions.
//
// Maps key type names to a stringify function.
//
// Examples
//
//     edn.types['myapp/Person'] = function (person) {
//       return '#myapp/Person {:name "'+person.name'"}';
//     }
//
edn.printers = {};

// Public: Convert Object to edn String.
//
// obj - Object
//
// Returns edn String.
edn.stringify = function (obj) {
  if (obj && obj.toEDN) {
    return obj.toEDN();
  }
  obj = edn.convert(obj);

  var type = edn.typeOf(obj);
  if (type) {
    var printer = edn.printers[type];
    if (printer) {
      return edn.printers[type](obj);
    } else {
      throw new Error("No printer function for type " + type);
    }
  } else {
    throw new Error("No printer function for object " + obj);
  }
};

// Public: Deep compare edn values.
//
// In general, two values will be equal if they serialize to the same
// edn string. With the expection of maps and sets which may serialize
// in a different order but are still collections of the same values.
//
// a - An edn value
// b - Another edn value
//
// Returns true if values are equal, otherwise false.
edn.isEqual = function isEqual(a, b) {
  a = edn.convert(a);
  b = edn.convert(b);

  var aType = edn.typeOf(a);
  var bType = edn.typeOf(b);

  if (aType !== bType) {
    return false;

  } else if (a === b) {
    return true;

  } else {
    switch (aType) {
    case 'nil':
      return bType == 'nil';
    case 'boolean':
    case 'string':
    case 'float':
    case 'integer':
      return a.valueOf() == b.valueOf();
    default:
      var aKeys = Object.keys(a);
      var bKeys = Object.keys(b);

      if (aKeys.length != bKeys.length) {
        return false;
      }

      return aKeys.every(function (k) {
        return isEqual(a[k], b[k]);
      });
    }
  }
};

// Internal: Registered object converter functions.
//
// Maps key type names to a function that returns an
// edn built-in object.
//
// Examples
//
//     edn.types['myapp/Person'] = function (person) {
//       return edn.Unknown('myapp/Person', {name: person.name});
//     }
//
edn.converters = {};

edn.convert = function (obj) {
  if (obj && obj.asEDN) {
    return obj.asEDN();
  } else {
    var type = edn.typeOf(obj);
    if (type) {
      var f = edn.converters[type];
      return f ? f(obj) : obj;
    } else {
      throw new Error("No converter function for object " + obj);
    }
  }
};

// Public: Registered type checking functions.
//
// Maps key type names to type checking function.
//
// Examples
//
//     edn.types['myapp/Person'] = function (obj) {
//       return obj instanceof Person;
//     }
//
edn.types = {};

// Internal: Get object type String.
//
// Used internally for looking up printers and tag converters.
//
// obj   - Object to detect type of
// types - Type checker functions (default: edn.types)
//
// Returns type String or null;
edn.typeOf = function (obj, types) {
  types = extend({}, edn.types, types || {});
  var matchedTypes = [];

  for (var type in types) {
    if (types[type](obj)) {
      matchedTypes.push(type);
    }
  }

  if (matchedTypes.length == 1) {
    return matchedTypes[0];
  } else if (matchedTypes.length > 1) {
    throw new Error(
      "Conflicted types " + matchedTypes.join(', ') + " for object " + obj);
  } else {
    return null;
  }
};

// Make Object#toString available
var toString = Object.prototype.toString;

// Internal: Copy object properties onto target object.
//
// target - Target Object
// obj1   - Object to copy from
// obj2   - Another Object to copy from
//
// Returns target Object.
function extend(target, obj1, obj2) {
  var k;
  for (k in obj1) {
    target[k] = obj1[k];
  }
  for (k in obj2) {
    target[k] = obj2[k];
  }
  return target;
}


// Built-in Elements
//

// nil
//
// nil represents nil, null or nothing. It should be read as an object
// with similar meaning on the target platform.
(function () {
  // Public: Register typeof check for undefined or null.
  //
  // obj - Any value
  //
  // Returns true if object is undefined or null, otherwise false.
  edn.types.nil = function (obj) {
    return obj === void 0 || obj === null;
  };

  // Public: Stringify nil.
  //
  // Returns String.
  edn.printers.nil = function () {
    return "nil";
  };
})();

// Booleans
//
// true and false should be mapped to booleans.
//
// If a platform has canonic values for true and false, it is a
// further semantic of booleans that all instances of true yield that
// (identical) value, and similarly for false.
(function () {
  // Public: Register typeof check for boolean.
  //
  // obj - Any value
  //
  // Returns true if object is a boolean, otherwise false.
  edn.types.boolean = function (obj) {
    return toString.call(obj) === '[object Boolean]';
  };

  // Public: Stringify boolean.
  //
  // Returns String.
  edn.printers.boolean = function (bool) {
    return bool.valueOf() ? "true" : "false";
  };
})();

// Strings
//
// Strings are enclosed in "double quotes". May span multiple lines.
// Standard C/Java escape characters \t \r \n are supported.
(function () {
  // Public: Register typeof check for string.
  //
  // obj - Any value
  //
  // Returns true if object is a string, otherwise false.
  edn.types.string = function (obj) {
    return toString.call(obj) === '[object String]';
  };

  // Public: Stringify string.
  //
  // Returns String.
  edn.printers.string = function (str) {
    return JSON.stringify(str);
  };
})();

// Characters
//
// Characters are preceded by a backslash: \c. \newline, \return,
// \space and \tab yield the corresponding characters. Backslash
// cannot be followed by whitespace.
edn.Character = (function () {
  var pool = {};

  // Public: Create a new Character object.
  //
  // Calling the Character function returns an interned Character. The
  // constructor always returns a new object. The function call is the
  // prefered api.
  function Character(c) {
    // If called as function, try to pull an existing interned character
    // from the pool
    if (!(this instanceof Character)) {
      var char = pool[c];

      if (!char) {
        char = new Character(c);
        Object.freeze(char);
        pool[c] = char;
      }

      return char;
    }

    // Internal: Returns the String character.
    this.char = c;
  }

  // Public: Get the primitive string value.
  //
  // Returns String.
  Character.prototype.valueOf = function () {
    return this.char;
  };

  // Public: String representation of the Character.
  //
  // Returns String.
  Character.prototype.toString = function () {
    return this.char;
  };

  // Public: Register typeof check for Character.
  //
  // obj - Any value
  //
  // Returns true if object is a Character, otherwise false.
  edn.types.character = function (obj) {
    return obj instanceof Character;
  };

  // Public: Stringify Character object.
  //
  // char - Character object
  //
  // Returns String.
  edn.printers.character = function (char) {
    char = char.valueOf();

    switch (char) {
    case "\n":
      return "\\newline";
    case "\r":
      return "\\return";
    case " ":
      return "\\space";
    case "\t":
      return "\\tab";
    default:
      return "\\" + char[0];
    }
  };

  // Public: Alias for Character function.
  edn.character = Character;

  // Expose Character to parser
  parser.yy.Character = Character;

  return Character;
})();

// Symbols
//
// Symbols are used to represent identifiers, and should map to
// something other than strings, if possible.
//
// Symbols begin with a non-numeric character and can contain
// alphanumeric characters and . * + ! - _ ? $ % & =. If -, + or . are
// the first character, the second character must be non-numeric.
// Additionally, : # are allowed as constituent characters in symbols
// other than as the first character.
//
// / has special meaning in symbols. It can be used once only in the
// middle of a symbol to separate the prefix (often a namespace) from
// the name, e.g. my-namespace/foo. / by itself is a legal symbol, but
// otherwise neither the prefix nor the name part can be empty when
// the symbol contains /.
//
// If a symbol has a prefix and /, the following name component should
// follow the first-character restrictions for symbols as a whole.
// This is to avoid ambiguity in reading contexts where prefixes might
// be presumed as implicitly included namespaces and elided
// thereafter.
edn.Symbol = (function () {
  var pool = {};

  // Public: Create a new Symbol object.
  //
  // Calling the Symbol function returns an interned Symbol. The
  // constructor always returns a new object. The function call is the
  // prefered api.
  //
  // nsname - String with "/" seperating the name and namespace
  //
  // or
  //
  // namespace - String namespace
  // name      - String name
  function Symbol(namespace, name) {
    // If called as function, try to pull an existing interned symbol
    // from the pool
    if (!(this instanceof Symbol)) {
      var nsname = joinNamespace(namespace, name);
      var sym = pool[nsname];

      if (!sym) {
        sym = new Symbol(namespace, name);
        // Interned symbols are immutable
        Object.freeze(sym);
        pool[sym.valueOf()] = sym;
      }

      return sym;
    }

    var parts = splitNamespacedName(namespace, name);

    // Public: Returns the String namespace.
    this.namespace = parts[0];

    // Public: Returns the String name.
    this.name = parts[1];
  }

  // Internal: Return seperated namespace and name.
  //
  // nsname - String with "/" seperating the name and namespace
  //
  // or
  //
  // namespace - String namespace
  // name      - String name
  //
  // Returns Array pair with {0:namespace, 1:name}.
  function splitNamespacedName(namespace, name) {
    if (namespace && name) {
      return [namespace, name];
    } else {
      var parts = namespace.split('/', 2);
      if (namespace == '/') {
        return [null, '/'];
      } else if (parts.length == 2) {
        return parts;
      } else {
        return [null, parts[0]];
      }
    }
  }

  // Internal: Join namespace and name.
  //
  // nsname - String with "/" seperating the name and namespace
  //
  // or
  //
  // namespace - String namespace
  // name      - String name
  //
  // Returns joined String.
  function joinNamespace(namespace, name) {
    if (namespace && name) {
      return [namespace, name].join('/');
    } else {
      return namespace;
    }
  }

  // Public: Get the primitive string value.
  //
  // Returns String.
  Symbol.prototype.valueOf = function () {
    if (this.namespace) {
      return [this.namespace, this.name].join('/');
    } else {
      return this.name;
    }
  };

  // Public: String representation of the Symbol.
  //
  // Returns String.
  Symbol.prototype.toString = function () {
    return this.valueOf();
  };

  // Public: Register typeof check for Symbol.
  //
  // obj - Any value
  //
  // Returns true if object is a Symbol, otherwise false.
  edn.types.symbol = function (obj) {
    return obj instanceof Symbol;
  };

  // Public: Stringify Symbol object.
  //
  // symbol - Symbol object
  //
  // Returns String.
  edn.printers.symbol = function (symbol) {
    return symbol.toString();
  };

  // Public: Alias for Symbol function.
  edn.symbol = Symbol;

  // Expose Symbol to parser
  parser.yy.Symbol = Symbol;

  return Symbol;
})();

// Keywords
//
// Keywords are identifiers that typically designate themselves. They
// are semantically akin to enumeration values. Keywords follow the
// rules of symbols, except they can (and must) begin with a colon,
// e.g. :fred or :my/fred. If the target platform does not have a
// keyword type distinct from a symbol type, the same type can be used
// without conflict, since the mandatory leading : of keywords is
// disallowed for symbols.
//
// If the target platform supports some notion of interning, it is a
// further semantic of keywords that all instances of the same keyword
// yield the identical object.
edn.Keyword = (function () {
  var pool = {};

  // Public: Create a new Keyword object.
  //
  // Calling the Keyword function returns an interned Keyword. The
  // constructor always returns a new object. The function call is the
  // prefered api.
  //
  // nsname - String with "/" seperating the name and namespace
  //
  // or
  //
  // namespace - String namespace
  // name      - String name
  //
  // or
  //
  // symbol - edn.Symbol
  function Keyword(namespace, name) {
    // Get internal symbol for keyword nsname
    var sym;
    if (namespace instanceof edn.Symbol) {
      sym = namespace;
    } else {
      sym = edn.Symbol(namespace, name);
    }

    // If called as function, try to pull an existing interned keyword
    // from the pool
    if (!(this instanceof Keyword)) {
      var key = pool[sym.valueOf()];

      if (!key) {
        key = new Keyword(namespace, name);
        // Interned keywords are immutable
        Object.freeze(key);
        pool[sym.valueOf()] = key;
      }

      return key;
    }

    // Internal: Returns internal Symbol.
    this.symbol = sym;

    // Public: Returns the String namespace.
    this.namespace = sym.namespace;

    // Public: Returns the String name.
    this.name = sym.name;
  }

  // Public: Get the primitive string value.
  //
  // Returns String.
  Keyword.prototype.valueOf = function () {
    return this.symbol.valueOf();
  };

  // Public: String representation of the Keyword.
  //
  // Returns String.
  Keyword.prototype.toString = function () {
    return ":" + this.symbol.toString();
  };

  // Public: Register typeof check for Keyword.
  //
  // obj - Any value
  //
  // Returns true if object is a Keyword, otherwise false.
  edn.types.keyword = function (obj) {
    return obj instanceof Keyword;
  };

  // Public: Stringify Keyword object.
  //
  // keyword - Keyword object
  //
  // Returns String.
  edn.printers.keyword = function (keyword) {
    return keyword.toString();
  };

  // Public: Alias for Keyword function.
  edn.keyword = Keyword;

  // Expose Keyword to parser
  parser.yy.Keyword = Keyword;

  return Keyword;
})();

// Integers
//
// Integers consist of the digits 0 - 9, optionally prefixed by - to
// indicate a negative number, or (redundantly) by +. An integer can
// have the suffix N to indicate that arbitrary precision is desired.
// -0 is a valid integer not distinct from 0.
(function () {
  // Public: Register typeof check for Integer.
  //
  // obj - Any value
  //
  // Returns true if object is a Integer, otherwise false.
  edn.types.integer = function (obj) {
    return (toString.call(obj) === '[object Number]') &&
      Math.floor(obj) == obj;
  };

  // Public: Stringify Integer object.
  //
  // n - Number object
  //
  // Returns String.
  edn.printers.integer = function (n) {
    return n.toString();
  };
})();

// Floating point numbers
//
// 64-bit (double) precision is expected.
//
// In addition, a floating-point number may have the suffix M to
// indicate that exact precision is desired.
(function () {
  // Public: Register typeof check for Float.
  //
  // obj - Any value
  //
  // Returns true if object is a Float, otherwise false.
  edn.types.float = function (obj) {
    return (toString.call(obj) === '[object Number]') &&
      Math.floor(obj) != obj;
  };

  // Public: Stringify Float object.
  //
  // n - Number object
  //
  // Returns String.
  edn.printers.float = function (n) {
    var s = n.toString();
    if (!/\./.test(s)) s += ".0";
    return s;
  };
})();

// Lists
//
// A list is a sequence of values. Lists are represented by zero or
// more elements enclosed in parentheses (). Note that lists can be
// heterogeneous.
//
// (a b 42)
(function () {
  // Public: Tag Array as a List type.
  //
  // ary - Array
  //
  // Returns new List Array.
  edn.list = function (ary) {
    ary = ary.slice(0);
    ary.type = 'list';
    return ary;
  };

  // Expose List to parser
  parser.yy.List = edn.list;

  // Public: Register typeof check for List.
  //
  // obj - Any value
  //
  // Returns true if object is a List, otherwise false.
  edn.types.list = function (obj) {
    return toString.call(obj) === '[object Array]' &&
      obj.type === 'list';
  };

  // Public: Stringify Array/List object.
  //
  // ary - Array object
  //
  // Returns String.
  edn.printers.list = function (ary) {
    return '(' + ary.map(edn.stringify).join(' ') + ')';
  };
})();

// Vectors
//
// A vector is a sequence of values that supports random access.
// Vectors are represented by zero or more elements enclosed in square
// brackets []. Note that vectors can be heterogeneous.
//
// [a b 42]
(function () {
  // Public: Tag Array as a Vector type.
  //
  // ary - Array
  //
  // Returns new Vector Array.
  edn.vector = function (ary) {
    ary = ary.slice(0);
    ary.type = 'vector';
    return ary;
  };

  // Expose Vector to parser
  parser.yy.Vector = edn.vector;

  // Public: Register typeof check for Vector.
  //
  // obj - Any value
  //
  // Returns true if object is a Vector, otherwise false.
  edn.types.vector = function (obj) {
    return toString.call(obj) === '[object Array]' &&
      obj.type === 'vector';
  };

  // Public: Stringify Vector object.
  //
  // ary - Array object
  //
  // Returns String.
  edn.printers.vector = function (ary) {
    return '[' + ary.map(edn.stringify).join(' ') + ']';
  };

  // Public: Register typeof check for Array.
  //
  // obj - Any value
  //
  // Returns true if object is a Array, otherwise false.
  edn.types.array = function (obj) {
    return toString.call(obj) === '[object Array]' &&
      typeof obj.type == 'undefined';
  };

  // Public: Stringify Array object.
  //
  // ary - Array object
  //
  // Returns String.
  edn.printers.array = function (ary) {
    return '[' + ary.map(edn.stringify).join(' ') + ']';
  };
})();

// Maps
//
// A map is a collection of associations between keys and values. Maps
// are represented by zero or more key and value pairs enclosed in
// curly braces {}. Each key should appear at most once. No semantics
// should be associated with the order in which the pairs appear.
//
// {:a 1, "foo" :bar, [1 2 3] four}
//
// Note that keys and values can be elements of any type. The use of
// commas above is optional, as they are parsed as whitespace.
if (false && typeof Map !== 'undefined') {
  edn.Map = Map;
} else {
  // Backport Harmony Map
  // http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets
  //
  // Though, its disabled until Map supports iteration. Yeah, wtf.
  // Guess we'll need to wait till we have Harmony iterators.
  edn.Map = (function () {
    // Public: Create a new Map object.
    function Map() {
      if (!(this instanceof Map)) {
        return new Map();
      }

      // Internal: Returns Array of keys.
      // API not finalized. May change in a minor release.
      Object.defineProperty(this, 'keys', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });

      // Internal: Returns Array of values.
      // API not finalized. May change in a minor release.
      Object.defineProperty(this, 'values', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });

      // Internal: Returns Array of [key, value] pairs.
      // API not finalized. May change in a minor release.
      Object.defineProperty(this, 'items', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });

      // Internal: Hack to expose and enumerable property to play
      // nice with node's deepEqual function. Maybe some day it will
      // eventually support comparing Maps.
      Object.defineProperty(this, '_map', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: {}
      });
    }

    // Internal: Check if two objects are egal.
    //
    // http://wiki.ecmascript.org/doku.php?id=harmony:egal
    //
    // Returns true or false.
    var objectIs;
    if (Object.is) {
      objectIs = Object.is;
    } else {
      objectIs = function (x, y) {
        if (x === y) {
          if (x === 0) {
            return 1 / x === 1 / y;
          } else {
            return true;
          }
        }
        return x !== x && y !== y;
      };
    }

    // Internal: Find index of value in Array.
    //
    // Similar to Array.prototype.indexOf, but uses Object.is.
    //
    // http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets
    //
    // keys - Array of keys to search.
    // key  - Object key to search for.
    //
    // Return Number index of value in Array. Otherwise returns -1 key
    // is not keys Array.
    function indexOfIdentical(keys, key) {
      for (var i = 0, length = keys.length; i < length; i++) {
        if (objectIs(keys[i], key)) {
          return i;
        }
      }
      return -1;
    }

    // Public: Find associated value for key in the map.
    //
    // key - Object
    //
    // Returns the value associated to the key. Or "undefined" if
    // there is none.
    Map.prototype.get = function (key) {
      var index = indexOfIdentical(this.keys, key);
      return index < 0 ? 'undefined' : this.values[index];
    };

    // Public: Check if key is associated to a value in the map.
    //
    // key - Object
    //
    // Returns true if value has been associated to the key in the
    // map. Otherwise returns false.
    Map.prototype.has = function (key) {
      return indexOfIdentical(this.keys, key) >= 0;
    };

    // Public: Associated the value for a key in the map.
    //
    // key   - Object
    // value - Object
    //
    // Returns the value argument.
    Map.prototype.set = function (key, value) {
      var keys = this.keys;
      var values = this.values;
      var items = this.items;
      var _map = this._map;
      var index = indexOfIdentical(keys, key);
      if (index < 0) index = keys.length;
      keys[index] = key;
      values[index] = value;
      items[index] = [key, value];
      _map[edn.stringify(key)] = value;
      return value;
    };

    // Public: Removes the key and value from the map.
    //
    // key - Object
    //
    // Returns true if key was removed. Returns false if key did not
    // exist in map.
    Map.prototype['delete'] = function (key) {
      var keys = this.keys;
      var values = this.values;
      var items = this.items;
      var _map = this._map;
      var index = indexOfIdentical(keys, key);
      if (index < 0) return false;
      keys.splice(index, 1);
      values.splice(index, 1);
      items.splice(index, 1);
      delete _map[edn.stringify(key)];
      return true;
    };

    // Public: String representation of the Map.
    //
    // Returns String.
    Map.prototype.toString = function () {
      return '[object Map]';
    };

    // Internal: Node.js console.log inspect printer.
    //
    // Returns String.
    Map.prototype.inspect = function () {
      return require('util').inspect(this.items);
    };

    return Map;
  })();
}

(function () {
  // Public: Convert flat Array of key and values to Map.
  //
  // values - Array of [k1, v1, k2, v2, ...]
  //
  // Returns new Map.
  edn.map = function (values) {
    var map = new edn.Map();
    for (var i = 0; i < values.length; i += 2) {
      map.set(values[i], values[i + 1]);
    }
    return map;
  };

  // Expose Map to parser
  parser.yy.Map = edn.map;

  // Public: Register typeof check for Map.
  //
  // obj - Any value
  //
  // Returns true if object is a Map, otherwise false.
  edn.types.map = function (obj) {
    return obj instanceof edn.Map;
  };

  // Public: Stringify Map object.
  //
  // map - Map object
  //
  // Returns String.
  edn.printers.map = function (map) {
    var m = map.items.map(function (item) {
      return edn.stringify(item[0]) + " " + edn.stringify(item[1]);
    });
    return "{" + m.join(", ") + "}";
  };

  // Public: Register type of check for plain Object.
  //
  // obj - Any value
  //
  // Returns true if object is a direct prototype of Object,
  // otherwise false.
  edn.types.object = function (obj) {
    return obj && (typeof obj === 'object') &&
      (Object.getPrototypeOf(obj) === Object.prototype);
  };

  // Public: Stringify Object.
  //
  // obj - Object
  //
  // Returns String.
  edn.printers.object = function (obj) {
    var m = Object.keys(obj).map(function (key) {
      return edn.stringify(edn.keyword(key)) + " " +
        edn.stringify(obj[key]);
    });
    return "{" + m.join(", ") + "}";
  };
})();

// Sets
//
// A set is a collection of unique values. Sets are represented by
// zero or more elements enclosed in curly braces preceded by # #{}.
// No semantics should be associated with the order in which the
// elements appear. Note that sets can be heterogeneous.
//
//   #{a b [1 2 3]}
//
if (false && typeof Set !== 'undefined') {
  edn.Set = Set;
} else {
  // Backport Harmony Set
  // http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets
  //
  // Disabled until Set supports iteration
  edn.Set = (function () {
    // Public: Create a new Set object.
    function Set() {
      if (!(this instanceof Set)) {
        return new Set();
      }

      // Internal: Hack to expose and enumerable property to play
      // nice with node's deepEqual function. Maybe some day it will
      // eventually support comparing Sets and Maps.
      Object.defineProperty(this, '_map', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: new edn.Map()
      });

      // Internal: Returns Array of values.
      // API not finalized. May change in a minor release.
      Object.defineProperty(this, 'values', {
        configurable: false,
        enumerable: false,
        get: function () { return this._map.keys; }
      });
    }

    // Public: Check if value is in set.
    //
    // value - Object
    //
    // Returns true if value exists in the set. Otherwise returns
    // false.
    Set.prototype.has = function (value) {
      return this._map.has(value);
    };

    // Public: Add the value to the set.
    //
    // value - Object
    //
    // Returns 'undefined';
    Set.prototype.add = function (value) {
      this._map.set(value, true);
      return 'undefined';
    };

    // Public: Removes the value from the set.
    //
    // value - Object
    //
    // Returns 'undefined';
    Set.prototype['delete'] = function (value) {
      this._map['delete'](value);
      return 'undefined';
    };

    // Public: String representation of the Set.
    //
    // Returns String.
    Set.prototype.toString = function () {
      return '[object Set]';
    };

    // Internal: Node.js console.log inspect printer.
    //
    // Returns String.
    Set.prototype.inspect = function () {
      return require('util').inspect(this.values);
    };

    return Set;
  })();
}

(function () {
  // Public: Convert Array to Set.
  //
  // values - Array of values
  //
  // Returns new Set.
  edn.set = function (values) {
    var set = new edn.Set();
    if (values) {
      values.forEach(function (v) {
        set.add(v);
      });
    }
    return set;
  };

  // Expose Set to parser
  parser.yy.Set = edn.set;

  // Public: Register typeof check for Set.
  //
  // obj - Any value
  //
  // Returns true if object is a Set, otherwise false.
  edn.types.set = function (obj) {
    return obj instanceof edn.Set;
  };

  // Public: Stringify Set object.
  //
  // set - Set object
  //
  // Returns String.
  edn.printers.set = function (set) {
    return "#{" + set.values.map(edn.stringify).join(" ") + "}";
  };
})();


// Tagged Elements
//

// edn supports extensibility through a simple mechanism. # followed
// immediately by a symbol starting with an alphabetic character
// indicates that that symbol is a tag. A tag indicates the semantic
// interpretation of the following element. It is envisioned that a
// reader implementation will allow clients to register handlers for
// specific tags. Upon encountering a tag, the reader will first read
// the next element, then pass the result to the corresponding handler
// for further interpretation, and the result of the handler will be
// the data value yielded by the tag + tagged element, i.e. reading a
// tag and tagged element yields one value. This value is the value to
// be returned to the program and is not further interpreted as edn
// data by the reader.
edn.tags = {};

// Public: Dispatch tag and tagged element.
//
// If a handler is registered for the tag, it will be invoked with the
// element returning a new value.
//
// Otherwise, the default handler will be invoked which will return an
// Unknown object wrapper. If `edn.tags.default` is set to null, an
// error will be throw instead.
//
// Returns a value or raises an error if theres no tag handler.
edn.dispatchTag = function (tag, element) {
  var f = edn.tags[tag];
  if (f) {
    return f(element);
  } else if (edn.tags.default) {
    return edn.tags.default(tag, element);
  } else {
    throw new Error("No reader function for tag " + tag);
  }
};

// Expose tag to parser
parser.yy.Tag = edn.dispatchTag;

edn.Unknown = (function () {
  // Public: Create a new Unknown object.
  //
  // tag     - Symbol tag
  // element - Any value
  function Unknown(tag, element) {
    if (!(this instanceof Unknown)) {
      return new Unknown(tag, element);
    }

    if (!(tag instanceof edn.Symbol)) {
      tag = edn.Symbol(tag);
    }

    // Public: Returns the Symbol tag
    this.tag = tag;

    // Public: Returns the element value
    this.element = element;

    Object.freeze(this);
  }

  // Public: Get primitive string value.
  //
  // Returns String.
  Unknown.prototype.valueOf = function () {
    return this.element;
  };

  // Public: String representation of the UUID.
  //
  // Returns String.
  Unknown.prototype.toString = function () {
    return '[object Unknown]';
  };

  // Public: Register typeof check for Unknown.
  //
  // obj - Any value
  //
  // Returns true if object is a Unknown, otherwise false.
  edn.types.unknown = function (obj) {
    return obj instanceof Unknown;
  };

  // Public: Stringify Unknown object.
  //
  // obj - Unknown object
  //
  // Returns String.
  edn.printers.unknown = function (obj) {
    return "#" + obj.tag + " " + edn.stringify(obj.element);
  };

  // Public: Register default handler for unknown tags.
  //
  // tag     - Symbol tag
  // element - Any value
  edn.tags.default = Unknown;

  return Unknown;
})();


// Built-in Tagged Elements
//

// Date built-in tagged element
//
// #inst "rfc-3339-format"
// #inst "1985-04-12T23:20:50.52Z"
//
// An instant in time. The tagged element is a string in RFC-3339 format.
(function () {
  // Public: Convert 'inst' tag to Date object.
  //
  // str - ISO Date String
  //
  // Returns Date object.
  edn.tags.inst = function (str) {
    return new Date(Date.parse(str));
  };

  // Public: Register typeof check for Date.
  //
  // obj - Any value
  //
  // Returns true if object is a Date, otherwise false.
  edn.types.inst = function (obj) {
    return obj instanceof Date;
  };

  // Public: Convert Date to and EDN value.
  //
  // date - Date object
  //
  // Returns an Unknown object.
  edn.converters.inst = function (date) {
    return edn.Unknown('inst', date.toISOString());
  };
})();

// UUID built-in tagged element
//
// #uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
//
// A UUID. The tagged element is a canonical UUID string representation.
edn.UUID = (function () {
  // Public: Create a new UUID object.
  //
  // value - String value.
  function UUID(value) {
    if (!(this instanceof UUID)) {
      return new UUID(value);
    }

    // Internal: Returns the String value.
    this.value = value;

    // Public: Returns the Number length of the value String.
    Object.defineProperty(this, 'length', {
      enumerable: false,
      value: value.length
    });

    Object.freeze(this);
  }

  // Public: Get primitive string value.
  //
  // Returns String.
  UUID.prototype.valueOf = function () {
    return this.value;
  };

  // Public: String representation of the UUID.
  //
  // Returns String.
  UUID.prototype.toString = function () {
    return this.value;
  };

  // Public: Convert 'uuid' tag to UUID object.
  //
  // str - String
  //
  // Returns UUID object.
  edn.tags.uuid = function (str) {
    return new UUID(str);
  };

  // Public: Register typeof check for UUID.
  //
  // obj - Any value
  //
  // Returns true if object is a UUID, otherwise false.
  edn.types.uuid = function (obj) {
    return obj instanceof UUID;
  };

  // Public: Convert UUID to and EDN value.
  //
  // uuid - UUID object
  //
  // Returns an Unknown object.
  edn.converters.uuid = function (uuid) {
    return edn.Unknown('uuid', uuid.value);
  };

  // Public: Alias for UUID function.
  edn.uuid = UUID;

  return UUID;
})();
