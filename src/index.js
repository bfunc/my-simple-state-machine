import { isDev } from './config';
import { resolveState, getStateByEvent } from './helpers';

export default function createMachine(definition) {
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

      isDev && console.log('>', event, currentStateDefinition);

      let targetStateTransition;

      // Got into nested scope
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

      isDev && console.log('<', machine.value);

      return machine.value;
    },
  };

  return machine;
}
