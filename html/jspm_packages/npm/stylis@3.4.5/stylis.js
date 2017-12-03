/* */ 
(function(process) {
  (function(factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? (module['exports'] = factory(null)) : typeof define === 'function' && define['amd'] ? define(factory(null)) : (window['stylis'] = factory(null));
  }(function factory(options) {
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
    var supportsptn = /\(\s*(.*)\s*\)/g;
    var propertyptn = /([^]*?);/g;
    var selfptn = /-self|flex-/g;
    var pseudofmt = /[^]*?(:[rp][el]a[\w-]+)[^]*/;
    var trimptn = /[ \t]+$/;
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
    var PAGE = 112;
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
        if (caret === eol) {
          if (comment + quote + parentheses + bracket !== 0) {
            if (comment !== 0) {
              code = comment === FOWARDSLASH ? NEWLINE : FOWARDSLASH;
            }
            quote = parentheses = bracket = 0;
            eof++;
            eol++;
          }
        }
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
              case CLOSEBRACES:
              case SEMICOLON:
              case DOUBLEQUOTE:
              case SINGLEQUOTE:
              case OPENPARENTHESES:
              case CLOSEPARENTHESES:
              case COMMA:
                {
                  insert = 0;
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
                  insert = 0;
                  length = caret;
                  first = code;
                  caret--;
                  code = SEMICOLON;
                  while (length < eof) {
                    switch (body.charCodeAt(++length)) {
                      case NEWLINE:
                      case CARRIAGE:
                      case SEMICOLON:
                        {
                          caret++;
                          code = first;
                        }
                      case COLON:
                      case OPENBRACES:
                        {
                          length = eof;
                        }
                    }
                  }
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
                        case DASH:
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
                          case DASH:
                            {
                              child = chars + '{' + child + '}';
                              break;
                            }
                          case KEYFRAME:
                            {
                              chars = chars.replace(keyframeptn, '$1 $2' + (keyed > 0 ? key : ''));
                              child = chars + '{' + child + '}';
                              if (prefix === 1 || (prefix === 2 && vendor('@' + child, 3))) {
                                child = '@' + webkit + child + '@' + child;
                              } else {
                                child = '@' + child;
                              }
                              break;
                            }
                          default:
                            {
                              child = chars + child;
                              if (id === PAGE) {
                                child = (out += child, '');
                              }
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
                    if ((first === DASH || first > 96 && first < 123)) {
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
              } else if (cascade + context === 0) {
                format = 1;
                chars += '\0';
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
                    if (quote + bracket + comment === 0) {
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
                      quote = quote === code ? 0 : (quote === 0 ? code : quote);
                    }
                    break;
                  }
                case SINGLEQUOTE:
                  {
                    if (comment === 0) {
                      quote = quote === code ? 0 : (quote === 0 ? code : quote);
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
                    case TAB:
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
                if (code !== SPACE && code !== TAB) {
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
        if (length === 0 && children.length === 0 && (current[0].length === 0) === false) {
          if (id !== MEDIA || (current.length === 1 && (cascade > 0 ? nscopealt : nscope) === current[0])) {
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
                out = (out.replace(plcholdrptn, '::' + webkit + 'input-$1') + out.replace(plcholdrptn, '::' + moz + '$1') + out.replace(plcholdrptn, ':' + ms + 'input-$1') + out);
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
      var hash = (first * 2) + (second * 3) + (third * 4);
      var cache;
      if (hash === 944) {
        return animation(out);
      } else if (prefix === 0 || (prefix === 2 && !vendor(out, 1))) {
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
        case 1009:
          {
            if (out.charCodeAt(4) !== 100) {
              break;
            }
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
            if (out.charCodeAt(4) === DASH) {
              switch (out.charCodeAt(5)) {
                case 103:
                  {
                    return webkit + 'box-' + out.replace('-grow', '') + webkit + out + ms + out.replace('grow', 'positive') + out;
                  }
                case 115:
                  {
                    return webkit + out + ms + out.replace('shrink', 'negative') + out;
                  }
                case 98:
                  {
                    return webkit + out + ms + out.replace('basis', 'preferred-size') + out;
                  }
              }
            }
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
                  out = (out.replace(cache, webkit + (hash > 102 ? 'inline-' : '') + 'box') + ';' + out.replace(cache, webkit + cache) + ';' + out.replace(cache, ms + cache + 'box') + ';' + out);
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
                if (keyed === 1 && ((peak > AT && peak < 90) || (peak > 96 && peak < 123) || peak === UNDERSCORE || (peak === DASH && value.charCodeAt(1) !== DASH))) {
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
      if (prefix === 1 || (prefix === 2 && vendor(out, 1)))
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
    function set(options) {
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
      return set;
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
    stylis['set'] = set;
    if (options !== void 0) {
      set(options);
    }
    return stylis;
  }));
})(require('process'));
