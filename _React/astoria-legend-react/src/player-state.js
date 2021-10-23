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
    bradWalkLeft() {
      this.state = 'bradWalkLeft';
      this.secondaryState = '';
    },
    jump() {
      this.state = 'jump';
      this.secondaryState = '';
    },
    bradJumpLeft() {
      this.state = 'bradJumpLeft';
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
    bradJumpLeft() {
      this.state = 'bradJumpLeft';
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
    bradJumpLeft() {
      this.state = 'bradJumpLeft';
      this.secondaryState = '';
    },
    bradWalkLeft() {
      this.state = 'bradWalkLeft';
      this.secondaryState = '';
    },
    slideAttack() {
      this.state = 'slideAttack';
      this.secondaryState = 'crouching';
    }
  },
  bradWalkLeft: {
    idle() {
      this.state = 'idle';
      this.secondaryState = '';
    },
    walk() {
      this.state = 'walk';
      this.secondaryState = '';
    },
    bradJumpLeft() {
      this.state = 'bradJumpLeft'
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
    bradJumpLeft() {
      this.state = 'bradJumpLeft';
      this.secondaryState = '';
    },
    crouch() {
      this.state = 'crouch';
      this.secondaryState = 'crouching';
    }
  },
  bradJumpLeft: {
    bradFallLeft() {
      this.state = 'bradFallLeft';
      this.secondaryState = '';
    },
    jump() {
      this.state = 'jump'
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
    bradFallLeft() {
      this.state = 'bradFallLeft';
      this.secondaryState = '';
    },
    crouch() {
      this.state = 'crouch';
      this.secondaryState = 'crouching';
    },
    jump() {
      this.state = 'jump'
      this.secondaryState = '';
    },
  },
  bradFallLeft: {
    land() {
      this.state = 'idle';
      this.secondaryState = '';
    },
    crouch() {
      this.state = 'crouch';
      this.secondaryState = 'crouching';
    },
    fall() {
      this.state = 'fall'
      this.secondaryState = '';
    },
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