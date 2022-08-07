import { stringify } from 'flatted';
import { frames as animFrames } from '../../resources/texture.json'
import { createMachine } from '../../finite-state-machine';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        const RUN_SPEED = 9;
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
                this.selectedPlayer = game.selectedPlayer || 'brad';
                this.body.mass = .75;
                this.body.runSpeed = RUN_SPEED;
                this.body.slimedSpeed = me.Math.round(this.body.runSpeed * .666)
                this.body.jumpSpeed = this.body.jumpForce = 17.3;
                this.body.boostedHorizontalSpeed = 35;
                this.body.boostedVerticalSpeed = this.body.jumpSpeed * 1.6;
                this.body.idleSpeed = 0;
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
                this.time = 0;
                this.timerActive = false;
                this.isCrouched = false;
                this.holdSetMaxVelX = false;
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
                this.renderable.addAnimation("hurt", [11]);

                if (this.selectedPlayer == "brad") {
                    this.renderable.addAnimation("bradWalkLeft", [14, 15, 16, 17], 200);
                    this.renderable.addAnimation("bradJumpLeft", [16]);
                    this.renderable.addAnimation("bradFallLeft", [15]);
                    this.renderable.addAnimation("electrocute", [18, 8, 19], 50);
                } else {
                    this.renderable.addAnimation("electrocute", [12, 8, 13], 50);
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
                this.holdSetMaxVelX = true;
                this.isCrouched = true;
                if (this.crouchDisabled) {
                    this.crouchDisabled = false
                    return
                }
                if (this.fsm.state != "jump" && this.fsm.state != "bradJumpLeft" && this.fsm.state != "fall" && this.isGrounded()) {
                    this.body.force.x = this.body.idleSpeed;
                    this.body.maxVel.x = this.crawlSpeed
                    if (this.body.friction.x != 0) {
                        this.body.setFriction(this.frictionX, 0)
                    }
                }
                this.fsm.dispatch('idle')
                this.fsm.dispatch('crouch')
                if (!this.crouchAudio) {
                    this.crouchAudio = true;
                    this.gruntAudio();
                }
                let shape = this.body.getShape(0);
                shape.points[0].y = shape.points[1].y = this.height - 90;
                shape.setShape(0, 0, shape.points);
            },
            crawl: function () {
                this.holdSetMaxVelX = true;
                this.body.maxVel.x *= .8;
                if (this.body.maxVel.x < .2) {
                    this.fsm.dispatch('crouch')
                    me.audio.play("slide_1", false, null, .15);
                }
            },
            standUp: function () {
                this.holdSetMaxVelX = false;
                this.isCrouched = false;
                const ray = new me.Line(this.pos.x, this.pos.y, [
                    new me.Vector2d(0, this.height - 90),
                    new me.Vector2d(60, this.height - 140)
                ]);
                const solidTypes = [
                    me.collision.types.WORLD_SHAPE,
                    game.collisionTypes.BOOST,
                    game.collisionTypes.MOVING_PLATFORM,
                    game.collisionTypes.VANISHING_TILE,
                    game.collisionTypes.MOVING_PLATFORM
                ];
                const result = me.collision.rayCast(ray);
                for (let index = 0; index < result.length; index++) {
                    const object = result[index];
                    if (solidTypes.includes(object.body.collisionType)) {
                        return;
                    }
                }
                this.body.maxVel.x = this.body.runSpeed;
                let shape = this.body.getShape(0);
                this.fsm.dispatch('stand');

                shape.points[0].y = shape.points[1].y = 0;
                shape.setShape(0, 0, shape.points);
                this.body.setFriction(this.frictionX, 0)
                this.slideAudio = false;
                this.crouchAudio = false;
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
                if (this.fsm.secondaryState == "crouching") {
                    return
                }
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
                    this.gruntAudio()
                    me.audio.play("jump", false, null, 0.25);
                    this.body.jumping = true;
                    this.body.vel.y = 0;
                    this.body.force.y -= this.body.jumpForce;
                    this.onMovingPlatform = false;
                }
            },
            slide: function () {
                this.isCrouched = true;
                this.holdSetMaxVelX = true;
                if (!this.slideAudio) {
                    this.slideAudio = true
                    me.audio.play("slide", false, null, 0.3)
                    this.gruntAudio();
                }
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
                if (collisionType != game.collisionTypes.BOOST && this.fsm.secondaryState == "crouching" && this.body.maxVel.y != this.body.jumpSpeed) {
                    this.body.maxVel.y = this.body.jumpSpeed
                }
                if (collisionType != game.collisionTypes.BOOST && this.fsm.secondaryState != "crouching") {
                    if (this.body.vel.y < 0 && this.body.maxVel.y > this.body.jumpSpeed) {
                        this.body.maxVel.y -= .3
                    } else {
                        this.boostedDir = "";
                        this.body.maxVel.y = this.body.jumpSpeed;
                    }
                    this.jumpEnabled = true
                }
                if (this.body.falling && this.body.jumpForce != this.body.jumpSpeed) {
                    this.body.jumpForce = this.body.jumpSpeed;
                }
                if (this.slimed &&
                    collisionType != game.collisionTypes.PACMAN &&
                    collisionType != game.collisionTypes.MOVING_PLATFORM &&
                    this.body.runSpeed == RUN_SPEED) {
                    this.body.runSpeed = this.body.slimedSpeed;
                }
                if (!this.slimed && this.body.runSpeed != RUN_SPEED) {
                    this.body.runSpeed = RUN_SPEED;
                }
            },
            powerUp: function () {
                if (this.powerUpItem == "superJump") {
                    me.audio.play("super_jump", false, null, 0.05)
                    this.body.maxVel.y = 33;
                    this.body.vel.y = -this.body.maxVel.y
                    this.powerUpItem = false;
                }
                if (this.powerUpItem == "dash") {
                    me.audio.play("super_jump", false, null, 0.05)
                    this.holdSetMaxVelX = true;
                    this.powerUpItem = false;
                    this.body.vel.y = 0;
                    this.body.ignoreGravity = true;
                    this.brickSmash = true;
                    this.body.maxVel.x = 35;
                    this.body.force.x = this.renderable.isFlippedX ? -this.body.maxVel.x : this.body.maxVel.x
                    setTimeout(() => {
                        this.body.ignoreGravity = false;
                        this.brickSmash = false;
                        this.holdSetMaxVelX = false;
                        this.resetSettings();
                    }, 600);
                }
                if (this.powerUpItem == "teleport") {
                    me.audio.play("teleport", false, null, 0.2)
                    this.pos.x = this.renderable.isFlippedX ? this.pos.x - 190 : this.pos.x + 190;
                    this.body.vel.y = 0;
                    this.powerUpItem = false;
                }
                if (this.powerUpItem == "bradSpecial") {
                    me.audio.play("synth_wobble", false, null, .25)
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
                me.audio.play("splat", false, null, 0.15);
                this.body.vel.x = 0;
                this.body.vel.y = 0;
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
            convertTime: function (time) {
                return `${("0" + Math.floor((time / 60000) % 60)).slice(-2)}:${("0" + Math.floor((time / 1000) % 60)).slice(-2)}.${("0" + ((time / 10) % 100)).slice(-2)}`
            },
            gruntAudio: function () {
                me.audio.play(`grunt_${me.Math.round(me.Math.random(0.5, 5.5))}`, false, null, .7)
            },
            footstepAudio: function () {
                me.audio.play(`footstep_${me.Math.round(me.Math.random(1.5, 5.5))}`, false, null, .1)
                setTimeout(() => {
                    this.walkAudio = false;
                }, 200);
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
                this.time += dt
                if (this.timerActive) {
                    game.data.score = this.convertTime(this.time)
                }
                if (this.fsm.state == "electrocute") {
                    me.audio.play("electrocute", false, null, 0.08)
                    this.body.vel.x = 0;
                    this.body.vel.y = 0;
                    this.fallCount = 0;
                    this.handleAnimationTransitions();
                    return (this._super(me.Entity, 'update', [dt]))
                }
                if (this.fsm.state == "hurt") {
                    this.holdSetMaxVelX = false;
                    this.handleAnimationTransitions();
                    me.collision.check(this);
                    this.body.update(dt);
                    return (this._super(me.Entity, 'update', [dt]))
                }
                this.handleAnimationTransitions();

                /////////////// MAX VEL HANDLER //////////////
                /// Decel ///
                if (!this.holdSetMaxVelX && !this.isCrouched) {
                    if (Math.abs(this.body.vel.x) > this.body.runSpeed) {
                        this.body.maxVel.x *= .987;
                    } else {
                        this.body.maxVel.x = this.body.runSpeed;
                    }
                    // /// Acceleration ///
                    // if (Math.abs(this.body.vel.x) < 1) {
                    //     this.body.maxVel.x = 1
                    // } else if (this.body.maxVel.x < this.body.runSpeed){
                    //     this.body.maxVel.x *= 1.005;
                    // } else {
                    //     this.body.maxVel.x = this.body.runSpeed
                    // }
                }

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
                    this.body.force.x = this.renderable.isFlickering() ? this.body.force.x : this.body.idleSpeed;
                }
                if (this.fsm.state == "walk" && !this.walkAudio) {
                    if (this.renderable.getCurrentAnimationFrame() == 1 || this.renderable.getCurrentAnimationFrame() == 3) {
                        this.walkAudio = true;
                        this.footstepAudio();
                    }
                }
                ///////// CROUCH, CRAWL, & SLIDE /////////

                if (me.input.isKeyPressed('down') && this.fsm.state != 'crawl') {

                    if (Math.abs(this.body.vel.x) > 6.5 && this.isGrounded()) {
                        this.slide();
                    } else {
                        this.crouch();
                    }
                }
                if (this.fsm.state == "crouch" || this.fsm.state == "slideAttack" && !me.input.isKeyPressed('down')) {
                    this.crouch();
                }
                if (this.fsm.state == "slideAttack") {
                    this.body.force.x = 0;
                }
                if (this.fsm.state == "crouch" && this.body.idleSpeed == 0 && this.isGrounded() && (me.input.isKeyPressed('right') || me.input.isKeyPressed('left'))) {
                    setTimeout(() => {
                        this.fsm.dispatch("crawl");
                    }, 100);

                }

                if (this.fsm.state == "crawl" && this.isGrounded()) {
                    this.crawl();
                }
                //resize hitbox when standing up
                if (this.fsm.secondaryState == "crouching" && !me.input.isKeyPressed("down")) {
                    this.standUp()
                }

                ///////// JUMPING & FALLING /////////
                if (this.jumpEnabled) {
                    this.holdSetMaxVelX = false;
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
                    this.holdSetMaxVelX = false;
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
                    this.body.maxVel.y = 40;
                }
                if (this.selectedPlayer == "brad") {
                    this.handleBradJumpAndFall();
                    this.holdSetMaxVelX = false;
                }
                if (!this.body.falling && this.fallCount != 0) {
                    this.fallCount = 0;
                }

                //////////  POWER UP  //////////
                if (this.powerUpItem != false) {
                    if (this.powerUpItem == "jimSpecial") {
                        this.holdSetMaxVelX = false;
                        if (this.jetFuel > 0 && me.input.keyStatus('attack')) {
                            const jetForce = this.body.vel.y < 6 ? 1 : 2;
                            this.jetFuel -= 0.4;
                            this.body.vel.y -= jetForce;
                            this.fsm.dispatch("fly");
                            if (!this.jetPackAudio) {
                                this.jetPackAudio = true;
                                me.audio.play("jetPack_2", false, () => { this.jetPackAudio = false }, 0.05)
                            }
                        } else {
                            me.audio.stop("jetPack_2")
                            this.jetPackAudio = false;
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
                            if (this.fsm.state == "fall" && !me.input.isKeyPressed("jump")) {
                                const fallVolume = me.Math.clamp(this.fallCount * 0.01, 0, .35);
                                me.audio.play("land", false, null, fallVolume);
                            }
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
                            this.holdSetMaxVelX = true;
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
                        if (this.fsm.state == "fall") {
                            me.audio.play("land", false, null, .3);
                        }
                        if (this.pos.y < other.pos.y && this.body.falling) {
                            this.resetSettings(other.body.collisionType);
                            this.body.vel.x = other.body.vel.x
                            this.body.setFriction(0, 0);
                        } else {
                            this.hurt()
                            return false
                        }
                        break;
                    case me.collision.types.PROJECTILE_OBJECT:

                        this.knockback(other)
                        return false
                    case me.collision.types.ENEMY_OBJECT:
                        if (!other.isMovingEnemy) {
                            // spike or any other fixed danger
                            this.body.vel.y -= this.body.jumpSpeed * me.timer.tick;
                        } else {
                            // a regular moving enemy entity
                            if ((response.overlapV.y > 0) && this.body.falling && !this.renderable.isFlickering()) {
                                // jump
                                this.body.vel.y -= this.body.jumpSpeed * 1.5 * me.timer.tick;
                            }
                            else {
                                this.knockback(other, 750);
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
            knockback: function (other, duration) {
                this.hurt(duration, true)
                this.body.vel.y = -10
                if (other.body.vel.x < 0) {
                    this.body.force.x = -5
                } else if (other.body.vel.x > 0) {
                    this.body.force.x = 5
                } else {
                    this.body.force.x = game.mainPlayer.pos.x < other.pos.x ? -5 : 5
                }
                this.body.force.y = 0
            },
            hurt: function (duration, knockback) {
                if (!knockback) {
                    this.body.vel.x = 0
                    this.body.force.x = 0
                    this.body.force.y = 0
                }
                if (!this.hurtAudio) {
                    this.hurtAudio = true;
                    me.audio.play("hurt", false, null, .3);
                }
                var sprite = this.renderable;
                if (!sprite.isFlickering()) {
                    this.fsm.dispatch('hurt')
                    if (!this.slimed) {
                        sprite.tint.setColor(255, 192, 192);
                    }

                    sprite.flicker(duration || 750, () => {
                        if (!this.slimed) {
                            sprite.tint.setColor(255, 255, 255);
                        }
                        this.fsm.dispatch('recover')
                        if (this.fsm.secondaryState != "crouching") {
                            this.standUp()
                        }
                        this.hurtAudio = false;
                    });
                }
            }
        })
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin