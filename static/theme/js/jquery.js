/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
  // A central reference to the root jQuery(document)
  rootjQuery,

  // The deferred used on DOM ready
  readyList,

  // Support: IE9
  // For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
  core_strundefined = typeof undefined,

  // Use the correct document accordingly with window argument (sandbox)
  location = window.location,
  document = window.document,
  docElem = document.documentElement,

  // Map over jQuery in case of overwrite
  _jQuery = window.jQuery,

  // Map over the $ in case of overwrite
  _$ = window.$,

  // [[Class]] -> type pairs
  class2type = {},

  // List of deleted data cache ids, so we can reuse them
  core_deletedIds = [],

  core_version = "2.0.3",

  // Save a reference to some core methods
  core_concat = core_deletedIds.concat,
  core_push = core_deletedIds.push,
  core_slice = core_deletedIds.slice,
  core_indexOf = core_deletedIds.indexOf,
  core_toString = class2type.toString,
  core_hasOwn = class2type.hasOwnProperty,
  core_trim = core_version.trim,

  // Define a local copy of jQuery
  jQuery = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    return new jQuery.fn.init( selector, context, rootjQuery );
  },

  // Used for matching numbers
  core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

  // Used for splitting on whitespace
  core_rnotwhite = /\S+/g,

  // A simple way to check for HTML strings
  // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
  // Strict HTML recognition (#11290: must start with <)
  rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

  // Match a standalone tag
  rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

  // Matches dashed string for camelizing
  rmsPrefix = /^-ms-/,
  rdashAlpha = /-([\da-z])/gi,

  // Used by jQuery.camelCase as callback to replace()
  fcamelCase = function( all, letter ) {
    return letter.toUpperCase();
  },

  // The ready event handler and self cleanup method
  completed = function() {
    document.removeEventListener( "DOMContentLoaded", completed, false );
    window.removeEventListener( "load", completed, false );
    jQuery.ready();
  };

jQuery.fn = jQuery.prototype = {
  // The current version of jQuery being used
  jquery: core_version,

  constructor: jQuery,
  init: function( selector, context, rootjQuery ) {
    var match, elem;

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if ( !selector ) {
      return this;
    }

    // Handle HTML strings
    if ( typeof selector === "string" ) {
      if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
        // Assume that strings that start and end with <> are HTML and skip the regex check
        match = [ null, selector, null ];

      } else {
        match = rquickExpr.exec( selector );
      }

      // Match html or make sure no context is specified for #id
      if ( match && (match[1] || !context) ) {

        // HANDLE: $(html) -> $(array)
        if ( match[1] ) {
          context = context instanceof jQuery ? context[0] : context;

          // scripts is true for back-compat
          jQuery.merge( this, jQuery.parseHTML(
            match[1],
            context && context.nodeType ? context.ownerDocument || context : document,
            true
          ) );

          // HANDLE: $(html, props)
          if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
            for ( match in context ) {
              // Properties of context are called as methods if possible
              if ( jQuery.isFunction( this[ match ] ) ) {
                this[ match ]( context[ match ] );

              // ...and otherwise set as attributes
              } else {
                this.attr( match, context[ match ] );
              }
            }
          }

          return this;

        // HANDLE: $(#id)
        } else {
          elem = document.getElementById( match[2] );

          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Inject the element directly into the jQuery object
            this.length = 1;
            this[0] = elem;
          }

          this.context = document;
          this.selector = selector;
          return this;
        }

      // HANDLE: $(expr, $(...))
      } else if ( !context || context.jquery ) {
        return ( context || rootjQuery ).find( selector );

      // HANDLE: $(expr, context)
      // (which is just equivalent to: $(context).find(expr)
      } else {
        return this.constructor( context ).find( selector );
      }

    // HANDLE: $(DOMElement)
    } else if ( selector.nodeType ) {
      this.context = this[0] = selector;
      this.length = 1;
      return this;

    // HANDLE: $(function)
    // Shortcut for document ready
    } else if ( jQuery.isFunction( selector ) ) {
      return rootjQuery.ready( selector );
    }

    if ( selector.selector !== undefined ) {
      this.selector = selector.selector;
      this.context = selector.context;
    }

    return jQuery.makeArray( selector, this );
  },

  // Start with an empty selector
  selector: "",

  // The default length of a jQuery object is 0
  length: 0,

  toArray: function() {
    return core_slice.call( this );
  },

  // Get the Nth element in the matched element set OR
  // Get the whole matched element set as a clean array
  get: function( num ) {
    return num == null ?

      // Return a 'clean' array
      this.toArray() :

      // Return just the object
      ( num < 0 ? this[ this.length + num ] : this[ num ] );
  },

  // Take an array of elements and push it onto the stack
  // (returning the new matched element set)
  pushStack: function( elems ) {

    // Build a new jQuery matched element set
    var ret = jQuery.merge( this.constructor(), elems );

    // Add the old object onto the stack (as a reference)
    ret.prevObject = this;
    ret.context = this.context;

    // Return the newly-formed element set
    return ret;
  },

  // Execute a callback for every element in the matched set.
  // (You can seed the arguments with an array of args, but this is
  // only used internally.)
  each: function( callback, args ) {
    return jQuery.each( this, callback, args );
  },

  ready: function( fn ) {
    // Add the callback
    jQuery.ready.promise().done( fn );

    return this;
  },

  slice: function() {
    return this.pushStack( core_slice.apply( this, arguments ) );
  },

  first: function() {
    return this.eq( 0 );
  },

  last: function() {
    return this.eq( -1 );
  },

  eq: function( i ) {
    var len = this.length,
      j = +i + ( i < 0 ? len : 0 );
    return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
  },

  map: function( callback ) {
    return this.pushStack( jQuery.map(this, function( elem, i ) {
      return callback.call( elem, i, elem );
    }));
  },

  end: function() {
    return this.prevObject || this.constructor(null);
  },

  // For internal use only.
  // Behaves like an Array's method, not like a jQuery method.
  push: core_push,
  sort: [].sort,
  splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];

          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

jQuery.extend({
  // Unique for each copy of jQuery on the page
  expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

  noConflict: function( deep ) {
    if ( window.$ === jQuery ) {
      window.$ = _$;
    }

    if ( deep && window.jQuery === jQuery ) {
      window.jQuery = _jQuery;
    }

    return jQuery;
  },

  // Is the DOM ready to be used? Set to true once it occurs.
  isReady: false,

  // A counter to track how many items to wait for before
  // the ready event fires. See #6781
  readyWait: 1,

  // Hold (or release) the ready event
  holdReady: function( hold ) {
    if ( hold ) {
      jQuery.readyWait++;
    } else {
      jQuery.ready( true );
    }
  },

  // Handle when the DOM is ready
  ready: function( wait ) {

    // Abort if there are pending holds or we're already ready
    if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
      return;
    }

    // Remember that the DOM is ready
    jQuery.isReady = true;

    // If a normal DOM Ready event fired, decrement, and wait if need be
    if ( wait !== true && --jQuery.readyWait > 0 ) {
      return;
    }

    // If there are functions bound, to execute
    readyList.resolveWith( document, [ jQuery ] );

    // Trigger any bound ready events
    if ( jQuery.fn.trigger ) {
      jQuery( document ).trigger("ready").off("ready");
    }
  },

  // See test/unit/core.js for details concerning isFunction.
  // Since version 1.3, DOM methods and functions like alert
  // aren't supported. They return false on IE (#2968).
  isFunction: function( obj ) {
    return jQuery.type(obj) === "function";
  },

  isArray: Array.isArray,

  isWindow: function( obj ) {
    return obj != null && obj === obj.window;
  },

  isNumeric: function( obj ) {
    return !isNaN( parseFloat(obj) ) && isFinite( obj );
  },

  type: function( obj ) {
    if ( obj == null ) {
      return String( obj );
    }
    // Support: Safari <= 5.1 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ?
      class2type[ core_toString.call(obj) ] || "object" :
      typeof obj;
  },

  isPlainObject: function( obj ) {
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
      return false;
    }

    // Support: Firefox <20
    // The try/catch suppresses exceptions thrown when attempting to access
    // the "constructor" property of certain host objects, ie. |window.location|
    // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
    try {
      if ( obj.constructor &&
          !core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
        return false;
      }
    } catch ( e ) {
      return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
  },

  isEmptyObject: function( obj ) {
    var name;
    for ( name in obj ) {
      return false;
    }
    return true;
  },

  error: function( msg ) {
    throw new Error( msg );
  },

  // data: string of html
  // context (optional): If specified, the fragment will be created in this context, defaults to document
  // keepScripts (optional): If true, will include scripts passed in the html string
  parseHTML: function( data, context, keepScripts ) {
    if ( !data || typeof data !== "string" ) {
      return null;
    }
    if ( typeof context === "boolean" ) {
      keepScripts = context;
      context = false;
    }
    context = context || document;

    var parsed = rsingleTag.exec( data ),
      scripts = !keepScripts && [];

    // Single tag
    if ( parsed ) {
      return [ context.createElement( parsed[1] ) ];
    }

    parsed = jQuery.buildFragment( [ data ], context, scripts );

    if ( scripts ) {
      jQuery( scripts ).remove();
    }

    return jQuery.merge( [], parsed.childNodes );
  },

  parseJSON: JSON.parse,

  // Cross-browser xml parsing
  parseXML: function( data ) {
    var xml, tmp;
    if ( !data || typeof data !== "string" ) {
      return null;
    }

    // Support: IE9
    try {
      tmp = new DOMParser();
      xml = tmp.parseFromString( data , "text/xml" );
    } catch ( e ) {
      xml = undefined;
    }

    if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
      jQuery.error( "Invalid XML: " + data );
    }
    return xml;
  },

  noop: function() {},

  // Evaluates a script in a global context
  globalEval: function( code ) {
    var script,
        indirect = eval;

    code = jQuery.trim( code );

    if ( code ) {
      // If the code includes a valid, prologue position
      // strict mode pragma, execute code by injecting a
      // script tag into the document.
      if ( code.indexOf("use strict") === 1 ) {
        script = document.createElement("script");
        script.text = code;
        document.head.appendChild( script ).parentNode.removeChild( script );
      } else {
      // Otherwise, avoid the DOM node creation, insertion
      // and removal by using an indirect global eval
        indirect( code );
      }
    }
  },

  // Convert dashed to camelCase; used by the css and data modules
  // Microsoft forgot to hump their vendor prefix (#9572)
  camelCase: function( string ) {
    return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
  },

  nodeName: function( elem, name ) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
  },

  // args is for internal usage only
  each: function( obj, callback, args ) {
    var value,
      i = 0,
      length = obj.length,
      isArray = isArraylike( obj );

    if ( args ) {
      if ( isArray ) {
        for ( ; i < length; i++ ) {
          value = callback.apply( obj[ i ], args );

          if ( value === false ) {
            break;
          }
        }
      } else {
        for ( i in obj ) {
          value = callback.apply( obj[ i ], args );

          if ( value === false ) {
            break;
          }
        }
      }

    // A special, fast, case for the most common use of each
    } else {
      if ( isArray ) {
        for ( ; i < length; i++ ) {
          value = callback.call( obj[ i ], i, obj[ i ] );

          if ( value === false ) {
            break;
          }
        }
      } else {
        for ( i in obj ) {
          value = callback.call( obj[ i ], i, obj[ i ] );

          if ( value === false ) {
            break;
          }
        }
      }
    }

    return obj;
  },

  trim: function( text ) {
    return text == null ? "" : core_trim.call( text );
  },

  // results is for internal usage only
  makeArray: function( arr, results ) {
    var ret = results || [];

    if ( arr != null ) {
      if ( isArraylike( Object(arr) ) ) {
        jQuery.merge( ret,
          typeof arr === "string" ?
          [ arr ] : arr
        );
      } else {
        core_push.call( ret, arr );
      }
    }

    return ret;
  },

  inArray: function( elem, arr, i ) {
    return arr == null ? -1 : core_indexOf.call( arr, elem, i );
  },

  merge: function( first, second ) {
    var l = second.length,
      i = first.length,
      j = 0;

    if ( typeof l === "number" ) {
      for ( ; j < l; j++ ) {
        first[ i++ ] = second[ j ];
      }
    } else {
      while ( second[j] !== undefined ) {
        first[ i++ ] = second[ j++ ];
      }
    }

    first.length = i;

    return first;
  },

  grep: function( elems, callback, inv ) {
    var retVal,
      ret = [],
      i = 0,
      length = elems.length;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( ; i < length; i++ ) {
      retVal = !!callback( elems[ i ], i );
      if ( inv !== retVal ) {
        ret.push( elems[ i ] );
      }
    }

    return ret;
  },

  // arg is for internal usage only
  map: function( elems, callback, arg ) {
    var value,
      i = 0,
      length = elems.length,
      isArray = isArraylike( elems ),
      ret = [];

    // Go through the array, translating each of the items to their
    if ( isArray ) {
      for ( ; i < length; i++ ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }

    // Go through every key on the object,
    } else {
      for ( i in elems ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }
    }

    // Flatten any nested arrays
    return core_concat.apply( [], ret );
  },

  // A global GUID counter for objects
  guid: 1,

  // Bind a function to a context, optionally partially applying any
  // arguments.
  proxy: function( fn, context ) {
    var tmp, args, proxy;

    if ( typeof context === "string" ) {
      tmp = fn[ context ];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !jQuery.isFunction( fn ) ) {
      return undefined;
    }

    // Simulated bind
    args = core_slice.call( arguments, 2 );
    proxy = function() {
      return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
    };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    return proxy;
  },

  // Multifunctional method to get and set values of a collection
  // The value/s can optionally be executed if it's a function
  access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
    var i = 0,
      length = elems.length,
      bulk = key == null;

    // Sets many values
    if ( jQuery.type( key ) === "object" ) {
      chainable = true;
      for ( i in key ) {
        jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
      }

    // Sets one value
    } else if ( value !== undefined ) {
      chainable = true;

      if ( !jQuery.isFunction( value ) ) {
        raw = true;
      }

      if ( bulk ) {
        // Bulk operations run against the entire set
        if ( raw ) {
          fn.call( elems, value );
          fn = null;

        // ...except when executing function values
        } else {
          bulk = fn;
          fn = function( elem, key, value ) {
            return bulk.call( jQuery( elem ), value );
          };
        }
      }

      if ( fn ) {
        for ( ; i < length; i++ ) {
          fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
        }
      }
    }

    return chainable ?
      elems :

      // Gets
      bulk ?
        fn.call( elems ) :
        length ? fn( elems[0], key ) : emptyGet;
  },

  now: Date.now,

  // A method for quickly swapping in/out CSS properties to get correct calculations.
  // Note: this method belongs to the css module but it's needed here for the support module.
  // If support gets modularized, this method should be moved back to the css module.
  swap: function( elem, options, callback, args ) {
    var ret, name,
      old = {};

    // Remember the old values, and insert the new ones
    for ( name in options ) {
      old[ name ] = elem.style[ name ];
      elem.style[ name ] = options[ name ];
    }

    ret = callback.apply( elem, args || [] );

    // Revert the old values
    for ( name in options ) {
      elem.style[ name ] = old[ name ];
    }

    return ret;
  }
});

