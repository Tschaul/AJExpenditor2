/* */ 
"format cjs";
(function(process) {
  (function(root) {
    var registeredComponents = [];
    var handlers = [];
    var IGNORE_CLASS = 'ignore-react-onclickoutside';
    var DEFAULT_EVENTS = ['mousedown', 'touchstart'];
    var isNodeFound = function(current, componentNode, ignoreClass) {
      if (current === componentNode) {
        return true;
      }
      if (current.correspondingElement) {
        return current.correspondingElement.classList.contains(ignoreClass);
      }
      return current.classList.contains(ignoreClass);
    };
    var findHighest = function(current, componentNode, ignoreClass) {
      if (current === componentNode) {
        return true;
      }
      while (current.parentNode) {
        if (isNodeFound(current, componentNode, ignoreClass)) {
          return true;
        }
        current = current.parentNode;
      }
      return current;
    };
    var clickedScrollbar = function(evt) {
      return document.documentElement.clientWidth <= evt.clientX || document.documentElement.clientHeight <= evt.clientY;
    };
    var generateOutsideCheck = function(componentNode, componentInstance, eventHandler, ignoreClass, excludeScrollbar, preventDefault, stopPropagation) {
      return function(evt) {
        if (preventDefault) {
          evt.preventDefault();
        }
        if (stopPropagation) {
          evt.stopPropagation();
        }
        var current = evt.target;
        if ((excludeScrollbar && clickedScrollbar(evt)) || (findHighest(current, componentNode, ignoreClass) !== document)) {
          return;
        }
        eventHandler(evt);
      };
    };
    function setupHOC(root, React, ReactDOM, createReactClass) {
      return function onClickOutsideHOC(Component, config) {
        var wrapComponentWithOnClickOutsideHandling = createReactClass({
          statics: {getClass: function() {
              if (Component.getClass) {
                return Component.getClass();
              }
              return Component;
            }},
          getInstance: function() {
            return Component.prototype.isReactComponent ? this.refs.instance : this;
          },
          __outsideClickHandler: function() {},
          getDefaultProps: function() {
            return {excludeScrollbar: config && config.excludeScrollbar};
          },
          componentDidMount: function() {
            if (typeof document === 'undefined' || !document.createElement) {
              return;
            }
            var instance = this.getInstance();
            var clickOutsideHandler;
            if (config && typeof config.handleClickOutside === 'function') {
              clickOutsideHandler = config.handleClickOutside(instance);
              if (typeof clickOutsideHandler !== 'function') {
                throw new Error('Component lacks a function for processing outside click events specified by the handleClickOutside config option.');
              }
            } else if (typeof instance.handleClickOutside === 'function') {
              if (React.Component.prototype.isPrototypeOf(instance)) {
                clickOutsideHandler = instance.handleClickOutside.bind(instance);
              } else {
                clickOutsideHandler = instance.handleClickOutside;
              }
            } else if (typeof instance.props.handleClickOutside === 'function') {
              clickOutsideHandler = instance.props.handleClickOutside;
            } else {
              throw new Error('Component lacks a handleClickOutside(event) function for processing outside click events.');
            }
            var componentNode = ReactDOM.findDOMNode(instance);
            if (componentNode === null) {
              console.warn('Antipattern warning: there was no DOM node associated with the component that is being wrapped by outsideClick.');
              console.warn(['This is typically caused by having a component that starts life with a render function that', 'returns `null` (due to a state or props value), so that the component \'exist\' in the React', 'chain of components, but not in the DOM.\n\nInstead, you need to refactor your code so that the', 'decision of whether or not to show your component is handled by the parent, in their render()', 'function.\n\nIn code, rather than:\n\n  A{render(){return check? <.../> : null;}\n  B{render(){<A check=... />}\n\nmake sure that you', 'use:\n\n  A{render(){return <.../>}\n  B{render(){return <...>{ check ? <A/> : null }<...>}}\n\nThat is:', 'the parent is always responsible for deciding whether or not to render any of its children.', 'It is not the child\'s responsibility to decide whether a render instruction from above should', 'get ignored or not by returning `null`.\n\nWhen any component gets its render() function called,', 'that is the signal that it should be rendering its part of the UI. It may in turn decide not to', 'render all of *its* children, but it should never return `null` for itself. It is not responsible', 'for that decision.'].join(' '));
            }
            var fn = this.__outsideClickHandler = generateOutsideCheck(componentNode, instance, clickOutsideHandler, this.props.outsideClickIgnoreClass || IGNORE_CLASS, this.props.excludeScrollbar, this.props.preventDefault || false, this.props.stopPropagation || false);
            var pos = registeredComponents.length;
            registeredComponents.push(this);
            handlers[pos] = fn;
            if (!this.props.disableOnClickOutside) {
              this.enableOnClickOutside();
            }
          },
          componentWillReceiveProps: function(nextProps) {
            if (this.props.disableOnClickOutside && !nextProps.disableOnClickOutside) {
              this.enableOnClickOutside();
            } else if (!this.props.disableOnClickOutside && nextProps.disableOnClickOutside) {
              this.disableOnClickOutside();
            }
          },
          componentWillUnmount: function() {
            this.disableOnClickOutside();
            this.__outsideClickHandler = false;
            var pos = registeredComponents.indexOf(this);
            if (pos > -1) {
              if (handlers[pos]) {
                handlers.splice(pos, 1);
              }
              registeredComponents.splice(pos, 1);
            }
          },
          enableOnClickOutside: function() {
            var fn = this.__outsideClickHandler;
            if (typeof document !== 'undefined') {
              var events = this.props.eventTypes || DEFAULT_EVENTS;
              if (!events.forEach) {
                events = [events];
              }
              events.forEach(function(eventName) {
                document.addEventListener(eventName, fn);
              });
            }
          },
          disableOnClickOutside: function() {
            var fn = this.__outsideClickHandler;
            if (typeof document !== 'undefined') {
              var events = this.props.eventTypes || DEFAULT_EVENTS;
              if (!events.forEach) {
                events = [events];
              }
              events.forEach(function(eventName) {
                document.removeEventListener(eventName, fn);
              });
            }
          },
          render: function() {
            var passedProps = this.props;
            var props = {};
            Object.keys(this.props).forEach(function(key) {
              if (key !== 'excludeScrollbar') {
                props[key] = passedProps[key];
              }
            });
            if (Component.prototype.isReactComponent) {
              props.ref = 'instance';
            }
            props.disableOnClickOutside = this.disableOnClickOutside;
            props.enableOnClickOutside = this.enableOnClickOutside;
            return React.createElement(Component, props);
          }
        });
        (function bindWrappedComponentName(c, wrapper) {
          var componentName = c.displayName || c.name || 'Component';
          wrapper.displayName = 'OnClickOutside(' + componentName + ')';
        }(Component, wrapComponentWithOnClickOutsideHandling));
        return wrapComponentWithOnClickOutsideHandling;
      };
    }
    function setupBinding(root, factory) {
      if (typeof define === 'function' && define.amd) {
        define(['react', 'react-dom', 'create-react-class'], function(React, ReactDom, createReactClass) {
          if (!createReactClass)
            createReactClass = React.createClass;
          return factory(root, React, ReactDom, createReactClass);
        });
      } else if (typeof exports === 'object') {
        module.exports = factory(root, require('react'), require('react-dom'), require('create-react-class'));
      } else {
        var createReactClass = React.createClass ? React.createClass : window.createReactClass;
        root.onClickOutside = factory(root, React, ReactDOM, createReactClass);
      }
    }
    setupBinding(root, setupHOC);
  }(this));
})(require('process'));
