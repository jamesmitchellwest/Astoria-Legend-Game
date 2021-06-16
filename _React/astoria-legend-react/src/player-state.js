const transitions = {
  idle: {
      crouch() {
          this.state = 'crouch'
      },
      walk(){
        this.state = 'walk'
      },
      jump() {
        this.state = 'jump'
      }
  },
  crouch: {
      walk(){
        this.state = 'walk';
      },
      jump() {
        this.state = 'jump';
      },
      stand(){
        this.state = 'idle';
      }
  },
  walk: {
      idle() {
          this.state = 'idle';
      },
      jump() {
        this.state = 'jump';
      }
  },
  jump: {
    land() {
      this.state = 'idle'
    }
  }
}
export default transitions;