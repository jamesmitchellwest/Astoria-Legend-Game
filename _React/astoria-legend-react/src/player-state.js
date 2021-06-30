const transitions = {
  idle: {
    crouch() {
      this.state = 'crouch'
      this.secondaryState = 'crouching'
    },
    walk() {
      this.state = 'walk';
      this.secondaryState = '';
    },
    jump() {
      this.state = 'jump';
      this.secondaryState = '';
    },
    attack() {
      this.state = 'attack';
      this.secondaryState = '';
    },
    slideAttack() {
      this.state = 'slideAttack';
      this.secondaryState = 'crouching';
    }
  },
  crouch: {
    stand() {
      this.state = 'idle';
      this.secondaryState = '';
    },
    crawl() {
      this.state = 'crawl';
      this.secondaryState = 'crouching';

    }
  },
  crawl: {
    jump() {
      this.state = 'jump';
      this.secondaryState = '';
    },
    stand() {
      this.state = 'idle';
      this.secondaryState = '';
    },
    crouch() {
      this.state = 'crouch';
      this.secondaryState = 'crouching';
    }
  },
  walk: {
    idle() {
      this.state = 'idle';
      this.secondaryState = '';
    },
    jump() {
      this.state = 'jump'
      this.secondaryState = '';
    },
    attack() {
      this.state = 'attack';
      this.secondaryState = '';
    },
    slideAttack() {
      this.state = 'slideAttack';
      this.secondaryState = 'crouching';
    }
  },
  jump: {
    fall() {
      this.state = 'fall';
      this.secondaryState = '';
    },
    attack() {
      this.state = 'attack';
      this.secondaryState = '';
    },
    crouch() {
      this.state = 'crouch';
      this.secondaryState = 'crouching';
    }
  },
  fall: {
    land() {
      this.state = 'idle';
      this.secondaryState = '';
    },
    crouch() {
      this.state = 'crouch';
      this.secondaryState = 'crouching';
    }
  },
  attack: {
    retract(){
      this.state = "idle";
      this.secondaryState = '';
    }
  },
  slideAttack: {
    stand() {
      this.state = 'idle';
      this.secondaryState = '';
    },
    crawl() {
      this.state = 'crawl';
      this.secondaryState = 'crouching';
    },
    crouch() {
      this.state = 'crouch';
      this.secondaryState = 'crouching';
    },
  },
}
export default transitions;