import createMachine from './state-machine-lib.js';
import myMachine from './state-machine-definition.js';

export default function testMachine(hours, minutes) {
  const machine = createMachine(myMachine);

  let state = machine.value;
  console.log(`current state: ${state}`);
  state = machine.transition(state, 'switch');
  console.log(`current state: ${state}`);
  state = machine.transition(state, 'switch');
  console.log(`current state: ${state}`);
}
