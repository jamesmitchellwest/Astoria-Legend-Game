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
    },
    fly(){
      this.state = 'fall';
      this.secondaryState = '';
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

    },
    fly(){
      this.state = 'fall';
      this.secondaryState = '';
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
    },
    fly(){
      this.state = 'fall';
      this.secondaryState = '';
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
    },
    fly(){
      this.state = 'fall';
      this.secondaryState = '';
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
    },
    fly(){
      this.state = 'fall';
      this.secondaryState = '';
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
    fly(){
      this.state = 'fall';
      this.secondaryState = '';
    }
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
    fly(){
      this.state = 'fall';
      this.secondaryState = '';
    }
  },
  fly:{
    land() {
      this.state = 'idle';
      this.secondaryState = '';
    }
  }
}
export default transitions;