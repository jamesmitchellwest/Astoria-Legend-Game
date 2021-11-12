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
                this.startX = x;
                this.startY = y;
                // call the constructor
                this._super(me.Entity, "init", [
                    x, y,
                    Object.assign({
                        image: game.texture,
                        region: "jim_sprite-0"
                    }, settings)
                ]);
                this.selectedPlayer = "jim";
                this.body.mass = .75;
                this.body.runSpeed = 9;
                this.body.jumpSpeed = this.body.jumpForce = 17;
                this.body.boostedHorizontalSpeed = 35;
                this.body.boostedVerticalSpeed = this.body.jumpSpeed * 1.6;
                this.frictionX = 1.3
                this.boostedDir = "";
                this.isWarping = false;
                this.crawlSpeed = 7;
                this.fallCount = 0;
                this.jumpEnabled = true;
                this.onMovingPlatform = false;
                this.powerUpItem = false;
                this.magicTileActive = false;
                this.brickSmash = false;
                this.fsm = createMachine();
                // max walking & jumping speed
                this.body.setMaxVelocity(this.body.runSpeed, this.body.jumpSpeed);
                this.body.setFriction(this.frictionX, 0);
                // set the display to follow our position on both axis
                me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

                // ensure the player is updated even when outside of the viewport
                this.alwaysUpdate = true;
                this.renderable = game.texture.createAnimationFromName(animFrames.filter(x => x.filename.includes(`${this.selectedPlayer}_sprite`))
                    .map(x => x.filename.includes(`${this.selectedPlayer}_sprite`) ? x.filename : null));
                this.anchorPoint.set(0.5, 0.5);
                this.renderable.addAnimation("walk", [0, 1, 2, 3], 200);
                this.renderable.addAnimation("idle", [4, 5], 500);
                this.renderable.addAnimation("jump", [2]);
                this.renderable.addAnimation("fall", [1]);
                this.renderable.addAnimation("crouch", [6]);
                this.renderable.addAnimation("crawl", [7]);
                this.renderable.addAnimation("faceCamera", [8]);
                this.renderable.addAnimation("emote", [9]);
                this.renderable.addAnimation("slideAttack", [10]);
                this.renderable.addAnimation("electrocute", [12, 13], 50);

                if (this.selectedPlayer == "brad") {
                    this.renderable.addAnimation("bradWalkLeft", [14, 15, 16, 17], 200);
                    this.renderable.addAnimation("bradJumpLeft", [16]);
                    this.renderable.addAnimation("bradFallLeft", [15]);
                }
                // this.powerUp = false;
                game.mainPlayer = this;
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
                //dont crouch if stuck to bottom of up boost
                if (this.boostedDir == "up" && me.collision.response.overlapN.y < 0) {
                    return
                }
                if (this.fsm.state != "jump" && this.fsm.state != "bradJumpLeft" && this.fsm.state != "fall" && this.isGrounded()) {
                    this.body.force.x = 0;
                    this.body.maxVel.x = this.crawlSpeed
                    if (this.body.friction.x != 0) {
                        this.body.setFriction(this.frictionX, 0)
                    }

                }
                this.fsm.dispatch('idle')
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
                const ray = new me.Line(this.pos.x, this.pos.y, [
                    new me.Vector2d(0, this.height - 140),
                    new me.Vector2d(60, this.height - 140)
                ]);
                if (!me.collision.rayCast(ray).length) {
                    this.body.maxVel.x = this.body.runSpeed;
                    let shape = this.body.getShape(0);
                    this.fsm.dispatch('stand');

                    shape.points[0].y = shape.points[1].y = 0;
                    shape.setShape(0, 0, shape.points);
                    this.body.setFriction(this.frictionX, 0)
                }
            },
            // draw: function(renderer) {
            //     const ray = new me.Line(0, 0, [
            //         new me.Vector2d(0, -40),
            //         new me.Vector2d(0, 0)
            //     ]);
            //     renderer.setColor("red");
            //     renderer.stroke(ray);
            // },
            jump: function () {
                if (this.selectedPlayer == "brad" && this.renderable.isFlippedX) {
                    this.fsm.dispatch("bradJumpLeft");
                } else {
                    this.fsm.dispatch("jump");
                }
                this.body.jumpForce *= .6;
                if (this.body.maxVel.x < this.body.runSpeed) {
                    this.body.maxVel.x = this.body.runSpeed
                }
                if (this.body.friction.x == 0) {
                    this.body.setFriction(this.frictionX, 0)
                }
                if ((!this.body.jumping && !this.body.falling) || (this.onMovingPlatform && me.collision.check(this))) {
                    // set current vel to the maximum defined value
                    // gravity will then do the rest
                    this.body.jumping = true;
                    this.body.vel.y = 0;
                    this.body.force.y -= this.body.jumpForce;
                    this.onMovingPlatform = false;
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
                return this.fsm.state != "jump" && this.fsm.state != "bradJumpLeft" && this.fsm.state != "fall" && this.fsm.state != "bradFallLeft" && !this.body.vel.y
            },
            resetSettings: function (collisionType) {
                if (this.fsm.state == "fall" || this.fsm.state == "bradFallLeft") {
                    this.fsm.dispatch('land')
                }
                if (collisionType != game.collisionTypes.MOVING_PLATFORM) {
                    this.body.setFriction(this.frictionX, 0)
                }
                if (collisionType != game.collisionTypes.BOOST && this.fsm.secondaryState != "crouching") {
                    if (this.body.vel.y < 0 && this.body.maxVel.y > this.body.jumpSpeed) {
                        this.body.maxVel.y -= .3
                    } else {
                        this.boostedDir = "";
                        this.body.setMaxVelocity(this.body.runSpeed, this.body.jumpSpeed)
                    }
                    this.jumpEnabled = true
                }
                if (this.body.falling && this.body.jumpForce != this.body.jumpSpeed) {
                    this.body.jumpForce = this.body.jumpSpeed;
                }
                if (this.slimed) {
                    this.body.runSpeed = 6;
                } else {
                    this.body.runSpeed = 9;
                }
            },
            powerUp: function () {
                if (this.powerUpItem == "superJump") {
                    this.body.maxVel.y = 33;
                    this.body.vel.y = -this.body.maxVel.y
                    this.powerUpItem = false;
                }
                if (this.powerUpItem == "dash") {
                    this.powerUpItem = false;
                    this.body.vel.y = 0;
                    this.body.ignoreGravity = true;
                    this.brickSmash = true;
                    this.body.maxVel.x = 35;
                    this.body.force.x = this.body.maxVel.x
                    setTimeout(() => {
                        this.body.ignoreGravity = false;
                        this.brickSmash = false;
                        this.resetSettings();
                    }, 600);
                }
                if (this.powerUpItem == "teleport") {
                    this.pos.x = this.pos.x + 220;
                    this.body.vel.y = 0;
                    this.powerUpItem = false;
                }
                if (this.powerUpItem == "bradSpecial") {
                    this.magicTileActive = true;
                    this.powerUpItem = false;
                    setTimeout(() => {
                        this.magicTileActive = false;
                    }, 10000);
                }
            },
            recordPosition: function () {
                this.reSpawnPosX = Math.round(this.pos.x);
                this.reSpawnPosY = Math.round(this.pos.y);
            },
            reSpawn: function () {

                this.pos.x = this.reSpawnPosX;
                this.pos.y = this.reSpawnPosY;
            },
            handleBradJumpAndFall: function () {
                if (this.fsm.state == "fall" && this.renderable.isFlippedX) {
                    this.fsm.dispatch("bradFallLeft")
                }
                if (this.fsm.state == "bradFallLeft" && !this.renderable.isFlippedX) {
                    this.fsm.dispatch("fall")
                }
                if (this.fsm.state == "jump" && this.renderable.isFlippedX) {
                    this.fsm.dispatch("bradJumpLeft")
                }
                if (this.fsm.state == "bradJumpLeft" && !this.renderable.isFlippedX) {
                    this.fsm.dispatch("jump")
                }
            },
            /**
             * update the entity
             */
            update: function (dt) {

                // window.setDebugVal(`
                //     ${stringify(me.game.viewport.height)}
                //     ${stringify(me.game.viewport.width)}
                //  `)

                if (this.isWarping || this.renderable.alpha < 1) {
                    this.powerUpItem = false;
                    game.HUD.PowerUpItem.setOpacity(0);
                    return true;
                }
                if (this.fsm.state == "electrocute") {
                    this.body.vel.x = 0;
                    this.body.vel.y = 0;
                    this.fallCount = 0;
                    this.handleAnimationTransitions();
                    return (this._super(me.Entity, 'update', [dt]))
                }
                this.handleAnimationTransitions();

                ///////// HORIZONTAL MOVEMENT /////////

                if (me.input.isKeyPressed('left')) {
                    if (this.selectedPlayer == "brad") {
                        this.fsm.dispatch('bradWalkLeft');
                    } else {
                        this.fsm.dispatch('walk');
                    }
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
                if (this.jumpEnabled) {
                    if (me.input.isKeyPressed('jump') && this.body.jumpForce > .5) {
                        this.jump()
                        this.body.setFriction(1.3, 0)

                    } else if ((this.fsm.state == "jump" || this.fsm.state == "bradJumpLeft") && !me.input.keyStatus('jump')) {
                        this.body.force.y = .5;
                    } else {
                        this.body.force.y = 0;
                    }
                }

                // if (me.input.isKeyPressed('attack')) {
                //     this.fsm.dispatch(['attack', 'retract'])
                // }
                if (this.body.falling && (this.fsm.state == "jump" || this.fsm.state == "bradJumpLeft")) {
                    if (this.selectedPlayer == "brad" && this.renderable.isFlippedX) {
                        this.fsm.dispatch("bradFallLeft")
                    } else {
                        this.fsm.dispatch("fall")
                    }
                }
                if (this.fsm.state == "fall" || this.fsm.state == "bradFallLeft") {
                    this.jumpEnabled = true;
                }
                if (this.body.vel.y > 1) {
                    this.fallCount += 1;
                    this.body.vel.y *= 1.0005
                    this.body.setFriction(1.3, 0)
                    this.body.setMaxVelocity(this.body.runSpeed, 40)
                }
                if (this.selectedPlayer == "brad") {
                    this.handleBradJumpAndFall();
                }
                if (!this.body.falling && this.fallCount != 0) {
                    this.fallCount = 0;
                }
                // apply physics to the body (this moves the entity)

                //////////  POWER UP  //////////
                if (this.powerUpItem != false) {
                    if (this.powerUpItem == "jimSpecial") {
                        if (this.jetFuel > 0 && me.input.keyStatus('attack')) {
                            const jetForce = this.body.vel.y < 6 ? 1 : 2;
                            this.jetFuel -= 0.4;
                            this.body.vel.y -= jetForce;
                            this.fsm.dispatch("fly");
                        }
                        if (this.jetFuel <= 0 && this.powerUpItem !== false) {
                            this.powerUpItem = false;
                            game.HUD.PowerUpItem.setOpacity(0);
                        }
                    } else {
                        if (me.input.isKeyPressed('attack')) {
                            this.powerUp();
                            game.HUD.PowerUpItem.setOpacity(0);
                        }
                    }

                }
                if (this.pos.y > me.game.world.height || this.pos.y + 320 < me.game.world.pos.y) {
                    this.reSpawn();
                }

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
                        if (response.overlapV.y > 0) {
                            this.resetSettings(other.body.collisionType);
                        }
                        // record position if standing on top and not hanging off the edge
                        if (other.name != "vanishingTile" &&
                            other.name != "magicTile" &&
                            response.overlapV.y > 0 && //standing on top
                            (this.pos.x - other.pos.x) > 0 && //player width fits on left edge
                            (other.pos.x + other.width) - this.pos.x > this.width // player width fits on right edge
                        ) {
                            this.recordPosition();
                        }
                        break;
                    case game.collisionTypes.BOOST:
                        if (response.overlapV.y > 0) {
                            this.resetSettings(other.body.collisionType);
                        }
                        break;
                    case game.collisionTypes.MOVING_PLATFORM:

                        if (response.overlapV.y > 0 && (this.body.falling || other.settings.direction == "up")) {
                            this.onMovingPlatform = true;
                            this.resetSettings(other.body.collisionType);
                            this.body.vel.x = other.body.vel.x
                            this.body.setFriction(0, 0);
                        }
                        /////////JUMPING WHILE MOVING UP OR DOWN ON HOVERBOARD///////////////////// *****BUG*****

                        // if(other.moving == "up" || other.moving == "down"){
                        //     this.body.jumpForce = other.body.vel.y + this.body.jumpForce;
                        // }

                        break;
                    case game.collisionTypes.VANISHING_TILE:
                        if (response.overlapV.y > 0) {
                            this.resetSettings(other.body.collisionType);
                        }
                        var x = this.renderable.isFlippedX ? this.pos.x - 5 : this.pos.x + this.width + 5
                        var ray = new me.Line(
                            x, this.pos.y, [
                            new me.Vector2d(0, 0),
                            new me.Vector2d(0, this.height)
                        ]);

                        // check for collition
                        var result = me.collision.rayCast(ray);
                        for (let index = 0; index < result.length; index++) {
                            if (result[index].name == "vanishingTile" && !result[index].vanishing) {
                                result[index].vanishing = true;
                                result[index].vanishTween.start()
                            }
                        }
                        break;
                    case game.collisionTypes.SPIKES:
                        this.resetSettings(other.body.collisionType);
                        this.hurt();
                        this.reSpawn();
                        break;
                    case game.collisionTypes.PACMAN:
                        if (this.pos.y < other.pos.y && this.body.falling) {
                            this.resetSettings(other.body.collisionType);
                            this.body.vel.x = other.body.vel.x * 1.26
                        } else {
                            this.hurt()
                            return false
                        }
                        break;
                    case me.collision.types.ENEMY_OBJECT:
                        if (!other.isMovingEnemy) {
                            // spike or any other fixed danger
                            this.body.vel.y -= this.body.jumpSpeed * me.timer.tick;
                            this.hurt();
                        }
                        else {
                            // a regular moving enemy entity
                            if ((response.overlapV.y > 0) && this.body.falling && !this.renderable.isFlickering()) {
                                // jump
                                this.body.vel.y -= this.body.jumpSpeed * 1.5 * me.timer.tick;
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

                if (!sprite.isFlickering() && !this.slimed) {

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