(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.createMachine = factory());
}(this, (function () { 'use strict';

  const delimiter = '.';
  const statesProp = 'states';

  var underscoreGet = function get(obj, desc, value) {
    var arr = desc ? desc.split(".") : [];

    while (arr.length && obj) {
      var comp = arr.shift();
      var match = new RegExp("(.+)\\[([0-9]*)\\]").exec(comp);

      // handle arrays
      if ((match !== null) && (match.length == 3)) {
        var arrayData = {
          arrName: match[1],
          arrIndex: match[2]
        };
        if (obj[arrayData.arrName] !== undefined) {
          obj = obj[arrayData.arrName][arrayData.arrIndex];
        } else {
          obj = undefined;
        }

        continue;
      }

      obj = obj[comp];
    }

    if (typeof value !== 'undefined') {
      if (obj === undefined) {
        return value;
      }
    }

    return obj;
  };

  var underscore_get = {
      get: underscoreGet
  };
  var underscore_get_1 = underscore_get.get;

  const getPathChunks = str => str.split(delimiter);

  const buildDefinitionPath = str => {
    const chunks = getPathChunks(str);
    return chunks.flatMap(chunk => [statesProp, chunk]).join('.');
  };

  const resolveState = (definition = {}, path = '') => {
    const definitionPath = buildDefinitionPath(path);
    return underscore_get_1(definition, definitionPath);
  };

  const getStateByEvent = (currentStateDefinition, event) =>
    Object.values(currentStateDefinition.states).find(({ on = {} }) => on[event]);

  function createMachine(definition) {
    const { initial } = definition;
    const machine = {
      value: initial,
      transition(event) {
        const currentState = machine.value;
        const currentStateDefinition = resolveState(definition, currentState);

        // Inner machine error, kind of 500
        if (!currentStateDefinition) {
          // TODO - move to setState
          throw new Error('Machine error, cannot find:', currentState);
        }

        let targetStateTransition;

        // Got into nested state
        if (currentStateDefinition.states) {
          const state = getStateByEvent(currentStateDefinition, event);

          targetStateTransition = state && state.on[event];
        } else {
          // Simple flat state
          targetStateTransition = currentStateDefinition?.on[event];
        }

        // Configuration error, kind of 400
        if (!targetStateTransition) {
          // TODO - extend error from MachineError class
          throw new Error(`Bad transition ${event} from ${currentState}`);
        }

        // Update machine state, state can be nested: 'a.b.c'
        machine.value = targetStateTransition;

        return machine.value;
      },
    };

    return machine;
  }

  return createMachine;

})));
