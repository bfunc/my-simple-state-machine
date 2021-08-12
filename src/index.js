import createMachine, { printCurrentState } from './state-machine-lib.js';
import myMachine from './state-machine-definition.js';

export default function testMachine(hours, minutes) {
  const machine = createMachine(myMachine);

  printCurrentState(machine);

  machine.transition('UNLOCK');
  machine.transition('OPEN');
  machine.transition('CLOSE');
  machine.transition('LOCK');
  machine.transition('UNLOCK');
  machine.transition('LOCK');
  machine.transition('UNLOCK');
  machine.transition('OPEN');
  machine.transition('CLOSE');
  machine.transition('OPEN');
  machine.transition('CLOSE');
  machine.transition('LOCK');
  machine.transition('LOCK');

  /*   console.log(`current state: ${state}`);
  state = machine.transition(state, 'switch');
  console.log(`current state: ${state}`); */
}
