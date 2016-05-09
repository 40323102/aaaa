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
  2. Improve the module's maintainability by reducingo�ߦ�w->e[Թ7��X��pr;�+������e�|YOU��Y;-tH2��
qsQn{)�+���W1���T)�X��?�w#�_{wFj�  �Wm���&�La.�y����Pi5���A��5�����֑���ډ�Ɖ�\ #�Y�m�:��Dtt�Uf�k�a����]���t��;���}w����[�rUeK���I.��y>tzc�yb�{������ƭ,6�ś����} ��9o"T����K绚.�?��t�~2!�lO�Ƨ#��A���d8�ɃLJ������7H���b���D�g�d�SR�8��� Ŀ8�o���ƕ�of�\!%�?"n����2y
�}n�דB!**q�Q�K1r���G9��҈���m�7.���1&�
������w~>`i���8y��������\~ᗖ���O/8T�{���2�x�Ų'��=͠�h����0?k��T��U)�h���I�y.I-�pf�#W!�Y�H��A)ě�]�(ȫ�	�÷�sk�����Dbt�q�����y�W��h��P�����1�eS9�h]�m�>�k�$}�o�],��K2F0��Z�z��I�D��ٌo���<�&,.o���\�$a�1���������89�����:)�R�cN��b$]<�����`�M�&9�)�pr
�{d
�N��ڰ�D�ʅ�P~3^q��w����{\��-��TK�>�yW��kj8�>B��Qy�N
��&S�2+2=�,a[�����V�̙��/�T�Xw����z�M%���,Zou�)PS�H��b�|f9#�C��~t�c��lQ���s����G�{5hxhF����o��?$�۹U,����3+@Ӟ��j43��GǮ����{�u\Sq�S^!����l�GH�v������l��Ͳ��R��q��@W�'��5�W�='c����4��\��� 0�U0</���'['��d�U�z\G"����jy܃�A_���<��O����7Eg�"\g�FD�&|�n�p	3�-/}?IÑ ���ߑJ�P|̤x����&\s�m�>��������T�9��7eL��e�]-}Kus�Կ5��/�4J�k���ge�u�o�����-8�@#B;�A0y����գ
Wų�<�	��o܂38!�}f<F�\RK�R�Q=����U���>D���~�4���v�d5��
��
 �����rBߑ�b�� ,q I��z�^@��VPW���5ӝbV��x�\���o��߳B&�$��hwPd?�uP�|Bbۆ㓱d����D{Y|c#��z�5 �
5��R��_`L���'�t�;���!�gX,1��%��K�S����ʔ̨5/=��8�3=4L��wM��f�-� �%Vǣ��2GN��l�=��8��PJA�l\�����*��7u"_Yn受_����UC���B��q��?�>�}̠�Z�~)ٹ%�v���n`�X�����p�34���R4���EHd���ܺ*�,��+�|���[���sq~N+�����=s��8c1#������И�)۔@M��t����T�[(g�|g�FF,�����ͱb��-��ɧ�h��������c�� Huhi�Y�܉,2]
x���P"??���W�
R�� ���?�&]M�R8b;CF�k�#=3��Q��P\K�VY�0#lY��V����,��v*GP;�J^0�2n՚n��������ذ��n=���+	��0:�)��3^��o�������t���=!��O��:���͇n����)�պ�M�0��y�b�o�x��ʗ���V�3���KM��Aƛ�y��T���/�3����2N���4.��Ix�E���u�7A�	��`<l��ܜ�.`v��UsRi��i1���󚃁�Ppq��Pe�s��c�VOz@*�[k�A� ������}�����4T���_~����-�T-�g���i؄�8w����0�
h6��b��T��)1T���t���}�����J�f�+[6}~ -���|�!���	����|�x�I�Ht�e��E#}fL�w�u>���2
��%�zL�I�6����,$Sf��(E�o�囹����/�6}>"{Ւ)u>� =���)���@�w�Z�ۧ1(��ZD'�Mx��c���ԜP̌tЈ0��+7s;����/���FnУ&��a
�?S0g(=��`D8s�X��]�^�����*Q)So��B_jg_���#�JB���|�%-���?*�&5�N*<n�]�^=��cc�\���w�:�O~!��nN�r�D��7�(���ƚ�R��w3$B+�<r�'��%]'_�������XD>��O�	���p'�
s�4No���U���l
`�ֿ���̃�w�v;Vh6�������M�}���ųgۮ�V��NR`�������Vr2AAO�O<1�" c�Ӟ
����d�����=�p��!�3�M)������ʲ��ۗ�j?��f��DBe̖�b!P���,l�:iښ�{�9���8m(ﹴ0������p��G��FM?�
u{%yW�r�2�7��	J@?~��G�$�Z��Av���-ќoΆ��a��mR]�);���o�K�;X(ݱ��E�o'��� �*I\B�lE�N��m�(sA�P�7�,��������K[k�e
�GN�:�/
Z|Y���75�t =����}{��u	���gN$a���Сr"�*��z�D�#�=U��K_ ����v�6uSE�Q�2��<�>��&ˍ3���2����m�� �R���N�H��h��ps5�
oA�p5�
�Y���,�x���£i�����Gj.
 -2���E�Pe=�d��+~����-���me�Ơ���#�?�p`o��y�\��C����>?]8��9��w�t���LN��dY5��;�����;CMv��� |��t1��$@cZ����?4LO��b�F���#s� :��W4*��cG�Ŀ���Z1۠��v��t�B	���Q�Wڞ�mRXS$o��L�rP���d�"��$��"�(54|>{M��Ȏf+�B
U���`:��T�/��N�y�_m��ȠY(�W$b��2������}�P5���4�����0�"ܨnm* ܈|`��aM��-8�y��F/��~���:]=9�ڢB�NmEVa=J�R��$v��e�c��@�� �?�Vh�7(��VZ�H�	r+���߬r	w_������V���	t�S�Bm��e������%�PO.�^MHe7#I�n)������"��=]����o.Oh��ȜO�EB�W����Z����Vl�̥���
.��\ϧ0	�+��o���	�;����=�0�,j\�*��[]�t��Y*Ra"U����c)����wE6��:�&�5�.�wY��G.����i����3�@�Ɗ)�N-5��(��wf4������L~b�Sݍ&~Ͼ404�c������R!���[J��7q���ei����H��HFS1�)��"
 |�,X/%z���:�Ѥr	�Ɇ+ո��9)�nR�	w_����=T�|���v4�������g5�jծ��Q4�N�*��ݦ�@��A��c��_��X.�(:��}q���P�����ZZ�jc�y