jQuery.ready.promise = function( obj ) {
  if ( !readyList ) {

    readyList = jQuery.Deferred();

    // Catch cases where $(document).ready() is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if ( document.readyState === "complete" ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      setTimeout( jQuery.ready );

    } else {

      // Use the handy event callback
      document.addEventListener( "DOMContentLoaded", completed, false );

      // A fallback to window.onload, that will always work
      window.addEventListener( "load", completed, false );
    }
  }
  return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
  class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
  var length = obj.length,
    type = jQuery.type( obj );

  if ( jQuery.isWindow( obj ) ) {
    return false;
  }

  if ( obj.nodeType === 1 && length ) {
    return true;
  }

  return type === "array" || type !== "function" &&
    ( length === 0 ||
    typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
  support,
  cachedruns,
  Expr,
  getText,
  isXML,
  compile,
  outermostContext,
  sortInput,

  // Local document vars
  setDocument,
  document,
  docElem,
  documentIsHTML,
  rbuggyQSA,
  rbuggyMatches,
  matches,
  contains,

  // Instance-specific data
  expando = "sizzle" + -(new Date()),
  preferredDoc = window.document,
  dirruns = 0,
  done = 0,
  classCache = createCache(),
  tokenCache = createCache(),
  compilerCache = createCache(),
  hasDuplicate = false,
  sortOrder = function( a, b ) {
    if ( a === b ) {
      hasDuplicate = true;
      return 0;
    }
    return 0;
  },

  // General-purpose constants
  strundefined = typeof undefined,
  MAX_NEGATIVE = 1 << 31,

  // Instance methods
  hasOwn = ({}).hasOwnProperty,
  arr = [],
  pop = arr.pop,
  push_native = arr.push,
  push = arr.push,
  slice = arr.slice,
  // Use a stripped-down indexOf if we can't use a native one
  indexOf = arr.indexOf || function( elem ) {
    var i = 0,
      len = this.length;
    for ( ; i < len; i++ ) {
      if ( this[i] === elem ) {
        return i;
      }
    }
    return -1;
  },

  booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

  // Regular expressions

  // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
  whitespace = "[\\x20\\t\\r\\n\\f]",
  // http://www.w3.org/TR/css3-syntax/#characters
  characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

  // Loosely modeled on CSS identifier characters
  // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
  // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  identifier = characterEncoding.replace( "w", "w#" ),

  // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
  attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
    "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

  // Prefer arguments quoted,
  //   then not containing pseudos/brackets,
  //   then attribute selectors/non-parenthetical expressions,
  //   then anything else
  // These preferences are here to reduce the number of selectors
  //   needing tokenize in the PSEUDO preFilter
  pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

  // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
  rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

  rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
  rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

  rsibling = new RegExp( whitespace + "*[+~]" ),
  rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

  rpseudo = new RegExp( pseudos ),
  ridentifier = new RegExp( "^" + identifier + "$" ),

  matchExpr = {
    "ID": new RegExp( "^#(" + characterEncoding + ")" ),
    "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
    "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
    "ATTR": new RegExp( "^" + attributes ),
    "PSEUDO": new RegExp( "^" + pseudos ),
    "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
      "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
      "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
    // For use in libraries implementing .is()
    // We use this for POS matching in `select`
    "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
      whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
  },

  rnative = /^[^{]+\{\s*\[native \w/,

  // Easily-parseable/retrievable ID or TAG or CLASS selectors
  rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

  rinputs = /^(?:input|select|textarea|button)$/i,
  rheader = /^h\d$/i,

  rescape = /'|\\/g,

  // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
  runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
  funescape = function( _, escaped, escapedWhitespace ) {
    var high = "0x" + escaped - 0x10000;
    // NaN means non-codepoint
    // Support: Firefox
    // Workaround erroneous numeric interpretation of +"0x"
    return high !== high || escapedWhitespace ?
      escaped :
      // BMP codepoint
      high < 0 ?
        String.fromCharCode( high + 0x10000 ) :
        // Supplemental Plane codepoint (surrogate pair)
        String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
  };

// Optimize for push.apply( _, NodeList )
try {
  push.apply(
    (arr = slice.call( preferredDoc.childNodes )),
    preferredDoc.childNodes
  );
  // Support: Android<4.0
  // Detect silently failing push.apply
  arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
  push = { apply: arr.length ?

    // Leverage slice if possible
    function( target, els ) {
      push_native.apply( target, slice.call(els) );
    } :

    // Support: IE<9
    // Otherwise append directly
    function( target, els ) {
      var j = target.length,
        i = 0;
      // Can't trust NodeList.length
      while ( (target[j++] = els[i++]) ) {}
      target.length = j - 1;
    }
  };
}

function Sizzle( selector, context, results, seed ) {
  var match, elem, m, nodeType,
    // QSA vars
    i, groups, old, nid, newContext, newSelector;

  if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
    setDocument( context );
  }

  context = context || document;
  results = results || [];

  if ( !selector || typeof selector !== "string" ) {
    return results;
  }

  if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
    return [];
  }

  if ( documentIsHTML && !seed ) {

    // Shortcuts
    if ( (match = rquickExpr.exec( selector )) ) {
      // Speed-up: Sizzle("#ID")
      if ( (m = match[1]) ) {
        if ( nodeType === 9 ) {
          elem = context.getElementById( m );
          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE, Opera, and Webkit return items
            // by name instead of ID
            if ( elem.id === m ) {
              results.push( elem );
              return results;
            }
          } else {
            return results;
          }
        } else {
          // Context is not a document
          if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
            contains( context, elem ) && elem.id === m ) {
            results.push( elem );
            return results;
          }
        }

      // Speed-up: Sizzle("TAG")
      } else if ( match[2] ) {
        push.apply( results, context.getElementsByTagName( selector ) );
        return results;

      // Speed-up: Sizzle(".CLASS")
      } else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
        push.apply( results, context.getElementsByClassName( m ) );
        return results;
      }
    }

    // QSA path
    if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
      nid = old = expando;
      newContext = context;
      newSelector = nodeType === 9 && selector;

      // qSA works strangely on Element-rooted queries
      // We can work around this by specifying an extra ID on the root
      // and working up from there (Thanks to Andrew Dupont for the technique)
      // IE 8 doesn't work on object elements
      if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
        groups = tokenize( selector );

        if ( (old = context.getAttribute("id")) ) {
          nid = old.replace( rescape, "\\$&" );
        } else {
          context.setAttribute( "id", nid );
        }
        nid = "[id='" + nid + "'] ";

        i = groups.length;
        while ( i-- ) {
          groups[i] = nid + toSelector( groups[i] );
        }
        newContext = rsibling.test( selector ) && context.parentNode || context;
        newSelector = groups.join(",");
      }

      if ( newSelector ) {
        try {
          push.apply( results,
            newContext.querySelectorAll( newSelector )
          );
          return results;
        } catch(qsaError) {
        } finally {
          if ( !old ) {
            context.removeAttribute("id");
          }
        }
      }
    }
  }

  // All others
  return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *  property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *  deleting the oldest entry
 */
function createCache() {
  var keys = [];

  function cache( key, value ) {
    // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
    if ( keys.push( key += " " ) > Expr.cacheLength ) {
      // Only keep the most recent entries
      delete cache[ keys.shift() ];
    }
    return (cache[ key ] = value);
  }
  return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
  fn[ expando ] = true;
  return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
  var div = document.createElement("div");

  try {
    return !!fn( div );
  } catch (e) {
    return false;
  } finally {
    // Remove from its parent by default
    if ( div.parentNode ) {
      div.parentNode.removeChild( div );
    }
    // release memory in IE
    div = null;
  }
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
  var arr = attrs.split("|"),
    i = attrs.length;

  while ( i-- ) {
    Expr.attrHandle[ arr[i] ] = handler;
  }
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
  var cur = b && a,
    diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
      ( ~b.sourceIndex || MAX_NEGATIVE ) -
      ( ~a.sourceIndex || MAX_NEGATIVE );

  // Use IE sourceIndex if available on both nodes
  if ( diff ) {
    return diff;
  }

  // Check if b follows a
  if ( cur ) {
    while ( (cur = cur.nextSibling) ) {
      if ( cur === b ) {
        return -1;
      }
    }
  }

  return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return name === "input" && elem.type === type;
  };
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return (name === "input" || name === "button") && elem.type === type;
  };
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
  return markFunction(function( argument ) {
    argument = +argument;
    return markFunction(function( seed, matches ) {
      var j,
        matchIndexes = fn( [], seed.length, argument ),
        i = matchIndexes.length;

      // Match elements found at the specified indexes
      while ( i-- ) {
        if ( seed[ (j = matchIndexes[i]) ] ) {
          seed[j] = !(matches[j] = seed[j]);
        }
      }
    });
  });
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
  // documentElement is verified for cases where it doesn't yet exist
  // (such as loading iframes in IE - #4833)
  var documentElement = elem && (elem.ownerDocument || elem).documentElement;
  return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
  var doc = node ? node.ownerDocument || node : preferredDoc,
    parent = doc.defaultView;

  // If no document and documentElement is available, return
  if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
    return document;
  }

  // Set our document
  document = doc;
  docElem = doc.documentElement;

  // Support tests
  documentIsHTML = !isXML( doc );

  // Support: IE>8
  // If iframe document is assigned to "document" variable and if iframe has been reloaded,
  // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
  // IE6-8 do not support the defaultView property so parent will be undefined
  if ( parent && parent.attachEvent && parent !== parent.top ) {
    parent.attachEvent( "onbeforeunload", function() {
      setDocument();
    });
  }

  /* Attributes
  ---------------------------------------------------------------------- */

  // Support: IE<8
  // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
  support.attributes = assert(function( div ) {
    div.className = "i";
    return !div.getAttribute("className");
  });

  /* getElement(s)By*
  ---------------------------------------------------------------------- */

  // Check if getElementsByTagName("*") returns only elements
  support.getElementsByTagName = assert(function( div ) {
    div.appendChild( doc.createComment("") );
    return !div.getElementsByTagName("*").length;
  });

  // Check if getElementsByClassName can be trusted
  support.getElementsByClassName = assert(function( div ) {
    div.innerHTML = "<div class='a'></div><div class='a i'></div>";

    // Support: Safari<4
    // Catch class over-caching
    div.firstChild.className = "i";
    // Support: Opera<10
    // Catch gEBCN failure to find non-leading classes
    return div.getElementsByClassName("i").length === 2;
  });

  // Support: IE<10
  // Check if getElementById returns elements by name
  // The broken getElementById methods don't pick up programatically-set names,
  // so use a roundabout getElementsByName test
  support.getById = assert(function( div ) {
    docElem.appendChild( div ).id = expando;
    return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
  });

  // ID find and filter
  if ( support.getById ) {
    Expr.find["ID"] = function( id, context ) {
      if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
        var m = context.getElementById( id );
        // Check parentNode to catch when Blackberry 4.6 returns
        // nodes that are no longer in the document #6963
        return m && m.parentNode ? [m] : [];
      }
    };
    Expr.filter["ID"] = function( id ) {
      var attrId = id.replace( runescape, funescape );
      return function( elem ) {
        return elem.getAttribute("id") === attrId;
      };
    };
  } else {
    // Support: IE6/7
    // getElementById is not reliable as a find shortcut
    delete Expr.find["ID"];

    Expr.filter["ID"] =  function( id ) {
      var attrId = id.replace( runescape, funescape );
      return function( elem ) {
        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
        return node && node.value === attrId;
      };
    };
  }

  // Tag
  Expr.find["TAG"] = support.getElementsByTagName ?
    function( tag, context ) {
      if ( typeof context.getElementsByTagName !== strundefined ) {
        return context.getElementsByTagName( tag );
      }
    } :
    function( tag, context ) {
      var elem,
        tmp = [],
        i = 0,
        results = context.getElementsByTagName( tag );

      // Filter out possible comments
      if ( tag === "*" ) {
        while ( (elem = results[i++]) ) {
          if ( elem.nodeType === 1 ) {
            tmp.push( elem );
          }
        }

        return tmp;
      }
      return results;
    };

  // Class
  Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
    if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
      return context.getElementsByClassName( className );
    }
  };

  /* QSA/matchesSelector
  ---------------------------------------------------------------------- */

  // QSA and matchesSelector support

  // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
  rbuggyMatches = [];

  // qSa(:focus) reports false when true (Chrome 21)
  // We allow this because of a bug in IE8/9 that throws an error
  // whenever `document.activeElement` is accessed on an iframe
  // So, we allow :focus to pass through QSA all the time to avoid the IE error
  // See http://bugs.jquery.com/ticket/13378
  rbuggyQSA = [];

  if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
    // Build QSA regex
    // Regex strategy adopted from Diego Perini
    assert(function( div ) {
      // Select is set to empty string on purpose
      // This is to test IE's treatment of not explicitly
      // setting a boolean content attribute,
      // since its presence should be enough
      // http://bugs.jquery.com/ticket/12359
      div.innerHTML = "<select><option selected=''></option></select>";

      // Support: IE8
      // Boolean attributes and "value" are not treated correctly
      if ( !div.querySelectorAll("[selected]").length ) {
        rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
      }

      // Webkit/Opera - :checked should return selected option elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      // IE8 throws error here and will not see later tests
      if ( !div.querySelectorAll(":checked").length ) {
        rbuggyQSA.push(":checked");
      }
    });

    assert(function( div ) {

      // Support: Opera 10-12/IE8
      // ^= $= *= and empty values
      // Should not select anything
      // Support: Windows 8 Native Apps
      // The type attribute is restricted during .innerHTML assignment
      var input = doc.createElement("input");
      input.setAttribute( "type", "hidden" );
      div.appendChild( input ).setAttribute( "t", "" );

      if ( div.querySelectorAll("[t^='']").length ) {
        rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
      }

      // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
      // IE8 throws error here and will not see later tests
      if ( !div.querySelectorAll(":enabled").length ) {
        rbuggyQSA.push( ":enabled", ":disabled" );
      }

      // Opera 10-11 does not throw on post-comma invalid pseudos
      div.querySelectorAll("*,:x");
      rbuggyQSA.push(",.*:");
    });
  }

  if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
    docElem.mozMatchesSelector ||
    docElem.oMatchesSelector ||
    docElem.msMatchesSelector) )) ) {

    assert(function( div ) {
      // Check to see if it's possible to do matchesSelector
      // on a disconnected node (IE 9)
      support.disconnectedMatch = matches.call( div, "div" );

      // This should fail with an exception
      // Gecko does not error, returns false instead
      matches.call( div, "[s!='']:x" );
      rbuggyMatches.push( "!=", pseudos );
    });
  }

  rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
  rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

  /* Contains
  ---------------------------------------------------------------------- */

  // Element contains another
  // Purposefully does not implement inclusive descendent
  // As in, an element does not contain itself
  contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
    function( a, b ) {
      var adown = a.nodeType === 9 ? a.documentElement : a,
        bup = b && b.parentNode;
      return a === bup || !!( bup && bup.nodeType === 1 && (
        adown.contains ?
          adown.contains( bup ) :
          a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
      ));
    } :
    function( a, b ) {
      if ( b ) {
        while ( (b = b.parentNode) ) {
          if ( b === a ) {
            return true;
          }
        }
      }
      return false;
    };

  /* Sorting
  ---------------------------------------------------------------------- */

  // Document order sorting
  sortOrder = docElem.compareDocumentPosition ?
  function( a, b ) {

    // Flag for duplicate removal
    if ( a === b ) {
      hasDuplicate = true;
      return 0;
    }

    var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

    if ( compare ) {
      // Disconnected nodes
      if ( compare & 1 ||
        (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

        // Choose the first element that is related to our preferred document
        if ( a === doc || contains(preferredDoc, a) ) {
          return -1;
        }
        if ( b === doc || contains(preferredDoc, b) ) {
          return 1;
        }

        // Maintain original order
        return sortInput ?
          ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
          0;
      }

      return compare & 4 ? -1 : 1;
    }

    // Not directly comparable, sort on existence of method
    return a.compareDocumentPosition ? -1 : 1;
  } :
  function( a, b ) {
    var cur,
      i = 0,
      aup = a.parentNode,
      bup = b.parentNode,
      ap = [ a ],
      bp = [ b ];

    // Exit early if the nodes are identical
    if ( a === b ) {
      hasDuplicate = true;
      return 0;

    // Parentless nodes are either documents or disconnected
    } else if ( !aup || !bup ) {
      return a === doc ? -1 :
        b === doc ? 1 :
        aup ? -1 :
        bup ? 1 :
        sortInput ?
        ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
        0;

    // If the nodes are siblings, we can do a quick check
    } else if ( aup === bup ) {
      return siblingCheck( a, b );
    }

    // Otherwise we need full lists of their ancestors for comparison
    cur = a;
    while ( (cur = cur.parentNode) ) {
      ap.unshift( cur );
    }
    cur = b;
    while ( (cur = cur.parentNode) ) {
      bp.unshift( cur );
    }

    // Walk down the tree looking for a discrepancy
    while ( ap[i] === bp[i] ) {
      i++;
    }

    return i ?
      // Do a sibling check if the nodes have a common ancestor
      siblingCheck( ap[i], bp[i] ) :

      // Otherwise nodes in our document sort first
      ap[i] === preferredDoc ? -1 :
      bp[i] === preferredDoc ? 1 :
      0;
  };

  return doc;
};

