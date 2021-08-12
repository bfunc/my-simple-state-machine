import { get } from 'underscore.get';

const delimiter = '.';
const statesProp = 'states';

const getPathChunks = str => str.split(delimiter);

const buildDefinitionPath = str => {
  const chunks = getPathChunks(str);
  return chunks.flatMap(chunk => [statesProp, chunk]).join('.');
};

const resolveState = (definition = {}, path = '') => {
  const definitionPath = buildDefinitionPath(path);
  return get(definition, definitionPath);
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

export default createMachine;
