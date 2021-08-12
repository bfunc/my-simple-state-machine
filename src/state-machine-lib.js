import { get } from 'underscore.get';

export default function createMachine(definition) {
  const { initial } = definition;
  const machine = {
    value: initial,
    transition(event) {
      const currentState = machine.value;
      const currentStateDefinition = resolveState(definition, currentState);

      if (!currentStateDefinition) {
        throw new Error('Bad state ' + event + ' at ' + currentState);
      }
      console.log('> ', event, JSON.stringify(currentStateDefinition));

      if (currentStateDefinition.states) {
        const currentLocalState =
          currentStateDefinition.value || currentStateDefinition.initial;

        const destinationTransitionName =
          currentStateDefinition.states[currentLocalState]?.on[event];

        if (!destinationTransitionName) {
          throw new Error(event + ' does not exist in ' + currentState);
        }
        machine.value = [destinationTransitionName, currentLocalState].join(
          '.'
        );
        //  machine.value = { [currentLocalState]: destinationTransitionName };
      } else {
        const destinationTransitionName = currentStateDefinition?.on[event];
        if (!destinationTransitionName) {
          throw new Error(event + ' does not exist in ' + currentState);
        }
        machine.value = destinationTransitionName;
      }
      console.log('< ', machine.value);
      return machine.value;
    },
  };
  return machine;
}

const getPathChunks = str => str.split(delimiter);
const buildDefinitionPath = str => {
  const chunks = getPathChunks(str);
  return chunks.flatMap(chunk => [statesProp, chunk]).join('.');
};
const resolveState = (definition = {}, path = '') => {
  /* 
  const isNested = path.includes('.');
  const key = isNested && Object.keys(path)[0]; */
  const definitionPath = buildDefinitionPath(path);
  /* const definitionPath = buildDefinitionPath(
    isNested ? [key, path[key]].join('.') : path
  ); */
  console.log('         > ', definitionPath);
  return get(definition, definitionPath);
};

const delimiter = '.';
const statesProp = 'states';

export const printCurrentState = ({ value }) =>
  console.log(`current state: ${value}`);
const getStateName = (definition = {}, transition = '') =>
  Object.values(definition.states).find(({ on }) => on[transition]);
////////
function original(stateMachineDefinition) {
  const machine = {
    value: stateMachineDefinition.initialState,
    transition(currentState, event) {
      const currentStateDefinition = stateMachineDefinition[currentState];
      const destinationTransition = currentStateDefinition.transitions[event];
      if (!destinationTransition) {
        return;
      }
      const destinationState = destinationTransition.target;
      /*       const destinationStateDefinition =
        stateMachineDefinition[destinationState];

      destinationTransition.action();
      currentStateDefinition.actions.onExit();
      destinationStateDefinition.actions.onEnter(); */

      machine.value = destinationState;

      return machine.value;
    },
  };
  return machine;
}