Sizzle.matches = function( expr, elements ) {
  return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
  // Set document vars if needed
  if ( ( elem.ownerDocument || elem ) !== document ) {
    setDocument( elem );
  }

  // Make sure that attribute selectors are quoted
  expr = expr.replace( rattributeQuotes, "='$1']" );

  if ( support.matchesSelector && documentIsHTML &&
    ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
    ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

    try {
      var ret = matches.call( elem, expr );

      // IE 9's matchesSelector returns false on disconnected nodes
      if ( ret || support.disconnectedMatch ||
          // As well, disconnected nodes are said to be in a document
          // fragment in IE 9
          elem.document && elem.document.nodeType !== 11 ) {
        return ret;
      }
    } catch(e) {}
  }

  return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
  // Set document vars if needed
  if ( ( context.ownerDocument || context ) !== document ) {
    setDocument( context );
  }
  return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
  // Set document vars if needed
  if ( ( elem.ownerDocument || elem ) !== document ) {
    setDocument( elem );
  }

  var fn = Expr.attrHandle[ name.toLowerCase() ],
    // Don't get fooled by Object.prototype properties (jQuery #13807)
    val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
      fn( elem, name, !documentIsHTML ) :
      undefined;

  return val === undefined ?
    support.attributes || !documentIsHTML ?
      elem.getAttribute( name ) :
      (val = elem.getAttributeNode(name)) && val.specified ?
        val.value :
        null :
    val;
};

Sizzle.error = function( msg ) {
  throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
  var elem,
    duplicates = [],
    j = 0,
    i = 0;

  // Unless we *know* we can detect duplicates, assume their presence
  hasDuplicate = !support.detectDuplicates;
  sortInput = !support.sortStable && results.slice( 0 );
  results.sort( sortOrder );

  if ( hasDuplicate ) {
    while ( (elem = results[i++]) ) {
      if ( elem === results[ i ] ) {
        j = duplicates.push( i );
      }
    }
    while ( j-- ) {
      results.splice( duplicates[ j ], 1 );
    }
  }

  return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
  var node,
    ret = "",
    i = 0,
    nodeType = elem.nodeType;

  if ( !nodeType ) {
    // If no nodeType, this is expected to be an array
    for ( ; (node = elem[i]); i++ ) {
      // Do not traverse comment nodes
      ret += getText( node );
    }
  } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
    // Use textContent for elements
    // innerText usage removed for consistency of new lines (see #11153)
    if ( typeof elem.textContent === "string" ) {
      return elem.textContent;
    } else {
      // Traverse its children
      for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
        ret += getText( elem );
      }
    }
  } else if ( nodeType === 3 || nodeType === 4 ) {
    return elem.nodeValue;
  }
  // Do not include comment or processing instruction nodes

  return ret;
};

Expr = Sizzle.selectors = {

  // Can be adjusted by the user
  cacheLength: 50,

  createPseudo: markFunction,

  match: matchExpr,

  attrHandle: {},

  find: {},

  relative: {
    ">": { dir: "parentNode", first: true },
    " ": { dir: "parentNode" },
    "+": { dir: "previousSibling", first: true },
    "~": { dir: "previousSibling" }
  },

  preFilter: {
    "ATTR": function( match ) {
      match[1] = match[1].replace( runescape, funescape );

      // Move the given value to match[3] whether quoted or unquoted
      match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

      if ( match[2] === "~=" ) {
        match[3] = " " + match[3] + " ";
      }

      return match.slice( 0, 4 );
    },

    "CHILD": function( match ) {
      /* matches from matchExpr["CHILD"]
        1 type (only|nth|...)
        2 what (child|of-type)
        3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
        4 xn-component of xn+y argument ([+-]?\d*n|)
        5 sign of xn-component
        6 x of xn-component
        7 sign of y-component
        8 y of y-component
      */
      match[1] = match[1].toLowerCase();

      if ( match[1].slice( 0, 3 ) === "nth" ) {
        // nth-* requires argument
        if ( !match[3] ) {
          Sizzle.error( match[0] );
        }

        // numeric x and y parameters for Expr.filter.CHILD
        // remember that false/true cast respectively to 0/1
        match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
        match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

      // other types prohibit arguments
      } else if ( match[3] ) {
        Sizzle.error( match[0] );
      }

      return match;
    },

    "PSEUDO": function( match ) {
      var excess,
        unquoted = !match[5] && match[2];

      if ( matchExpr["CHILD"].test( match[0] ) ) {
        return null;
      }

      // Accept quoted arguments as-is
      if ( match[3] && match[4] !== undefined ) {
        match[2] = match[4];

      // Strip excess characters from unquoted arguments
      } else if ( unquoted && rpseudo.test( unquoted ) &&
        // Get excess from tokenize (recursively)
        (excess = tokenize( unquoted, true )) &&
        // advance to the next closing parenthesis
        (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

        // excess is a negative index
        match[0] = match[0].slice( 0, excess );
        match[2] = unquoted.slice( 0, excess );
      }

      // Return only captures needed by the pseudo filter method (type and argument)
      return match.slice( 0, 3 );
    }
  },

  filter: {

    "TAG": function( nodeNameSelector ) {
      var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
      return nodeNameSelector === "*" ?
        function() { return true; } :
        function( elem ) {
          return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
        };
    },

    "CLASS": function( className ) {
      var pattern = classCache[ className + " " ];

      return pattern ||
        (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
        classCache( className, function( elem ) {
          return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
        });
    },

    "ATTR": function( name, operator, check ) {
      return function( elem ) {
        var result = Sizzle.attr( elem, name );

        if ( result == null ) {
          return operator === "!=";
        }
        if ( !operator ) {
          return true;
        }

        result += "";

        return operator === "=" ? result === check :
          operator === "!=" ? result !== check :
          operator === "^=" ? check && result.indexOf( check ) === 0 :
          operator === "*=" ? check && result.indexOf( check ) > -1 :
          operator === "$=" ? check && result.slice( -check.length ) === check :
          operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
          operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
          false;
      };
    },

    "CHILD": function( type, what, argument, first, last ) {
      var simple = type.slice( 0, 3 ) !== "nth",
        forward = type.slice( -4 ) !== "last",
        ofType = what === "of-type";

      return first === 1 && last === 0 ?

        // Shortcut for :nth-*(n)
        function( elem ) {
          return !!elem.parentNode;
        } :

        function( elem, context, xml ) {
          var cache, outerCache, node, diff, nodeIndex, start,
            dir = simple !== forward ? "nextSibling" : "previousSibling",
            parent = elem.parentNode,
            name = ofType && elem.nodeName.toLowerCase(),
            useCache = !xml && !ofType;

          if ( parent ) {

            // :(first|last|only)-(child|of-type)
            if ( simple ) {
              while ( dir ) {
                node = elem;
                while ( (node = node[ dir ]) ) {
                  if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                    return false;
                  }
                }
                // Reverse direction for :only-* (if we haven't yet done so)
                start = dir = type === "only" && !start && "nextSibling";
              }
              return true;
            }

            start = [ forward ? parent.firstChild : parent.lastChild ];

            // non-xml :nth-child(...) stores cache data on `parent`
            if ( forward && useCache ) {
              // Seek `elem` from a previously-cached index
              outerCache = parent[ expando ] || (parent[ expando ] = {});
              cache = outerCache[ type ] || [];
              nodeIndex = cache[0] === dirruns && cache[1];
              diff = cache[0] === dirruns && cache[2];
              node = nodeIndex && parent.childNodes[ nodeIndex ];

              while ( (node = ++nodeIndex && node && node[ dir ] ||

                // Fallback to seeking `elem` from the start
                (diff = nodeIndex = 0) || start.pop()) ) {

                // When found, cache indexes on `parent` and break
                if ( node.nodeType === 1 && ++diff && node === elem ) {
                  outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                  break;
                }
              }

            // Use previously-cached element index if available
            } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
              diff = cache[1];

            // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
            } else {
              // Use the same loop as above to seek `elem` from the start
              while ( (node = ++nodeIndex && node && node[ dir ] ||
                (diff = nodeIndex = 0) || start.pop()) ) {

                if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                  // Cache the index of each encountered element
                  if ( useCache ) {
                    (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                  }

                  if ( node === elem ) {
                    break;
                  }
                }
              }
            }

            // Incorporate the offset, then check against cycle size
            diff -= last;
            return diff === first || ( diff % first === 0 && diff / first >= 0 );
          }
        };
    },

    "PSEUDO": function( pseudo, argument ) {
      // pseudo-class names are case-insensitive
      // http://www.w3.org/TR/selectors/#pseudo-classes
      // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
      // Remember that setFilters inherits from pseudos
      var args,
        fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
          Sizzle.error( "unsupported pseudo: " + pseudo );

      // The user may use createPseudo to indicate that
      // arguments are needed to create the filter function
      // just as Sizzle does
      if ( fn[ expando ] ) {
        return fn( argument );
      }

      // But maintain support for old signatures
      if ( fn.length > 1 ) {
        args = [ pseudo, pseudo, "", argument ];
        return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
          markFunction(function( seed, matches ) {
            var idx,
              matched = fn( seed, argument ),
              i = matched.length;
            while ( i-- ) {
              idx = indexOf.call( seed, matched[i] );
              seed[ idx ] = !( matches[ idx ] = matched[i] );
            }
          }) :
          function( elem ) {
            return fn( elem, 0, args );
          };
      }

      return fn;
    }
  },

  pseudos: {
    // Potentially complex pseudos
    "not": markFunction(function( selector ) {
      // Trim the selector passed to compile
      // to avoid treating leading and trailing
      // spaces as combinators
      var input = [],
        results = [],
        matcher = compile( selector.replace( rtrim, "$1" ) );

      return matcher[ expando ] ?
        markFunction(function( seed, matches, context, xml ) {
          var elem,
            unmatched = matcher( seed, null, xml, [] ),
            i = seed.length;

          // Match elements unmatched by `matcher`
          while ( i-- ) {
            if ( (elem = unmatched[i]) ) {
              seed[i] = !(matches[i] = elem);
            }
          }
        }) :
        function( elem, context, xml ) {
          input[0] = elem;
          matcher( input, null, xml, results );
          return !results.pop();
        };
    }),

    "has": markFunction(function( selector ) {
      return function( elem ) {
        return Sizzle( selector, elem ).length > 0;
      };
    }),

    "contains": markFunction(function( text ) {
      return function( elem ) {
        return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
      };
    }),

    // "Whether an element is represented by a :lang() selector
    // is based solely on the element's language value
    // being equal to the identifier C,
    // or beginning with the identifier C immediately followed by "-".
    // The matching of C against the element's language value is performed case-insensitively.
    // The identifier C does not have to be a valid language name."
    // http://www.w3.org/TR/selectors/#lang-pseudo
    "lang": markFunction( function( lang ) {
      // lang value must be a valid identifier
      if ( !ridentifier.test(lang || "") ) {
        Sizzle.error( "unsupported lang: " + lang );
      }
      lang = lang.replace( runescape, funescape ).toLowerCase();
      return function( elem ) {
        var elemLang;
        do {
          if ( (elemLang = documentIsHTML ?
            elem.lang :
            elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

            elemLang = elemLang.toLowerCase();
            return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
          }
        } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
        return false;
      };
    }),

    // Miscellaneous
    "target": function( elem ) {
      var hash = window.location && window.location.hash;
      return hash && hash.slice( 1 ) === elem.id;
    },

    "root": function( elem ) {
      return elem === docElem;
    },

    "focus": function( elem ) {
      return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
    },

    // Boolean properties
    "enabled": function( elem ) {
      return elem.disabled === false;
    },

    "disabled": function( elem ) {
      return elem.disabled === true;
    },

    "checked": function( elem ) {
      // In CSS3, :checked should return both checked and selected elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      var nodeName = elem.nodeName.toLowerCase();
      return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
    },

    "selected": function( elem ) {
      // Accessing this property makes selected-by-default
      // options in Safari work properly
      if ( elem.parentNode ) {
        elem.parentNode.selectedIndex;
      }

      return elem.selected === true;
    },

    // Contents
    "empty": function( elem ) {
      // http://www.w3.org/TR/selectors/#empty-pseudo
      // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
      //   not comment, processing instructions, or others
      // Thanks to Diego Perini for the nodeName shortcut
      //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
      for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
        if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
          return false;
        }
      }
      return true;
    },

    "parent": function( elem ) {
      return !Expr.pseudos["empty"]( elem );
    },

    // Element/input types
    "header": function( elem ) {
      return rheader.test( elem.nodeName );
    },

    "input": function( elem ) {
      return rinputs.test( elem.nodeName );
    },

    "button": function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return name === "input" && elem.type === "button" || name === "button";
    },

    "text": function( elem ) {
      var attr;
      // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
      // use getAttribute instead to test this case
      return elem.nodeName.toLowerCase() === "input" &&
        elem.type === "text" &&
        ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
    },

    // Position-in-collection
    "first": createPositionalPseudo(function() {
      return [ 0 ];
    }),

    "last": createPositionalPseudo(function( matchIndexes, length ) {
      return [ length - 1 ];
    }),

    "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
      return [ argument < 0 ? argument + length : argument ];
    }),

    "even": createPositionalPseudo(function( matchIndexes, length ) {
      var i = 0;
      for ( ; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "odd": createPositionalPseudo(function( matchIndexes, length ) {
      var i = 1;
      for ( ; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      var i = argument < 0 ? argument + length : argument;
      for ( ; --i >= 0; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      var i = argument < 0 ? argument + length : argument;
      for ( ; ++i < length; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    })
  }
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
  Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
  Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
  var matched, match, tokens, type,
    soFar, groups, preFilters,
    cached = tokenCache[ selector + " " ];

  if ( cached ) {
    return parseOnly ? 0 : cached.slice( 0 );
  }

  soFar = selector;
  groups = [];
  preFilters = Expr.preFilter;

  while ( soFar ) {

    // Comma and first run
    if ( !matched || (match = rcomma.exec( soFar )) ) {
      if ( match ) {
        // Don't consume trailing commas as valid
        soFar = soFar.slice( match[0].length ) || soFar;
      }
      groups.push( tokens = [] );
    }

    matched = false;

    // Combinators
    if ( (match = rcombinators.exec( soFar )) ) {
      matched = match.shift();
      tokens.push({
        value: matched,
        // Cast descendant combinators to space
        type: match[0].replace( rtrim, " " )
      });
      soFar = soFar.slice( matched.length );
    }

    // Filters
    for ( type in Expr.filter ) {
      if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
        (match = preFilters[ type ]( match ))) ) {
        matched = match.shift();
        tokens.push({
          value: matched,
          type: type,
          matches: match
        });
        soFar = soFar.slice( matched.length );
      }
    }

    if ( !matched ) {
      break;
    }
  }

  // Return the length of the invalid excess
  // if we're just parsing
  // Otherwise, throw an error or return tokens
  return parseOnly ?
    soFar.length :
    soFar ?
      Sizzle.error( selector ) :
      // Cache the tokens
      tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
  var i = 0,
    len = tokens.length,
    selector = "";
  for ( ; i < len; i++ ) {
    selector += tokens[i].value;
  }
  return selector;
}

function addCombinator( matcher, combinator, base ) {
  var dir = combinator.dir,
    checkNonElements = base && dir === "parentNode",
    doneName = done++;

  return combinator.first ?
    // Check against closest ancestor/preceding element
    function( elem, context, xml ) {
      while ( (elem = elem[ dir ]) ) {
        if ( elem.nodeType === 1 || checkNonElements ) {
          return matcher( elem, context, xml );
        }
      }
    } :

    // Check against all ancestor/preceding elements
    function( elem, context, xml ) {
      var data, cache, outerCache,
        dirkey = dirruns + " " + doneName;

      // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
      if ( xml ) {
        while ( (elem = elem[ dir ]) ) {
          if ( elem.nodeType === 1 || checkNonElements ) {
            if ( matcher( elem, context, xml ) ) {
              return true;
            }
          }
        }
      } else {
        while ( (elem = elem[ dir ]) ) {
          if ( elem.nodeType === 1 || checkNonElements ) {
            outerCache = elem[ expando ] || (elem[ expando ] = {});
            if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
              if ( (data = cache[1]) === true || data === cachedruns ) {
                return data === true;
              }
            } else {
              cache = outerCache[ dir ] = [ dirkey ];
              cache[1] = matcher( elem, context, xml ) || cachedruns;
              if ( cache[1] === true ) {
                return true;
              }
            }
          }
        }
      }
    };
}

function elementMatcher( matchers ) {
  return matchers.length > 1 ?
    function( elem, context, xml ) {
      var i = matchers.length;
      while ( i-- ) {
        if ( !matchers[i]( elem, context, xml ) ) {
          return false;
        }
      }
      return true;
    } :
    matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
  var elem,
    newUnmatched = [],
    i = 0,
    len = unmatched.length,
    mapped = map != null;

  for ( ; i < len; i++ ) {
    if ( (elem = unmatched[i]) ) {
      if ( !filter || filter( elem, context, xml ) ) {
        newUnmatched.push( elem );
        if ( mapped ) {
          map.push( i );
        }
      }
    }
  }

  return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
  if ( postFilter && !postFilter[ expando ] ) {
    postFilter = setMatcher( postFilter );
  }
  if ( postFinder && !postFinder[ expando ] ) {
    postFinder = setMatcher( postFinder, postSelector );
  }
  return markFunction(function( seed, results, context, xml ) {
    var temp, i, elem,
      preMap = [],
      postMap = [],
      preexisting = results.length,

      // Get initial elements from seed or context
      elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

      // Prefilter to get matcher input, preserving a map for seed-results synchronization
      matcherIn = preFilter && ( seed || !selector ) ?
        condense( elems, preMap, preFilter, context, xml ) :
        elems,

      matcherOut = matcher ?
        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
        postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

          // ...intermediate processing is necessary
          [] :

          // ...otherwise use results directly
          results :
        matcherIn;

    // Find primary matches
    if ( matcher ) {
      matcher( matcherIn, matcherOut, context, xml );
    }

    // Apply postFilter
    if ( postFilter ) {
      temp = condense( matcherOut, postMap );
      postFilter( temp, [], context, xml );

      // Un-match failing elements by moving them back to matcherIn
      i = temp.length;
      while ( i-- ) {
        if ( (elem = temp[i]) ) {
          matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
        }
      }
    }

    if ( seed ) {
      if ( postFinder || preFilter ) {
        if ( postFinder ) {
          // Get the final matcherOut by condensing this intermediate into postFinder contexts
          temp = [];
          i = matcherOut.length;
          while ( i-- ) {
            if ( (elem = matcherOut[i]) ) {
              // Restore matcherIn since elem is not yet a final match
              temp.push( (matcherIn[i] = elem) );
            }
          }
          postFinder( null, (matcherOut = []), temp, xml );
        }

        // Move matched elements from seed to results to keep them synchronized
        i = matcherOut.length;
        while ( i-- ) {
          if ( (elem = matcherOut[i]) &&
            (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

            seed[temp] = !(results[temp] = elem);
          }
        }
      }

    // Add elements to results, through postFinder if defined
    } else {
      matcherOut = condense(
        matcherOut === results ?
          matcherOut.splice( preexisting, matcherOut.length ) :
          matcherOut
      );
      if ( postFinder ) {
        postFinder( null, results, matcherOut, xml );
      } else {
        push.apply( results, matcherOut );
      }
    }
  });
}

function matcherFromTokens( tokens ) {
  var checkContext, matcher, j,
    len = tokens.length,
    leadingRelative = Expr.relative[ tokens[0].type ],
    implicitRelative = leadingRelative || Expr.relative[" "],
    i = leadingRelative ? 1 : 0,

    // The foundational matcher ensures that elements are reachable from top-level context(s)
    matchContext = addCombinator( function( elem ) {
      return elem === checkContext;
    }, implicitRelative, true ),
    matchAnyContext = addCombinator( function( elem ) {
      return indexOf.call( checkContext, elem ) > -1;
    }, implicitRelative, true ),
    matchers = [ function( elem, context, xml ) {
      return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
        (checkContext = context).nodeType ?
          matchContext( elem, context, xml ) :
          matchAnyContext( elem, context, xml ) );
    } ];

  for ( ; i < len; i++ ) {
    if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
      matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
    } else {
      matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

      // Return special upon seeing a positional matcher
      if ( matcher[ expando ] ) {
        // Find the next relative operator (if any) for proper handling
        j = ++i;
        for ( ; j < len; j++ ) {
          if ( Expr.relative[ tokens[j].type ] ) {
            break;
          }
        }
        return setMatcher(
          i > 1 && elementMatcher( matchers ),
          i > 1 && toSelector(
            // If the preceding token was a descendant combinator, insert an implicit any-element `*`
            tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
          ).replace( rtrim, "$1" ),
          matcher,
          i < j && matcherFromTokens( tokens.slice( i, j ) ),
          j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
          j < len && toSelector( tokens )
        );
      }
      matchers.push( matcher );
    }
  }

  return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
  // A counter to specify which element is currently being matched
  var matcherCachedRuns = 0,
    bySet = setMatchers.length > 0,
    byElement = elementMatchers.length > 0,
    superMatcher = function( seed, context, xml, results, expandContext ) {
      var elem, j, matcher,
        setMatched = [],
        matchedCount = 0,
        i = "0",
        unmatched = seed && [],
        outermost = expandContext != null,
        contextBackup = outermostContext,
        // We must always have either seed elements or context
        elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
        // Use integer dirruns iff this is the outermost matcher
        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

      if ( outermost ) {
        outermostContext = context !== document && context;
        cachedruns = matcherCachedRuns;
      }

      // Add elements passing elementMatchers directly to results
      // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
      for ( ; (elem = elems[i]) != null; i++ ) {
        if ( byElement && elem ) {
          j = 0;
          while ( (matcher = elementMatchers[j++]) ) {
            if ( matcher( elem, context, xml ) ) {
              results.push( elem );
              break;
            }
          }
          if ( outermost ) {
            dirruns = dirrunsUnique;
            cachedruns = ++matcherCachedRuns;
          }
        }

        // Track unmatched elements for set filters
        if ( bySet ) {
          // They will have gone through all possible matchers
          if ( (elem = !matcher && elem) ) {
            matchedCount--;
          }

          // Lengthen the array for every element, matched or not
          if ( seed ) {
            unmatched.push( elem );
          }
        }
      }

      // Apply set filters to unmatched elements
      matchedCount += i;
      if ( bySet && i !== matchedCount ) {
        j = 0;
        while ( (matcher = setMatchers[j++]) ) {
          matcher( unmatched, setMatched, context, xml );
        }

        if ( seed ) {
          // Reintegrate element matches to eliminate the need for sorting
          if ( matchedCount > 0 ) {
            while ( i-- ) {
              if ( !(unmatched[i] || setMatched[i]) ) {
                setMatched[i] = pop.call( results );
              }
            }
          }

          // Discard index placeholder values to get only actual matches
          setMatched = condense( setMatched );
        }

        // Add matches to results
        push.apply( results, setMatched );

        // Seedless set matches succeeding multiple successful matchers stipulate sorting
        if ( outermost && !seed && setMatched.length > 0 &&
          ( matchedCount + setMatchers.length ) > 1 ) {

          Sizzle.uniqueSort( results );
        }
      }

      // Override manipulation of globals by nested matchers
      if ( outermost ) {
        dirruns = dirrunsUnique;
        outermostContext = contextBackup;
      }

      return unmatched;
    };

  return bySet ?
    markFunction( superMatcher ) :
    superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
  var i,
    setMatchers = [],
    elementMatchers = [],
    cached = compilerCache[ selector + " " ];

  if ( !cached ) {
    // Generate a function of recursive functions that can be used to check each element
    if ( !group ) {
      group = tokenize( selector );
    }
    i = group.length;
    while ( i-- ) {
      cached = matcherFromTokens( group[i] );
      if ( cached[ expando ] ) {
        setMatchers.push( cached );
      } else {
        elementMatchers.push( cached );
      }
    }

    // Cache the compiled function
    cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
  }
  return cached;
};

function multipleContexts( selector, contexts, results ) {
  var i = 0,
    len = contexts.length;
  for ( ; i < len; i++ ) {
    Sizzle( selector, contexts[i], results );
  }
  return results;
}

