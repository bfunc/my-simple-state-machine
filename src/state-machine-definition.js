export default {
  id: 'door',
  initial: 'locked',
  //initial: 'unlocked.closed',
  states: {
    locked: {
      on: {
        UNLOCK: 'unlocked',
      },
    },
    unlocked: {
      initial: 'closed',
      states: {
        closed: {
          on: {
            LOCK: 'locked',
            OPEN: 'opened',
          },
        },
        opened: {
          on: { CLOSE: 'closed' },
        },
      },
    },
  },
};

export const original = {
  id: 'myMachine',
  initialState: 'off',
  context: {},
  off: {
    actions: {
      onEnter() {
        console.log('off: onEnter');
      },
      onExit() {
        console.log('off: onExit');
      },
    },
    transitions: {
      switch: {
        target: 'on',
        action() {
          console.log('transition action for "switch" in "off" state');
        },
      },
    },
  },
  on: {
    actions: {
      onEnter() {
        console.log('on: onEnter');
      },
      onExit() {
        console.log('on: onExit');
      },
    },
    transitions: {
      switch: {
        target: 'off',
        action() {
          console.log('transition action for "switch" in "on" state');
        },
      },
    },
  },
};