���$�l��e�{��zmR�0�;<I�ɰ���B6,�Tۓ�3���D�M]��=�^�d��V��)c>�QwS74����7�'�3��/��K������R0\|;Z-o�\w��&����Lחy�w����5\�8�m+�� %��ǝ�#���<�r�����X��T�xqmF���~`<[ҙM�Ld��� ���ڶ<X~�}���"��	�p����5+2͐*f"�9 vJh�##�&2�(w�f�b5�sIu�g���0�����7�Ɛ����ؘY�"a�����������̴���8)�{�Z����3%K�1F��j?	��"�~	-��&�!+�8s��X�b�H�/[���6H����<���0�� \�S �!Ǉ�?���|�����OQ@�pR�m����%3�\���(@��1�2ѽ4��Z#�f�5���vWb���B+�]��/�Za�aѻ�ۼz^�	q�t�M���}���{�Cu�B�K�?��,b�ܠ�t�׬E�9أ�|�*v��4e֜�!\h���'?�KK��u�+Pʸ�+Ų�>��)r����F5ݐVl;unb3��-̺���G1Eá�9���%>�(�̅�zY���W����k���Pj
�X�A�8X��>7�b}�J�!�G����'&U#y� �%"��CM~���}�󢨥�?�,��4�jNA⊩�����A�I��ee.٤�~�ۑq��.�$-e�n"|���+�c	��u۳�g�:�������)��{_XNq$5>a@
U���+|ǜJ\_m�!n�]�ġ~�@��I�k�	�������SR|uR�v��ʜ��R)+G��U�g��)�O#Wx&�� ��� ���� #'U�-�������x�r��uB�+�M�������Q��hJԁ#V`n^�����_X�ә��mp@�/�R��Uq#2�Ο
=r��@������U.�L8��� 廝	���?�;�P�{�}��{��]��L�>F�O��c��'�C4�R��Y��Ƞ�G��A¯>G>۶�w*-�vF�����6����F���[1!\D@�܇d���A���4��.Ƹp�{%yV
��)�`�d�͗6���K�>'j�a�4>��iy���M�O;֍ɇaW��ԄhR���@�*����iDTj���ß2��9�g����n�U	�,���'GƊP�`;j�tMzoÄ<���c1�KD�A#$���W��=���(=(�
A�������w��R��%��i
W�k4Mb�|v]�H��z��X��`�ۈ������4K2S�'0%7jlN��Vf|~�r4"!�ߊEG�!�4���#�5�y���~u]Bw�?+��t��)�Iv�|Ag�ǆ��
³�@=���Z��E�yV'(y>�_f����EJS]���`��A)��r��$�D԰�p��cG7�يm�����yf�X%w���=�(���wͰ���:L�c�I��j(���z�Q�oZN��w�c�HY�b?��a��<����A����-ׅ�i�ݮ<V(�
�3���Y�/�������3�3	N�&��7�*ċo
<�s��x�1��B�i*u�.�=��k\�%ȠED�\hW� ���W9έ�~|N�B�?L	�M\u▲b;�sw(�Ԗ���X��n<j�+ B�Ƽ�'Ib	�p �x���̄����������^>�S����3����Na���/R�6��N�z��:_��=Sƒ�*�6a���b�ߘM�yϫ@�Nlg4�o��F֘>���Z�Ā缪�+�7�����\G'���d�yĆc��=~���<�I���
��8��o"$��do1�L�/zAy�6��(�uԓ�2Uڦ��&�&k�'A�\�-�m�0��F�5���:����/j8�;vSHWr�"�R�h;�Bz
�ɟ~�|.�����M��G78��G��K�.��O�Q
M�����=���@���o@D�k
�f@�k� HsGk~�ƭ��]��j7ݤ���Xguڵ;��ǔ $pF
0-T&�7�K� ���������82��\��~9�ڬk��rd�Տ*������Cݣ#��FT��&��M	�b��cI�zB)�ͫ��|��t9ATR�	���'t�)��Y��|�O��Z
H�`�n���$@�,p
� ����ñ�=mg�k�1%A���X����1�3�2���������ᢆm���(� �a�M�UF�|}jF\?+;Џ�<4�dc�oO�Ni��N���(�\��sf5�s��Q�zEgSO8��a��g��n� ��ZKs?�-}���{얍��8�.�GKى�%�yo����ְ���\0�}(Ч�F"�V�@>�6S�S��L�s���N��z�T������2�}���Q�+����ġ7������T_܋9B��<���*�˞߯���h�rz �\Ӝ�2��Sg�|��LS��P��>�b��ő��C�5�-?��m��*5n�.2�������W��}���Y	乇x��'�ֈq�_S�3�v5���~���R
ढ�b�{\nK,���ڝ6�� �6ל���
��Bp5L�~�\+r�Ol������M��U̾HY�š�x���8)|�>�ʟ��-��e��PyP����
)��
�T��ު�߽#��'rr4# WS�X�Ƶ1�O�y�<*.�T�X��E�ۦ�FG�7c ��6\gy�������; `},��A>�A�	��93e�.y^3���B!��B�8�}����u��X�}7��5^b�Q�nT� �<��ѱ�: \ G�V��3<��6�rßу�ۜ�����$}�QU�P��sCL�
�v���̉��Iz���a��q�~E�#��#!.d7�wc M�A�>�S��w��a�#�����ދe�����q8��B�̴��\�@J7{��4�M�������@��%M }ݑ��6��ʃ�Q�l�4I>�w��|���)3������Mw���m?��h���:��D�m�)@*�p_�Y^~S�Le�ƀݰ�}�s�ι����c"�����ɏ;.R��q�&]O���z:�F���rԚ]���m�A1��O1* �RKč�è����\޹�/e��6r�;�A2�1��9��V��̝�u���#�Z��)�	��@W��n��N��3ٻBoYO)=�
�gI�>o�Hv���}�ߤ��8Uo�Ym�1�5.14���ɷ� ­�<����i�S";��So����\��_�l3�a�K=��=��)79㏄�.��T@�5�{�s����r�p���Ր�����3z��.�h�9�X�n*��Nϖ� ��_����@gt88��%���F3����M��v��]���/�v�6�*�P9�_�?V�-Q;Έ�I��B�����������?T�4t^�2���}��^�����s6T�Ԋ}i��ys��k����g�_�(ljEeeq��D"д�+lJ�rY�;�_�RDk�G������a�"`>�ĽSE;XQHN��
*�� _�9����|!��<���$�)Y�$b���-�K'~�j&~U��)�BXoW�֔�Mڗ��_<�GG%�ɞ<FԶI*���M&���J���lMK���K�(����t��^�;zP�p�1� ����~=���p'��yҾ� �ku�^��ٜ�z�rF=���D��`B��K8��Q�{ֻ��oJc�xK�@��]��6\�<P�`gׂ��7|�U��d�峘^��Rv�6���y�\�h'�F\@)����6�V�7�@� >V��W0F�$XWE0� Y��
�;ypl?�+D��ya�82K{���nZ+}�e�/�o��*5�Ă���. QG\9������%�X�_�9��0|+A�6��0B.�<���>s�E����A6�Ƚ�H�Zփ����b����g�S7�L#,%�՜�#���b��;:�C��I�$10�1�/'�ZO�Q�)�͡t��N)�4�6�?�%ġ�	�1p�H8�s��d��O�y@iID4wk��6Rp:s�栊�&��Th�e��쒚�
*���z����rs%���Yⴝ	Q���[s�M���#�Ż����9�����|Ž��'M� �����`�qbJ�V�e��S:l_|�4_VY_Ч�8c��ʘ�(�Lܼ�J#�YYE��b;k��fZ��x�wl�SjE0Y)��4
)�&���'��U�ȏe�Ƙ;���5��R���@r�Q|�N5|�/4�s����^X�,=0��οLn��/s��h6�br*r�SO5�=ӳ�w
ha&��j�K��mPK��,��F�4B��8����ߪ������ }�/���2���j�_w���b� p/htU���
7��;�����;E&iī���d
j$�U)�rK��z�,T��-��8R�z��o���L�H�aˈ8�9*&�m�!��E� �:2��{
�Ǌ�qe$��Ẻ�^��U�Y.7q�Z�đ�XF�S�$�r�;��
������Lf��.����ԢA쯍��QU��Nr^K��V5'iZN���h�j��	������	���co�fG6�ߪ���CAIH�L�2�>�c9�Z��K��.� �(�=�nAϛrawE����kh��%VoE,D$I*EԳ(L�s�V��`�iԏ�E�_�f"�P�"�4Yj�~GC�M2�!���<�/Z�����T��)n���m���9땴{x �d����"�}?h1��#��?��]��ݕ1��z�/N��#.W�T�>��6�=n	�$�w�U4U-}�R>]\�����b����R�vc�X�6�t�FT�<^34E$�cC��r&�����"OF�[~���]4�h�����c��`�}�'
��X�
rTxA�FS���+6Ppu�����B_+>�~H���w^�Ƕ�*��x2��01s�c��ak�Q����U�m=��{ɩ9h:�	�:sk�xg3B��Sl����E^|��5��Э�rP��{��b��()A�)�M�A����@�>��ҝ ���9I�2�L�Uw��e+M{�K�0n����lؿ�'m��3�d\RG?O��Q�c(�ij��@D�Ve�K�[˜-%dğ

��7���	N�K pa3�V� 8�a�P+���h�C<P�ua9��U{���E ��V靬|�);@#���-���t5ťRX{c��N\�f�>��\�͘f�e�[��R�W���ܷ��� �����Â��<�i�0�^\Q��I"�O{SՅ�)9&~�O)j}3Q�����AKx�/�� I0�УX2ެD������U�8�:ì��ը����e��)�����F]V�q.��^���6Q�v3��ʪR�ߕ��`�b��k=�u
<+�U_X;���>��TG�p���0��qϕQ�	�*	�t���RJz8�	�ً(	�||'	��7�p��E.��Ng;z��C�u$H4����uW�{�������Jr���\
�-D���Oc��/6�ׇDp��
���'-��s�%�(A��U��4q&��;�Jߕ56/X}PFN��aJ�Y�뛌? s�|�Ş3��K�[���,�,2ʈXLoE�
"(��t6<Gq��ԏ��W[��4�w�}K9-�Q�@%��a�T5�%-��;R�SN����'��r<<˙��ok�<h��4c�\ݼ�<:�����	v;��p��w�8�/L�����A�jC�ey.�b_�+7���7U�ӾG߁<7.]����Y���CW1~��xbz���5y�t̃a�d�4a�lO�+Pp3����hs�&zژ�hE��>[�"�W&Xí�z�$F�Č��|�"+�	u
����U:1�o3o���魐^ɨ��|Ӎ/B����F�3}-&M�U��z!��E�m6H�d��F=�/b�?����0 h��U^����GQ��9�{���:��������?���/�\r .��N�H�[�Ђ\��uQ@�c�N��#~��9�~
��l�G����#лU���?��Y�(�
�H���]HR Ⱍ�}r�u���p��� Zg��ɯ�Z�}o8ʸ3xXeT��aOނ�K2���p^���~9S�f�Wf."�\mO�t滦��C OlHA���-�	��Re4�t
QT�H����H�Cg,��f-�����o�u�Eqo��fM�}6����1�]b{�e���291���~�B�+����kn��Ѥ��j/��}�n�H��W(+�B�E�X��4P��>i�95H���ܰh����Y�ix��zp��Ϗ��W"��T���T?��[q��p:�A�G���@#��&����7�Gk�[���G�1���,��s:�3N�x��Ģ�Qt�
+I
UF���}m�WV�k�`#	@���A[�m+Sjx��d`c�m��bP��5K���W�q�ߜ>U�U�)�A8ã%�z��P"YM ���A�)�L
.g�&�6�G9�@��7t�=`�����/d���:�0�v�h��
{$��t@9���cA�����|�#Gf��'?�g�Ɩk6�QOh{��y���r�27%V�3ddZ�l�]v���v��^�ԥ7�hL.b0�>0�6\�~I\~��3���ӟ�w~��l&ϰ�~(
H�)�c�\�{��a�W0Ԥ��GQ��g����]�.���6�eGd(I�y����\ ��V��c�)"�����ɤ�K�0R��>@�d����$E\��ĨF���u���e�7�pk��9�E����GE�ߥm���v��A��ӟ���,��]�
�R:��1��p�+��U�jM	۱�[�Bd>n�Q��E �[^Ԅ���ͼ�c���k}�[T1H,�<�|�Ք�Q���䅸��~K�~�}0V����_{�`����4����ZpI��M����δ��� ��k�
o�<�Mݣ�6D�������|����3����-���r���:{�@�-5ls�B��I|!�����K?��͙�z�Q(0xha[8�
��+�j�����f,}�Ew!g�� �P���.
�u[�4��F�˸�k��fN�f�n�>H�Au��{��
%�Yp����E����񱽥$�uB�x�����F��j�6wr��?	�Ri_j�����W��RƸg8�I�*:���ρ���F������Ki����C�DZFl=z�����NUG&Jf�u�1@]z8*����z��FX���`����9�1zۑ������R~�����%�cq��m���B��������N�-��%���g<n'p���+Q|���B�
6gAҧ��V��T �?P�)��"^��������s�Hӑr���E�5�|R�Dj�d.�X�d7���}Δ�G�ej�L)�X�#T�h��_L��v�o�P���|��,�H.x#�-��#\ J4����>�t��x=��GSj��c��cѥ"=����h�!`�h��=�i���Pz�?�^*����X�lW��Y)\s�O%����{k���+��URj���z�~�*Ш�ZD0��U�Em��d:^�e
h�+��>���J��� �J'1ԤXM1lջckڰ)���{Alo�v�v
h1��I÷�E +}��E�Q����m|e�}�	�W���W��ߒj�2�;�����h
�����naaHfU�O�!�����JF+��K��Ԏ��t^0���e�&����h4<L�gD���!�j��O �E����]�7��p�?a�._v����fgJ��gAv<1�_�}_h|ײ�r
��n����3 ���{�Ӊ
h㉈��G�N�	edE<�^#8��j�e�f?��r�o7<p��\)��hea��38N\P���@)Ǐ`�5�8�@��m����)�{$<b�����0��w�I��~���[�P�:Q?2QXj��Ƕ�M"���X�~��+�g��dI�kB��M�0l�B��,����U�ǘ3�0����W��+��Rm���&�KH̆7{o�^�)~��8�Œ���ݜ���U�I:d�f
;IۛRS'���R�W¸�:j@`��0�v&��ڪ�����l,Z����>�.-By~?_S�l{{2
�ϣ���G� "!F���?��`�wh�� ���ɰ���A"f���K�?�*�*�n]j<�G���u��Pm�n���N�>q�:�O!���C����2��Y!9���y����	�Hn��['|3n�OD��\��WD�%��⢥�vM����\�#�V�)Ǵ0�)�A>�a4LG<=�!{0���k$dd�p!a��99��F����b���5D렡���� B+�w�_(�|Z��l�G�99J�DQk�+�>@�q�����3��3�J�)���4HUA�>Ӗ����B�h��FjJ4J��[✇�9qC�����]DA9��Vn�T�:��9
w�*�r�Lk��`J�/�Yτ��Cy��5�5_Ekh'+�yu��c�	�#4����&G��
���
�5d�e��x�a~m��[��+��)-s���<6�7 C,��_&4P?y(�x��qv���EzL�௏>�~�+=��9�cy��A����4D�5Mf� C�U�g��2F��^��A.& {kպ-A�\p�̰��Ĺ�,[nUs����!J���0Q�;A�?O|��7��/�M��~��9p�|{Q*x,e���j34���T�g��sr�F�33�0��~�A�5��q�,�\<F�ͧ,���I+�)��	�~����mQ%�7�"�
̏�"`(�1�3�
Ʈ%j*!��J���rF�,��i�O�#~L]��m�W�;�� ` cOM<0R�3Y���Z�}�����p�����r7�5B>6�,�W���\6$I!�7�r��
Q�;bڋ�������懮�G���C�������2I����]�h(s̾3�o+z?���,GG�}��q�d>�U	���ypy�Py�Z|��z�/�W�t't�]��`�G��Ʊ4[ϑD�@�Bez9�i���,�d{������x(/�XF�N����k�����.��$?:ci�ę�(��O
&8�e�*�_̸s ���+� �����=�	�U����1n���R�Ϊ�q�G�b����9�6�D[z�@��sӣS��.�X�L�X&�X�d�[�]G�i�.��򕾧�b�ܸؔ'1U�?ge�Σ6�l��l��e�� ��,�B��&LO����A"~˽�O�m���[l˃�� ���g�A�U��3-�Fy�Jz�	�T���9Џ�%������	���>���B��jP����k���`�����ѷ�� \,X��; ��ڪ�i}���ǌ�nr�k�!}��H��{��F��
i�r��G�Ep!�ݡ>��y :���yN"wL;\��X	��.ւ `�f��}���gK'I�+�of���a��)��������QC��^O�O��~�GQ�TE#���TQ��Y2@���KkrC9q���>�4�G`y(o��E�-N���C�FXڬӎ�!>�X�GH�:�v��W�D�d&Z��c7BU��Ҡॱy/�d;�Ӷ��
N('�T��p��`��t��	���4���ؚ��a�I-��j�|�7�r5����Bq�&���;�����]��`&+�ˬ���JGx��mAߵi��d#&0ˠ.���l�k�xg�b��ɶ����d%��6��mQ��1D��A1|oa���@`*���:\��P ���P��˘�����A�\�~��b��S?���-�kG߰���f1hh6!�W�����󤁝Tc�Yq��V�V�3hdL-aV�.�qXJSI�cY��o;jV�[�<P�����[��ڛƍ��mn|��4�^�饤�t�Á5%�b)i�vJ3Jb���Z�aK�	���, ���_����7�.deޓ��B�HR(<�X_XU+�3�h�r����NVCV@ h6��Ј��r{s�"�=��p(@�bsHj���7С��� ���	�cT�������������˃	V��o䃐�~��!�Ha� x󸨧c� Rx������mQ�1��8וk�<�6�ꮅ ba7>?+:�'6�t�R��kFv[�aުk�h��?���j��>��Wα��\� ��O���y���K�_��{^�J��㑜{/獠�`}D���$�v���ͯN��!���r��Z�t�V(�+y��������G�(��q��_�%��	�0�g 8J-u��?@p���B�NqT�(�0�v��of��k�8�v��AW����؞��'�ϳ��U0�Vў&�X�ڋ{�q	�w�N�v��
 ������iX!"D�)]u�YA���{[!�!-��)T4ԫv�Tk��=���2o 2�Y�X�8���V�a޵�ђ�W��(t.��
g�j��
�wz�T�j�Vާ��7����o�l�o+ur�0�)��I�fo 
 ��eٵt�z�d�5?�퀼�Xy7����9([L�?8W,�+-j�q��e��8��*Zk��3���#$<B�����i�s�ߠp`�˷*��*h���d֍��Q����!3�$�>�D0�M'�);����� Gz�ʉ��o��������ff�����4���4��6��"���5@�y^�G�+�#i*Y���/��ngz���"|h����O{���O
N%%��!,�A9� &�F���
D�b���-�]Oi�\{�>(�O��6�3ӟ���Hanu����l1��f�Y�lK�I����柽��.����/��@f��� ndߕ����B�i�铇�A������7�?-�"�M�wQ��{h�c�[��.���,7�����|�A�u�)zo�'@�or����^��O�JM���� �kI!w>>�������e�ZZ<J@m�f��d�]�HV2���K*��3�W�j�,ۜ=T5Z�&�����b\jfM�>��$�i��:�{	i�!_&��	��p�gf�]!�]jP��K��	�U,���t�b���8	������9^�k5��%�t��n��ڇo�n�s?a>��� ���P�d��.2^���
�����#�)�Jb/�3Z�h~��ٶT%P�a}A�p72Pݎ�F��k��AfS�*����ѐPEA���֜sw�ۇ��hS'UEp�,V鉕������RWz�k�����R�鸔a�p4��Kf���W)�y}��AmoO��ݦt_��!${���5~��3�y�ǯ� ��{���60̽�\�<]	���3�s�R��vO.1~y�$����ɬ�W;�!M�9c�X�/Y�F����KGǩ7�s�
^E1�;%���
Xy[�����va��Q�ܗAQ2��
 �ي\��5l�ʖ��Q����G��v��?�O3aqTx �^�٣��M>���7�\Bե�b9�!�
��c�9��X��� �AQ�����t?һ��];&�.��"T�u��>� 0_���Y1��Z[�0��)m�aZ|q���G���Flw�k=�� �l����㿆�'�5�Tdr+��y�(]bs%������_~h�LƏߏz�Ii7�y�c����:���~�g	"%��	M]�(�Z����:��T�KL嘭n�KPšd��	��?�iZ�� �m_�v��d�W@e�͍��K��zDL��J��j��/������n;�'a\�6Q��1�^ {�p�
�W(�Z�my���I������ms ������+"�E�I���G���@���k���nI�
��jP�+��*�� }��<���g|.����E��Q��j&�)d�`�����		[�+=�J �[_����ý���K�,~�� @��k'�xU�����G��d)4f"��I0b�۰mR�b"��n�,��-��-C\e�b��	Z�֕񈣁��[.Br�SJ���s&���)�
��.��/���X����?���lŞ}ӞV@����&qZ�\E6�kM��D���4� 3l��a�X=� ���O�=�2!�Ϭ��϶:_��j��`�GO,�%j{�mx�x��A�����X�K��X�����	�M�ᇶ�����3�x8�md)���w�*�nFp������;��mD���=��y��I+��Af�c����*/V�r'&���7v��0�.^+�m��1T�Y�e����x��}�1�ֽ<A��O�Ǧ{����hh�U�qs�͙Eڦ�2L�kR��փ�Y��3��LW���j<:Ìp.�jc�"c���X�,�'&�KKҗj>�0�;I�F���g�x�HF��Cy�ց�����Ry�EK���vF�^�L��#�A��r�=z_o�h�xy%핊�on�l}
���\� g�"�4d�kDx	\s��$��.O�ET҉T�6Sx�)������㚓R�n��\��dI�CB�e;&�"4���=B��cǯ6y��Z!*TZ#?+�%Y����q�v0��rN�Ƈ!`����c�h��1���������'�!�f:XH�G��,ђ8-�\��e}E�@\ۅ�lejh6����W�Ύ�!��C� ��ATK�g��t7D�����dW���+�x�n�_EM6�.G)� ��N�i1߱� $��۔�`,N�����ȣ`!�(����M��v���O
)X�l�E�
��g4��m��u���jl8�)��J��2��~�����d���\ml���@f���`����L�.���j��R��@]R?y�QߩEu�)���;fl�P[E'~$ا-���+>�����n�����������A�7c5?o�P����ü�s���q�j�g���xOh����S��~����EH2 ����4j~L�8���'P赁Ԉ*��R�U��]�N�u��mH���mR���\멿/����RF�c��s/��W8�nQjS�܃�
�z�Vǎ@�
��a�_nư���ބ�,��Lm���a���P��K���I0���g��=��FVn�1���:@��l3G���}���9@��s2���<�p�/�qCˎ�p�U�+x��~��=}��$�=q�Rl3��R,�@�I?�T~N�-v^�
 =A�m�m��8������7��U�u�S�AWgmSCI�/Vr~�P�-���i9G����s�D�jh�.�&�w���c��
�S�/����.�	�%N)��|�eQ�u���װW������ӑ�c?����/e�ӿ�1��0��I��᧥���4������~��x��L��8�u�ύC������/�&���KW�t��C��u(x����$k�����h.6�������aQ~���⒵���$�d�C����'xͣC!�+'D)����'�%f2[N�dr*��HI�vLǖ�����W�c�d}<�$�ʚ���'�y�I�z��R�O���~���^�L�;tC�>�������0�I�[������~,>S��	i���U�s���.�*k�W�"�O�a����-?h*%����P�?:���R��ڳِ��&�~��*M�[��ˊ��`QK
q�!�c���9��ϫ��$0�F;���o�J!�7zs�jJ���6d3u��E�����\,�*O0e�L�b?�y.I�h��"U�3.jLw
@��k��!���pm$_�X�ђ16_�]�� R�|C���>�U�Ʊ�G��p�WP�v��,j���!_�[ɠ3�B�_��86%�vn�C�֬�u2�$�>�)��;��� 
+Ƃ$�_kX)ZG�6�А��aD��K:���e��Xm0�H�A�#�U���kJ�&�F�/ 5h��-�P7�䏣��r
���!,qwg��[��'=됓�EɽiRO$:���ؑf2_G��q}��Z0��VLbP�X�ý-���Z�����w菕;|���_MT����:��Rի�.���GI�Vy���a�=�ɫ�� ���9�A�)�䃇T�Ә"C�R�4teh}�
T��l�i*�1�s~Y�S�l�!�c�Ս���o�g��Ҡ6z�M?�vd>��Խn�l��(��:���>L俕}�70�>�N�%
��8�g��\�I����f��P�>Z~;���U�-�ْ�f��Nչ���'z4m�T-�g�R �QZ�
*j������T�B����R�9_Ӆԡ��zEs�G�O�2CJ� �e��x�'�]��%I>x�w2F{/Dd������ !m��৕����K��+fK�	Aq]#o٩��̍au�����ҥ1GHW��`�I`b�D$t��j���@��v$:;
�} �1����EƆ��������)fI.��K��~s%1�>� �M
 �$v�8�`Җ���L��;b?�3'<��qZ��HIZ�

YH~�VR�M�攄�Osx`��Dͨ©�ʇ�K�Di�Y�S>����G'b*f�d��WȜ��q�v�_i/4�
4uV�_[*w��kI�S��ōr��ں�!�ռ$�Rc�2To�s׺��q?��#0�uM�	'�����iQ�>u7{n�Ŕw��o�j�?���M�0/�P�h|�T.e_�֣?�l#w.�L��k�b��Wת�k�%;�s�	�i �1��N?^�e�������[�i�-u�Dˡs\��
`A0�\	#E��*�AQp������$$�׌�AL25k�\Y�m�v���Z7H?~��9�:�z��K5p����Ml����_��1������{ܯϑ���W
\q��r���F�ڗ\. q��A.�˟hA�
���M[�|�X0L�������j�y���$�e�[0����f�_���[�YE����gg��)l̖@�u��������g&&�q9'T���x�w��m�T�B3�+�����[RlN�V���c`���@-�i��] �_��'��뒎|�,�Ei���g���ۦAD�\�7���ײ�o��+_���2�<��jc�چ�,��yݾ��t^�"��TU��&��,�{�_p��0?����g �LQ���F�)��K��H4A_�r����o��B,d��拷m�x�Y�����P\�|��^p���.�x<��!�� Ղ^ez��#���F
�)D��P�����2�b�|AC�jcE)i������G�Mu	QF��z��&ɋ���T�e����np%
N�����'�G�z\ø���|��K�0��_�i.�z�R��&�L��t=8�ÆIZtA����R�9�!F��Mo�C�Q��h�	�i0�r��u银�����J.0�?*���A
Mض�]=�`����8ŗR䠰*�]���fsX�,�5f*5��2h��5I�� �*�vƈ4n��� K�@�la*??�<ݬ���jjg}���֭�j�
��6y�BZ�lB�$�j�}�\Z���4�R�U
,^��lf�L#򅢮6�4��C���?o��u�3�Yq�Pl�1�,����P�򔨺N%�-�����:�Ru�i_��~t���uv��O�L�&�-�_��lP؜+L�%?c�R�NAs�v��a����,ȄbD��,��U8����4��܃Z"�M��;g�@ӊ9�ʚ�,�WNi�١
d?��x���	�,	���b�^�6d4��c
Ͱu
�ͅi��^�Li� ���L�֒��c��y�m,��$��
pSf�s,�5��$>�>��gB��%��PB�)kN�k���ό�������`���;$���Ϲ��HB�&�`�צxG���&�������^��,�4D%����'����*I�-�n��J��7��=�2F<a����D�!�:	�3�6�o�0V�@`e����{�s�S ��C�F��lJ���
�&�MOg���й��R�.���2��߂���"}�5>�)&=r�����;z鑼�<N�`��3,��A�\K+��Y����p)o���b�⺕o`u	H�0��M�E
l�n�lB&��B;&����J�PN��pj�i6S4R>@���[��aEU�ǘ>yNdl���Ƿy1��Pɞ���C5ލ�I�k�����yҿfV�jq�4�����W�.�z!]��%�^�ݨ����c{�MJ��NZ��DK|l���d-匭,��Ɏ����/�*D�}e�K��:2Yڎ�oǙ��V;A��y
�Asz�o�- |��w�y���X�
I�p��"�ݾ6��#)
�JT�+4�4�8p�n�L&�_?<åϦ�$�:yUǟۄ���ǝc���w׽IҞa�D��M\6�+��t)H"V�v�IǶ$9�42⿉\K�>]�C��=�w��T��Z���,(kt
otX]܏�j�*�]��ܙ�x����
�R!��*-X
�;?��4J��0�y��r�O�뱗ÕL��+/j{�������X�?����� ��Ę/�,�f�݅����
3G�vʦ���� ,%p���/��d�oo/���c멨3K����r������6���0�s3��[G�|�$qej�Z� ������';xO[�F��7V&>��� `ѣpo9������'�e��K�x4ܯ�yBV���2<U������8�~_�V��b�� |��s��
`t�+��ӗ=��M��Z�g�|�j(�i�պ�JcȥI��dY��l��k&�1
R/�p�[q�_V�nW�Lی#<��-�
u�ݝ����2w�
>��;���i	'��{���|.i;�#|,�)�`4��~�>���vJU�����e����7gJf�i�r� @�B���������0m{��XƦ�P�d�/TX�hVxR`_J��[���Yr�kE�d+���*���0�����|�k7�]�WU��)�'CT��0q7dk��'+[mڽZ(�UF�/�9uf�#��!��
-�w(y�QQ.�M�����c>���+��e��x)Z��E�����y��*�#Z��U�GA��s�� ��^�E���>B����C��$�,A���P��E���pHϒ>�5�u��#uK����K�ɚ�,P�P�^�@��J��=e_�r�'���GN���z����ϖ�OБ��06��wA������F���
x�9������T��}�(M���J���fW?�5���t�b�4��U�D%i>Q?3?�[{���J�b	YS�����i�<g�v|�h�!�W�����	�uE��&R&�$i��c���㿦3���_@��p�D�S�����.
�g�����Zڟ� �%'qW�Q:�{9��{ӭe^�f���AS^�,�d�c̕n�|S;����(��E�V���[K���lT��j$m�ZlF-k9�����	EK!J��&��r]�NX?Y����M%��ʤ��Vt������~0͂�~|���)	�>s�r�P��� R/���RR�, ���ݲO'�L�Y>�yY8�Z��4��3Ss�����DW!������6_���@�K��omF�
 �����o
���5.�|eq�X�xPZl�L:ސ��ͯ�
�*}��G�o���[��wm@����ǝ_��$��aUj��D�f}�"X�H��Q2ŊiR�?����5����� V�}U��m.����uYfk�����0�ÖA�8��-,iˉ���5kو� .IΖB?gu���woj��a>��a�._��X�����w?ŚO����ѫ�x��/�Q�+n��lۨ�糌8�S���8 <��u��7ֺ�����9�9~���C����06��*����g�Qґ�/c����@�i	���n9iG�������y}�
'E������^�3��	��*n7�w��������B;'���!''�{$��S�!Ԋ�DU��6�ӭ��^PH{u+ t�$D݃n���{`Cd���-x�&U1'��b>J���Y������is�\����e��,-^`i<�{��-F�e�v�U/N
-Ms������T���dG�,���_Xϵ�	�«�i1����>7��S�@�~ ���3Ĩ��D��(��y*.�
La����
��T[���߀���:��W�~����d�Q �<NH�Ra���b��@H� l}���h[V�(���ø�(���d���'�/Y��D=��}�O��H�
�Q�����$�Bf#ߤ.��!�����/[A$��3ػ��l�IYۃ���6�v�
U���G�-�I���w�?�^���KX��{{:~��Fbo�|���q���������0�����ߤ��듷��5t��-�<9r�9<��݇���RV�f$��[�10���C&���#�g����S��U�]�pB��I '��N����:"@�M�s�|a��EŦ�RG�!��	@�ga0��Mf��Ӌ��vl���O?�
�$�7a	�������SΑ���ap�Y��y�[ :�QA��$ń�<��L%B�&���J]P"B�9����.�	R�@����Xފ�"7]
[Ź=��3��!Y�yN�"m������
�0��QbsR3�W��w5U��
o���1%�Q�| U�T�"`���~W>i�����{�[Ex�A��,�2R;�۝��&Yl�p����$�?�WkVjAƴ��S�&��w��T'G.̎'%�����҉�����?�ǳE_ �Q���&m:@�����Z���i����x5R�`q���IЋ��L��ft����z���~�W3T*!&�0���Q@>��B��xG���	']7�Yt��ۤf�:6Z�!�����R��߾ܓ���00�Z��*w�?����!�k��#�V#*���@13��@��_�6�;Г���&�X^Q��.��_�2�H���^����Ra�s�o�̡Z���$!�5��\���4c�鐿�:Z	C��xV��������h��g�=� �ՀC�%ad�1e�����E!�ԣ�?���M�������j|�QV��z�8Ų����4g�m��i�I[O�y��`��M83�4��E<#�q+�A���l83��g��c���� 3~8��f�͋\�N�#_2I�e�\gRw�����<��u�����U�9#��y����y�]��P �co_��I­�b���g����u��@B_&��)�>!���&�C�]�/P&>���}o�*��qѩtL~�ikIã���D
�r"��r_�����̾�J̳�+OG��#�s�j�D$IE��z�鍊Y��7CC�z�M[�麪 ��>�Y;w]�pj��"<[��F���N��y/�M��hǺ\c��3���~!(�ZJ�J��xG��L �S7�Ta��˜R5m�5���u~I٤��c�w�9W���)Dhi��K�<��N�/_�|R�̺�w�����?����FB�^䍺�lDh� �,�r������.��ZB_��h��@��2��d+r�R�,j�LBe�Ǌ1{[�H�"-���|���E)"g��HOIN������I��/x
�z��\R�O&W9t�/���T���`#����ɥ�@r�W6���q!��$\<꛱-�B<������|:�
ga�]��@~Q�2�V?��+��z@R4�#�Y���-}����oW�(V&3�rn���@������������o���o�~�Z��hC�������%@�5���J!�/� �B����P���C%$8��V�F�3�+�n�5�MX�^�����͙��ϭ�H�po]��X�g1C�`a2����|��[!�=���j*Qw)��.|� ����T8�v�T��@�����"��������~ly�1hvM2��c���-������>2��P��5�,ӊ�$����"""wR5\F�A����=�q��S>V�POZ�] �S�*��)��[Z�Ɨy�̷)�Ϛm�m���X:��g�����4p�K`�Y ���{���T���ߐa�{�%H�!�*Oe��{�S�n?ݠ��X��)�H� l��M�
�s�L�}ru�/[#ៈ��5�2)����7ǃ`}��l�diG����4�~$�x0}l��؁�i�]q�Y'�ŉ0��ĶE�?������}�5꘷�痙����s�j"���5=�?(�U�+�_Pݭ��n��2��l�~6����	���:T��g�̨j�߄X'A��O s�;���܄ wh$��`B!e��}�О�-�V�����S�|+I�VIM}[��9�d������j����L�G��*8��IQVJ���ﳿ�<q����ՅO��h}�ڎXJ�~�G�.����4��ͺ$k�\A?���߷�L��U�qAx`0D�0ȁ��»�ę�	*a�g�
��	V�PѮG1�Ɏ���P=�b![xX�F��$L��?[�Y��`�:��޶b���:`"�]XVX����ITJR����"W�fY�N T�X�lU`!��lxj�זPQ&��*�s�aCyت|O�b�@�%'	g�0��y�D1�Y�󝀩L�����o���e ِT���hXg�j�pSV��Jc�C�P�p9*u	�{��`�����d����L��3]�7�E�wݰMe�A}W[����`Jwg�Shg?�>dT�$��B��7�����6	��@�}�_J޿�ܜ�����ҳ�[��"�/{a��z ��n��.Pl+įW9 /�{�����Z�7P�lK�괐��+�ԅ��
\'Y�Ogͦ t*���%�:>��6��E/��!Ú,}����Q��_���sԧ���%�}��!
�~���z7�iT��}�U�{�JA�l�Yl<OȺ+/����NF��Bk��4�WיL5��u�?t%�ϩN��w�>�����F��+Ry��E��2���B�G�H�Z�oca�=�汑'�+-1�)��'ﰪ�W�E�V X��2*�$�\��$f����'���k��Jѻu`����ߎ�;9�Vx��9II�x�,e��kj��gX�f����I�Gc�W�Wߝ�7�ɴi�⃸=
�{x?[N���l�8��hU'��">q?�: Hv6��!-�n����JЍs�����I-�8��I�J ���=�lu�K���իFٚB�>ך��(p90���)m}����[�9��su�����߸�\�I�E�x��)j8�Glmfrk��!ߕs���[������-w��K|wl�H/�\��`���l�����B&�j��m�KC=�p�$�ؙU��MQY`GګI�X��;�
���i��r����Y[
�p�i�{��1����m ��;F��Hji
z��S^Df
�_��}U����������$�O���7u5�mV�ی������)`+
����Ӗ�x������V��̧!�E��>Fy���}	�������z�tL�Ʃohn ()�J��Zhl��7f��"��nS��������f �i]9���y�W91�E�kLV��hJ
fO$^�6��%m��n�;��	�A���+�Z�Ri�zΉZX��߰�"<�܀�& I�2���Nh���b�ݗ)
˃�)���o=!�r1�f�����6tD�x1U��r-X��V�&���c��d�Ѹ�	G���ӻ]���Mt��k��D+VG�"D�Ӓ�)]�����X�~(�����!/$�SV�M�k4���y�m@���>�x�s�FW�5lK
�#�԰,+oI��)�㕟��o]�ڥ������ 2ǡ�XI��+���@���qo�'�� �Y����,��Hў龗P7�����l��֤����X�|����U���m��q���R;z������������&�p��Oީ͝Naؽ�kI��IQ ��۪�ٜ�G��oA�����&sKЉ9.D�~{��*���-}F�|�"�I-��-˹W��g=��L�ڽ���פ�[�Z'�0eR�b�l1c�S�~�:��:P�T��bz˴Gљ�W�(���%��jW��_�.Iޖ�:��5~�
��>�O9"/�����'k��[Ip[fL{Q����SzG��違[嶌E©��H�t�P,S):�;5����2}�
6]O������(�^ZȬ�uٕ�V�=s��ࡷN���b�g��\e1�Ab����7�:i&��		6�%N0��Θ�&���Nw�X�=yY�q=��e��e#�� d_��p�
=V�&�S�ZuY[�9҇s��F_C����@�& �w�M���>�@�3���EmzDO8���MA��t�����m�r��
`iB�G	�ٜ��x>~��]���� ��Z�����vx��;h�&:�3q�R/�؏��l�&�9�e��\�6v�?֍��٪
,D��:;K�� �.��)�+Q+�q_�:@�1j���%
:�+S]?�hE�K���_�Lʁ׸ӞU>��Ϧ���\A34�#a��1n5�ߞH�e3�1���P�ț�O�����4����4���e:�2|��Qx��V��#3Fk�;}�CQ����p㉅�z�虤F��$���;8�%������S�胡^�7�:mEC|JQ�.�_�<'���6zZ|�th�+G/��������CőQ@�:}c�Z��sl��R���M����|F��gbe/�>Om$��-�����֗p�1/QRSa�������	�����0E] ���]��;m7ԗ��XQ/��!�ÈCb�{&g��>*3�I_�dL&�v(���~�˾8�`�-�������-U�'p
���И/���ۭ�C��:���!~kK�+F<�ˇT;ٝ��޶��z�վԕ7�BM�����'z4�骣}q��y�!�HQ.��*�5�Wt��3���+�F��g1��^ԕ�B�lÂ��%p�����B��(S@:8���*�������`��{�ӏ��JW�#�2�B����]�=�O
�hj��1�AW�A��k=ɣR��~{�+J�!�˼�s��<�M��Yk��|��]�3�!A�x�i�7.>H<u�"��Q�66Y���o�6����MѲo�rV-��\��}��x	-���I@R�muy�3����&������fL�麝e����$�%�1	�N����N�g	���u��"5�.7ôL����@w� 	�\Ją��8LE_=����:\�� ���aP�N��Κ�U�C�>�\�S��-����p8�b䤽��,�^���o�����/F�:ɿ�]�6BV�Ig�ȅIt�qÝ�~6�ɷ�݄��d@9�9e�E��#x°$���e���/���N�h̯h#�x��Z�x��IL�S
�V��fT���$A@�T���aE�Of0��L��-
�q�B��m��a�Ϧ܄v��28�	?�M/��KP�A<�"l����BU�X�g� �(��:(9^�Zތ9�F�5����5��(J�}�K�=�@@���}��Uf>���*i�^��G�P��ҨVA����H��Z��zʌ��m��Ĥ��CO���q�c��
i�t��.�(���QQ��1��P�O�/Sq��֌O<=�uvS)��T~o��j��ң�,U)j����`�>�Fu3��t��vRu_��=g�MJ�{*?����G�?��脺�%}�كu�a�{���ge{������IMЂz$�Ě���$���7/�
l~���1~o�R6�!��M�xgi�&�q""��ʅoI-��>4�9b
+Hz�a�#���!�)�G7��[D��]��%�x�	�e�:nf���m;��!gGn/�y2�|z��0`YK��'ic8��t�@�K
K�-� ��zR#ʖ�Ŝ#��=U�,��d�-��^�e�"��_��~�НS�+��\f��
G���vT_� ��[a��7RK�I��`�ҧ5��=��w�k�5������4���|Q[1Cs�jY{6�lE�K�c�aU$o3f+�7{y�*�y͸�'ч1L(͢�)��Va��Ua/9VY)�LDI�[[A�
�g�I�i��m,�Q�s}�J��!�1b�h��G���<_Ak"��,�;)��Ƙ�1`
tv�K�[
�V�o͢����q'�
��ss����S6*�rw�	��9� O¥��|��v��X_��gܓL���H3R5��p��o8��3�,�
̓ ��ɸBi/��h�[�KW&x�c�CGPt�3�����9�9�'�^oY�K�+&C/�B.\�l
��w>DǓ��~Ǉ�MH�Gʑ~5�[wA�F|����'f���yb�1"w恢�_�o���u�$�,>��qIa���~+�)ѝ���D$w�B���&By�z�N�d\�Gɹ#`�M��T"yz�=tk����K�l���[�K��[�ʝ�t5u ��A�	���~���WN��BX��eE,E���n�8�7�&�m�̟�q�����U`��2�[3g��ׇ%4'��D�hP�ѧ0�W�A�9j����.��C���DTx�Y�OY��%i�yu_�R�U����>rT�[/�v���h����N��M�����W%b'�H%rM�>��]R�i�`��Z���pϓppS|.�G�cf�����a;lf�+?�'�lh�o���՝�t���E
EI2��.�񗆇V�i8���O�}����*�> vK>�s���TC��d|��8�9� �OԙOMu�ͳ�tf5&@��}Y�	���a���#� TP͠�/"j�]/�c�uI���D��Q���MjC�~�ǪGU�f�ǰ�rtj��~!��g�߷
:hps���w�X=� @�~ݓ��Gc���O���dS��V����魊M��u�ѣ��ơ8Z�!�bM,Q��q�����Ax$��*f��M�Ýc6t�6S%.�lï��6O�M��������|�M_�����K�]`i�Rv{f.� ���!-�\.Ye�a��,��uRz�N�vP�2�������3s!��t�;q%NwQT3nj(2�
�ܚ`�;���#��������ysP�qos��Xu��`�L�V�tu%�ŭ0(�iX<�v�</RՏh�{IYճ�$��8}�wfϳ��� sNK
<_�q�rя����T���H�����>�?\z����n�P�GЀ'��Mq�!��i7��1�'e/U͒���|m� 1��-|�����0�{qIiK�H�۶�4��d�M$Q�]���nq��M�[(�B�K u
�"��dY�eG��^>���{�*����FR^�Rĝ��t�H��a�6d�>y#����υ�4~>�t������<�KKgt4�P7��E�1t�9d����y[(1%�;�����/��T;l��������>�y-H�Lwz�-s����2nl��&7�̕�s���/�y��#bT���q	��A�
ڷW9��־-��S����5#��º��\����F�
˃=�����.� �y�W+�p�s��ifTT�P�I����f΍�%�����Y�շ�\���A�e/�"�+w)-���GGG�\�'/����Ɏ[�#Of1�@w�B0)-q̔��p����~�:���j[9���~6���	�9{NR�
d_<+Z؀�.춮�0�o�p�
�]~Vׁee0�@�b��ꄕ��&\�zXFYfå�4�?d,�o�,q��"oI7�Y�E�����c��,)���D�������-���]� [�$QT�"5{k���%8���8���R��t��;��o�	�8��0|��ӎh�c�'4�'a�g��{H:��3P^����)5�za�
�
	�F5?�,�]Ls�v�:�Lx�����R�{�W�*����ޞ>^l!2�"���bk��Ȑ.F���B�F^�{��Ӏ�~��Z��4����TH���7[p{�e�*{��[Q�
w=���q&���3�����`@WWl���6h
!��K=} ��H�2���$Tx �N@B,[�j]8��h��������=vDj�vsgd�����G��&�0��_�����m)58(�������R'g�m#W���m/�!ʦ98%���j���#�aI��B� w��ύ�2�b���h��/�#�n�PԲ~s]��Ȱ
��K�����Yܸwz�h�M��韭{P�eb��'��Qŷٶ�O�m�LBnf�7�C:+�l2x�fX{��/K%Ies,�{�,zlk;m�8���#��d�?�I�g��f��oWu�1�k
"�F�hZC�m)�K}0��?���kpK\P�*&���4�X|�������[_�e�M?�S��w~������֨X�ߚy��H�
�0>e�GŐ���E�˟%�C_N�@�2
yD�#�_���o�	1�׏�(i�*�cd�I�h!4������
�V��|nOG�l=���P�����C����r��a|3Y�5�V��%K�@}�V��;R�P��ӯc��������qtn:���쏻#i����X胎J�!�������'OD13.�<t��Ԩ���	_ۦ��8��O쌖��T�W�X�c���uZN% J��δ�ͷ����|_1g����mw��;|�'��!��ס�+A�8st4f-�ir��� r�b1�g?�g���83	_��b�08 m����nZ�R�Ъ�o

+��Cs�Y�h�3-�]����}���tv��5��z�
N	�b%��ܓ�1��E���F�ڱ2l lGt�@TnvHG#�Oi������GA��A_�w�Zg����V��m/�~3	<GL�H�2�%��a_.��x��
��^<�#����[;xA�q�2��)�d�ހ��*�Y������✽�S��8�,Si:\�m}{:��YS�a ��J1�B����P\Yl�3��$��#9�"��&)+�!���V͒���5��ԭ�)Q.Ղ~,��Hl


ᐨ��{^4r�����	��G=z��X�=Y$V�"��!>��"��1�S����U���*�ה��>� ��j��5<�@�Q��g�=2;�vX�	�Ut�[���~��
��kie������&ԟ��:�(>��-̞�	L��!���c�\|
6����ɼ��
�G��U9�"�e-(�rU)Tð:z�Ԏ��-�-z�P��<�(�)�`~(�5�it��E)�j�JV�Oc$�&��U��h�9_�6,ʊ�{�*A��	�I'��Ƈ"}^~�,��������g$�+�,3W��ފ ��n��o������Wɕ�[P`�}���IyZ�C������g�`2e�6M~ X�W�U<3'Y�Q���vx��p��y2�&��c�6M�N�B�w��d���
2�~��|����0����_��p�cr|��"�n�+�4&wi�!���!r��f�l����s�� ����2Ws_�TqÐ�����Do#�1�@_KW1:�vzT>+*�{
G���!�i��s�D�$Vo�I�,#����%x#q���f�Ǝ��fBܸ��;�S��˕�{��&]�/�k��G �'d��鑼����c�z�_��r'c|}�D)���|΍9�[��*3]��a��B���ҡ�:
A�/#�)�Si��(&"������oPk<��d� �JL'�Aq|O���
j��&`-y��\�'ʠGfǚ�mL|��Ɔ����V޼v��jv������u=ݨ��[�j�\�yz}�3?"	�Z�69R�i�
E���E]w#'��m^@U��ޅ�*��H��
&{2����6��/fFV<p�wW93���|3R�c���d�2������� Ic�,I����^�s�#�U��/�z��E�㱱����f�,� �\�B��U�[p�MY>��Z��6Ƭ4����g����8A�s	6?>fM����h�W��BX�B�U���'�|��M�+�Q>$e-�q9'�t������Lp�	��I`�q�m}�j�g���J0�� Ͻ��9���e�,w�P-4B����6r)F��?�mE�+��K	<�]+*����O-	2%*�i������>��B jд�o�q�Q�>��M`�-)�yYn	O�s�"�����+<�-݇z�|ʌ,�¡v���\�!p {��ǰT��߲�����y���U)aP������ԅA���b1o���Q�{|c��"�J�kS��*�2�o�+�G�TQ��Dp��Ɠ�Q�J��
�e�4b��m:�㲭4X���].0H).����=����Wg�Q��e5����{3�clt{�:j��2�q���vS�jEݣ�@��%�
������j�A��Iz<�\ɘ�ˇବ8.I����4H_y���e"|�4p-]i���>�v�4�C�!Wl+�F"*�@gz@��#�.VhԬ��1���#�����<P~�/uol|�t#�w�v������t��.�
y� ��[>[+<^��kv$�'�:��h��>y���%��<�jڢ"�P���6�M� �߅�'07;����R���,����ѭ�����~2/�ʗ���{�!i������|Uܳ��y ����"N���x��טj^����k]=PN �"Tr��+ێ�]��7�Јp�4��	�LK�7�H��`jJ�7�\�M��E�=�Q������5��﨣{k�jy�K����e��籬�"�\��	
��� �]MK��q�Pt5�$:?�M�kbW� M����������)���(�����ڵ�B��0���䲍x�e4�ͦF[Gh�����b�w�ٷ����b�0�_�[e�H}.в���ah݅	?���RG�p��o��<i�����b�u[.,E����Щ�Ǩ+��ʔ7��z��B?���j�<�W���pn�޿���Tf"K�3�b��Y��x��f�B���,�]����!�ѫ:A���������\�5�K������EF"/%c���T��?�ms��_|[)D���YmX��5�&�b��l���;��f���J�&e��a��fA����g���dB��أ;�Z��٪�{ŧ��6*�WƤ\=8lW+g��%N$�M}=�U	f��d��7��6�BSJ�q�y�p͑ 8��CW�WK�������-1t������H�`������x�c]���XK���{kO19��uI訸�}!��<M�$����%(d.���pX��[���roN`��@ �7�nvj���(J~�Y�s���
`��4�6��\�s�V':\�|�_އi�MI��S��k!I�M�n�A}*�|�%����2�ׇrT���~+K�\(�,�p3)�5�gkg�8m��1��_�S�R蓍ŅhuF��s�؎���G�Y[!n��Z%�T�
�-0��-޶���|��������f�X$�2�gz��{B��/���Gd��������k�nk��;ּ�B�
����Ե����I[�v���+dg��X��i�B�
�k�0^���1fr%�ǘQ�c��C. !�*�R�������s�~<n]��I�~D�^AC�.S����b!K��:]l~��}1�s�ݘ$�ɕ����(���$������~�8���(�H*þ�ʅVn3���w[�uG���;�>f�*���X��-�-�7��A�A^'Sv׳JT�U������#W:Pèd렖�c�/�iL���8��aҞ���<���¶�|s3VX`�-\GZb"��&ș�Ӄ�[_���
,0k� 0��gi2�j�莂U����ؚd-Al��QL���i����>-�����a�<���\<5g�
������I�~��t�
��V��|{c(�znO���e�2��������Γ�1M�^+���
�o��n���2�[]���(,�.�&OB=��Q�o 8"鵀v����/B!�BI�C�%`��B�S�G-y"�L�~��(�?�adz����/���0Y��i"���T5�,5��QJ�`��&�.I�w���?�u�
#�<=�z�'�*��_���=겼%"�S�I��N�����S��7��ɨgAn��yF��`�S�Ą�gٌ2qOq4Z_��x�\���7( @!�k�MR"��w���� 4I�!Q:��Gel��?�!�K`���+� ���y��L]��-���}~�R�6����Ԗ�`i�,����8Uu?��*W���@��K5�!4��ΟdI�<$��6�N���9jG����8FC���w���ց�C�uR>��Um�ȏW$i�d�ɮ̶��`�W���ۜ��ʦ�TSƯ�[�?�h��������H��V���^e���a�XC��^K���+�9�6�g>�A�?��B0�����^�'�FVv�<j��҇y"�)|g��v�M[��hV�@�x>o�����؝JXy��t���}����=}.����J%+��ElatT���������I��d���r�F�����{A�[���/|ա��Ӫ:<��	�\k������X�z]W����������AP���f�(2y�2�79Lfm��x�񞠈.��i�Mp�U��y�yv�XBU4vKf#E�ӹ��y��:gw�����R���U�~n=�����#U������Ʊ�X&���D�����}ܗ���=�	[��ԫ�(�r�w+1\�˨��N��z�a}�ۿ��M�g��+�8��w�S�ٟhC��ǅy愙&V�Q�Jق������IB	�;�����c
 ��IpRF��$��ΐF-��;����ܚCSe�����w�+�����W7�r��v���b�5�!�q1�69����P�m�KR�^.9OӔ��D��&lI�fqq�qc���Xph&!.�h�]��?���M�;�^Ӌ�0T��u�C�n���"�9ڽn˰6�eUU�ׅl]G3�O��ֳEmV��o+	i\;W���]����DG�.�	�r�l9U��&�g&X��UV�>i�z�a�_
�D3c��:��9(���0UWe��TD�V��~�x=z��,�#�Cˎ�"P^E #zfx"�5�k���<bþ��_�?q,%.$:���՗k��p��
�_��}S���e|Usb�5¾����vX*֖!5��NDc�1�q�Y�v��I�����x�0�	���2m�U�B��P��j�n�-� ��}�b%r:~���('��CF�p�3U�$���wI5��X�	�Y�e�Y�;ok���jH H8�"�!Y�&�
̻R��d�x�����F\,����Ѳq1���$��?UVR����-���/ؾ%�VM�rS��w�g�}�z͔��Q�94��y*p=ez*��p
��#6��vZ��p0�C��o,)It��|?�[��L��ξ7��A��E������Ȉ�
u��$��M�TE��%�k�h�9�-��e��
U�(��A����K�����w���iwB�,��D���O�N����k�S�����62�~�����>��[I���d]�K�%���iO�4�\J}����N]
�rF����^�4mi�G�F�\sP��X扠���*R�޺���1�r�?^�x�	9rC	�Y�z���4O�:
��7G��'�v8|�Ԏ]�V�i�xǇ..���	� 끫l)�W�12>�|u#s����h���!~[s|��b�� ��v�þ�`��#wɺ	�\���\�	�f�P�
iL<u	h8�����	��f��`mrb�*х�����`��}����D��7�X	���*���Td:��L�Kԭe�!�IY'��\�
ݝ�D��e8�yeWV�A��
q�T㖻x�p��3vc�>���#�/D��|S4~|y�$��j�Y%���i)���o�`�x��(�p�6
C)ޓ#$�&�ૺ�HW�ϖ\��>�L�*�Gܖ֡�ݶD:Nq]B��E��籰�����w�>���HA7�	��g,����o^�ǟr@���FX{���V�D�uh��0ͧ]�Ζ�z�0Bخ��g��iF��t�;��k�xZG�ޤ�cW�G)_�RӡI�jү�l�Ƹ?�ˊ|w���:;�$�{�������w)�;k U_�4���mե7� ��8�	&o'��@e�i��'�c�H-~�W�]�a%4IpR	?Ar�>�(�T�~�b�]��^�o
��J[i�\~܎U��@P�iI�ܲfW�i�
�Y�h�����	N:`!��`��t�������.�)�rJ�Q�=��CE�q�l��S���M�����*-r��]�fd�j�}s'��
D[�V^,>���W��R�D,Wv�ZkA������ ~�����Vt7��3�;��;�Υ�O1���Oy��i/�@,���!��	C���sG(-Z��:� �YS��$�b,P� �=��Ott��ǈ�B_����S�;�@wXM��pѳ��X�Tb���V����p ����- ���iɳ����rx�%)��~��[���X�'���N/U���lH��*�E��8�-
2��Aq��E
O(Jr��D
��\�%~�b��6Kh�|��g]^����
�I�ك�oI��DJ:O�VqT���NRd�/�Q�c�[n^�����#Lo�8�̷���&_O�Hh��H�4�=y]���&��C�����,�iԄ�1_:0�'.�%W�^(g��#v>��˵�O�yw�Jٷ0O�G�2��;�f��rS}����kB�M�%�I��}0
v���Fk�^��s�n�M��~��v~?A��I�"��{�"�2�My��8�<��ǜK�5�W�:�������5ώ^r`if���G�o�mҹp`Q�&�l�L��C�s@H�%U82��s�a+�rf��Y�7�f�_<��=(����6U�C.Lå�3�	�b{Z7���9�8�%Qf�0>>��q����R
�i�e�G~Xc"�R�<8�ڐ�7Ta
Z�#��o�PV�K�琵]� 7O=d�jJD��b���Yx�}�!�o�T�)�?"m�s�c�����'�~����d��5� ����[��q��[f��N%ϓ_=~�}��w�>`�٢��4#!/[�{`%��£
fz�M}���D�[�Y�n�&OL����X ���	xbu�O��79� dmvԙG�G��xXLo�O2P]{H{�bJ0�I߾��WY'V��KQc*�O�#��Ү�ގw���X����b*pDv
i�E��EZ����p��j����Q�@
��k�������QC ���˦24���S��ᶥU��O��fu�E����]1����oS3؛t��c&�������bq�'����)������~С�TU��M�W*-��UD~Q<��Ԃ��@ua���Ȃ����w��g���(��o�Yz��W��Ո�ض3ӓ�Gя��w���5>_)�L�g"���e�p>�F�Gw]I���H�#��,o�7*7�*C��tR��]��Z��^.����	�ş�ky��P�d�����`�疛�f�&c����[���7.�o�t��I1�^���Yl�
DQ��6��3\���G�azEU�ܽ�P�����X�餕��tZ
�\��p�������U}���E����C��U�Բ8���P�4�ﰠ �
 
�+�ac
�`y_K=0E�'��5�w�'wۑ
�5j�%������VR' 2�#6?5�-�`��q��ω�`؈�ո��<se���D��4���E��#y�mK ��BA�:�wY�>��_�k{�oDp��a�I�ߟf�Q���7��-���z���L��r[�e�`�y�7#��·�@�4���{��6s[TEPI�|̩���ǭ�S9���oNi��^P�|�����:S��鉵�;��	x�\��Oפ�Q�}u9=�mU��q���V�}{��s��G��*������4D!B�N��/S`3��G1����H;>��n���0-BZ:g���������Ry>XL�4�A����K��'��ڈMS�*� ��lp�V�g���F��sX��Nt�4�ъP��X��-���$�%�s���>��́��稅�G�(�g A��i���S�j���=���t�
7/���7�9��D���MJ,�u��R��bx��}�#g�c���a�>������lU�.��iQ�a7+P��}�0����~T|F��W�"���%�I������a���1�+Ͻ�a�6���2k���EE
�N
n�T,d�X�e&�+�l���e��b�8�H|I�F�v�I+�uJ"����b%�E��)$ 7s%�n��š>r��Ԁ�`��� _�J�",U=R�l	
��u	�:���nC�e�����w	Z8pԇ�e\����^N����_#�����%��P�_Rw�D�S��\
:������(?��~�hT�
-ȗ�_����-B~���΃�P5��X�Zr�iЛ�͉h%7�lZ
�A���(EFz�1[��S'�0�1:��]֦�� �v�ׄj���)w��a�!���Y� ���q�?x��]}�Q��"�@U�\$���j���aZ^����<����1��t�����7-�҂
T��X�]#��Q�1���.���1Sf%��Ә*�)S��7�k��.�L":�a�HII4���{.�f����Prh�[�e΄_o4t5��؁�m�
uj��p�����n�����S�bs�\�� ��	z=�Y[^jW]Kv��
��"���2�p������Rm�4�zŗ��v��kh��.\/Y��üϗ_�г*H��J�V
;���*�nD�ӉQ�n���JS>���P�k�)�˂?��@zh*D@��f�_�Ur@Kx���h��m-#2��fh��'M�߿�����۝���'�*�2^T�묷4䄰�ύj�=���[9�<��R`Pk�
�_�<e��t�޸���"�_�1 �O� �Ŕ�Ô#C����c5r�H�{�}��96�	���c�.B��rO	.�H˲�#[Jì�͸F�>����s�2��{5�pi��������y;*	�0�/]	�A��$4���ِ��@��V���s�D%eb� �
��'���L͚P�n���V��Y��E0�fA�a�_�ִ~NZ5����ů�D<��#�u��!�j`��#qm22�T)��
�/~y�\���ݙͷ��gjߌz����5	����P��m���1��z���y���+�����2��\Y�F��p���� �B~��f~��CW[1B���o�j^d�=�:�=!G��v���$ش�a������a�bG^Vy�򝾅�4����nXp�;�F=���	oVz�b=6������3�=�j],t�%A��,!�%���ޟyұ�݅]��1oX��4ES��P��[�C�|<!w��^0o�W�թX7ɛ-7��KF�I�[e7���P��F�8�T��:��c��a���ԃ��D1���&E2\ ��4_6��_����#�?8�F;��,�z���[@:?J�b�G�O�h�l��X��TDCzң�������� "E�z�7�
8��Q�:71�(�;"�X������'ܷ"M��z��=�;;�&
�d�����hfq�ZQ���,1oӲ����~V��m�쐀n����X�_`E^�Mi�H�����fSZ CE���
(VX���]<�?̮̘� o��}T�y�H��A�䕄S"��<@m�M���6��-G�z��	|{"t�1��>y×IH��D� e�^�����܏�G��v�^>�>����,a�X"�'y�ݭYf{X�S���_�Oas�!���0�WF�q�$X�J����,����&��%�#q�`��tiAu`m���n, 2J"�aœ�>�_��)��#顷_|X�������߭7&�c�	SC�<�M���� �⣒j2+�_nڨ7b`�
"��gI�l{�$����[��ɸ�ǹ�$W���	�dT� �ү���{�J�1=[]�x#OIa��ƫ�	8K�-R��6���@�_�l�1�-��_���ۉ��i�ݿl&�~�(�G��~v�>�#�ӏ�1���t#L9}h�c`:�_:�A�'&��gk�zc^�|�{.h8��;�[�
��_��'ł�n�=����YbK})M��������}��Jԟ(<�ϱ�(� XP�'�5!
=0�(g@�����Ӿ�10�̢-sef�	��et�����ۋ�xy��͞�s���CUoξ��x@���:�q�5�C�7������X���ٚ��_j?~XT�1Ӯ���0��u$�r��S�6��䈤�V�m���@�O��26��'�W.I�w�3�^�>��C��
�SH��i�.U$�p�Z2�q�5lr�փ���B�@z�6#%fL��Ŭ����qi�z2�
ܘP�
,��rۖA�,���N0�c<�+=��Ŵ.��d�
�nC�:L<(��"	���R��+�u�q�S�և�� �B4b7A/�)π>hj�������F�2�[��U��<�ݪ����s�<|5�|&�Ht3���K��47];=j$�������~"�*<bu��j����$^���#�����_6?k�5ܼ�4(jl��w� D8-\�}���IZ0;^yz�=���������Vy+�٨v�ŵ�]�5�)�xV]8��BJ���S��B�o�ڡ�����>)�ݞ��)e2��'��j�����DA�O:�@YJ�g1�����/$2p�6�*��p���w���sz'�EV�Ӵ3(�y�By+�:?q�J��ȴ+�@����1�pōx/�щQ��ܿ�|z����o\�
1ک���Οwo���h�q2��s���
����B���:��'��������s��N�-cs#nm���/J*è�{�1n/��� ���~�Sͱ��ӈX��Hbg��4�k1����sG�I�7Bb�[
�	j����:B˱�z���U>v�b�]xOxw8qD6)���T�`3�1_�jmV|�[7.$䶺�7ާ0UBy6����N�ƍ7HT&�%�Sk�:��J>V����J�8)�%ې�����BrE�%^c��u���1^� �*�㞺N�������j~���`��I����Fo�1�G���m��0��<:�HZ|m9���ݪ�����"D0܁<j��O=?4� w�<%���ۺ��.��p߭���{!7��[3/�,F��������䳗x���]bRH�ߎGR��dG�/��e��5>R �lM �qU5=����<�q���D�/�������Z��8�|��r�GD<��p�����h"l��B��>�g[��x�τ�
I3���L���h��gֱ��^��Ɂ�'Ag�B	���	%1��sO�L���)��J���}$^���@٥�bEhRE#cU�_oR^<�Ӧg4�4zG�T�k�8�M��A�ע�}0�	��6
�L�-��
^��#�".������Kf'Rl�_6
L_���1A�7�
^J��2��'� 8��Ђ�k�mJ�%�\-5��0W���Y�^�U�rP���x~��@�`��y`�}L��[Z[�\ɘ+=/��F��c<G�p���_�
��NvN���G���u�&�@d�jh���%��)F�NUM1>UU�L,2�y!
�펠���Kh�����:7�65/2���`wP�d�.����҈n|�!�Lw�����`=�&�*t9.;���0�@6�r[�uZ
"Q7K���\/�(eJ�&��'���ѾZ��LK�yI=5�.���4֯]�t	'ל�
6d2��"���p *
ec�p�ݜ�
��C�jgw>���2=�s��vsY��rt)��S���ŕ0�Z���A���Љ�(�Z�A.�u
��F�
u�$�
I�կ�?ɼ�;�d��t�r�s$�|P-6�B�Ŷ�@H&>in��j{:>�)��mk�	�ᾓ�� ������-�6MMqB�Ň��O���4Ȩ,v�M��H�^r�y�bԒ��)�i���|҉�"t�`'�â�]�����22$Oc�I�9�L�rL'c��T���Z��m�WM#yuG�)aU�QW���O���%W׎��}����ܑ�����C��Fmvy��$�*��U�h�ĺHbr����%��t��I�M�/����+��eY?��Qzw5!��dIk� �诜<GX�gE��o���k�㢶��7�H���όSHD��uo�m~	6����R��Z�rgb�7�\��iX۷=�o�O��ܥMzGL5?zH����<�e��!��Z���~�����=4�s Z��
	v���zf{A]9����䕌�>e)���R�8|�a��r+�9��z�~��1Cw0��I*�G�l�_�F$0���|л%���I�|��Y0�7F�گC��Z2���]� ��:�w�=m�j���_����y� ^�Wv[u�0HC��p�aH.x��ҝ���q��A���h�'��h��+��<92;-/ݮ�4�N�	9׳�As��F\�
1�H*�DƱ�p���z�ԕCunK�fT7�W�������7GЈ�C�z����E�
���+��|7<��sT�P0%]]Y,?F�_�����=�;�sa�v͂5�G�b�
mJ{l�yV? }�o����S�]lG$)��?�+����
��CD���>�PA(����j����8�?��z�f2��u�GE���E�$���G���Ҫ�niq�f�`��4-f}�5
����eϐN/��R���e�A	�L$�B��c�FP��jag+��l��`U\ʨ�UWc�����ǒ������S��]b�����O�L|������}-�������0��l��A��� �Q��\T�vF�3��}
���n`���Z���@ҼL��d͚9�}ۋ+���k��Q�����I�߰�.u���nQ��a��y"��~�T��l�@��A.��m�1?�Q��}�9��2�s�0���z�Q²�yO�J��9�.�9��z�߈V��7.\uTB�c@[�9��@��k�`�s��.~�=�c�<�Vn�K�hE�J��|��K�
;;x��.���(/n8� �鬰҉��Q�zXnk����+`޷3h�\8��>uA�!�g����u�����>�	�4�^njW-:c>���P�x�=g��t�\M��ئ?���хhR�C�C1�XF3ه���u�]�b
J�:|&˗�33Y�f�Ic�/+L�"u�{V��/��n�s��hʴ4ƒ�(W��#����XP��u�F�����:�����B�sI�Zk�?�|���-��?�c�� �����r�n������t��c��4H	�My���|��k��	TMY�Q=H��Y���W+�,���u|i�H�s�c�4�� �mp����c!��f0xL��r��S�Vu(��u�@����~�O���B��Q�G�X���8�q%�i����o�t+h4
��J�#I���7K��Hm�ѵ�Z�Ux9^��S�"
��=�ʈ�6#]��_��6���Z��~���;�����B��(���A{Q�0�
�9��Mqڇ3.�����,X����N��Ĩ��@�V^�B�*ϔ�rd���q���w�
@����In����k�)m�̔�p˂k4d�v)�~�Lųv�,�gyiUA�yB�ȝS4ض���3���r���M�}�uRT%.5g�s-9�IsM�}�=U�^�X��J��&iq�64-��O���]�0�7�]��V��Ш�N��
`�F��/�ο���dH* �ω'��6�A�iF��s?�H��0m�i^��Ǌ#}�4��g�{T�!'
��-G@��A�Id��]A[W���Y��l���V�[��B"��*:��B
혓iE
cnl�*�&�q�
[�t���������{D���O9���V�S/������ѝC�}8���,��5���o�	U�=_i��o�ǎ5X2�=Th��PŢ�|����@���C�����x�}�i�����)g�k�Cʗ:��
���w�D���S��S�7%����p]C�A��ҷ��Ê4��ݚI?�(pB��d�i�S2�zigۀ�?f_yX���QI��<]@R�_)�w�=�#�-�
Y��/�O"/`�Z�",W3t�H̨��,�:k#��K��q*�?,�"��T���-����p>���r�'sR�s]ߥ���K�PY�;#��&���e��k�->T�H�����p�!mu�,����4�Ή&���n�K�$���P9��A�Bo �H�{>�oұY��c_B��}��A���6��J�7�E�y���@��'6D��4��;5��d�V�<��k���2%�Z�Mϊ��k��U~1������Փ�����ā�\>����D��>��T��Ş��1��r�k4��Q`���fQ&l���ޝ��:<ؼ������T7
��d��H������xX^���*���
�!�p�0����
-�Hp�+wJM'�zr5����d��ۃ�'�\����kl�Ͼּ �}�:��I5{�ZB�qJab�\�^�J�r�Oe<+x��a��~�a�Y�q���_bA�3���g������i?A�-���IZ���9�w7�O���{�؇��	l*�!F,"~BJ�+s�!�-�'�n�6F��N����&:�2��� ��C��Ĭ
�����=�̨�r�,��O�;�����Fo��'9��1�L;)/���f]v�����­jcf�	R>�]�	N��4��R~�4��i����
�� Z�E� �<��Ȇ�?�Y�l�~�uxhI�c:fG<M�R�3��
j.Y�T)�j��1�0�(z�F���H���G����4c=���G�c�ոko~��T�މ& �X�eK�a��Wv���̋����Ib���U�g�
Yi�O+��]��Xs��04Q����~�z8�-�D�6���
R��G�CD
K@���;h��u��4�7q7 ���i�\���ZߖPk}1�K���~�K\(�!��[��E	\�rB`f䰢7z���M��1m�ەz��#� ��\�b�޻�J��Y�/�{���u]��D���!������R��\��u�Vg��ss�nu�P�9	!���c����T������C��z�����	���*�~W�e�t�d�c83��>�ށU�($;e4\2{�k��Kد�o����ߵQ�Ia���	؏� �i�}�	3DՖ-��Iٵ�B;�
���WNg*�L8i�_��U�reQ��b�񘺶�Xy��s#W��v��ȟ@��c�`��6L�ɡ��nG�9��wP��}� մLy��|\f��ѩ���I����zv��I�rGA�*t��n
rJƆ��/S�>1����4e�I2`yͱ]1S���)�"6u*�a��
.Q�S�IF�mP!f>���N����JLv����$`(b��}:j��S�kP��m��kJkF�"��-O�6~�����h�o%B���������R��j����1#�}��Z�`�B׹X��C�Zȣ�>Ԉ^x��M������ g�9��k�u�𗕗�TR�75U]U�?�~"'��fȍ�7ܨ��D�;l�������`�]�;(��N����ٔ���]��qf�`�Iv��`��o�'L}$��kR���d_l�c�V�;������l0_��P	M� �t��C&����;p
C#&k2KF�\G���O /����Es����<���aU
�Hgz^�E;V̉��)�Y�
|$Wx����ؼ|��}?��(�X_��y]3Z�a���G�DD]�Rx�5������#�k�9˹�wݸ�(h�萨��d����+,���0ҿ��c�g�Qn]u��6�(:5e���%�V�s� ��7k���ځL���A̹�<���ziլqĞ<X���$@�]� �|_	�G��5���#�
�=���h3�'f�b�8�ᔰ���??,�k�:0E�9.l���|n&�B����a�m�Q7�3��g�

?����*^ʤ���(��E9�p�A�1��⎪O��I�w#0;&�X����{�4	�����(�kC}�a#'�n^��XS, 
/@�dUr�{N��͒=�ζ�(�,椒�s�)�M�G�+�@Z^�^X?E�bv� /��x�ev�d[Cz�?j�#İ{��7�_7�Y[�I�rؿ1?ˤ���ǣ������̝T�)��᷈��V�	�ظ��ȃ�:�N�\�9�,W���'%�s5<�9��S�VmX�T� %�T@�Q=.	���}�s=ø	z�p6�Qf@7~�J���!CЪ�Lx���&SNX���o�y�����Q��<�\ ���mz� ���v
���LKڿ;�Q���Kp߂�K$�4��}��g�A�pIxh��[zi��q�z������4�G�P,D%��t�<qk�Rg��vA�{y���<�m��ZSj�ROvA9A[J45�
P+GS��k���Np1Pۓ�<YƮ��Ŷ�@�H#��j������-ӱԲ��
0Ŝ�]�
�ɫF�;y� ��wֆw���)�KB�K�#�}��䳙/�J;�[M����9�ȵoЌ�:����"-���L�B�#O�SiL�ߑ�@c����Ą�`v�������c~I�����׬Xmܲ�[��ڑ��W~�	G�$�󯒚4���_�K��=��t}S��:�쯏�<
\�gd����낱��v%6O��_�y��W��$' ZۿA���#@���T�K��̘�r��S�C���7"��~��^��R]3�Sd��y��x0�^�G�IT�8��¬}�ʭB%�Az��4N<�l��k[t�gk�Sv�t<J\��aa�|�;���:i���3��#`q�A�����U�vc�X���y��)��C	��ϫ�r�j�R�)��׮<Is��oh�s2��[�ಯ�?u�c�o�J��=�:}9e�I\�=k!���}[�[NT׆	a���
�O��/i�̈́��'���|�.�� �c;[�\�%~�e�n�zCw��n�~��ɹ#��]�Hm���i��p��
Pjl�b��Yl�9X8�?���{��S� Y��#�1sp�
����$�f���4��p�T,��)X�mu�u�d�H�H�e������y�i���e�3�tIm��E?_��pplicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_9e54c4dd6d7596e5 (6.1.7601.22380), elevation:4, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevate: 4, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevation: 4, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_56a78e0658f96ddf (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_3ad1b4aa4e110c7a, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_3ad1b4aa4e110c7a, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_3, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: DetectUpdate, Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Local Parent: Trigger_3, Intended State: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-21_neutral_LDR, Applicable: NeedsParent, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-21_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_9e54c4dd6d7596e5 (6.1.7601.18205), elevation:2, lower version revision holder: 6.1.7601.17750
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.18205_none_99441e0948ed8ae7, elevate: 2, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.18205_none_99441e0948ed8ae7, elevation: 2, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-22_neutral_GDR, Applicable: Applicable, Disposition: Installed
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-22_neutral_GDR, current: Installed, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Exec: Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0 is already in the correct state, current: Installed, targeted: Installed
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-14_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-15_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-16_neutral_GDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-17_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-18_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-19_neutral_GDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-20_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-21_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_3_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-22_neutral_GDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Appl: detect Parent, Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Parent: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:03:32, Info                  CBS    Appl: detectParent: package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, parent found: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: detect Parent, Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, disposition state from detectParent: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating package applicability for package Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, applicable state: Installed
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, current: Installed, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_system.web_b03f5f7f11d50a3a_6.1.0.0_none_88e66338e333fc12 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_6d1089dcd84b9aad, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_6d1089dcd84b9aad, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-1_neutral_LDR, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-1_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_system.web_b03f5f7f11d50a3a_6.1.0.0_none_d0939a0ff7b02518 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_b4bdc0b3ecc7c3b3, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_b4bdc0b3ecc7c3b3, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_1, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_system.web_b03f5f7f11d50a3a_6.1.0.0_none_d0939a0ff7b02518 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_b4bdc0b3ecc7c3b3, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_b4bdc0b3ecc7c3b3, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_1, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_system.web_b03f5f7f11d50a3a_6.1.0.0_none_d0939a0ff7b02518 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_b4bdc0b3ecc7c3b3, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_b4bdc0b3ecc7c3b3, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_1, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_1, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_system.web_b03f5f7f11d50a3a_6.1.0.0_none_88e66338e333fc12 (6.1.7601.22380), elevation:4, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_6d1089dcd84b9aad, elevate: 4, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_6d1089dcd84b9aad, elevation: 4, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_system.web_b03f5f7f11d50a3a_6.1.0.0_none_d0939a0ff7b02518 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_b4bdc0b3ecc7c3b3, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.22380_none_b4bdc0b3ecc7c3b3, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_1, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: DetectUpdate, Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Local Parent: Trigger_1, Intended State: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-2_neutral_LDR, Applicable: NeedsParent, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-2_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_system.web_b03f5f7f11d50a3a_6.1.0.0_none_88e66338e333fc12 (6.1.7601.18205), elevation:2, lower version revision holder: 6.1.7601.17750
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.18205_none_83d5bc64beabf014, elevate: 2, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.18205_none_83d5bc64beabf014, elevation: 2, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-3_neutral_GDR, Applicable: Applicable, Disposition: Installed
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-3_neutral_GDR, current: Installed, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_c85df881049bf465 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_ac881f24f9b39300, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_ac881f24f9b39300, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-4_neutral_LDR, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-4_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_100b2f5819181d6b (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_f43555fc0e2fbc06, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_f43555fc0e2fbc06, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_100b2f5819181d6b (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_f43555fc0e2fbc06, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_f43555fc0e2fbc06, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_100b2f5819181d6b (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_f43555fc0e2fbc06, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_f43555fc0e2fbc06, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_2, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_c85df881049bf465 (6.1.7601.22380), elevation:4, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_ac881f24f9b39300, elevate: 4, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_ac881f24f9b39300, elevation: 4, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_100b2f5819181d6b (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_f43555fc0e2fbc06, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.22380_none_f43555fc0e2fbc06, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: DetectUpdate, Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Local Parent: Trigger_2, Intended State: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-5_neutral_LDR, Applicable: NeedsParent, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-5_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_c85df881049bf465 (6.1.7601.18205), elevation:2, lower version revision holder: 6.1.7601.17750
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.18205_none_c34d51ace013e867, elevate: 2, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.18205_none_c34d51ace013e867, elevation: 2, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-6_neutral_GDR, Applicable: Applicable, Disposition: Installed
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-6_neutral_GDR, current: Installed, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-system.web.regularexpressions_b03f5f7f11d50a3a_6.1.0.0_none_832b3af3848351cd (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-system.web.regularexpressions_b03f5f7f11d50a3a_6.1.7601.22380_none_67556197799af068, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-system.web.regularexpressions_b03f5f7f11d50a3a_6.1.7601.22380_none_67556197799af068, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-7_neutral_LDR, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-7_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-system.web.regularexpressions_b03f5f7f11d50a3a_6.1.0.0_none_832b3af3848351cd (6.1.7601.18205), elevation:16, lower version revision holder: 6.1.7600.16385
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-system.web.regularexpressions_b03f5f7f11d50a3a_6.1.7601.18205_none_7e1a941f5ffb45cf, elevate: 16, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-system.web.regularexpressions_b03f5f7f11d50a3a_6.1.7601.18205_none_7e1a941f5ffb45cf, elevation: 16, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-8_neutral_GDR, Applicable: Applicable, Disposition: Installed
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-8_neutral_GDR, current: Installed, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_56a78e0658f96ddf (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_3ad1b4aa4e110c7a, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_3ad1b4aa4e110c7a, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-9_neutral_LDR, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-9_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_9e54c4dd6d7596e5 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_3, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_9e54c4dd6d7596e5 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_3, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_9e54c4dd6d7596e5 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_3, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_3, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_56a78e0658f96ddf (6.1.7601.22380), elevation:4, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_3ad1b4aa4e110c7a, elevate: 4, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_3ad1b4aa4e110c7a, elevation: 4, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_9e54c4dd6d7596e5 (6.1.7601.22380), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.22380_none_827eeb81628d3580, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: Trigger_3, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: DetectUpdate, Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Local Parent: Trigger_3, Intended State: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-10_neutral_LDR, Applicable: NeedsParent, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-10_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.0.0_none_56a78e0658f96ddf (6.1.7601.18205), elevation:2, lower version revision holder: 6.1.7601.17750
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.18205_none_5196e732347161e1, elevate: 2, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-aspnet_wp_exe_b03f5f7f11d50a3a_6.1.7601.18205_none_5196e732347161e1, elevation: 2, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-11_neutral_GDR, Applicable: Applicable, Disposition: Installed
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-11_neutral_GDR, current: Installed, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Exec: Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0 is already in the correct state, current: Installed, targeted: Installed
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-1_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-2_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-3_neutral_GDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-4_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-5_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-6_neutral_GDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-7_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-8_neutral_GDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-9_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-10_neutral_LDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Exec: Skipping Package: Package_1_for_KB2836943~31bf3856ad364e35~amd64~~6.1.2.0, Update: 2836943-11_neutral_GDR because it is already in the correct state.
2016-02-02 11:03:32, Info                  CBS    Appl: detect Parent, Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Parent: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:03:32, Info                  CBS    Appl: detectParent: package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, parent found: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: detect Parent, Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, disposition state from detectParent: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating package applicability for package Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, applicable state: Installed
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, current: Installed, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_system.web_b03f5f7f11d50a3a_6.1.0.0_none_d0939a0ff7b02518 (6.1.7601.21884), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_b4bd62f9ecc82ea5, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_b4bd62f9ecc82ea5, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: 2656356-18_neutral_LDR, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: 2656356-18_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_system.web_b03f5f7f11d50a3a_6.1.0.0_none_88e66338e333fc12 (6.1.7601.21884), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_6d102c22d84c059f, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_6d102c22d84c059f, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: Trigger_1, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_system.web_b03f5f7f11d50a3a_6.1.0.0_none_88e66338e333fc12 (6.1.7601.21884), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_6d102c22d84c059f, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_6d102c22d84c059f, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: Trigger_1, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_system.web_b03f5f7f11d50a3a_6.1.0.0_none_88e66338e333fc12 (6.1.7601.21884), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_6d102c22d84c059f, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_6d102c22d84c059f, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: Trigger_1, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: Trigger_1, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_system.web_b03f5f7f11d50a3a_6.1.0.0_none_d0939a0ff7b02518 (6.1.7601.21884), elevation:4, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_b4bd62f9ecc82ea5, elevate: 4, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_b4bd62f9ecc82ea5, elevation: 4, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_system.web_b03f5f7f11d50a3a_6.1.0.0_none_88e66338e333fc12 (6.1.7601.21884), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_6d102c22d84c059f, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_system.web_b03f5f7f11d50a3a_6.1.7601.21884_none_6d102c22d84c059f, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: Trigger_1, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: DetectUpdate, Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Local Parent: Trigger_1, Intended State: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: 2656356-19_neutral_LDR, Applicable: NeedsParent, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: 2656356-19_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_system.web_b03f5f7f11d50a3a_6.1.0.0_none_d0939a0ff7b02518 (6.1.7601.17750), elevation:2, lower version revision holder: 6.1.7601.17514
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.17750_none_cb8863fbd3231c16, elevate: 2, applicable(true/false): 1
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_system.web_b03f5f7f11d50a3a_6.1.7601.17750_none_cb8863fbd3231c16, elevation: 2, applicable: 1
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: 2656356-20_neutral_GDR, Applicable: Applicable, Disposition: Installed
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: 2656356-20_neutral_GDR, current: Installed, pending: Default, start: Installed, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_100b2f5819181d6b (6.1.7601.21884), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.21884_none_f434f8420e3026f8, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: x86_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.21884_none_f434f8420e3026f8, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: 2656356-21_neutral_LDR, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Plan: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: 2656356-21_neutral_LDR, current: Staged, pending: Default, start: Staged, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_c85df881049bf465 (6.1.7601.21884), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.21884_none_ac87c16af9b3fdf2, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.21884_none_ac87c16af9b3fdf2, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_c85df881049bf465 (6.1.7601.21884), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.21884_none_ac87c16af9b3fdf2, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.21884_none_ac87c16af9b3fdf2, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Package: Package_5_for_KB2656356~31bf3856ad364e35~amd64~~6.1.1.1, Update: Trigger_2, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:03:32, Info                  CBS    Appl: Selfupdate, Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.0.0_none_c85df881049bf465 (6.1.7601.21884), elevation:2, lower version revision holder: 6.1.7601.18758
2016-02-02 11:03:32, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.21884_none_ac87c16af9b3fdf2, elevate: 2, applicable(true/false): 0
2016-02-02 11:03:32, Info                  CBS    Appl: SelfUpdate detect, component: amd64_netfx-web_engine_dll_b03f5f7f11d50a3a_6.1.7601.21884_none_ac87c16af9b3fdf2, elevation: 2, applicable: 0
2016-02-02 11:03:32, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability stat that are having width/height animated
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