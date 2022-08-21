import transitions from './player-state';
const machine = {
  state: 'idle',
  secondaryState: "",
  transitions: transitions,
  dispatch(actionName) {

    const action = this.transitions[this.state][actionName];
    if (action) {
      action.call(this);
    }
  },
};
export function createMachine() {
  const fsm = Object.create(machine);
  return fsm
}