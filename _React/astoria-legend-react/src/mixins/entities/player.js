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
                this.body.boostedHorizontalSpeed = this.body.runSpeed * 3;
                this.body.boostedVerticalSpeed = this.body.jumpSpeed * 1.5;
                this.body.boostedDir = "";
                this.body.isWarping = false;
                this.crawlSpeed = 7;
                this.fallCount = 0;
                this.recordPos = false;
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
                if (this.fsm.state != "jump" && this.fsm.state != "fall" && this.isGrounded()) {
                    this.body.force.x = 0;
                    this.body.maxVel.x = this.crawlSpeed
                    this.body.setFriction(1.3, 0)
                }
                this.fsm.dispatch('crouch')
                let shape = this.body.getShape(0);
                shape.points[0].y = shape.points[1].y = this.height - 90;
                shape.setShape(0, 0, shape.points);
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
                if (this.body.maxVel.x < this.body.runSpeed) {
                    this.body.maxVel.x = this.body.runSpeed
                }
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
            isGrounded: function () {
                return this.fsm.state != "jump" && this.fsm.state != "fall" && !this.body.vel.y
            },
            resetSettings: function (collisionType) {
                if (this.fsm.state == "fall") {
                    this.fsm.dispatch('land')
                }
                if (collisionType != game.collisionTypes.BOOST &&
                    collisionType != me.collision.types.ENEMY_OBJECT &&
                    this.fsm.secondaryState != "crouching") {
                    this.body.setMaxVelocity(this.body.runSpeed, this.body.jumpSpeed);
                    this.body.boostedDir = "";
                }
                if (this.body.falling && this.body.jumpForce != this.body.jumpSpeed) {
                    this.body.jumpForce = this.body.jumpSpeed;
                }
            },
            recordPosition: function () {
                if (this.recordPos && this.body.vel.y === 0) {
                    this.reSpawnPosX = Math.round(this.pos.x);
                    this.reSpawnPosY = Math.round(this.pos.y);
                } 
            },
            reSpawn: function () {
                
                this.pos.x = this.reSpawnPosX;
                this.pos.y = this.reSpawnPosY;
            },
            /**
             * update the entity
             */
            update: function (dt) {
                this.recordPosition();
                
                window.setDebugVal(`
                    ${stringify(this.body.vel.y)}
                    ${stringify(this.body.MaxVel)}
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

                ///////// CROUCH, CRAWL, & SLIDE /////////

                if (me.input.isKeyPressed('down') && this.fsm.state != 'crawl') {

                    if (Math.abs(this.body.vel.x) > 6.5 && this.isGrounded()) {
                        this.slide();
                    } else {
                        this.crouch();
                    }
                }
                if (this.fsm.state == "slideAttack") {
                    this.body.force.x = 0;
                }
                if (this.fsm.state == "crouch" && this.isGrounded() && (me.input.isKeyPressed('right') || me.input.isKeyPressed('left'))) {
                    setTimeout(() => {
                        this.fsm.dispatch("crawl");
                    }, 100);

                }
                if (this.fsm.state == "crawl" && this.isGrounded()) {
                    this.crawl();
                }
                //resize hitbox when standing up
                if (this.body.vel && this.fsm.secondaryState == "crouching" && !me.input.keyStatus("down")) {
                    this.standUp();
                }

                ///////// JUMPING & FALLING /////////

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
                if (this.body.falling) {
                    this.fallCount += 1;
                    this.body.vel.y *= 1.0005
                    this.body.setMaxVelocity(this.body.runSpeed, 40)
                    if(this.pos.y > me.game.world.height){
                        this.reSpawn();
                    }
                } else {
                    this.fallCount = 0;
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
                        this.resetSettings(other.body.collisionType);
                        if (other.name == "vanishingTile") {
                            this.recordPos = false;
                        } else {
                            this.recordPos = true;
                        }
                        break;
                    case game.collisionTypes.BOOST:
                        this.resetSettings(other.body.collisionType);
                        this.recordPos = false;
                        break;
                    case game.collisionTypes.MOVING_PLATFORM:
                        this.resetSettings(other.body.collisionType);
                        this.recordPos = false;
                        // if (this.pos.y < other.pos.y && this.body.falling) {
                        //     this.resetSettings(other.body.collisionType);
                        //     this.body.vel.x = other.body.vel.x * 1.26
                        // }
                        break;
                    case game.collisionTypes.VANISHING_TILE:
                        this.recordPos = false;
                        this.resetSettings(other.body.collisionType);
                        break;
                    case game.collisionTypes.SPIKES:
                        this.recordPos = false;
                        this.resetSettings(other.body.collisionType);
                        this.hurt();
                        this.reSpawn();
                        break;
                    case game.collisionTypes.PACMAN:
                        this.recordPos = false;
                        if (this.pos.y < other.pos.y && this.body.falling) {
                            this.resetSettings(other.body.collisionType);
                            this.body.vel.x = other.body.vel.x * 1.26
                        } else {
                            this.hurt()
                            return false
                        }
                        break;
                    case me.collision.types.ENEMY_OBJECT:
                        this.recordPos = false;
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
                        this.recordPos = false;
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