function select( selector, context, results, seed ) {
  var i, tokens, token, type, find,
    match = tokenize( selector );

  if ( !seed ) {
    // Try to minimize operations if there is only one group
    if ( match.length === 1 ) {

      // Take a shortcut and set the context if the root selector is an ID
      tokens = match[0] = match[0].slice( 0 );
      if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
          support.getById && context.nodeType === 9 && documentIsHTML &&
          Expr.relative[ tokens[1].type ] ) {

        context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
        if ( !context ) {
          return results;
        }
        selector = selector.slice( tokens.shift().value.length );
      }

      // Fetch a seed set for right-to-left matching
      i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
      while ( i-- ) {
        token = tokens[i];

        // Abort if we hit a combinator
        if ( Expr.relative[ (type = token.type) ] ) {
          break;
        }
        if ( (find = Expr.find[ type ]) ) {
          // Search, expanding context for leading sibling combinators
          if ( (seed = find(
            token.matches[0].replace( runescape, funescape ),
            rsibling.test( tokens[0].type ) && context.parentNode || context
          )) ) {

            // If seed is empty or no tokens remain, we can return early
            tokens.splice( i, 1 );
            selector = seed.length && toSelector( tokens );
            if ( !selector ) {
              push.apply( results, seed );
              return results;
            }

            break;
          }
        }
      }
    }
  }

  // Compile and execute a filtering function
  // Provide `match` to avoid retokenization if we modified the selector above
  compile( selector, match )(
    seed,
    context,
    !documentIsHTML,
    results,
    rsibling.test( selector )
  );
  return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
  // Should return 1, but returns 4 (following)
  return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
  div.innerHTML = "<a href='#'></a>";
  return div.firstChild.getAttribute("href") === "#" ;
}) ) {
  addHandle( "type|href|height|width", function( elem, name, isXML ) {
    if ( !isXML ) {
      return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
    }
  });
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
  div.innerHTML = "<input/>";
  div.firstChild.setAttribute( "value", "" );
  return div.firstChild.getAttribute( "value" ) === "";
}) ) {
  addHandle( "value", function( elem, name, isXML ) {
    if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
      return elem.defaultValue;
    }
  });
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
  return div.getAttribute("disabled") == null;
}) ) {
  addHandle( booleans, function( elem, name, isXML ) {
    var val;
    if ( !isXML ) {
      return (val = elem.getAttributeNode( name )) && val.specified ?
        val.value :
        elem[ name ] === true ? name.toLowerCase() : null;
    }
  });
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
  var object = optionsCache[ options ] = {};
  jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
    object[ flag ] = true;
  });
  return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *  options: an optional list of space-separated options that will change how
 *      the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *  once:     will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:     will keep track of previous values and will call any callback added
 *          after the list has been fired right away with the latest "memorized"
 *          values (like a Deferred)
 *
 *  unique:     will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:  interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

  // Convert options from String-formatted to Object-formatted if needed
  // (we check in cache first)
  options = typeof options === "string" ?
    ( optionsCache[ options ] || createOptions( options ) ) :
    jQuery.extend( {}, options );

  var // Last fire value (for non-forgettable lists)
    memory,
    // Flag to know if list was already fired
    fired,
    // Flag to know if list is currently firing
    firing,
    // First callback to fire (used internally by add and fireWith)
    firingStart,
    // End of the loop when firing
    firingLength,
    // Index of currently firing callback (modified by remove if needed)
    firingIndex,
    // Actual callback list
    list = [],
    // Stack of fire calls for repeatable lists
    stack = !options.once && [],
    // Fire callbacks
    fire = function( data ) {
      memory = options.memory && data;
      fired = true;
      firingIndex = firingStart || 0;
      firingStart = 0;
      firingLength = list.length;
      firing = true;
      for ( ; list && firingIndex < firingLength; firingIndex++ ) {
        if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
          memory = false; // To prevent further calls using add
          break;
        }
      }
      firing = false;
      if ( list ) {
        if ( stack ) {
          if ( stack.length ) {
            fire( stack.shift() );
          }
        } else if ( memory ) {
          list = [];
        } else {
          self.disable();
        }
      }
    },
    // Actual Callbacks object
    self = {
      // Add a callback or a collection of callbacks to the list
      add: function() {
        if ( list ) {
          // First, we save the current length
          var start = list.length;
          (function add( args ) {
            jQuery.each( args, function( _, arg ) {
              var type = jQuery.type( arg );
              if ( type === "function" ) {
                if ( !options.unique || !self.has( arg ) ) {
                  list.push( arg );
                }
              } else if ( arg && arg.length && type !== "string" ) {
                // Inspect recursively
                add( arg );
              }
            });
          })( arguments );
          // Do we need to add the callbacks to the
          // current firing batch?
          if ( firing ) {
            firingLength = list.length;
          // With memory, if we're not firing then
          // we should call right away
          } else if ( memory ) {
            firingStart = start;
            fire( memory );
          }
        }
        return this;
      },
      // Remove a callback from the list
      remove: function() {
        if ( list ) {
          jQuery.each( arguments, function( _, arg ) {
            var index;
            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
              list.splice( index, 1 );
              // Handle firing indexes
              if ( firing ) {
                if ( index <= firingLength ) {
                  firingLength--;
                }
                if ( index <= firingIndex ) {
                  firingIndex--;
                }
              }
            }
          });
        }
        return this;
      },
      // Check if a given callback is in the list.
      // If no argument is given, return whether or not list has callbacks attached.
      has: function( fn ) {
        return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
      },
      // Remove all callbacks from the list
      empty: function() {
        list = [];
        firingLength = 0;
        return this;
      },
      // Have the list do nothing anymore
      disable: function() {
        list = stack = memory = undefined;
        return this;
      },
      // Is it disabled?
      disabled: function() {
        return !list;
      },
      // Lock the list in its current state
      lock: function() {
        stack = undefined;
        if ( !memory ) {
          self.disable();
        }
        return this;
      },
      // Is it locked?
      locked: function() {
        return !stack;
      },
      // Call all callbacks with the given context and arguments
      fireWith: function( context, args ) {
        if ( list && ( !fired || stack ) ) {
          args = args || [];
          args = [ context, args.slice ? args.slice() : args ];
          if ( firing ) {
            stack.push( args );
          } else {
            fire( args );
          }
        }
        return this;
      },
      // Call all the callbacks with the given arguments
      fire: function() {
        self.fireWith( this, arguments );
        return this;
      },
      // To know if the callbacks have already been called at least once
      fired: function() {
        return !!fired;
      }
    };

  return self;
};
jQuery.extend({

  Deferred: function( func ) {
    var tuples = [
        // action, add listener, listener list, final state
        [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
        [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
        [ "notify", "progress", jQuery.Callbacks("memory") ]
      ],
      state = "pending",
      promise = {
        state: function() {
          return state;
        },
        always: function() {
          deferred.done( arguments ).fail( arguments );
          return this;
        },
        then: function( /* fnDone, fnFail, fnProgress */ ) {
          var fns = arguments;
          return jQuery.Deferred(function( newDefer ) {
            jQuery.each( tuples, function( i, tuple ) {
              var action = tuple[ 0 ],
                fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
              // deferred[ done | fail | progress ] for forwarding actions to newDefer
              deferred[ tuple[1] ](function() {
                var returned = fn && fn.apply( this, arguments );
                if ( returned && jQuery.isFunction( returned.promise ) ) {
                  returned.promise()
                    .done( newDefer.resolve )
                    .fail( newDefer.reject )
                    .progress( newDefer.notify );
                } else {
                  newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                }
              });
            });
            fns = null;
          }).promise();
        },
        // Get a promise for this deferred
        // If obj is provided, the promise aspect is added to the object
        promise: function( obj ) {
          return obj != null ? jQuery.extend( obj, promise ) : promise;
        }
      },
      deferred = {};

    // Keep pipe for back-compat
    promise.pipe = promise.then;

    // Add list-specific methods
    jQuery.each( tuples, function( i, tuple ) {
      var list = tuple[ 2 ],
        stateString = tuple[ 3 ];

      // promise[ done | fail | progress ] = list.add
      promise[ tuple[1] ] = list.add;

      // Handle state
      if ( stateString ) {
        list.add(function() {
          // state = [ resolved | rejected ]
          state = stateString;

        // [ reject_list | resolve_list ].disable; progress_list.lock
        }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
      }

      // deferred[ resolve | reject | notify ]
      deferred[ tuple[0] ] = function() {
        deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
        return this;
      };
      deferred[ tuple[0] + "With" ] = list.fireWith;
    });

    // Make the deferred a promise
    promise.promise( deferred );

    // Call given func if any
    if ( func ) {
      func.call( deferred, deferred );
    }

    // All done!
    return deferred;
  },

  // Deferred helper
  when: function( subordinate /* , ..., subordinateN */ ) {
    var i = 0,
      resolveValues = core_slice.call( arguments ),
      length = resolveValues.length,

      // the count of uncompleted subordinates
      remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

      // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
      deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

      // Update function for both resolve and progress values
      updateFunc = function( i, contexts, values ) {
        return function( value ) {
          contexts[ i ] = this;
          values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
          if( values === progressValues ) {
            deferred.notifyWith( contexts, values );
          } else if ( !( --remaining ) ) {
            deferred.resolveWith( contexts, values );
          }
        };
      },

      progressValues, progressContexts, resolveContexts;

    // add listeners to Deferred subordinates; treat others as resolved
    if ( length > 1 ) {
      progressValues = new Array( length );
      progressContexts = new Array( length );
      resolveContexts = new Array( length );
      for ( ; i < length; i++ ) {
        if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
          resolveValues[ i ].promise()
            .done( updateFunc( i, resolveContexts, resolveValues ) )
            .fail( deferred.reject )
            .progress( updateFunc( i, progressContexts, progressValues ) );
        } else {
          --remaining;
        }
      }
    }

    // if we're not waiting on anything, resolve the master
    if ( !remaining ) {
      deferred.resolveWith( resolveContexts, resolveValues );
    }

    return deferred.promise();
  }
});
jQuery.support = (function( support ) {
  var input = document.createElement("input"),
    fragment = document.createDocumentFragment(),
    div = document.createElement("div"),
    select = document.createElement("select"),
    opt = select.appendChild( document.createElement("option") );

  // Finish early in limited environments
  if ( !input.type ) {
    return support;
  }

  input.type = "checkbox";

  // Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
  // Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
  support.checkOn = input.value !== "";

  // Must access the parent to make an option select properly
  // Support: IE9, IE10
  support.optSelected = opt.selected;

  // Will be defined later
  support.reliableMarginRight = true;
  support.boxSizingReliable = true;
  support.pixelPosition = false;

  // Make sure checked status is properly cloned
  // Support: IE9, IE10
  input.checked = true;
  support.noCloneChecked = input.cloneNode( true ).checked;

  // Make sure that the options inside disabled selects aren't marked as disabled
  // (WebKit marks them as disabled)
  select.disabled = true;
  support.optDisabled = !opt.disabled;

  // Check if an input maintains its value after becoming a radio
  // Support: IE9, IE10
  input = document.createElement("input");
  input.value = "t";
  input.type = "radio";
  support.radioValue = input.value === "t";

  // #11217 - WebKit loses check when the name is after the checked attribute
  input.setAttribute( "checked", "t" );
  input.setAttribute( "name", "t" );

  fragment.appendChild( input );

  // Support: Safari 5.1, Android 4.x, Android 2.3
  // old WebKit doesn't clone checked state correctly in fragments
  support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

  // Support: Firefox, Chrome, Safari
  // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
  support.focusinBubbles = "onfocusin" in window;

  div.style.backgroundClip = "content-box";
  div.cloneNode( true ).style.backgroundClip = "";
  support.clearCloneStyle = div.style.backgroundClip === "content-box";

  // Run tests that need a body at doc ready
  jQuery(function() {
    var container, marginDiv,
      // Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
      divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
      body = document.getElementsByTagName("body")[ 0 ];

    if ( !body ) {
      // Return for frameset docs that don't have a body
      return;
    }

    container = document.createElement("div");
    container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

    // Check box-sizing and margin behavior.
    body.appendChild( container ).appendChild( div );
    div.innerHTML = "";
    // Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
    div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

    // Workaround failing boxSizing test due to offsetWidth returning wrong value
    // with some non-1 values of body zoom, ticket #13543
    jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
      support.boxSizing = div.offsetWidth === 4;
    });

    // Use window.getComputedStyle because jsdom on node.js will break without it.
    if ( window.getComputedStyle ) {
      support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
      support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

      // Support: Android 2.3
      // Check if div with explicit width and no margin-right incorrectly
      // gets computed margin-right based on width of container. (#3333)
      // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
      marginDiv = div.appendChild( document.createElement("div") );
      marginDiv.style.cssText = div.style.cssText = divReset;
      marginDiv.style.marginRight = marginDiv.style.width = "0";
      div.style.width = "1px";

      support.reliableMarginRight =
        !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
    }

    body.removeChild( container );
  });

  return support;
})( {} );

