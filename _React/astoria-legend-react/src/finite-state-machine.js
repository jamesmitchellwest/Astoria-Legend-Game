import transitions from './player-state';
const machine = {
  state: 'idle',
  transitions: transitions,
  dispatch(actionName) {
      const action = this.transitions[this.state][actionName];

      if (action) {
          action.call(this);
      } else {
          console.log('invalid action');
      }
  },
};
export function createMachine () {
  const fsm = Object.create(machine);
  return fsm
}