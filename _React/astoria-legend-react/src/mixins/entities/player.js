import { stringify } from 'flatted';
import { frames as animFrames } from '../../resources/texture.json'
import { createMachine } from '../../finite-state-machine';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.PlayerEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                // call the constructor
                this._super(me.Entity, "init", [
                    x, y,
                    Object.assign({
                        image: game.texture,
                        region: "jim_sprite-0"
                    }, settings)
                ]);
                this.body.mass = .75;
                this.body.runSpeed = 9;
                this.body.jumpSpeed = this.body.jumpForce = 17;
                this.body.boostedHorizontalSpeed = this.body.runSpeed * 2;
                this.body.boostedVerticalSpeed = this.body.jumpSpeed * 1.5;
                this.body.boostedDir = "";
                this.body.isWarping = false;
                this.body.crouching = false;
                this.crawlSpeed = 7;
                this.slideFriction = 0.05;
                this.fsm = createMachine();
                // max walking & jumping speed
                this.body.setMaxVelocity(this.body.runSpeed, this.body.jumpSpeed);
                this.body.setFriction(1.3, 0);
                // set the display to follow our position on both axis
                me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

                // ensure the player is updated even when outside of the viewport
                this.alwaysUpdate = true;
                this.renderable = game.texture.createAnimationFromName(animFrames.filter(x => x.filename.includes("jim_sprite"))
                    .map(x => x.filename.includes("jim_sprite") ? x.filename : null));
                this.anchorPoint.set(0.5, 0.5);
                this.renderable.addAnimation("walk", [0, 1, 2, 3], 200);
                this.renderable.addAnimation("idle", [4, 5], 500);
                this.renderable.addAnimation("jump", [2]);
                this.renderable.addAnimation("fall", [1]);
                this.renderable.addAnimation("crouch", [6]);
                this.renderable.addAnimation("crawl", [7]);
                this.renderable.addAnimation("slideAttack", [12]);

                this.renderable.addAnimation("emote", [{ name: 10, delay: 1000 }, { name: 11, delay: Infinity }]);
                this.renderable.addAnimation("attack", [{ name: 8, delay: 50 }, { name: 9, delay: 150 }]);
                this.renderable.addAnimation("crouchAttack", [{ name: 7, delay: 50 }, { name: 12, delay: 150 }]);

            },
            handleAnimationTransitions() {
                if (!this.renderable.isCurrentAnimation(this.fsm.state) &&
                    !this.renderable.isCurrentAnimation(this.fsm.state[0])) {

                    if (typeof this.fsm.state === "object") {
                        this.renderable.setCurrentAnimation(this.fsm.state[0], () => {
                            let action = this.fsm.state[1];
                            this.fsm.state = this.fsm.state[0]
                            this.fsm.dispatch(action);
                        })
                    } else {
                        this.renderable.setAnimationFrame();
                        this.renderable.setCurrentAnimation(this.fsm.state);
                    }

                }
            },
            crouch: function () {
                this.fsm.dispatch('crouch');
                this.body.force.x = 0;
                this.body.maxVel.x = this.crawlSpeed
                this.renderable.setAnimationFrame();
                this.renderable.setCurrentAnimation("crouch");
                this.body.crouching = true;
                let shape = this.body.getShape(0);
                shape.points[0].y = shape.points[1].y = this.height - 90;
                shape.setShape(0, 0, shape.points);
                this.body.setFriction(1.3, 0)
            },
            crawl: function () {
                this.body.maxVel.x *= .8;
                if (this.body.maxVel.x < .2) {
                    this.fsm.dispatch('crouch')
                }
            },
            standUp: function () {
                this.body.maxVel.x = this.body.runSpeed;
                let shape = this.body.getShape(0);
                this.fsm.dispatch('stand');
                shape.points[0].y = shape.points[1].y = 0;
                shape.setShape(0, 0, shape.points);
                this.body.setFriction(1.3, 0)
            },
            jump: function () {
                this.fsm.dispatch("jump")
                this.body.jumpForce *= .6;
                if (!this.body.jumping && !this.body.falling) {
                    // set current vel to the maximum defined value
                    // gravity will then do the rest
                    this.body.jumping = true;
                    this.body.force.y -= this.body.jumpForce;
                }
            },
            slide: function () {
                this.fsm.dispatch('slideAttack')
                this.body.friction.x = 0.1;
                let shape = this.body.getShape(0);
                shape.points[0].y = shape.points[1].y = this.height - 90;
                shape.setShape(0, 0, shape.points);
            },
            /**
             * update the entity
             */
            update: function (dt) {

                window.setDebugVal(`
                    ${stringify(this.body.friction)}
                    ${stringify(this.body.force.x)}
                    ${stringify(this.body.maxVel.x)}
                 `)

                if (this.body.isWarping) {
                    return true;
                }
                this.handleAnimationTransitions();

                ///////// HORIZONTAL MOVEMENT /////////

                if (me.input.isKeyPressed('left')) {
                    this.fsm.dispatch('walk')
                    // flip the sprite on horizontal axis
                    this.renderable.flipX(true);
                    // move left
                    this.body.force.x = -this.body.runSpeed;
                } else if (me.input.isKeyPressed('right')) {
                    this.fsm.dispatch('walk')
                    // unflip the sprite
                    this.renderable.flipX(false);
                    // move right
                    this.body.force.x = this.body.runSpeed;
                } else {
                    this.fsm.dispatch('idle');
                    this.body.force.x = 0;
                }

                ///////// CROUCH AND CRAWL /////////

                if (me.input.isKeyPressed('down') && this.fsm.state != 'crawl') {
                    if (this.body.vel.x > 5 || this.body.vel.x < -5 ) {
                        this.slide();
                    } else {
                        this.crouch();
                    }
                }
                if(this.fsm.state == "slideAttack")
                    this.body.force.x = 0;
                if (this.fsm.state == "crouch" && (me.input.isKeyPressed('right') || me.input.isKeyPressed('left'))) {
                    setTimeout(() => {
                        this.fsm.state = "crawl";
                    }, 100);

                }
                if (this.fsm.state == "crawl") {
                    this.crawl();
                }
                //resize hitbox when standing up
                if ((this.fsm.state == "crouch" || this.fsm.state == "crawl" || this.fsm.state == "slideAttack") && !me.input.keyStatus("down")) {
                    this.standUp();
                }

                ///////// JUMP /////////

                if (me.input.isKeyPressed('jump') && this.body.jumpForce > .5) {
                    this.jump()
                } else if (this.renderable.isCurrentAnimation("jump") && !me.input.keyStatus('jump')) {
                    this.body.force.y = .5;
                } else {
                    this.body.force.y = 0;
                }
                if (me.input.isKeyPressed('attack')) {
                    this.fsm.dispatch(['attack', 'retract'])
                }
                if (this.body.falling && this.fsm.state == "jump") {
                    this.fsm.dispatch("fall")
                }
                if (this.body.jumping && this.body.falling) {
                    this.body.jumping = false;
                }

                // apply physics to the body (this moves the entity)
                this.body.update(dt);

                // handle collisions against other shapes
                me.collision.check(this);

                // return true if we moved or if the renderable was updated
                return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);

            },

            /**
             * colision handler
             */
            onCollision: function (response, other) {


                switch (other.body.collisionType) {
                    case me.collision.types.WORLD_SHAPE:
                        if (this.body.falling) {
                            this.fsm.dispatch('land')
                        }
                        if (this.body.boostedDir && !this.body.jumping) {
                            this.body.setMaxVelocity(this.body.runSpeed, this.body.jumpSpeed);
                            this.body.boostedDir = "";
                        }
                        if (this.body.falling && this.body.jumpForce != this.body.jumpSpeed) {
                            this.body.jumpForce = this.body.jumpSpeed;
                        }

                        break;
                    case game.collisionTypes.BOOST:
                        if (response.indexShapeA == 0) {
                            this.fsm.dispatch('land')
                        }
                        if (this.body.falling && this.body.jumpForce != this.body.jumpSpeed) {
                            this.body.jumpForce = this.body.jumpSpeed;
                        }
                        break;
                    case game.collisionTypes.MOVINGPLATFORM:
                        if (other.isMovingEnemy) {
                            this.body.setMaxVelocity(this.body.runSpeed, this.body.jumpSpeed)
                            this.body.falling = false;
                        }
                        break;

                    case me.collision.types.ENEMY_OBJECT:
                        if (!other.isMovingEnemy) {
                            // spike or any other fixed danger
                            this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                            this.hurt();
                        }
                        else {
                            // a regular moving enemy entity
                            if ((response.overlapV.y > 0) && this.body.falling && !this.renderable.isFlickering()) {
                                // jump
                                this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                            }
                            else {
                                this.hurt();
                            }
                            // Not solid
                            return false;
                        }
                        break;

                    default:
                        // Do not respond to other objects (e.g. coins)
                        return false;
                }

                return true;

            },

            hurt: function () {
                var sprite = this.renderable;

                if (!sprite.isFlickering()) {

                    // tint to red and flicker
                    sprite.tint.setColor(255, 192, 192);
                    sprite.flicker(750, function () {
                        // clear the tint once the flickering effect is over
                        sprite.tint.setColor(255, 255, 255);
                    });

                    // flash the screen
                    // me.game.viewport.fadeIn("#FFFFFF", 75);
                    // me.audio.play("die", false);
                }
            }
        })
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin