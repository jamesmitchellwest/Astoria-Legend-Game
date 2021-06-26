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
    },
    slideAttack() {
      this.state = 'slideAttack'
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
    },
    slideAttack() {
      this.state = 'slideAttack'
    }
  },
  jump: {
    fall() {
      this.state = 'fall'
    },
    attack() {
      this.state = 'attack';
    },
    crouch() {
      this.state = 'crouch'
    }
  },
  fall: {
    land() {
      this.state = 'idle'
    },
    crouch() {
      this.state = 'crouch'
    }
  },
  attack: {
    retract(){
      this.state = "idle"
    }
  },
  slideAttack: {
    stand() {
      this.state = 'idle';
    },
    crawl() {
      this.state = 'crawl'
    },
    crouch() {
      this.state = 'crouch'
    },
  },
}
export default transitions;