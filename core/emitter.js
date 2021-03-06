import EventEmitter from 'eventemitter3';
import logger from './logger';

let debug = logger('quill:events');

const EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];

EVENTS.forEach(function(eventName) {
  document.addEventListener(eventName, (...args) => {
    [].slice.call(document.querySelectorAll('.ql-container')).forEach((node) => {
      // TODO use WeakMap
      if (node.__quill && node.__quill.emitter) {
        node.__quill.emitter.handleDOM(...args);
      }
    });
  });
});


class Emitter extends EventEmitter {
  constructor() {
    super();
    this.listeners = {};
    this.on('error', debug.error);
  }

  emit() {
    debug.log.apply(debug, arguments);
    super.emit.apply(this, arguments);
  }

  handleDOM(event, ...args) {
    (this.listeners[event.type] || []).forEach(function({ node, handler }) {
      if (event.target === node || node.contains(event.target)) {
        handler(event, ...args);
      }
    });
  }

  listenDOM(eventName, node, handler) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push({ node, handler })
  }
}

Emitter.events = {
  EDITOR_CHANGE          : 'editor-change',
  SCROLL_BEFORE_UPDATE   : 'scroll-before-update',
  SCROLL_UPDATE          : 'scroll-update',
  SCROLL_AFTER_UPDATE    : 'scroll-after-update',
  SCROLL_BEFORE_OPTIMIZE : 'scroll-before-optimize',
  SCROLL_OPTIMIZE        : 'scroll-optimize',
  SCROLL_AFTER_OPTIMIZE  : 'scroll-after-optimize',
  SELECTION_CHANGE       : 'selection-change',
  TEXT_CHANGE            : 'text-change'
};
Emitter.sources = {
  API    : 'api',
  SILENT : 'silent',
  USER   : 'user'
};


export default Emitter;
