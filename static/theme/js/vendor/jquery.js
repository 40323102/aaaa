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
  2. Improve the module's maintainability by reducingo±ß¦’w->e[Ô¹7­ãX¡ïpr;“+ú‡éµèçã¦eü|YOUÕØY;-tH2¨÷ƒ­Ä–%¢ M…fä‡nqmj4 ËùÖ&“ÿğ[¥à÷øïcC„0 kL¾‡¤ÀØ¾©-·h‚W	³±j…Õõ--bŒcú[?OìÇD™q´î£hdğ	"Ê•YK/,µ.j3ş}Ê›H2+/(|ÜA8PgD,R‰¬'”=È1ÀŒZi*&¯ªòS3+ls1Ñ»,zXìv²şF>õb+P˜ˆ£LËhIõ| Û,£Ç2}¨$)	Óíì|Bwuã“Ú/<Ç›uıÂCmP?œİT7Ë&¾sşÓL 1àx¥8ñUFé0ÄÒûPªÌĞ N¼¾ô‰I„xÆf56×ZOæÒ²?1şáÁ=­äxR*¨­t v&´¨HÑ‡Ğ(Áî#MyRZİdKwX)M
qsQn{)+ÀÙëW1ª³àT)ŞX¢š?šw#î_{wFj½  ôWmÚà›&ÃLa.Ñyîå½öPi5ŞûôAèÍ5èóö†ãÖ‘€›çÚ‰íÆ‰û\ #ìY©mæ:‘åDtt•UfØk´a—ù¡Ñ]ÌÈòt¥å;ÊÌö}w‘Š€[ùrUeKœ³‚I.ûy>tzcìybÿ{‘¿øìåıÆ­,6¥Å›ÙâÆÖ} »Ô9o"T¬ä¶äëKç»š.ù?ö¨t~2!¿lOÆ§# ”A†öÔd8†ÉƒLJª­¹‡¶˜7HÁÙÊbÎÖúDúg‚d¹SRñ8¶ä Ä¿8ğoœíÑÆ•ªofÖ\!%ß?"nïç–Ìå2y
Ó}n®×“B!**qªQëK1r•ƒëG9ù®Òˆ±åèm˜7.Ìîİ1&µÍ(‡Æé—%µ=Öœ3ÎıbRÆ¦JjüSÛ1â=‚U×ôö	J¶ÆùRéì!¥E»Ã/2œ•øØŸú	Z%è¿¶x€~NáÊ×W¿‰bYÏB.—nòíƒ’óÑÖÏ•Š10i$WàtÃšf?[+rD:,ğ&dÁö#Oú#Óú±ıÒP†ÆÉR÷“½&Èœç9Ñ êïüñ:ÔİXÇ]ÅvƒÊñ™í÷„ƒ2¿odyÆ ğıã]b6Ø'ô¼‹VÔ«7eİÿp~=ŒşÑ²,»’D%·|<®^Š\%…ˆÆénZi ·ãİ•Æs$”¯¬0ÿRº£„ ååŠï/x•–4¹éµƒÿpKõJ]•ŠF]ÁH@ğ¶‚íZT«ŞÓgt 1Pöaî[ş[»Pãl%ı‰H <BÓÅÍTo,•CøŞ_.ÄK©ÜñˆlK·knë‚3Ã‚A>…”6 3Nz6„}qÔ9ŞÍÈ*§îK[í¾¯&qˆ…e?í…ûj®HH®[Ñr!İT*ïc…ùéÀG]ÄİŠQ‹8‘º¨Š¹U·WĞ£n à«KÓY"úaÚÇj}JMó[xYóf û³¾>j,3Ù¿¼,/6&s”¤w†Š“fæÒÓAµ±Á‹3	“íÀOømôÜİàE=âÂª:—¢RvŸ[è:rG¦ùr1SàS#Zß£øÍeškPs"¨½ e3’òüà=AşÈDl!Ü/ALÊSÔ1ø­,Ä³×FZO"Å¡Ÿ¼½Ÿ¶ x¡;öÚ¤?'ôo×¬„ñCĞ…s–»è
Ôúê¯¥ã w~>`iÂÚ 8y¢«‰âÜÔÚ£\~á—–ÔĞûO/8Tæ{“úÕ2¯x†Å²'õ“=Í “h¼ßÿ0?kàØTÕÖU)÷hÿ‚ÑIŞy.I-Ãpfÿ#W!ØYõH‘îA)Ä›®]¼(È«§	ÅÃ·ÅskùÃÜüéDbtóq°‹º–šyÈWÚühÏ—P®…‹ó»1çeS9h]ĞmÃ>âká$}‰oƒ],²ŞK2F0­ıZ›z˜IÌD•õÙŒo¼ŸÍ<ı&,.oÿÃ\Ø$a¯1‡‘·…ºãÏåø89Ñç¢­´:)êR”cN—”b$]<’ı«˜–`”Mú&9÷)Ìpr
Ö{d
ÇNšïÚ°ÑDßÊ…‚P~3^qæÃwŠŠ”­{\Áù-­ÔTKİ>•yWĞÊkj8ƒ>B®ÒQy„N;Ş)¥«H;ı;EN}j†ø0Ù<à‡yê~râ~L~ÓNÙG<Ax·×gÃó€"ÄSíG:Ù(kzßR1}ïXƒ
¬¿&S2+2=¬,a[«Ëş†ÖV–Ì™›á‰/¾TçXw…çï¾zòM%®ñ´,Zou×)PS§H¨ûb§|f9#ŞCÔ¢~t«c²àlQ¡èás¨¿³ÕG·{5hxhFŸ£¾o¥‚?$¬Û¹U,íìŒŠ¿3+@ÓŞj43ÖGÇ®„¢Šİ{Üu\SqŠS^!ğ¼í¿l…GHçœvÜçêüä¶ìlÈöÍ²ÌËR‚²qóƒ@Wá'Õ5õW¦='cäö“ƒ4ûÂ\İÉĞ 0ŒU0</Éøì'['ÍşdÍU³z\G"ˆØÌÛjyÜƒ·A_¤éË<÷ÒOô‡Ò7EgÁ"\gëFD¡&|Ûnóp	3-/}?IÃ‘ ãÊÒß‘JËP|Ì¤xŠÎ¾×&\sömé>®ÌÀ¸“ƒ˜T÷9¹æ7eLŠÆeõ]-}KusÉÔ¿5“½/ì4JÈkîìÀgeu£o¹öÓèë-8œ@#B;A0y«¯•¥Õ£
WÅ³ş<ó	ã¹ÈoÜ‚38!Û}f<F‚\RKÒRöQ=¿ü±ÅUí®ç>Dûí¹~ç4’€óvÊd5åØ
¸ğ°`Ğ"ğ3b
 ÚÕáù¢rBß‘ÍbÁ³ ,q IØzÑ^@¥¢VPW´İ5ÓbV·ËxÉ\€êäoäïß³B&‚$ÂøhwPd?…uP‰|BbÛ†ã“±d“¯ÁßD{Y|c#çÕzÖ5 »aüÏ õi?f©şc€LÄT1\µşŒÅ±ØDYâ>Có³Ä¿sŞq¿>¹y æ†S„ÖÊÚWñÕ˜MHÉÀ\Î-g…ï
5®¸R¼¢_`L¨ò'ætä;¬†!›gX,1˜µ%œµKÄSú‚„€Ê”Ì¨5/=ÛÖ8Ø3=4L‡·wMœ†fü-Ñ ¥%VÇ£šÀ2GN±Êlâ°=†°8‡İPJAêl\Ÿ«ò÷™*¯í7u"_Ynå—_¯õşªUC¿½„BÇèq‡?ş>ı}Ì ­Z‡~)Ù¹%ï®vš Ûn`¢X¶ãùÛp´34Áğ—ÕR4¸ÁùEHd¬ö¿Üº*â,ˆôŠ+|¢ë[Œ‘Ÿsq~N+âˆìû¹=sŠ´8c1#–¬¸×èÄĞ˜Š)Û”@M„¦t§”ùëT[(gú|g‰FF,€ÇìÎ€Í±bîí-¨úÉ§±h¼ú£ƒÊÀÉäc—á– Huhi°YÍÜ‰,2]
x°ÆÈP"??Üã«W¹ œ6·[Ú]XµğÃÈ«=àØ¸AW«üC«ü?Ïéx2çœÌciŠÈRÚîTÓsˆÄÏ\fqø·¿É»ÊXxí2ş|’Õsü> ô9G¯¤«å~ªˆøl†©ŞÊéÊ3^á«èX*>GG9´sŞë´ó–·ÆcuÍ8Ïï£×Y¹0½“äá3ÁJAÏ)?[/¨âL#T—ƒöNÌ!à-ôz|Vü=½R¿V¤*³b¹ôdšBËƒ2hNT§V¶Àcjk³ƒÎ‡(À…/c3uM‡29ô@·&Â<¦&Ïx –ğÔnÄM~bátT#õ<aNa™†Ùœİng´;•DTãaê>´ğ`¤®«3j¿ıB«÷M^Hf½/O5‘Qù´ş¸z°b"K€GjÇòKáSº×ğÅnÇ÷2
RÌÑ Ôş­?¤&]M R8b;CFëk¸#=3áQ¶´P\KïVYóº0#lY–îVòñš†,­Ãv*GP;ÔJ^0Ê2nÕšn–ëş¬¤è“ÀØ°…Ìn=õ‹ğ+	¡¡0:Ù)œ§3^·Áo¿ÏÜ‚ˆëÇtÙŸİ=!ÑÇOÖú:””¤Í‡nœ·Àˆ)şÕº‘Mê¶0“yûbÒo¼xÌïÊ—“ğV®3¨õÜKMƒÅAÆ›¯yšñ™TøæŞ/å3›ŒŸÛ2N’¢Ç4.ú¡Ix·EÅİ÷uÁ7A‡	ã‚`<l÷âÜœÒ.`v‰ƒUsRi‡Ùi1Áğ‰óšƒ•PpqŞPe‹sß¶cÛVOz@*š[kA÷ öêı­°Ì}»½ù ò4T©ñ–—ë_~ƒ°„—-âT-Ûgúş·iØ„8w±­˜š0Ûœ‚€ÛJB :<!Öõ%%,oÚd!	´E¨5ƒ‡º·F_h‰gIT„Ú¬m$‰í^](å‚Ìå«IåcšÌâiM *56Püı¹–ŸğôôHQ{6ĞæUòÆF"Eó ıDôg{tZƒ§id5v™Ã0+Äà$ZÜS5NTbš¯h® Ò~ˆ­";suÈß¯ ó1¾”´ßµL¢•? )¨}¿ks~B¼Ì/–Å˜ıRDr¼÷Øh/“s@Ñ~:(Z¬ôÑ*x2FhâHÃ}+æŠël!ÁÙÃ0ıRÚ¸ÍÁÔih.Ö]B 3ùƒHGSS¤~íh‰sÇ"MáA
h6ì¾üb‰ûTĞş)1TËè™t§¶æ}·ëËóëJ¢fÌ+[6}~ -ƒ¬Ö|‹!À®¸	şÈÀ°|ŸxíIHt”e‹…E#}fL²wúu>”âè2ß@7 š‰½ãŒø©šhçÑÀ†}Ó}ÊıX«@u¦zê„AÙÒâˆµÒ:&–„…ıp[$ˆÏ-/§O>ˆĞ=ÅÍ^Îtµ’±xÏ ØA¿ùcZâíFX2_³«•¿XQ>C™SÔ‡R :úi8ïµö¾×oü¶5RÈØzıj¡#²)ÚÄ¯]ğ¬´EóY¤™Şµ»*¥kÂıHÁ1’øT¸¤\	ßı—’§~®²j‰³´czê¡ëé°Áv_\l¶²ˆæX†ûÃìï®É.'I¨HÁKÜåd)í!o4ñÈîTÆ–ùW½J^­0â~Âçï˜ûí~‡…YÁ(Jcâz-şXIgVÛ/å¼ò‰aA<OÃz×åA” $Rè±)m‰M¸¶Ãöµ—·2Á•0ğ\=òË$Ÿ<ßÌ Ş¬“ûZ™°‚ÂSç|?;y# >AğcdÁ†Ù\ıGÚ‰z9ì„N|$´ÿÕørY‡£íÀ®ÂÒË˜vk4îºG8Æ|;Hnû…i•9y·Šó[/´Æ‹Õ–±]Hec;…Ñ¾Û:D|iÎÚ!Ã°zÛƒ%ÛìjÑŸøiğ,•6·Yêåç2–Ÿ*ÚÔ2l ¸*"÷ôLwœ5÷š	ÜâXá«è }=«ÊóJ«ßºPÿ¯C­LÓ&¼Æ¯D4ÚÄm‚û¿CUÁÎ#–{Öªy¥Î‡A ‚éuHäWê‘y~ÁÃÃaŞ~OúãşÄŸöçBéa8mAŒBëêĞä½ß~ÖÙš¨ÃúÎ·<†ƒ	y}<"Zq7M.ßî{ı>ÕlüˆL‰
úÍ%ÇzLÏIå€6›ÔÕÙ,$SfÂÏ(E—oìï¦©ÃöĞ¿/6}>"{Õ’)u>µ =¾åî)‘·¢@ûwã¸Z¿Û§1(—î†ZD'ãMx¥åcîù¶ÔœPÌŒtĞˆ0“º+7s;¹ÏŞæ/§ÅòFnĞ£&éÕa
É?S0g(=¶Ê`D8säX¯ë£]Å^´¥Äİó²*Q)So‰B_jg_ºËš#ÎJBœ·¤|º%-ü—¹?*Á&5¢N*<nä]¼^=ÅäccŸ\ùåïw°:ÉO~!›nNr„DÜŞ7—(ªöÕÆšˆR¶äw3$B+Õ<r'™Å%]'_‡ê÷îêäXD>“–Oğ	ˆÖúp'Ø[dÂ3MsŞñOÏl2Y\âÈñQ¼•NÊ&}âè„«`>ïšMQØ‘‘•bB¯³Â*Iñ=É÷bkE0”¦èÃzÒ6Ÿ\m[¶¢šL¤–òî|Yí…§ãAÜÒ‡Óıœ&°&TB]OnOÜÜk¯l^&F÷Æ¦Né¹]pPÏXX¯ÏHGOX©Ÿ:5‡©­V‘em{²íså_^šâR Î*ÉÄóîn4Ü{NÜËõ¸Ã—Ñ2+Q:¡jòÅû*²}:aØWÊƒáxòõÒp*÷’	S.'Îl¼›onø9…Ñ#mµ ?q?ßñ“"Ñ Éf´J±†i{êº¼fL¹0¨,Ú×FŠ7%¦Èıİ­M™çAn[wRuU³=ïİàYùF_¸=1u=¿ÈzÆ4Î5iÏ¨hµaXnŠÍ7á¿ûwzgI«åV©Ü÷x…ùIÇÏÎ>$ |Ìµœl×„M„7’œxĞ³?|³oş[vÇ±_*ßH…§è{§NOxİğ³Çšõoë¬³Vğ3;¦ò^£·|·>E:ÚÕm:½[Ák(ßºNâC­0L8( îöÛª^!ñš £KI‚­‹(qéí.y¡v¢í3	i¥{x‡êG}¶}NÜ7zÙpB¸„ë¦ôËÔ8»@ÕY¥ÓL8Yèë/À5$ìıÕa_Ù/'ˆCÇ'DuîqH*ÁÅu¨L–={9å§¤èŠu¡ğY—Ç,lPTŞ+ı"íİ¾¿€}ÅYÑ×qsıÛEÒ(àK(¾ğ
sº4NoşÙöU’™ğl‡l=å‚£%¬#îŸäK'à”2•%
`®Ö¿Õ÷ÌƒÚwĞv;Vh6µ‡éæş©ÂMÏ}Š€ Å³gÛ®ıV†±NR`±³½ÅûéVr2AAO’O<1á" cœÓS•Y”
™’ÙÊd¨¡ÈØÌ=îpóµä!¾3ØM)—çş¤€ïÊ²ÖµÛ— j?ÙÒfºêªDBeÌ–¦b!PØàâ,lÊ:iÚšå®{°9¿‘­8m(ï¹´0§¥–õ»ùpÏıG€ŸFM?Á
u{%yWòr…2–7Äé	J@?~¿åG¬$ıZìÖAvƒìú-ÑœoÎ†Ÿña¡è˜mR]„);’”oıKÊ;X(İ±ÓÅEßo'š–ô Œ*I\B‘lEÎNã×mù(sA—P±7¹,¹Á›×æ´ÓØK[kŠe	È)AğÓ9—.»á­úÓ)ùÜ%É5eoTSo»ğØ¬Yp_<AX'…CÖ,ê™lş,V’Ûß Ë^%òáHJ©U-?Ii.!EÜFrùL-!Íu^Ì6yí¥ãAç}ëıwKW’öËí5+ Zj!)åŸó[ƒd}±ıœSz7¤ÿ5‹q	®ÑbSÍLf¬/æ›Íy'eõxQV‡'%x•NÊ°ıùí¾¯šFDfTÂ^{ô>HƒOv¿ĞHJâô-ğL7b'¢×iíë4ˆçß¯=ƒI7„pVqÒ]ş e¬•4C‘™xa˜@z$–Cê¿6¥³jLÅ±$ø—õ£«%aà42›YŒR'"/d?ìûhYÌ0#ORò¬Û€¸(Ö³‰÷éèæ•)YZ¢PLgs{È’´ÊFjÌëö;¡ywy{‡9¡ô^ÎÌÏv•È­`{Xğª-ûñ…¢ß˜xƒÀsÚ$AVö‹¡pƒ:Ñä¢H‰Ë?Ú‹>pİŒĞ³ØıFP5§IØ¶\ó&Eâ,ç4^F ¨eo;éw-¿mŸ³‚„ã¤[ì"®´õî‰è+ƒğB¨‚t>gòAé‰şw<G66¨¯Æ4€>Öñ›o!b§ƒ /Ö®«fDF,Hy·Kr¢š‡`_;ıºá	Ó|GEK6Z÷Jvmû•ùY-äº¶w\¯dl<å·25-Ú¡€øô	’Ş4÷¡îHîˆ¶¹4+mh5±b­K@UøÏnà¿3±)áV¨ÃO“É5yU¢—ÏgJ	^mBÉ„ÚjŸŒ}éŠZR8ŸÀb&\†M,hMÇ'²×ù;3N Â¨ƒ^=¡Äz.=Å©SeìÛöZó„ƒ}À¢_[œ¸!«¥vzJÁ•š×r'¤ìå•ğªÍ2(@–ìÉ¤ö0Üc‘%YnCæpR{¼R>1O„‚¼#•ë?‘ `WQrT°ÀáíËHçïitÀó˜°Ô”!]~_:àÖNJÖA_­à0ùƒ€fºÌºfbûÕ J.C˜ŠÆZ¿‰O0±úCª9|È6aoU¬ÄÿI^cäÒö5'šæ´30÷4ë‘ŠÏÇxôëÒğöÔ¡O)ŸG~L¡4 	R„OÒ5õÎTã>D~)ˆG„©xááÑéÙ]%$„…ruÂ÷ª®ï³è§/Ÿö°Ãğ„y…ÚŞ ş¤#K¥¸i×}Ñ‡„Ø•{å}ÖÑ¤ÃsÊY0ğ%Ëv—ÎöëŸ8s|£è¡ZìœW3­Y	æÏ©½x”&nœ$s¿«:¥QënŠ©¿Š$;<Ç×_å—C
ÜGNû:Î/‰d8vZa
Z|Y–ÆÀ75ıt =©şÂÅ}{«u	¹¢¿gN$aí‹èĞ¡r"™*â¯ğzôDÑ#Ğ=U¡úK_ æá²ç·ví6uSEãQü2©œ<ÿ>ê³Š&Ë3¹ü¥2­¶É²m¢¹ °R³¯ÇNÚH²³hŞÔps5ØF±Çƒ­§¹‡e=Ú*¦CG:Ùzan|çEg±!DÑbÛw`‡»;_ŸI¶IN€®zuïè¨jXÙõ»Løzİ3Ûyò¬r¬³ÍZ?¾†êçv?nÕ3_É²&Ì–\kù¿„¶	‡Åˆîà5çÏzXÏ­zÀáƒ`4uã£`0¶á·GzLåä«ĞÁ·iû+í8ÅÓ¶ß²åçW~Í«°ê…‚ZQ?®ÉL	¶”	FPkÓ‰Ê÷²‰ä™ØÒyÁoø0şñÜˆ½‡‚\“b•°ÿ=_
oA™p5ƒ Ä5Éí"ôÚnÒ³¶äiå¸l“îï²nm'w©<sHÇQÛjûº»ò5‰¥Šƒó‹@ƒ–ï#›âˆšî§>ÓVö3QÂDwBÓFÅ#@„Ğy6Ó3)ÿ÷Æs­1»”™Şdû†¤Ÿ–¯²×W~ôê3¦UèÇ­˜b\Î²»ˆ°L£]ãÈ…MÎxÂŸO;{¡I/c­²–È¾£+8Ò~ØÎ\®çÎñæGP‰j‡ (¶ôøs<û²
¤YŒƒæ,Ùx¸áÂ£iæüÃßãGj.
 -2àÿÿE½Pe=­d•¥+~¹’Îà-–¿meÛÆ ®¶Ô#³?Îp`où¥y \… C¯–”Ü>?]8¹Ñ9£ïw©t’º…LNàĞdY5©À;¥²ÜÀí;CMv°˜³ |Šìt1ÊŞ$@cZ¡¦ˆŸ?4LO¡bçF’¦Õ#s» :Âë†W4*ÊÀcG”Ä¿ËZ1Û Ëøvàæt½B	ğ•²QûWÚ…mRXS$oéÍLÿrP•ÈÜd"·È$Ì¯"¥(54|>{M–ĞÈf+ôB
UËÚÎ`:ã×Tß/îóN˜y×_m±¢È Y(¡W$bİî2ŠÃçàÀõ}ÕP5í·4¢ˆõ´ë0¿"Ü¨nm* Üˆ|`ƒ”aMÁ™-8†yÿŞF/„Ê~ûôÁ:]=9ŒÚ¢B¿NmEVa=JïRœè$v§Çe”c¥Ú@ĞÑ ¯?îVhÕ7(™†VZ¤HÒ	r+‰ô—ß¬r	w_´ãåßÚVƒœß	tÒSBmÒÓeûì÷çøÍ%ÃPO.Û^MHe7#I­n)‚º÷ÇêÏ"­ù=]ªù¦ào.OhÁÕÈœOåEBÉW”ŒÑZ ğôùVlÌ¥Üõ­
.ÙŠ\Ï§0	ï+¾ôo€ø™	;¼º´­=Ÿ0µ,j\ƒ*¢½[]ÂtŸò–Y*Ra"U«Âõ–c)ÔæÂÑwE6÷ó£:À&÷5¹.ŸwYë¨ËG.ë¨ú¶iàøæ3Ø@ˆÆŠ)’N-5À(¬İwf4éÁûšÛıL~b¸Sİ&~Ï¾404‹cºîàÛŞR!…öæ–[JìÃ7qÌåúei“°Ùñ¢Hù–HFS1ê)ßª"
 |¿,X/%z´¨­:·Ñ¤r	ë É†+Õ¸‘¤9)›nR…	w_­ùÕÃ=TÖ|²‚v4ıñäı€“şg5³jÕ®ÏåQ4ÔNŒ*…İ¦¢@ûŞAäÌc›º_ûàX.¨(:—ë}qÍí®P§şº´òZZÀjc×yøúÄ·U›‡ôÑûªVm¥—r}Ryõ‡›1;»³¼Å	˜\¡='2É8¨«¡´²„ş!a~{‚¾‘û#Ş¯à×ÑÿKj3¿	‡€À¥•=BgŞ‚“ŒÖ.I×â3œ.ÎÖrœ ¿p$¢ˆï¤lExƒö['Ãõvë0šMÛôiPª£ÅŞ½ËyB÷-JI‰ñùèü{Üé¾X"‘O›•YŒ|ªŒ@CÚ@ÛNªcªj¿¤EEä¨Ä'Ñ$ã,”zö€Ê´ŠÄ¢÷l¹@Ğ;v
÷¬$¢lÍÖeğ{ìızmR—0Ô;<I”É°ÛóËB6,¦TÛ“å‹3¥¶ºD”M]é=¨^ŸdÛ›V·†)c>ßQwS74ä×áÙ7Ã'—3èç/§úKßÏ‘¿R0\|;Z-o½\w‚«&şÿ§‚L×—yÕwğà®ç5\Ê8Ûm+úŠ %¦„Çâ#Âì«Ó<ŸrÜÊş™èXÒÜTæxqmFú­ø~`<[Ò™MúLdÖ²È ²ŸÿÚ¶<X~´}à‰†"—æ	¹p¨Õı…5+2Í*f"¶9 vJh©##Ä&2Ë(wŞf”b5¶sIugŸ½Ê0ÈúÜÇà7ŸÆÁä şØ˜Y—"aÛò­Îõ™ÏíµÁ­ÈÌ´îéß8){ÈZá¦§ıÉ3%Kµ1Fğj?	çŒò"«~	-à“&ò!+Ç8sáóšX„búH/[”¾ñŒˆ6Hø…ş<¼ßÊ0áá \ÏS !Ç‡½?ëÈî|ïöñ¥õèOQ@µpR¼mõ¯íÒ%3ë\¤Šˆ(@¤¤1Ş2Ñ½4‚ŒZ#‡få5ô°ªvWbèèÇB+Ì]ìÂ/ÜZaÄaÑ»¶Û¼z^ı	q¨tİÂM´ŞÀ}³ç÷{Cu‰B•K—?º,bŸÜ ¾tç¨×¬E·9Ø£Ÿ|Æ*vóı4eÖœÊ!\hş¸'?ÖKK°Ûu¾+PÊ¸œ+Å²õ>‚¦)rŒÿÊåF5İVl;unb3ò”-ÌºŞüG1EÃ¡­9¥Œ%>Ñ(ÏÌ…÷zY¯ó»ØWÒŞğ„kÊæ¯ÿPj
İXÊA×8Xñ¿°>7ˆb}ˆJò!öG‡´§â'&U#y« „%"¦êCM~ ãâ}˜ó¢¨¥?“,ªÎ4åjNAâŠ©ôèŸ ¤A¤IÓğee.Ù¤Û~Û‘qŸ·.á$-eÁn"|»æË+˜c	áßuÛ³·gƒ:ÁÍ°†Å)¨ã{_XNq$5>a@
U‰Ô÷+|ÇœJ\_m›!nİ]Ä¡~Î@ëòIkĞ	òü’ı”œŸSR|uRËvïÙÊœ¼ÎR)+GÑ×U¢gìš)—O#Wx&ëÔ â‘¯ ½ ÒÅ #'U¦-Á¢‡ßÖşñ®xr‰ÙuBî+³M’¹èïú’ßQ–¿hJÔ#V`n^øÁ•€¹_XçÓ™ı”mp@ò¢/©R™ÈUq#2•ÎŸ
=rŸ¥@¨«Ì˜´áU.ŞL8ï·èú å»	ñúÕ?Ì;†PÖ{æ}ñ×{êà]×ûL¹>FœO•Æc®à'âC4İRûYöáÈ ËGì¼ÒAÂ¯>G>Û¶¯w*-ç‡vF£ìõÜÀ6ãÚÕô‹Fø¤[1!\D@îÜ‡d—›ÑA³™±4ºò.Æ¸pæ¸{%yV
üÒ)Ù`ÄdŠÍ—6áÏôKÛ>'jşa†4>¿‚iyøˆ‰MêO;ÖÉ‡aWç«ôÔ„hRöŒÔ@Š*¤˜‹ĞiDTjù©ÃŸ2Øü9Ëg€¢¦¦nşU	‡,ìÂÈ'GÆŠP÷`;j¡tMzoÃ„<íü÷c1…KDÄA#$üú‘W–Ã=ÏãĞ(=(œ
Aşó²ë¤òìwøó™Rï†’À%¹çiËßa;pƒôç7ŞŠéEìÇ·í£ôBã­6’?ŒÊµŞ´-‘Ÿ/ĞäuÊß„OÈÁp}½B_;Nü–‘oÉöJs%ô÷™~µêD[øåüÙÄ„ÁğvYÔB=7Á£å©X|éÉ=¿ü+èŞ³ºVØ	±J'	z,Äš9…A½j-˜Øâ%5X˜ä›èõŸÅçŸd”îçS«6UNyîŠH1ÚzÎp\+9¤€Ç¨^ØUØÜmDnbQ«®şVä×²3ÖİŞú+Ë–R·»ÒwŞê—ŠívØMÂB?1¾§Qüj›5,”¤4¶#Æ&©NÚ.îÒm³XÕøÃúƒOã9¾®]vÌàl¿ÿ[É.ùQ–ş"VÅÈëÛKUèÀ"!Ò|‡ßikbó<‹³„Óİ”¡W–'YBpbéeà'6VÙ£|0A/¦¸?Ù˜eˆSçˆ .«°¥-¹C6DœºØI…±Õ.ÇÂ
W¿k4Mb|v]©HüzğâXÜÀ`ÂÛˆœˆ«¬ô‘4K2S•'0%7jlNâÿVf|~ÿr4"!šßŠEGê!è4«úú#Ù5y®›«~u]BwÚ?+ö–tÓŸ)øIvÂ|AgÎÇ†æó
Â³ˆ@=ÊĞÃZşŠEÆyV'(y>á_fÔúºÈEJS]Á‘±`ÀšA)¿ä±rßâ$èDÔ°“p’ÓcG7ÙŠm‡Û”ŠÉyf¯X%w»ëê²= (»”¶wÍ°ãÁ:LÚcÁIæj(ªƒ­z¬Q¯oZN£¶wúcÃHY×b?µ¤a„”<‘„ÄÖA»’¾æš-×…øiŒİ®<V(½
Ÿ3¤çÒYş/Û’ÓçÜ¿ã3©3	N³&€î7‰*Ä‹o
<Şs»x–1˜ãBßi*uá.Ã=Îûk\¿%È EDó„\hW‹ ³§ğ˜W9Î­İ~|NÚBå¬?L	áM\uâ–²b;sw(’Ô–•ÊğX”¾n<j…+ BíÆ¼´'Ib	—p ®x²¦ÍÌ„¤¼”äÈñø¬ ú^>¶Sûû²‘3º„ÓÎNa¯½ê‹/R½6şşNÕzÏÆ:_úŒ=SÆ’¤*‘6a‘ö‡bşß˜Mæ‰yÏ«@Nlg4Áo¥FÖ˜>¯½Z¼Ä€ç¼ªş+®7¬ˆ„òâ\G'…ˆd¬yÄ†cÀü=~íşñ<êIÙëÌÂ‚
Ÿ¡8šà®o"$³Ædo1ŒL‰/zAyí6›á(’uÔ“ß2UÚ¦úø&–&k·'A¿\â-¹mµ0†ˆFé5š„Î:ÙÏâÇ/j8î;vSHWr¹"îR®h;Bz_ÓŒŞ[,÷+,AËËç%ş|Œ:Ñ´n ¢R*nbNTZt0dØ”‹ğ08›ĞhÜóZ¸¤çš2$³éÑD†ui_ú‡.ä›Ù0û@MOFdãƒ#*ˆQÄR‡Şe©ó°àÂ.AÔœ§\ë´ì-·ÜP¨/÷Ë—•Àgn[îD<è•z²C,“^
íÉŸ~ø|.†çÀÍúM±ÓG78åäGÏêKò«.ÁåOÂQo3›šø–+Áôr·/ä	<Ò4ƒ3“„Ô½F÷éº rÓ¡ê|pÿ|º&}ÃÊ[Ñs)•6¶İ—Oƒ³éRÉ#\«3¹^ƒI¤;Öï‘Ë/¤g«J‹ú÷¨­‘¬Æ÷T,jUj°¯Wo/—È~ñÇ¦³ Ğ…pÊõ]£~(ĞÃ3¸BàËoªÓŸ©ÀëŸ¹áQÚ•ò'jÔe>£ŠG ûIñ¶å¯ü°9aÉYNÒœ"$zPNba
Mí­ûúÃ=ı‡@¥Áëo@D¸k
äf@Ákª HsGk~üÆ­ÍÊ]ä®ï‚j7İ¤í¦ÚXguÚµ;èÏÇ” $pF*§åi²kXpU¿#Æ¸ÍL‹)3 Lbr‹¯ïıèÅD¡Sİ©~•Ì‘ıLÍËèÁgE«IüëÕê­ÊÎëL¦eûí4ƒúƒÕ^ŒK;kæÑŒ¸\ûâ
0-T&»7‡Kğ •ˆÑ½•¯»82·ê\¨æŠ~9üÚ¬k²¿rdˆÕ*¯êæÁÂCİ£#‡”FT‡&§M	ìb æcI¤zB)ƒÍ«İğµ‚|¢´t9ATRŠ	ÍÓÉ't†)ÉùYãĞ|…OÅ÷Z
HÔ`•nÛú¡$@‹,pA¹gÉâ8Q~õ.9EÕô@»è$µé­ƒÇåMidef
çî›’ ¶‹ñ÷Ã± =mg‘k†1%A¶ó…ıX„§÷ğ1ˆ32åöÁ¿‹’‚¿á¢†mÇùï(í ØaM±UFß|}jF\?+;Ğ®<4²dcİoOïNiÁî©N¾Æ–(´\õÂsf5–s™€QñzEgSO8İŒaŠİg…ûnü ·¹ZKs?Š-}Óúš{ì–ñê8¤.ºGKÙ‰¬%îyoãô‚øåÖ°‘âÔ\0ƒ}(Ğ§ãF"ğVÿ@>Ø6SİS¥ÂLñs—ìÑNğüzTı±ÔÀ›Ç2Š}ŸÉÑQƒ+«‡œåÄ¡7²úîƒóüôT_Ü‹9BÅ§<Åğ‡*¡Ëß¯­£–h®rz Ø\Óœ°2ìŠÚSgŒ|°LSûÍPŒÒ>…b¢ŸÅ‘Œ¹CÀ5û-?ïòm¤Æ*5në.2§¬úõö¥†WùÇ}—ªöY	ä¹‡x±¤'×Öˆqì_S¯3ˆv5®ï~ºÈ¥R
à¤¢£bš{\nK,ã¿ÁÜÚ6¡œ ö6×œÕ“¯ãx­şN ’L²\úopòŸ:ÉJƒ1Ç³¦øæïf|ÊJ;`ˆDãX¶É~TW¤®Ù˜“ób]bÅñk‘;ôÆ>ƒMÔı>ı;ßÓì¨÷Şå;Êß(…ó³p®WV¦[(qÌ'å-(i¨şú®ù
üÉBp5Lú~Ñ\+rŸOlÙòîà¸ÚM™†UÌ¾HYÅ¡Éxà¾ßá8)|’>…ÊŸº­-õ†eÿôPyP›å®”®´€ü4‡!ª•dÊå†:¬}&iCmˆòq‹t€İ;Ê
)šæğCl€ö\Yˆ	‰¾0ÜFËV™ÕE£Áçå?ÜôØÆÂ.5½¾ˆ<zöõ' ‰õ6›ò›kõzE¯|_õKİ¦ÒÍ¨‘ìX_cs8ğ&«´Ôùyp|¸øî¿LìAÆ±jõSsjşP”îQ6O
ÄT¼®Şª»ß½#‡×'rr4# WSíX„Æµ1ÄOÛy×<*.­T‘XåìEÛ¦²FGÊ7c €å6\gyÂÄáäêŞÚ; `},ÇÖA>£AÙ	˜Ù93eÃ.y^3ı½ğB!¾½BŸ8·}’À¤î¨u°åX¹}7Åè5^b¹Q¾nTü ¸<£‚Ñ±ô: \ G›V÷Ô3<ÌÛ6¨rÃŸÑƒÍÛœÓòêµı§$}QUíP°sCLòš×S„^°Ûˆl5J(ƒAGÇ¯+e_6"Œtd«eçìs3ádáƒ|ñ3ÛÜÎüÛÁıñ-ê©Ôÿû‘ótª˜òèV61Ë#múlÌ_–yĞÒåoŞKå‘«cÊ‰„`ùÔß/'_'nIölo­xlUñ$Å‰H³f‡¨˜:P¤Ş¿Ã¤«ığ0irXä„ƒÜŒ ã3¨r_œqz¹Rù*S\¸ ]İ€å[ü<?M…;Ç•E\Êô1Æ6Q©ô#ib‰ñÌda•b¦Ï|D¿+Ô±ÇVÔWİì³£¥¶‰^>2Ò„ªÅ“§È“™D‰ñGE)Ù©ˆAä–÷ˆ_•‹p2õÂˆCz¤ÒLJHñ©£Ô…é®^ÏÖªn‡[­Ÿlê?Ğ`ˆ®ÕÍy½Â»nÍ	Hß"•
ÇvÁíŠºÌ‰çÈIzĞaÒóq´~E¯#Óá#!.d7‹wc MºA >ªSû˜w±ïaß#¨ÄÆùŞ‹eïù…ÑØq8¿•BÌ´£Ğ\ò@J7{õ¤4¢MÀ÷íóâíœñ@ãĞ%M }İ‘îÙ6·ùÊƒŒQœlË4I>ãwÆ|…Îñ)3µ ü·¾óMw€ß•m?Ğçh‰§Ø:¥D£mã)@*¯p_ÌY^~S¬Le«Æ€İ°Î}âs§Î¹‡¦êãc"íÏüŠßÉ;.R“å­q&]Oœİz:ÌF¾úİrÔš]ıùm‹A1©ÌO1* éRKÄåÃ¨ş¤î\Ş¹Á/e”Ğ6r¨;ÉA2ò«1£ï9ªÃVÀíÌ•u…Ø#ÉZş¹)Ô	©Ğ@W¿n„N‘‚3Ù»BoYO)=÷ùO†ÂNÀãĞtNL¥tt5 ÷c¼—ú9í„ÖçÅË³‚+K×vb”¸«I¦‡J»	'õ
ógIÆ>o¢Hvıøæ–}Ïß¤˜·8UoŠYm¿1×5.14À¯ÆÉ·ƒ Â­Ô<ñ¨á‘ğói¾S";ó¢÷So÷’¡›\ƒ¦_¾l3×aøK=òî=”Œ)79ã„ë.¾úT@È5Ò{ºs¿³ıÔró†½p¡ÁÁÕ‡³Ëêá3záã.‹h­9ÈX¢n*íá´NÏ–Ë ë_çßåî@gt88Ùò%ŞÍçF3ö‚óàM˜õvÔì]¬…Ğ/çvÍ6Ì*éP9ö_æ€?Ví-QÍ¾ÎˆñŒIšäB›ÑÀ¬¡ò‹¾«•™ß?T®4t^Ç2ÂíÍ}“Ï^Ìõ³ßÉs6TÔŠ}i¿‹ysÖk¶¢§gÂ_…(ljEeeqÃãD"Ğ´ò+lJßrYƒ;ç_”RDk²GĞÆöÌäè aÌ"`>ÄÄ½SE;XQHNŠšxæÆeı%6ÉJ”<ˆjD!8Ñ ö“@të^¦Ù,l@²krEğµÃŠÑEtfUq“QT©KıUƒûó”ğª¢»¥xŞ=ÿL7T%7ºO±á£‚›PèÜå¶q+ĞÈRt´&3 ³©›è³r´§{š³Ï~É÷çÉŸ[ÕÖR‚ğ:©ÌWê¢¶D¥3ÕÔÇÍŒü‰rˆÌl“‰ö~ r‰oxÖôËğí™İ‡C‘åô	‘÷G/N,½işŠİë‘ê/lGW`07æ*¶cöu¡§{_¡Ã†{MŠnĞ?7è¤–~ğÂ¨æªx·6ê2iÌ2aš½œ?.ü€^¡ßƒ¥PÒÉáÔ»<ÊÏT9–DÏw65sg„lÃÖÒ!“±Ÿ 7?ÍEÕè­øbA3ĞY:óŞ!ÈMÂ³}ù®?…ÿ½'60jMM›LŸšV O?ÃõSÜùºo-b?yü¾4 $°†ijR’íÒ3i„éŸ{ÙSˆ2•CèoŸ•ùÎã˜5Œ|ôíüæE“–Şó5™ÂÇ…ø¡¡mH\Şº=nÊd÷­ãoJoa›44`53Á¡ˆænOÈ)L~j$Ó,WjPlR´éºƒ|S¾åZ áÖ­kj–­ÿ­²ËÍ®¼šÔr™½ï×áf–¤)–°ktâù½[ÒX/3xlY–šacä|ØU†©ÊóúáYo}ÀÎ|‘âCş¡’€$üÉáĞ«†¼`\@lYÁ÷Òß’$E­sr`ñ=7UHbÚ3Ã±‰ÿ§Œl­°EP¤Œ£Y´=H\ ›çQK?ˆ¢[Ş«73<¥\r-P«ÌP•ŠIK†E•9q«”7û'm±Rõ/³ÏÚà}¼å9Ã]aÎ2ÂzÃP;$káK0„¾Ãæ)«L×ìñ;°x\1GíùÚ"ˆ¯õŸ´g(	”•‰×$7,ç'´'şó&I×Æ,›)€±õßwÆ5B,ş¡6T:eî¢)Ì!ñ»ô…¬qÚ€±¯íÊŸ ‰ì,Ÿá%Ş9ø¶ÕÔâÀu«9!6qğâÉBÄ"ñ^88åPä
*«” _Ì9·²ŒÄ|!†<³Êâ$È)Yì‚$b”¨Ì-ªK'~j&Â‘~U×Ù)ÑBXoW¤Ö”İMÚ—œÀ_<ïGG%•É<FÔ¶I*†Ÿ÷M&…µ‰J³ĞlMK‰±İKé¢(•ˆğştĞò^­;zPpã1¤ ˜™à~=—à¨İp'ÚÓyÒ¾Ş §ku^šÙœõzâ¡rF=Á¶âD‡Ê`B…éK8Ÿ˜Q•{Ö»ĞøoJcšxKì@¿–]ª6\û<P¨`g×‚’«7|«Uõ›dÑå³˜^“”Rv 6ºÜòy\ºh'œF\@)ı“íÅ6îVó7ò@¬ >V’ãW0Fì$XWE0å Y„
¦;ypl?¦+Dşšya„82K{ŸønZ+}ÀeÚ/âoÆñ*5ªÄ‚òğ¨Ë. QG\9‹‰ãšàÊ%ÊX·_›9¹ş0|+AÌ6‡ä0B.İ<Åì§á>s„EŸ›èÕA6ôÈ½ëHæZÖƒ›ş²bœéôºgûS7L#,%ÂÕœË#¨•Âbãá;:óC„ïI‰$10Œ1Ì/'úZOà®Qú)³Í¡t°…N)’4£6í?£%Ä¡€	ı1p—H8üsìÑd±áOŸy@iID4wküà6Rp:sñæ Š&„²The¶ï³ì’šô’¸º®(Ûvj@"çîø8¢5v¬§JâxZh5oxGH‰¾/Nˆ êiğT¾6(ŠŞ-DvÈ‡.áX?¾[¸üçŞğ¼l×Ø×¡Öäó'³ÂAÑ?çRÕ-¸.$A˜îTã	Q[kÔˆ,Œt;âsëÀA€M›w3©Aø8¸¤ßS3ûøL×Æ·ù¶’û*³oóo¸Ñ/xSÖÅJUáRûAÏÄèµĞ§O—Ş¯iÊmc•«í†sĞ<ÿ#B\â£õ¸}Ê»/İ§AqiÆÿ/âô/œoA%ôıˆ#~j;8[Öµq-Š9(ğ0uE¡8¯)å2?´*%ˆaÒ³¸;Èü¼MØÛ t£¨w¹ŞKÛñy¶wıHÇ*:İ@ÃK
*²®åzˆ¼’rs%¹ı•Yâ´	Qîç[sßM•äÏ#ĞÅ»şí¿é9óÎ„®Ù|Å½Â¯'Më³ æÉÓ÷§`ßqbJÀVåe´ˆS:l_|‡4_VY_Ğ§Ú8cÀ«Ê˜(ĞLÜ¼ J#ĞYYE³›b;kàífZ¨òxËwlÿSjE0Y)¤¨4£?H‚VEŠ\b÷Ä£Ê¨|ıÔ&‡Æ°Ó_Î`¨Ó	.ÙR1Üª5DÎsBÍ¦³Í35²™ísÎ|&Ä'¨%óÍù‰‚–r›NÒ<dß`È=<Æ‚9Šs½ßÿç ìjjÚW?BâVa1$š¹=nT ç®{´ÏkzMøz!÷Äqñø®jSƒwÓÅnhU¡w’íGBÒfÕÖš@OaÏAÒƒOÕ¯Ååx¿]Ò+û¥~€´	…«"5ÈÃB7apªsÎy±ë6²˜&CoëqO7)¼&Mkj€Dw†„Ë¤ÎıyO¤ú-yƒ˜Ğ\¨sºÍ¶Ó^0 oØWËyS9ûzÉÒÂP×0ˆ¿e‘úüæÚ¢ÿt¨'¿BŒ9ùÛºÌ|_‹´ı¤"Õ?ÃKc¦Ü ¬üıhóıôi¡›|ˆñyÓwÊk©¹˜¡ÙrS¢7Õ§ÖÒï.s”şjà‹‰â¥2L¹Şãœ—Íˆ%ûì@pöAßßÂ­uK/±»T&}.¤Ÿ¯ô5uÄê~?_Ví
)œ&ÅÕÿ'ŸÇUÈeĞÆ˜;™¶5ûÍR˜Éú@rÆQ|êN5|×/4‚sµÔÂö^XÕ,=0©‰Î¿Ln¤…/s¬—h6†br*râšSO5Ê=Ó³´w
ha&ÔÔjK§mPKò»,›ùFÔ4B¾8à§§ıßªà‰šõäá }/ƒ¨¡2…§öjå_w¥‰äbğ p/htUÇÚº
7µª;ƒ ¿ëµñ¹ˆ;E&iÄ«šü½dj%ş6]ŞGTK¢'uÅp4ì%“ø‚€;¿˜é·áÃã—ïÈñ{^|j‚æÀ±÷³î–3D«XÆİôøvN¯ÂH’*ksæ¤“Ÿ X³•"³ÏŒü!ørXèğV¢×–ä¡¨Õ5æÉw®pğÀE­v+†¶ó¾f)Î¹°µÆÔG[ˆëÚM¤qú°ùó°ı²/Õ¶Õ#\ğÍ
j$·U)·rK®ƒz ,Tëá-š„8RËz‘½o¥ô¨LÛH—aËˆ8…9*&‡mñ!»ÁE½ –:2İŞ{B>èp’<²¨¦”tMpŒ{)zÄèÓğ”ö—”Q]ğÊïM/¬l2·Ñ…¸#”‡8÷Œ<ô¡û.%sF©Îº=ÃÀnwå î˜şïÏ!û(IÅù·z*%'€ı).zŠíD(~·/¿fIÆ[·ÉUòåıŸ_ã(²Õ©Âjí’ R¨:á¥ë7¹E2¯Õq–*}[ÚcÃ«ù]±C™ö¨K»8#z‹é%è{GÛàD•Ò†‹1A 7¾¸3şÔ4Ë­dÛíÆûôèD+NÎ!ŠQû3é×š†ŠH>àÅc CÚäKÌTQÏÂ*4ô^S(Ô©ë?!yúQYÌ	XğÁ{ (c›ÓËÔØérŸÄL-hÅ»/oğ’~PvjóŠ“ÿô¯£vÓÈa*=°\lr.Ø¦ÆÙNSâ$còSCs=-Ï-Õ§_'#$ÍiNŒ°¯á¢»ş"Š›µñ3lï¤Âá
ÊÇŠÙqe$…ìáººÀ^èÌU…Y.7q’Z§Ä‘½XFáSî$”rÃ;“µ
áÌÙëàøLf—Ë.›·‚ÌÔ¢Aì¯–™QUåNr^KŞıV5'iZN©ÔÇhúj‰÷	…­¤Ø÷Ê	”¥¯coßfG6şßªûÿ¦CAIHâLâ2>Îc9ŠZÀ‘Kñä.º ²(²=únAÏ›rawE¿šôÖkhæè¶%VoE,D$I*EÔ³(Ls½VÎ`†iÔ„EŠ_f"ÙPĞ"Ç4YjÜ~GC–M2Å!ü‚ò®•< /ZÉà ˆÈTŞÙ)nÃêÿmö›¬9ë•´{x ãdœ½¬ü"ğ}?h1ë©ù#«À?¤º]úÙİ•1ıøz/Nšê#.W Tç>çÕ6Ò=n	†$İwíU4U-}ã›R>]\ÂÁòÊb‘ª—üR¿vc•Xü6ætÕFT<^34E$‚cCÒÁr&åö¡¾Œ"OF»[~¸èÿ]4¿hˆ€×ñ³cÿú`Ñ}ë'Wš
¬âXó@ÂÌÌ^r®?AÌúÑ4i¿–ÿhZÛûUøwzÀsP ‰˜Š”ìÃÚ*´,ªfXHÑô»çzV7
rTxA¶FS¯±Ù+6Ppu¥¤…ö”B_+>Š~H÷«‹w^¦Ç¶Ë*‚ùx2û»01s°c¸˜ak•Q¶èÓâUÖm=¡„{É©9h:£	ñ:skxg3B­SlŞ¾€‚E^|·ß5ÃĞ­ÉrP›½{šÕbòí()AŒ)µMúA±è’ÿ…@á>¿ñÒ ÅÓÈ9IÏ2ŸL…Uw“öe+M{ºK¬0n–õ¿ßlØ¿“'mªÈ3›d\RG?OğıQó¥c(ÜijóÁ@Dó‚VeûK [Ëœ-%dÄŸ

ˆ²7Œ²Ô	NñK pa3ÌVÒ 8§a°P+ƒ€›h™C<Pıua9şÇU{¼Ï“E “»Vé¬|—);@#¸‹„-ÛÎét5Å¥RX{cœÜN\òfã>¬Ö\™Í˜fËe¸[ş¦R¶W¯Üå¢Ü·œ”Ë ¾½Ûø¹Ã‚‡œ<µiª0Ä^\Q¨‘I"®O{SÕ…ë)9&~¯O)j}3QŠããÆÌAKxá/€  I0¹Ğ£X2Ş¬Dô¯ª•ıäUÃ8:Ã¬†éÕ¨ˆü£“e“ˆ)í×ÉÕF]V«q.â¢ü^ÓáÕ6Q±v3ğŸæÊªRà¶ß•í¯`ëbú—k=¿u
<+¶U_X;•üó>³¤TGòŸp¦°É0ÅöqÏ•Qÿ	î*	ŒtŞıÄRJz8ö	’Ù‹(	Ù||'	’¼7êp¦îE.úNg;z¸öC˜u$H4¬÷ÉÅuWß{–ï‹íñ„“ÚóıJr‡‹\
ä-Dã¬ÁOc¢û/6ú×‡Dp§«
ı¤ö'-ºsé%±(AŠìUîÛ4q&õÎ;ÏJß•56/X}PFN‘aJòY³ë›Œ? sá|ßÅ3óÀKü[¸ôî,§,2ÊˆXLoEŞ£²Z34dTÀÌD¢sHAYŸøtÅXZÁc­İ3s ›¢Kä1Èóæ)’ÎuŠ+£$~p~‰/ùfª€Â8¶ñSàÎL{œ}.Ji¨æ>6ƒ>ä·á¾² Rø8E1'Š Ìkcp@vÖQÃš~åOdó0z/äÌšôåb]úÉ¤ŞádsŞgE™?Ã:Icl!ÑãJià;qğKë” u[ÀPQu?0³Ş²_Ë‡09ËĞç Oı.)—˜ñì”ÎÚ•Êó$©U2‡—Ñx3ÿdğí­*|d “î¡zŞ{tn~^—ìò»E©ön¼8¹úüí›¹#äe­?¨4ˆz}<ã
"(‚¨t6<GqƒÛÔ´½W[ºî4—wÛ}K9-£Qó@%°Ìa¥T5Æ%-š ;R›SN—¦†î'‡r<<Ë™ÙÊokÊ<h×ñ4cØ\İ¼×<:ƒ€õ©¿	v;„æpÏÿw¡8ó/LƒšïÅA«jCey.Ób_€+7—ğÃ7U¸Ó¾Gß<7.]ÿ£‚ºYñµİîCW1~ıØxbzîäÆ5yÔtÌƒaİdÖ4aælOñ+Pp3‰éßéhsä&zÚ˜åhE>[å»ï£¢"¬W&XÃ­£z¹$FéÄŒ»¯|†"+¸	uÂÄ— îgògE?Ra¥şTxåÌÙN`ØÉZû{³q§(¯Á\Ñ·~cå©¾®/—"0aƒÀkT5¦`dÒ" ú|¥7Ù·ñ÷ÑNè»%wÌ‰¼Kv¼qí³|x¨5²f jÁjöl¨ñ“?¹‡'®jE¤"(¼=z©1Æ’4¾ù÷’õ"o‰Ë^3¶çÊ5]…û)ùÇ$SŸ­²N÷Õœş]z,)Â¯Ø~N}¨CYÛé­ÀL–©äèdOç¾]"ÛèP›EÛG´m.?¼²'^F5G1™ÎìÃT?r­"Œ2&vÑ^–kGl?ØË+{>€¸¨(aÊ´F‘3dk¼th©~ÛV±†/|/Â$±3¤‚ß
×ÓïêU:1¸o3o»´´é­^É¨•Æ|Ó/BÇ•§ƒFó3}-&MïU¿Áz!‡¸E­m6HÏdÄÓF=â/bÍ?Æñœ’0 h”U^ñçéıGQÖâ9¦{¢ñà:Óûôóù‹ô?ºäÎ/Ù\r .ˆõN¶H°[âĞ‚\ãåuQ@öc•N‰#~Ôú9Ë~9‚…	Õ‰f™Ñ|Ñš˜fÜ &6&#•\HµàG>ÌNŒ¯«	l`…@vãĞd†ÏÁT“²_XD„Á³É˜Üs‘ş‰ú–Y¸¡Šg^=5âf!Noİ”(B/c^Üì—4‚ıEŠ4Èß‘;FdgM¶µ1ûL•3k²lìÂ&ˆTığ‘!`³ñŠw2mK£!Õ%ÎNµ3xÔD„?ÅŞÕ{ÀÙu¿âÎ.:ìËgÆ1sXÂ­8ƒRZÂtC±\š:÷ıøÜÛg§q}nUHéz·–Î†ìï´ğÛ*ì«ª2ê5º2Ş–:šø_Òµ=¬™‰CÏZ~ ö+×ï;¾çguOÈâ”Å;t_†XJã4.;N,Â¾²¾XVÓÃ%E´•˜ê*‘DV½¨ø£Uù_2Åİåš†“Â$ ¬˜½èB–òB¯Ôí‡¡Âfä[ät»½€Ìw¿š™79òÑ“E6üúš”oÖ=ZK¥ëï«0™<kå³^g²W&5YìL«etïF'+oøLîÏ•ÙjÜz%ª´Æüa@oËÅ7n½aYøµ\ÕçÍ•õIDbmïà¤ÏD¾)É	÷Š±ÂİÀ–K¤ğ0³Ë°àÉ`$×ØÄïF”w~ê^›i¢*D© BV
úòŒlËGĞ×ó#Ğ»U™şÅ?Ğ¦YÎ(¾
H—´è]HR â°Ë}r±uáÚÅp ÅÔ Zgø‘É¯ğZª}o8Ê¸3xXeT³öaOŞ‚ıK2ıÀp^îËÕ~9SfÒWf."‡\mOÌtæ»¦ˆùC OlHAı„Â-Ò	ÈRe4ëtºSÌ±I°‘Ù§f@ÖûÔ£³'s@1Ã+Uãî“R6jc °ãúB©ÖÃ}fæø§šœ.É0OPI²]Œ;	5}0MoËì}¾%Ÿ±öšÒ…çÕêpMH3µ…ı¤«UÄ¯nœ•“‘v'ñm4º¾2~á¹Q0™;nz=¶x`9*ÊÓ‚­óÓûuÌ	ıçÀIìJ«úÁÜ#t`_¹~dfŞkT«(÷;KKpø·İ³šƒ1À·¨áO7¨"Â$QÖ >ÕN(÷%;'€Ø‰+5 h4Ë&pt¨¨p…XŠ­ş‰æ@FUÊ»²¼şS$
QTåHí¨÷®H¡Cg,Ôßf-Å÷¾èòµoµuâ»EqoüÌfMŸ}6À àõ1ˆ]b{âeò×Õ291”©£~ˆBÎ+ä¹¶Ğkn„²Ñ¤šàj/À·}‡náH•ÃW(+B’EìX‘¼4PÉÕ>i§95HÀÒÜ°h˜ÙÕãY½ix÷¬zp§ŸÏŸçW"‡ÔTÁíÇT?Ğñ[qî»üp:ŞAÆGÔİø@#Íı&ÿèáŸŠ7GkÊ[ÿ÷Gÿ1ƒ»õ,³Øs:Ä3Nªx—æÄ¢üQtëQ} ¸-ñÜew—§/İµı’v†™{ÿs’2á¢d‚Én¶syªèÄ¯³sFlå†
+I
UFš¶›}mÊWVªkÆ`#	@”ªËA[m+Sjx«ôd`c‹mêîbP—5K¶¨ğW‹qËßœ>U˜UÅ)ÄA8Ã£%ÚzÁˆP"YM ´´´Aé)é¿L
.gÜ&Ï6½G9€@©Ö7t=`œ’Åó›Ù/dŠ›:ş0¿vÿhÜ
{$ãít@9ÒÖ¸cA™€¤‹Ã|#Gfüå'?ãgóÆ–k6ÑQOh{Íÿyğóürû27%V˜3ddZ²læ]véÜòvŒò^¡Ô¥7İhL.b0‹>0±6\’~I\~èû3×ÈÚÓŸáw~£Ãl&Ï°é~(õèã”Ü\wüûKF$1@?-B[âŠä%ßï=€;İ}^íõ¡†Œ»kE…#ª4™F)¥»NsÉBñÛ¾>­ÔØk9õpÌ®ğ1¶OdZ]äñªKÄ·Az7ÜU×FwÉÏGN×93ò1?ôı#†!ôÉ)ß›¥¡ØçN6¨îÙN4ÌÅª~3ì“Ç³Ú cxÿ;t¤¡à3ğéôK§‘^@ÈÁÚÔøî˜_Ã´¤;‹ëóOJ‰]öŠ¸0UÒ^ı3Dùİå:Á‘ã<¸ş  ¿Ó%hëdŸÁ³|ÒE¾Ff53öæÍ™wY‘´àíhõ{V-¨ß|X;%Š×İ€ØGÛ}ö¾íëyÜB­r¦Ë‹PÿüêS<§ôk/ÖÊjÍ0Y¸>«˜æZÜÉ(Ët-WêâÌ“+»¬™õ¶HÂŒ‰ŒøwCépĞ‰áaE’i˜š¯f‹~ÔäÔÑëÖZ¶)Æ~Œıœ]p@ï`ŸUüøëÎ«.4
Hº)ßcœ\§{°Õa÷W0Ô¤¾ëGQ­¬g«æãÜ]ƒ.—°¨6æeGd(IšyµŞô\ ·ÁV’øc¹)"ª­ö…´É¤ÄK×0R×æ>@…d·ğı$E\¯»Ä¨F•ç‚ÊuÚó–eœ7÷pkŸ’9ÑEş¿ßÈGEÄß¥mæ·ğv–’AôäÓŸù…,Íø]„
¯R:ÈÎ1±ípº+¿’UåjM	Û±á‘[áBd>nùQ©ÍE Ò[^Ô„°²İÍ¼†cñÇØk}Ü[T1H,¤<‘|ÑÕ”ÔQÀœñ ä…¸™·~Kë~ü}0V« £_{ç`ƒø•Ì4øœÿËZpI‚©M­·ï×Î´á¸ë¥ ºãkÀµÜ¯×ªDMİµ_aèsÈ½æeÅfİY9Kb“¡F˜Á
oª<«Mİ£ô6Dı¶Œ§µĞÌ|†ùŠ3„ÒØû-“Óérö‚­:{…@-5ls’B‰ĞI|!Íô¥¯şK?ƒöÍ™ÁzçQ(0xha[8¦E)|h{¾ÿµW¥)ÎCˆ[tAâ#ÃiŸF"&Ç¢X½â¨W[]I²ÛíÉƒĞºà³…“Î•kï¬ŒHÇ,a4qÂ`ä|}AEd]iÚÕ4çók&7 g ÙANúpbÿ¾sòcû8îŸ˜‡QÖ¼L‰xv›Q÷¯ÔTX9æl”Ü+ë>70gG„ÿ[Ğ||oµÿ‹	²lQŠòll‘g^è”ÛX.c~K–N"ê+×Z(>OÜ•6Cœ‹ûã(0¨¯N¸ümÙX·êÊN·Ÿcd9:cU“Ÿ…5•¤ 1 :S£Av±Ö y1ôRÚÓ6T9»½Å’i/ÉV›÷Ú$âøıƒ£ š˜dï¼¡òi<b8ÒØõWıèeo&³Å­ÉĞŞOIÚP,§4[¯ğNæôâe'Ftøå.ˆg@=ŸÔ}åÒ¥MÛò‹…ôs€£x!,6‰CË_-oŠ®¯í9ı9Ÿ7L´xhp=Ì`-şàlÎºu½˜–ÏÓAÀ5B˜ğ_—O®h…ñ”	O«_¶`;`q›lçuîGÓêÅnÂ§@¹uAŸål]<ûC¼M`!š¹èr„ è	M³é¢Jd×*WoN¡“Ë€´íÔk½ËfPÜ±*ö£@±™ËÅH&u8“n#å¯te	kÏ°#_L1À@Õ:kãÍÎ3.z(‘'euò BK[GÙ=üeEõ­Ë²ñCŒt{¹'’/¤Å8}.ã¯bêix
òÅ+®j©—üóÛf,}‚Ew!g¿© êP‚Ğâ.
ûu[ê4Œ¯FË¸Ãk™×fN¬fénÁ>HİAuÒô{Ó
%¬Yp®Öú¢Eú¡ÎÜñ±½¥$µuBx¥·àFÀjó6wr¨ñ?	¤Ri_j–×¼ÆÜWÉÂRÆ¸g8±I·*:™¶ÆÏ­ĞöFÏìçÿ€•Kiø‹ñÇCDZFl=zÔÅûéNUG&JfïšuÊ1@]z8*›Ÿçàz½ÁFX®±½`€âŞå9¸1zÛ‘¯»‡¤—´R~‰€î¦º%¼cq…ÁmÓB´£Âõ’ÈŒäNØ-¾ä%€g<n'pÂÜÑ+Q|®­âBò–@vß¬_3æ‚ÒøaZ
6gAÒ§¼V»·T ’?P±)šò"^ôõ‚ÊùŒ‡ğsšHÓ‘rûÖÅE–5ı|RÈDjød.ºXd7øª—}Î”‹GÚej²L)äX•#T¼h‘æ_L¸˜v¾oªP±¤ö|‘«,ÜH.x#ì‰-ÚØ#\ J4¶”ü>Ûtê­x=ŒŸGSjÊïc¤ócÑ¥"=ı±´ïh‰!`íh–Ë=ƒiµÇPzƒ?ã^*š”¹…XÙlW¾ŒY)\sÑO%„Ïïê{k¦‘Î+éÙURj–Öó†zå~˜*Ğ¨¯ZD0ê‰ÃUÁEmŒÖd:^úe
h†+º–>îÅÂJ®ûÄ ³J'1Ô¤XM1lÕ»ckÚ°)ìÖ{Aloçvvjm¥Àğ™
h1î¦ĞIÃ·áE +}·ÔEÔQÖªäm|e»}“	¾WÍşÚWôß’j®ïŸ´2Ã;ª£’şhİLi¥ÍÈnÙ}ÁùKtá¥ß‚½…<±£¸ŠR¯,ÄñÑ*¶"Õj¿LµoãbL¤_‡}sÜO/§ºSDj/û@$·´o|„ ìâq|‚,°oìOúH1‹,ô]"P	 œCèw;F1ÂèµĞ`êmªÀ	Öˆ·%F(,¬›Öñ…e¢!ä\óåRNÑlFJó-ŸbWCOÛ¤ÖÍµï\ÿòWİüšQàLò=‹
ùıÜâñnaaHfUŠOô!•ÑÍØöJF+õK”¼Ô„ùt^0°©…eÚ&ŠÀƒÚh4<L×gDàØËÂ‡!§j–O ´E§¤àŠ]€7¶Ÿpº?a³._vâ«™¹fgJ»ègAv<1¼_è}_h|×²ƒr•ZƒV!û÷¤ÖÅrõ+"±[jµ[Öû7µNÒltŠ>¼PQ»`Ñ˜Ûj ryúf‹ö—hÅ …o·´œ{îï6‡úÔ÷é?Ä¢íÔêÖB9f~Ó>ÁÃ’ªº³».ïöSaCGñ%>V†­Sà$•ıôwÕ{øæF>?Õ}\RFyı)Nò”#óş¦ÉÖ°ğ˜dXËsîˆ5ÿb¹´Úll—d?’À
¤¡nç›¢•3 ¶Ü{ñÓ‰¬«ÂG‰…ôM†¦0»Nƒ»SA>? ¦@?zº(?ÚO7xlv]h•¼éß„›Æè;3È·jèòôúo)cèÍÿ–Ftål’\Å
hã‰ˆãÌG£Ná	edE<‘^#8ÎçjÅeèf?ûÑrÜo7<p÷ü\)ôÖheaô¬38N\Püº…@)Ç`İ5õ8ë@“m ˜©ø)À{$<bîĞ”Öƒ0ø‹wàI÷¸~§¦¯[áPÍ:Q?2QXjƒõÇ¶ËM"øñğXê~½º+ÔgÀ‚dIíkBŸ Mì0lîB†,Íşê£U„Ç˜3ï 0ãòÉÈW‚”+”ÿRm°±ô&°KHÌ†7{o ^À)~³Ò8üÅ’ğ÷óİœéÖU¯I:d³f‚Ç~¯¸®ú¼ ù#èXmM<"Æq`b.ıº=L•ÖIc–6ğÇ†˜y¦ìk vá}=öº‰şÃ@«^Ÿ*“ó”‹³Æ°ùì¿c9N0X‰Z†ßK‚…W2b+RçŸ;
;IÛ›RS'ïÏÆR»WÂ¸²:j@`æó0¶v&¨ÊÚªÚúë÷l,Zãğ½œãŞ>Ó.-By~?_Sè²l{{2
‡Ï£ÃÙşG· "!F–´?‹Ï`öwh¬ë¾ ôà•É°¥ÑŞA"f¹ÑÒKñ?Ô*Ñ*©n]j<ó¬G®Š—uÒäPmên¨·½Nº>qİ:†O!ĞÏôCşö±Ã2º“Y!9±ÆÎy¾÷áş	Hn‘Ö['|3n¢OD¿ï˜–\ÁÖWDè%ÀÀâ¢¥¬vM¶üğ¤\è#ÇVş)Ç´0‹)ôA>êa4LG<=ø!{0•…k$ddÓp!aò‹£ó99¾FõàbµŒ5Dë ¡å§°—­ B+Îwã_(ı|Zøİl–Gé99J¢DQkõ+Ì>@Íqª‘¿®ò3¼Ä3Jâ)àòê4HUA‘>Ó–ÒÎâÆB«hàè›FjJ4J¯µ[âœ‡«9qC‡ìÖô¥]DA9›èVn²Tî:²†9
w*r«Lk¯†`Jµ/ğYÏ„È¤Cyø¹5ş5_Ekh'+õyuÏªcù	ñ#4¼»Ò•&G°Â
Àó±E¥0'¯ƒ‘»²{d$U`ª[ß]åæ€ÆN63Vjx%¸8?uá›Ãu2`kÖïh]éLy™O—~$ëê)€drû~æ«ôH­Wˆ¯Å²=éF´#«»Ü½›P[Ê±î=>`Èr‹ªN(<¨
µ5d·e Çxßa~mƒå[·Ú+¨)-s‰<6ƒ7 C,´¿_&4P?y(¿xˆĞqv‘€ò™EzLÏà¯>Î~ò+=ï9¿cyèìAŒëÈù4D÷5MfÜ Cä´UÕg”±2Fí¬^®•A.& {kÕº-AŞ\p–Ì°‡Ä¹â,[nUsò‹™¾!J •ò0Q;A‚?O|ôíŠ7•ï/·Mõ½~øö9pÁ|{Q*x,eşëë¥j34Î×ÄT¡gósrFÀ33½0“š~ìA‡5ıq»,ö\<FéÍ§,±—¯I+)˜É	é~¬óÍÆmQ%¶7ã—"å
Ìî"`(¸1‘3ëœÏõÅ|¸âš'‹N”¿vòTÉÛÍ%äV±J*Ë›gÎ« –Î®Ëú—åHó¡zm:ã­Î)˜ãÌû
Æ®%j*!—ÅJ±ŠrFù,èµıiÉOõ#~L]Ÿ»mÔW;¼ ` cOM<0R¦3Y‹¡ãƒZã}Áˆì¥pƒ“ı”r7ü5B>6³,óW¡´¤\6$I!è7¯r§Ğ
QØ;bÚ‹³À–ïáéòæ‡®İGö’ãCšŸ¼®˜®¢2Iªë•¾ ]Ôh(sÌ¾3¾o+z?­Øí,GGØ}«³qæd>ÓU	ºşëypy²PyÃZ|şz/ÈWÇt'tÖ]²„`­Gıà²Æ±4[Ï‘D‡@óBez9õi¼µŸ,›d{ú¨º­—Šx(/î‚XFØN—é¸„kˆÉÂĞØ.Ş$?:ciÚÄ™Ç(»³OsHu
&8Äeì*_Ì¸s •ı”+û °áÀü¤=Ù	ÃUŸïú‹1n’¢ÏRüÎªôqûG²bÿ¯æ9¢6…D[z¶@ƒˆsÓ£Sê°–.¾XÍL¼X&àXÈd£[Ó]G˜iÉ.¸Ïò•¾§ÿbÀØ”Ü¸'1UÀ?geÓÎ£6Ël¡õlÈÇeìÿ £“,ÑBä¼ü&LOÊÀ¶¾A"~Ë½OÜmûôÏ[lËƒ¬Î ˆöûg»A±U³ü3-äFyÛJz¼	¸T®©Ê9Ğ€%­àù›Œ	ıúì>šÖãB€ÊjP¶©÷ÑkÄÂÑ`¹Şç®çÑ·½² \,Xœç; ¤šÚªüi}¼—üÇŒnrık„!}øõHˆ®{‡ÍF¸ ÁñœLå#<£;_w„1§+1ş*ñ{àÈ˜±Á¹Ê+†°xö^¬$#Ù<•vşÄ…/ë´8lyÊ0¾¯ÿÿÓ	¼B¨r*’'Eqg“j£Ø$óŠ‰Kïˆyìk$}#oYÌÄÜŒ‰¹×Ş>İMš­92RÕf:„e\¤q~cE6+‡æ 
i‰rğÃG×Ep!×İ¡>Ûçy :õŒ“yN"wL;\¥X	Íæ.Ö‚ `´fíé}²ÿégK'IÛ+Ûof©¥—aÚ)¡°Š·‹’ÀQCÅß^O¼O¿~GQğTE#„éÅTQ·„Y2@¤ãºÌKkrC9q’ïÂ>²4î¤G`y(o‰œEğ-N¦³Cë¸FXÚ¬Óü!>X“GHÆ:‰vÑ†WDÙd&ZÂÁc7BU‹ıÒ à¥±y/Úd;„Ó¶ò°Øzşªˆ¬üz:á€¶ym»v§ ]sl—}››7`Á%l#R<‹¯Ä
N('‹T ¹pÇ`·€t–ş	¨À¾4À¥Øš»‚aÛI-Øüjš|µ7Õr5¿±ÛÜBqÕ&õÁ ;¾‡ˆÑÿ]ò è`&+ŞË¬³”ƒJGx¶ämAßµi˜Öd#&0Ë .Ÿ¡Õl–k¨xg½b²É¶úò…Üd%Àµ6¥³mQ´ø1D«ˆA1|oa„Á‹@`*•¥ó:\ƒóP Ğç°ùP†ˆË˜¡˜€±´A€\æ~‚òb–´S?ŒÇµ-õkGß°ú§¯f1hh6!åWÚÆüÒÏó¤TcÍYq¹ÂV¯V™3hdL-aVĞ.×qXJSIcYµéo;jVÅ[Ÿ<Påä£©”[©İÚ›ÆÙmn|‹4Ï^Ôé¥¤Ët­Ã5%şb)i…vJ3Jb†‰“ZŒaKå	áÕ, ô§‡_ı‚íÚ7Ü.deŞ“·çBèHR(<ôX_XU+½3hòrğ’ş—¡NVCV@ h6¬»Ğˆ›ür{sÓ"·=Éşp(@bsHj¨ºï7Ğ¡µû¶ ‘µë˜	•cT‹å™åô£‚•®÷ÅâÌ×Ëƒ	VòÅoäƒÕ~ÒÒ!ÔHa³ xó¸¨§c§ RxÏáÂ÷ììmQß1ù8×•kğ<›6ğê®… ba7>?+:ù'6×tÈR®‰kFv[øaŞªkÜh‘ƒ?ÄÕçjâ>ãÅWÎ±Ùá\ø ÍõO§õ¸yÀ±íK¶_šÁ{^ÖJéåã‘œ{/ç ê˜`}DÈş©$Õv²ù–Í¯N—Ó!¿ªŞrÿ¥Z‘téV(İ+y´‡ÂñèÉú²G¡(óÖqäÜ_¹%ş†	ñ0Ğg 8J-uÀ²?@p£˜B¸NqTı(°0¸vç•ËofÒÅk˜8Šv·ò˜AWµŠšÚØı¼'›Ï³ı¸U0ÃVÑ&¢XÀÚ‹{œq	’w¯N­všØ
 Òçœ÷À‹ÄiX!"DŠ)]uÛYA‹‹Æ{[!¤!-×)T4Ô«vó€¶Tk¢¥=†”˜2o 2ØY¥Xî­8®ØÒVaŞµ˜Ñ’ÓW¿¬(t.™™
g«î¼›jı¥ªŸRAŸ8òŠâã%G\
êwz¸TÅjá—VŞ§¤ø7ôœ‘…ol™o+urâ0®)¸¼I‰fo 
 Äğ’„eÙµtûzô€d5?¤í€¼äXy7úÍæë9([Lÿ?8W,ö+-jŸqœ§eîç8æû*ZkÂÏ3øêó#$<Bä˜àúâ½ßi¯s‚ß p`ó®Ë·*¿Ì*h†»ªdÖÍßQâ¾ğ¥£!3™$¯>éD0°M'š);úÒÃáæ GzÚÊ‰Åğ»ºo¯™À±¶Áffì•Õü–è4Šíİ4«ë6ü" ¢¡5@Şy^‹Gê+„#i*Yô‘“/³·ngzåÿù"|h°•ÂçƒO{¡²ËO
N%%úã!,ÑA9É &¾Fÿˆõ
D´bçéõ-ù]Oi€\{š>(»O²¨6ã3ÓŸ‚–ÙHanuêáÎõl1˜ˆfÙYä“lK÷I…û¦šæŸ½™².ˆ‹ìÛ/Ôã@f‰½ø ndß•ç¾ÖğóBøiïé“‡­A²üèû£º7?-Ê"ÑM¸wQ®ö{héc„[ˆš.æÚí,7Íæàõ¤|ÀAùu§)zoÊ'@«or­Íßß^¹ıOúJMÀæ™  kI!w>>ıüº˜¦ØĞeë¾ZZ<J@müfìÛdø]ÄHV2ïğûK*¢Œ3ÑW¾jŒ,Ûœ=T5Z£&¶ß×Àòb\jfMè>íÔ$Ìi•À:¤{	iÚ!_&÷‡	‚ğp‰gfâ]!¢]jP„K²ı	—U,éø«tÌb¦®ı8	åƒÔğìĞ÷9^²k5îØ%²tú¥n•ƒÚ‡oÔnüs?a>İŞÚ ÄÖğP”d”‘.2^›ğç
«¡Õ#û)ÒJb/Ï3ZçŸh~úüÙ¶T%PØa}AÅp72PİÎFñ‰ÜköŞAfS´*İÿıçÑPEA¡ÌÁÖœswºÛ‡¢«hS'UEpÌ,Vé‰•›ãÆî»ú’RWzúkÈÀåèæR·é¸”aµp4àáKf¦ˆèW)õy}ëÔAmoOàÒİ¦t_¶Ú!${¦²­5~ğõ3…y¡Ç¯‹ è•×{±ü‰60Ì½Ä\˜<]	®õÕ3ŞsÃRœØvO.1~îŸ³yÚ$¡ÛÇéÉ¬ÎW;î!MÆ9cæXğ/Yë FÅí¨õKGÇ©7Ïs¼
^E1É;%·íÎ5¨¾¥Ğ\¢u-w”m31¶kŠ¨ÚJJs[ƒåZı:~¯øéı©H<˜¹­ÏÚn1+!ƒèÅÜ£Ü²ß%¶™†?„®©§°½jÒ9%8#=r¾]zÎßå{}óvğFäÃQkx -Ùº:JÔµ'Åü¤|äºƒ.ÔñÿHÑ~LüÙ//fh¾]oÈï!øøT/©£ÒÔ~›oTÛ[HâòxÀû-øíŒi™jøµıKTÜøª?üŠ$r@,£ÍÏ¥t˜Zù#vHÓ¢–3õêLl§F¾{Ö/ã€p@ì–ïxKÿpÑÆ?ØÑA'—ï¨"·¤Ûp‰còêcsåmƒšïT®‘"UÇ×ÿİıHIµ7…„NKå¢«H>ÔAsF‘“øfÆH¨MJÍ´§ı 7@wWğ\!z³=ÑnYt¶½‡)ó¢Ğôm`Ô˜¶q]ƒ§MíkÂóZ¶â2k©æ^œ.ê;¬ÁOãbhÉğ ZBˆ'H¢fe#"KÄ*Ğ<8'‡wi™‚všÔíûä[ğnì­… ^+Íe“î?Ó1-»¬Äf“ødimD›Î|)Uî¨ÏÏôZ}ŠÉ!èğŸÀ´}q?sÄ†"à¢ŞÖøî&,…JeœÖâCfÑgí¦g…Ôİ°´‰¸,ßÏ´¿*n°¬1¨¤í=óc„4®[/á4¿ŸìD 
Xy[öœ«ºÕva¾„Q÷Ü—AQ2­¦y»ÜsıäÑhÈ¯¯+ùóÕ*~±4{,O°¥£4È¸ğFAµƒÆ<¬Û˜<•\B›Ë\<j‚OäI7Ãˆ¹œ ñÙa0ü²ÖÆh½Ñ(<Ü
 ŒÙŠ\ß‘5láÊ–ôêQ’ê’ÅG¢ïªvÒ¼?øO3aqTx Ì^üÙ£–æM>ô…ñ³£Ø7ß\BÕ¥ïb9¦!½
“¬cÙ9½ÍX¶ù• áAQç¢·ì³Ñt?Ò»åš];&Ó.ªé"Tïu©>€ 0_ôÒÁY1ùƒZ[¨0ù¬)mıaZ|qú¾æGæÂğFlwşk=çÆ Ølˆ×ô¡ã¿†è'›5¨Tdr+Ÿßyï(]bs%‹úÇ¥½_~hßLÆßzóIi7›yíc•¼íâ:ª¼˜~‡g	"%çÔ	M]³(ÄZòÓó¯Ê:ÅT¦KLå˜­nûKPÅ¡dœÕ	ßø?çiZş¤ Îm_÷vûd‹W@eì‘ÍşãK»ÑzDLÒJıšjµ‡/¶¼åÑün;Â'a\Å6Qø¥1Á^ {æ¹p•Z[K„µª(åïƒ†ÎôÛâ1–-#¥TÛCú\ø£å<÷•àQU¦Z/YKZEf¥M¶q®ègcíFWäQ3Ğ '-AûÕ£‹Ç4‚–
¸W(ÈZïmy“¼ùI¥ª‚èûms Ù¶ùÈÛ+"½E¶IÖÁÑGé‚İÕ@øİkãáçnIÈ
áÔjPá+ı *ƒ  }Õä<ƒğ©Ñg|.ÆÁ—³Eø‰Q™»j&ê´)d¬`˜¼“‹		[ú+=ÔJ È[_Ôòôˆ‹â¾Ã½©Üî‘Ká,~úï @¸k'ÓxU¢€ÛîïG²€d)4f"œÏI0bØÛ°mRb"¿nñ,‰‘-Ôî…-C\eÓbá	ZíÖ•ñˆ£Šè[.Br§SJ§°—s&¯‰è)ï
€¢.÷æ¥/º£ÕXñïŞ¨?©ìÌlÅ}ÓV@œ¤Îç&qZ¸\E6ïkM×İD¶«–4£ 3lšóaüX=ö À®ÅO¹=2!İÏ¬ë¯Ï¶:_³¢j¾ì`ÌGO,%j{ğmx¶xÙóA¿¸å´ÿX­K™êXäõŒ÷•	şMéá‡¶‹üŒ²3äx8†md)Õø™wş*†nFpß°ôûéÚ;³­mD¢¤”=»ïy…I+üÖAfµcŞĞóå•*/Vûr'&ƒ¦ğ7váŸÛ0Ñ.^+¯mÆ×1TYÔeƒ…µåx¿Æ}½1™Ö½<A¿‡OöÇ¦{Æ½ºhhéUÁqs¬Í™EÚ¦Ç2L¨kR®éÖƒ‰YŒ3óî½LWĞøÁj<:ÃŒp.µjcá"cÈğŠXó,«'&KKÒ—j>ü0ô;I‚F¼àŸgxŠHFıùCyöÖÍÏõ²êRy¼EK×âóvFôƒ^üL±İ#‹Aµà´r÷=z_oªhøxy%í•ŠàonÕl}
¥×æ\ g±"œ4dkDx	\s‰$ò“¬Î.OıETÒ‰Tù6Sx†)ÒüÇìşï°ãš“Rİn‘¹\óĞdI‡CBÌe;&¶"4ùë—=B…cÇ¯6y°«Z!*TZ#?+Ÿ%Y‘ğéƒØqşv0¬ûrNŸÆ‡!`“¨à±cÎhÑã1„²·óâ€¯'¡!Êf:XH­GÑ¶,Ñ’8-ü\Èïe}Eü@\Û…àlejh6í„ÛÁWùÎ€!ãšÅCŠ ¾ÎATK¾gŸ¶t7D×ÑßÒídWµ¦á¨+½xÂnÂ_EM6˜.G)´ ¾‹N®i1ß±½ $ïİÛ”±`,N¾¸íÊöÈ£`!Õ(¥ö’ÑMñ¬Švâï¾ÏO
)X­lÛE²
¼Ög4Ñ÷m…u¹±Øjl8Ó)ü¼J“ô2æç¯~ì£ÿªûÆd´Á‘\ml›şÈ@føöŒ`ĞöƒÌL¤.ÀŠò»j˜”R¿Õ@]R?yºQß©EuÜ)½Ğ;fléP[E'~$Ø§-òÃÁ+> ¾³nƒ÷ÀãÂÄÜÄ¨»²AÍ7c5?oƒPáéó¯ëºÃ¼‚sìí÷qÜjèg³¤‚xOh—‚ßÂS©à~¼»›õEH2 —¦ßÄ4j~L¹8Ššğ'PèµÔˆ*÷ŞRèU»ú]ÈN‚uÁ‡mH«£ÍmR©¦Æ\ë©¿/ˆ»ÒŞRFËcÅÒs/úÚW8–nQjS§ÜƒË
ã”zÉVÇ@’¯v$Û§fÅ¦ŠÔ¯½Çs§øü?RŞš!‘’Q¯¯¤ìÀ÷.æóGJ8@¶$>¬l=¨£*íˆÈ™€@»V{÷ğkn ’”Aü4‚Š}L‡´œ—•0ÃZÃvŸsTs{ Õbéešs¬Ã0~¥¡G5‰	Ø9Æ¥Zyğæƒ|AˆD3üÁ-x¬t×Ì.Ñk ¹ñí¹.d—u°ø£H,S/¦Y¦Ésr ı‘°tÜ^NxL‹]°k<èÊEÙI”—eÒ©ğòËèö£øX+}âêwüF9œ§v5ŞxÚİd—V”™ŞÕ{ÜÃù·VÙ¹‚{Ó9ö¬{uuö³6hxÌ5?½xµ.å÷.@º‚ƒş-²Cb±D^ ·X7àcîçšå¢À[®…6{r:xmñ=RÂ›^®ìPEnY€QRm®şšBoQMR®‚Í¨I~ıp4VğRåşœ'T37´ ß`]"B^¤èÌ>(r¹‘$>n_D>6£İR®–¬¨Ññj›.Î ;ã»¥A4N<ìèÏL…¯Ô’t'>•‘4Ûh?ìÑœŠÖ†»ÜÕeŸ¿Ç<çOŒKûqÈg†B­uôY=ôK@İÿy\«¹\‡b?í>jc¿WÄğ†]HœóÍ‡ÅÅC~%¨ÀnÔı—ÖÔ4bˆ22	é¨ÇAù«y3–h“ÄK´SA&·3ÕÂš&«ü?jƒc!ŞÉNTiO¢üD	à¤ÆÉMÃ ó³µ-ioæìÖ1'éTQ¤zUñH ÉûĞ¢øĞ(5ßx¿L›6ˆì2Fè
ùÒañ_nÆ°š¾¶Ş„ß,ÕLm¾À¬a±‚P‰¡Kƒ£—I0í¤ÑgĞì®=ßáFVnÂ1¢·ó:@Îl3G¬¯ÿ}ÄÚå9@ûÀs2Ÿ¿š<ñpº/¢qCË…pîU+xŞÍ~²Û=}½ö$‚=qÁRl3¾êºR,á@¹I?ùT~N’-v^±ÈQáÕ(}¶Y·½(òsÈ¥ÀÂØTº3R9ì´4(Yo¾–‚ ÌÓ­š‰÷¦îóÂ‰´ÌËÌ'>÷ë;‚º*÷¨Q+ =Aümºmâ¡8°Üç÷‹ß7§ØUùu¬S·AWgmSCI¬/Vr~ÈPû-Ü™Ñi9Gö¸ÿ÷sşDéjhñ°.Ë&¬w‰©ëc§¶h‚“.›CÕšé16}„ãXÕ®^-M[ªª•ãä vÛ2ùöiW˜dhZë<ñÒ>"ÖO<uyGY·0”26õ„– Ş¥·Š‘M1„¾åŒ”|7ş¸,Öjo¼ñŸ‡¹&ÄŒÌ®eÓpŸ_1È÷¬Mv\QzZ{¿œ[®t¯–ˆb*;\V ‘ÒLØˆºeûX¤ç5™›cvlS[F¬ï[æ…×L-]4e‡[«‰ÄÓv}}¬–t>’¥&\Î ¹‡B˜’÷†G°Ş-‘ÌÚû;®¾ûxãªçQQ¾°ètì`‹¥òjéWâØäğ¹K‹ÂÏÚÇb£tÒ5©àIÓRuvøÆÍÚ>IÙ‘ˆ?¾RÚ<ÇuÕ>Ô óS&7/èÅŠb¹+~D- Ğz×ÃİÜÎµƒLò$†ezZEëÊ‘pr ®`Ë¬tbsR4/6ú®8f§vZ¶ãËËçùé²²ß¸ø¬3H\_S%p'ï\Ém1Ei$¸ñc-ØK¹Ø]µ×%óÆÔğGDR³`üš8`³˜2'ìS5¢oË§ã¶vÁÅÜ6‹İgëÈ‰æm×B¡gzÏGX€h}@“ğs8µDÅ³¬UÖg-B…<åX°‡7B>|ğ×VÇ¼rÈo~¿YöC%|ê§Å°^	«ÓWùeªÜ‘îVN ÆoÃêÛšryÕc¯@Ï»ëæ×l¹}V eAÏzc­õm]÷ãøUn.Øø\ëxÿªrJr5İ¶|ZF;Ä”ÿ7û<Ä<t¼ßèø.9jÜBy 2zgƒˆ2¾vÆBş—¡Üg|èa ]$,X°ÅÖr;†  é…Ô¼^aŒi{¥G®É’‹Î`a×.ÙÈÓ'êLıÉY,Ña\¼H‹é}5Ş4Q5…€úÇåclZ¹¥ò1N§¬ºÑßúöÆ{åÌÊ›@Ğ«z7I:ÚQPƒçğ×Ç¾ xa?³¯÷zyØ‡6~„9+‰á]6%ÍÌŞSŞŞp•ÌÉEyUÙápD8oÀÃ‘2ªWÓP ÜB‘†"]G…ûe"Ÿíélğ¯ãì:×ÄÉÈpV&ôÍt2”Ác;êk±«“¼ù×éÊY|s:>Âd¼Ù‘Üy2¦cEòCÕLİ$_}6‹¼À7$Ÿ‚‡ z¡GåÔıòY›ü.ÊòùÅ(ä‹Ã›Âş@ÉÃ>ğ±†E¨ú#,Á"ÆœŒA½ƒA	÷£Éã^İ—ùG½c“ôlìãŒ,ÉWc%ŸqX‘;+_|´m°‹ÁKìJf`¾®‰£ºo“+~õ/HÑyt}œÑbÁ<xÁ]ğå²ÉŠlº¯é’•|X÷† ¬Ë'¦ó¤[Ó£M|ÏÊ\_¯²]¾K–Ì›Ä±áÆå+±¤‘öã³~–B•öQYlõ°×–6‚Ì’0yÔ?6ü@Ñ‹–Ù-“GF^J¾˜åûœèÍ€ ©ûÁ5ó\5¶hc¹Ôc-zåÏ$”…qyåì>‚iXi»Ù`“³m¾/h:¯5d­¯Çq"Ç$ónDØ=§å?Zqc¢jâ]ñ+ı|âÿ,ğ™¹.k§ öv	ƒzµ;¹8øÜ4Ş¨˜ÊªzmªÚ¬?ÓğôÕÇ”iÓXíŞ£ù 0G×İYeƒğF°ÛÚàÚ÷â‡VàĞwÚVñ¨' ØºM¤~só÷‚Qß%ù=X*~=NĞòñÃª¾ïßwråk5jQî¡[#è½iÅl+CP¶öşúá¬ã®Ïwe	*p`âıY!©Ë>|™şwhQêÿ´ñš“#:GËÉ0*eT²J”–­F±WiÅ]¨ŸÊ˜ÑÈ¥Ù¼ÅtSæ5yG”ßİ*nVLkÓ‡›xg5›q=Å<ÉQ_pê¥"Ş‘#¢•±"]Ze˜†¥”Klw­n3óW=ÚÌÍ)n/–êÅ)4Æ¯tw|M´ÿÚ•Všl¥¿ÂğU:MA¤SÔ,ØªÚå›ã/¦Â¢MÙ‡ƒ‘VŸÛ =~Óê@Ø|„)ìz'ÄÓ¥6Â¶Íÿx”.uyJ–Nr®¢M(Ò=vñÀk¼„b;é(•£¸kß}=úøãº›[ˆØC"j¹zæ¡	¿¯Â±”å^J(ªV­ÙòkŠ&\>^9ÈÅ™Åù™ÊÄ’µ¦
SŒ/üéõº.±	­%N)œƒ|àeQ¹u˜Á†×°W¯àÍÚÄĞÓ‘¦c?û†½å/eæŸÓ¿Æ1ø«0áäI›²á§¥¿„Í4¬¿ìõˆá~™Òxå²Lê‰Ö8ûuÛÏC“¸úœ„Ï/Ö&•­˜KW•tÍàC„‡u(x—“ú¸$kÔú€ñ‹¦Ëh.6­ıŠ¾éûÇaQ~äØşâ’µùªô$¢d›C¤Œç'xÍ£C!÷+'D)éå“şÇ'¬%f2[NÎdr*ı˜HIÃvLÇ–ïâó€“WÌcÕd}<›$ßÊš‘ÖÑ'ä‰yÆIŸz¥ğR¹Oºé¸ä~ÕÑõ^ñLè;tCá>—‘¼¸ÿ0İIÉ[×Ùæ¤Èñí~,>Sªè	iüü£U’sˆ¼ô.ç*kÇW÷"©OÖaşŞÁ-?h*%ˆû£Pı?:¥ú™R­†Ú³Ùï‚Ñ&ã~ÿô*M´[•£ËŠõ¶`QK
që!äc¿—Ù9ßÈÏ«ˆç$0¹F;ºïî¿oËJ!ó7zs‘jJìÌÉ6d3u»¦E£©é¯û\,—*O0eıLğb?÷y.IŞh»ğ"U‚3.jLw×ÃöE•Ş6XHÈ³æYk™JòıµéKc¢eìÛN¹â,J¹¨ˆGòáú‚ıN5­;ûÜW6}ÕhòáĞô£zhÙ;Í0dx§g‡r¼BbA‰*èS¨'qÒ²9ã2½ˆéı©`±Êt®iæù	·@ğåG9š¡;ŸMŸÜ¦,¹øÙ†|@|ÃüÊœèò©Ô‘õk _‹X
@ü—kªÕ!´¥æ‡pm$_X»Ñ’16_Û]¹ Rı|CîÔñ>¦U«Æ±ªGÜşpğWPâv›†,jÛÃé!_û[É 3ŠBÎ_ıõ86%˜vnÕCÑÖ¬Õu2Ÿ$ú>ì)¤ó;£¥¹ 
+Æ‚$ò_kX)ZGÉ6ĞüÑaDôİK:¹¥e†äXm0H†Aà#ÁU¾­kJ€&›FÆ/ 5h—Ù-ÃP7ºä£³Ør
è±À!,qwg‡»[àë'=ë“ÓEÉ½iRO$:–ÍØ‘f2_Gì÷q}âZ0¾öVLbP×XÁÃ½-è‘úZÄ·³³Àwè•;|ÔíÚ_MTìÊáş:ÛÁRÕ« .¯°¯GI©VyÌÜ¸aì®=áÉ«ıÍ ¿ıÊ9›A¯)õäƒ‡T¬Ó˜"C»RÕ4teh}®
TÓÂ‘Ûl¶i*Ñ1ıs~Y¨S´l½!·c¨Õ üÔoågÉó™Ò 6zïM?ïvd>áäÔ½nµl÷ù(ı÷:œ»Ñ>Lä¿•}Ù70ÿ>çN·%
Šà8‡g’£\‡I‡ºè¹Ìf’±P—>Z~;ã¸–Uø-ŸÙ’üfú¯NÕ¹¿İŞ'z4mÉT-±gíR ÏQZÂã`Äj¥UİHJ%³ªŒ°TSÇRÎSvn¹Buã×*$Fß­ı¢?°
*jµ€°—½ÁTªB‹‚Ä×RË9_Ó…Ô¡ŒÚzEsèGã»OŒ2CJ€ ò™eÅ÷xç¢'¼]ôç³%I>x«w2F{/Ddù¹€ˆáÆ !m©¹à§•£õ—K‡ä+fKèœ	Aq]#oÙ©šñ·Ìau‘ûôüÒ¥1GHW®…`°I`b¯D$t‘ãj„Éî@€†v$:;
Ÿ} Ã1²âåøEÆ†¹±ëá‘Òş¯Ì)fI.âÙKÀş~s%1Ò>Æ ÕM
 í$vá8`Ò–àÂÕL­à;b?Ğ3'<”„qZ½õHIZó

YH~ VRšM˜æ”„ñOsx`ÄğDÍ¨Â©÷Ê‡“KêDi˜YÊS>«õîåG'b*fÛdî¶¯íWÈœ‰®qÓvæ¼_i/4î§«itµ	I18ÂÊÙôËŒ—úØ¾î·Œ¶N¦“úLÂY-º ;®-ßÂ(şUºİğTºšß{”äsó¦;¤èRƒ¿è+LVíJ1d€çĞ|h´¼‚6Öñw0“Z­Òçf–™€]®8zEˆ¥V"bÃ;ÂïW¥?±Òßö÷éâJ˜CX¿ÁFôG5Êİe—òâ0#Ÿ
4uV‡_[*w–­kIóSö‘Årå‘íÚºó«!ÏÕ¼$äRc®2Toßs×º—ûq?ËÀ#0ÍuMñ	'ÃøˆíñiQÓ>u7{näÅ”wåo j?¬ˆÓMÊ0/ÿPËh|ÚT.e_ıÖ£?îl#w.ÃL°kƒbÑW×ªókÅ%;Ösé	ºi ñ™1¿ÏN?^ e±ÿˆˆ»¦«[œió-u¸DË¡s\üœ
`A0 \	#Eæå*‹AQp–¶úº²ò$$Ï×ŒºAL25k™\Yúmóv»¹ñZ7H?~ü›9ò:êzÀëK5pÁõúMl±îÛÇ_™—1’áÈ ö{Ü¯Ï‘¹®Wz¤s§{ªŞTš<ÚT€BÚuÌŞšı\?ÖäÔêjl?|HK_ÿÎÇÁ©òmUÌ|õ¤ßÄxe¾¼7ÜØ–d>ù§´Šê5ê;24½ó2;~ç†‹aPµvœ[¥1‚uÌíYÃ–dËQEé}ÆøæL\™—Ï}`½}}!ü™Xa'™©-¹l¡|Ç[*ë6‡ºZéÈåºx;ŒôqùLÇ²– Í×y,CïY[ş$è¨5ë÷Ö¨/evGûú	séwQİåwÂı›8˜üü b‹¯ÏÇŒ~=DgpHV+TÇ7N¤%;Ş¬h 'q©´+`J|ªÑŞÎÁ7„ëdEi½U¥Ø¯,‚ÑøNİ¯¡ÂÀº‡j|ºS s¿1î;ŸŒŸiC)b)@MB|­£:Ï„22·÷_;êm‹‰>`(3Ê‰Ã”î\âsÀ°©ª÷#ÁˆŠ/!dAMß§¾
\qÑÍrø ˜FßÚ—\. q”ãA.‡ËŸhAÈ
‡ıM[Å|°X0L©ÒÌçÇüĞjáy€ı®$âœeâ[0·¨Ğæ›fï_Òêæ[å¥YEÑü™Õgg²‰)lÌ–@ıuóÂ¶©‡‚õŞg&&şq9'T÷óõxwû•m¤TÅB3É+íÃÈØÌ[RlNÀVõ›—c`’İê@-ä’i†ª] †_ˆÒ'Àçë’|ÿ,„Ei¦ñgÛú¬Û¦AD€\’7¦—à×²üoçÙ+_Ùô­2´<æÃjcÃÚ† ,øõyİ¾Õt^Î"¿†TUı•&û•,°{_p¥î0?œ…Şçg ¼LQ®ÿÊFµ)®ßK¯‡H4A_¿r±úÛoşòB,d€„æ‹·mì©x¢Yªô»ÎÖP\­|Œô^p°âı.—x<İà!Ñì¥ Õ‚^ezæÅ#ëÍÜF
€)Dšë—P½ü›Š2¶bù|ACÈjcE)iË÷œüù³GÏMu	QFŸüz¶Ä&É‹‡¼×Tòe¢‘¡‡np%”\Bİ¾µ1åù5Çk±Á$¹5©X¾(Ú˜|6c€´
Nâäü¦š'™Gäz\Ã¸áÇä‰|š°Ká0Áğ_€i.Øz‹Ròñ&äLò€Ät=8‰Ã†IZtA†´úR×9õ!F©ÜMoÅCêQh£	Ài0ƒr†ué“¶ºï şºòJ.0š?*ô”éA‡1¸$æ§·ıu.Ÿ=ÚÃQ0¬âU?Ü”Ô$ljíV‘ÙF"o?”jGÎ9yÍ»Ü±n£ oß7ÉãêS`§ÎoAV_º¿Z´Îîu<×µ,i4\.ÖŒÑé1Şõ³€ù9ÔŠ!iü=šÔ
MØ¶Ë]=Û`ßØÅş8Å—Rä °*‚]õİÆfsX¸,¤5f*5ÖÂ2hçÆ5Iù¾ î*ºvÆˆ4nÜ£¡ K²@¶la*??ÿ<İ¬»µ«jjg}±ÀİÖ­j²7S~ŸQ¼t·é§Sqº¢y¦ÏF¯À…-~ÒÅÜÉÙè^æJCFi˜¡’ØwğËfäîé"ÄÌ%à1ÄZºÀt¤ÊO€õ;d\©a;^ÀZäğŸ<î—ÙÂh¼-šÁ•_%{Ş¡-‡MúQşµÂ!S
Øä6yÍBZÎlBÒ$Æjù}Š\Z´Ÿâ4ßR´Ué-ñZYbé''öã(VWÜâ¸öğQjB‚¦E)|ò¹8:68äOCŞéùëB™#bÇ§ïqÅí…uIĞ_•hxŸĞ·•GV•½q“ÚƒæÒ ²í‰ái¡Ï¤k‡"øùÎ‘Pp%İÅ6ÛÕ=’}a8[7}Æ=‰9b éBîi²½#ªràIïşıˆ!­^jÏ? wsÂ¡${OS\¨ušZ1øEY+#H>K¶´m¨?ÅİY~8®İyIÓM9qèæ¶§fíR÷Ï’ŸØCArĞÃgá>h’Ø0nhyÀÓ3Ù©™’^Ş]àÜ=ki>ĞÌÚGe`fbC„ÛZÄ šû¯ic~”X Ï°ôæ`†4¢ıÏ9üDÀhh…’5:­‰ É	a¹œ›Õ¶l»G÷™ƒ±§…;jAĞúÖR`ÈáL¾ Y¥f_ş+ÍG›ğ=¬ã“•SßApBµmÍ31àåµ'•3êù<ı”Ÿ[¥ŸÜ±hµ`kB2qÅ
,^–©lfşL#ò…¢®6’4•›C§°?o‚ uÕ3­YqâPlÙ1ï,¯éæŠÿPöò”¨ºN%³-©ÃóãŸÓ:ô…RuÎi_ê„~tâŠĞÿuv´øOÜLÅ&Œ-±_¿¶lPØœ+LÁ%?cóšRNAsĞv¹Òa¦ä•Ä,È„bD Ã,‹×U8…’Äö4ïãÜƒZ"çM˜Á;gÑ@ÓŠ9ÀÊšˆ,¼WNiêÙ¡´›»İ·mmÊù¥1Ãh_C*jÙ­ÖkSÙB€ëòYâÇÌ.¨s~U”?a±®mª“ázĞºW~Íïªp•…¶t<Ø«}öàƒ“D7üÈ®'!ùö‹ƒşMl’am‰ëF¢„áë¹‡‹40å!û )BÏj¼™LiËáôçÁví·8@H€ÅÇø¼[È+ÁÉ0M7'UÓüd+ù8—¸Ágª/Døáç[»¿.®nnË0dêÂºÍ$˜ÑşrŞÌCÑ~:†¨–)BıMŠJ‹ÙİDİÏ­	Ê·2Â_CıÕ…
d?ô«xÕî–Ö	ã,	£Ò—bàª^Ó6d4Ğc
Í°u
ŠÍ…iƒ’^¥Liù æáËL¶Ö’‰Ôcï˜y°m,”Ô$ü
pSfs,£5ô$>ø>‘ÛgBğû%±ïPB‡)kNæk½­ëŠÏŒİ‚áí•ñâå¯`¨¨È;$úâÌÏ¹õÒHBØ&Ä`ˆÂŠ×¦xGÿº&Åùš¿ìÀÏ^’Õ, 4D%Úüúò¥'‹†¯¸Â™*I-Ÿn¡¿J¡Ê7äı=½2F<aš¼áßDÂ!Á:	ª3Š6…oŠ0VÎ@`e«§Ç¬{ès´S µò™„CŒFÁğ­™lJ¹’ PwI/Ê2|…ó
›&œMOg™ÜíĞ¹š¼RŞ.º«Æ2ú±ß‚—¥‹"}—5>ú)&=rªÒÍÛÌ;zé‘¼°<Nñ`±Ü3,£·A³\K+¨°Y•©İ¾p)o–ÓÄbóâº•o`u	H©0¹ÜMÿE
l¢n¯lB&üïB;&ÂÂæ¤JÅPN ¹pj¼i6S4R>@¯£[¤²aEUÆÇ˜>yNdlú„”Ç·y1ËŞPÉ¶è–òC5ŞîI˜k¹÷¥¢¢yÒ¿fV˜jqí†4ş§…©½Wğ.îz!]‘ß%^Òİ¨‘‡…±c{®MJ§ NZ­‡DK|lúƒ–d-åŒ­,çúÉôéñæ/ï*DÅ}e‘Kı‚:2YÚ€oÇ™áV;Aœ‹y
«Asz‚oö- |êÀw©y®º®X“XÑ@<;±Kh,%½¼øÀÉòŒ…`©tµAn 6,vİ¥@¸ÁÓßá#³şÔ‘÷ìİmL}iN†J=˜¥1İ:ùá˜¡!–héˆÙ<
Iëpç³Ñ"Øİ¾6÷ø#)
úJT+4Ä4í8p´nÚL&—_?<Ã¥Ï¦$ì”:yUÇŸÛ„âìáÇc®ÇÜw×½IÒaÛD¿±M\6¨+Ÿ³t)H"Vv˜IÇ¶$9˜42â¿‰\KÛ>]ÍCä´À=ŸwîÿTİıZÒßï,(kt
otX]ÜÈj*à]¾ËÜ™½xşı
à¹R!œ*-X
¡;?ÀÚ4J¡é­0°y“¡rˆO­ë±—Ã•L»œ+/j{µåãŠ»ï®áÇXØ?ÉÆÆÃÜ Ÿ“Ä˜/Ô,ºfêİ…ö«Ãì•
3GóvÊ¦ƒúãæ ,%p’¥/“Ådî›oo/à——cë©¨3KúóĞÌrô·–üİ6‡Ãş0ìs3’[G¶|ë°$qejºZç§ ‹®ıÀùîº';xO[½FÆĞ7V&>¿£’ `Ñ£po9ª“¸í·»'İe‘¸K¾x4Ü¯ëyBV‹İô2<UœÉÛ°Ãİ8é~_°V´„bşü |Øàséì
`tê+âïÓ—=ø‘MÖë³ZÂgÍ|¹j(¨iôÕº‹JcÈ¥I«dYâíl§¡k&«16Õ	ès>È¯ó_T^yrY§Ê‘ÁÅTÊ5›ÜÌQ›9ß
R/p¬[qÜ_VßnWöLÛŒ#<€‚-ÙQKÉ7´q33ÂhN‘Jt®¥äÈ§GËjKº>>ìNû…¸êÓåª—?ß;½¹CI½‰TÊäkû"
uÙİÄÿÒñ2wÍ
>ĞÇ;§¥®i	'û²{ª³|.i; #|,ß)´`4®ã˜~°>ë©ÖÃvJU£¤·Ÿ¯e¤À¶ú7gJf€i×rü @ÇBè²§¨úÀİ­–0m{ğãXÆ¦ô‰Pdú/TX¢hVxR`_J¡é³[ÿÕğYrÂkE½d+§²È*™¨0­Íâö–|Şk7—]ÜWUÈ)ğ'CT¬•0q7dk®Ê'+[mÚ½Z(‘UF¹/è9ufà#ıâ!ıÖ=™›ãPÏ˜`{ºä¹¬Îg¬S™Åwİ3–<ôÇu§Ñ h…æÍ­ôW«©iF .¯Â‰NHa-DïÀ¢…0µ:ØJƒš<ïFe‘ÃsµAÄãË'İì»…ÁÜÎ	o3&í4 gA`R>-nî¡Æ÷7'?±ö=‡aWÜ,x
-çw(yğ¼QQ.ÂMÔ×øìßc> ¢¯+º±eÌÅx)Z«ÉEà†¨‡â¢y¡¥*÷#ZÜÉUëGA¼Ôsúã õÔ^ûE÷Ãô‰>B‘÷³ÌC“á$Ï,A¢”PôüEƒÂépHÏ’>¸5ºu¤Ñ#uKĞÃö‡KşÉš¶,PÈP¥^ğ@µJù=e_‚r‘'·ÒÂGNù“àzßŞÖ×Ï–¦OĞ‘àî06¥ÌwAåìŒùç ßäF´©©
x9ƒ´ÃÛÍîTêç}Ú(M°œ•JßÎİfW?ä5æÍÚtŞbí4ËğU‰D%i>Q?3?’[{ü©ôŒJËb	YSÿ ªiŞ<gŠv|ìhÃ!®WØàñğï	éuEµˆ&R&à$iÓï³cÚè¹ã¿¦3¾‘ª_@ÄÎpîD°SâÄÏıì .
ógÂ×ô›ÊZÚŸş ¶%'qW÷Q:ù{9çô{Ó­e^æfšò‰AS^Š,·d—cÌ•n†|S;—·ÃÑ(µ“EÌVšŸê[Kü–¶lTèíj$mñZlF-k9Äï ™éö	EK!J¹ê&ø¬r]˜NX?Y°ü€íM%¼ÉÊ¤µ‡Vt§ñØº¡ò~0Í‚ğ~|©óğ)	’>s‘r”P‡“Ó R/„†RRç, Óòüİ²O'µLµY>ŠyY8³ZüÀ4÷ã3Ss†¹š¡¡DW!ØÉû¡ä6_õ ë@¤K”—omFFLüQ¯•Ê7ùÉZ¢BÇƒB‹èíGhA'ùN¬bv«¡}ûc§æ;ZÎõI0¾r¯«QkŸÕñbMé/k‡HwÏ?>¿upî å1îePxwÙ" èı±[‰“›GdÉcä*]ÎƒÅa³‰ Á»7û€Õ>ì?ÿ¬»û&^†téÖ1–BAÉr†Ğºj„œzZ!«<D;\Ñà½®0BÈÍI
 ÜàñÉôo
µ½ü5.®|eq¿X•xPZlL:Ş¯¯Í¯Ë
²*}‹˜GëŸo˜ª‰[‚Äwm@Á´£èÇ_§º$¼‹aUjú†D¶f}ã‡"XòHÕæQ2ÅŠiR«?ñÓõÊ5 ª»°Æ V±}Uå¸Ñm.îÙ×ÜuYfk¿ßû„“0Ã–Aœ8¥„-,iË‰çş’5kÙˆÎ .IÎ–B?guı’™wojœÆa>şÁa°._‘Xµ·äÓğw?ÅšOÄî²ßæÑ«‚x©ã/êQ¿+n¤©lÛ¨¬ç³Œ8ƒS†¬ê8 <êÀu×÷7Öº»¡éƒÇû99~’‹äC­û¦ó06ñà*–±‰œgÅQÒ‘Ã/cìÕõ’@¡i	½ä¡n9iGˆÆÀ­©õè¯y}¸
'Eğ…ù³ô»^ÿ3§ê	¦¢*n7¤wæ÷âí¯¹ÇŞB;'—ú§!''«{$—è“Sš!ÔŠ°DUæ×6˜Ó­¾^PH{u+ tó$Dİƒn ©´{`CdÎÖÏ-xû&U1'îîb>JøèäY½×õë‡İisõ\ò¶ÏÊêeüã²,-^`i<Û{ÃÏ-FÊeµvU/N
-Ms“ÔÔïöøTúñ¯dGé,©Á–_XÏµô	ñÂ«µi1¤öòğ>7ˆôS¸@È~ ¼íÌ3Ä¨ÁöD§™(Éöy*.ç
La´Øô›+|~oA4‹=…l[Y¨gÂB8æİø0HCuñ5N:õğ2-S%ÒºMöÚË¬›øpÅ¬+«*ÏôØ€ªÜ¬¨óÓZ‰í¨S¿ŞdêÙ¸	!üA;ÏÆ4=.’w_ÜtUĞ^OÅ+ÎÏ†%ª[Ô;Ûtå~ö”s@ü%–HÁÁşwsiùÉmªLbFö*Ô/2D¾ígûäbKi(B%Åçé
²ÚT[Ùàœß€Ğ”:æÓW¬~„ÔÏd÷Q ³<NHëRa¡˜†bƒ¸@H‰ l}—°øh[V(€¡ïÃ¸¥(õ¨™dú–ú'É/Y°ÇD=êÀ}‘O¥ÜHæ«™­ñÒOd·s_EYÿ³ugåjŞWİG’D8õ¨@!˜!Kü§‚-Ÿ~è[p€”Ò7?_¤Èt:±ôÚ^HŸ«¿ºC”aéØ™@aÿ‰iÀ`ëÙ£LTí«c§?BØŞEm>‹-î  ¨$õv–Îx	íæóßsÜwÛ*“|ØÒ3	·ş®›å^4as«¬mÎµ´Hƒd†½õ°6ğ^Ó7“!¼SÙDĞTrü›évî®ŒôF{Qz´A¥¤bçA†P×g0ø&ç‰&x;	´o9M7»òZ¦ôX6RÏ—ÿ‰5²WÃ§P6¹ÔÂúRV›Ifâ1‰’*]wè<#äshœ¦»ãY.£›ƒÏí‘Gh¨ªw×¾ÒEÛ"<¡*…(ñ«ÿÎ£m8óyt?f©á„,úõ@]S¢Ã^ô«]¹ñl–ÕÃø5R-àëc¦!qc,ï§Röf6	›,Ù“f1{\õ$°½9Í{æÚÀwµäyÈCcyWIQX	Ã |Çº³»wD&Y¹E1}u½8|)}Ã+=õ&…/bÌuœûaÎ]ÍºHÿwÎ}Oh?YWˆ¶6á"0*mù!ÙõDÃ¬l˜£~­ú˜õHF9®·ô<rÏSûÈÀñ¼y~Lı³h°>Ôñ°ª•¹¨í@:”3Fğ+ª£ÿyÅçç@Çá¤áÉ#ß[VÂÍ\åÍæAyÑÔÂZEdê):=1f-nÓ[ùQí\ÑÍ_¹§ËÆÙƒ% Ël
´Q©¦”“$¡Bf#ß¤.¯Ò!‡ÛÀ€Î/[A$Øê3Ø»™‘löIYÛƒÿ©ı6ÍvßãëØ'6 `ÅÌqL¸–Óæ~Ü,§†ŒÊ²9›HŞvùIJ•ÛhÇEE%UIõ±#Kåñş“Ò´Å…YÍµ{éS=ïV?HÚGC
UÜ²¥GÙ-ÏI¯¼éwÛ?ã^°æôKXø¹{{:~ìàFboÈ|¸‹ùq¯·İÉóÛù²Î0Œö¯ÓÚß¤Õ³ë“·¨¨5tŒÑ-<9r€9<Òî¹İ‡ÂîÉRV–f$ü[Â10¾“ÇC&Òíë#»gŒò¾×S˜ÁU]úpB¥ŞI '—ûNîÑÙê:"@îM¡sä|a¿‚EÅ¦ÅRG!¯À	@óŒga0µMf¡Ó‹Âôvl…ïµëO?Š1;.ÇÌvƒšhí=|j„y,œØéó
À$Ú7a	À•¬ıéûSÎ‘‚İÓapìY‹õy›[ :¤QA£Õ$Å„œ<‘ôL%Bİ&Éş¢J]P"B²9îŸ—Í.‹	R¶@¶¦˜ÕXŞŠ¹"7]
[Å¹=ù»3ÏÉ!YÿyNÕ"mïäöœ‹Í
ä0•¶QbsR3µWÑê‡w5U¼ĞË¸§ÓîH“ÏM9õÏPd´gÕE¯¢¦Š-Í¡5¦ìÚ­¼´lÿ<z>'EŠ«P2/© ¦.#ôè­
oåı±1%¤Q²| U¿Tü"`´Â÷~W>iª§‚§•{à[ExíAÿ®,ã2R;¤Ûå&Yl»pŠ¨ê$×?‹WkVjAÆ´Ë×Sº&ı«w³T'G.Ì'%ş—àùÒ‰îÑáŒª?ŒÇ³E_ ÿQÙãº&m:@‰ÜÚ‡ØZ£ ¢iÀŠàx5RÆ`qù×IĞ‹¯†LˆËftÚö©üzËúò~œW3T*!&Ö0´‹¤Q@>ıÕBùöxGªîÌ	']7ÅYtîşÛ¤fÕ:6Z×!µ‡¹RÑìß¾Ü“™ë çƒ00á®Z·Í*wØ?‹…î˜!âkù…#ÅV#*»ÒÛ@13ø@’ß_à6Ò;Ğ“¬ˆÃ&ˆX^Q•ç.â¯ú_ğ”2øHÊïÒ^š„©Rañsûo—Ì¡ZıŠÓ$!Ó5ïó\–Ùã4cØé¿“:Z	CÙçˆxV­¡ÇÜÏêÃºhæ›Ôgè“=² ê™Õ€Cû%ad”1e‹ÌâñE!¦Ô£Ÿ?¨”¯MŸ¨Éä·ÎÜåj|ğQV½¸z™8Å²¯òĞâ4gÇmÓüi·I[O¸yÑÎ`ºèM83û4‡¼E<#ßq+A‚±ßl83¢ÕgÄ¿c¡ñÉÏ 3~8Çâ­fŠÍ‹\¦N¯#_2Iûe\gRw¾²‡Ï<ØÔu•±ôÃUê9#ÁúyŒˆÃy„]×ÑP †co_‡‡IÂ­şb£ïãg‘¨õ‘uœÁ@B_&û)—>!—¬»&†C¥]Ë/P&>Òóò}oå*êËqÑ©tL~ûikIÃ£Ö—ÅDP­|59rbwg¡qi{=r,^Õ–ÑéÃ‰QÅªEéŠ‰¡#ÍWË?ÉNŸùËÎ©”9üÁ!¾à„—ÀĞ¹Yù‡eßr¾hôƒo2¦Ï3Ê†u¾><‰ÊÄ½r·4dÍÃ!Z¿v§vB^İ) ·xVCW¢Ô*cÔ±DÑNÏu/T0 ÀÅ K‡‚´¶ï€ëF_	KÕU|Z—°ßë†rÇ›q¼q§UàH^h:&6x•å®OL÷¬ÔOD÷¤›1H  -\›Y	˜;Ç¹¨!Nô…e¯…Ö*ãT¸5B}eƒ“¡ë[ëæ›P›ôö“¶‡–3aùk9ÕÒ‘v°VÉµï÷­ÙÜ=.4:É³¬¦ß$Êì¦-X¢/V
Šr"ûôr_ü£¦¯±Ì¾íJÌ³´+OGşİ#ˆsÚj¿D$IEç¬z—ï¦›YŠæ7CC¡zöM[±éºª Œ‡>ÂY;wÂ]«pjüÑ"<[±íFõö¶NÛäy/÷MğËhÇº\cº™3¶ÁĞ~!(øZJÖJ”ÙxG·óL ’S7ÜTaÒßËœR5mÇ5®¼ìu~IÙ¤´“cÎwä9WÖğ°Á)DhişşKÂ<¼„N”/_©|R„Ìºäw³µú‹©?ù æğFBİ^äº¸lDhâ à, rİø„ÿ§™.õåZB_µê¶h³¾@ÓØ2Öd+rÓRŞ,j˜LBeÛÇŠ1{[¡HÏ"-¸ïê§|ŒßùE)"g­µHOINüª“ÁéIÿí/xş!¨Öd<§¤£{Qdè¡%@qágÖï•ó|J@Şü¡aCü"™Û=‡`ŸÅºñÓğKBŒÓ¨¿!DjÅr<Üùra&Úß–ĞGò}ÿ
âz¾‡\RßO&W9tÀ/„Ñ×T¹é²í`#š¢Œ‚É¥ã@r…W6ÿ»q!µï€$\<ê›±-ğB<ä¡ô®Œ|:Ğ
gaá]†„@~Q°2¥V?âî+èãz@R4î#¶Y»¢Ô-}¦ëÂÃoW¯(V&3Ïrn«²¤@éô¾Ï†ËãŸà¦úº–şoİÁo³~¿Zã”íhCâı‹÷„ª‘%@¸5Á£÷J!Ú/ğ ¯BòûàÀPÛàòC%$8‰ÇVšFŞ3‹+àn´5‘MXß^…¯¿Œ©Í™¾ÕÏ­…Hpo]¬ƒX«g1C¬`a2…†ö|µí[!ó‰=ÅÉŸj*Qw)Ç÷.|á û»–T8˜vÛT½õ@àÙÌõ£"üĞÅãÈçÏö~lyÂ1hvM2ÑğcïãÜ-åÌŞ¢¬î>2ğ×PŞá®5¼,ÓŠí$î÷³¢"""wR5\FA‰“ıç=ÛqÄ×S>VñPOZ´] ØSÂ*ûœ)Øç[Z¿Æ—y·Ì·)Ïšm‡mÿ˜¯X:®ígâºÕçû4p½K`•Y Û÷ğ{»¦ŞTö€†ßaå¶{¤%H¾!Õ*Oe®õ{¶Sèˆn?İ ÀµXú¡)˜Hÿ lûéM²O[ EÜÌSßMÁâñğÀ 6D(Œ§½[€W ŒÁÀoW¦zt¬9ÌõâY’|òéÑW–¡k™Ä3Ä/d¦uÇ/9l˜º£@©¿{ß*Òä;RUË7DƒT¤¯íxÃ3LÛ•,6sÜDÜI\E«à|L2D¦-½›Ğør~b‰;Wë¢ÏScöQ7ú4£@%û8Ç`˜$ªg*iNìùÌ2x’ß·nÈ‰O )=˜öüÛõ>wñËš;+&µ›×NŸL| ÷£[îåb•~
±sòL¿}ruÍ/[#áŸˆÁÂ5Â2)ÃÎ¦7Çƒ`}­»lédiG»ïÏÅ4Ä~$úx0}lÉÉØiÂ]q–Y'úÅ‰0ĞÜÄ¶Eß?™•¯…«Ö}Î5ê˜·Ùç—™ˆ›¾˜sÙj"´²œ5=¢?(ÛU‹+¹_Pİ­ËçnÉò2«™lƒ~6Ê÷çñ	áğâŠ:TÏgÂÌ¨jß„X'AëÿO sş;›•İÜ„ wh$ÈÜ`B!eÜñ}àĞ¦-ŠVŸ‘¢óSÍ|+IµVIM}[Š¼9déö§ˆ°µjƒ†ÌÓL”GèÖ*8­—IQVJ„Øğï³¿Á<q¾†à€Õ…O‰„h}îÚXJú~ıGî.Ÿƒ²Ç4‡ûÍº$kÒ\A?­ØŞß·®L”ËU¡qAx`0Dû0ÈØùÂ»âÄ™ş	*a¸gée‹ûß1ë  YÀ€g¶â;0Æ¿®ãeü[)§·|2´%–ı(o¤ûÇĞßbèÅÔ¯*¸´P•p@3:Öø/L]U¥j£âŒªr
ö»	V”PÑ®G1¦É¨ÏíP= b![xXÎFáİ$LÙØ?[øY¯`:™¿Ş¶b¹Â÷:`"œ]XVXàçÒúITJRíıŒ§"W¦fY¸N T‡X¨lU`!ãÜlxjæ×–PQ&‰ö*é²séaCyØª|OÇbÂ@§%'	gÆ0©¾yäD1ïY‚ó€©LìÒÒ¡¨oÊÖñe ÙT‘„ò¢hXgj“pSVá„JcßCóP¥p9*u	¥{Œ÷`ãÖÒù«dŸƒßLÆÈ3]í7›Eıwİ°MeáŒA}W[¢¦–ü`Jwg²Shg?¯>dTĞ$İêB«7¿Íäíé6	Úû@ò}€_JŞ¿ÙÜœø±áı²Ò³Ö[ı"—/{a¥Úz Ğÿn¬.Pl+Ä¯W9 /÷{şËÑ¤õZ 7P…lK›ê´¾ÿ+ŞÔ…¶½ÜÆÀ²'Ò~¿jØ•Î‡Xdˆ¥®ë•+¬vI•áì§’³ï£ía^°T]t^vÍ…ZFúäçd(Æv”înFór­O¼¥Jÿ:’áŞ‹W#5ó•ŞÄ€ gxÏ§jÿâ“HlBQzh(ßä4ú‰í“ã\ë5Î-æ¸¥öYnâÀù!ş±¢,íoOÖ0Ò…4¬Ûõ(¶¸ú3%<ïàÇÂµuÔ ¨!Ó/µSV›2™À'JúÓòt¯ jYøğ^6 Á×—AjrµÂëíwWH™’‰UŸ2U|Ú^wÛ$[˜MğçM`YËÛáôÀaZë–zó	):54CvCiJÛE¢YØÖq^šÎŞ€4Şp)ÿeñ¾á±}%åìç„ĞQ–Ù 7†áÔ‚3çïş’®8ô¥pAÂİ´qèŞÚávsKË¾KêŒÊ•Ç©=€9ZUs¡ÅJ	]õ@hŒF*7ßÁ(ö2s"¬–»JW:4w.\ù:m–ş^â³õĞ³¦ƒûVR¬úZ
\'YäOgÍ¦ t*Š…%Ÿ:>öí6¢ªE/Öé!Ãš,}›«¦ôQ¸©_¯ÔásÔ§‰¯¶%©}¨Ì!
„~¬Éãz7äiTÚÂ}UÛ{¡JAƒl Yl<OÈº+/üŠ«•NF„“BkòÎ4ÔW×™L5¨Çuˆ?t%¤Ï©Näãwü>Ÿ†ˆ´»F²æ+Ry¢çE‚£2ßú³BÏGœH¤ZòocaØ=Ãæ±‘'›+-1Ë)æ²'ï°ªùW‰E×V X†2*$½\…æ$f¸õÈñ€'ãı‹k¿’JÑ»u`Œ¤³ßá;9şVÂ‚xŞÕ9II¡xò,eŸ‹kjûïgXªfıéù•Ié‚Gc“WìWß©7õÉ´iâƒ¸=
‚{x?[N»¿²l¦8¸á“hU'Ìæ·">q?ƒ: Hv6Öø!-Şn½İ´á„JĞs§®ÇŒ¨I-³8™ IÀJ ÔéÆ=ŒluˆK¸ŸõÕ«FÙšBå>×š‘Â(p90±’»)m}»È²[İ9úôsuÔÂÇè˜öì¨ß¸‘\I‰E§xĞà)j8¼Glmfrk‹å!ß•sø€…[íàåç‘­-w´âK|wlñH/Ç\ùñ`¿ÈÂl›„‹‘·B&©j·ómìKC=»pµ$øØ™U¸©MQY`GÚ«IÌX¯¼;ª
÷ŸÌi¬Úräı«ÄY[
p—iá{Úß1ªğ‰ım Ãú;FÃæHji
zÊ‘S^Dfü0ıÁä)wË0Êù*ÄAAz.„?¶YoIKëû¸ø~©@–ÈZA£Q ²–ğş:8?¯×…ß±İ$ë5Š:5ÎTú`˜ÄÿÆÙ…5põÜ²dâø­ÜÆàÈRm[Fw)%ob˜ªnE{ÎBö°ÜöÑÅ§ìÀùÔ‘Ï–ò‘.~L]³ÍèØŸ~³¯_¿…­&øÑÙgUP	³I±ø d5UÌ–€OpäìsÁ­bFÎtaa¤Òpşj’¤ìÊkC=øh8¾-óô5íœ0êÂ´;àÙzı´iìi¸ÔÑƒË“Òq&.¿yÈa:Z¼¥›g§ÓMZÒ­÷{ãÈ‡ä(á.@PÒ‹û‹ÈÇøJ‹KddÄ¡¿ÚïGĞZ
‰_œ¯}Uâø™Œü€ö¡Ø$ÁO¼¯¢7u5‘mVÛŒÉäşìÏÆ)`+ÙÉvã	¦vâ2ô>¾6Qb”D)ïœ«Ì\}>LÔfJÜëo‘
ÍÈãÓÓ–öxÿú´üèœÍV¤ñÌ§!ÕE¼§>FyìıÁ}	àÁ¾–ƒµz’tL—Æ©ohn ()†JËöZhlıô7füã"øänS’…èŞÖÄŸ¯f øi]9îÏÇyˆW91ÛE¤kLVéÄhJ:Ë}­ujZü3œz™÷¡'ƒ‘Yè¼ŒédBKyÔ°ÒèÁ=n¤|÷#Ò¡øŒNM·Zøt¥Ğ·3Ÿn î’êıDN¡°O¯ƒÌwÄø‘øÊyĞüTÈ:e—QëÉªx'Ø‡"­‚j¥s0p—›C‚Ë~˜Y»Ö!øûj5vnÂ·)Ó—É°ÖŠø˜Öõ°2õ.¿²6xi?%éš aéN[™?S/uyjØ953ˆlÌá‚¥ƒ½TéUmû`Õ êJıü{µ7)æN²§{â”\!ŒXOË(ı‚V$·ÁŠE0Êú%u´Y<¶$<µ¸‡bªÔä¾i$¬b›„HNåCû×äK
fO$^Ø6œ¬%mÓën’;’ü	æA©„Â+ÅZ×RiçzÎ‰ZXœß°Ç"<®Ü€Ò& Iæ2ÂâÍNh†—Âbİ—)
ËƒÚ)ùïÚo=!ær1ùf˜ˆˆêÆ6tDŒx1Uğ¦÷r-Xòˆ¾V‹&õ¯¿cóØdıÑ¸Ó	GĞïøÓ»]öµõMtğ·ØkÎÉD+VGµ"D©Ó’û)]„îıˆßXû~(˜¾™‰Ô!/$óSV–MËk4Îı«y±m@©ı>óxês¥FW5lK
İ#ŸÔ°,+oIà…)ªã•Ÿ‡ûo]¢Ú¥®–ü÷ 2Ç¡ºXI¿¬+“çç@îµíùqoÁ'§Û ÀY©¡ªñ†,ÈHÑé¾—P7û«€ÛÂlÔĞÖ¤ÿ¿³—XÍ|ö‘¿UŒ“‡m¦äqÀ°»R;z…³ü‹ÚùğÉõÆí&ƒp³ÖOŞ©ÍNaØ½ŸkIŞñIQ ¹ıÛªõÙœñG‡ŸoAšş§&sKĞ‰9.D«~{¯*¢Ó-}Fô|­"I-ƒá-Ë¹W”g=ÈåLÖÚ½§Á€×¤Ø[âZ'æ0eR¢b×l1cºSÄ~:±¼:P¤TÛøbzË´GÑ™ÇW²(ËËÑ%’jW¥˜_•.IŞ–:—û5~îˆH_S×¾?ÅÀÜ¾âTÌÅS"æÉØÖ2Â'KîX	€³ôs–Œ„%<’æ†NÚ¢ñ…:”eè&šçÍÚ0Zz‘‚î‘!—¬*±°lk{ÿ(:‹í¡(Š~P¸q'¸Íàîğõ¥³®®®4ûÎÙ;!¼Ÿ‚¿ÃÆÆ‘u?«(×¢d`<<Ii„•*µ6‹lÁ}„rbìFFª-ôxij‡¨Ño•ÑMäÛ„røÇ,w¡¯"
ƒÍ>™O9"/çĞâÎû'k™å[Ip[fL{QïõâäSzG¢¿é•[å¶ŒEÂ©áºÿH×tP,S):Ù;5„Äü2}®
6]Oàõª•»ğ¸(’^ZÈ¬ïuÙ•§Vƒ=s­¹à¡·Nº„ƒbg¯õ\e1ºAb²µâŠ7–:i&¶Í		6º%N0 ùÎ˜&–ŞNw×Xç‘=yYàq=¿©e”¥e#§× d_¸åp¢
=VÌ&‘SÓZuY[¹9Ò‡s•‰F_C½è„¾ù@ç& ŠwŒMñ«Í>è@‹3À¬ÓEmzDO8èÜMAı“t³§ÖæşmÉrŸï®°êd{çJ°†ŒØnJˆ¤7ÌŠ"ªğšò:.«SUcıY´WÆÖÇ)†Á1§_UD·‘wQäGàfAıt˜É™yò­¦m$ğ•L'[Óû„Z½ño´€äµnÍR­Zøa€ºW®!¡Â¬#†XÍa!}6”ˆ£¨ë±½„Ÿ½ì¦?ñ d¯ÿ²GÏìº¢¥(É~E!˜¥%>ğ\5š¥•$ßMoçöòë;ºl'KµÏ&H(Ğß3ïYe¸íC ²@ô„¿‰\šÓu”FÉe]d;›¾ş˜ºtºu?ö»[Ï{…¸ÛÕÎ	Ñ:¸è¼ÊÑ>óÜ2ˆ“Pè&Ñ‚á‰M¨'ó·Œ¬Oê7`ÉÁ¨‚Iş6^ÌªîÌñx%‡ÙÌ”YK}	TıåÆk;«99^|³ËÛ›Hüğwq÷í>¬Åë6:±H 8…ë•ÉR®°ÑÈ(Îï×’’5Ÿ`Hñ„IÇ^ĞJNÕSúÈÃv]Ü ò¾¹šE­J|÷ ÑÕÚ‘s ÈT¯Ôzz–(ï¯ŒÙ¶Ëù®À­éÍÿ»sd‰]¾âF;*RĞªndôgª/^õ”Up‡Ûè"î)çÀyƒQ<?ÿjñ[ùëƒS®‚¡a¿ÎÍk+ºĞŸ·ƒâ‚oˆ¥†£p3²Xôh±Z)«DôS”e>Ğ±où"ÀtwˆÄáÌ:‘~g•t¬á˜Û…ÒfLíä—{zªP³t—ªÂ|NvØèñghÔ»‡Ï—-	g¯CÆæ£}=Ùò pâ
`iBºG	‚Ùœœ–x>~­’]º´³† ‚òZİ¾Á¯švx¼é;hê&:ß3q¹R/€Øû·lª&ª9÷eÙ\›6vö?ÖºÔÙªk"„Öx%Ä7øõ’P_|+fÆØ|w¨kïx>¸hÍ ‚#[‘\o âJ_h³c¶µXƒì9Œ !dë¡±pÙr#á¼|S¥Šè¾ÍEùû<À.£²šV÷÷¢ëQN¤>ï jr¡qT#ÑR™r<¾ãT;yÄTàwKW5òã†/Y
,Dµî:;K«Â ”.¸¹)æ+Q+…q_Ü:@û1j‹ÅÔ%e¶"ÒäéËÙlyZ¿/-÷¾ešÓ8ªWCs4Ë¬T¿+$Ü”?‚Á3º*ààìvÎ€!ëj&_lÌ'rXÉœ¢ñô9_
:¤+S]?€hEÕKÇÓÏ_LÊ×¸ÓU>¶ĞÏ¦šÇÕ\A34¢#a¦ª1n5æßHæe3ò1Ñí§PëÈ›©O€‡œßâ4ñıË4³àÇe:™2|¥…QxğÊV¨­#3Fkñ;}CQö÷‡ãpã‰…ízò¬è™¤F„÷$€—õ;8Ñ%«›ó—‡Á¤Sôèƒ¡^õ7¾:mEC|JQ¢.è_¼<'±ßÑ6zZ|úthò+G/ÖÌÚåô£ì›áCî”„Å‘Q@è‹:}cëZÜúsl¯³R¡Šî²MÌó¥õç|F–Àgbe/õ>Om$ş¸-œ¹ş®éÖ—p“1/QRSa¤¨«æÓ	Ñıãô¸0E] ¸…¼]Öİ;m7Ô—¨ŸXQ/»³!¯ÃˆCbª{&g®×>*3œI_ødL&Ùv(°ò™~ëË¾8‡`ö-•şæí¯²-Uº'p
æİÔĞ˜/¤µìÛ­áC€È:¯›İ!~kK¢+F<‡Ë‡T;ÙåÈŞ¶±çzÓÕ¾Ô•7ÅBMÛÛåÁ‡'z4›éª£}q¦y±!HQ.É*á5äWtÉ3ãüè+ÌFé¹ég1„¥^Ô•×BlÃ‚şÂ%p¯‰Á¹ßBñÏ(S@:8ü’Ì*œ¯ùˆš‰`²¥{®Ó¼ÓJWŠ#‡2°Bü´å]=çO
áhj¾š1ƒAW”AâÛk=É£R‹¹~{®+JØ!ÅË¼§sı˜<êMãÁYk‚×|òÂ]3æ!AîxÛiÆ7.>H<u"—ñ¦Qú66Y‚¹oı6„ ÇİMÑ²oÁrV-§é·\µÕ}ŒÏx	-óÃÇI@R€muyà3Âöõ¶&ßõ£öˆ…fLéºeÁ£õÉ$Î%û1	ÎNŒ«òNÖgï—¾	´–u×È"5¡.7Ã´L‹„‘Å@w² 	š\JÄ…­ñ¿8LE_=¾®§ü:\”´ ­²ìaP¹NÎ×ÎšâUàC¥>›\ÄSíË-ÑäÉßp8ƒbä¤½ƒ‘,Å^ú£Ìo‰ğá¹º/Fé:É¿Á]é—6BVĞIg”È…ItšqÃ™~6¾É·äİ„ê‡âd@9Á9e•Eıñ#xÂ°$¹‹¤eªÁŒ/™€ÚN©hÌ¯h#Ÿx®şZåxù™ILŞS<…Z…òÖ£F;œIÒcJ£:é›SÁoİ*1»ìØù2è²±²,%j}´Ç)):òİ_RÁ5ª@n‡F©Gª94ÕëW[äV9`í¡1½Y|ò«(-Ösë‡,O“Àskg÷ãªç¹Q1ÿ<³rÇ{ª”7îŸ£*ÚA¢úúÍÌ´q„ôÌ]‘·/½ƒBTÏöûısÛ)»–ÎI=ÀèÏøŒÖt[`µ´ı±IÔn¦i6¢jIœ–è;a¼?-³9M¿íÓ˜¡Ú‡JÒå±zš¢•÷ÄŒ:°?µ-v›,ù}O‡"mJA€]¨ÿÈË…cA ÕªÌt'*—pVjngwÜÂŞÁˆOÍpü #ÄFg°§
˜V£°fTùÅî$A@ñT—ëÓaEÚOf0³·L”-ßy=…¨fò4
æƒqÊB’¥mŠÔaœÏ¦Ü„vßñ28®	?­M/ëıKPïA<“"l¸éü¸BU’X–gŠ §(™:(9^êZŞŒ9»Fú5¤ŞÁˆ5‘ñª(Jç}üKµ=ı@@„“¨}¸›Uf>æ˜ÂóŒ¦*ië^À«GÿP½ÎÒ¨VAı°ÃÜH¢ÍZƒàzÊŒƒmÚÄ¤˜¢CO®ššqÙcìë
iötÃÙ.ã(¿›QQæà1£óPO‰/Sq¯­ÖŒO<=òuvS)¤¢T~o—İj„›Ò£â,U)jíÖÔÙ`åº>ÓFu3¤Ît¼švRu_óÊ=gİMJœ{*?‡’úG•?º³è„º‰%}’ÙƒuÔaŸ{ÍäĞge{›‚Ÿêç»IMĞ‚z$ÜÄš¿òì$­º‡7/Ó?üx”ßSäÏ°ÃµÊdê+‡Oö‡’şoPFöƒOôğ±KŒäí(’|Û¥Ö$ç¾Aiàº›Ù˜ÊAä'ŞĞáBy,‡®²’‰ñ¨¤wÂ'cUù¹ÓÌ$Šàr_FäZ¡¿ôÏS° ?%àsei»¡0$ªëÛæ²Iã*jO	Òé¯uöéAã£Déº-r¨k+«¨ÓI›ÀWÅ\ë‹ôx_à‡ñzÔĞÑO¶î^¤¹×§  ‘_I;?rˆ¶P¾l7ûùÄz÷cğÚe£†'ªÈNF‘d®Xqâ¬ÖÊ])ÌÕ—6á·áâšì¡G´&a‡K_ÒCéü™½Ëe³JFÂœï—U’ê=uú§}Qf[–Õ¨4¥ºBÖİÚ§"ïN½@ +;4Ëãº{u2w“xWcH,ÕÖªŸ­‘İ7`“N Jm²É±á[å]fÕ/›Ñ;ŒúLœµ¬2nÙÄÕ!Bˆı™éq6òB·Tq~¸û6M8¥Ô#¯ì* À¥2Ûd s»õ<œLO¨y»¹™ÂœyUà”Øğ]Ç/=)/ONı4Yß±U£ùçŠ˜-Üßqƒ{cG HR*}Q;Ê$«’~Ë,§;¨dJ¬>]rç×¥%¿÷çÂ	hKÂ×8&Îµ¦y»Ë—»-uÃ¢‰ßo¸”¸äĞ8T2ßÒÇp:ıZıµçïp' ÁÏhÅ6”’ô$~&Ş;dŠüÎ•?gv`g:ZVÓ¨7ó=ÏgÓª©úEâ÷Å	ÃMÖÏm„~‡ÛÀ˜bwlÀïæo(]‚b’e€s0PÅè±Û÷À²Fº‰v)jæ¸l÷Û1ßñfw_`ˆ‘Ş•¶¥…õ@Ä|16$.,éÕ1ˆétbæÿmµÛuÔ"ªÉ÷¢ş”™%¤Š™)Í7‚R¡$6Eİğ J8Ş[\1Ü”-¶B9C¾Áe°5K½öµè¸7M-–³Z†‘Ğ.d¡¯Ù‚]î]öù†%Ì.á“ö'®•Û}»iÚe_}Û%ş¬Ø0ä¶ï<CÚoÜÀŠz1&íŞW<Ñdw^İüÉsYËù|Ø:çìã©Û`ú»cRp}‰ƒÀíãC5`åÚéÙl›4]4±vóÿ=(úúJ–0µÇî(ÇÏ~B“|­4IF•z7fŸGDk²öı¥ì½5û‰l¹Btåîé¸wö	æX¶1.E_Té©?t„îÈ«ç–û^uÎùÜoY|:áâsöM¬‡’6Â‰Êm69¹c³Üê”Á™€¯ÏdÔšß_Ş¼¶Œg_ò:t<Š¸"Ûhu*â³f~˜)§Ôç÷ IÅÎ	D 7×åûa9€.Mç™àÚ¶­k„Öpu³æˆ]$ï?ÙßD‰è=fÕU#à‰åbVkŞÑ#SZ¬!~ Vë>ıÜ
l~‘ Ï1~oªR6÷!—´Måxgi©&q""¦ëÊ…oI-ş–>4†9b
+Hzìaâ#í“ÿ‘!ö)èG7¯[DÍÊ]ı§%èxğ	­e‡:nfËèm;ôí!gGn/Ãy2û|z‹†0`YK…Ø'ic8÷Ùt@â€K
Kƒ-­ ­‡zR#Ê–¨Åœ#›ø=Uª,Ççdù-®¯^éeÙ"œ_á~íĞSÃ+åÚ\fş
GàøÿvT_´ ˆ‘[a¸ğ7RK‹IÛÏ`õÒ§5”§=¥—wËk©5äéÒÄæû4´Ûì|Q[1CsùjY{6˜lEKÉc·aU$o3f+“7{yÆ*ÂyÍ¸ğ'Ñ‡1L(Í¢Ë)ñÔVaßìUa/9VY)´LDI©[[A
ŠgåIì„iæâm,‹Q­s}şJí§!1b²h©“G¼‡ğ<_Ak"°›,¾;)“¸Æ˜Ò1`NÜÎ1óQ4±ëÌÓQª¼“)Ï(`RPqSÛ…©Ú‡rÈvî­º8o¡}—0}šêğš#¸óHg'·‡|Â´±ZYV
tvÜKÕ[
ãV‘oÍ¢»ãêîq'ø
Õûssé÷¯ƒS6*ºrwá	’®9ë OÂ¥ëë|­½vÚÿX_¸gÜ“L¢—H3R5˜p€¡o8²ª3ÿ,ëô™Pˆñ•-bgr¼äÉÎR³6ÑöºÃs,§€%ó‘©Á¤A€˜´¿FÒÎÙãB{¾MHªùE¢«:+¯…}£&8³D¦ã$Î^1–s®»L€¬ 6®’Š÷ÆC¿úÊáVÙ&¥÷8 1ïh¼årØáDı'‰©ßìÜ¡´9öKo’j‹7êïœ&ÙiA0>u‘Ò
Íƒ ŒËÉ¸Bi/ûòh¢[‡KW&xc¶CGPtí3Üú¶†§9™9”'ÿ^oYƒK§+&C/ÉB.\³l{É?X˜à¶SCÀ2$uÄ€“ë²AŒÙ–qvÁ‡˜ßL–¡.#Ê×‘®öS¶Œ)¯&ÚŒúà¶ÔúID°¨,JjË=¹ßÊc“ûM%_rK5µŞ:+¢|ê…äFÃ3sÅİ;Î>ºè1;:¼kqD¿İ:%ç>lE™›F÷ú°~~P24ÑŞyL‘³¯¨P­ŸÇF"¯H›üâçŸ¶0ô¼Á¹/Í:í_·WW^}	apl£O"öÿæoÊ‹·‡ô¶[·òI(£™ 1ìC.-\ud$,!Í…m‡çÔ/Úó„a8.uÒ"1q«ìtó˜+º+ş‚ºÿ|&fƒ†¡vàÇºåÖâVÔ>6&Úm@#ı`Y,hİc{Ÿ•ˆ«½ş‘¬ˆÓ1>Æ6Y8ÑL€b;#Uñd”ˆ}T˜¥oî_¨á¬¼¡Û¯Ÿówq;¦NÄ•á‘¸O¥¦¶K/©kæì+Cû&ÂêcP›¦Î2=Üûõõ¾È|öW¨!¡wQ”’ığ}QÍã'‚IxØbªftîrÆ[t½kt#óû!©)2
§w>DÇ“ñı~Ç‡ŒMHÄGÊ‘~5©[wAŸF|ƒóş‚'f›ybÈ1"wæ¢ _Üoµ¼ç‰uÃ$ä,>ÍÈqIa´èí~+Ã)ÑŞÓØD$wŸB°©Û&By¨z¡NÑd\çGÉ¹#`…M¡T"yz±=tkªŞî—ôK’lÚ¨[ÛKÑÂ[ñÊt5u ¶µAÌ	Êå~ÌìÕWNŒñBXş…eE,E«Şë…nà8´7¶&ómï·ÌŸ±q‰Ÿ«ãÃU`ßÚ2Ó[3gÌÂ×‡%4'ÖÉD®hP¤Ñ§0¸WŒA¯9j®³ÿò.²¼CšÅ±DTx€YÊOYá%iÂyu_¥R‰U±Äóú>rT›[/¿vıÏÕh¨ˆèNÖèM×—ÇñÊW%b'ÕH%rMÀ>¯ë]Rè™iÅ`²ÔZ ˆ×pÏ“ppS|.ÙG˜cf¤¨§úa;lf×+?Ï'lh•oÅø¸ÕÀtÔÁêE l¡¶ÌAæB6d )P_ÜùOçúùíŸ_AÊ  n7Dbï2
EI2ûë.Üñ—†‡Vi8±ÉîO}Öò¿Ş*í> vK>±sƒ‹…TCø®d|¦ç89± ŒOÔ™OMuúÍ³Ötf5&@Äî}Yó	±¨aÿïá#± TPÍ Ÿ/"j]/Èc­uI“ÍûD¶†Qµ‰MjC°~´ÇªGUÁfò£Ç°rtjÚÕ~!¬˜gÈß·aÂƒì|.îV9°ğ3$,Ú:cá§¸ÎäÌ_ÿuåÏÔ¶7[êvRöğ¡åíˆg
:hpsû—ëwÉX=è @±~İ“˜æGcñ ÅOø¬ÏdSàé¢V‹À¸é­ŠM“u†Ñ£ñÀÆ¡8ZŸ!ÉbM,Q“´q–ÎÿêAx$ÿú*f§ÈM¬Ãc6t®6S%.ÁlÃ¯¯Ç6OåMÀ‡óÿõãÚó|M_£öŒŸ˜KÊ]`i±Rv{f.Š ÀÜ¸!-»\.Ye…a´á,´ÔuRz‘NÒvP2£ş÷şˆÁ3s!¾¬t†;q%NwQT3nj(2û
ÓÜš`…;¡•Î#™ºÈàèû±ÎysPàqos¨šXuú´`èL„Vştu%ŸÅ­0(ÚiX<îvÎ</RÕhÅ{IYÕ³“$èÙ8}äwfÏ³ñı sNKc—R4ÊüVi™MIÙŞÿ«=t?ÅF‰¾¦°lÓ2Æ2Ñ¸›ÆeôZ/ïæ4ï¦«§Ü‹rXÿ˜:º©ÚYŠŒ¹H±]¡¹]Šiä-~ôŸk"(NäÅÌAOçÇsjª-y“Å`NÓ›Ú¹ÿ¾oœ‹Š{9%È8I#@İi~rŞ:R·åÃ	]0Lş³™°l·éõ‰ÖÆF÷môöœ@ŞˆƒÂ¹¨§í¥&÷Z ¥Á:Ü=~‡Üò¹ªó»<läê¸ÿ/œhC»à¹æ–0Áï!¦k"µuÈ·Õ®Õs0CÆ²œz'ƒ'nw–mŞ*bt8JXHã|@CsÖjO0
<_ıqÙrÑÁ§ÊùT–›ÄH·¡åéı>¡?\z™î¨În·PÜGĞ€'àµôMq–!‚’i7ËÁ1µ'e/UÍ’Íû—|mê 1œ»-|‚áùâé0Â{qIiKĞHšÛ¶‹4èÏdÄM$QŸ]ôûå®nqñÜMÈ[(ÕBÊK u
‰"ş¹dY¶eG„Ó^>íÓè{½*ãøÅÍFR^ÁRÄ…¤t”H£êa¨6d„>y#±Ÿ’ÌÏ…ç4~>¤t§‘ûĞÇ<ÆKKgt4êP7“€Eæ1tË9d±³¥è‚y[(1%ì;ÆçĞ¾´/üûT;lçı›„Šˆ¼>¨y-H LwzÔ-s÷Îô2nl“ğ&7ùÌ•Æs‡ºü/ßyŞî#bT¾q	¦ºAø-ßàò¦½ÄvyÊñlñ20y¯jÍ¯U'e½ÇæÛÄ‡~Xy‡tÈÍ÷C¦¬Ñq¸´³›‰G¼:dJè­}Ğ/İ¬6«]Ñº•»Î|R„MñGoİ]EĞ,ÊT¢å»_<Œ9Sn©hë;aİs›GVÙf€(ÀWî:¡b„Ñê)ı¹¢²˜7—ñ"_™FÅ}`1‚˜8²ÚqB>.ù mÕwÄ£öÓ2æù î‚ŞIÂ ŠŞVŒM€=5wu6½-oynã,dOÒT~+ËHgÆ‹}´­öSC§/qìƒ­`eı„ó¯ö–…¥eNÒğ²¶Ë-ıõŞ4›¿²Ç¯ğ"HÅ àLÉş˜ØùJ6 t¾Ö[¥7,5’´Ü‡LUG5G[6‘p»²ÑÄš5›–™Àğ¦ƒİÍ#Ú¶àsùvİ y(^:ªÜîfO£ÑÓÄÿœÈ&"7IöQ°Úá•=T|¡Í/|°%Ìû±­é\2zdÛóËX’>”]ÎÛÌ×“3­Œí`§ÌT)”˜2à#ˆï8²-ğÖ}©{Á* ĞºÀ¹dÜ ˆ¿¿p:Jqi¢ùjÊnp©@Ú¸;ô&ğdâBß~tUá†ÅÜ{Òm O²Ñƒ<{öµÚ½`ÙúÛn?¸,6»÷:fÜ¡ªAÍúÖêdt¹ƒ²+?WÈü5¿Ÿëëà÷,•ˆ†¯Šénô˜ª
Ú·W9Ğ¹Ö¾-­Sœïô5#ƒøÂºä¬\„³ÊúFñµ
Ëƒ=å­®ÍÄ.î ãyŞW+p‘s°éifTT€PİI€òÄûfÎŠ%å“êúĞY­Õ·ğ\—­ÁAÈe/‹"¿+w)-ØûşGGG×\Ò'/‚×ŠŠÉ[Ú#Of1¹@w¶B0)-qÌ”­¹póÛÖÊ~™: ±”j[9ÃÏ„~6ğÓö	é9{NRı
d_<+ZØ€Œ.ì¶®0­o’põƒ¢L£¨Òw›ÆéÀKĞ¹ëÍñ8}	Gş'ô´‘İÂae:+ıØ^Ü;>ğy…ÒõÒ*?¶k@?B`¾úë_ægøÉµhîHNİßã‰¼ë‰Ğ<D$şİºü
ñ]~V×ee0”@‰bÉãê„•³ş&\£zXFYfÃ¥œ4É?d,Šo¥,qëó"oI7ŒYÍEœçïéücÃê,)éÖûDÿÁ‹‚¤Ëº-£ãî]Ó [ï$QT¥"5{k¬—¢%8“¾8îîÜR³™t¸ñ;¹ÿoÂ	¾8Éè0|¼ŒÓh·c¯'4Ö'aÌg÷­{H:ş€3P^¨‚—ñ)5Ñzaõ|÷‡…Å@Œ‹Êá¤÷äùıí4bîP´0ÎçĞÊcåsìàÏ—TşîüunÁ*viBõßø6İlÜß,NÊt$J†nGñíğÒ›2~sñ†tîipÍBÃ™°“á¿¦täl ‹4S.9´ÁÄ«ø©“¡ÇNÓ‡í%[KWÂÒ@aÔOØÜ#¤=˜+\I-'ÈåZH}z~¤ÕŞĞÁf¢vV°µròu7ò¢a:íÅbµ‘ ƒYR¸~›ƒ	¿¥áÂQ‹’d¯'~š°gêqÜ¯n/ƒu–‘½ãd;*;‡^\oÅâÙˆZ¢>@›RN#bÁg¶	ĞÔ}HV5ˆ£¹-‹+ Ù!AZÎÄÜtÛæphšàÃi4DâÍ#$zKÖ˜„Vƒe©ñµnÈ»ön(‡bÀ á‡øæ^û»Q[R½ì»üV‡õ<±Íú!Ìş´H«úÜV_”zãÊ½h»4tbìÁH¿ÄOÀÖi4Gƒš®âs||)m¥D¼¶ÁÙ 	Z¼\i³Ò õú¿ëÏ€š$ë²IXÔïPÌºÈÛ áï\?‰!H!é>Õ<œ¨'ú¶£¼““Gÿ©êXÌ ÒO„¶Â'l%RlRÈ?ĞyãäS~ÛÇ~Ø`)×SòÅ[›ı_õ“Ó×¶rÖgê[L“…ê†-ô}È%œR~ÀD¦`¦üÈ{ÿuáÿ7àºòÉßgmL'õü¹¡ù®XğB.1ÑEG˜Mz71Ì³À§ºuÅ!Ç-–÷,-\&¿»\¨>h2ÁQñ §¨- a¿HÇ¢ËÊ•7©Ã×k·º›âÓÚ×K¦YÕ¹MH‘	¼ ÜŸÙeœ”z3’b&zö… ){J{u¨a“y¨Á/Ë¨èp‚ã9‰ÊĞi$œĞa|!·Œ›£UEûIê7ªÿ3ÓÂŸSì$½ä3½›Æ0.+JDt"G[pœdñ)’W²qÚÿeGXmøgR>‚€f´%©7½[8¶>²áÌŒéoijV«<K[ŠÓÎÁ07jgúA`Ø6 È·¿z¦t·(hk—ÆÌY"%dâ®™ä\ÿøVdõmzZ^,î«N‹Ó4)À!·.õÜ6 ›ø/‡ôÅ-š„.aşÚ×MZ›õw¶Î)ØZßSŠĞâq I­@VÀéU<a½-DkDfíß'›îÁ _bÕÕÜz4rªä@˜ÂÏLÙ_ûóøÂ}méão´‰Ü£†‚‘VÍã‹t^(\øô—}–Jİ^û¢t¿Aó¬Qï¢&öDÕîä•©”!£99c­çê·F°³ÏD‚Ó²¶tÚ.QŸ¾ín…ÿv·í×ıãÀv¡|‘Æ;™”ô«mŸAÈ>IşËéCM‹ÜüRÉ^eK}_·ƒ{…öbÓ­Ìãı†Â²¢àí@ÖîyÚüªMøïçÂÛ’íÕ¢s©ë™ï4XˆËLçXEpæìV[È°\q<ÿ–hNª&ÌŠû¯ $C](b§6IBºK9»Z¼ÒPµQ¥­×!=­°ëâ&ik`í%J‰ÎûôœBÃ{)ãx	.ÁAeºåıºß‰íÕ%ï5 ÄRóxOO~NuYA\	ï;Ì4YY¾f‚ù·RŸf"²„Éò˜øBØ7ÙËNúÁ·îËì†·•úŒ3KÉçz,h`¶*´"ôÂı*½_¤+jµ‰„i”"	¢6Œ¥´Bë™'Šlöş9·$÷ĞÔbƒÌìÒù.'Ä¥IÈê'«¿Á<Ë¶?È+Î`ÿnÏ´MH*?|Ÿ¢.$ıMÕÈ
 §ĞzUgiÚ÷µ†ºÉÉ5Úõ–•ª²œñahÉ%Şq<sÛıüß“NÈO 2¦Åö!
	ÃF5?í,ˆ]Ls‘v„:ÄLx¶¡®ÜÉR¿{•Wø*¥ı™ÑŞ>^l!2Í"‡¯“bkÄÔÈ.F”œœBF^§{€ÒÓ€ñ¦~´›Zº‰4úÜİÜTH¦ú£7[p{ĞeÎ*{Ğè[Qš
w=¯ƒ¦q&‰´­3ğÁ”¼¼`@WWlÆÄ6ho¬PäYÎD«¾@K:›&ÁEWC]jÏHL°]Û__ªºëàŞùŒ¤e1=q†Öã	s»Bó2¥ƒ{z'Áxëƒ[şDÇ~ö/>bÔ<Odø¬¤~ şù˜Œí†‰ô9ûéyğef}ø”;lÔú’÷$¦BAİİüšƒU¿ô¥&yá¾çKç {Ä”Ø+KÏ­˜}\ß|ı“Ùošìsü¢ºØäHÔÑ×)Mü\;D7¬H!†éUürô›vø†yœ¡óÚ#£¸²$©‰ŠÕ6Í‡í@°YªöCØµŸ$¹…;@|+¨{àÌ­1Sô«ğúm$&	ó)3}²Dì"8òğ)´i†‚a.Êö Ep"Æ‰$NB‚›·’àˆÏ$RÚØ%£È_#9¿\KŸLu´»HA
!ÒK=} ‚ÇHÅ2³ºáŠ$Tx üN@B,[Øj]8Âûhôõ˜¼€®ï=vDj¨vsgd³ÿ÷İGŸ¿&½0×ğ_şâÜÿêm)58(š’àØÄù°R'gäm#W»ŠÌm/£!Ê¦98%ÂÆÎjÏìç#ŠaIØëB¶ wõéÏ·2èb¸ö¸háê/Ö#ïnˆPÔ²~s]ÙÏÈ°
¿¸K•ƒ…±YÜ¸wzÅh»M–ãéŸ­{PÌeb‚'š«QÅ·Ù¶ĞOÊmÎLBnf7ñC:+Æl2x×fX{ˆ½/K%Ies,Î{˜,zlk;mÎ8úÏ‘#ËàdÉ?ŞIÑgäÌf¸’oWu»1ñ¼€k?[mÉ¬ÚœM*¨ÓvòÛ-¼øĞ”ÏŒ&¡†­ƒÀGòd\V¼;'£¼*Eğn¿](¯›6'tõÕÙ×Ñ¢yJ©¶Ûïeà®Š¼ƒne–Ã·üã› ·‚KØ»§0“­ùçá M‘Ç·’íë}¯¨¶:/Cjn™7Br=qÕƒtqMÎ•wO£ê› &[5æl“~­—•Omßr¯|m1ìºx  ôl2ê9åV	Mb±¨o–'d€}6ôWÒ¹uªÄ`Æ$RG‚œ¾o«ÈÎŸxy:[Ç¸¦&
"ìFœhZCm)ãK}0ü”?Á»òkpK\Pş*&†Åğ4ÔX|Œ´ÄöôóÌ[_øeñM?öS«€w~ÿ‡º–˜íÖ¨Xáßšy÷ÛH’
à0>eåGÅŸö›EáËŸ%©C_N¾@œ2Çk€Ş²6Oø­­c\’+0²­ñÿñœ×Y|Š¼rH¡u³Û9*lÏ\¼¦²xíË®fÛ>Í lü«zpû‘FB~;õµú€¡†5Ô>«óWtˆØÑ‹à0¬mwgÃXK¤Ê;)Ñçêş«. ©ìEºaB¼%úÉ/˜ÿ–›Óvs}ïJÌ+¸}±Œ´²àŞ(!š3+ÕÉ…\rmC8Ó(p=K¯RÔMsXÂ{™6Ğñ†ùô;ú`ÒQ¹]ã71ıv|½)¶'ñÜŒ÷û¼‡TÊb4@6¹Jƒø5‰æL‚¦-‡*x€Q¯Êş~àÒÿ» rµŞ™ƒ]
yDÕ#º_‡èÀo—	1«× (iĞ*çcdïI×h!4˜Òïˆ´ú÷
°VÌ|nOGŸl=ÈèûPù¼¥À‘CÀ÷£©rã¢Åa|3YÇ5ñV­Ä%Kœ@}ˆV‡ş;R¬PÌøÓ¯c‰œîºáÿŠïqtn:ÀñŒæì»#iàÄ¡XèƒJß!÷³„¸î'OD13.å<tÌÛÔ¨¸œ±	_Û¦ÌŞ8‰‡OìŒ–à§òT¸W·Xúc½ş˜uZN% J£Î´‚Í·€ášïù|_1g©üíömwšè;|“'¯‰!ó÷×¡Ÿ+AÒ8st4f-ÏirŸøõ rØb1Äg?Âg‰¨È83	_¢Ëbˆ08 mùÙ·ünZR–Ğª·o
Ç¤ã˜òœ®Şp™oé/È(ÈßEg°ÛÛmÚÚäk\,%°UÙº0-Dş.L´ûÌ°Ÿ=é:aÆò{;ëãâ„ıãk„2-±±ßıÓ‚GRÆØªG¡Ş¹-$nêåZ¼ã`w>¼óÈwÂß#Âı*ô]YÁŠ"ÇÄ ª–=õ\	ş-3…º¼6ıÉfı@˜“¶É%­ˆ8vİct.º
+íğCsñ«Y¡h¬3-Í]‡‘òê°}¸®ŠtvÓø5áËz…
N	è¬b%åÉÜ“Ø1ÄE²®ÔFĞÚ±2l lGtó•@TnvHG#‹Oi¶ç©óªò“ÒGA²ÉA_‘wáZg‡áõãVˆÒm/·~3	<GLŞHö2Ë%Ïía_.¶•xõöÙEïwĞÀ|x½H£¼(ˆ­MÊ‡#L^cEÊÍiCvNlg÷¹—©©u“=¶m$ŞKàV?^Ì?2‚»«¶Â÷=êet?õ;€œ´´ˆêfò“ø‰nÃ>ĞF.¬¤ïfì²¦.xı <Æ¼›óò»{÷È}ÕÍsD4Ä¬ÚçpÑ‹vÉ;ˆT¯1ıYj¾fiDmËôo¶üò¨İ|zè³IçYøé…o‚×æ:D³Ùdğs;²–´ëk:€Fâ‚=’8Ãö$K³p|Õ‡õÅî5BÇw‘
Ÿ¯^<ˆ#ö³ä[;xAóqò2Ùô)÷d‡Ş€°ª*ˆYğöãû…•âœ½Sïƒ8µ,Si:\ç™m}{:—æYS¼a ÷«J1ûBµ¯§óP\Yl‡3®İ$æÔ#9ÿ"åó&)+õ!¥‹VÍ’Àà±ñ5üßÔ­³)Q.Õ‚~,£“Hl†z…U¥ñ‡¥à†¬ ÿ¯`œÉ_àjPæ‹ç­S{»pÑür~2ÉÍœŠIÏ?ƒÇØènPV%%³ Y•©›Íò'3-pó…K¢}JÇ`Šk[öMQËÍ7”Ÿß­˜b+¤Qˆ]Ëî}’2ü7zC;‘{=

³¾€0@12!xæµô;Ùº7q"şT€ÏàÖB› ­$EkëM ORM¯ıIS˜kaşÁ¿Z*Ú¢£“?ÈÖ)',*3»d¦†›Ö¾ÀÉGWèÉD°šš”¤n2Â<Ş”hô1TZŸ€|;sTi‚ª‘f’{àÉåÿ+(T±Ú·ßí“¾Ì0w/n—·I¦w¤f|`Î¾f’½çsX[2Q&)(å#<gŒº”¦RkD[kB¯Ğé¡åå“h ºn0j#}È0|›ÄÚ85ìÊ>•SãÃõ	K&Ü²ÁÜØÛ,ğâÔRR¥1J)$ÜoX†„ãKc²jÛ2”ÓhšˆJp§ókÇ:	AøêÂ„Â½çëã}xm¡òß7·Èj*ïœ-ÎDGev„ü^\.jÀü@ù˜ÚÔcªoáAëbcÀå¾m˜T§¶FdøŒÍkH_´Ñl×ri`ã×³ÃX£G¼¾ØËËáUÖO;UØKmaZóC¼pÕÎè²~Ÿñr¡Òì€zÅ…¤`åà
á¨Îİ{^4rÁíŒî¥	õ¼G=z‹Xş=Y$VŸ"Ìß!>ùÆ"æÇ1ÕS°´Ôá‘UÕï¬ş*ˆ×”†×>© õıjøä5<°@•QŞægû=2;ËvXê	úUtš[‘ñó…~æî
„ókie§çòª¯ã&ÔŸéâ:Ú(>Şî-Ì™	L¦‘!¶ÍÇcº\|
6²øª¶É¼Äõo­]°A·£¾ÚQQSGû\æQ\à8DPˆîØcÄ¸4<P–È‘Ã8ç¿¼Ç×2‘É¥.3‘åyt–©„j¦ñíª¼Ì“;UzÈÕi¯ø™ z¾I¶R€ør n>79ã´6ä³9‡mpŸş”ö€Pn†|E0+P-Ñıÿf"¨O%òÜ¡Ò¿H»«Ü­ù Ïƒ}iÈsåşÊÌä°sy%”²gÇ¯vr‚©~ªRBsÑ­ŒÆ<qŠQÀyp¡ïGè†VP¢H5Ò]µW‹ ø„[OaÇã7Ä½ÖËèÇæÉ‘lFÕÌ¿0©ÇüBE‚~ã0¢KÊ
¿GÔ¼U9Ï"¿e-(”rU)TÃ°:zÔ®Ä-—-z¶P Å<¶(ïº)Š`~(ã5÷itù¥E)¥jŒJV×Oc$í&óüU—¡hĞ9_á6,ÊŠ{ö*AºÏ	™I'±ŸÆ‡"}^~‘,±ù‹ïÇßçâg$²+·,3W’âŞŠ ‡Än’½oŸñ½¡ˆ’WÉ•µ[P`µ}µÈÁIyZÂCôÃæÎù´g¾`2e©6M~ XãW¸U<3'YëQíîÌvxõ³p²¡y2ê&ºæcî6MÖN™B®wÉÏd°—ßV§±>/vQBã‹vR¾ñè¥E¯ğ:ÛRÈü¿K¤¹M¨Ö•‹ÉX×L=]S¼(BNî¿3uYd¿›w@ïV€÷ù%sL!'.‘É7ä`ÈK‘nvçåº“‚œø|àQQøÉÆã“Ÿ#µXMhjƒ8úÖä±•üãè¼‚ úAxâ„áM†÷ ¼ùúc/ÙLêé®ª·‚™$gS ’øét?s7õMu,\™³'–J\‡‘lÁòÌ"Äˆa•[Ğç•>ù—ú(ÚÍ³ÿ8ïÍKÊ‡¥ eßÓY³ŸflOˆ-˜”çJ8ÊĞ4N&øN±æ8”òfhÎ™»ÙÄzñÜø‡n^N÷Ùğå>É’ö…¿â.-Ù)¿|“X¤q	>ñZëı¨8‚ø¢“yRóÛ&í×Ö—ŒÙ67NâhJ¹ìíDŠ	¢É5Ñ
2–~‰º|‚¸”¼0Â‹ô•ïÃ_±©p´cr|ä»Ğ"Ïn¢+4&wi‹!§‰Î!rÁÃfålª£‰së‘ß £°İ2Ws_ÌTqÃÉù—ïÇDo#“1İ@_KW1:¹vzT>+*¾{2ƒ›Òpv“r™êœ?^´#&èEYuühË­zîNRî ê¸R  ô~D¯â;pGg¡Œ9mB¦AÂ\Àä§ƒÂB¯næÓ\3–™œ=¡>œOjƒ—1ŒÕÉeé>¨dS°ƒ†q¯†¨”ëÎ¯\Etr=3ZMnn¾¶%‰ËĞÜb•Ì4ãµıëQçxQáRö+¿¿o«m"® 9£“~B		Eåhñƒ!ÑI`ï4ÚDÆ?áä/0Ã‹˜*H )×aƒ_Ñ–˜w
G—ÈÇ!‰i½ªsDõ$Vo¡I¸,#•òÉğ%x#qŸ·ıfÏÆ¸ºfBÜ¸ı¬;ŞSóÛË•Æ{•Ğ&]½/»k¬£G  'd»”é‘¼ø®’c®zœ_€˜r'c|}€D)ÿÃı|Î9­[Ÿ¹*3]•­a¸ªBôÃÅÒ¡º:
Aë/#¸)æSi‰Ç(&"«’úœìoPk<ï¼Êd‚ ®JL'¡Aq|O±Ôøtº{8¨=ñVZÑF¬[jºgòé=$PºÕ¶2‚q-“:£Lb`øóİP…µs Wümq‡±Î«ût`0À¨ü	ÚFñˆ±èt‘Óvõ‚vA™Ğê“<zn£Ğ>h+ó&~Ş#OßY²](£ú8ú‹½H²"Í†íëÏÀ²zí‘­è3‡·aÜdKVXZp½Ulo¤ˆ;?î+$3/à¯®üR¬?©©N‰ŞE¶šZÇ3Ræ·ÜÓàm"ªÀ­pEˆ‰n}İJ53¬§Œİ­ü‹È——²{åŒ X¶¨’}’;Ò×¦°R}[¯m=¶HŸ¿­)í§šm†‰û¥/jšdİõ‡›,±›aZfG¾ß_)š{@]Ü9øë$,tİ¤1 @=¿ZVªªêu„+€ù?1ßÀ#`µ |f¿€ÈåË~ø_)û7~
júÎ&`-y¤æ\ú'Ê GfÇš‡mL|õÆ†‹›ğêVŞ¼v©è£jvÔß”Èüu=İ¨µ‘[äjË\ßyz}º3?"	âZÿ69R¬iŞQ0ÈÒ&İÎ#¿_%I‡7˜fJãùx9[T,œ§7İ ŠCÖ³^äÅúí/t}ˆv¹‡W’Ç@mù¤;ÙÌ‰ü¶µ‡â>¾/³;2]8‚5Uæ7É^o,ìİÍÀ²ğ¹THü˜UvU"^7Å:ø–_(HûçJæ¬bvdt©+’ü§>…­4ıG§5âú©?fıë<ÌF×çìœ|•õ"\ 	_['¿Œ(ŒÄ£§éúˆJ3ÈgÆÿ;%X€Àfô8o*Pó#¢sNKıx5r_ĞoíŸHò¡’¿QéXß
E™¬E]w#'Ãém^@U†ßŞ…ê*ÁıHĞÔ»»Ÿ5»DfÛT)’4XäĞ™şL•”u* –E6ñk¶¿D®8åWáî±.|ûKŒ!äã!ê—¥ŒóX©Øt÷s2™_Šs¼#wk¦økUór„ÕÊV{Ÿú½(ÿ½S»c½>£”…¾_«»‚èœü	#¾nõC€€tS@c›ƒ‘“ÄËiZ)®K¤àiÛL%Â€2!×ü·.fËÚÎ¶´È3ªÛP…™óñQáuáNA8Û‡ ğÆ.<²”½ÜÙ?Eô%¥BÛÖà¬2Å_IR*hÓı´ï%uJô?•¡ÔŠ †Ö……BDP=Ú|yLˆ£ÃôBÃo³òËOc+"]¯Ìé¶'{%g6eÏ¡R•xˆ‡·i~*ÑÙ¹)¢óÄ¾J_S-ëú‚È9ÓuU÷×syÒæ	¹Rü¾é’‘.yş‹îpxˆ~²Á~ÏfRŒ~ZÈ¿Æ¾5NŸ2Zô‚q¹±£qÂÀªå6À´do$x) X-%Ä5ÀÒËŠ¼*ófÅ¡wQpßuÏ´=H8q5à‰ÏQİÁ8çºb‹()áäc€“0E© é­=p¢%Ám×ú³ˆæï£}üÓè_fS+°P¾ºfã†²
&{2şÒØó6ú /fFV<pêwW93Û Í|3Rµc÷‹òdŠ2÷ŠÀ¬Ù¾© Ic¯,I™™İÏ^sò#êU”Ö/üz›öEŸã±±–ÚÌïf,Ñ \õBŸUÚ[p²MY>µÖZ½ä6Æ¬4­öÅ÷g­ë©ş­8Aûs	6?>fM¤±‚ÅhßW‘ùBXÉBøU›…¾'«|ƒöM•+ÄQ>$e-ºq9'ò·t’¥¸¦ü½Lp‰	œÅI`àqm}ój¦g»çî‰J0°êŠ Ï½¿É9óîîeœ,wìP-4B˜ÌÇó6r)F¼ß?´mEæ+ı¿K	<à«]+*…´ƒºO-	2%*Òiè›¿´>‰ÌB jĞ´Üo–q¦Q>ÜŒM`å-)áyYn	O˜sÿ"°ú«‘²+<ä-İ‡z¦|ÊŒ,ÔÂ¡vîë–Ç\å!p {ÛÇ°T‹–ß²†°‘ úyûõõU)aPÖÍáŞŞîÔ…Aøååb1o®¸¥Qò©{|c“ê"ÁJâ¨kS¢“*¾2ÇoÔ+õGæTQµäDp””Æ“‰QÙJÛù
øeÙ4b¬m:Àã²­4X±¯×].0H).‚ì¶=äıµ“Wg¡Q™še5°ğé—{3çclt{í:jö¹2Îq•‘õvSÂjEİ£í@˜›%Ø´†ˆ’|©à¦á¬å’f ú)çCaPã¼Môµığ¶Êf‰H©aW`e`wœ6¯l»ê¾ˆæêäÀE*ü¬ÑN<ÖJËè²à
ÿÑÀ‰¢£j…A¤Iz<À\É˜ÜË‡à¬¬8.IŸâÊò4H_y¦¡„e"|4p-]iã¤œ>øv‚4£Cù!Wl+F"*¥@gz@‚Ü#.VhÔ¬Ñé1òƒÑ#³â×ëÅ<P~¨/uolÂœ|ât#Šw¬v«¾£şİİt‘õ.§døÅ<IÁr¹Yfß"ÃÏÊº$”g®Ø†dÅüÊ 9jõQê[zü“kßÜ¢ 4XüñDŸ¶)+»{H­†˜å*½r#. —&İb•oªu&FÇjîB7ø˜£eRfªÃïç££nY·˜Î(E¯ÔÙô¯`ãfµ³N@B‹n|>ê–ƒ‡£Ò\°j0)›P»¹èo×¹w¢[#Q€©GŠ{ ÿ}ì§œïşÅĞ#è©¦µcO *(ŠNH%×uÿeüPš¨¬˜.j£‹Öü®îó¶¬İ\Û—¨hÃ®ÃX5—Wz°v«+–eüÌdgëÅÖ[:İµ:Ü«¶+U9Ë4ÖéËá^>†+?7Mæ–4,üéwiFŠ2%xË'eØ$] 0§5iIåå—ßºôd¬ {Ù¡÷Ú‘ò"|jÖÆ€|ö ÊèXç¾O6`ï÷CD«0Å-Ó×¦S~„[¶;TÇ[º^µŠ¢7?ŒFÉ^15dVà:5ÌPõÓcOy]êĞÁ3×AãRd˜Şì‹Då…œÇyè]º¨‚Ù‚ŸB«±·€E¨xí»MÔÃÁzãwİdµ?£/tmdA¤$â¹+õ°'^‚Ÿ7dŞ™†ïíßuëOÕ5¶§UUèZŞŞ„Tf?ÑÅŞ:ú¶i8©sş]¦Zn,ÂÓÄ³r’:ÕÀHØ—‹[ş4"s@qsĞv~£È!kdÎ¨›†Å*Ók;~›â\ÒÏÕ†(*oÀ½J`JˆÀNqóbÉg¦úÆ·v’-3GrA1znï\U»ÿp,$¬wÿ^]fÑZäôÍ[g…¼8Š(<~GİçÛË¾0—ÁçTos,Q†°¹\û2±RÎ5³æ
y ½ç[>[+<^Á™kv$Í'“:¾Ñh†Õ>y®åœã%ì´è¨<ëjÚ¢"„PíÇÕ6—Mô ùß…Æ'07;¼´Š˜R¹¶³,ÓÉàê•Ñ­˜äÓòú~2/ÄÊ—”®ƒ{Š!iÌÍ·ØúÄ|UÜ³ ßy ò˜—×äŠ"Nöë»x£ß×˜jîˆ^ªûú©k]=PN ã"Tr°É+Û¸]œŸ7üĞˆpÂ‰4°	ÊLKÜ7¾HÆü`jJå‰7ƒ\‰M¢ÂE¬=QÒÎïïë5ø¾ï¨£{kÈjyÃK°Ûåáˆe©´ç±¬«"¿\Çó	
¿£Š ®]MK¼–qÙPt5Ú$:?ÈM¸kbWİ Mš¬áùøûÊøƒ§)€œ”(¨—èñÆÚµ¶Bòí0»ğÈä²x‡e4Í¦F[Gh¢¯¶bœw¥Ù·†óˆb„0à_™[eñ®H}.Ğ²ÛüÄahİ…	?ªş’RG¿pŸœo¨ô<i¶åØïÇb¡u[.,EºÑÓ×Ğ©§Ç¨+ëùÊ”7’ÚzŠ¦B?Îãßjó–< W÷ï¤ípn©Ş¿–‡éTf"KŒ3übƒıY–™x²àf¼B÷Äò,À]ËüíÈ!ÇÑ«:A»¹¤‰ ’‘š\ğ5‘K‹µ°ŠÏõEF"/%cãò©ŸTûê?©ms¥˜_|[)Dëƒ—YmX…å5Û&øb»„lÚ£›;ÔŞf•ªJ¢&eÍøaíºfA‘¼Ó·g”©İdBàÆØ£;‰Z…æÙªó{Å§ğ…6*ãWÆ¤\=8lW+gêÒ%N$ÆM}=ÏU	f˜ôdˆÖ7¬ï6ÆBSJ«qó¬´y…pÍ‘ 8š§CW¾WK‡µÁ•Úéæ‡-1téÿñšìÒÒH÷`ö¸ù–­©xğ¾c]ÎİŸXKÌ„â{kO19œêuIè¨¸³}!ìù<M…$‹˜¢Ê%(d.ŒÏ÷pX“Î[€”‡roN`‘ú@ â7ğ´nvjåÁ°(J~ÜYñsôåú
`Şâ±4“6èë\œsäV':\á|ì_Ş‡iÓMIøÙSåãk!IMînÇA}*ò|ê%•îşÍ2©×‡rTî÷ü~+K÷\(à,Ñp3)ï5Ègkg¶8m ©1œË_S‘Rè“Å…huF«üsØ±¿›GÙY[!n–Z%•Tô{,Á óKä»¢‹–˜ij¢K¨†ÀÆfFº£R¿$Mİ4§€œ>ÂæØ´EN2 ÿ2Dä¤wBì¨A)H¥Qã«$‹-{H•ğ9Šêœ¤ß9o²à>ÊLa±7ceŸra‘‡7sÖ»w2ÂĞÏ$äö-¹²v§¸¬î0¦ŸÊqiôzÙ)ü|}P®à¿Í3æ*á£­×>lÒ+‚R[åŠºfÜO5]U¹ıŒXÙ&¥Å·ışÇÑæ!B£Hƒ7m¤Y.8ümï´Í_Ÿ¥ÊÍXl õ÷…ÅN!¹Ï¼îšWf6`“'2U£A~è6×‰¼/«\ğ‘wSúÇ¥«”Ô”„2=³$ê¸¬Pû¤rÑ¥ş¶İïÙò †XMj#'ˆVİ.Œ—è³w–uÈ:w&3%Bö„öû l/ıSo$fÔ³ª7¯Ï%zõb˜ÅWÂñ“IÁÜ]Nâı4i¿³yMVÇ6Õ9š ÕE‰afËÉõs£+èŞÉ×UNÈ;ééç4–[-ü|>Éà6Uë$hÎ]üñ±7M àSõ¿-¿¨„¯}ú72?+ºÙ€bÙLä‘‡ßv³"£C~µØ^+l~T²2ØÎİüB—DP1<sÒB‡jš¢ÕQ+ïÉù4Ù^9È×b¸óz¤$¿å8(¥Šì-f•67ª¿Ø6“êgy¨â‹I\´ßLß °!Ë`ğáÚ¾ŸºÜ|eMª„Ã¢oê'3_Â£.Z6XtBŞÁ–(qn ^w××ÉÉ1~WŒƒéU›Ö	>E¤é›…P„­\ã»î_~]hÌsaìvAŒãH…émõeí–<?v6Ëa^ÊèùNfs—_”nĞ‰s+GD •Šè² õŠ›yãbö-zY>€XşÚùLMåëŸIÃa'ér³}á³˜©ãÆ2`=ø¤ÊV±gíÔä7Ñ;§¨…‰LTÔÏW~¹ÂiÄÍÇ–’Ï eSsĞHrÆÀb<ùø/Ÿ2´©F(Ñ>Ãƒµc.#äõÍÒïÒ^hŠ\ü+7j¡Š[èê„Óòœ	›¡ë'¶~ß<¤ñÖXbnÀÑ¿óQw–+Bµ+9,¡*¦šdíBy|<ÙóA¤áòCÉé_}¤ú›ò>ÅæëğCûˆÊİ
½-0İç-Ş¶‘º|·×ò¡øñ•ÀÂfúX$¤2ˆgzå˜À{B†÷/”¿Gd‹õ§‰¬¬ÚËk´nk÷Á;Ö¼ÜBÁµ 6¥“&É,ùdY¸em	õJØæpz¦V&eO
¼·–ŞÔµ£»½‰I[ÄvÆùı+dgÓØXÏõiÊB°
îkÎ0^¨Û1fr%üÇ˜QÓc…£C. !ñ*úRµÃòÇÕŞÜs©~<n]™IÛ~Då^AC°.SŠµõ´b!K²”:]l~®ê}1ˆs¡İ˜$ªÉ•ğú×Ú(ƒ‡õ$÷µ‘áìçƒ~÷8°ö¹(õH*Ã¾½Ê…Vn3ÒØÛw[öuGº³Ú;Â>fğ*ùØØXÏå¿-Œ-Ú7ÏïAÖA^'Sv×³JT˜UıƒÎãé#W:PÃ¨dë –c‚/¡iL‰‹Ö8şóaÒ·Œ<µŠ‘Â¶¤|s3VX`ö-\GZb"†¶&È™ĞÓƒ®[_—µ÷ı%jÜ;ç À…”ø	Iê}™ ½Ûäôm3Â×	ú#†”r
,0k 0®gi2…jªè‚UâÀØšd-Al ™QL‘ÕØi£œé>-‹¾Ñşa<‡Ãÿ\<5g‚
’õğş²’I…~°¿t‘MçBÈ³adÜ5ğY €•»R™k¡Êi¡DD”dëOÖ¯2Ÿ½Uó@Ÿ¢}fÓ‹#˜pè˜©}:ŞPÊåÎ1ÿ	¤>
ñùVıò|{c(óznO°íĞe¾2êÓêàÄ²ÅÎ“¬1MÆ^+çêê3Š~ßÕçìH¡8´Èúd$¬ş"—^a€¥VŒnqGéŠ*ÓGU”¿Ã «³ù*tØËå¶ŒĞ=]8® xcvÈ…NEÿÚü>…¬6--šQL’/Ç}ÑEÚøæsrÃ‘'m=ã'ÕÄ<£!îãúâZ
°oÑøn™Ü2ù[]ÎÛ(,è.ò&OB=™ÓQ‰o 8"éµ€v’·¿¨/B!ôBIôCä%`¼ÜB§S˜G-y"ãL·~ÄÖ(¥?Óadz…ò°í/™Ôù0Y¯­i"¶¢§T5ø,5ŸšQJ†`ÆĞ&›.I¯wôù™?Óu˜ÛvE>Á3ü)21EEêƒ¼ìME¶Š¹MÜ¹F¬Ij7Ñ„	R__:DA.m6oœ\İ?ÀÇÿ¬ğ ½`kŠ*HN+­¸¶’Ø‘Kà ï“3…mÅNB“Ï°ÔÌºÕŞ¤'§PÃÒ&‚aSòºÊæ;hJ ²Á¯3R&jµwçVÊ÷ŒûÆáÉ>•¡õö¨Ó¸†…Áwƒ½|!~ß(Yép¤wPDáÙg×rFÙù$oiÍî|tÀ«¬Ho¸SxáÄä“Ÿ ïe'½œx¸Wì7Ø?•Æß…šn({/V
#‹<=Ôzƒ'º*´ğ§_¬ëı=ê²¼%"è·SÚIşñ¼Nµ¥¥–®SöĞ7çèÉ¨gAn ™yF¿Ú`¤SËÄ„¿gÙŒ2qOq4Z_»€xä\µ®Ÿ7( @!åk¬MR"µ¾w´©Ñæ 4Iê!Q:ŸßGel €?!›K`³óå+ğ ¿ØÖyÃøL]¼ç·-‚¯©}~ÍR·6ôÀÒáÔ–à`iÎ,–¾¡â8Uu?°Ç*WãÈÿ@¥âK5ó!4Š©ÎŸdI’<$ƒÏ6ÀNÑäª9jGí”Ÿ8FC…Îâwò“ò¢ğ±Ö¶C…uR>ì‰UmËÈW$i†ÂdŠÉ®Ì¶¼Ô`ğW´ÌêÛœú·Ê¦°TSÆ¯Œ[—?×h¿ÎÏø‘¤üıHöVÜËÅ^e•İÀa¶XC¸—^K—º¥+ó°9è6åg>‘Aƒ?€ÎB0ºÀæŸÁ^í'FVv€<jûùÒ‡y"‰)|g½ßv½M[¹ÈhV®@Ğx>oş¨ùœ÷ØJXy®tµ¦Â}äû‚ñ=}.•“ˆJ%+øÛElatTˆ—ŸÂôğü¦·IÜŞdûšrèF£¢õÛ{A[µ«İ/|Õ¡¾ÁÓª:<¶ş	²\kš»ã÷ØÒX°z]WÚ§ÿİ®¦À”ëAPÍæĞf­(2yù2Ÿ79Lfmºúxìñ ˆ.©Ëi¯MpöU»‹yüyvıXBU4vKf#EëÓ¹”™y•‡:gw¼îØõğRâ¬ÇâU´~n=ĞîÉÀ‡#U“±„¼å·Æ±æX&èÀ¸D“ëèŞû}Ü—Êî²=¡	[ÎÇÔ«³(â¥rÿw+1\ÃË¨ƒ³Nœ•z¾a}ĞÛ¿×ŞMäg¦º+æ8íÇwÚSÕÙŸhCÖÄÇ…yæ„™&VÄQ½JÙ‚·ĞÜ­¢ïIB	ä;¬˜Öác?úŒñµe„ç(qŞ,Ğ¿iĞ€,ÌLQÙ»êõ†­Xˆšøšƒø[‡@éè\¢à¨:ZİWÇN”be„[È)%eùiDÆ±´Á6èÄPâ˜µîŒ<DéØ©¹—í7éÒ¬ÉRfÜT	ßˆŞ¬E±¹%ÏUsy–ÿûV fI’%rß9`ÄÍîÏá°UëR‘FÙê^B«§¶år/®]ÿ3px$	ØÓ—íÏH“ÒF©82´ºâ›Ró_:ØÑ|eÀ;~!š‹HG›AÇ7eù\PV"x“ÿÊîGaĞ€¡‚ú${vB=ÏÜoja	JæÎ	Ä“!™ƒ˜cdåú±a…(À¬%´¯d#Ñäœ5S^¿Ÿâã§Hv;ª©`÷0îà'ÎØ(>Ù®Vª66q¦oÒd]¸ò¡<³²7R|şJš0›ôœ²Q€™&ô³»´6]ËkXJßú¤È˜2:G'üKç»Vróp!#oÛ¼(a÷Ésù³8âö+	æÚ«ú0ìÑÈ‰!?Öo<ªp˜İ&Aï)‰¶Q¡oaàÅŠšVÀá?;Â„0'E‹Q½PÁB–RG<ÈÜeÎßç}jqéÆöeÆô&;‰Cy;ƒõsf°ğ*ô2+û·A˜)äN²à£şôäë¾ÕÃqsXMlÒ¼ØımVèWu'#‡¸‹¼Lºø9\#Ù¢5Š$SãBœ‚3pV—sl¸Y˜9çà¤²æ[»uIåbŸ??­ö."F8L”¹|Ü¸œı™şÛcÃî@ö¹Ñ_J¶¥íí¹‚åVÍ¸™Ú</î·«Â~¶‰º²F¾ƒúÂFÂîÎßÎ_7 Iõ—×á
 åşIpRF”$ÈÀÎF-©Ç;‚£“ãÜšCSeäæ€şµçœwæ+œ­ë†W7‡r´”vÅ÷©bè5ö!Œq1¬69Óö¯PÁmúKR^.9OÓ”°ÄD§Ü&lIfqqÀqc„Â÷Xph&!.ÛhÒ]öÂ?ßM×;ñ^Ó‹Ò0TœÄuÙCÊnı¹Á"£9Ú½nË°6€eUUë×…l]G3ªO†Ö³EmVî£o+	i\;W™åÈ]å¶ÃÏıDG¡.	şrl9U›×&­g&XÛñUVÉ>iÂz¤aŸ_”Õf‘úXA¼ÄR¿"LßzŸ]Ì±öDò…F½Çº-ÄhAÚ—óÍx¬Ğ
ÕD3cêı:Äô9(Ñ˜ë¦0UWe›¤TDVüÛ~›x=zÕ ,ß# CËµ"P^E #zfx"Œ5®kóä<bÃ¾â_×?q,%.$:ÖÛïÕ—kÙèpˆÒ
—_„ò}S²øÈe|Usb5Â¾†ö›®vX*Ö–!5÷‘NDc1ÄqŠYšv°ÖI‰µ™ºÙx’0ı	Ìüï¤2mõUßB£ñPñÛj»nÂ-× ã÷}Õb%r:~¼ÅÀ('´„CF®pò3UÊ$é†ÅwI5³ÊXû	‚YøeƒYŒ;okü†ñjH H8ë"”!YÚ&ÀçG“Ùı|CgêûPÓÙkÑ)uÿLÒa‚Ã´Úß™Ø""¡½±ã4øÚ˜(™¸!û°‘tÒH‘v‰Åd‹‘g6Ò½æçËôÖ;0VÍ[ê¼Ò¨„æh äÚ¤qk&"t ìDéipŠb6!üïæs)ÑºëÉ…£®¿œ„YÀò¾ïÄÌJ¯e.¢8Áÿ®ÈàUbï8çM+ëÄ†G_uÀŒ‘G8ÿAÙH8|Ä±÷é×È’í·ë~9%køâEÀ‡UZG$ÜIMM„;Ícº'.GèKšd[ïªüH5‡iw%ã©Èñ$Ã=Œè–‘š?Œ»•‚êÎ[ë˜†ZÄ8÷e6ıSóuDa:˜ã`²ø Hh÷	û,‹èÕgÎ¤A$¨†^@À/È[9lògƒçÍÎİ¢“¦×b9WÈ×ûµDfÀw+ŸH¹e©]<–]R½(KP<cGôÒ4ä¯)jj;n9”ù›ÙâĞªZ.y€¨Î¤v—œş¹Uf™ZçŸAM€ƒ²‘a(ƒXpÄlìXX¥óéH"}qÒAP	Z#k.EÓ0\¼ïâ<Y>ãk<ûKÀ®şÔGûvŠmYÛé56RQ'6m[°ÈçqJ¾éhk(:4#Œ ?Õ‹·«úbüçëK«<~õækh»R¡àò!ÏóOq²­)ßÈZ³¬[fİxê[ ÁU·ék€ ˆ ÷Enehª!ä`	CHŒŒ¤¼±%~¡f8Äøv™İ¾àWİ"$òÔ±ËŠ¦½¡ZmKÛ[®¶¶AœôT[×Ç2@]L#*?MÌ]á‘uÍıÂÈ¤÷ì×\Gô]‡ÅÀÎ¤â±b>œjÀ¦à0ã³ğ¾èÖÁÜÅ³ÈíW}[¹VXk‡ÂÛ)N‹Ó*·§>Db4ö2¥X£@,ÛXw²*õÑô“‰ú:xWŠ––»œ˜¥Ú3Ç˜ç°99xÀıªá¢Ùú¼G¹–Y;ó5ÂæÌ^³ï
Ì»R„‰dÅx„²İãáF\,ïâ°×Ñ²q1œ©Ù$ßî?UVR¹°Ø-Òò®¸/Ø¾%ÁVMÍrSâŞw¿g×}³zÍ”¡ßQ94ÔÊy*p=ez*€¸p
îØ#6ìÙvZßÕp0ñC½«o,)ItÒ’|?æ”[êÂÈLÂçÎ¾7·ÑAöğEŠ©şìåÈˆí‘
uÉü$ŞìMÖTE—å%œk¾hù9Ô-Â†e Ú¼I¿À*„(Ì5ó‹ç¾dVc§Ñ«œ|…Ÿ9•{Júó¥€¢ÑÇ´Ó†'÷Zœg ¼âTf7-š ,Ğ•8™ô»h–åU<)À×ÿœñÊäFdP›!s—]ßø•«è‹ú>Ë½šº?_o’È†ráx—£ÅÖ|›öş÷A@~îà`Á¼s¤ÈßNE—CZÀ¾Ó¡¨¯k×†AEaÏ£æ<¿!İåá]Íƒ›û<`D­;»JFíXy7oßàï1:Pö}=¦	‰6a1Ük£èÅr;ïºN#}/4ˆÌ½„èŞöÛb²'‘²h³C½o›ÆğğÃÇë'÷Åœâ9p ŒWµ&TAËÃ::,rîÚ"Y…C÷ƒ Jõ0æÚ$=h -¶°Bµç¶ìT…§cAsƒî‡ÌûdTxí<zûi§‹¿+ü]éuÖb”İzÈùû@ ±@%»åÉøCWZ—ºR8İê!sASI{2np«7±g2x9‘¦’Ä!*VÂ¦6P;å[`ÉÔ\{šwLxú‹µÅEj_Ä¡‘ãwtõXÇšùÆ|÷ 7í
U†(€¿Aö‰•ÛKù¹¿ªßwûøçiwB¨,£ŞDåO„Nîù¯ûkä­S‰¥›½ğ62Ö~µââïé>…¼[Iƒ½äd]¾K™% ø¾iOç4ç\J}¾ÏåÊN]
€rFšàüò^«4miô‹GÿFŠ\sPÙ Xæ‰ ’ÏÁ*R¦ŞºçìÛ1šr¨?^ò¥xŸ	9rC	×YëzÀŠ4Oİ:7Ï…2O$¸Ô‘ÓÊ<d%\Æ¢~ÃşsŒ­sØë@Ä~èH˜’¡ÕâÑxÓéOëÕõAnU!N)½Ê•Ã?.’ÓŒê®²†§Yİ–/M”¿àßú½è:Ú¼¯ÓLşıK~^}·4Å}µ%Ô@‰Y¨ö‹¨ˆø²-Xs2šÊ|oöûöÇ Ÿ›v0ÔÑ^ÔgÔ„FS8 ËPgq_é“‘ m†3ŒQ°Xu.ó¯*ªŞênûÇ_',Ó²Ú¹ŞòüCRå&¼~®ä4yåc~;¨¡Âù‹Ñ*-"#’ö•£Qåg"¹XQï €)7/ŞN·ş¡×&šY^Ç›ã‘¹-Ácy¢ÛûY‘—=Soö¼eE
ş·7G¨†'¹v8|ÊÔ]VÜi¨xÇ‡..”Âî	ª ë«l)ºWê½12>“|u#sˆÌŒ—hÓİÚ!~[s|¸ˆb€ ÒñvÃ¾ª`ÁÏ#wÉº	¾\°„¢\ï	Îf²P»
iL<u	h8¿üì	íêf¢ó`mrb*Ñ…˜½å¶Ü`Öô}ÁğÅDøè7ƒX	³ØÕ*ñø³Td:úåLºKÔ­e‘!ÚIY'íÈ\ÿ
İ¾DÊØe8ùyeWVáAÃîrş'd3»@BÂ_vá¦%y5ø-¤ôµ‰)*Z¥bQ6[O¬·—ª-’f™¦½;¥!+k„Ô¼li_B`TóŠ@ºów³‡¦ĞªXœ_^c†‹Â/Õš$&L&£gv«©¢Zv’3„bõé¿_]ı=‰Á%â÷,ÃûAHonÏÀß¶=OVíMP‡ôfÔ„"Bã!^D
qæTã–»x­pô±3vc‡>±°Á#Á/Dì÷|S4~|y²$ƒùjY%”âåi)Íû¶o¦`­xü(ˆpİ6
C)Ş“#$é&‰à«ºùHWßÏ–\­û>ÍL…*ÎGÜ–Ö¡áİ¶D:Nq]BºúEí«ç±°¾½‡ wÄ>·ƒ°HA7‰	Ág,ÍÜ™’o^üÇŸr@ûİÙFX{ƒâØVÓDÄuhù™0Í§]ãÎ–ğzÚ0BØ®‚ég¼¤iF‰ûtÎ;„ôk˜xZGıŞ¤–cW™G)_˜RÓ¡IİjÒ¯şlíÆ¸?ıËŠ|wœÓ­:;è$™{ïí¹’à‹Õw)ë;k U_¦4Ê”émÕ¥7û ßû8	&o'¦ë@eãi÷•'¦cîH-~êW‰]Ña%4IpR	?Aró¦>“(âT×~Èb]üş^¹o
¨J[iŒ\~ÜU°­@P¬iIƒÜ²fWæiÜVûSG5W³ÇéZj½wr®2—iÖË¥9W†|ä¹
õYçh‰üî÷³	N:`!Œï`±ºtÛûöæ‹ÊÅ.³)ã›rJëQÓ=è­ùCEåqĞlš–S×ş°Mƒğô³í*-r†Ò]¯fdâ‰jì}s'…§!Y–l€Ì¥¹êUœå®tmìdŞ±‹GoUÀOT/V¹lÜ”˜†n(æúCµòQŸòe)	çè
D[†V^,>ö¸â½W™ùRÍD,Wv¶ZkA‚‡­µÜì ~öïıƒ÷Vt7¥3œ;¦;ÎÎ¥›O1³ŒÛOy®ôi/ï@,¨¡¹! 	C“¡şsG(-ZÅù:£ °YSåá$b,P² Ò=çØOttúÇˆÃB_ùİßøS ;ü@wXM‹pÑ³±¥XçTb’ÙV¢Ã­àp üêÙÍ- ¤ÍßiÉ³áÿ¦ƒrxï­%)¦ğ~ÜŞ[¯•³XÊ'±°N/UµÒÉlH š*ÍEóë8‡-
2¤ÚAqÜİEşÒ]ØÈI0™Óìn6»òòí'BÍÔñßSV L¯¿ÈÑŠ¢iãá×k}'?V/àà B»Y‘Mv!ŠEGv-‹¹™;aü=QŠKÜSW¦X'…Š|Lë<œ&h=q îÆÍ¥÷÷Ó¬’ıûÁ{¾PZ}lçæ\9Jœ/V!¹,¦—v&WÁ+I±(E'Á¤0d5mXÃ‹T‹õ9oÚ;èæƒ´å¨\³Ñ±²uÜ@J…¬&­õu
O(JrƒüD
íË\ç%~bãï6Kh›|Ãàg]^»¸ »]¡d¾ÉâHD%6¨B[V=¤V†Á‡xzy¶7€­}{kœÅŸ Ã*§³hÀ^@
ÛIŸÙƒ¡oIüªDJ:O«VqT®÷ÏNRdå/äQ¡cØ[n^Âù„§#LoÙ8ÿÌ·şİÎ&_O¦HhÙèHª4ò =yÂ‰]Ô&«òŠCÃÛÖíì,–iÔ„œ1_:0Ø'.À%W§^(gœÆ#v>¥ÍËµ±Oë·yw‚JÙ·0OŞGğ2ÍÄ;fÄà¶rS}ØÌıÊkBÈMÊ%ñIÒÍ}0
vØú¤Fk€^†¥s nÜMáïŒ~·•v~?AóI¸"¢‰{”"£2ÁMy—š8“<£­ÇœKÊ5ÙW¾:’‡®ïëÔ5Ï^r`ifïäèGœoÚmÒ¹p`Qõ&íl­L‹ïCñs@H‚%U82²Âsòa+šrfñÑYÌ7§f_<©¯=(¥ìäİ6UëC.LÃ¥÷3¤	¦b{Z7Öûƒ9Ó8û%Qfá0>>Ûóq³„™•R¿ùU ŸZ6U8U°E]:¹©!]ã½â#ü{Ö½Ï‡/­Pö"k"ùmy¸†9pV„R
½i£e·G~Xc"“Rí<8ëÚÎ7Ta¥ÖÏ(|áêØ†£™øâHŒ^1¾XåU`ªtÙ®Ú—©‹Ğ—7“ì5Y¬2S\Û²Û)¥ŒšK¢â§±=Ò~BƒÇ‰
Z£#”†ošPVåKçµ]² 7O=d˜jJDì¬b–ƒ…YxÂ}ß!ÌoªTÂ)Û?"mõsÑcø¯¢ıÖ'¢~–¢ÄÃd’Í5ï ®ÒÑ[Ãíq»Ã[fœN%Ï“_=~İ}¦°wÙ>`ñÙ¢¶ë4#!/[Á{`%ÚäÂ£
fzœM}ÓÿæDÊ[¨YÁnä&OL¶ò½áX «ˆ§	xbu¿OßÑ79Ì dmvÔ™G­GéxXLoÎO2P]{H{ŠbJ0ñIß¾Ÿ—WY'VöÕKQc*¦Oî#ÛûÒ®‡Şwû²X°„¯b*pDv$Ô#åRkVínEï’­¨Ëqæ=¨õÍ
i–EñôEZï¸§£pÜùjí²ö‹QÍ@aÕ…z ¦Ş‘]°nö=—U¯/SÆµ«u"xšG¦åwrøg%GÑERÅ_Uª¥»¹ éÃ¨3„°Üv¯Z)?óCB*Êî›E—"ÿNceãPhÜ>ˆŒôï6Ì”ÜŠ3¡Õ¡;”ğ@ÛÈ)©
¨Øk…şéôÂóQC û¹Ë¦24¶áS šá¶¥UæäO½£fuE Öşï–]1ğê…ˆoS3Ø›tÙŒc&À“¯÷ö•Äbq 'ö–­Ñ)ˆı±Ÿ‹İ~Ğ¡áTUÉÅMò˜–W*-óÀUD~Q<Õ”Ô‚éõ@uaçÑÙÈ‚š›Êî¶wñÊgƒò—(¸Áo³Yz§¬WöÕÕˆŞØ¶3Ó“ĞGÑ¯ÊwÜò‘5>_)¥Lg"ƒïíe p>üFğGw]I„ˆ¿Hš#«ı,oÌ7*7¯*CˆtRü¸]ÑÉZùÒ^.‹¼Æİ	™ÅŸõky‹ÙPŞdÛÔˆÄ`ç–›¤f²&cûíÉÉ[¤¸7.–oñtœµI1Ì^ù×ÑYl¹
DQôƒà6îî3\ƒıúG¿azEU÷Ü½›P•·´îşXõé¤•ä„ëtZ
Ö\—ûpÍÁÎÄ¸ÆñU}ùçê„E™±÷¤CÑÉU¤Ô²8‚—¨P‡4êï°  ¤i)Z"!oÊó¢ÊTc­é 7Mn?­b×Ğ7a‚9ÀÆAq¡Ëv?c’‚²W	‡\<­XÛÓ¬÷3™Ì$Ã“0¹|ŒiçÜcr›§=‘V·XDÛ—ÓR%FDìT©K‰²ô•óè™WßIş}_oà\€Éù)Xõ=•*2•wİ‘’Ã½ÅVJİ/8•¤³ùÀğ:o$óB‹ªdôÛaÅ56ŸYâ•5Øx8òH_"ŞYB<$pv5éVÑÊ¿;A&h*ÓÆF¡œx´ßİ~,,÷Õ‘ìwBÚûı=ƒ±¢Üü ¤Á•Q@ø¯tv;úŠÉâˆFÉÆÖ·õì¨6Øş0?4ô¿Ó$ŞÓ£S°(Œİ\òõù|ATO"5ùEÓ×<ØUWeëJüxŸV:ê‘JÕ'bõ§[¤´ÁÎá·@7åÓÔ2?½Õ?%åoun:©<õÄº4ñBw»ğœ°Ó{Œ‡±™¹õäúŠîC-K•ÉC˜ôîYßnEÛ5—”F…ğZÚÕtµ[6¯]ùÎÀqî*yGùÕ<¾™õúµ„™%~R—7lTù…ÙZ0I}ËŠ†Î²M9Ÿr„~,apã0r¦Bš€ó$İÇ“¦öÊ1£f9tÛ¦
 ÏÒ·Üùµ>Ì…aL§ó/D) ”·ë{hÖ‚ËuäB}käû$ÀP€è»ağ%R—û•C®¡šŠOâm_\’ˆƒÆXµÔ(²äAw‚¤fæ›ëœıÓ¾Çä]-CíÕ»ŠV"R¾iÙ«ÇræÏ·­zJHş‚âòØÎ"·ÙÚZ‹ãv«³²1ª	âÏœÈCU‘(·¾ıCh¤Ã©ÊÒ¶^: ¶İQˆ8æbF&³¾<‡µjöÖ]9)•9à,ûw?û7ÿ©çi„;?C(
•+ëacCóeÁv€¯ó²y3õ*Û¾®£Y/\s¾ÉD½vóË--çx”k¸Sn™ÿ­šfŒo~†“v#Ùİ«¿‡$
ü`y_K=0E´'…ä5Şw‘'wÛ‘
¦5j¿%çø•§«ÙVR' 2À#6?5-Ù`Ãúq•éÏ‰`ØˆµÕ¸«”<seªîÌDøø4ûEËï#yƒmK ÄBAì:½wY‰>®Ñ_„k{¤oDpô˜aôIì£ßŸfQŒôı7üº-…’z·ëêLõµr[ƒe¦`ÊyÄ7#ĞÒÂ·Ó@“4§ôû{š¥6s[TEPI³|Ì©Ô™ÚÇ­ˆS9ú›ÑoNiŸÚ^P¯|–ºóòß:Sğí˜é‰µ¨;‰è	x¦\ØÚO×¤ÜQ©}u9=‘mUÌÆqµÂßV˜}{ëïsëGê³*ÄÏøõ¢’4D!B½Nõè/S`3ÎãG1ÆàˆH;>ÈÍnÅĞ0-BZ:gÀŠÜûÆ¿ìùùRy>XL«4¾A—ßÛòKª'Ïä¹ÚˆMS¥*ü œ¸lp’Vígø‚ñF‰ÿsXßÀNtú4¥ÑŠPôÚX½™-£¯§$%›s…­Ø>ÓöÌ×öç¨…•Gı(ìg A¦¸iı˜»Sìj—á=¸¦»téíÃ§ÁÎãÔv­¨u¼’jñ¡·<OÖA3±†IO( nNoùÚaøF:@>#ú“†p³–9Ì¶<Eşû0ô’“‹Š@v(¶±oœÇ`Š´ôT!7oàÕÏÄ¼²/zõµHÅBÍvË\‹U$¶©Œ
7/ïØÄ7­9÷ÚDûŒ…MJ,ŒuŸRîÜbxªË}ë#g÷c•Şóaİ>Õ´³ªƒ–lU‘.¼iQòa7+P€µ}é0‘ÊŞá~T|F†ôW¥"€™­%¹IÔı¢’ã÷aöšÂ1Š+Ï½êaù6¿Ã–2k‡¨“EE±Ò/=>ÖÏş±D »+#f(ŠÎƒÀ\åÓ}ËcÎz {’ş“ánk§ó}Ú#/‘Ç³u/“Ïé`³\W-×xk+uô·ƒÅÇêµá4 ïıÎø]®zv.0íÎN)½äQN–ôYÄx%nDÍÈÇ_Ç‡¯“åˆ‡¢6Ñ1ÄáT˜}RBĞ¸ß26šeñ+î8
ˆN¥QY,#^
nëT,dìX¨e&ä+ºlüïe›Íbà8ĞH|I«Fv¢I+¿uJ"±€âÉb%âE¯¤)$ 7s%µnìËÅ¡>r¡²Ô€Æ`ÊÃì _ùJû",U=Ràl	
¬Úu	Ø:ü÷–nCÕe«µø—ÿw	Z8pÔ‡¿e\îæòª^NÌÀÄö_#µ»¡ğ%İ˜PÃ_Rw•D¯Sşã¾\ %‡6õ–§ÛèıÆnk‰µèÌÌÁƒªd9£	kÄ†±ü,–[¾º¦&q{W7¢3ïœ€æõîÜ›ï]oß: ÔítŠb¢ØˆöeÀ±ejlb•çXìÌ¢²¿ş†2'÷ÇWD‰~§ì Â%ôÓ–ôçÁåQòr—ô¤4ĞsnõZ,Û1Æ¸Á+lfjĞ%n»é‡-²ë%Ò†¾²ZûsÜ—'ïO3Ó@UñÊ¾ÕGzxÈ$7pó=kD<56ã‡=˜ ZGf»Z$*HÊ¬”†-x>¹¤ùÊÉ…å {'öîiÃ’äôäSåpó[z:m÷­S"ù·'¬HE«‡l0TáJ§:øÁa¶#¾ŒÃÁA?‘^m\˜[w{”Qš²›ÆöôûÁ¼®Øi¿»ô6ñ^^Ç´³î=îŸºšS%°µÙ„ôşÖYÁ¿t5> ò~‘çÃñÓzM:Íê“>ÊD¶(h3#M€X*àğı±}ê¤–³cç±ÅKW+KÃë;Û…J/-Ë<,pVq¶ª»–o¨²¯åK×p#&`mïHÙsv&‚ŒJFĞË®µİd{,Ü}„ûYs²k÷E‡,„‘9ØÀ± …qM)ìË–ÏU<—|hÊ=÷«zÿŒ ›šOØ€æ8¥Hœ`VNÈnµwÉwûfœş6Kùzo¬U4vÇó¢ø±°	tT)©ÁU‡üà”jKİéİè•Ô™n"8âä²=Ç¹>q
:¹ õ€÷ä(?·°~˜hTé
-È—Õ_ùÖ€İ-B~ùş™Îƒ¿P5 ‡Xå³ZrùiĞ›şÍ‰h%7¬lZ
ŸAºŒŸ(EFz’1[‡üS'æ‘0ß1:¤ˆ]Ö¦”‚ ƒvå×„j¬ÆÌ)w”Ÿa¡!ù©¿Yè ­‚·qÃ?x€Â]}Q¾ã"ó@Uë‘\$úøj‘…‰aZ^¿½âÂ<‘Ïø1ÒätÁ¥˜ß7-šÒ‚¶‰iômh8Êˆ’õ‰™HÂ³Ê•¨QWù©×—°&DÎ)1¸\F»ş‡à§›P,9ö*Éçä%`øÌz×ä>Îˆú‰}¶öùEa9ŒtaöÚ®»Rã|]'^Ñ'RB•’3ÙJ!÷™¹FQ3¹&Ü!\¿ƒ@Û[ĞÆ¥Z*ø¹hUÆ€pÈ,g=R †µÉ¿.ó´©Ïl0lİr¦º{©µÖFŞ4Ö„äÙ5.¼ŠÁÛ5Î<½¤”Œa¤K_X+ù34úĞ)¶ôıÔA?º1Í'ªèÂBË=B›ÖeTOü©-e… üE9m+-^Ñ~E³y•¢×rkÖÆ@ü²KXA±÷yµHŠàa1çºu± nÒBšK¶GAm*LÎ#
T–¿X´]#û®Q¿1›¯¤.£Øê1Sf%ÅïÓ˜*¥)Sû7¿kÆ­.½L":çaİHII4Œñƒ÷{.³f†¶öÀPrhî[ÑeÎ„_o4t5¿ƒØªm„ÛmU,;RUœkØäµ]zjY’AŒ@{/;P™¨P(e)tçİ:1Ü/Ö“@ÜÇ±bS#>svìß/· ¨yú×ÂøaømµRé~9³ÀZ8ŸI¦ÅŠ¶ŞZŞàpv§RÍŠ\b¾@‘!¨â}“Óf½ÌõøM%$£Ì‰o¨†§ä|7½¼3Û›# åËøĞ»Yp-ƒ¬½&§»ôıxÑ/r2„Íåò³ùbx›¥!tH“ö[mqú;Í÷@{…À‡u¯•*âJÖ®ÔƒœPU05†˜†@å°)}¸5éÛ¬)}Í#9y9Ÿ¼o‡._ÏyØŸ¬Ú^¹}Kº…1¼ÿ«ê¥K5á-»áµÃ{o—2K(43€eš¦?O!¬&>²¦¶şşmC_¼Ï*íMÔêDâµm©•çÒ¥n¦]ô‰1RÌÆ´ÈÒülü…êyU#›ğõ½®S1ØZš´ªĞâÈi»/t±ZáÒEwEÒ“5ş¾;p8–%½\Óx\VÓW_Â›úõ³C$ğÃtrrƒt	9g"y¿È/)ß™[fæ¶0àÂO›¨ıø…õBJ•¢k\`?ô³Zd’»ºƒI6kdRãÍ§œÏÓM¡³ÔC|'ĞºF«{Áß <k r®¿ ›wåœFÔ=œüõ§é”áa÷×•®šˆB€(³ÓĞ†º`ïh”oáÚ€ï@”ŒÙ÷üã‚ÁŠt2›‘{»Øæ	sÑÿ*®CÏ ¼ªÂ¹:Ÿ&á¬$%.6Ğàn|“qWí£^r™é¦kúêY
uj½ùpİÇÍÍÛnù÷õ™°Sbs¸\ûÛ ¦¿	z=şY[^jW]KvõÇ
‹Ö"ÕŞä2ıpÍÕúÂóåRmÜ4ézÅ—•›v“khÿ¬.\/YİÌÃ¼Ï—_ÅĞ³*Hô±J—V
;òÑ*ïnDªÓ‰Q˜nµçóJS>˜¡ŠP×k€)Ë‚?ÎÃ@zh*D@êùfèÂ_ñUr@Kxáühú¹m-#2„Êfh¯‚'M“ß¿ÈÖŞ÷³Û¿ï’'«*¡2^Táë¬·4ä„°œÏjä=öØÈ[9Œ<¢–R`Pká§OU*õ¢'p˜ÊBI Å­ÄÄÀºÔ:ŸzŠ®ó“ÀyŒ–®ŸÃıêqXZM¡j¸ÑÃ­/İÀÖÛ]ÆmJr*ÉeÔH+òoqxòú<œNŞ‹’¾Ü¥³Ï>¿´†¦/şF* P€-,Êñ…ˆûİd}‰ô‹Ÿß0‚R0"Rû€Yô¹DÏhŞ€77
îˆ_ò<eáÍt»Ş¸ÍûÃ"Ü_Ò1 ¢O£ ÕÅ”ëÃ”#Cñû¼şc5rÚHÅ{÷}…ê96ç	©ÀÜcÓ.B¤ªrO	.¢HË²—#[JÃ¬ÀÍ¸Fœ>™°¯¥s2°à{5ÛpiˆÅ÷ò°ıåÔy;*	¯0Ä/]	ÆA¢…$4«íàÙ…³@ ËV³“ÖsÈD%ebŸ ãïgæŒ3Å…/Iñ
ïë'‚ÃÛLÍšPönÕîÁVØâY¹¹E0ßfAÔağ_Ö´~NZ5şö¹¬Å¯‹D<æó#æuƒ®!ñj`’€#qm22ÿT)õÎ
™/~y“\øˆ©İ™Í·»¼gjßŒzÚÉÙÄ5	”‘éˆP€şm“¨›1ï­çzÏğyèµáá+€¿‘…’2ı²\YôF²Ïpğ‰Ÿì¨ üB~ÈÔf~¡¾CW[1Bûı¨o‘j^dú=æ:ß=!G´ÔvøÆ$Ø´âaš™·®„a›bG^Vy˜ò¾…À4Üı„ñnXpÛ;óF=÷ ş	oVz§b=6ÊüÁıÈ¦3ó=ìj],t¦%A÷È,!«%­ãÁŞŸyÒ±öİ…]ÿí1oXšÂ4ES‹ŠP€ç[ÚC¿|<!w“ˆ^0oÑWĞÕ©X7É›-7³ÒKFºI–[e7«ÌP™ÔFê¡8ÉTôÆ:¹Ÿc‡Áa·««Ôƒ…D1õü²&E2\ ¤è4_6‡‡_¼Áâê#÷?8—F;¢Ê,èz†³ó[@:?Jób°G—Oïhölä‘ÛXÜæTDCzÒ£•áæéğÙ—¬ "Eğz‘7åè˜UÃ›eÄfu«ƒ¹¯A½öûzhoF´B&ô¶RûEß-Ÿ³G±;ıË‰¬stZ¡ÖCC•ì¦ĞcULmc—Ç- •1“cU›@«C´—F~f`èL¢y9ƒ,íã”ş÷62Šâ—íÑScí0‚s [‚Ñ´d¤K‰lrd©.’Š¿ÏC%y§Qù5ØX-úóè ÖÀª÷NÁ½£z´%!0Uƒ¿ÆdWÖ
8ØòQã´:71º(×;"°XÍÿ¯³¹‡'Ü·"MõÛzÛß=à;;Ó&
çšd›ª°ÂhfqÄZQîíè,1oÓ²¾ŞÚÔ~VŒÇmÀì€n›ş¹Xã_`E^õMiºH³¿ÍºÂfSZ CEûÈÎæÀ ß›zeJ¾j4ÎÉ+ètßevÕğîA:•8>‰*¢Õ@¶µx]µH/‰”d>¶®Ëxëa…¿_E>`kÓî‡¥
(VXŸ®„]<±?Ì®Ì˜µ oÇæ}T¾y¨Hîšæ–Aóä•„S"ø¸<@m‰Mˆº„6“Ğ-G¸z‚	|{"tù1€Í>yÃ—IHøDÄ e¨^òùÍ÷åÜ°G¿Áv‚^>ó>ø¤Â,aX"ï'yÎİ­Yf{X¦S†ÒÌ_êÂ›Oasò!ÎŞ–0ê¹WFëq²$XûJÚñ÷Â,Œ‘şµ&è²Â%Â#qÉ`ã––tiAu`m·‹n, 2J"ìaÅ“¨>ß_‹Š)°°#é¡·_|X¼†ò‡‰øÇŸ¾ß­7&é¡c“	SCñ<M…´…å Îâ£’j2+¨_nÚ¨7b`¢
"ÀögI©l{ï$åÿ­¨[ÍËÉ¸òÇ¹Á$WàÜŒ	­dTª €Ò¯‚¦Ê{ÜJ€1=[]¯x#OIa¬ÕÆ«ú	8K«-RùÀ6¿Ş @¢_ølŞ1î-ˆ³_Ø©Û‰ãiÎİ¿l&Ì~¿(†G„è~vó>¿#è­Ó‡1¬t#L9}hœc`:Ã_:½A¦'&ögkëzc^“|¸{.h8‡¸;û[ü´LÕ®Ãn~á¹¬]İÆ}ÄzÁ*(¨Í'ãÈgÜÓ`Oªø”ÛÖ)µ6Í(ñ²püw¾²vª’Ça]ˆ$4ãÁpß©‰İ)·JœÎŸ, R³Å Š !j¸,À€5¶Tüq¢{íÎº*(=T|ûµƒ€KºBÌWt Å 4ğÔËw“Û€ãLåX¡šáŸã‚ ÉêÖ×âJœtŸáCä£k¸:æŸmhC %3”H[S¹ˆqÅ¦mbä¼ˆ$g%>¸Â.„U,*ˆf,áLÃŞÎ}ÅG[·€Ş?±¢4A`&A‘UûËB’ŒX:²%+Ô#m	æ'¦ãïS‘ˆçÒ"İ".¬´ºÖ‚•óT‚ôÌ\™F7Š‰a»Hlz „n÷Ë„Š;®Ô×ùàÙ	i6@qœÓùCEÛÌv á/.Q”ÊììYÏ0ºï;±\0ª§¥:Aôæußn±AeÕ+íÏ?ƒ6”Z+Ë°œZ[FÇ¬5%úf;gòí®»kisò©•d ~§7’´‘E—9–íjØ9_“ÅhšGÉÖ&Y¢!ÇÏô+/%v>‚ _ãpRò‰ı*?>šõÈã3"ç…œÆ{ŞJ*”¼0 ß‚=â–[¼ìæs€[]™÷ã³dc1[m]1Øá6„º÷ûğb1œZ¬—Æó;D—s®N4R«Ò“X ?¿3½Æ^®ÑV\SF9g~¬fÂ}f'\Ë8ØG¹+ú‰AcÌˆ°Íh×¯à«ôû 	Kå’(0æ|(.T—&Æ¸„jb"es-€²ğŒ{¨G1HÙ¢{F{æÔ¶lo3ò…Ÿ¢ö!Ïq‹Á5MıĞV»@Ã¹V_t:ÚãïZ˜ö³‹W˜Ås-ìÃ¾g\„e,’Ko›7ˆÃ´‰‹ÖÊO¢Š8&—¯±$^­ÈÎzÏ¼k*`	ŸòO$ê¶òÆÁY­ÁÙët‹áoäşì7jÌÑñqhºUm©ØƒïxÑàÿî…@ˆï~}Gm:eíç¡şVÓ0³)˜=ø×Ó~}w)‰M2µÛ%{%ÇËÔ‹XÆá(€™Ü¦W¾úPÁ Hğ/+µ0İJhöè(à™Íî€ }¬¡-ƒï‡ãœT±Ğ¦–ÅO=¦Uğ·€y_OÏU‹²·(,MéŠğÎĞ>‚ª8I!y[	"ÄŸ•¢P†u?ÛÁÀ4N+¢NÍŠ€³Lªq½=„UÙ{A°~5&ƒC>ùö*©µ+vÆÕ0™ÍÒ=e <Ğ›¨ß=‡{—_×ZvujTä.nÏ°sLÉ÷9¯L^S‘x+epÖA ‰.|²J`‰-xˆ/„mÄ¼¢ıáQáâóÌöÒÁÕï 4àPÂXçÿ nÁ´ñ³Æ«ŞD¦…Ô½H7Ä÷“„ÑSö§v¤;Œ8âqí§„tYÛP!İ³¨>OBuáçl6D	Iâuü'›XMYué§i”·%²Š_¼²¿‘²Á¹_>¼ñ#—ÏGMg©·)¿ 0|4SX7¶-tX°5+G38Ùc] ã6Ê¸¢A£p-å+s4õ0¨¨üx‡JH&:YÅi½L÷qÇ©ÖöÔÉ.˜­ˆöæÎP®İÚyÿûaú…ÖÂÓ(šIæQ–sƒôI*9lTô«¸è/Œè]}
óÎ_›–'Å‚œnØ=çú°œYbK})M˜ÌĞİæ»ÃîÎ}ÅßJÔŸ(<»Ï±Ğ(© XPá'ì5!ÁJj®nß‘™÷5"ÿ”­É!(¿Å~}P¢–ŒÑ[U“›ï´òÒ	ß[¤Åù¡{3×G¦,‡”6ªØN"4:r«ä*ŒG¨ğn[Ñ›“Z¶‘ã}Ü…–°hª‚ácCy¼Ùv­šŸĞ–ƒ#MMTşì«~+Ü¾{-ĞÖş±Ï%]ŒB`¾«^2‡±'™ yÀ¢¢Á¡õÂyÅÎ(8-¡1Æä«Õ£Î[CïÀ*'ñkÃfÁkfæn$Ï2­g‡¸x~PŠ*Ÿ¦O} Í"‘¹5Uj@×^{¥d,9ñƒ:ip/¼d¿²#!×õcÆ«
=0¢(g@¦²¡ÆòÓ¾Ö10ÁÌ¢-sefù	íetèğ‹ÊÛ‹×xy°ÇÍ¾sÙÇñ–…CUoÎ¾Šœx@½µá:ÍqÎ5ãC²7ÁˆÈË»X¢ŠìÙšßÎ_j?~XT›1Ó®ÿ²ö0î¶Ùu$ÀræìS´6ú¶äˆ¤VämÉÀ@´Oªö26˜Û'ªW.IÌw‹3ì^½>ÅÒCÓÓ
ÇSHóÃiÂ.U$¹p¬Z2äqé5lr¸Öƒ§¯òB“@z®6#%fLå´ßÅ¬Œ‰¥Ûqiâz2ì4Ã*ï€uŸ è!Ê?¼é.“:`PzŞ‡ˆ;ê^¬©øB¸Ò×Q
Ü˜Pó
,ÃrÛ–A‚,¡şîN0£c<¹+=şøÅ´.”ÚdŠéúwÂÀ¬¾¨ì/@F–Ôç «£$<•îÓ³æ7í¼6ùl3OgZäÊ¥Ë_@üÃ¯/–€iHÑ”¹›	võ%3 Jlïê|•† Ér§‘¹Y6Ï–}İ®!*©•(?p{xEh‚,›ùYşûY¸7'åN¯¨¹PÑAÙf|E	"xw×½ÁÚ„µæ•0ÈSšL0hlèÅkºËq,ÚMV6K§†®"ëûnİè,½©PòY†)±Œ.‚‡¡®å‘#%=şõÏ5ì¿-;›ÛÒö4te>Ìq£Qâ°vj´¹¢Ü Q¬`¬ëİ³¤ùæıwï¶9WÈ³ÀçG§€pdä¾¨xÒURÜ×‡»@YWÊ/uÓî‹På¬Ú}»âÿ.zdÀÔlØ”ÑO"ƒ¸ÖË®!È‹=úQxgK;bQvrôğ#2¿ëöÆpo=gS¹ÕŒYÊŠír—¢1ıPMhã™•6z‘ûIoÉ7ÅrÔŠëmıÇCVgS ä ‘äoç4¼Ì#÷;”ç<š¾xÒæ×¨?÷˜¾Ã—²b­l^(ğ7¨’‰ò¨¡aQ! Õ…ße,º]ÍÈ¯“;”W]82‘+ıYÈÕ)Ih¦ª?÷;T±îR^İ¯ãîèãŞç:ü¥¶Íã™$ÃêëA›3gùe´Bxl Ùû xTAa:ªOyC
‹nC:L<(Éñ"	÷£ÉRÖ„+u÷qÈSäÖ‡ª¨ »B4b7A/)Ï€>hj†ùıäÕù‚FÖ2–[½¥UÑÇ<šİªÿßÓösÈ<|5ñ|&ƒHt3ÂúâŒKğá47];=j$ğ¶×½ıçâÛ~"Ô*<buùƒjÑøÚù$^’Úô#¸¥úµ_6?kÕ5Ü¼¹4(jl€­wƒ D8-\®}„ãóIZ0;^yzµ=¤ş«è™ÈáşšVy+©Ù¨vØÅµõ]Ë5Í)ÂxV]8Ÿ•BJ•ªŠS¢¾Bâ³oÁÚ¡ìµ„»÷ >)İ¢³)e2Ôö'ÈájÈÊ‚Ÿ³DAO:‘@YJåg1Ÿ¬²ìî/$2p¸6°*ÀpÁ¾é½w‡ì¿sz'¸EVÓ´3(¥y›By+«:?qƒJ–óÈ´+š@íïşÓ1‹pÅx/î•ñ¢Ñ‰QªõÜ¿Æ|z´ü¶µo\Ë
1Ú©¹‚ ÎŸwo„à–h—q2ÃÕsõ¹Ÿ¦äÊ?‰û‰÷µ€ã}Å3&/l@2|ØæR2À?/în#3‰iW	í¥<é»"PH<(Hre:2Ó°„Í« GŒÃc}¸n‡€¡ÎÍÛÓ©oVşSR!;TÍ×­yxƒv\a1éáBÕ<VŠ4w*œ²«­¶%Q.·ıÂk4Y€"0rcı¶ö„d¢hZç¾îúÄ…ïİä‹%;*?À5—éL¼åMk¬§øÈ|Ê:æGåÍÜ
’ŠÖÛBäüï:‹²'¤İÈß²â¡Ús‚³Nö-cs#nmÊÍâ/J*Ã¨Œ{‡1n/´…ù ¹•¶~¿SÍ±š‰ÓˆX©òHbgŸ4ğk1äşé”sGÅIÚ7Bbü[a	U©‡Û+™N£¦§¦„É>Œ—ÒWb+„Ny G88g†%§
ë	j¥×èÓ:BË±·zÊÍ¤U>všbú]xOxw8qD6)‚¼T†`3Á1_öjmV|†[7.$ä¶º°7Ş§0UBy6ÈÓßŠNúÆ7HT&·%ÓSkÛ:˜ÇJ>VÜÛûÓJÌ8)ñ%ÛÁº¿·ÒBrE¿%^câÉuòÉé1^ç Ú*èãºNçïÆÂÃóÊj~­ÛÇ`€I¢¦ÔøFoî1G‚Óàm²†0Á³<:ïHZ|m9´›îİª´ÇÎèı"D0Ü<j‘øO=?4¢ w¯<%“ˆ£ÛºåÂ.†‡pß­‘ºÓ{!7íï®[3/ ,Fö‚çö™·İàä³—x†ÉÌ]bRH‘ßGRÎédGæ/³¼eˆã5>R lM ‚qU5=µƒ­°<ÛqÀ½ÿD/û¾—‚ÔÆöZ¤ç8|œ–rˆGD<ªêpö›ïµÌêh"lìäBÃÑ>Çg[‚¡xºÏ„ı
I3°£±LúÄáhòè§gÖ±õ—^ÆÉÕ'Ag´B	‡Èİ	%1í¹sO·L™Ò÷)‰öJäŒöå}$^ ø±@Ù¥ëbEhRE#cUâ_oR^<ÉÓ¦g4÷4zG•T„kÚ8×M†ÀAª×¢ß}0¹	ï¤ú6
§Ló-¸Î¶¹˜ß÷U!DŸÂi¨WÀoâ;{ŸLù­²–ç:aá’ãş~¦ˆÒÖ€9>Ögƒ²k Ï½%Í¬Jìjyô
^ÏÚ#Û".æ¨¥µ­ÔïKf'Rlù_6M©«æ_à2ä‘·“µA("?KO}LDfaÔnxté›NO4Û ÚÇî/!ÃD+>Ì0{dILE:ŞM–_EUÂQ» zş&Åvv4»ãW|ßÙ?wTxÚšEnìPäzhffÏÌÌìÕÿ|EÊ êÄß½çTµš åÆíûĞŠØGÑwäEê6oj7«ÅUÔÅµæ^)põ’ğûJãO />èÌ´Êsİ9ñT5>º_<¸İü¬ŠPY?-Â‡ò•52Ğ’$2åÉ†sÏé§ÿH¢<MdçF5îg4@Zö\ªz§¡‰¦avmp” 0ŠĞK§káèT 8Õ)Å$n£şŠ±Ê'Piu3
L_®½ª1Aâ¨7Û
^JÂÍ2¹”'£ 8‹³Ğ‚õk€mJÁ%ô\-5Ûç0W¨­¦Y^U»rPœ­x~ÇÚ@–`Í¬y`­}L‹á[Z[å¹\É˜+=/¹ÅF‘c<GÓpáèß_×
–ÆNvNÎÀ‘GÀ˜ıu•&æ@díjhšÑÙ%Ë)FÂNUM1>UU”L,2éy!
–í ¯™‡Kh—ì ô­¨:7¤65/2ıÒê˜`wPŞdÌ.è™­ØÒˆn|ƒ!©LwúÜÎÈî†˜`=Ñ& *t9.;€¤Ò0‰@6·r[¼uZsÊ‰…kn-Y).“Ê¬ó,º®×Nó~Ö÷a)ä_âµÈW¦şƒÑ¹	£a¹T2t‘_„lKæ;ÀÎ!èÊ„Hä95ƒ:02A¾›V¹Ç ÍÃø¼bhÃøeï‘Fğeú.¨×\Ô]'³ÌâŞ]u	;Ù=Ë&r?°„&­Ë–z=I o’ÕºKÛñ["÷Œ$e{	ZÜ§s§ÄARÙk[|›ª¥¦eÉà:W¦P€AbnÁÍÑî-ezÖrê` ó…5™3Ğs‚ÉË7ÖZú’®-Æ
"Q7K•›Ç\/î(eJ¢&ŸŸ'ŠŸûÑ¾Z¦éLKÍyI=5¯.‡»õ4Ö¯]Út	'×œYr˜©o¡£iİí0$à
6d2±¡"íÍ¯p *
ecóp İœª
ˆÑC£jgw>÷ˆª2=ôŠsúvsYû÷rt)ŞğS¸¿ï¦Å•0’Z­ÊçA‰®ô‰Ğ‰±(¤ZA.ûue ;õ(ºX¤ø„ógà¥óeîÉ4/%õ™¨ôë¬‘­ ŒÆ‘Û@1ì\å¢FbûøóÌ9Lş=½'W'â3ï9mÅÇp	*!ûöCØšşÔôÛá@†¬#°Ö ×/ğ>€æ\¦ŒjJUbKœô<d3”§WÔ=IT¹¹F(»ÅÕX>şÕYÄçnºXèKJ/‹Ó;`7±?’€¸…–áu9÷29ğ9Ø¼©ÜŞUWµĞ3Tß¿’GJæâ1ä¬MKšÁ\=Îû,—)‰ É>kÃ¨$_)ä®	B*Ùf"Níª©CëğN‡N©2o¯¸¶"•Ø›šÂ;/	cøpL7lÏ¤°Ä¶¸y¹ååòß"™hGm–öµ¨A¯öö€Ót-‡V wóêeDÊòáÁq„H2ï°ëT|3aß8\áî^Ú’"¨³ux
¨ÑF
uİ$ıb}'¼#¥û¦7“tÇÜJ7¨T•;wc„p™hÊ/‹l”Àô…¬!‰*ÜŒú—ÿa×ôÎû_ü9C¯etÄÚ8!™­©oÇ…i#œµ'‡g\%(°‘£ÍÔ¸G‹¹!¸(åÖãú„­UáÖc£‹¨Oìv0Æ%ÂÎ5#%n
I°Õ¯é±?É¼;Ád°¬tÜr¾s$ß|P-6úBñÅ¶Ù@H&>in•Ój{:>™)†«mk°	¹á¾“¾÷ º²ÑíªÍ-¸6MMqB†Å‡ìÌO¥ÃÙ4È¨,vM’ëƒHÈ^rˆyÆbÔ’åÖ)¦i‰ø˜|Ò‰€"t½`'¹Ã¢š]ôã÷ã22$OcúIÃ9îL·rL'cƒ’T¿³‡ZÁî¡mç›WM#yuGÜ)aUòQW¸šİO€”%W×ºÛ}©ˆÎÜ‘©—¼¾åC·ßFmvyõ¥$¤*¨†UÚhÆÄºHbrıû¹˜%£ètÜÆIšMÄ/‚¨‹†+ïüeY?ÒÅQzw5!™¬dIkàµ —è¯œ<GX±gEßéoˆêè§k“ã¢¶…±7“H³ÿğÏŒSHDÅïuo–m~	6œÊó•®ÊRƒZ¨rgbø7—\Á¦iXÛ·=åoéO¡…Ü¥MzGL5?zHà°ù™Í<§eà!œóZ¾ ë~şÖâèÂ=4—s Z¹ê·.6oU¯|h‚D,z;^3Ã(Q†ÔÚ¾SêÔ>5e¤‚9°+#lÛ×X¡®J>+×v¨”t8ÙÇjéD’âàwÖMÓÓ ô-¥ \Ñ_ÈõjØÃï}¢îªlÜxÙlp:VµäîÚ±×
	vÊÙşzf{A]9éÇòòä•ŒÕ>e)ıÌàR„8|aìùr+û9òíz~“—1Cw0¡ŸI*îGílÖ_ŠF$0»±´|Ğ»%ÑŞIµ|ù±Y0–7F™Ú¯C•ƒZ2«ıı]€ àá:wæ´=mæjËÕ­_Ûşİõy§ ^ëWv[u–0HC¿ÒpaH.x³íÒ“õ´qôA‰–†h„'»ñhª+Ó<92;-/İ®”4‡Nğ£	9×³ñAsìãF\â­[>ÏÍİ~°o44?áä¤Á¿aè/Ù?ÚøÚÃš_ÌİãihÅ¾$ß¸Š·<dŠE'¨›!ş-£Mú ¹u>÷ÉB™˜E#Ï(«v„¥pRb¸>¦k*Z€uQßÅ‹·!€p\PûC­yÓ°ŠùÈ2ëFwÂÑc
1H*ÛDÆ±›p¾“ÛzôÔ•CunK«fT7­W¤îÌë ï7GĞˆ¼Cz™õ»ŒEÚ
ø÷Ç+¬¢|7<ŞîsT”P0%]]Y,?Fë_½éà£úŸ=ö;ësa‘vÍ‚5òG«bç÷z‡º ¡¹KF¥ëıe>åCÄ?cŸì‡0´şOémhwvqb!ŸÄñÓ‡^jŞ]Røº@³»×’=«zŸ[N~´¯Jíš¥y-:r„™TD„İG[ÜoNØ{~lZKÇšéxİ×ñ‡4n›3ùŠëØÂ.5w9×µ½¬Í§õS•oA’Ë„¢+qîAØØm?©³dÑWkÒNX91c6p•TgŸœP·¨noÈ’[«¨¼“acÊOÒöƒYÎGîïdO–_Šúumƒ$¢”èhCX›¿¼Ÿcñ½rAÑ¸å°ûô.ëâ¶òVZjá¥&T+˜ë. ?9J&İ#‚µQGˆ.OÆÃıq:šP1A0›\'¿oØŠXÿ*xŸ³¤gg`øjÄ»¨¨Ø3Ä×â‚ĞNèaÆ’”¹UÑ/À©7ü´bÇ™v=QM7b`¯‰ê›^‹ñf†ÊÍ>âHÿ§KMGN;kÿÑ@•ìˆƒ£¡BšÆÃGy’Ië­Ë©Çò#¯4L»:ù7†Ám²¨
ÂmJ{løyV? }æoìåü›S¾]lG$)­´?‘+í²˜ÔT©Z_	²Ø2!¤÷Õ"=úq:¯£á1®9WFocì:/Y,œd>­rŒ±óÆË¢sËL62'E“%ÒzÚÓ­iÎN4x9’ÈÈcØ ©ÁõJüÉ”¿×‹Šo’óDö§•h8î!x [—İ¿à€ïµ@Ä¡!;lnŸ×·–õ\M/^`ûT5K™KL÷cø½Å“rÉ¨»ıdüòùG ‰0ıñµ…™¸sò©ôÑ—‰ îŒNt•l®ÙŞG¼IÇ¿ÑÅu¤¹0ÑBGîö’èë¨b[Ã”»o¦Ñˆ_òï©/cèÃhñ€	0µñ¾!ö‚5Vd¡¥<GÖê‚8Ğ‡­·exÓ7Jşîò>2àwÀ‰Xâ89¹mó±é(øcƒÊ&)~l^ nt9*RDm8­³<i³ıñç,‰“|j§lğ<ıÎèTÓ‚ùLó(J¹)®)Ãê§;ëµMágêt`› ÏÿöSª]Â'g¨£SJá>ò·˜AÈ “ü$Jßzîõg
ì´çCD©½º>ôPA(‚°‡¢j•‚ƒåŒ8Ã?ƒ‹z—f2¸uËGE÷˜ÎE$öïËG½ë†Òª±niqŒfº`¶Á4-f}Î5
ñúÀ²eÏN/ÒØRùñ±ùe–A	¬L$ÛB°…còFPçæjag+ÈólòÈ`U\Ê¨¢UWcñœùî„©½»Ç’„Øä­ŞøS¹]bÿù«×ÍO¯L|©ƒ½¥²Ó}-Ğúƒ‘Ğïö0ÉĞlœA­øö ßQ‡Ñ\T©vFÂ3³Ã}ü"ÒÙ
äø´n`Š¥ĞZÃëñ@Ò¼Lô‚ßdÍš9ò¿}Û‹+ÿ¤ÂkæÖQˆóóÃúI×ß°¬.u³øænQêĞaÆèy"îş~æT’¶lİ@öçA.×ËmŞ1?éQì•}‰9º–2„s˜0ø¥¬z·QÂ²âyOƒJ‡9í.ñ9íé²zßˆV¯ò7.\uTBéc@[Õ9Ä¢@ÚkÆ`½sşÒ.~û=»c‰<‹VnØKÎhE»J‹|àKÈB\ÕJ†n`*_•¦`át¯PJ ‚£üÈ¦¨×Îq[ûÁºÑ#9á°“A+uı½ĞÂ$OR‡°ÂûBÊ’+}l|¿7¹hÙ¢ÚÑ3¨]×‰‹gÅx’²8ĞCŸë³³™t¬B»×÷E5·œéPÎ6ïéiZ5cî«*”Q-AFh!SR€y$ID$Û¼~^<ëoo¸ÍV,J!¼Êÿµ­äÚ¿8d"ÚéÎ*©50g›„Tùc|¶‹Q`–Â{õ„v™?”>bÎë¹Ä¼çÇø7mş{S!E`q ëê{RÍ÷¾&6Œú«LÃÿRÕæÑuS…&iÊC2}³}œlEc½¹å?°à+‡^õ˜X­¬}¼H†ø*—öÿz
;;xÁ­.ˆ±û(/n8ì Ãé¬°Ò‰à½QòƒzXnkµÚéû+`Ş·3hô\8º¢>uA„!Óg³³ˆÜu°²„ş˜>æ	»4í^njW-:c>¬² P…xÆ=gœçtú\MÊğØ¦?‰‘ÃÑ…hRùCC1öXF3Ù‡™·øuæ]öb2uyŞ.ô÷/+.s ÚörºßÑ©(1t‘æÌe¨ŞTà	ğŸ˜a¥õQZE.-_k.ßõS†eı4Q­ÇÕ5H½´ù[ş¹0ˆşºöĞQÒ,w´Õ*¦oÿ-ğğÂØ&ÏE¬ı2”êUÅÇ¶#ôí§Ÿ	ßq¿bøÖÓ—¶ıÁë“–c<Ò§êóT<Ay]C…ß ¼YV C}ĞNÏP×d½ôASØ`\lmÏc>Š³M£n.ÉèGSĞ§oŸp‚hLeñÇEŸóßğškÈûtSy®yo¬ğ®œ7ª}:‹>ıÃÔ:ƒu®)¦ËË°1RsDÅ—±¸!ú;É°°}A“Å—6®ğ)´R«/óCRsÄédÿ»[pÌÕ*˜‡¦‘©Hßï8§Ñ2"¬ “)³iÓ5=káÏ¤„í7Ã›0}i‡Áİ--Ğ?ñö>nÏf![¾9h×¡Ã‹ù®ÅŒ:ñWü«*ÏM ûR{ô{ı¸I#‚¯7XmúĞLßäM¸HW?‡÷ãÔ§Ë;ˆÅŸ„ ¦ÃìõSë!±l_oõ×¾tì5|”r¤/]*å8]¬UEÌÁ§ìß•HE5I©ë¥t=hÕLTŸaÍ™+İ8¿]ú»<_ßìÍÕÖ´™@5¶§¬¬ïÅÖ¶×†ux[‰'¤a²ØòúYÿÖÒş‰òÓI„òù/..”C’v[Óë4ˆæÅï®Kİ-k˜C™ÿ“²+äQ~Ÿ)8QÿƒÎ¾Ásìå÷4Zu¤ó”í…jŞN£>p;ÅIÄğ(o¼à\µ'è•¿Õ®¸1åù@ŞUô$f&Í:Çè çŸ&#Û»ŞïJvÚ]¿¥ûØ[åÕNz‰1z~·û}Şğœ¦vÚo¦Pf
J†:|&Ë—Ç33YÖfIcã/+LŒ"uÀ{V¨ /¯ínŸs„œhÊ´4Æ’Û(W£è#°çÚíXP…æu±F¬Õô¯É:ş¸íÁŞB‰sIŸZkÓ?Ó|øÒõ-›á?»cø¤ à§ÿåàárŞnÜĞÒÇŒĞt±¾cùÛ4H	äMy•şØ|ÇÉk’£	TMYßQ=HàÍY¿áõW+ı,ƒêu|iï½H¡sÃcÄ4›ª Ómpâğùèc!¿¹f0xLòşr¤ëSÂVu(µšuä@Åì»Œ~çOš™B¦ŸQê¾GŞXïÈ×8¦q%èi÷»ÛúoÛt+h4
¸ÃJÀ#I¿œÊ7K‘ì‰HmÑµ¹Z¹Ux9^¹ƒS­"
ìÒ=ßÊˆ×6#]…´_ûó6ÏÏæ¤ZİÂ~¥¢;¶ùóûëBÔÓ(­‡á£A{Q‰0ã
Å9ê€âMqÚ‡3.‡ö×ú,X‹ığ…NÎûÄ¨›º@“V^„BŸ*Ï”Ïrd¬¶²q›Áÿw‘‹û”fW0êmOõ¾ZHlroŞ{Ê_
@éûİÈInÀ¢ûkº)m×Ì”âpË‚k4dªv)à~æ‰LÅ³vî¯,ıgyiUA£yBèŒÈS4Ø¶‘°í3‡êår™²’M­}êuRT%.5gÔs-9ÀIsM¶}»=U»^êX˜»JËÒ&iqÀ64-ÈÍO¯ª¯]Ï0â¼7Ù]À­VæËĞ¨õNóŞş\¾!ì=¶ŒÂoÒñ%è˜m³åï·Õ 	Y_éV÷C²uÑlÁbÊ—?ôÔ}[³ÕÛ§1ñ‰ôE«™Äl4’õáfÊIB”5#’¿øÃN1A‹aü™ä­³Õ®Az	yRå÷Å•‰à-÷ùB‹´z{Et¿¸UyŸáİ ı775àRíns!°¹’’R,ÂNLôé"å¸0(=¸‡ˆŒØL"ç!¬{Êë¬´şŠŞñ—ÅJtç!l—†ØOõëÀcò@9ùÖõè·¿Iæá	ÖŸèkP$ªOr{½KÀ¼É"8ná9å±¤ù{8¿"Á²/MÖ—ôÖ™ŸO©O¦s3°ÌHé?gñyZæÖb“ÁŠ¥.Q’	'¨¦Ï<¥vã‰eÿîSé„ØGd€À yŸ®|šmd'ğaıxá†ŠÇ¶ë9§==.zÛr¶ôN	½5ÓäüÁÜ˜n™-ë¦µıßÿŸÔûƒÈøøâœsaf¬=ywô”ğÊóbÙ+zAa5òû˜û*Äx÷_¤;F„(Ğ:´¸WôÖ­,ZÉˆô.Û\6ã"İª•Â§Bµ•Â×lÛPZîv.ûÚ Šo÷§°FÈÀ¯<Ä
`©F›º/¾Î¿ûèàdH* ùÏ‰'îó®6İAµiF ıs?ÅHÄï0mái^ÈÂÇŠ#}Î4æåœg—{T€!'ÖÒÒ|Õ×Éeë?Õ›£Üs3Q0lŒ{[IFî0‘µ²×ÈŠCâ$~ãb´Ü¸çµø ,}r83=@cwİZ¸K­Ë½TîêDaÓóğZLò¯/Å°8±ilä©«¿=ıCUÄ	ÈÇ:	‹°ìø€±MyJ€6é±ÃÏ<F.Ñsæ‰Î`Ç¥Š—¾¥Zm!‡…1ş¹í¼§IìşèQU Ç¿>«€Z_çÃ£ÁãC´~d®#'éYÜ·Näå£Ò•çiÄºUƒe–wüñ*¡<?¾¼XvZ±™½†ĞGlPç6-mi pÂ¹ú0'"…İŞ¶¯A¼“˜Ã¡ı•—ye£¾àÂˆt=*6ü$Í3½îÏ á&g2şRá#ŒP³øqÎĞ·õ/µšsbÓ5,—/QÈæÊªö`ÿ4ĞĞ“küï­P†në˜ ÃÕZ#š¥BÂ"KË/{»	Tg{ì¡ym«urÕR±8şàdWİ"YFïX­ù•Ÿ}ø2û´Löìéwßº†Õÿ%méŠhÈÈ ä‹Õ^èVøQB¸ÛK|êöf·"¶¢ŸCÇRƒ~ŸPzOÛ—™ì~’Pßš^g±‡õ»ÕÀ:¾@‘'èiÆ7EL‰a²óX*üõáY*¡õ–§YÆ6Aê0õúµ’„G«Fj„£\KâååÓ{Ä’J#µ˜O[1 *K(37æ¡²tDÆdH„‹âò¡Ô×ó³äC‘U¹—YÑi‚k«û‹WLúË
†×-G@ÕÇAÛIdº]A[WãÀÉY‘ğ¶l»…¶V‰[ãÜB"â´ñ*:ÛçBİ¯í£Øüá¥ ÉâO`™{mu˜\X`û¢¸é÷üÏ~¿²áÕİnó2N”_Ì*ï4#í¤¦QÔölÚÊ^=ëûúùùf6¬‚s¦°åÇW£8qìí”¹|Xˆ	§˜/Œ­&Û	Šäi§¢z>½Oñ±²È/Å¥Å„Ìñ¤}Da”L+­d%Š¶ìQòÓ9-ëFãE·mÚím`òÔôÅÜ?PBàç4ç-ï„–!º»iö6“ßµ`^Ÿ]$7¶Ş)ç¹A¼g¿zË2{Û/õï“6_î'%İó’ÇLrÀBü¡o÷®Œø›¹ôJ‰f­?A©‡ÂaîÌb¡îôÌ'u}¦ÉÎËuq[ü‘‡¸yqkàÖ£ÓHûˆcó
í˜“iE¨81¸ÒÂß+¾'!àñáë¤ş®17€Xİù=µóa2ş8a%Oõ/8ì·öy!eöÜ{ü‡sb÷b¼›r-9SìŒdEcùoè‹ã.İWÏPàÅ_«°°XÆkŒz“{ÜÅ¬°ñóövïø@É…œéÙ ~´5ø‡zÓîô7Ÿ]rz:nPN„:IÖ«DD¿şØ‰>—¨™Ä€“ãaóV6…r­­„¯¥,êÜL/.„ãK¢]¨Uõ QwÖ3@ôŠ9ci•hşŒ?	_eQ/ıs=†[\b²–CPø#˜\i)Àm€ÿ²Bàï4:¥¢{ˆÄCNš "ã—;îÛı‰vŸß`ÚjPÅšûÎ4hQ’aä²8«äaaKÇÎ|0jüDg¤'^X?¤'&]†âƒ¨)úSÚà©?şª')ªŸ•Cwµb×r @¨
cnl*ş&ò½q™/”›¤‹ß‘MÄRÃáZn^d½Ê¼n$zËË¸=Ò©¨½ÁéÁñ¡î~~ŒÂMÄ¦Å‰Æ­?J~&ÈƒÁŒh$yj²Íh ºy{	bÅ*€Ätøö|ùDiPª¸’.&ã'Sëïoß˜à­cv¢:xgÎ0~ ÚİĞÄÚcçÑ«×s®ÀiP~‹É—¼ÎZx3K}Èœv­gÜ¿p³Á*é*Ñ€øÙQH‹6LŸ„ÏJI>ÌMüš¦UAVçråı,£Nk‹‹F›ÓîùÔ¤iÂEã?W‘)ªTõ‹9áGÄ3tßŞÉì`¬å^ùÅÎÆú³² ÙT{ÖcKTzz’>.\v\‘ôæ5)	ãÑÂ€Í-‡SİŠÿzyQÙoö‰|\›—æIŒÏóî6ÅuQ*(ñöûšz"å ˜è»Ô8D(ÆÃ_öou‘‚ÔÃ‰%óM.Šéf€m[eê ¢vŸ`ÂûM×FïiÕ¾ş°Xøo–`^bÃ¾Ğ¹Mc„%,‹™¹…rp‘Ìü"~?êPÃ—œËt²íÎÕ%ÉåäFy‘IâÙKÉf„?`²¹ŞØÛñoÑH&?Æ£&úÈéæX1ğÛP£vcb¹öğ!Hj‰Eb›ÏêO4Êqıç†e&~üD2¤áëãlá’‚/ê5Ï•—î%ØDRûó«OF†•ºÕ¯¾CbÚøË˜`­œù56Ñ9Öüg=öõN]ÚB¨à¡Î‹¨ƒñpŒÜÂ5æ±!7dÎÈ¢üXğÅX™´AÂU À,j—ı§¥ªlrõ(-Š6‹lcÂZ_h£5Ä]q,yÇ@pw ¾>d™çÈp»-Û"tcH\ÁpÎ±[åcíH›ã 0« gyuª%Á²©º',óaWMâÏ…É@#§„ÓÆM1«l 5»Ï=¡úÃhI¶£Næˆ;ö}ö;loë¯e :`-Ñ™|ˆ~6êÇ¦*åDt®”CãAÏ•e9÷nâŞy¼“hô%Ø¡Î˜B9¥ÍŠÌÂIï×‚?€îğÑÛšã)µnb…“ª¦å-ÖÂ*ÙËş¼0ğ—Àıß¾ÈSFZá”è‹„
[­t¡ˆˆíÙäğ¯û{DïÛïO9ËşòVŠS/êôĞêÎÎÑCú}8í õ,çª©5ıóĞo¬	U†=_i×oœÇ5X2Ó=ThÉÊPÅ¢°|¡ÒÕóŸ@ĞîóCì˜îû‹õxĞ}ìiûÍßà‚)gÛkäCÊ—:†¡®¨§tÈv‹j38mQ`ÔS¾É-}&6«ëîÚ…2ûÊtéüÓµíb´	ãÍ’öÉÏÈ#¤aˆïde=.ò>:ÒNoé½Štƒ:$©B±“;,VÛò-)'ûO€ŞË½~
¹™Îw·D×ª®S¿S§7%«¾Ïèp]C Aª—Ò·†«ÃŠ4“ÉİšI?(pBı—d‡i¯S2¤zigÛ€Ğ?î“¿f_yX‹¦¤QI¢é<]@R§_)Ëwò=ı#ï-å
YŸÏ/ O"/`™ZÅ",W3tÀHÌ¨Ã,ù:k#ªíK›Ûq*ø?,ï"ùâ¨Tô¡Â-õ“¸p>’Êárä'sR¥s]ß¥ÍÃğKPYû;#ÒÄ&ŠÉeàœk–->TíHê²ı†±ğpò!muú,›Øãû4Î‰&‚–½nÙKğ$Œ¢ÖP9ŸËABo ÄHÙ{>oÒ±Y­ñc_B ˆ}‹üAœ›Ô6¯¯JÆ7ŠEêy‘@Îı'6D•Ç4µÂ;5¯ádÍV‚<´Økª³ó‚2%úZ—MÏŠÄãkâ×U~1ƒË–ù§Õ“„«¤„óÄ—\>²üíD ¥>§ˆTËõÅîÙ1•òr¹k4éËQ`®¹ŠfQ&lÉã÷Ş¬İ:<Ø¼ƒãÓİÍÅT7%Ù!º*jĞøÎÌò+[O«T³g&[Ñú E¹c£İŒå@3çÏú¸fê"c±@Æ†°!êFO<ÎşçCø-Ëß)º¿6„_·#]¤æ_‹&‰—¾¢ˆ‰aõC r/GWª>¥ïGG”­;joqCu×ª,ÿ,;œ HX4ó'ÖŒ@:Yª‡¶°êkxcd¥bÙ8 Ôb³ßë¬'°­ŸºG¯N"˜4n×3©Ø!#f^ ¿º÷SF±ÉE‰
ûë­d†öH”øß÷ÚöxX^š¨*Œ
§!´p0á„ìõ
-ÁHpë©+wJM'Üzr5™¿½ödøšÛƒ±'õ\ø¥¼ÃklÌÏ¾Ö¼ ö}Ø:´ãI5{¾ZB÷qJab´\¿^‡J rëOe<+x°å«a™ù~úa–Y”q•Ÿ«_bAŞ3òóìg­‚’¢şài?A±-»ÎÔIZ²üó¦9™w7”Oº©±{³Ø‡¾Ñ	l*Æ!F,"~BJº+sê!Ê-û'€nÃ6FNŸÊÔ–&:Æ2¢½ª ƒCæùÄ¬Ao²Aåİ¨ÈhAóìiÔVìš:Ì)f¥Úó3@¢óªÄaÚò6å¢›~PÔÉÍ›\YñzÓa4|‡Å	¾è_·$˜4üÎÍ­uœ	€&zş4£„}Şyê5ÜH2:”åbğ|9>=–í†ë@÷¶‘-7@Qî§ûl8¯`ŒıãA¼Ğ%Dê]üö´v
ÃÓÅøÍ=ÔÌ¨§rİ,ÀêªO ;ù¼‰öÀFo«¯'9Œñ1¨L;)/Ş©ô‰f]vÿ‡¡‚‹Â­jcf‰	R>™]‡	Nç¾æ4”ÊR~4ÑÜiüøî1 “êsMú‰\õ§j¶ 
‰Ö Z¢EÉ é<½ñÈ†»?¨Y¶l¼~¡uxhIàc:fG<MRî¦3Òõ$ä´*¤çúíÀªú°'Àì3ü™ãÄ(“Õ	¢	oG£ÊqÉ9^›‚¸BDaî0©ââ¿)Ü¦<Aş ÖMLßágÊ^®¼¢‡õÖ¿·àºweÓÜœ®C=Ñú’Ñq<K•Í0™6È$r’£ÿ\I9R!%×Ÿï@ú¦|ŒH|ÇœüÎ@ñÊ‡{e—ğ¹§ªııZš(”£L©»œñìAzgÇŞ£üX5®=Zëk~Î#ìë9í§ÒN‡¦/\½LöiÛSÏşÆººXé*û9*}&÷á_ç7º4ã¾©£;û“”ìušİ÷ºÂÆÈ¡üÿif‹Ë&~\ëÅ¾)Éé¿n+úõNåu¯ixlJMBj£zĞ›™)¬“–5ÛK‚A‘ş`V›	0Uè‘şywï¬Q¹$a)or1Án”Ñ±z+æ`-¤*:Çv”æÀÈşªDwg‰[‰u¶2Üşªô`'´˜©„»şzæle$ïÏ°×ßœw²q†ThÄÕfî
j.YìT)µjïÒ1Ö0ø(zêF¬ÁóHÄÈGø·±ã4c=ø´¿GÂcüÕ¸ko~™€TôŞ‰& ÄX›eK¨a«êWvÒøãÌ‹Îš¯ÂIb´·åUÎgƒ"Üˆ¬õBµQ]¢	4L¼¾…Ü€9JÙ­ùÖÛqş	÷ª»?òÄ™½€7‹>úæë:R/Ùm¾!0•’rø/EXŞR“oW¯m¨z!Uµ°?•›vYP³Ç–:(PŞÕ†•r>=¡‘…Ÿõ!Õbö,1ÜÛÛƒ›P—˜5ŸBÀú-tıà¨^`‘]Nõ+1ÊÔû|­'º[ş"¶÷€”xR™¦}øşÀ¾´åË‚}
Yi¼O+›Ì]„ÛXsˆì04Qú¦Ëğ~z8³-¦DÚ6«õ÷
RµáGªCD
K@åÃÀ;h£ıuû¦4–7q7 ö§¸i¯\¬’Zß–Pk}1ÚKŠ¨ü~ÛK\(Î!»î[¨£E	\„rB`fä°¢7z´‹MÍ€1mïÛ•z’ #² Ôû\éb„Ş»½J‰¤Yç/Œ{ÿ¾¦u]şD¾õË!…€åùîÊRÅò‹\ÿÀu¸Vg¿ƒssànu®P 9	!ş„åc„õ¯ğT›§¼¶™ûC‚”z÷«ÏØ	ºæã„*Ë~W£e¾túd§c83„>ıŞUñ($;e4\2{±k†ƒKØ¯ßo‰•ªÌßµQïIaĞ¦é	Øº ³iá}™	3DÕ–-äşIÙµó¥B;Ì‚EBN›,i¤LnÂ>UÃ[Ííëâš÷oK~Ï0Ø‡Ë™&ò'MWÎ©`åÌìÂR”]·M„W»H'âjwï!8¡öö¥Æ$7‰¹16)ã¡xsÜ<Uj…_¢‰ş®êÃ—ÊHÏt_¨Iäó Š¤£¡ä¦›™ü9ÆÑØAG2œÜÀZ³è÷Å‹1fßMì¤O¹§„7yŞÍšB(Ñªçì >V\3¼9˜^ÿµ¤Ó³â¯g¯¬ºĞjï†ß7x¥Å”Îö.µX”y X|}°Óà8PØÔ`y¸ã,¢ÎÑ³œ Mdúºß£‡Œ}Ó¯
•ù÷WNg*ÉL8ií_¼‚UóreQ’¾bŸñ˜º¶·Xy¶s#W¡Úv‰ÓÈŸ@°cÜ`š6LØÉ¡ãÓnG¯9¸¯wPÛô}­ Õ´Ly³ñ|\f¯ÎÑ©½ƒõI¯æúÁzváÍIürGAÃ*t•n
rJÆ†ÈŞ/Sİ>1ıëóÕ4eÔI2`yÍ±]1SüŞ)Š"6u*‰a¾–—“U;Œ}à¯	)‚ˆŸô£ö—µnèLßƒ>-A=íhqşñ +Éü®ŠdÕ)ªFO;ÕD3mbmGŠ/Sâ¸Šöî
.Q€SŞIFmP!f>®ü‹NšõæİJLv´şó$`(b°É}:jÙ¾SækPÓò¯m‡œkJkFô"ÏĞ-OË6~ˆú®”¨hùo%B©üµºÖí´²ñR€j—ğŸ·1#á}ğÕZç‰`ÁB×¹X¼‚CàZÈ£¼>Ôˆ^xŸûMùŠòê¤ãı gù9ìîœkïšu¦ğ—•—÷TRŒ75U]UÇ?ª~"'™«fÈà7Ü¨¸‰Dô;lÏÈÊş€`¶]œ;(ÚNÓïêåÙ”ã¹ÑÁ]²¤qf`óIvÙÄ`ËÓo“'L}$½kRøˆd_lËcâV ;ô¸ÙŒõ¬l0_òâP	MÒ İtşC&ºíÈ;p¡]4:1oÓù‹ªoio’@2…Y¢<˜4ğ4â¿S“ş›KËŞ¥¥ÁÆdîN÷I$Œ+¢—ó_0@› VsgÉŸ[²m(Ú÷#ITsœyÍ|Lzuí‚CÂ¨ğkàckÜÚ·Šfl}öª0#»/8U
C#&k2KF\G™“ğO /†ÄÈìEs•Éßù<úºÑaU
ä˜Hgz^†E;VÌ‰ÇÑ)ÒYß
|$Wx®™°Ø¼|µÖ}?ÁÙ(µX_áÖy]3ZÔaä›ÉGËDD]¦Rxô5æ˜îóúúò#´kÕ9Ë¹„wİ¸û(h’è¨æúd’óİ+,ö³0Ò¿ŠëcªgøQn]uÿó6Ñ(:5eäşÕ%¶V‰s› “æ7k”‡ˆÚL— ³AÌ¹ä<•™ziÕ¬qÄ<X¢æö$@‚]’ ‡|_	‡G¶¶5æèú#Äæãõ¤³÷O›¢ä42`à“èè˜»´'1]³‡x¯o@ıôİë|G¥d¬¬”>nWô<ç28»†pŸ†îº§*6?Uº[^iÅıíÀ§ Âªø7º=)÷ª¿pUOüı´ÔÀD¢0FCÂšCúV`Ä±~H½ ±íıïsÅqb1
¢=¬šİh3…'f±bº8œá”°’ø•??,ókÖ:0E‡9.lûíù|n&¦BÃÿˆÖa’mÓQ7­3ü·gÑhlrßû¿´”rQ¡ãééö¢CĞ?n"–-oØcSƒ=<.«C&:|¥¸¯r¼œqfâ":åáTÅED¸¾E˜`â‹¾|¶x_JíØı0‰­¤â2vÁM…K ™'¦ôñC|\tw÷€ºQ ·Éš‘¹ĞcMı¢ËåÏû,Õ0üŸkM‡CB|õjÉ‡ÿíRçó­Aı#z\e‹q)À0‚ÅS ›½FI¼½ùcÚš¬XÀŠ²s1X­~ãz‡<åÜ†Q¬ˆœ]®ÏxV¹”Å˜¼½dû;î†öë(€ÇaOÏÊ…KÒêÇM¤öçÁ¥Şgğ
'ÙN.BCxŞ’¢ı%˜M™é’?¢ŸŠ!/´3ëÙ«rÕƒÊáóSÖû”DU«.î×³ŸÖ.×´íóô£PI~e{3Ê}¾wÁ±‹°ÃycPH#ñ"~Å8‚³·+1]>~©+-Áµ—ÜşÙ*Æ Eû<¬Şº“ŒQ£»2Ø6B9H`âd
?‚¹æ§â*^Ê¤Ëüû(°úE9Åp¡Aş1¸‰âªOÕÙIİw#0;&£X›ÎÀÎ{Ÿ4	ˆäçÎá(®kC}Ãa#'án^·îXS, ó`Dá'ö¯ %â²ÜÅk1nh„‡L”x~ÎüŸÖÜŠ§»ğk»w˜òÑ%Pªâ ÇÅsg§ù!¨õğì­­mç„„·!å”>ğ§Ó	€¦ÜÕ}–'qê*ó²ƒe6™İUÃ¼†:îß×x?¿ç:‡Ûû€Û¸¾Hè­ì|ª?	@£¡SHàÁ
/@ÒdUr¾{N¡¿Í’=ºÎ¶ì(,æ¤’Õsû)MöGä+÷@Z^°^X?EàµbvÄ /§ŠxÂev•d[Cz¡?jÑ#Ä°{–ª7¹_7ÔY[éIÙrØ¿1?Ë¤Öı÷Ç£¤ûÈşÌÛÌTÃ)‚šá·ˆ†„V§	ŞØ¸§ñÈƒæ:äNˆ\Ò9Ğ,Wû“ì'%Ès5<ç9ÆòSäVmX‚Tà % T@üQ=.	Á–Ê}´s=Ã¸	zêp6çQf@7~ÒJÜÇû!CĞªLx››‘&SNXãÇî«oëy—ÿ°êÓQƒ<’\ ƒŒmzÚ çÅŞvÇ%®b}n[á7oĞ?ÀBš6ü†ƒİìÚbË¾M¡¡wr8¾arúÿqÅÆ0”œ=L9Êê ñæ¦¡ÉBÍPˆZ¦rMHüGÑY+6PôƒpqlÃ‚»óõ¥k Oî=§%/Ñä7†Áq/F‡—#º?ÚÈN“³ãó#oêMß›Y=·œÆ¥Ü'Ï@ÏÀ¥ÀS{·vÅM¢ó´»˜$Öîç6w?ì—beGE¦Fœ>¥=¶	èCäƒ«waÕú‘ı
û—™LKÚ¿;İQ†ßáKpß‚¦K$Š4ôã}£³gúAípIxhşŞ[ziñğ˜q•zîßÄù¥ñ4äG¼P,D%®åt«<qk›Rg—«vAÅ{y°İÎ<Òm¼®ZSj¼ROvA9A[J45ö
P+GS¿”k¢Ÿ¥Np1PÛ“÷<YÆ®ŸğÅ¶«@¹H#ÒÕj”Å×ßï-Ó±Ô²“Â
0Åœš]ş
¬É«Få;yü Óñ•œwÖ†w›®£)ÊKBàK¾#…}´ïä³™/£J;µ[Mïõöÿ9³ÈµoĞŒì:’ü÷ö"-ÕÌÇLÜBê#OÜSiL¹ß‘º@cŠ½µÏÄ„¢`vŠ‰®ûØ”c~IÒøõÀú×¬XmÜ²¡[ÂúÚ‘âìW~ôˆ	Gº$Ñó¯’š4¿“²_éKÀ=‰¾t}Sá¤:şì¯<
\µgd¹ÈùÎë‚±œ±v%6O¦_æyòÿWÂ„×Û$' ZÛ¿A²¸Ÿ#@»¦°TÉKÈèÌ˜İrŠ§SçCÜå—á7"ŒŠ~åİ^»¿R]3”SdƒñyØò–x0ò‹^¹Gá–ITÕ8Œç¡Â¬}˜Ê­B%³AzáÊ4N<ƒl˜Ök[tÖgk—SvÙt<J\ú‰aa‘|º;»Œğ±:i»”×3ú÷#`qºAöÕ¥´Uèvc¹XÔÚáyüİ)°ÓC	ŠƒÏ«rj×R™)Ì×®<IsÁ¨ohÔs2½í[ñà²¯ë?u–cöoòJñò=ó:}9e×I\=k!¿ŠÜ}[ª[NT×†	a®àÏ
¸Oí®/iÀÍ„Ûí'ıù|ö.–á Ëc;[Ï\ğ%~ÛeˆnĞzCw‘™nô~áŞÉ¹#ÖÎ]‘HmÎÇËi‹épÖó
PjlÙb÷òYl±9X8²?•ÈÁ{Ûé»S– Yé£ô#á1spî
‘àÄİ$f®…ÿ4ô™pİT,)XÓmuòu’d«HéHèe¬‚ø‘‡ïyÍiŒ²¸e3™tImµE?_£Ôpplicable: Staged, targeted: Staged, limit: Installed, selected: Default
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
