const transitions = {
  idle: {
    crouch() {
      this.state = 'crouch'
    },
    walk() {
      this.state = 'walk'
    },
    jump() {
      this.state = 'jump'
    },
    attack() {
      this.state = 'attack'
    }
  },
  crouch: {
    stand() {
      this.state = 'idle';
    },
    crawl() {
      this.state = 'crawl'
    }
  },
  crawl: {
    jump() {
      this.state = 'jump';
    },
    stand() {
      this.state = 'idle';
    },
    crouch() {
      this.state = 'crouch';
    }
  },
  walk: {
    idle() {
      this.state = 'idle';
    },
    jump() {
      this.state = 'jump';
    },
    attack() {
      this.state = 'attack'
    }
  },
  jump: {
    fall() {
      this.state = 'fall'
    },
    attack() {
      this.state = 'attack';
    }
  },
  fall: {
    land() {
      this.state = 'idle'
    }
  },
  attack: {
    retract(){
      this.state = "idle"
    }
  }
}
export default transitions;