/*
  Implementation Summary

  1. Enforce API surface and semantic compatibility with 1.9.x branch
  2. Improve the module's maintainability by reducing 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_bb2a45b7f5c38e71, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_ru-ru_231f4cd8ab690fe0 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_01cd577bdaa51c9d, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_sv-se_bf1a374da2921a3b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_9dc841f0d1ce26f8, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_tr-tr_68278194914e1c2c (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_46d58c37c08a28e9, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_zh-cn_39849f924185ee4b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_1832aa3570c1fb08, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_zh-tw_3d80dce83ef6cabb (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_1c2ee78b6e32d778, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-msauditevtlog_31bf3856ad364e35_0.0.0.0_none_473b0b7f78f52228 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-msauditevtlog_31bf3856ad364e35_6.1.7601.23126_none_25e91622a8312ee5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_cs-cz_9174900bcf701166 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_cs-cz_70229aaefeac1e23, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_de-de_2bda056ec78c61ff (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_de-de_0a881011f6c86ebc, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_en-us_d4cadb67b66a6dc4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_en-us_b378e60ae5a67a81, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_es-es_d496384bb6915f69 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_es-es_b34442eee5cd6c26, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_fr-fr_774dae4aa96375cb (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_55fbb8edd89f8288, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_hu-hu_bebe2e928dc344e7 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_hu-hu_9d6c3935bcff51a4, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_it-it_6175a49180955b49 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_it-it_4023af34afd16806, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_ja-jp_039b239e73b06d24 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_e2492e41a2ec79e1, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_ko-kr_a70500536621343a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_ko-kr_85b30af6955d40f7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_nl-nl_8dd6ccc63f7269cb (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_6c84d7696eae7688, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_pl-pl_d41327482494d77f (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_pl-pl_b2c131eb53d0e43c, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_pt-br_d66711ec231e6b63 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_pt-br_b5151c8f525a7820, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_pt-pt_d748e158228ddb3f (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_b5f6ebfb51c9e7fc, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_ru-ru_1debf31c076f696b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_fc99fdbf36ab7628, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_sv-se_b9e6dd90fe9873c6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_9894e8342dd48083, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_tr-tr_62f427d7ed5475b7 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_41a2327b1c908274, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_zh-cn_345145d59d8c47d6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_12ff5078ccc85493, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_zh-tw_384d832b9afd2446 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_16fb8dceca393103, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc_31bf3856ad364e35_0.0.0.0_none_5d39df9b63de6da9 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc_31bf3856ad364e35_6.1.7601.23126_none_3be7ea3e931a7a66, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc-webproxy_31bf3856ad364e35_0.0.0.0_none_64994d221a2d0328 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc-webproxy_31bf3856ad364e35_6.1.7601.23126_none_434757c549690fe5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-security-schannel_31bf3856ad364e35_0.0.0.0_none_a20edc3f55ca842d (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-security-schannel_31bf3856ad364e35_6.1.7601.23126_none_80bce6e2850690ea, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-systemrestore-main_31bf3856ad364e35_0.0.0.0_none_c6d86118b3c6ab95 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-systemrestore-main_31bf3856ad364e35_6.1.7601.23126_none_a5866bbbe302b852, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-appid_31bf3856ad364e35_0.0.0.0_none_e1994bcee70fbb6d (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19021
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-appid_31bf3856ad364e35_6.1.7601.23126_none_c0475672164bc82a, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-csrsrv_31bf3856ad364e35_0.0.0.0_none_53d47288da461130 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-csrsrv_31bf3856ad364e35_6.1.7601.23126_none_32827d2c09821ded, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-kernel32_31bf3856ad364e35_0.0.0.0_none_1e0b20c48b33f815 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-kernel32_31bf3856ad364e35_6.1.7601.23126_none_fcb92b67ba7004d2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-kernelbase_31bf3856ad364e35_0.0.0.0_none_b14fb3d6e97c8001 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-kernelbase_31bf3856ad364e35_6.1.7601.23126_none_8ffdbe7a18b88cbe, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-ntdll_31bf3856ad364e35_0.0.0.0_none_e32419c531161b7d (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-ntdll_31bf3856ad364e35_6.1.7601.23126_none_c1d224686052283a, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-security-digest_31bf3856ad364e35_0.0.0.0_none_c51a869ab19d8330 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-security-digest_31bf3856ad364e35_6.1.7601.23126_none_a3c8913de0d98fed, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-security-ntlm_31bf3856ad364e35_0.0.0.0_none_070028569773327f (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-security-ntlm_31bf3856ad364e35_6.1.7601.23126_none_e5ae32f9c6af3f3c, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-security-schannel_31bf3856ad364e35_0.0.0.0_none_ac6386918a2b4628 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-security-schannel_31bf3856ad364e35_6.1.7601.23126_none_8b119134b96752e5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-systemrestore-main_31bf3856ad364e35_0.0.0.0_none_d12d0b6ae8276d90 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-systemrestore-main_31bf3856ad364e35_6.1.7601.23126_none_afdb160e17637a4d, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-winsrv_31bf3856ad364e35_0.0.0.0_none_40cbd225d13da512 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-winsrv_31bf3856ad364e35_6.1.7601.23126_none_1f79dcc90079b1cf, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-wow64_31bf3856ad364e35_0.0.0.0_none_f273038d0c37a130 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-wow64_31bf3856ad364e35_6.1.7601.23126_none_d1210e303b73aded, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_ar-sa_f3f9a91822fc6b89 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_ar-sa_d2a7b3bb52387846, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_cs-cz_4543013c0104990b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_cs-cz_23f10bdf3040a5c8, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_da-dk_e27ce162f74a950a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_da-dk_c12aec062686a1c7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_de-de_dfa8769ef920e9a4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_de-de_be568142285cf661, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_el-gr_883ea431e8365232 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_el-gr_66ecaed517725eef, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_en-us_88994c97e7fef569 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_en-us_6747573b173b0226, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_es-es_8864a97be825e70e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_es-es_6712b41f1761f3cb, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_fi-fi_277fae28dd3fd938 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_fi-fi_062db8cc0c7be5f5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_fr-fr_2b1c1f7adaf7fd70 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_09ca2a1e0a340a2d, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_he-il_6f3bc71cc166fe5e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_he-il_4de9d1bff0a30b1b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_hu-hu_728c9fc2bf57cc8c (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_hu-hu_513aaa65ee93d949, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_it-it_154415c1b229e2ee (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_it-it_f3f22064e165efab, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_ja-jp_b76994cea544f4c9 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_96179f71d4810186, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_ko-kr_5ad3718397b5bbdf (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_ko-kr_39817c26c6f1c89c, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_nb-no_4365f2b86fdae79b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_nb-no_2213fd5b9f16f458, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_nl-nl_41a53df67106f170 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_20534899a042fe2d, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_pl-pl_87e1987856295f24 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_pl-pl_668fa31b85656be1, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_pt-br_8a35831c54b2f308 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_pt-br_68e38dbf83eeffc5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_pt-pt_8b175288542262e4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_69c55d2b835e6fa1, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_ru-ru_d1ba644c3903f110 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_b0686eef683ffdcd, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_sv-se_6db54ec1302cfb6b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_4c6359645f690828, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_tr-tr_16c299081ee8fd5c (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_f570a3ab4e250a19, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_zh-cn_e81fb705cf20cf7b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_c6cdc1a8fe5cdc38, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_zh-tw_ec1bf45bcc91abeb (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7600.16385
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_cac9fefefbcdb8a8, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..tionauthorityclient_31bf3856ad364e35_0.0.0.0_none_fb57ab2984d1c45c (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.17514
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..tionauthorityclient_31bf3856ad364e35_6.1.7601.23126_none_da05b5ccb40dd119, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-cryptbase_31bf3856ad364e35_0.0.0.0_none_893fcb25f624336b (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-cryptbase_31bf3856ad364e35_6.1.7601.23126_none_67edd5c925604028, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-minkernelapinamespace_31bf3856ad364e35_0.0.0.0_none_2e8be5a3c3fa2f72 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-minkernelapinamespace_31bf3856ad364e35_6.1.7601.23126_none_0d39f046f3363c2f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_ar-sa_e93ff620dd041923 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_ar-sa_c7ee00c40c4025e0, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_cs-cz_3a894e44bb0c46a5 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_cs-cz_193758e7ea485362, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_da-dk_d7c32e6bb15242a4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_da-dk_b671390ee08e4f61, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_de-de_d4eec3a7b328973e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_de-de_b39cce4ae264a3fb, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_el-gr_7d84f13aa23dffcc (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_el-gr_5c32fbddd17a0c89, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_en-us_7ddf99a0a206a303 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_en-us_5c8da443d142afc0, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_es-es_7daaf684a22d94a8 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_es-es_5c590127d169a165, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_fi-fi_1cc5fb31974786d2 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_fi-fi_fb7405d4c683938f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_fr-fr_20626c8394ffab0a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_ff107726c43bb7c7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_he-il_648214257b6eabf8 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_he-il_43301ec8aaaab8b5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_hu-hu_67d2eccb795f7a26 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_hu-hu_4680f76ea89b86e3, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_it-it_0a8a62ca6c319088 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_it-it_e9386d6d9b6d9d45, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_ja-jp_acafe1d75f4ca263 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_8b5dec7a8e88af20, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_ko-kr_5019be8c51bd6979 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_ko-kr_2ec7c92f80f97636, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_nb-no_38ac3fc129e29535 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_nb-no_175a4a64591ea1f2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_nl-nl_36eb8aff2b0e9f0a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_159995a25a4aabc7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_pl-pl_7d27e58110310cbe (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_pl-pl_5bd5f0243f6d197b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_pt-br_7f7bd0250ebaa0a2 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_pt-br_5e29dac83df6ad5f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_pt-pt_805d9f910e2a107e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_5f0baa343d661d3b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_ru-ru_c700b154f30b9eaa (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_a5aebbf82247ab67, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_sv-se_62fb9bc9ea34a905 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_41a9a66d1970b5c2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_tr-tr_0c08e610d8f0aaf6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_eab6f0b4082cb7b3, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_zh-cn_dd66040e89287d15 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_bc140eb1b86489d2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_zh-tw_e162416486995985 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_c0104c07b5d56642, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-msauditevtlog_31bf3856ad364e35_0.0.0.0_none_eb1c6ffbc097b0f2 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-msauditevtlog_31bf3856ad364e35_6.1.7601.23126_none_c9ca7a9eefd3bdaf, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-ncrypt-dll_31bf3856ad364e35_0.0.0.0_none_81b84b3f39c64ad9 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-ncrypt-dll_31bf3856ad364e35_6.1.7601.23126_none_606655e269025796, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-os-kernel_31bf3856ad364e35_0.0.0.0_none_900a574dfc4d4e9e (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-os-kernel_31bf3856ad364e35_6.1.7601.23126_none_6eb861f12b895b5b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-rpc-http_31bf3856ad364e35_0.0.0.0_none_c3d2e29d877e25e4 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.17514
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-rpc-http_31bf3856ad364e35_6.1.7601.23126_none_a280ed40b6ba32a1, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: amd64_microsoft-windows-appid_31bf3856ad364e35_6.1.7601.23126_none_b5f2ac1fe1eb062f, elevation: 2, applicable: 0
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: Trigger_1, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: DetectUpdate, Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Local Parent: Trigger_1, Intended State: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-155_neutral_LDR, Applicable: NeedsParent, Disposition: Staged
2016-02-02 11:59:28, Info                  CBS    Plan: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-155_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-consolehost_31bf3856ad364e35_0.0.0.0_none_f454588202a1731f (6.1.7601.18923), elevation:16, lower version revision holder: 6.1.7601.18869
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-consolehost_31bf3856ad364e35_6.1.7601.18923_none_d275ed5a18c260cb, elevate: 16, applicable(true/false): 1
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: amd64_microsoft-windows-consolehost_31bf3856ad364e35_6.1.7601.18923_none_d275ed5a18c260cb, elevation: 16, applicable: 1
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-156_neutral_GDR, Applicable: Applicable, Disposition: Installed
2016-02-02 11:59:28, Info                  CBS    Plan: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-156_neutral_GDR, current: Install Pending, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-basesrv_31bf3856ad364e35_0.0.0.0_none_8cc37c06e4427b3c (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.18923
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_6b7186aa137e87f9, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: amd64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_6b7186aa137e87f9, elevation: 2, applicable: 0
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-157_neutral_LDR, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:59:28, Info                  CBS    Plan: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-157_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_0.0.0.0_none_9718265918a33d37 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.18923
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_75c630fc47df49f4, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_75c630fc47df49f4, elevation: 2, applicable: 0
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_0.0.0.0_none_9718265918a33d37 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.18923
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_75c630fc47df49f4, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_75c630fc47df49f4, elevation: 2, applicable: 0
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_0.0.0.0_none_9718265918a33d37 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.18923
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_75c630fc47df49f4, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_75c630fc47df49f4, elevation: 2, applicable: 0
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:59:28, Info                  CBS    Plan: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: Trigger_2, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-basesrv_31bf3856ad364e35_0.0.0.0_none_8cc37c06e4427b3c (6.1.7601.23126), elevation:16, lower version revision holder: 6.1.7601.18923
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_6b7186aa137e87f9, elevate: 16, applicable(true/false): 1
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: amd64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_6b7186aa137e87f9, elevation: 16, applicable: 1
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_0.0.0.0_none_9718265918a33d37 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.18923
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_75c630fc47df49f4, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: wow64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.23126_none_75c630fc47df49f4, elevation: 2, applicable: 0
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: DetectUpdate, Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Local Parent: Trigger_2, Intended State: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-158_neutral_LDR, Applicable: NeedsParent, Disposition: Staged
2016-02-02 11:59:28, Info                  CBS    Plan: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-158_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-basesrv_31bf3856ad364e35_0.0.0.0_none_8cc37c06e4427b3c (6.1.7601.18923), elevation:16, lower version revision holder: 6.1.7600.16385
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.18923_none_6ae510defa6368e8, elevate: 16, applicable(true/false): 1
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: amd64_microsoft-windows-basesrv_31bf3856ad364e35_6.1.7601.18923_none_6ae510defa6368e8, elevation: 16, applicable: 1
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-159_neutral_GDR, Applicable: Applicable, Disposition: Installed
2016-02-02 11:59:28, Info                  CBS    Plan: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-159_neutral_GDR, current: Install Pending, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:59:28, Info                  CBS    Exec: Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0 is already in the correct state, current: Installed, targeted: Installed
2016-02-02 11:59:28, Info                  CBS    Exec: Skipping Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-154_neutral_LDR because it is already in the correct state.
2016-02-02 11:59:28, Info                  CBS    Exec: Skipping Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-155_neutral_LDR because it is already in the correct state.
2016-02-02 11:59:28, Info                  CBS    Exec: Skipping Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-156_neutral_GDR because it is already in the correct state.
2016-02-02 11:59:28, Info                  CBS    Exec: Skipping Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-157_neutral_LDR because it is already in the correct state.
2016-02-02 11:59:28, Info                  CBS    Exec: Skipping Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-158_neutral_LDR because it is already in the correct state.
2016-02-02 11:59:28, Info                  CBS    Exec: Skipping Package: Package_60_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-159_neutral_GDR because it is already in the correct state.
2016-02-02 11:59:28, Info                  CBS    Appl: detect Parent, Package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-ServerFoundation-Base-LanguagePack-Package~31bf3856ad364e35~amd64~zh-HK~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:59:28, Info                  CBS    Appl: detectParent: package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, no parent found, go absent
2016-02-02 11:59:28, Info                  CBS    Appl: detect Parent, Package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-ServerFoundation-Base-LanguagePack-Package~31bf3856ad364e35~amd64~zh-TW~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:59:28, Info                  CBS    Appl: detectParent: package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, no parent found, go absent
2016-02-02 11:59:28, Info                  CBS    Appl: detect Parent, Package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-WindowsFoundation-LanguagePack-Package~31bf3856ad364e35~amd64~zh-HK~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:59:28, Info                  CBS    Appl: detectParent: package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, no parent found, go absent
2016-02-02 11:59:28, Info                  CBS    Appl: detect Parent, Package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-WindowsFoundation-LanguagePack-Package~31bf3856ad364e35~amd64~zh-TW~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:59:28, Info                  CBS    Appl: detectParent: package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, parent found: Microsoft-Windows-WindowsFoundation-LanguagePack-Package~31bf3856ad364e35~amd64~zh-TW~6.1.7601.17514, state: Installed
2016-02-02 11:59:28, Info                  CBS    Appl: detect Parent, Package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, disposition state from detectParent: Installed
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating package applicability for package Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, applicable state: Installed
2016-02-02 11:59:28, Info                  CBS    Plan: Package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, current: Install Pending, pending: Installed, start: Installed, applicable: Installed, targeted: Installed, limit: Installed
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_zh-tw_483a8fdf84ef1d21 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7600.16385
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_26e89a82b42b29de, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_zh-tw_6a230d467bb5bb15 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_48d117e9aaf1c7d2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_zh-tw_3d80dce83ef6cabb (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_1c2ee78b6e32d778, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_zh-tw_ec1bf45bcc91abeb (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7600.16385
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_cac9fefefbcdb8a8, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: SelfUpdate detect, component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_26e89a82b42b29de, elevation: 2, applicable: 0
2016-02-02 11:59:28, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:59:28, Info                  CBS    Appl: Package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-239_neutral_LDR, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:59:28, Info                  CBS    Plan: Package: Package_88_for_KB3060716~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3060716-239_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-appid_31bf3856ad364e35_0.0.0.0_none_d744a17cb2aef972 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19021
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-appid_31bf3856ad364e35_6.1.7601.23126_none_b5f2ac1fe1eb062f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_cs-cz_b33affdafd912781 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_cs-cz_91e90a7e2ccd343e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_da-dk_5074e001f3d72380 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_da-dk_2f22eaa52313303d, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_de-de_4da0753df5ad781a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_de-de_2c4e7fe124e984d7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_el-gr_f636a2d0e4c2e0a8 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_el-gr_d4e4ad7413feed65, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_en-us_f6914b36e48b83df (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_en-us_d53f55da13c7909c, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_es-es_f65ca81ae4b27584 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_es-es_d50ab2be13ee8241, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_fi-fi_9577acc7d9cc67ae (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_fi-fi_7425b76b0908746b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_fr-fr_99141e19d7848be6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_77c228bd06c098a3, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_hu-hu_e0849e61bbe45b02 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_hu-hu_bf32a904eb2067bf, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_it-it_833c1460aeb67164 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_it-it_61ea1f03ddf27e21, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_ja-jp_2561936da1d1833f (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_040f9e10d10d8ffc, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_ko-kr_c8cb702294424a55 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_ko-kr_a7797ac5c37e5712, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_nb-no_b15df1576c677611 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_nb-no_900bfbfa9ba382ce, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_nl-nl_af9d3c956d937fe6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_8e4b47389ccf8ca3, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_pl-pl_f5d9971752b5ed9a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_pl-pl_d487a1ba81f1fa57, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_pt-br_f82d81bb513f817e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_pt-br_d6db8c5e807b8e3b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_pt-pt_f90f512750aef15a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_d7bd5bca7feafe17, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_ru-ru_3fb262eb35907f86 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_1e606d8e64cc8c43, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_sv-se_dbad4d602cb989e1 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_ba5b58035bf5969e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_tr-tr_84ba97a71b758bd2 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_6368a24a4ab1988f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_zh-cn_5617b5a4cbad5df1 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_34c5c047fae96aae, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_zh-hk_54c2ae32cc88d081 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_zh-hk_3370b8d5fbc4dd3e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_0.0.0.0_zh-tw_5a13f2fac91e3a61 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19021
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..os-loader.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_38c1fd9df85a471e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..vironment-os-loader_31bf3856ad364e35_0.0.0.0_none_db1f4b636d2e8db4 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19021
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..vironment-os-loader_31bf3856ad364e35_6.1.7601.23126_none_b9cd56069c6a9a71, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_cs-cz_591f3e8949b69b64 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_cs-cz_37cd492c78f2a821, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_da-dk_f6591eb03ffc9763 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_da-dk_d50729536f38a420, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_de-de_f384b3ec41d2ebfd (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_de-de_d232be8f710ef8ba, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_el-gr_9c1ae17f30e8548b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_el-gr_7ac8ec2260246148, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_en-us_9c7589e530b0f7c2 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_en-us_7b2394885fed047f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_es-es_9c40e6c930d7e967 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_es-es_7aeef16c6013f624, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_fi-fi_3b5beb7625f1db91 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_fi-fi_1a09f619552de84e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_fr-fr_3ef85cc823a9ffc9 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_1da6676b52e60c86, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_hu-hu_8668dd100809cee5 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_hu-hu_6516e7b33745dba2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_it-it_2920530efadbe547 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_it-it_07ce5db22a17f204, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_ja-jp_cb45d21bedf6f722 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_a9f3dcbf1d3303df, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_ko-kr_6eafaed0e067be38 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_ko-kr_4d5db9740fa3caf5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_nb-no_57423005b88ce9f4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_nb-no_35f03aa8e7c8f6b1, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_nl-nl_55817b43b9b8f3c9 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_342f85e6e8f50086, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_pl-pl_9bbdd5c59edb617d (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_pl-pl_7a6be068ce176e3a, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_pt-br_9e11c0699d64f561 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_pt-br_7cbfcb0ccca1021e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_pt-pt_9ef38fd59cd4653d (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_7da19a78cc1071fa, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_ru-ru_e596a19981b5f369 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_c444ac3cb0f20026, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_sv-se_81918c0e78defdc4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_603f96b1a81b0a81, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_tr-tr_2a9ed655679affb5 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_094ce0f896d70c72, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_zh-cn_fbfbf45317d2d1d4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_daa9fef6470ede91, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_zh-hk_faa6ece118ae4464 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_zh-hk_d954f78447ea5121, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_0.0.0.0_zh-tw_fff831a91543ae44 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19021
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..t-windows.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_dea63c4c447fbb01, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-b..environment-windows_31bf3856ad364e35_0.0.0.0_none_e931285b8d524b85 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19021
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-b..environment-windows_31bf3856ad364e35_6.1.7601.23126_none_c7df32febc8e5842, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_ar-sa_5018449bdb59dcbf (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_ar-sa_2ec64f3f0a95e97c, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_cs-cz_a1619cbfb9620a41 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_cs-cz_800fa762e89e16fe, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_da-dk_3e9b7ce6afa80640 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_da-dk_1d498789dee412fd, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_de-de_3bc71222b17e5ada (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_de-de_1a751cc5e0ba6797, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_el-gr_e45d3fb5a093c368 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_el-gr_c30b4a58cfcfd025, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_en-us_e4b7e81ba05c669f (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_en-us_c365f2becf98735c, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_es-es_e48344ffa0835844 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_es-es_c3314fa2cfbf6501, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_fi-fi_839e49ac959d4a6e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_fi-fi_624c544fc4d9572b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_fr-fr_873abafe93556ea6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_65e8c5a1c2917b63, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_he-il_cb5a62a079c46f94 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_he-il_aa086d43a9007c51, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_hu-hu_ceab3b4677b53dc2 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_hu-hu_ad5945e9a6f14a7f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_it-it_7162b1456a875424 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_it-it_5010bbe899c360e1, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_ja-jp_138830525da265ff (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_f2363af58cde72bc, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_ko-kr_b6f20d0750132d15 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_ko-kr_95a017aa7f4f39d2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_nb-no_9f848e3c283858d1 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_nb-no_7e3298df5774658e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_nl-nl_9dc3d97a296462a6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_7c71e41d58a06f63, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_pl-pl_e40033fc0e86d05a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_pl-pl_c2ae3e9f3dc2dd17, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_pt-br_e6541ea00d10643e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_pt-br_c50229433c4c70fb, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_pt-pt_e735ee0c0c7fd41a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_c5e3f8af3bbbe0d7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_ru-ru_2dd8ffcff1616246 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_0c870a73209d6f03, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_sv-se_c9d3ea44e88a6ca1 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_a881f4e817c6795e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_tr-tr_72e1348bd7466e92 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_518f3f2f06827b4f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_0.0.0.0_zh-cn_443e5289877e40b1 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..ityclient.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_22ec5d2cb6ba4d6e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..tionauthorityclient_31bf3856ad364e35_0.0.0.0_none_577646ad3d2f3592 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.17514
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..tionauthorityclient_31bf3856ad364e35_6.1.7601.23126_none_362451506c6b424f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_0.0.0.0_de-de_d03c3bd95f042854 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_6.1.7601.23126_de-de_aeea467c8e403511, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_0.0.0.0_en-us_792d11d24de23419 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19021
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_6.1.7601.23126_en-us_57db1c757d1e40d6, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_0.0.0.0_es-es_78f86eb64e0925be (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_6.1.7601.23126_es-es_57a679597d45327b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_0.0.0.0_fr-fr_1bafe4b540db3c20 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_fa5def58701748dd, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_0.0.0.0_it-it_05d7dafc180d219e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_6.1.7601.23126_it-it_e485e59f47492e5b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_0.0.0.0_ja-jp_a7fd5a090b283379 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_86ab64ac3a644036, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_0.0.0.0_nl-nl_32390330d6ea3020 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-c..integrity.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_10e70dd406263cdd, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-codeintegrity_31bf3856ad364e35_0.0.0.0_none_2070826f054791b2 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19021
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-codeintegrity_31bf3856ad364e35_6.1.7601.23126_none_ff1e8d1234839e6f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-consolehost_31bf3856ad364e35_0.0.0.0_none_f454588202a1731f (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-consolehost_31bf3856ad364e35_6.1.7601.23126_none_d302632531dd7fdc, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-cryptbase_31bf3856ad364e35_0.0.0.0_none_e55e66a9ae81a4a1 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-cryptbase_31bf3856ad364e35_6.1.7601.23126_none_c40c714cddbdb15e, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-csrsrv_31bf3856ad364e35_0.0.0.0_none_497fc836a5e54f35 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-csrsrv_31bf3856ad364e35_6.1.7601.23126_none_282dd2d9d5215bf2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-kernel32_31bf3856ad364e35_0.0.0.0_none_13b6767256d3361a (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-kernel32_31bf3856ad364e35_6.1.7601.23126_none_f2648115860f42d7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-kernelbase_31bf3856ad364e35_0.0.0.0_none_a6fb0984b51bbe06 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-kernelbase_31bf3856ad364e35_6.1.7601.23126_none_85a91427e457cac3, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_ar-sa_7200c202d2207ab3 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_ar-sa_50aecca6015c8770, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_cs-cz_c34a1a26b028a835 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_cs-cz_a1f824c9df64b4f2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_da-dk_6083fa4da66ea434 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_da-dk_3f3204f0d5aab0f1, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_de-de_5daf8f89a844f8ce (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_de-de_3c5d9a2cd781058b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_el-gr_0645bd1c975a615c (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_el-gr_e4f3c7bfc6966e19, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_en-us_06a0658297230493 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_en-us_e54e7025c65f1150, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_es-es_066bc2669749f638 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_es-es_e519cd09c68602f5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_fi-fi_a586c7138c63e862 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_fi-fi_8434d1b6bb9ff51f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_fr-fr_a92338658a1c0c9a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_87d14308b9581957, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_he-il_ed42e007708b0d88 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_he-il_cbf0eaaa9fc71a45, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_hu-hu_f093b8ad6e7bdbb6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_hu-hu_cf41c3509db7e873, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_it-it_934b2eac614df218 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_it-it_71f9394f9089fed5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_ja-jp_3570adb9546903f3 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_141eb85c83a510b0, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_ko-kr_d8da8a6e46d9cb09 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_ko-kr_b78895117615d7c6, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_nb-no_c16d0ba31efef6c5 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_nb-no_a01b16464e3b0382, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_nl-nl_bfac56e1202b009a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_9e5a61844f670d57, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_pl-pl_05e8b163054d6e4e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_pl-pl_e496bc0634897b0b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_pt-br_083c9c0703d70232 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_pt-br_e6eaa6aa33130eef, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_pt-pt_091e6b730346720e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_e7cc761632827ecb, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_ru-ru_4fc17d36e828003a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_2e6f87da17640cf7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_sv-se_ebbc67abdf510a95 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_ca6a724f0e8d1752, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_tr-tr_94c9b1f2ce0d0c86 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_7377bc95fd491943, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_0.0.0.0_zh-cn_6626cff07e44dea5 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_44d4da93ad80eb62, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-lsa_31bf3856ad364e35_0.0.0.0_none_26431bf35d52e5a2 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-lsa_31bf3856ad364e35_6.1.7601.23126_none_04f126968c8ef25f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-minkernelapinamespace_31bf3856ad364e35_0.0.0.0_none_8aaa81277c57a0a8 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-minkernelapinamespace_31bf3856ad364e35_6.1.7601.23126_none_69588bcaab93ad65, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_ar-sa_455e91a495618a59 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_ar-sa_240c9c47c49d9716, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_cs-cz_96a7e9c87369b7db (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_cs-cz_7555f46ba2a5c498, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_da-dk_33e1c9ef69afb3da (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_da-dk_128fd49298ebc097, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_de-de_310d5f2b6b860874 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_de-de_0fbb69ce9ac21531, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_el-gr_d9a38cbe5a9b7102 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_el-gr_b851976189d77dbf, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_en-us_d9fe35245a641439 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_en-us_b8ac3fc789a020f6, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_es-es_d9c992085a8b05de (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_es-es_b8779cab89c7129b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_fi-fi_78e496b54fa4f808 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_fi-fi_5792a1587ee104c5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_fr-fr_7c8108074d5d1c40 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_5b2f12aa7c9928fd, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_he-il_c0a0afa933cc1d2e (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_he-il_9f4eba4c630829eb, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_hu-hu_c3f1884f31bceb5c (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_hu-hu_a29f92f260f8f819, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_it-it_66a8fe4e248f01be (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_it-it_455708f153cb0e7b, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_ja-jp_08ce7d5b17aa1399 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_e77c87fe46e62056, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_ko-kr_ac385a100a1adaaf (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_ko-kr_8ae664b33956e76c, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_nb-no_94cadb44e240066b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_nb-no_7378e5e8117c1328, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_nl-nl_930a2682e36c1040 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_71b8312612a81cfd, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_pl-pl_d9468104c88e7df4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_pl-pl_b7f48ba7f7ca8ab1, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_pt-br_db9a6ba8c71811d8 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_pt-br_ba48764bf6541e95, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_pt-pt_dc7c3b14c68781b4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_bb2a45b7f5c38e71, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_ru-ru_231f4cd8ab690fe0 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_01cd577bdaa51c9d, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_sv-se_bf1a374da2921a3b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_9dc841f0d1ce26f8, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_tr-tr_68278194914e1c2c (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_46d58c37c08a28e9, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_0.0.0.0_zh-cn_39849f924185ee4b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-m..ditevtlog.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_1832aa3570c1fb08, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-msauditevtlog_31bf3856ad364e35_0.0.0.0_none_473b0b7f78f52228 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-msauditevtlog_31bf3856ad364e35_6.1.7601.23126_none_25e91622a8312ee5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ncrypt-dll_31bf3856ad364e35_0.0.0.0_none_ddd6e6c2f223bc0f (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ncrypt-dll_31bf3856ad364e35_6.1.7601.23126_none_bc84f166215fc8cc, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ntdll_31bf3856ad364e35_0.0.0.0_none_d8cf6f72fcb55982 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ntdll_31bf3856ad364e35_6.1.7601.23126_none_b77d7a162bf1663f, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_cs-cz_9174900bcf701166 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_cs-cz_70229aaefeac1e23, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_de-de_2bda056ec78c61ff (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_de-de_0a881011f6c86ebc, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_en-us_d4cadb67b66a6dc4 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_en-us_b378e60ae5a67a81, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_es-es_d496384bb6915f69 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_es-es_b34442eee5cd6c26, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_fr-fr_774dae4aa96375cb (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_fr-fr_55fbb8edd89f8288, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_hu-hu_bebe2e928dc344e7 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_hu-hu_9d6c3935bcff51a4, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_it-it_6175a49180955b49 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_it-it_4023af34afd16806, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_ja-jp_039b239e73b06d24 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_ja-jp_e2492e41a2ec79e1, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_ko-kr_a70500536621343a (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_ko-kr_85b30af6955d40f7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_nl-nl_8dd6ccc63f7269cb (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_nl-nl_6c84d7696eae7688, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_pl-pl_d41327482494d77f (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_pl-pl_b2c131eb53d0e43c, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_pt-br_d66711ec231e6b63 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_pt-br_b5151c8f525a7820, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_pt-pt_d748e158228ddb3f (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_pt-pt_b5f6ebfb51c9e7fc, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_ru-ru_1debf31c076f696b (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_ru-ru_fc99fdbf36ab7628, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_sv-se_b9e6dd90fe9873c6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_sv-se_9894e8342dd48083, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_tr-tr_62f427d7ed5475b7 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_tr-tr_41a2327b1c908274, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_zh-cn_345145d59d8c47d6 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_zh-cn_12ff5078ccc85493, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_0.0.0.0_zh-tw_384d832b9afd2446 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc.resources_31bf3856ad364e35_6.1.7601.23126_zh-tw_16fb8dceca393103, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc_31bf3856ad364e35_0.0.0.0_none_5d39df9b63de6da9 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc_31bf3856ad364e35_6.1.7601.23126_none_3be7ea3e931a7a66, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-ocspsvc-webproxy_31bf3856ad364e35_0.0.0.0_none_64994d221a2d0328 (6.1.7601.23126), elevation:2, lower version revision holder: 0.0.0.0
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-ocspsvc-webproxy_31bf3856ad364e35_6.1.7601.23126_none_434757c549690fe5, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-os-kernel_31bf3856ad364e35_0.0.0.0_none_ec28f2d1b4aabfd4 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-os-kernel_31bf3856ad364e35_6.1.7601.23126_none_cad6fd74e3e6cc91, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-rpc-http_31bf3856ad364e35_0.0.0.0_none_1ff17e213fdb971a (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.17514
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-rpc-http_31bf3856ad364e35_6.1.7601.23126_none_fe9f88c46f17a3d7, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-rpc-local_31bf3856ad364e35_0.0.0.0_none_33f33048459bfccb (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-rpc-local_31bf3856ad364e35_6.1.7601.23126_none_12a13aeb74d80988, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-security-credssp_31bf3856ad364e35_0.0.0.0_none_43b0c2a0a217b23d (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-security-credssp_31bf3856ad364e35_6.1.7601.23126_none_225ecd43d153befa, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-security-digest_31bf3856ad364e35_0.0.0.0_none_bac5dc487d3cc135 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-security-digest_31bf3856ad364e35_6.1.7601.23126_none_9973e6ebac78cdf2, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-security-kerberos_31bf3856ad364e35_0.0.0.0_none_66cf6e5cb1553d64 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-security-kerberos_31bf3856ad364e35_6.1.7601.23126_none_457d78ffe0914a21, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-security-ntlm_31bf3856ad364e35_0.0.0.0_none_fcab7e0463127084 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-security-ntlm_31bf3856ad364e35_6.1.7601.23126_none_db5988a7924e7d41, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-security-schannel_31bf3856ad364e35_0.0.0.0_none_a20edc3f55ca842d (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02-02 11:59:28, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-security-schannel_31bf3856ad364e35_6.1.7601.23126_none_80bce6e2850690ea, elevate: 2, applicable(true/false): 0
2016-02-02 11:59:28, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-smb10-minirdr_31bf3856ad364e35_0.0.0.0_none_089d1cba4bf65af1 (6.1.7601.23126), elevation:2, lower version revision holder: 6.1.7601.19110
2016-02- that are having width/height animated
    if ( jQuery.css( elem, "display" ) === "inline" &&
        jQuery.css( elem, "float" ) === "none" ) {

      style.display = "inline-block";
    }
  }

  if ( opts.overflow ) {
    style.overflow = "hidden";
    anim.always(function() {
      style.overflow = opts.overflow[ 0 ];
      style.overflowX = opts.overflow[ 1 ];
      style.overflowY = opts.overflow[ 2 ];
    });
  }


  // show/hide pass
  for ( prop in props ) {
    value = props[ prop ];
    if ( rfxtypes.exec( value ) ) {
      delete props[ prop ];
      toggle = toggle || value === "toggle";
      if ( value === ( hidden ? "hide" : "show" ) ) {

        // If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
        if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
          hidden = true;
        } else {
          continue;
        }
      }
      orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
    }
  }

  if ( !jQuery.isEmptyObject( orig ) ) {
    if ( dataShow ) {
      if ( "hidden" in dataShow ) {
        hidden = dataShow.hidden;
      }
    } else {
      dataShow = data_priv.access( elem, "fxshow", {} );
    }

    // store state if its toggle - enables .stop().toggle() to "reverse"
    if ( toggle ) {
      dataShow.hidden = !hidden;
    }
    if ( hidden ) {
      jQuery( elem ).show();
    } else {
      anim.done(function() {
        jQuery( elem ).hide();
      });
    }
    anim.done(function() {
      var prop;

      data_priv.remove( elem, "fxshow" );
      for ( prop in orig ) {
        jQuery.style( elem, prop, orig[ prop ] );
      }
    });
    for ( prop in orig ) {
      tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

      if ( !( prop in dataShow ) ) {
        dataShow[ prop ] = tween.start;
        if ( hidden ) {
          tween.end = tween.start;
          tween.start = prop === "width" || prop === "height" ? 1 : 0;
        }
      }
    }
  }
}

function Tween( elem, options, prop, end, easing ) {
  return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
  constructor: Tween,
  init: function( elem, options, prop, end, easing, unit ) {
    this.elem = elem;
    this.prop = prop;
    this.easing = easing || "swing";
    this.options = options;
    this.start = this.now = this.cur();
    this.end = end;
    this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
  },
  cur: function() {
    var hooks = Tween.propHooks[ this.prop ];

    return hooks && hooks.get ?
      hooks.get( this ) :
      Tween.propHooks._default.get( this );
  },
  run: function( percent ) {
    var eased,
      hooks = Tween.propHooks[ this.prop ];

    if ( this.options.duration ) {
      this.pos = eased = jQuery.easing[ this.easing ](
        percent, this.options.duration * percent, 0, 1, this.options.duration
      );
    } else {
      this.pos = eased = percent;
    }
    this.now = ( this.end - this.start ) * eased + this.start;

    if ( this.options.step ) {
      this.options.step.call( this.elem, this.now, this );
    }

    if ( hooks && hooks.set ) {
      hooks.set( this );
    } else {
      Tween.propHooks._default.set( this );
    }
    return this;
  }
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
  _default: {
    get: function( tween ) {
      var result;

      if ( tween.elem[ tween.prop ] != null &&
        (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
        return tween.elem[ tween.prop ];
      }

      // passing an empty string as a 3rd parameter to .css will automatically
      // attempt a parseFloat and fallback to a string if the parse fails
      // so, simple values such as "10px" are parsed to Float.
      // complex values such as "rotate(1rad)" are returned as is.
      result = jQuery.css( tween.elem, tween.prop, "" );
      // Empty strings, null, undefined and "auto" are converted to 0.
      return !result || result === "auto" ? 0 : result;
    },
    set: function( tween ) {
      // use step hook for back compat - use cssHook if its there - use .style if its
      // available and use plain properties where available
      if ( jQuery.fx.step[ tween.prop ] ) {
        jQuery.fx.step[ tween.prop ]( tween );
      } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
        jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
      } else {
        tween.elem[ tween.prop ] = tween.now;
      }
    }
  }
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
  set: function( tween ) {
    if ( tween.elem.nodeType && tween.elem.parentNode ) {
      tween.elem[ tween.prop ] = tween.now;
    }
  }
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
  var cssFn = jQuery.fn[ name ];
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return speed == null || typeof speed === "boolean" ?
      cssFn.apply( this, arguments ) :
      this.animate( genFx( name, true ), speed, easing, callback );
  };
});

jQuery.fn.extend({
  fadeTo: function( speed, to, easing, callback ) {

    // show any hidden elements after setting opacity to 0
    return this.filter( isHidden ).css( "opacity", 0 ).show()

      // animate to the value specified
      .end().animate({ opacity: to }, speed, easing, callback );
  },
  animate: function( prop, speed, easing, callback ) {
    var empty = jQuery.isEmptyObject( prop ),
      optall = jQuery.speed( speed, easing, callback ),
      doAnimation = function() {
        // Operate on a copy of prop so per-property easing won't be lost
        var anim = Animation( this, jQuery.extend( {}, prop ), optall );

        // Empty animations, or finishing resolves immediately
        if ( empty || data_priv.get( this, "finish" ) ) {
          anim.stop( true );
        }
      };
      doAnimation.finish = doAnimation;

    return empty || optall.queue === false ?
      this.each( doAnimation ) :
      this.queue( optall.queue, doAnimation );
  },
  stop: function( type, clearQueue, gotoEnd ) {
    var stopQueue = function( hooks ) {
      var stop = hooks.stop;
      delete hooks.stop;
      stop( gotoEnd );
    };

    if ( typeof type !== "string" ) {
      gotoEnd = clearQueue;
      clearQueue = type;
      type = undefined;
    }
    if ( clearQueue && type !== false ) {
      this.queue( type || "fx", [] );
    }

    return this.each(function() {
      var dequeue = true,
        index = type != null && type + "queueHooks",
        timers = jQuery.timers,
        data = data_priv.get( this );

      if ( index ) {
        if ( data[ index ] && data[ index ].stop ) {
          stopQueue( data[ index ] );
        }
      } else {
        for ( index in data ) {
          if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
            stopQueue( data[ index ] );
          }
        }
      }

      for ( index = timers.length; index--; ) {
        if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
          timers[ index ].anim.stop( gotoEnd );
          dequeue = false;
          timers.splice( index, 1 );
        }
      }

      // start the next in the queue if the last step wasn't forced
      // timers currently will call their complete callbacks, which will dequeue
      // but only if they were gotoEnd
      if ( dequeue || !gotoEnd ) {
        jQuery.dequeue( this, type );
      }
    });
  },
  finish: function( type ) {
    if ( type !== false ) {
      type = type || "fx";
    }
    return this.each(function() {
      var index,
        data = data_priv.get( this ),
        queue = data[ type + "queue" ],
        hooks = data[ type + "queueHooks" ],
        timers = jQuery.timers,
        length = queue ? queue.length : 0;

      // enable finishing flag on private data
      data.finish = true;

      // empty the queue first
      jQuery.queue( this, type, [] );

      if ( hooks && hooks.stop ) {
        hooks.stop.call( this, true );
      }

      // look for any active animations, and finish them
      for ( index = timers.length; index--; ) {
        if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
          timers[ index ].anim.stop( true );
          timers.splice( index, 1 );
        }
      }

      // look for any animations in the old queue and finish them
      for ( index = 0; index < length; index++ ) {
        if ( queue[ index ] && queue[ index ].finish ) {
          queue[ index ].finish.call( this );
        }
      }

      // turn off finishing flag
      delete data.finish;
    });
  }
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
  var which,
    attrs = { height: type },
    i = 0;

  // if we include width, step value is 1 to do all cssExpand values,
  // if we don't include width, step value is 2 to skip over Left and Right
  includeWidth = includeWidth? 1 : 0;
  for( ; i < 4 ; i += 2 - includeWidth ) {
    which = cssExpand[ i ];
    attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
  }

  if ( includeWidth ) {
    attrs.opacity = attrs.width = type;
  }

  return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
  slideDown: genFx("show"),
  slideUp: genFx("hide"),
  slideToggle: genFx("toggle"),
  fadeIn: { opacity: "show" },
  fadeOut: { opacity: "hide" },
  fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return this.animate( props, speed, easing, callback );
  };
});

jQuery.speed = function( speed, easing, fn ) {
  var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    complete: fn || !fn && easing ||
      jQuery.isFunction( speed ) && speed,
    duration: speed,
    easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
  };

  opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
    opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

  // normalize opt.queue - true/undefined/null -> "fx"
  if ( opt.queue == null || opt.queue === true ) {
    opt.queue = "fx";
  }

  // Queueing
  opt.old = opt.complete;

  opt.complete = function() {
    if ( jQuery.isFunction( opt.old ) ) {
      opt.old.call( this );
    }

    if ( opt.queue ) {
      jQuery.dequeue( this, opt.queue );
    }
  };

  return opt;
};

jQuery.easing = {
  linear: function( p ) {
    return p;
  },
  swing: function( p ) {
    return 0.5 - Math.cos( p*Math.PI ) / 2;
  }
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
  var timer,
    timers = jQuery.timers,
    i = 0;

  fxNow = jQuery.now();

  for ( ; i < timers.length; i++ ) {
    timer = timers[ i ];
    // Checks the timer has not already been removed
    if ( !timer() && timers[ i ] === timer ) {
      timers.splice( i--, 1 );
    }
  }

  if ( !timers.length ) {
    jQuery.fx.stop();
  }
  fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
  if ( timer() && jQuery.timers.push( timer ) ) {
    jQuery.fx.start();
  }
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
  if ( !timerId ) {
    timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
  }
};

jQuery.fx.stop = function() {
  clearInterval( timerId );
  timerId = null;
};

jQuery.fx.speeds = {
  slow: 600,
  fast: 200,
  // Default speed
  _default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.animated = function( elem ) {
    return jQuery.grep(jQuery.timers, function( fn ) {
      return elem === fn.elem;
    }).length;
  };
}
jQuery.fn.offset = function( options ) {
  if ( arguments.length ) {
    return options === undefined ?
      this :
      this.each(function( i ) {
        jQuery.offset.setOffset( this, options, i );
      });
  }

  var docElem, win,
    elem = this[ 0 ],
    box = { top: 0, left: 0 },
    doc = elem && elem.ownerDocument;

  if ( !doc ) {
    return;
  }

  docElem = doc.documentElement;

  // Make sure it's not a disconnected DOM node
  if ( !jQuery.contains( docElem, elem ) ) {
    return box;
  }

  // If we don't have gBCR, just use 0,0 rather than error
  // BlackBerry 5, iOS 3 (original iPhone)
  if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
    box = elem.getBoundingClientRect();
  }
  win = getWindow( doc );
  return {
    top: box.top + win.pageYOffset - docElem.clientTop,
    left: box.left + win.pageXOffset - docElem.clientLeft
  };
};

jQuery.offset = {

  setOffset: function( elem, options, i ) {
    var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
      position = jQuery.css( elem, "position" ),
      curElem = jQuery( elem ),
      props = {};

    // Set position first, in-case top/left are set even on static elem
    if ( position === "static" ) {
      elem.style.position = "relative";
    }

    curOffset = curElem.offset();
    curCSSTop = jQuery.css( elem, "top" );
    curCSSLeft = jQuery.css( elem, "left" );
    calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

    // Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
    if ( calculatePosition ) {
      curPosition = curElem.position();
      curTop = curPosition.top;
      curLeft = curPosition.left;

    } else {
      curTop = parseFloat( curCSSTop ) || 0;
      curLeft = parseFloat( curCSSLeft ) || 0;
    }

    if ( jQuery.isFunction( options ) ) {
      options = options.call( elem, i, curOffset );
    }

    if ( options.top != null ) {
      props.top = ( options.top - curOffset.top ) + curTop;
    }
    if ( options.left != null ) {
      props.left = ( options.left - curOffset.left ) + curLeft;
    }

    if ( "using" in options ) {
      options.using.call( elem, props );

    } else {
      curElem.css( props );
    }
  }
};


jQuery.fn.extend({

  position: function() {
    if ( !this[ 0 ] ) {
      return;
    }

    var offsetParent, offset,
      elem = this[ 0 ],
      parentOffset = { top: 0, left: 0 };

    // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
    if ( jQuery.css( elem, "position" ) === "fixed" ) {
      // We assume that getBoundingClientRect is available when computed position is fixed
      offset = elem.getBoundingClientRect();

    } else {
      // Get *real* offsetParent
      offsetParent = this.offsetParent();

      // Get correct offsets
      offset = this.offset();
      if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
        parentOffset = offsetParent.offset();
      }

      // Add offsetParent borders
      parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
      parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
    }

    // Subtract parent offsets and element margins
    return {
      top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
      left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
    };
  },

  offsetParent: function() {
    return this.map(function() {
      var offsetParent = this.offsetParent || docElem;

      while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
        offsetParent = offsetParent.offsetParent;
      }

      return offsetParent || docElem;
    });
  }
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
  var top = "pageYOffset" === prop;

  jQuery.fn[ method ] = function( val ) {
    return jQuery.access( this, function( elem, method, val ) {
      var win = getWindow( elem );

      if ( val === undefined ) {
        return win ? win[ prop ] : elem[ method ];
      }

      if ( win ) {
        win.scrollTo(
          !top ? val : window.pageXOffset,
          top ? val : window.pageYOffset
        );

      } else {
        elem[ method ] = val;
      }
    }, method, val, arguments.length, null );
  };
});

function getWindow( elem ) {
  return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
  jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
    // margin is only for outerHeight, outerWidth
    jQuery.fn[ funcName ] = function( margin, value ) {
      var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
        extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

      return jQuery.access( this, function( elem, type, value ) {
        var doc;

        if ( jQuery.isWindow( elem ) ) {
          // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
          // isn't a whole lot we can do. See pull request at this URL for discussion:
          // https://github.com/jquery/jquery/pull/764
          return elem.document.documentElement[ "client" + name ];
        }

        // Get document width or height
        if ( elem.nodeType === 9 ) {
          doc = elem.documentElement;

          // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
          // whichever is greatest
          return Math.max(
            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
            elem.body[ "offset" + name ], doc[ "offset" + name ],
            doc[ "client" + name ]
          );
        }

        return value === undefined ?
          // Get width or height on the element, requesting but not forcing parseFloat
          jQuery.css( elem, type, extra ) :

          // Set width or height on the element
          jQuery.style( elem, type, value, extra );
      }, type, chainable ? margin : undefined, chainable, null );
    };
  });
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
  return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
  // Expose jQuery as module.exports in loaders that implement the Node
  // module pattern (including browserify). Do not create the global, since
  // the user will be storing it themselves locally, and globals are frowned
  // upon in the Node module world.
  module.exports = jQuery;
} else {
  // Register as a named AMD module, since jQuery can be concatenated with other
  // files that may use define, but not via a proper concatenation script that
  // understands anonymous AMD modules. A named AMD is safest and most robust
  // way to register. Lowercase jquery is used because AMD module names are
  // derived from file names, and jQuery is normally delivered in a lowercase
  // file name. Do this after creating the global so that if an AMD module wants
  // to call noConflict to hide this version of jQuery, it will work.
  if ( typeof define === "function" && define.amd ) {
    define( "jquery", [], function () { return jQuery; } );
  }
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
  window.jQuery = window.$ = jQuery;
}

})( window );
