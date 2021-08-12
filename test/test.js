import assert from 'assert';
import mock from './mock.js';
import createMachine from '../src/index.js';

function test(testFnc, param, expected, testDescription = 'OK') {
  assert.equal(testFnc(param), expected);
  console.log(`[ ✓ ] `, testDescription);
}
function testError(testFnc, param, expected, testDescription = 'OK') {
  assert.throws(() => testFnc(param), expected);
  console.log(`[ ✓ ] `, testDescription);
}

const machine = createMachine(mock);

test(
  () => machine.value,
  null,
  'locked',
  'Should check that machine init state'
);

test(
  () => {
    machine.transition('UNLOCK');
    return machine.value;
  },
  null,
  'unlocked',
  'Should check transition to nested state'
);

test(
  () => {
    machine.transition('LOCK');
    return machine.value;
  },
  null,
  'locked',
  'Should check transition to flat state'
);

test(
  () => {
    machine.transition('UNLOCK');
    machine.transition('OPEN');
    return machine.value;
  },
  null,
  'unlocked.opened',
  'Should check transition to the state inside state'
);

testError(
  () => {
    machine.transition('OPEN');
  },
  null,
  {
    name: 'Error',
    message: 'Bad transition OPEN from unlocked.opened',
  },
  'Should throw Bad Transition error on same state'
);

testError(
  () => {
    machine.transition('LOCK');
  },
  null,
  {
    name: 'Error',
    message: 'Bad transition LOCK from unlocked.opened',
  },
  'Should throw Bad Transition error on moving to wrong state'
);

test(
  () => {
    machine.transition('CLOSE');
    return machine.value;
  },
  null,
  'unlocked.closed',
  'Should check transition to the same level on inner state'
);
