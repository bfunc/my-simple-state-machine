const assert = require('assert');

function test(testFnc, param, expected, testDescription = 'OK') {
  assert.equal(testFnc(param), expected);
  console.log(`[ ✓ ] `, testDescription);
}

test(val => val * 2, 10, 20,'Should multiply');
test(val => val * 2, 10, 30);
