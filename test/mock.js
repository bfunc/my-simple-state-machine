export default {
  id: 'door',
  initial: 'locked',
  states: {
    locked: {
      on: {
        UNLOCK: 'unlocked',
      },
    },
    unlocked: {
      initial: 'unlocked.closed',
      states: {
        closed: {
          on: {
            LOCK: 'locked',
            OPEN: 'unlocked.opened',
          },
        },
        opened: {
          on: { CLOSE: 'unlocked.closed' },
        },
      },
    },
  },
};
