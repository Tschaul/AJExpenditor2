/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) : typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) : (factory((global.styled = global.styled || {}), global.React));
  }(this, (function(exports, React) {
    'use strict';
    var React__default = 'default' in React ? React['default'] : React;
    var _uppercasePattern = /([A-Z])/g;
    function hyphenate$2(string) {
      return string.replace(_uppercasePattern, '-$1').toLowerCase();
    }
    var hyphenate_1 = hyphenate$2;
    var hyphenate = hyphenate_1;
    var msPattern = /^ms-/;
    function hyphenateStyleName(string) {
      return hyphenate(string).replace(msPattern, '-ms-');
    }
    var hyphenateStyleName_1 = hyphenateStyleName;
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var classCallCheck = function(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
    var createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    var _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    var inherits = function(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };
    var objectWithoutProperties = function(obj, keys) {
      var target = {};
      for (var i in obj) {
        if (keys.indexOf(i) >= 0)
          continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i))
          continue;
        target[i] = obj[i];
      }
      return target;
    };
    var possibleConstructorReturn = function(self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };
    var index$1 = function isObject(val) {
      return val != null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && !Array.isArray(val);
    };
    var isObject = index$1;
    function isObjectObject(o) {
      return isObject(o) === true && Object.prototype.toString.call(o) === '[object Object]';
    }
    var index = function isPlainObject(o) {
      var ctor,
          prot;
      if (isObjectObject(o) === false)
        return false;
      ctor = o.constructor;
      if (typeof ctor !== 'function')
        return false;
      prot = ctor.prototype;
      if (isObjectObject(prot) === false)
        return false;
      if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
      }
      return true;
    };
    var objToCss = function objToCss(obj, prevKey) {
      var css = Object.keys(obj).filter(function(key) {
        var chunk = obj[key];
        return chunk !== undefined && chunk !== null && chunk !== false && chunk !== '';
      }).map(function(key) {
        if (index(obj[key]))
          return objToCss(obj[key], key);
        return hyphenateStyleName_1(key) + ': ' + obj[key] + ';';
      }).join(' ');
      return prevKey ? prevKey + ' {\n  ' + css + '\n}' : css;
    };
    var flatten = function flatten(chunks, executionContext) {
      return chunks.reduce(function(ruleSet, chunk) {
        if (chunk === undefined || chunk === null || chunk === false || chunk === '')
          return ruleSet;
        if (Array.isArray(chunk))
          return [].concat(ruleSet, flatten(chunk, executionContext));
        if (chunk.hasOwnProperty('styledComponentId'))
          return [].concat(ruleSet, ['.' + chunk.styledComponentId]);
        if (typeof chunk === 'function') {
          return executionContext ? ruleSet.concat.apply(ruleSet, flatten([chunk(executionContext)], executionContext)) : ruleSet.concat(chunk);
        }
        return ruleSet.concat(index(chunk) ? objToCss(chunk) : chunk.toString());
      }, []);
    };
    function createCommonjsModule(fn, module) {
      return module = {exports: {}}, fn(module, module.exports), module.exports;
    }
    var stylis$1 = createCommonjsModule(function(module, exports) {
      (function(factory) {
        (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module['exports'] = factory(null) : typeof undefined === 'function' && undefined['amd'] ? undefined(factory(null)) : window['stylis'] = factory(null);
      })(function factory(options) {
        'use strict';
        var nullptn = /^\0+/g;
        var formatptn = /[\0\r\f]/g;
        var colonptn = /: */g;
        var cursorptn = /zoo|gra/;
        var transformptn = /([,: ])(transform)/g;
        var animationptn = /,+\s*(?![^(]*[)])/g;
        var propertiesptn = / +\s*(?![^(]*[)])/g;
        var elementptn = / *[\0] */g;
        var selectorptn = /,\r+?/g;
        var andptn = /([\t\r\n ])*\f?&/g;
        var escapeptn = /:global\(((?:[^\(\)\[\]]*|\[.*\]|\([^\(\)]*\))*)\)/g;
        var invalidptn = /\W+/g;
        var keyframeptn = /@(k\w+)\s*(\S*)\s*/;
        var plcholdrptn = /::(place)/g;
        var readonlyptn = /:(read-only)/g;
        var beforeptn = /\s+(?=[{\];=:>])/g;
        var afterptn = /([[}=:>])\s+/g;
        var tailptn = /(\{[^{]+?);(?=\})/g;
        var whiteptn = /\s{2,}/g;
        var pseudoptn = /([^\(])(:+) */g;
        var writingptn = /[svh]\w+-[tblr]{2}/;
        var gradientptn = /([\w-]+t\()/g;
        var supportsptn = /\(\s*([^]*?)\s*\)/g;
        var propertyptn = /([^]*?);/g;
        var selfptn = /-self|flex-/g;
        var pseudofmt = /[^]*?(:[rp][el]a[\w-]+)[^]*/;
        var webkit = '-webkit-';
        var moz = '-moz-';
        var ms = '-ms-';
        var SEMICOLON = 59;
        var CLOSEBRACES = 125;
        var OPENBRACES = 123;
        var OPENPARENTHESES = 40;
        var CLOSEPARENTHESES = 41;
        var OPENBRACKET = 91;
        var CLOSEBRACKET = 93;
        var NEWLINE = 10;
        var CARRIAGE = 13;
        var TAB = 9;
        var AT = 64;
        var SPACE = 32;
        var AND = 38;
        var DASH = 45;
        var UNDERSCORE = 95;
        var STAR = 42;
        var COMMA = 44;
        var COLON = 58;
        var SINGLEQUOTE = 39;
        var DOUBLEQUOTE = 34;
        var FOWARDSLASH = 47;
        var GREATERTHAN = 62;
        var PLUS = 43;
        var TILDE = 126;
        var NULL = 0;
        var FORMFEED = 12;
        var VERTICALTAB = 11;
        var KEYFRAME = 107;
        var MEDIA = 109;
        var SUPPORTS = 115;
        var PLACEHOLDER = 112;
        var READONLY = 111;
        var IMPORT = 169;
        var CHARSET = 163;
        var DOCUMENT = 100;
        var column = 1;
        var line = 1;
        var pattern = 0;
        var cascade = 1;
        var prefix = 1;
        var escape = 1;
        var compress = 0;
        var semicolon = 0;
        var preserve = 0;
        var array = [];
        var plugins = [];
        var plugged = 0;
        var should = null;
        var POSTS = -2;
        var PREPS = -1;
        var UNKWN = 0;
        var PROPS = 1;
        var BLCKS = 2;
        var ATRUL = 3;
        var unkwn = 0;
        var keyed = 1;
        var key = '';
        var nscopealt = '';
        var nscope = '';
        function compile(parent, current, body, id, depth) {
          var bracket = 0;
          var comment = 0;
          var parentheses = 0;
          var quote = 0;
          var first = 0;
          var second = 0;
          var code = 0;
          var tail = 0;
          var trail = 0;
          var peak = 0;
          var counter = 0;
          var context = 0;
          var atrule = 0;
          var pseudo = 0;
          var caret = 0;
          var format = 0;
          var insert = 0;
          var invert = 0;
          var length = 0;
          var eof = body.length;
          var eol = eof - 1;
          var char = '';
          var chars = '';
          var child = '';
          var out = '';
          var children = '';
          var flat = '';
          var selector;
          var result;
          while (caret < eof) {
            code = body.charCodeAt(caret);
            if (comment + quote + parentheses + bracket === 0) {
              if (caret === eol) {
                if (format > 0) {
                  chars = chars.replace(formatptn, '');
                }
                if (chars.trim().length > 0) {
                  switch (code) {
                    case SPACE:
                    case TAB:
                    case SEMICOLON:
                    case CARRIAGE:
                    case NEWLINE:
                      {
                        break;
                      }
                    default:
                      {
                        chars += body.charAt(caret);
                      }
                  }
                  code = SEMICOLON;
                }
              }
              if (insert === 1) {
                switch (code) {
                  case OPENBRACES:
                  case COMMA:
                    {
                      insert = 0;
                      break;
                    }
                  case TAB:
                  case CARRIAGE:
                  case NEWLINE:
                  case SPACE:
                    {
                      break;
                    }
                  default:
                    {
                      caret--;
                      code = SEMICOLON;
                    }
                }
              }
              switch (code) {
                case OPENBRACES:
                  {
                    chars = chars.trim();
                    first = chars.charCodeAt(0);
                    counter = 1;
                    length = ++caret;
                    while (caret < eof) {
                      code = body.charCodeAt(caret);
                      switch (code) {
                        case OPENBRACES:
                          {
                            counter++;
                            break;
                          }
                        case CLOSEBRACES:
                          {
                            counter--;
                            break;
                          }
                      }
                      if (counter === 0) {
                        break;
                      }
                      caret++;
                    }
                    child = body.substring(length, caret);
                    if (first === NULL) {
                      first = (chars = chars.replace(nullptn, '').trim()).charCodeAt(0);
                    }
                    switch (first) {
                      case AT:
                        {
                          if (format > 0) {
                            chars = chars.replace(formatptn, '');
                          }
                          second = chars.charCodeAt(1);
                          switch (second) {
                            case DOCUMENT:
                            case MEDIA:
                            case SUPPORTS:
                              {
                                selector = current;
                                break;
                              }
                            default:
                              {
                                selector = array;
                              }
                          }
                          child = compile(current, selector, child, second, depth + 1);
                          length = child.length;
                          if (preserve > 0 && length === 0) {
                            length = chars.length;
                          }
                          if (plugged > 0) {
                            selector = select(array, chars, invert);
                            result = proxy(ATRUL, child, selector, current, line, column, length, second, depth);
                            chars = selector.join('');
                            if (result !== void 0) {
                              if ((length = (child = result.trim()).length) === 0) {
                                second = 0;
                                child = '';
                              }
                            }
                          }
                          if (length > 0) {
                            switch (second) {
                              case SUPPORTS:
                                {
                                  chars = chars.replace(supportsptn, supports);
                                }
                              case DOCUMENT:
                              case MEDIA:
                                {
                                  child = chars + '{' + child + '}';
                                  break;
                                }
                              case KEYFRAME:
                                {
                                  chars = chars.replace(keyframeptn, '$1 $2' + (keyed > 0 ? key : ''));
                                  child = chars + '{' + child + '}';
                                  if (prefix === 1 || prefix === 2 && vendor('@' + child, 3)) {
                                    child = '@' + webkit + child + '@' + child;
                                  } else {
                                    child = '@' + child;
                                  }
                                  break;
                                }
                              default:
                                {
                                  child = chars + child;
                                }
                            }
                          } else {
                            child = '';
                          }
                          break;
                        }
                      default:
                        {
                          child = compile(current, select(current, chars, invert), child, id, depth + 1);
                        }
                    }
                    children += child;
                    context = 0;
                    insert = 0;
                    pseudo = 0;
                    format = 0;
                    invert = 0;
                    atrule = 0;
                    chars = '';
                    child = '';
                    code = body.charCodeAt(++caret);
                    break;
                  }
                case CLOSEBRACES:
                case SEMICOLON:
                  {
                    chars = (format > 0 ? chars.replace(formatptn, '') : chars).trim();
                    if ((length = chars.length) > 1) {
                      if (pseudo === 0) {
                        first = chars.charCodeAt(0);
                        if (first === DASH || first > 96 && first < 123) {
                          length = (chars = chars.replace(' ', ':')).length;
                        }
                      }
                      if (plugged > 0) {
                        if ((result = proxy(PROPS, chars, current, parent, line, column, out.length, id, depth)) !== void 0) {
                          if ((length = (chars = result.trim()).length) === 0) {
                            chars = '\0\0';
                          }
                        }
                      }
                      first = chars.charCodeAt(0);
                      second = chars.charCodeAt(1);
                      switch (first + second) {
                        case NULL:
                          {
                            break;
                          }
                        case IMPORT:
                        case CHARSET:
                          {
                            flat += chars + body.charAt(caret);
                            break;
                          }
                        default:
                          {
                            if (chars.charCodeAt(length - 1) === COLON)
                              break;
                            out += property(chars, first, second, chars.charCodeAt(2));
                          }
                      }
                    }
                    context = 0;
                    insert = 0;
                    pseudo = 0;
                    format = 0;
                    invert = 0;
                    chars = '';
                    code = body.charCodeAt(++caret);
                    break;
                  }
              }
            }
            switch (code) {
              case CARRIAGE:
              case NEWLINE:
                {
                  if (comment + quote + parentheses + bracket + semicolon === 0) {
                    switch (peak) {
                      case CLOSEPARENTHESES:
                      case SINGLEQUOTE:
                      case DOUBLEQUOTE:
                      case AT:
                      case TILDE:
                      case GREATERTHAN:
                      case STAR:
                      case PLUS:
                      case FOWARDSLASH:
                      case DASH:
                      case COLON:
                      case COMMA:
                      case SEMICOLON:
                      case OPENBRACES:
                      case CLOSEBRACES:
                        {
                          break;
                        }
                      default:
                        {
                          if (pseudo > 0) {
                            insert = 1;
                          }
                        }
                    }
                  }
                  if (comment === FOWARDSLASH) {
                    comment = 0;
                  }
                  if (plugged * unkwn > 0) {
                    proxy(UNKWN, chars, current, parent, line, column, out.length, id, depth);
                  }
                  column = 1;
                  line++;
                  break;
                }
              case SEMICOLON:
              case CLOSEBRACES:
                {
                  if (comment + quote + parentheses + bracket === 0) {
                    column++;
                    break;
                  }
                }
              default:
                {
                  column++;
                  char = body.charAt(caret);
                  switch (code) {
                    case TAB:
                    case SPACE:
                      {
                        if (quote + bracket === 0) {
                          switch (tail) {
                            case COMMA:
                            case COLON:
                            case TAB:
                            case SPACE:
                              {
                                char = '';
                                break;
                              }
                            default:
                              {
                                if (code !== SPACE) {
                                  char = ' ';
                                }
                              }
                          }
                        }
                        break;
                      }
                    case NULL:
                      {
                        char = '\\0';
                        break;
                      }
                    case FORMFEED:
                      {
                        char = '\\f';
                        break;
                      }
                    case VERTICALTAB:
                      {
                        char = '\\v';
                        break;
                      }
                    case AND:
                      {
                        if (quote + comment + bracket === 0 && cascade > 0) {
                          invert = 1;
                          format = 1;
                          char = '\f' + char;
                        }
                        break;
                      }
                    case 108:
                      {
                        if (quote + comment + bracket + pattern === 0 && pseudo > 0) {
                          switch (caret - pseudo) {
                            case 2:
                              {
                                if (tail === PLACEHOLDER && body.charCodeAt(caret - 3) === COLON) {
                                  pattern = tail;
                                }
                              }
                            case 8:
                              {
                                if (trail === READONLY) {
                                  pattern = trail;
                                }
                              }
                          }
                        }
                        break;
                      }
                    case COLON:
                      {
                        if (quote + comment + bracket === 0) {
                          pseudo = caret;
                        }
                        break;
                      }
                    case COMMA:
                      {
                        if (comment + parentheses + quote + bracket === 0) {
                          format = 1;
                          char += '\r';
                        }
                        break;
                      }
                    case DOUBLEQUOTE:
                      {
                        if (comment === 0) {
                          quote = quote === code ? 0 : quote === 0 ? code : quote;
                          if (caret === eol) {
                            eol++;
                            eof++;
                          }
                        }
                        break;
                      }
                    case SINGLEQUOTE:
                      {
                        if (comment === 0) {
                          quote = quote === code ? 0 : quote === 0 ? code : quote;
                          if (caret === eol) {
                            eol++;
                            eof++;
                          }
                        }
                        break;
                      }
                    case OPENBRACKET:
                      {
                        if (quote + comment + parentheses === 0) {
                          bracket++;
                        }
                        break;
                      }
                    case CLOSEBRACKET:
                      {
                        if (quote + comment + parentheses === 0) {
                          bracket--;
                        }
                        break;
                      }
                    case CLOSEPARENTHESES:
                      {
                        if (quote + comment + bracket === 0) {
                          if (caret === eol) {
                            eol++;
                            eof++;
                          }
                          parentheses--;
                        }
                        break;
                      }
                    case OPENPARENTHESES:
                      {
                        if (quote + comment + bracket === 0) {
                          if (context === 0) {
                            switch (tail * 2 + trail * 3) {
                              case 533:
                                {
                                  break;
                                }
                              default:
                                {
                                  counter = 0;
                                  context = 1;
                                }
                            }
                          }
                          parentheses++;
                        }
                        break;
                      }
                    case AT:
                      {
                        if (comment + parentheses + quote + bracket + pseudo + atrule === 0) {
                          atrule = 1;
                        }
                        break;
                      }
                    case STAR:
                    case FOWARDSLASH:
                      {
                        if (quote + bracket + parentheses > 0) {
                          break;
                        }
                        switch (comment) {
                          case 0:
                            {
                              switch (code * 2 + body.charCodeAt(caret + 1) * 3) {
                                case 235:
                                  {
                                    comment = FOWARDSLASH;
                                    break;
                                  }
                                case 220:
                                  {
                                    length = caret;
                                    comment = STAR;
                                    break;
                                  }
                              }
                              break;
                            }
                          case STAR:
                            {
                              if (code === FOWARDSLASH && tail === STAR) {
                                if (body.charCodeAt(length + 2) === 33) {
                                  out += body.substring(length, caret + 1);
                                }
                                char = '';
                                comment = 0;
                              }
                            }
                        }
                      }
                  }
                  if (comment === 0) {
                    if (cascade + quote + bracket + atrule === 0 && id !== KEYFRAME && code !== SEMICOLON) {
                      switch (code) {
                        case COMMA:
                        case TILDE:
                        case GREATERTHAN:
                        case PLUS:
                        case CLOSEPARENTHESES:
                        case OPENPARENTHESES:
                          {
                            if (context === 0) {
                              switch (tail) {
                                case TAB:
                                case SPACE:
                                case NEWLINE:
                                case CARRIAGE:
                                  {
                                    char = char + '\0';
                                    break;
                                  }
                                default:
                                  {
                                    char = '\0' + char + (code === COMMA ? '' : '\0');
                                  }
                              }
                              format = 1;
                            } else {
                              switch (code) {
                                case OPENPARENTHESES:
                                  {
                                    context = ++counter;
                                    break;
                                  }
                                case CLOSEPARENTHESES:
                                  {
                                    if ((context = --counter) === 0) {
                                      format = 1;
                                      char += '\0';
                                    }
                                    break;
                                  }
                              }
                            }
                            break;
                          }
                        case SPACE:
                          {
                            switch (tail) {
                              case NULL:
                              case OPENBRACES:
                              case CLOSEBRACES:
                              case SEMICOLON:
                              case COMMA:
                              case FORMFEED:
                              case TAB:
                              case SPACE:
                              case NEWLINE:
                              case CARRIAGE:
                                {
                                  break;
                                }
                              default:
                                {
                                  if (context === 0) {
                                    format = 1;
                                    char += '\0';
                                  }
                                }
                            }
                          }
                      }
                    }
                    chars += char;
                    if (code !== SPACE) {
                      peak = code;
                    }
                  }
                }
            }
            trail = tail;
            tail = code;
            caret++;
          }
          length = out.length;
          if (preserve > 0) {
            if (length === 0 && children.length === 0 && current[0].length === 0 === false) {
              if (id !== MEDIA || current.length === 1 && (cascade > 0 ? nscopealt : nscope) === current[0]) {
                length = current.join(',').length + 2;
              }
            }
          }
          if (length > 0) {
            selector = cascade === 0 && id !== KEYFRAME ? isolate(current) : current;
            if (plugged > 0) {
              result = proxy(BLCKS, out, selector, parent, line, column, length, id, depth);
              if (result !== void 0 && (out = result).length === 0) {
                return flat + out + children;
              }
            }
            out = selector.join(',') + '{' + out + '}';
            if (prefix * pattern !== 0) {
              if (prefix === 2 && !vendor(out, 2))
                pattern = 0;
              switch (pattern) {
                case READONLY:
                  {
                    out = out.replace(readonlyptn, ':' + moz + '$1') + out;
                    break;
                  }
                case PLACEHOLDER:
                  {
                    out = out.replace(plcholdrptn, '::' + webkit + 'input-$1') + out.replace(plcholdrptn, '::' + moz + '$1') + out.replace(plcholdrptn, ':' + ms + 'input-$1') + out;
                    break;
                  }
              }
              pattern = 0;
            }
          }
          return flat + out + children;
        }
        function select(parent, current, invert) {
          var selectors = current.trim().split(selectorptn);
          var out = selectors;
          var length = selectors.length;
          var l = parent.length;
          switch (l) {
            case 0:
            case 1:
              {
                for (var i = 0,
                    selector = l === 0 ? '' : parent[0] + ' '; i < length; ++i) {
                  out[i] = scope(selector, out[i], invert, l).trim();
                }
                break;
              }
            default:
              {
                for (var i = 0,
                    j = 0,
                    out = []; i < length; ++i) {
                  for (var k = 0; k < l; ++k) {
                    out[j++] = scope(parent[k] + ' ', selectors[i], invert, l).trim();
                  }
                }
              }
          }
          return out;
        }
        function scope(parent, current, invert, level) {
          var selector = current;
          var code = selector.charCodeAt(0);
          if (code < 33) {
            code = (selector = selector.trim()).charCodeAt(0);
          }
          switch (code) {
            case AND:
              {
                switch (cascade + level) {
                  case 0:
                  case 1:
                    {
                      if (parent.trim().length === 0) {
                        break;
                      }
                    }
                  default:
                    {
                      return selector.replace(andptn, '$1' + parent.trim());
                    }
                }
                break;
              }
            case COLON:
              {
                switch (selector.charCodeAt(1)) {
                  case 103:
                    {
                      if (escape > 0 && cascade > 0) {
                        return selector.replace(escapeptn, '$1').replace(andptn, '$1' + nscope);
                      }
                      break;
                    }
                  default:
                    {
                      return parent.trim() + selector;
                    }
                }
              }
            default:
              {
                if (invert * cascade > 0 && selector.indexOf('\f') > 0) {
                  return selector.replace(andptn, (parent.charCodeAt(0) === COLON ? '' : '$1') + parent.trim());
                }
              }
          }
          return parent + selector;
        }
        function property(input, first, second, third) {
          var index = 0;
          var out = input + ';';
          var hash = first * 2 + second * 3 + third * 4;
          var cache;
          if (hash === 944) {
            return animation(out);
          } else if (prefix === 0 || prefix === 2 && !vendor(out, 1)) {
            return out;
          }
          switch (hash) {
            case 1015:
              {
                return out.charCodeAt(9) === DASH ? webkit + out + out : out;
              }
            case 951:
              {
                return out.charCodeAt(3) === 116 ? webkit + out + out : out;
              }
            case 963:
              {
                return out.charCodeAt(5) === 110 ? webkit + out + out : out;
              }
            case 969:
            case 942:
              {
                return webkit + out + out;
              }
            case 978:
              {
                return webkit + out + moz + out + out;
              }
            case 1019:
            case 983:
              {
                return webkit + out + moz + out + ms + out + out;
              }
            case 883:
              {
                return out.charCodeAt(8) === DASH ? webkit + out + out : out;
              }
            case 932:
              {
                return webkit + out + ms + out + out;
              }
            case 964:
              {
                return webkit + out + ms + 'flex' + '-' + out + out;
              }
            case 1023:
              {
                if (out.charCodeAt(8) !== 99) {
                  break;
                }
                cache = out.substring(out.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
                return webkit + 'box-pack' + cache + webkit + out + ms + 'flex-pack' + cache + out;
              }
            case 1005:
              {
                return cursorptn.test(out) ? out.replace(colonptn, ':' + webkit) + out.replace(colonptn, ':' + moz) + out : out;
              }
            case 1000:
              {
                cache = out.substring(13).trim();
                index = cache.indexOf('-') + 1;
                switch (cache.charCodeAt(0) + cache.charCodeAt(index)) {
                  case 226:
                    {
                      cache = out.replace(writingptn, 'tb');
                      break;
                    }
                  case 232:
                    {
                      cache = out.replace(writingptn, 'tb-rl');
                      break;
                    }
                  case 220:
                    {
                      cache = out.replace(writingptn, 'lr');
                      break;
                    }
                  default:
                    {
                      return out;
                    }
                }
                return webkit + out + ms + cache + out;
              }
            case 1017:
              {
                if (out.indexOf('sticky', 9) === -1) {
                  return out;
                }
              }
            case 975:
              {
                index = (out = input).length - 10;
                cache = (out.charCodeAt(index) === 33 ? out.substring(0, index) : out).substring(input.indexOf(':', 7) + 1).trim();
                switch (hash = cache.charCodeAt(0) + (cache.charCodeAt(7) | 0)) {
                  case 203:
                    {
                      if (cache.charCodeAt(8) < 111) {
                        break;
                      }
                    }
                  case 115:
                    {
                      out = out.replace(cache, webkit + cache) + ';' + out;
                      break;
                    }
                  case 207:
                  case 102:
                    {
                      out = out.replace(cache, webkit + (hash > 102 ? 'inline-' : '') + 'box') + ';' + out.replace(cache, webkit + cache) + ';' + out.replace(cache, ms + cache + 'box') + ';' + out;
                    }
                }
                return out + ';';
              }
            case 938:
              {
                if (out.charCodeAt(5) === DASH) {
                  switch (out.charCodeAt(6)) {
                    case 105:
                      {
                        cache = out.replace('-items', '');
                        return webkit + out + webkit + 'box-' + cache + ms + 'flex-' + cache + out;
                      }
                    case 115:
                      {
                        return webkit + out + ms + 'flex-item-' + out.replace(selfptn, '') + out;
                      }
                    default:
                      {
                        return webkit + out + ms + 'flex-line-pack' + out.replace('align-content', '') + out;
                      }
                  }
                }
                break;
              }
            case 953:
              {
                if ((index = out.indexOf('-content', 9)) > 0) {
                  if (out.charCodeAt(index - 3) === 109 && out.charCodeAt(index - 4) !== 45) {
                    cache = out.substring(index - 3);
                    return 'width:' + webkit + cache + 'width:' + moz + cache + 'width:' + cache;
                  }
                }
                break;
              }
            case 962:
              {
                out = webkit + out + (out.charCodeAt(5) === 102 ? ms + out : '') + out;
                if (second + third === 211 && out.charCodeAt(13) === 105 && out.indexOf('transform', 10) > 0) {
                  return out.substring(0, out.indexOf(';', 27) + 1).replace(transformptn, '$1' + webkit + '$2') + out;
                }
                break;
              }
          }
          return out;
        }
        var i = 0;
        function vendor(content, context) {
          var index = content.indexOf(context === 1 ? ':' : '{');
          var key = content.substring(0, context !== 3 ? index : 10);
          var value = content.substring(index + 1, content.length - 1);
          return should(context !== 2 ? key : key.replace(pseudofmt, '$1'), value, context);
        }
        function supports(match, group) {
          var out = property(group, group.charCodeAt(0), group.charCodeAt(1), group.charCodeAt(2));
          return out !== group + ';' ? out.replace(propertyptn, ' or ($1)').substring(4) : '(' + group + ')';
        }
        function animation(input) {
          var length = input.length;
          var index = input.indexOf(':', 9) + 1;
          var declare = input.substring(0, index).trim();
          var out = input.substring(index, length - 1).trim();
          switch (input.charCodeAt(9) * keyed) {
            case 0:
              {
                break;
              }
            case DASH:
              {
                if (input.charCodeAt(10) !== 110) {
                  break;
                }
              }
            default:
              {
                var list = out.split((out = '', animationptn));
                for (var i = 0,
                    index = 0,
                    length = list.length; i < length; index = 0, ++i) {
                  var value = list[i];
                  var items = value.split(propertiesptn);
                  while (value = items[index]) {
                    var peak = value.charCodeAt(0);
                    if (keyed === 1 && (peak > AT && peak < 90 || peak > 96 && peak < 123 || peak === UNDERSCORE || peak === DASH && value.charCodeAt(1) !== DASH)) {
                      switch (isNaN(parseFloat(value)) + (value.indexOf('(') !== -1)) {
                        case 1:
                          {
                            switch (value) {
                              case 'infinite':
                              case 'alternate':
                              case 'backwards':
                              case 'running':
                              case 'normal':
                              case 'forwards':
                              case 'both':
                              case 'none':
                              case 'linear':
                              case 'ease':
                              case 'ease-in':
                              case 'ease-out':
                              case 'ease-in-out':
                              case 'paused':
                              case 'reverse':
                              case 'alternate-reverse':
                              case 'inherit':
                              case 'initial':
                              case 'unset':
                              case 'step-start':
                              case 'step-end':
                                {
                                  break;
                                }
                              default:
                                {
                                  value += key;
                                }
                            }
                          }
                      }
                    }
                    items[index++] = value;
                  }
                  out += (i === 0 ? '' : ',') + items.join(' ');
                }
              }
          }
          out = declare + out + ';';
          if (prefix === 1 || prefix === 2 && vendor(out, 1))
            return webkit + out + out;
          return out;
        }
        function isolate(current) {
          for (var i = 0,
              length = current.length,
              selector = Array(length),
              padding,
              element; i < length; ++i) {
            var elements = current[i].split(elementptn);
            var out = '';
            for (var j = 0,
                size = 0,
                tail = 0,
                code = 0,
                l = elements.length; j < l; ++j) {
              if ((size = (element = elements[j]).length) === 0 && l > 1) {
                continue;
              }
              tail = out.charCodeAt(out.length - 1);
              code = element.charCodeAt(0);
              padding = '';
              if (j !== 0) {
                switch (tail) {
                  case STAR:
                  case TILDE:
                  case GREATERTHAN:
                  case PLUS:
                  case SPACE:
                  case OPENPARENTHESES:
                    {
                      break;
                    }
                  default:
                    {
                      padding = ' ';
                    }
                }
              }
              switch (code) {
                case AND:
                  {
                    element = padding + nscopealt;
                  }
                case TILDE:
                case GREATERTHAN:
                case PLUS:
                case SPACE:
                case CLOSEPARENTHESES:
                case OPENPARENTHESES:
                  {
                    break;
                  }
                case OPENBRACKET:
                  {
                    element = padding + element + nscopealt;
                    break;
                  }
                case COLON:
                  {
                    switch (element.charCodeAt(1) * 2 + element.charCodeAt(2) * 3) {
                      case 530:
                        {
                          if (escape > 0) {
                            element = padding + element.substring(8, size - 1);
                            break;
                          }
                        }
                      default:
                        {
                          if (j < 1 || elements[j - 1].length < 1) {
                            element = padding + nscopealt + element;
                          }
                        }
                    }
                    break;
                  }
                case COMMA:
                  {
                    padding = '';
                  }
                default:
                  {
                    if (size > 1 && element.indexOf(':') > 0) {
                      element = padding + element.replace(pseudoptn, '$1' + nscopealt + '$2');
                    } else {
                      element = padding + element + nscopealt;
                    }
                  }
              }
              out += element;
            }
            selector[i] = out.replace(formatptn, '').trim();
          }
          return selector;
        }
        function proxy(context, content, selectors, parents, line, column, length, id, depth) {
          for (var i = 0,
              out = content,
              next; i < plugged; ++i) {
            switch (next = plugins[i].call(stylis, context, out, selectors, parents, line, column, length, id, depth)) {
              case void 0:
              case false:
              case true:
              case null:
                {
                  break;
                }
              default:
                {
                  out = next;
                }
            }
          }
          switch (out) {
            case void 0:
            case false:
            case true:
            case null:
            case content:
              {
                break;
              }
            default:
              {
                return out;
              }
          }
        }
        function minify(output) {
          return output.replace(formatptn, '').replace(beforeptn, '').replace(afterptn, '$1').replace(tailptn, '$1').replace(whiteptn, ' ');
        }
        function use(plugin) {
          switch (plugin) {
            case void 0:
            case null:
              {
                plugged = plugins.length = 0;
                break;
              }
            default:
              {
                switch (plugin.constructor) {
                  case Array:
                    {
                      for (var i = 0,
                          length = plugin.length; i < length; ++i) {
                        use(plugin[i]);
                      }
                      break;
                    }
                  case Function:
                    {
                      plugins[plugged++] = plugin;
                      break;
                    }
                  case Boolean:
                    {
                      unkwn = !!plugin | 0;
                    }
                }
              }
          }
          return use;
        }
        function set$$1(options) {
          for (var name in options) {
            var value = options[name];
            switch (name) {
              case 'keyframe':
                keyed = value | 0;
                break;
              case 'global':
                escape = value | 0;
                break;
              case 'cascade':
                cascade = value | 0;
                break;
              case 'compress':
                compress = value | 0;
                break;
              case 'semicolon':
                semicolon = value | 0;
                break;
              case 'preserve':
                preserve = value | 0;
                break;
              case 'prefix':
                should = null;
                if (!value) {
                  prefix = 0;
                } else if (typeof value !== 'function') {
                  prefix = 1;
                } else {
                  prefix = 2;
                  should = value;
                }
            }
          }
          return set$$1;
        }
        function stylis(selector, input) {
          if (this !== void 0 && this.constructor === stylis) {
            return factory(selector);
          }
          var ns = selector;
          var code = ns.charCodeAt(0);
          if (code < 33) {
            code = (ns = ns.trim()).charCodeAt(0);
          }
          if (keyed > 0) {
            key = ns.replace(invalidptn, code === OPENBRACKET ? '' : '-');
          }
          code = 1;
          if (cascade === 1) {
            nscope = ns;
          } else {
            nscopealt = ns;
          }
          var selectors = [nscope];
          var result;
          if (plugged > 0) {
            result = proxy(PREPS, input, selectors, selectors, line, column, 0, 0, 0);
            if (result !== void 0 && typeof result === 'string') {
              input = result;
            }
          }
          var output = compile(array, selectors, input, 0, 0);
          if (plugged > 0) {
            result = proxy(POSTS, output, selectors, selectors, line, column, output.length, 0, 0);
            if (result !== void 0 && typeof(output = result) !== 'string') {
              code = 0;
            }
          }
          key = '';
          nscope = '';
          nscopealt = '';
          pattern = 0;
          line = 1;
          column = 1;
          return compress * code === 0 ? output : minify(output);
        }
        stylis['use'] = use;
        stylis['set'] = set$$1;
        if (options !== void 0) {
          set$$1(options);
        }
        return stylis;
      });
    });
    var stylis = new stylis$1({
      global: false,
      cascade: true,
      keyframe: false,
      prefix: true,
      compress: false,
      semicolon: true
    });
    var stringifyRules = function stringifyRules(rules, selector, prefix) {
      var flatCSS = rules.join('').replace(/^\s*\/\/.*$/gm, '');
      var cssStr = selector && prefix ? prefix + ' ' + selector + ' { ' + flatCSS + ' }' : flatCSS;
      return stylis(prefix || !selector ? '' : selector, cssStr);
    };
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var charsLength = chars.length;
    var generateAlphabeticName = function generateAlphabeticName(code) {
      var name = '';
      var x = void 0;
      for (x = code; x > charsLength; x = Math.floor(x / charsLength)) {
        name = chars[x % charsLength] + name;
      }
      return chars[x % charsLength] + name;
    };
    var interleave = (function(strings, interpolations) {
      return interpolations.reduce(function(array, interp, i) {
        return array.concat(interp, strings[i + 1]);
      }, [strings[0]]);
    });
    var css = (function(strings) {
      for (var _len = arguments.length,
          interpolations = Array(_len > 1 ? _len - 1 : 0),
          _key = 1; _key < _len; _key++) {
        interpolations[_key - 1] = arguments[_key];
      }
      return flatten(interleave(strings, interpolations));
    });
    var SC_COMPONENT_ID = /^[^\S\n]*?\/\* sc-component-id:\s+(\S+)\s+\*\//mg;
    var extractCompsFromCSS = (function(maybeCSS) {
      var css = '' + (maybeCSS || '');
      var existingComponents = [];
      css.replace(SC_COMPONENT_ID, function(match, componentId, matchIndex) {
        existingComponents.push({
          componentId: componentId,
          matchIndex: matchIndex
        });
        return match;
      });
      return existingComponents.map(function(_ref, i) {
        var componentId = _ref.componentId,
            matchIndex = _ref.matchIndex;
        var nextComp = existingComponents[i + 1];
        var cssFromDOM = nextComp ? css.slice(matchIndex, nextComp.matchIndex) : css.slice(matchIndex);
        return {
          componentId: componentId,
          cssFromDOM: cssFromDOM
        };
      });
    });
    var getNonce = (function() {
      return typeof __webpack_nonce__ !== 'undefined' ? __webpack_nonce__ : null;
    });
    var COMPONENTS_PER_TAG = 40;
    var BrowserTag = function() {
      function BrowserTag(el, isLocal) {
        var existingSource = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        classCallCheck(this, BrowserTag);
        this.el = el;
        this.isLocal = isLocal;
        this.ready = false;
        var extractedComps = extractCompsFromCSS(existingSource);
        this.size = extractedComps.length;
        this.components = extractedComps.reduce(function(acc, obj) {
          acc[obj.componentId] = obj;
          return acc;
        }, {});
      }
      BrowserTag.prototype.isFull = function isFull() {
        return this.size >= COMPONENTS_PER_TAG;
      };
      BrowserTag.prototype.addComponent = function addComponent(componentId) {
        if (!this.ready)
          this.replaceElement();
        if (this.components[componentId])
          throw new Error('Trying to add Component \'' + componentId + '\' twice!');
        var comp = {
          componentId: componentId,
          textNode: document.createTextNode('')
        };
        this.el.appendChild(comp.textNode);
        this.size += 1;
        this.components[componentId] = comp;
      };
      BrowserTag.prototype.inject = function inject(componentId, css, name) {
        if (!this.ready)
          this.replaceElement();
        var comp = this.components[componentId];
        if (!comp)
          throw new Error('Must add a new component before you can inject css into it');
        if (comp.textNode.data === '')
          comp.textNode.appendData('\n/* sc-component-id: ' + componentId + ' */\n');
        comp.textNode.appendData(css);
        if (name) {
          var existingNames = this.el.getAttribute(SC_ATTR);
          this.el.setAttribute(SC_ATTR, existingNames ? existingNames + ' ' + name : name);
        }
        var nonce = getNonce();
        if (nonce) {
          this.el.setAttribute('nonce', nonce);
        }
      };
      BrowserTag.prototype.toHTML = function toHTML() {
        return this.el.outerHTML;
      };
      BrowserTag.prototype.toReactElement = function toReactElement() {
        throw new Error('BrowserTag doesn\'t implement toReactElement!');
      };
      BrowserTag.prototype.clone = function clone() {
        throw new Error('BrowserTag cannot be cloned!');
      };
      BrowserTag.prototype.replaceElement = function replaceElement() {
        var _this = this;
        this.ready = true;
        if (this.size === 0)
          return;
        var newEl = this.el.cloneNode();
        newEl.appendChild(document.createTextNode('\n'));
        Object.keys(this.components).forEach(function(key) {
          var comp = _this.components[key];
          comp.textNode = document.createTextNode(comp.cssFromDOM);
          newEl.appendChild(comp.textNode);
        });
        if (!this.el.parentNode)
          throw new Error("Trying to replace an element that wasn't mounted!");
        this.el.parentNode.replaceChild(newEl, this.el);
        this.el = newEl;
      };
      return BrowserTag;
    }();
    var BrowserStyleSheet = {create: function create() {
        var tags = [];
        var names = {};
        var nodes = document.querySelectorAll('[' + SC_ATTR + ']');
        var nodesLength = nodes.length;
        for (var i = 0; i < nodesLength; i += 1) {
          var el = nodes[i];
          tags.push(new BrowserTag(el, el.getAttribute(LOCAL_ATTR) === 'true', el.innerHTML));
          var attr = el.getAttribute(SC_ATTR);
          if (attr) {
            attr.trim().split(/\s+/).forEach(function(name) {
              names[name] = true;
            });
          }
        }
        var tagConstructor = function tagConstructor(isLocal) {
          var el = document.createElement('style');
          el.type = 'text/css';
          el.setAttribute(SC_ATTR, '');
          el.setAttribute(LOCAL_ATTR, isLocal ? 'true' : 'false');
          if (!document.head)
            throw new Error('Missing document <head>');
          document.head.appendChild(el);
          return new BrowserTag(el, isLocal);
        };
        return new StyleSheet(tagConstructor, tags, names);
      }};
    var SC_ATTR = 'data-styled-components';
    var LOCAL_ATTR = 'data-styled-components-is-local';
    var CONTEXT_KEY = '__styled-components-stylesheet__';
    var instance = null;
    var clones = [];
    var StyleSheet = function() {
      function StyleSheet(tagConstructor) {
        var tags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var names = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        classCallCheck(this, StyleSheet);
        this.hashes = {};
        this.deferredInjections = {};
        this.stylesCacheable = typeof document !== 'undefined';
        this.tagConstructor = tagConstructor;
        this.tags = tags;
        this.names = names;
        this.constructComponentTagMap();
      }
      StyleSheet.prototype.constructComponentTagMap = function constructComponentTagMap() {
        var _this = this;
        this.componentTags = {};
        this.tags.forEach(function(tag) {
          Object.keys(tag.components).forEach(function(componentId) {
            _this.componentTags[componentId] = tag;
          });
        });
      };
      StyleSheet.prototype.getName = function getName(hash) {
        return this.hashes[hash.toString()];
      };
      StyleSheet.prototype.alreadyInjected = function alreadyInjected(hash, name) {
        if (!this.names[name])
          return false;
        this.hashes[hash.toString()] = name;
        return true;
      };
      StyleSheet.prototype.hasInjectedComponent = function hasInjectedComponent(componentId) {
        return !!this.componentTags[componentId];
      };
      StyleSheet.prototype.deferredInject = function deferredInject(componentId, isLocal, css) {
        if (this === instance) {
          clones.forEach(function(clone) {
            clone.deferredInject(componentId, isLocal, css);
          });
        }
        this.getOrCreateTag(componentId, isLocal);
        this.deferredInjections[componentId] = css;
      };
      StyleSheet.prototype.inject = function inject(componentId, isLocal, css, hash, name) {
        if (this === instance) {
          clones.forEach(function(clone) {
            clone.inject(componentId, isLocal, css);
          });
        }
        var tag = this.getOrCreateTag(componentId, isLocal);
        var deferredInjection = this.deferredInjections[componentId];
        if (deferredInjection) {
          tag.inject(componentId, deferredInjection);
          delete this.deferredInjections[componentId];
        }
        tag.inject(componentId, css, name);
        if (hash && name) {
          this.hashes[hash.toString()] = name;
        }
      };
      StyleSheet.prototype.toHTML = function toHTML() {
        return this.tags.map(function(tag) {
          return tag.toHTML();
        }).join('');
      };
      StyleSheet.prototype.toReactElements = function toReactElements() {
        return this.tags.map(function(tag, i) {
          return tag.toReactElement('sc-' + i);
        });
      };
      StyleSheet.prototype.getOrCreateTag = function getOrCreateTag(componentId, isLocal) {
        var existingTag = this.componentTags[componentId];
        if (existingTag) {
          return existingTag;
        }
        var lastTag = this.tags[this.tags.length - 1];
        var componentTag = !lastTag || lastTag.isFull() || lastTag.isLocal !== isLocal ? this.createNewTag(isLocal) : lastTag;
        this.componentTags[componentId] = componentTag;
        componentTag.addComponent(componentId);
        return componentTag;
      };
      StyleSheet.prototype.createNewTag = function createNewTag(isLocal) {
        var newTag = this.tagConstructor(isLocal);
        this.tags.push(newTag);
        return newTag;
      };
      StyleSheet.reset = function reset(isServer) {
        instance = StyleSheet.create(isServer);
      };
      StyleSheet.create = function create() {
        var isServer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : typeof document === 'undefined';
        return (isServer ? ServerStyleSheet : BrowserStyleSheet).create();
      };
      StyleSheet.clone = function clone(oldSheet) {
        var newSheet = new StyleSheet(oldSheet.tagConstructor, oldSheet.tags.map(function(tag) {
          return tag.clone();
        }), _extends({}, oldSheet.names));
        newSheet.hashes = _extends({}, oldSheet.hashes);
        newSheet.deferredInjections = _extends({}, oldSheet.deferredInjections);
        clones.push(newSheet);
        return newSheet;
      };
      createClass(StyleSheet, null, [{
        key: 'instance',
        get: function get$$1() {
          return instance || (instance = StyleSheet.create());
        }
      }]);
      return StyleSheet;
    }();
    function makeEmptyFunction(arg) {
      return function() {
        return arg;
      };
    }
    var emptyFunction$1 = function emptyFunction() {};
    emptyFunction$1.thatReturns = makeEmptyFunction;
    emptyFunction$1.thatReturnsFalse = makeEmptyFunction(false);
    emptyFunction$1.thatReturnsTrue = makeEmptyFunction(true);
    emptyFunction$1.thatReturnsNull = makeEmptyFunction(null);
    emptyFunction$1.thatReturnsThis = function() {
      return this;
    };
    emptyFunction$1.thatReturnsArgument = function(arg) {
      return arg;
    };
    var emptyFunction_1 = emptyFunction$1;
    var validateFormat = function validateFormat(format) {};
    if (process.env.NODE_ENV !== 'production') {
      validateFormat = function validateFormat(format) {
        if (format === undefined) {
          throw new Error('invariant requires an error message argument');
        }
      };
    }
    function invariant$1(condition, format, a, b, c, d, e, f) {
      validateFormat(format);
      if (!condition) {
        var error;
        if (format === undefined) {
          error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
        } else {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error(format.replace(/%s/g, function() {
            return args[argIndex++];
          }));
          error.name = 'Invariant Violation';
        }
        error.framesToPop = 1;
        throw error;
      }
    }
    var invariant_1 = invariant$1;
    var emptyFunction$2 = emptyFunction_1;
    var warning$1 = emptyFunction$2;
    if (process.env.NODE_ENV !== 'production') {
      (function() {
        var printWarning = function printWarning(format) {
          for (var _len = arguments.length,
              args = Array(_len > 1 ? _len - 1 : 0),
              _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          var argIndex = 0;
          var message = 'Warning: ' + format.replace(/%s/g, function() {
            return args[argIndex++];
          });
          if (typeof console !== 'undefined') {
            console.error(message);
          }
          try {
            throw new Error(message);
          } catch (x) {}
        };
        warning$1 = function warning(condition, format) {
          if (format === undefined) {
            throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
          }
          if (format.indexOf('Failed Composite propType: ') === 0) {
            return;
          }
          if (!condition) {
            for (var _len2 = arguments.length,
                args = Array(_len2 > 2 ? _len2 - 2 : 0),
                _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }
            printWarning.apply(undefined, [format].concat(args));
          }
        };
      })();
    }
    var warning_1 = warning$1;
    var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
    var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
    if (process.env.NODE_ENV !== 'production') {
      var invariant$2 = invariant_1;
      var warning$2 = warning_1;
      var ReactPropTypesSecret$2 = ReactPropTypesSecret_1;
      var loggedTypeFailures = {};
    }
    function checkPropTypes$1(typeSpecs, values, location, componentName, getStack) {
      if (process.env.NODE_ENV !== 'production') {
        for (var typeSpecName in typeSpecs) {
          if (typeSpecs.hasOwnProperty(typeSpecName)) {
            var error;
            try {
              invariant$2(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$2);
            } catch (ex) {
              error = ex;
            }
            warning$2(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error === 'undefined' ? 'undefined' : _typeof(error));
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              loggedTypeFailures[error.message] = true;
              var stack = getStack ? getStack() : '';
              warning$2(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
            }
          }
        }
      }
    }
    var checkPropTypes_1 = checkPropTypes$1;
    var emptyFunction = emptyFunction_1;
    var invariant = invariant_1;
    var warning = warning_1;
    var ReactPropTypesSecret = ReactPropTypesSecret_1;
    var checkPropTypes = checkPropTypes_1;
    var factoryWithTypeCheckers = function factoryWithTypeCheckers(isValidElement, throwOnDirectAccess) {
      var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator';
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === 'function') {
          return iteratorFn;
        }
      }
      var ANONYMOUS = '<<anonymous>>';
      var ReactPropTypes = {
        array: createPrimitiveTypeChecker('array'),
        bool: createPrimitiveTypeChecker('boolean'),
        func: createPrimitiveTypeChecker('function'),
        number: createPrimitiveTypeChecker('number'),
        object: createPrimitiveTypeChecker('object'),
        string: createPrimitiveTypeChecker('string'),
        symbol: createPrimitiveTypeChecker('symbol'),
        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker
      };
      function is(x, y) {
        if (x === y) {
          return x !== 0 || 1 / x === 1 / y;
        } else {
          return x !== x && y !== y;
        }
      }
      function PropTypeError(message) {
        this.message = message;
        this.stack = '';
      }
      PropTypeError.prototype = Error.prototype;
      function createChainableTypeChecker(validate) {
        if (process.env.NODE_ENV !== 'production') {
          var manualPropTypeCallCache = {};
          var manualPropTypeWarningCount = 0;
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
          componentName = componentName || ANONYMOUS;
          propFullName = propFullName || propName;
          if (secret !== ReactPropTypesSecret) {
            if (throwOnDirectAccess) {
              invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
            } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
              var cacheKey = componentName + ':' + propName;
              if (!manualPropTypeCallCache[cacheKey] && manualPropTypeWarningCount < 3) {
                warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
                manualPropTypeCallCache[cacheKey] = true;
                manualPropTypeWarningCount++;
              }
            }
          }
          if (props[propName] == null) {
            if (isRequired) {
              if (props[propName] === null) {
                return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
              }
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
            }
            return null;
          } else {
            return validate(props, propName, componentName, location, propFullName);
          }
        }
        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);
        return chainedCheckType;
      }
      function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName, secret) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== expectedType) {
            var preciseType = getPreciseType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunction.thatReturnsNull);
      }
      function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
          }
          var propValue = props[propName];
          if (!Array.isArray(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
          }
          for (var i = 0; i < propValue.length; i++) {
            var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createElementTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!isValidElement(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location, propFullName) {
          if (!(props[propName] instanceof expectedClass)) {
            var expectedClassName = expectedClass.name || ANONYMOUS;
            var actualClassName = getClassName(props[propName]);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
          return emptyFunction.thatReturnsNull;
        }
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          for (var i = 0; i < expectedValues.length; i++) {
            if (is(propValue, expectedValues[i])) {
              return null;
            }
          }
          var valuesString = JSON.stringify(expectedValues);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
        }
        return createChainableTypeChecker(validate);
      }
      function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
          }
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
          }
          for (var key in propValue) {
            if (propValue.hasOwnProperty(key)) {
              var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
              if (error instanceof Error) {
                return error;
              }
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
          return emptyFunction.thatReturnsNull;
        }
        function validate(props, propName, componentName, location, propFullName) {
          for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
            var checker = arrayOfTypeCheckers[i];
            if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
              return null;
            }
          }
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
        }
        return createChainableTypeChecker(validate);
      }
      function createNodeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          if (!isNode(props[propName])) {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          for (var key in shapeTypes) {
            var checker = shapeTypes[key];
            if (!checker) {
              continue;
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function isNode(propValue) {
        switch (typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) {
          case 'number':
          case 'string':
          case 'undefined':
            return true;
          case 'boolean':
            return !propValue;
          case 'object':
            if (Array.isArray(propValue)) {
              return propValue.every(isNode);
            }
            if (propValue === null || isValidElement(propValue)) {
              return true;
            }
            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
              var iterator = iteratorFn.call(propValue);
              var step;
              if (iteratorFn !== propValue.entries) {
                while (!(step = iterator.next()).done) {
                  if (!isNode(step.value)) {
                    return false;
                  }
                }
              } else {
                while (!(step = iterator.next()).done) {
                  var entry = step.value;
                  if (entry) {
                    if (!isNode(entry[1])) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false;
            }
            return true;
          default:
            return false;
        }
      }
      function isSymbol(propType, propValue) {
        if (propType === 'symbol') {
          return true;
        }
        if (propValue['@@toStringTag'] === 'Symbol') {
          return true;
        }
        if (typeof Symbol === 'function' && propValue instanceof Symbol) {
          return true;
        }
        return false;
      }
      function getPropType(propValue) {
        var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue);
        if (Array.isArray(propValue)) {
          return 'array';
        }
        if (propValue instanceof RegExp) {
          return 'object';
        }
        if (isSymbol(propType, propValue)) {
          return 'symbol';
        }
        return propType;
      }
      function getPreciseType(propValue) {
        var propType = getPropType(propValue);
        if (propType === 'object') {
          if (propValue instanceof Date) {
            return 'date';
          } else if (propValue instanceof RegExp) {
            return 'regexp';
          }
        }
        return propType;
      }
      function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
          return ANONYMOUS;
        }
        return propValue.constructor.name;
      }
      ReactPropTypes.checkPropTypes = checkPropTypes;
      ReactPropTypes.PropTypes = ReactPropTypes;
      return ReactPropTypes;
    };
    var emptyFunction$3 = emptyFunction_1;
    var invariant$3 = invariant_1;
    var factoryWithThrowingShims = function factoryWithThrowingShims() {
      function shim() {
        invariant$3(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
      }
      shim.isRequired = shim;
      function getShim() {
        return shim;
      }
      var ReactPropTypes = {
        array: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,
        any: shim,
        arrayOf: getShim,
        element: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim
      };
      ReactPropTypes.checkPropTypes = emptyFunction$3;
      ReactPropTypes.PropTypes = ReactPropTypes;
      return ReactPropTypes;
    };
    var index$3 = createCommonjsModule(function(module) {
      if (process.env.NODE_ENV !== 'production') {
        var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;
        var isValidElement = function isValidElement(object) {
          return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        };
        var throwOnDirectAccess = true;
        module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
      } else {
        module.exports = factoryWithThrowingShims();
      }
    });
    var _StyleSheetManager$ch;
    var StyleSheetManager = function(_Component) {
      inherits(StyleSheetManager, _Component);
      function StyleSheetManager() {
        classCallCheck(this, StyleSheetManager);
        return possibleConstructorReturn(this, _Component.apply(this, arguments));
      }
      StyleSheetManager.prototype.getChildContext = function getChildContext() {
        var _ref;
        return _ref = {}, _ref[CONTEXT_KEY] = this.props.sheet, _ref;
      };
      StyleSheetManager.prototype.render = function render() {
        return React__default.Children.only(this.props.children);
      };
      return StyleSheetManager;
    }(React.Component);
    StyleSheetManager.childContextTypes = (_StyleSheetManager$ch = {}, _StyleSheetManager$ch[CONTEXT_KEY] = index$3.oneOfType([index$3.instanceOf(StyleSheet), index$3.instanceOf(ServerStyleSheet)]).isRequired, _StyleSheetManager$ch);
    StyleSheetManager.propTypes = {sheet: index$3.oneOfType([index$3.instanceOf(StyleSheet), index$3.instanceOf(ServerStyleSheet)]).isRequired};
    var ServerTag = function() {
      function ServerTag(isLocal) {
        classCallCheck(this, ServerTag);
        this.isLocal = isLocal;
        this.components = {};
        this.size = 0;
        this.names = [];
      }
      ServerTag.prototype.isFull = function isFull() {
        return false;
      };
      ServerTag.prototype.addComponent = function addComponent(componentId) {
        if (this.components[componentId])
          throw new Error('Trying to add Component \'' + componentId + '\' twice!');
        this.components[componentId] = {
          componentId: componentId,
          css: ''
        };
        this.size += 1;
      };
      ServerTag.prototype.concatenateCSS = function concatenateCSS() {
        var _this = this;
        return Object.keys(this.components).reduce(function(styles, k) {
          return styles + _this.components[k].css;
        }, '');
      };
      ServerTag.prototype.inject = function inject(componentId, css, name) {
        var comp = this.components[componentId];
        if (!comp)
          throw new Error('Must add a new component before you can inject css into it');
        if (comp.css === '')
          comp.css = '/* sc-component-id: ' + componentId + ' */\n';
        comp.css += css.replace(/\n*$/, '\n');
        if (name)
          this.names.push(name);
      };
      ServerTag.prototype.toHTML = function toHTML() {
        var attrs = ['type="text/css"', SC_ATTR + '="' + this.names.join(' ') + '"', LOCAL_ATTR + '="' + (this.isLocal ? 'true' : 'false') + '"'];
        var nonce = getNonce();
        if (nonce) {
          attrs.push('nonce="' + nonce + '"');
        }
        return '<style ' + attrs.join(' ') + '>' + this.concatenateCSS() + '</style>';
      };
      ServerTag.prototype.toReactElement = function toReactElement(key) {
        var _attrs;
        var attrs = (_attrs = {}, _attrs[SC_ATTR] = this.names.join(' '), _attrs[LOCAL_ATTR] = this.isLocal.toString(), _attrs);
        var nonce = getNonce();
        if (nonce) {
          attrs.nonce = nonce;
        }
        return React__default.createElement('style', _extends({
          key: key,
          type: 'text/css'
        }, attrs, {dangerouslySetInnerHTML: {__html: this.concatenateCSS()}}));
      };
      ServerTag.prototype.clone = function clone() {
        var _this2 = this;
        var copy = new ServerTag(this.isLocal);
        copy.names = [].concat(this.names);
        copy.size = this.size;
        copy.components = Object.keys(this.components).reduce(function(acc, key) {
          acc[key] = _extends({}, _this2.components[key]);
          return acc;
        }, {});
        return copy;
      };
      return ServerTag;
    }();
    var ServerStyleSheet = function() {
      function ServerStyleSheet() {
        classCallCheck(this, ServerStyleSheet);
        this.instance = StyleSheet.clone(StyleSheet.instance);
      }
      ServerStyleSheet.prototype.collectStyles = function collectStyles(children) {
        if (this.closed)
          throw new Error("Can't collect styles once you've called getStyleTags!");
        return React__default.createElement(StyleSheetManager, {sheet: this.instance}, children);
      };
      ServerStyleSheet.prototype.getStyleTags = function getStyleTags() {
        if (!this.closed) {
          clones.splice(clones.indexOf(this.instance), 1);
          this.closed = true;
        }
        return this.instance.toHTML();
      };
      ServerStyleSheet.prototype.getStyleElement = function getStyleElement() {
        if (!this.closed) {
          clones.splice(clones.indexOf(this.instance), 1);
          this.closed = true;
        }
        return this.instance.toReactElements();
      };
      ServerStyleSheet.create = function create() {
        return new StyleSheet(function(isLocal) {
          return new ServerTag(isLocal);
        });
      };
      return ServerStyleSheet;
    }();
    var LIMIT = 200;
    var createWarnTooManyClasses = (function(displayName) {
      var generatedClasses = {};
      var warningSeen = false;
      return function(className) {
        if (!warningSeen) {
          generatedClasses[className] = true;
          if (Object.keys(generatedClasses).length >= LIMIT) {
            console.warn('Over ' + LIMIT + ' classes were generated for component ' + displayName + '. \n' + 'Consider using the attrs method, together with a style object for frequently changed styles.\n' + 'Example:\n' + '  const Component = styled.div.attrs({\n' + '    style: ({ background }) => ({\n' + '      background,\n' + '    }),\n' + '  })`width: 100%;`\n\n' + '  <Component />');
            warningSeen = true;
            generatedClasses = {};
          }
        }
      };
    });
    var reactProps = {
      children: true,
      dangerouslySetInnerHTML: true,
      key: true,
      ref: true,
      autoFocus: true,
      defaultValue: true,
      valueLink: true,
      defaultChecked: true,
      checkedLink: true,
      innerHTML: true,
      suppressContentEditableWarning: true,
      onFocusIn: true,
      onFocusOut: true,
      className: true,
      onCopy: true,
      onCut: true,
      onPaste: true,
      onCompositionEnd: true,
      onCompositionStart: true,
      onCompositionUpdate: true,
      onKeyDown: true,
      onKeyPress: true,
      onKeyUp: true,
      onFocus: true,
      onBlur: true,
      onChange: true,
      onInput: true,
      onSubmit: true,
      onReset: true,
      onClick: true,
      onContextMenu: true,
      onDoubleClick: true,
      onDrag: true,
      onDragEnd: true,
      onDragEnter: true,
      onDragExit: true,
      onDragLeave: true,
      onDragOver: true,
      onDragStart: true,
      onDrop: true,
      onMouseDown: true,
      onMouseEnter: true,
      onMouseLeave: true,
      onMouseMove: true,
      onMouseOut: true,
      onMouseOver: true,
      onMouseUp: true,
      onSelect: true,
      onTouchCancel: true,
      onTouchEnd: true,
      onTouchMove: true,
      onTouchStart: true,
      onScroll: true,
      onWheel: true,
      onAbort: true,
      onCanPlay: true,
      onCanPlayThrough: true,
      onDurationChange: true,
      onEmptied: true,
      onEncrypted: true,
      onEnded: true,
      onError: true,
      onLoadedData: true,
      onLoadedMetadata: true,
      onLoadStart: true,
      onPause: true,
      onPlay: true,
      onPlaying: true,
      onProgress: true,
      onRateChange: true,
      onSeeked: true,
      onSeeking: true,
      onStalled: true,
      onSuspend: true,
      onTimeUpdate: true,
      onVolumeChange: true,
      onWaiting: true,
      onLoad: true,
      onAnimationStart: true,
      onAnimationEnd: true,
      onAnimationIteration: true,
      onTransitionEnd: true,
      onCopyCapture: true,
      onCutCapture: true,
      onPasteCapture: true,
      onCompositionEndCapture: true,
      onCompositionStartCapture: true,
      onCompositionUpdateCapture: true,
      onKeyDownCapture: true,
      onKeyPressCapture: true,
      onKeyUpCapture: true,
      onFocusCapture: true,
      onBlurCapture: true,
      onChangeCapture: true,
      onInputCapture: true,
      onSubmitCapture: true,
      onResetCapture: true,
      onClickCapture: true,
      onContextMenuCapture: true,
      onDoubleClickCapture: true,
      onDragCapture: true,
      onDragEndCapture: true,
      onDragEnterCapture: true,
      onDragExitCapture: true,
      onDragLeaveCapture: true,
      onDragOverCapture: true,
      onDragStartCapture: true,
      onDropCapture: true,
      onMouseDownCapture: true,
      onMouseEnterCapture: true,
      onMouseLeaveCapture: true,
      onMouseMoveCapture: true,
      onMouseOutCapture: true,
      onMouseOverCapture: true,
      onMouseUpCapture: true,
      onSelectCapture: true,
      onTouchCancelCapture: true,
      onTouchEndCapture: true,
      onTouchMoveCapture: true,
      onTouchStartCapture: true,
      onScrollCapture: true,
      onWheelCapture: true,
      onAbortCapture: true,
      onCanPlayCapture: true,
      onCanPlayThroughCapture: true,
      onDurationChangeCapture: true,
      onEmptiedCapture: true,
      onEncryptedCapture: true,
      onEndedCapture: true,
      onErrorCapture: true,
      onLoadedDataCapture: true,
      onLoadedMetadataCapture: true,
      onLoadStartCapture: true,
      onPauseCapture: true,
      onPlayCapture: true,
      onPlayingCapture: true,
      onProgressCapture: true,
      onRateChangeCapture: true,
      onSeekedCapture: true,
      onSeekingCapture: true,
      onStalledCapture: true,
      onSuspendCapture: true,
      onTimeUpdateCapture: true,
      onVolumeChangeCapture: true,
      onWaitingCapture: true,
      onLoadCapture: true,
      onAnimationStartCapture: true,
      onAnimationEndCapture: true,
      onAnimationIterationCapture: true,
      onTransitionEndCapture: true
    };
    var htmlProps = {
      accept: true,
      acceptCharset: true,
      accessKey: true,
      action: true,
      allowFullScreen: true,
      allowTransparency: true,
      alt: true,
      as: true,
      async: true,
      autoComplete: true,
      autoPlay: true,
      capture: true,
      cellPadding: true,
      cellSpacing: true,
      charSet: true,
      challenge: true,
      checked: true,
      cite: true,
      classID: true,
      className: true,
      cols: true,
      colSpan: true,
      content: true,
      contentEditable: true,
      contextMenu: true,
      controls: true,
      coords: true,
      crossOrigin: true,
      data: true,
      dateTime: true,
      default: true,
      defer: true,
      dir: true,
      disabled: true,
      download: true,
      draggable: true,
      encType: true,
      form: true,
      formAction: true,
      formEncType: true,
      formMethod: true,
      formNoValidate: true,
      formTarget: true,
      frameBorder: true,
      headers: true,
      height: true,
      hidden: true,
      high: true,
      href: true,
      hrefLang: true,
      htmlFor: true,
      httpEquiv: true,
      icon: true,
      id: true,
      inputMode: true,
      integrity: true,
      is: true,
      keyParams: true,
      keyType: true,
      kind: true,
      label: true,
      lang: true,
      list: true,
      loop: true,
      low: true,
      manifest: true,
      marginHeight: true,
      marginWidth: true,
      max: true,
      maxLength: true,
      media: true,
      mediaGroup: true,
      method: true,
      min: true,
      minLength: true,
      multiple: true,
      muted: true,
      name: true,
      nonce: true,
      noValidate: true,
      open: true,
      optimum: true,
      pattern: true,
      placeholder: true,
      playsInline: true,
      poster: true,
      preload: true,
      profile: true,
      radioGroup: true,
      readOnly: true,
      referrerPolicy: true,
      rel: true,
      required: true,
      reversed: true,
      role: true,
      rows: true,
      rowSpan: true,
      sandbox: true,
      scope: true,
      scoped: true,
      scrolling: true,
      seamless: true,
      selected: true,
      shape: true,
      size: true,
      sizes: true,
      span: true,
      spellCheck: true,
      src: true,
      srcDoc: true,
      srcLang: true,
      srcSet: true,
      start: true,
      step: true,
      style: true,
      summary: true,
      tabIndex: true,
      target: true,
      title: true,
      type: true,
      useMap: true,
      value: true,
      width: true,
      wmode: true,
      wrap: true,
      about: true,
      datatype: true,
      inlist: true,
      prefix: true,
      property: true,
      resource: true,
      typeof: true,
      vocab: true,
      autoCapitalize: true,
      autoCorrect: true,
      autoSave: true,
      color: true,
      itemProp: true,
      itemScope: true,
      itemType: true,
      itemID: true,
      itemRef: true,
      results: true,
      security: true,
      unselectable: 0
    };
    var svgProps = {
      accentHeight: true,
      accumulate: true,
      additive: true,
      alignmentBaseline: true,
      allowReorder: true,
      alphabetic: true,
      amplitude: true,
      arabicForm: true,
      ascent: true,
      attributeName: true,
      attributeType: true,
      autoReverse: true,
      azimuth: true,
      baseFrequency: true,
      baseProfile: true,
      baselineShift: true,
      bbox: true,
      begin: true,
      bias: true,
      by: true,
      calcMode: true,
      capHeight: true,
      clip: true,
      clipPath: true,
      clipRule: true,
      clipPathUnits: true,
      colorInterpolation: true,
      colorInterpolationFilters: true,
      colorProfile: true,
      colorRendering: true,
      contentScriptType: true,
      contentStyleType: true,
      cursor: true,
      cx: true,
      cy: true,
      d: true,
      decelerate: true,
      descent: true,
      diffuseConstant: true,
      direction: true,
      display: true,
      divisor: true,
      dominantBaseline: true,
      dur: true,
      dx: true,
      dy: true,
      edgeMode: true,
      elevation: true,
      enableBackground: true,
      end: true,
      exponent: true,
      externalResourcesRequired: true,
      fill: true,
      fillOpacity: true,
      fillRule: true,
      filter: true,
      filterRes: true,
      filterUnits: true,
      floodColor: true,
      floodOpacity: true,
      focusable: true,
      fontFamily: true,
      fontSize: true,
      fontSizeAdjust: true,
      fontStretch: true,
      fontStyle: true,
      fontVariant: true,
      fontWeight: true,
      format: true,
      from: true,
      fx: true,
      fy: true,
      g1: true,
      g2: true,
      glyphName: true,
      glyphOrientationHorizontal: true,
      glyphOrientationVertical: true,
      glyphRef: true,
      gradientTransform: true,
      gradientUnits: true,
      hanging: true,
      horizAdvX: true,
      horizOriginX: true,
      ideographic: true,
      imageRendering: true,
      in: true,
      in2: true,
      intercept: true,
      k: true,
      k1: true,
      k2: true,
      k3: true,
      k4: true,
      kernelMatrix: true,
      kernelUnitLength: true,
      kerning: true,
      keyPoints: true,
      keySplines: true,
      keyTimes: true,
      lengthAdjust: true,
      letterSpacing: true,
      lightingColor: true,
      limitingConeAngle: true,
      local: true,
      markerEnd: true,
      markerMid: true,
      markerStart: true,
      markerHeight: true,
      markerUnits: true,
      markerWidth: true,
      mask: true,
      maskContentUnits: true,
      maskUnits: true,
      mathematical: true,
      mode: true,
      numOctaves: true,
      offset: true,
      opacity: true,
      operator: true,
      order: true,
      orient: true,
      orientation: true,
      origin: true,
      overflow: true,
      overlinePosition: true,
      overlineThickness: true,
      paintOrder: true,
      panose1: true,
      pathLength: true,
      patternContentUnits: true,
      patternTransform: true,
      patternUnits: true,
      pointerEvents: true,
      points: true,
      pointsAtX: true,
      pointsAtY: true,
      pointsAtZ: true,
      preserveAlpha: true,
      preserveAspectRatio: true,
      primitiveUnits: true,
      r: true,
      radius: true,
      refX: true,
      refY: true,
      renderingIntent: true,
      repeatCount: true,
      repeatDur: true,
      requiredExtensions: true,
      requiredFeatures: true,
      restart: true,
      result: true,
      rotate: true,
      rx: true,
      ry: true,
      scale: true,
      seed: true,
      shapeRendering: true,
      slope: true,
      spacing: true,
      specularConstant: true,
      specularExponent: true,
      speed: true,
      spreadMethod: true,
      startOffset: true,
      stdDeviation: true,
      stemh: true,
      stemv: true,
      stitchTiles: true,
      stopColor: true,
      stopOpacity: true,
      strikethroughPosition: true,
      strikethroughThickness: true,
      string: true,
      stroke: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeLinecap: true,
      strokeLinejoin: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true,
      surfaceScale: true,
      systemLanguage: true,
      tableValues: true,
      targetX: true,
      targetY: true,
      textAnchor: true,
      textDecoration: true,
      textRendering: true,
      textLength: true,
      to: true,
      transform: true,
      u1: true,
      u2: true,
      underlinePosition: true,
      underlineThickness: true,
      unicode: true,
      unicodeBidi: true,
      unicodeRange: true,
      unitsPerEm: true,
      vAlphabetic: true,
      vHanging: true,
      vIdeographic: true,
      vMathematical: true,
      values: true,
      vectorEffect: true,
      version: true,
      vertAdvY: true,
      vertOriginX: true,
      vertOriginY: true,
      viewBox: true,
      viewTarget: true,
      visibility: true,
      widths: true,
      wordSpacing: true,
      writingMode: true,
      x: true,
      xHeight: true,
      x1: true,
      x2: true,
      xChannelSelector: true,
      xlinkActuate: true,
      xlinkArcrole: true,
      xlinkHref: true,
      xlinkRole: true,
      xlinkShow: true,
      xlinkTitle: true,
      xlinkType: true,
      xmlBase: true,
      xmlns: true,
      xmlnsXlink: true,
      xmlLang: true,
      xmlSpace: true,
      y: true,
      y1: true,
      y2: true,
      yChannelSelector: true,
      z: true,
      zoomAndPan: true
    };
    var ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
    var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
    var isCustomAttribute = RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$'));
    var hasOwnProperty = {}.hasOwnProperty;
    var validAttr = (function(name) {
      return hasOwnProperty.call(htmlProps, name) || hasOwnProperty.call(svgProps, name) || isCustomAttribute(name.toLowerCase()) || hasOwnProperty.call(reactProps, name);
    });
    function isTag(target) {
      return typeof target === 'string';
    }
    function isStyledComponent(target) {
      return typeof target === 'function' && typeof target.styledComponentId === 'string';
    }
    function getComponentName(target) {
      return target.displayName || target.name || 'Component';
    }
    var determineTheme = (function(props, fallbackTheme, defaultProps) {
      var isDefaultTheme = defaultProps && props.theme === defaultProps.theme;
      var theme = props.theme && !isDefaultTheme ? props.theme : fallbackTheme;
      return theme;
    });
    var index$4 = isFunction;
    var toString = Object.prototype.toString;
    function isFunction(fn) {
      var string = toString.call(fn);
      return string === '[object Function]' || typeof fn === 'function' && string !== '[object RegExp]' || typeof window !== 'undefined' && (fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt);
    }
    var createBroadcast = function createBroadcast(initialState) {
      var listeners = {};
      var id = 0;
      var state = initialState;
      function publish(nextState) {
        state = nextState;
        for (var key in listeners) {
          var listener = listeners[key];
          if (listener === undefined) {
            continue;
          }
          listener(state);
        }
      }
      function subscribe(listener) {
        var currentId = id;
        listeners[currentId] = listener;
        id += 1;
        listener(state);
        return currentId;
      }
      function unsubscribe(unsubID) {
        listeners[unsubID] = undefined;
      }
      return {
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe
      };
    };
    var once = (function(cb) {
      var called = false;
      return function() {
        if (!called) {
          called = true;
          cb();
        }
      };
    });
    var _ThemeProvider$childC;
    var _ThemeProvider$contex;
    var CHANNEL = '__styled-components__';
    var CHANNEL_NEXT = CHANNEL + 'next__';
    var CONTEXT_CHANNEL_SHAPE = index$3.shape({
      getTheme: index$3.func,
      subscribe: index$3.func,
      unsubscribe: index$3.func
    });
    var warnChannelDeprecated = once(function() {
      console.error('Warning: Usage of `context.' + CHANNEL + '` as a function is deprecated. It will be replaced with the object on `.context.' + CHANNEL_NEXT + '` in a future version.');
    });
    var ThemeProvider = function(_Component) {
      inherits(ThemeProvider, _Component);
      function ThemeProvider() {
        classCallCheck(this, ThemeProvider);
        var _this = possibleConstructorReturn(this, _Component.call(this));
        _this.unsubscribeToOuterId = -1;
        _this.getTheme = _this.getTheme.bind(_this);
        return _this;
      }
      ThemeProvider.prototype.componentWillMount = function componentWillMount() {
        var _this2 = this;
        var outerContext = this.context[CHANNEL_NEXT];
        if (outerContext !== undefined) {
          this.unsubscribeToOuterId = outerContext.subscribe(function(theme) {
            _this2.outerTheme = theme;
          });
        }
        this.broadcast = createBroadcast(this.getTheme());
      };
      ThemeProvider.prototype.getChildContext = function getChildContext() {
        var _this3 = this,
            _babelHelpers$extends;
        return _extends({}, this.context, (_babelHelpers$extends = {}, _babelHelpers$extends[CHANNEL_NEXT] = {
          getTheme: this.getTheme,
          subscribe: this.broadcast.subscribe,
          unsubscribe: this.broadcast.unsubscribe
        }, _babelHelpers$extends[CHANNEL] = function(subscriber) {
          warnChannelDeprecated();
          var unsubscribeId = _this3.broadcast.subscribe(subscriber);
          return function() {
            return _this3.broadcast.unsubscribe(unsubscribeId);
          };
        }, _babelHelpers$extends));
      };
      ThemeProvider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (this.props.theme !== nextProps.theme)
          this.broadcast.publish(this.getTheme(nextProps.theme));
      };
      ThemeProvider.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.unsubscribeToOuterId !== -1) {
          this.context[CHANNEL_NEXT].unsubscribe(this.unsubscribeToOuterId);
        }
      };
      ThemeProvider.prototype.getTheme = function getTheme(passedTheme) {
        var theme = passedTheme || this.props.theme;
        if (index$4(theme)) {
          var mergedTheme = theme(this.outerTheme);
          if (!index(mergedTheme)) {
            throw new Error('[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!');
          }
          return mergedTheme;
        }
        if (!index(theme)) {
          throw new Error('[ThemeProvider] Please make your theme prop a plain object');
        }
        return _extends({}, this.outerTheme, theme);
      };
      ThemeProvider.prototype.render = function render() {
        if (!this.props.children) {
          return null;
        }
        return React__default.Children.only(this.props.children);
      };
      return ThemeProvider;
    }(React.Component);
    ThemeProvider.childContextTypes = (_ThemeProvider$childC = {}, _ThemeProvider$childC[CHANNEL] = index$3.func, _ThemeProvider$childC[CHANNEL_NEXT] = CONTEXT_CHANNEL_SHAPE, _ThemeProvider$childC);
    ThemeProvider.contextTypes = (_ThemeProvider$contex = {}, _ThemeProvider$contex[CHANNEL_NEXT] = CONTEXT_CHANNEL_SHAPE, _ThemeProvider$contex);
    var escapeRegex = /[[\].#*$><+~=|^:(),"'`]/g;
    var multiDashRegex = /--+/g;
    var STATIC_EXECUTION_CONTEXT = {};
    var _StyledComponent = (function(ComponentStyle, constructWithOptions) {
      var identifiers = {};
      var generateId = function generateId(_displayName, parentComponentId) {
        var displayName = typeof _displayName !== 'string' ? 'sc' : _displayName.replace(escapeRegex, '-').replace(multiDashRegex, '-');
        var nr = (identifiers[displayName] || 0) + 1;
        identifiers[displayName] = nr;
        var hash = ComponentStyle.generateName(displayName + nr);
        var componentId = displayName + '-' + hash;
        return parentComponentId !== undefined ? parentComponentId + '-' + componentId : componentId;
      };
      var BaseStyledComponent = function(_Component) {
        inherits(BaseStyledComponent, _Component);
        function BaseStyledComponent() {
          var _temp,
              _this,
              _ret;
          classCallCheck(this, BaseStyledComponent);
          for (var _len = arguments.length,
              args = Array(_len),
              _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.attrs = {}, _this.state = {
            theme: null,
            generatedClassName: ''
          }, _this.unsubscribeId = -1, _temp), possibleConstructorReturn(_this, _ret);
        }
        BaseStyledComponent.prototype.unsubscribeFromContext = function unsubscribeFromContext() {
          if (this.unsubscribeId !== -1) {
            this.context[CHANNEL_NEXT].unsubscribe(this.unsubscribeId);
          }
        };
        BaseStyledComponent.prototype.buildExecutionContext = function buildExecutionContext(theme, props) {
          var attrs = this.constructor.attrs;
          var context = _extends({}, props, {theme: theme});
          if (attrs === undefined) {
            return context;
          }
          this.attrs = Object.keys(attrs).reduce(function(acc, key) {
            var attr = attrs[key];
            acc[key] = typeof attr === 'function' ? attr(context) : attr;
            return acc;
          }, {});
          return _extends({}, context, this.attrs);
        };
        BaseStyledComponent.prototype.generateAndInjectStyles = function generateAndInjectStyles(theme, props) {
          var _constructor = this.constructor,
              attrs = _constructor.attrs,
              componentStyle = _constructor.componentStyle,
              warnTooManyClasses = _constructor.warnTooManyClasses;
          var styleSheet = this.context[CONTEXT_KEY] || StyleSheet.instance;
          if (componentStyle.isStatic && attrs === undefined) {
            return componentStyle.generateAndInjectStyles(STATIC_EXECUTION_CONTEXT, styleSheet);
          } else {
            var executionContext = this.buildExecutionContext(theme, props);
            var className = componentStyle.generateAndInjectStyles(executionContext, styleSheet);
            if (warnTooManyClasses !== undefined)
              warnTooManyClasses(className);
            return className;
          }
        };
        BaseStyledComponent.prototype.componentWillMount = function componentWillMount() {
          var _this2 = this;
          var componentStyle = this.constructor.componentStyle;
          var styledContext = this.context[CHANNEL_NEXT];
          if (componentStyle.isStatic) {
            var generatedClassName = this.generateAndInjectStyles(STATIC_EXECUTION_CONTEXT, this.props);
            this.setState({generatedClassName: generatedClassName});
          } else if (styledContext !== undefined) {
            var subscribe = styledContext.subscribe;
            this.unsubscribeId = subscribe(function(nextTheme) {
              var theme = determineTheme(_this2.props, nextTheme, _this2.constructor.defaultProps);
              var generatedClassName = _this2.generateAndInjectStyles(theme, _this2.props);
              _this2.setState({
                theme: theme,
                generatedClassName: generatedClassName
              });
            });
          } else {
            var theme = this.props.theme || {};
            var _generatedClassName = this.generateAndInjectStyles(theme, this.props);
            this.setState({
              theme: theme,
              generatedClassName: _generatedClassName
            });
          }
        };
        BaseStyledComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
          var _this3 = this;
          var componentStyle = this.constructor.componentStyle;
          if (componentStyle.isStatic) {
            return;
          }
          this.setState(function(oldState) {
            var theme = determineTheme(nextProps, oldState.theme, _this3.constructor.defaultProps);
            var generatedClassName = _this3.generateAndInjectStyles(theme, nextProps);
            return {
              theme: theme,
              generatedClassName: generatedClassName
            };
          });
        };
        BaseStyledComponent.prototype.componentWillUnmount = function componentWillUnmount() {
          this.unsubscribeFromContext();
        };
        BaseStyledComponent.prototype.render = function render() {
          var _this4 = this;
          var innerRef = this.props.innerRef;
          var generatedClassName = this.state.generatedClassName;
          var _constructor2 = this.constructor,
              styledComponentId = _constructor2.styledComponentId,
              target = _constructor2.target;
          var isTargetTag = isTag(target);
          var className = [this.props.className, styledComponentId, this.attrs.className, generatedClassName].filter(Boolean).join(' ');
          var baseProps = _extends({}, this.attrs, {className: className});
          if (isStyledComponent(target)) {
            baseProps.innerRef = innerRef;
          } else {
            baseProps.ref = innerRef;
          }
          var propsForElement = Object.keys(this.props).reduce(function(acc, propName) {
            if (propName !== 'innerRef' && propName !== 'className' && (!isTargetTag || validAttr(propName))) {
              acc[propName] = _this4.props[propName];
            }
            return acc;
          }, baseProps);
          return React.createElement(target, propsForElement);
        };
        return BaseStyledComponent;
      }(React.Component);
      var createStyledComponent = function createStyledComponent(target, options, rules) {
        var _StyledComponent$cont;
        var _options$displayName = options.displayName,
            displayName = _options$displayName === undefined ? isTag(target) ? 'styled.' + target : 'Styled(' + getComponentName(target) + ')' : _options$displayName,
            _options$componentId = options.componentId,
            componentId = _options$componentId === undefined ? generateId(options.displayName, options.parentComponentId) : _options$componentId,
            _options$ParentCompon = options.ParentComponent,
            ParentComponent = _options$ParentCompon === undefined ? BaseStyledComponent : _options$ParentCompon,
            extendingRules = options.rules,
            attrs = options.attrs;
        var styledComponentId = options.displayName && options.componentId ? options.displayName + '-' + options.componentId : componentId;
        var warnTooManyClasses = void 0;
        if (process.env.NODE_ENV !== 'production') {
          warnTooManyClasses = createWarnTooManyClasses(displayName);
        }
        var componentStyle = new ComponentStyle(extendingRules === undefined ? rules : extendingRules.concat(rules), attrs, styledComponentId);
        var StyledComponent = function(_ParentComponent) {
          inherits(StyledComponent, _ParentComponent);
          function StyledComponent() {
            classCallCheck(this, StyledComponent);
            return possibleConstructorReturn(this, _ParentComponent.apply(this, arguments));
          }
          StyledComponent.withComponent = function withComponent(tag) {
            var previousComponentId = options.componentId,
                optionsToCopy = objectWithoutProperties(options, ['componentId']);
            var newComponentId = previousComponentId && previousComponentId + '-' + (isTag(tag) ? tag : getComponentName(tag));
            var newOptions = _extends({}, optionsToCopy, {
              componentId: newComponentId,
              ParentComponent: StyledComponent
            });
            return createStyledComponent(tag, newOptions, rules);
          };
          createClass(StyledComponent, null, [{
            key: 'extend',
            get: function get$$1() {
              var rulesFromOptions = options.rules,
                  parentComponentId = options.componentId,
                  optionsToCopy = objectWithoutProperties(options, ['rules', 'componentId']);
              var newRules = rulesFromOptions === undefined ? rules : rulesFromOptions.concat(rules);
              var newOptions = _extends({}, optionsToCopy, {
                rules: newRules,
                parentComponentId: parentComponentId,
                ParentComponent: StyledComponent
              });
              return constructWithOptions(createStyledComponent, target, newOptions);
            }
          }]);
          return StyledComponent;
        }(ParentComponent);
        StyledComponent.contextTypes = (_StyledComponent$cont = {}, _StyledComponent$cont[CHANNEL] = index$3.func, _StyledComponent$cont[CHANNEL_NEXT] = CONTEXT_CHANNEL_SHAPE, _StyledComponent$cont[CONTEXT_KEY] = index$3.oneOfType([index$3.instanceOf(StyleSheet), index$3.instanceOf(ServerStyleSheet)]), _StyledComponent$cont);
        StyledComponent.displayName = displayName;
        StyledComponent.styledComponentId = styledComponentId;
        StyledComponent.attrs = attrs;
        StyledComponent.componentStyle = componentStyle;
        StyledComponent.warnTooManyClasses = warnTooManyClasses;
        StyledComponent.target = target;
        return StyledComponent;
      };
      return createStyledComponent;
    });
    function doHash(str, seed) {
      var m = 0x5bd1e995;
      var r = 24;
      var h = seed ^ str.length;
      var length = str.length;
      var currentIndex = 0;
      while (length >= 4) {
        var k = UInt32(str, currentIndex);
        k = Umul32(k, m);
        k ^= k >>> r;
        k = Umul32(k, m);
        h = Umul32(h, m);
        h ^= k;
        currentIndex += 4;
        length -= 4;
      }
      switch (length) {
        case 3:
          h ^= UInt16(str, currentIndex);
          h ^= str.charCodeAt(currentIndex + 2) << 16;
          h = Umul32(h, m);
          break;
        case 2:
          h ^= UInt16(str, currentIndex);
          h = Umul32(h, m);
          break;
        case 1:
          h ^= str.charCodeAt(currentIndex);
          h = Umul32(h, m);
          break;
      }
      h ^= h >>> 13;
      h = Umul32(h, m);
      h ^= h >>> 15;
      return h >>> 0;
    }
    function UInt32(str, pos) {
      return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8) + (str.charCodeAt(pos++) << 16) + (str.charCodeAt(pos) << 24);
    }
    function UInt16(str, pos) {
      return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8);
    }
    function Umul32(n, m) {
      n = n | 0;
      m = m | 0;
      var nlo = n & 0xffff;
      var nhi = n >>> 16;
      var res = nlo * m + ((nhi * m & 0xffff) << 16) | 0;
      return res;
    }
    var isStaticRules = function isStaticRules(rules, attrs) {
      for (var i = 0; i < rules.length; i += 1) {
        var rule = rules[i];
        if (Array.isArray(rule) && !isStaticRules(rule)) {
          return false;
        } else if (typeof rule === 'function' && !isStyledComponent(rule)) {
          return false;
        }
      }
      if (attrs !== undefined) {
        for (var key in attrs) {
          var value = attrs[key];
          if (typeof value === 'function') {
            return false;
          }
        }
      }
      return true;
    };
    var isHRMEnabled = typeof module !== 'undefined' && module.hot && process.env.NODE_ENV !== 'production';
    var _ComponentStyle = (function(nameGenerator, flatten, stringifyRules) {
      var ComponentStyle = function() {
        function ComponentStyle(rules, attrs, componentId) {
          classCallCheck(this, ComponentStyle);
          this.rules = rules;
          this.isStatic = !isHRMEnabled && isStaticRules(rules, attrs);
          this.componentId = componentId;
          if (!StyleSheet.instance.hasInjectedComponent(this.componentId)) {
            var placeholder = process.env.NODE_ENV !== 'production' ? '.' + componentId + ' {}' : '';
            StyleSheet.instance.deferredInject(componentId, true, placeholder);
          }
        }
        ComponentStyle.prototype.generateAndInjectStyles = function generateAndInjectStyles(executionContext, styleSheet) {
          var isStatic = this.isStatic,
              lastClassName = this.lastClassName;
          if (isStatic && lastClassName !== undefined) {
            return lastClassName;
          }
          var flatCSS = flatten(this.rules, executionContext);
          var hash = doHash(this.componentId + flatCSS.join(''));
          var existingName = styleSheet.getName(hash);
          if (existingName !== undefined) {
            if (styleSheet.stylesCacheable) {
              this.lastClassName = existingName;
            }
            return existingName;
          }
          var name = nameGenerator(hash);
          if (styleSheet.stylesCacheable) {
            this.lastClassName = existingName;
          }
          if (styleSheet.alreadyInjected(hash, name)) {
            return name;
          }
          var css = '\n' + stringifyRules(flatCSS, '.' + name);
          styleSheet.inject(this.componentId, true, css, hash, name);
          return name;
        };
        ComponentStyle.generateName = function generateName(str) {
          return nameGenerator(doHash(str));
        };
        return ComponentStyle;
      }();
      return ComponentStyle;
    });
    var domElements = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'circle', 'clipPath', 'defs', 'ellipse', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];
    var _styled = (function(styledComponent, constructWithOptions) {
      var styled = function styled(tag) {
        return constructWithOptions(styledComponent, tag);
      };
      domElements.forEach(function(domElement) {
        styled[domElement] = styled(domElement);
      });
      return styled;
    });
    var replaceWhitespace = function replaceWhitespace(str) {
      return str.replace(/\s|\\n/g, '');
    };
    var _keyframes = (function(nameGenerator, stringifyRules, css) {
      return function(strings) {
        for (var _len = arguments.length,
            interpolations = Array(_len > 1 ? _len - 1 : 0),
            _key = 1; _key < _len; _key++) {
          interpolations[_key - 1] = arguments[_key];
        }
        var rules = css.apply(undefined, [strings].concat(interpolations));
        var hash = doHash(replaceWhitespace(JSON.stringify(rules)));
        var existingName = StyleSheet.instance.getName(hash);
        if (existingName)
          return existingName;
        var name = nameGenerator(hash);
        if (StyleSheet.instance.alreadyInjected(hash, name))
          return name;
        var generatedCSS = stringifyRules(rules, name, '@keyframes');
        StyleSheet.instance.inject('sc-keyframes-' + name, true, generatedCSS, hash, name);
        return name;
      };
    });
    var _injectGlobal = (function(stringifyRules, css) {
      var injectGlobal = function injectGlobal(strings) {
        for (var _len = arguments.length,
            interpolations = Array(_len > 1 ? _len - 1 : 0),
            _key = 1; _key < _len; _key++) {
          interpolations[_key - 1] = arguments[_key];
        }
        var rules = css.apply(undefined, [strings].concat(interpolations));
        var hash = doHash(JSON.stringify(rules));
        var componentId = 'sc-global-' + hash;
        if (StyleSheet.instance.hasInjectedComponent(componentId))
          return;
        StyleSheet.instance.inject(componentId, false, stringifyRules(rules));
      };
      return injectGlobal;
    });
    var _constructWithOptions = (function(css) {
      var constructWithOptions = function constructWithOptions(componentConstructor, tag) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        if (typeof tag !== 'string' && typeof tag !== 'function') {
          throw new Error('Cannot create styled-component for component: ' + tag);
        }
        var templateFunction = function templateFunction(strings) {
          for (var _len = arguments.length,
              interpolations = Array(_len > 1 ? _len - 1 : 0),
              _key = 1; _key < _len; _key++) {
            interpolations[_key - 1] = arguments[_key];
          }
          return componentConstructor(tag, options, css.apply(undefined, [strings].concat(interpolations)));
        };
        templateFunction.withConfig = function(config) {
          return constructWithOptions(componentConstructor, tag, _extends({}, options, config));
        };
        templateFunction.attrs = function(attrs) {
          return constructWithOptions(componentConstructor, tag, _extends({}, options, {attrs: _extends({}, options.attrs || {}, attrs)}));
        };
        return templateFunction;
      };
      return constructWithOptions;
    });
    var REACT_STATICS = {
      childContextTypes: true,
      contextTypes: true,
      defaultProps: true,
      displayName: true,
      getDefaultProps: true,
      mixins: true,
      propTypes: true,
      type: true
    };
    var KNOWN_STATICS = {
      name: true,
      length: true,
      prototype: true,
      caller: true,
      arguments: true,
      arity: true
    };
    var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';
    var index$5 = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
      if (typeof sourceComponent !== 'string') {
        var keys = Object.getOwnPropertyNames(sourceComponent);
        if (isGetOwnPropertySymbolsAvailable) {
          keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
        }
        for (var i = 0; i < keys.length; ++i) {
          if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
            try {
              targetComponent[keys[i]] = sourceComponent[keys[i]];
            } catch (error) {}
          }
        }
      }
      return targetComponent;
    };
    var wrapWithTheme = function wrapWithTheme(Component$$1) {
      var _WithTheme$contextTyp;
      var componentName = Component$$1.displayName || Component$$1.name || 'Component';
      var isStyledComponent$$1 = isStyledComponent(Component$$1);
      var WithTheme = function(_React$Component) {
        inherits(WithTheme, _React$Component);
        function WithTheme() {
          var _temp,
              _this,
              _ret;
          classCallCheck(this, WithTheme);
          for (var _len = arguments.length,
              args = Array(_len),
              _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return _ret = (_temp = (_this = possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {}, _this.unsubscribeId = -1, _temp), possibleConstructorReturn(_this, _ret);
        }
        WithTheme.prototype.componentWillMount = function componentWillMount() {
          var _this2 = this;
          var defaultProps = this.constructor.defaultProps;
          var styledContext = this.context[CHANNEL_NEXT];
          var themeProp = determineTheme(this.props, undefined, defaultProps);
          if (styledContext === undefined && themeProp === undefined && process.env.NODE_ENV !== 'production') {
            console.warn('[withTheme] You are not using a ThemeProvider nor passing a theme prop or a theme in defaultProps');
          } else if (styledContext === undefined && themeProp !== undefined) {
            this.setState({theme: themeProp});
          } else {
            var subscribe = styledContext.subscribe;
            this.unsubscribeId = subscribe(function(nextTheme) {
              var theme = determineTheme(_this2.props, nextTheme, defaultProps);
              _this2.setState({theme: theme});
            });
          }
        };
        WithTheme.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
          var defaultProps = this.constructor.defaultProps;
          this.setState(function(oldState) {
            var theme = determineTheme(nextProps, oldState.theme, defaultProps);
            return {theme: theme};
          });
        };
        WithTheme.prototype.componentWillUnmount = function componentWillUnmount() {
          if (this.unsubscribeId !== -1) {
            this.context[CHANNEL_NEXT].unsubscribe(this.unsubscribeId);
          }
        };
        WithTheme.prototype.render = function render() {
          var innerRef = this.props.innerRef;
          var theme = this.state.theme;
          return React__default.createElement(Component$$1, _extends({theme: theme}, this.props, {
            innerRef: isStyledComponent$$1 ? innerRef : undefined,
            ref: isStyledComponent$$1 ? undefined : innerRef
          }));
        };
        return WithTheme;
      }(React__default.Component);
      WithTheme.displayName = 'WithTheme(' + componentName + ')';
      WithTheme.styledComponentId = 'withTheme';
      WithTheme.contextTypes = (_WithTheme$contextTyp = {}, _WithTheme$contextTyp[CHANNEL] = index$3.func, _WithTheme$contextTyp[CHANNEL_NEXT] = CONTEXT_CHANNEL_SHAPE, _WithTheme$contextTyp);
      return index$5(WithTheme, Component$$1);
    };
    var ComponentStyle = _ComponentStyle(generateAlphabeticName, flatten, stringifyRules);
    var constructWithOptions = _constructWithOptions(css);
    var StyledComponent = _StyledComponent(ComponentStyle, constructWithOptions);
    var keyframes = _keyframes(generateAlphabeticName, stringifyRules, css);
    var injectGlobal = _injectGlobal(stringifyRules, css);
    var styled = _styled(StyledComponent, constructWithOptions);
    exports['default'] = styled;
    exports.css = css;
    exports.keyframes = keyframes;
    exports.injectGlobal = injectGlobal;
    exports.ThemeProvider = ThemeProvider;
    exports.withTheme = wrapWithTheme;
    exports.ServerStyleSheet = ServerStyleSheet;
    exports.StyleSheetManager = StyleSheetManager;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
