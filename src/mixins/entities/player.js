import { stringify } from 'flatted';
import { frames as animFrames } from '../../resources/texture.json'
import { createMachine } from '../../finite-state-machine';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        const RUN_SPEED = 9;
        const JUMP_SPEED = 17.3;
        const FALL_SPEED = 40;
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
                this.runSpeed = RUN_SPEED;
                this.slimedSpeed = me.Math.round(this.runSpeed * .5)
                this.jumpSpeed = this.body.jumpForce = JUMP_SPEED;
                this.boostedHorizontalSpeed = 35;
                this.boostedVerticalSpeed = this.jumpSpeed * 1.6;
                this.idleSpeed = 0;
                this.frictionX = 1.3
                this.boostedDir = "";
                this.isWarping = false;
                this.crawlSpeed = 3;
                this.fallCount = 0;
                this.shadowTrailSpeed = RUN_SPEED * 1.2;
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
                this.settings = settings;
                // max walking & jumping speed
                this.body.setMaxVelocity(this.runSpeed, this.jumpSpeed);
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
                this.renderable.addAnimation("crawl", [{ name: 6, delay: Infinity }, { name: 7, delay: Infinity }]);
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
                if (this.fsm.state == "dash") {
                    this.renderable.setCurrentAnimation(this.fsm.secondaryState)
                    this.drawShadow()
                    return;
                }
                if (this.renderable.current.name !== this.fsm.state) {
                    // this.renderable.setAnimationFrame();
                    this.renderable.setCurrentAnimation(this.fsm.state);
                }
                if (Math.abs(this.body.vel.x) > this.shadowTrailSpeed && this.fsm.state != "hurt") {
                    this.drawShadow()
                }
                if (this.fsm.state == "crawl") {
                    if (!this.boostedDir && Math.abs(this.body.force.x) == this.crawlSpeed ||
                        this.boostedDir && Math.abs(this.body.vel.x) == this.body.maxVel.x
                    ) {
                        this.renderable.setAnimationFrame(1)
                        me.timer.setTimeout(() => this.renderable.setAnimationFrame(0), 200)
                    }
                }
            },
            crouch: function () {
                this.holdSetMaxVelX = true;
                this.isCrouched = true;
                if (this.crouchDisabled) {
                    this.crouchDisabled = false
                    return
                }
                if (this.fsm.state != "jump" && this.fsm.state != "bradJumpLeft" && this.fsm.state != "fall" && this.fsm.state != "fall" && this.isGrounded()) {
                    this.body.force.x = this.idleSpeed;
                    this.body.maxVel.x = this.onMovingPlatform || this.boostedDir ? this.body.maxVel.x : this.crawlSpeed
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
            drawShadow: function () {
                const frame = this.renderable.anim[this.renderable.current.name].frames[this.renderable.current.idx].name
                // let shadow = game.texture.createSpriteFromName(`${this.selectedPlayer}_sprite-${frame}`);
                let shadow = me.pool.pull("playerShadow")
                shadow.setAnimationFrame(frame)
                shadow.pos.x = game.mainPlayer.pos.x
                shadow.pos.y = game.mainPlayer.pos.y
                shadow.alpha = 0.6
                shadow.tint.setColor(126, 174, 247)
                shadow.anchorPoint.set(0.2, 0);
                me.game.world.addChild(shadow, this.pos.z - 1);
                shadow.flipX(this.renderable.isFlippedX)
                const fadeTween = new me.Tween(shadow).to({ alpha: 0 }, 200).onComplete(() => {
                    me.game.world.removeChild(shadow)
                });
                fadeTween.start()
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
                if (!this.boostedDir) {
                    this.body.maxVel.x = this.runSpeed;
                }
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
                    this.body.force.y = 0
                    return
                }
                if (this.selectedPlayer == "brad" && this.renderable.isFlippedX) {
                    this.fsm.dispatch("bradJumpLeft");
                } else {
                    this.fsm.dispatch("jump");
                }
                this.body.jumpForce *= .6;
                if (this.body.maxVel.x < this.runSpeed) {
                    this.body.maxVel.x = this.runSpeed
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
            crawl: function () {
                const sign = this.renderable.isFlippedX ? -1 : 1;
                const fastCrawling = me.input.isKeyPressed(this.boostedDir)
                this.body.force.x = Math.abs(this.body.force.x) < 0.2 + this.idleSpeed ? (this.crawlSpeed * sign) + (this.idleSpeed * sign) : this.body.force.x * .9;
                if (this.boostedDir == "left" || this.boostedDir == "right") {
                    const boostedSign = this.boostedDir == "left" ? -1 : 1
                    this.idleSpeed = 0;
                    this.pos.x += fastCrawling ? this.crawlSpeed * boostedSign : (this.crawlSpeed * 0.5) * boostedSign;
                }
            },
            move: function () {

                if (me.input.isKeyPressed('left')) {

                    if (this.selectedPlayer == "brad") {
                        this.fsm.dispatch('bradWalkLeft');
                    } else {
                        this.fsm.dispatch('walk');
                    }
                    // flip the sprite on horizontal axis
                    this.renderable.flipX(true);
                    // move left
                    if (this.fsm.state == "crawl") {
                        this.crawl()
                    } else {
                        this.body.force.x = -this.runSpeed;
                    }

                } else if (me.input.isKeyPressed('right')) {
                    this.fsm.dispatch('walk')
                    // unflip the sprite
                    this.renderable.flipX(false);
                    // move right
                    if (this.fsm.state == "crawl") {
                        this.crawl()
                    } else {
                        this.body.force.x = this.runSpeed;
                    }

                } else {
                    if (this.fsm.state == "crawl") {
                        this.fsm.dispatch("crouch")
                    } else {
                        this.fsm.dispatch('idle');
                    }
                    this.body.force.x = this.idleSpeed;
                }


                if (this.fsm.state == "walk" && !this.walkAudio || this.fsm.state == "bradWalkLeft" && !this.walkAudio) {
                    if (this.renderable.getCurrentAnimationFrame() == 1 || this.renderable.getCurrentAnimationFrame() == 3) {
                        this.walkAudio = true;
                        this.footstepAudio();
                    }
                }
            },
            resetSettings: function (collisionType) {
                if (this.fsm.state == "fall" || this.fsm.state == "bradFallLeft") {
                    const action = me.input.isKeyPressed('right') || me.input.isKeyPressed('left') ? "landWalking" : "land"
                    this.fsm.dispatch(action)
                }
                if (collisionType != game.collisionTypes.MOVING_PLATFORM && collisionType != game.collisionTypes.PACMAN) {
                    this.body.setFriction(this.frictionX, 0)
                }
                if (collisionType != game.collisionTypes.BOOST && this.fsm.secondaryState == "crouching" && this.body.maxVel.y != this.jumpSpeed) {
                    this.body.maxVel.y = this.jumpSpeed
                }
                if (collisionType != game.collisionTypes.BOOST && this.fsm.secondaryState != "crouching") {
                    if (this.body.vel.y < 0 && this.body.maxVel.y > this.jumpSpeed) {
                        this.body.maxVel.y -= .3
                    } else {
                        this.boostedDir = "";
                        this.body.maxVel.y = this.jumpSpeed;
                    }
                    this.jumpEnabled = true
                }
                if (this.body.falling && this.body.jumpForce != this.jumpSpeed) {
                    this.body.jumpForce = this.jumpSpeed;
                }
                if (this.slimed &&
                    collisionType != game.collisionTypes.PACMAN &&
                    collisionType != game.collisionTypes.MOVING_PLATFORM &&
                    this.runSpeed == RUN_SPEED) {
                    this.runSpeed = this.slimedSpeed;
                }
                if (!this.slimed && this.fsm.state != "crawl" && this.runSpeed != RUN_SPEED) {
                    this.runSpeed = RUN_SPEED;
                }
                if (this.fsm.secondaryState == "crouching" &&
                    collisionType != game.collisionTypes.BOOST &&
                    this.fsm.state != "slideAttack" &&
                    !this.onMovingPlatform
                ) {
                    this.boostedDir = "";
                    if (this.body.maxVel.x > this.crawlSpeed) {
                        this.body.maxVel.x *= .9
                    }
                    if (this.body.maxVel.x < this.crawlSpeed) {
                        this.body.maxVel.x = this.crawlSpeed
                    }
                }
                if (this.fsm.state == "slideAttack" && collisionType != game.collisionTypes.BOOST && this.body.maxVel.x > RUN_SPEED) {
                    this.body.maxVel.x = RUN_SPEED
                }
            },
            powerUp: function () {

                if (this.powerUpItem == "superJump") {
                    this.body.jumpForce = 0;
                    this.fsm.dispatch("dash")
                    me.audio.play("super_jump", false, null, 0.05)
                    this.body.maxVel.y = 33;
                    this.body.vel.y = -this.body.maxVel.y
                    setTimeout(() => {
                        this.fsm.dispatch("endDash")
                    }, 600);
                }
                if (this.powerUpItem == "dash" && this.fsm.state != "dash") {
                    this.fsm.dispatch("dash")
                    me.audio.play("super_jump", false, null, 0.05)
                    this.holdSetMaxVelX = true;
                    this.body.maxVel.y = 0;
                    this.body.setFriction(0, 0)
                    this.brickSmash = true;
                    this.body.maxVel.x = 35;
                    this.body.force.x = this.renderable.isFlippedX ? -this.body.maxVel.x : this.body.maxVel.x
                    setTimeout(() => {
                        this.fsm.dispatch("endDash")
                        this.body.ignoreGravity = false;
                        this.brickSmash = false;
                        this.holdSetMaxVelX = false;
                        this.resetSettings();
                    }, 600);
                }
                if (this.powerUpItem == "teleport") {
                    const rayX = this.renderable.isFlippedX ? - 130 : this.width + 130
                    const ray = new me.Line(this.pos.x, this.pos.y, [
                        new me.Vector2d(rayX, 0),
                        new me.Vector2d(rayX, this.height)
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
                    me.audio.play("teleport", false, null, 0.2)
                    this.pos.x = this.renderable.isFlippedX ? this.pos.x - 190 : this.pos.x + 190;
                    this.body.vel.y = 0;
                }
                if (this.powerUpItem == "bradSpecial") {
                    me.audio.play("synth_wobble", false, null, .07)
                    this.magicTileActive = true;
                    setTimeout(() => {
                        this.magicTileActive = false;
                    }, 10000);
                }
                this.powerUpItem = false;
                game.HUD.powerUpItem.setOpacity(0);

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
                // window.setDebugVal(
                //     `
                //     forceX: ${Number(this.body.force.x.toFixed(2))}<br>
                //     idlespeed: ${this.idleSpeed}<br>
                //     velX: ${this.body.vel.x}<br>
                //     maxVelX: ${this.body.maxVel.x}<br>
                //     state: ${this.fsm.state}<br>
                //     boostedDir: ${this.boostedDir}<br>
                //     frictionX: ${this.body.friction.x}<br>
                //     `
                // )
                if (this.isWarping || this.renderable.alpha < 1) {
                    this.powerUpItem = false;
                    game.HUD.powerUpItem.setOpacity(0);
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
                    // if (this.body.vel.x != 0 && this.boostedDir == "") {
                    //     this.body.vel.x *= 0.2;
                    // } else if (this.boostedDir == "left" || "right") {
                    //     this.body.force.x = 0;
                    //     this.body.vel.x = this.body.idleSpeed;
                    // }
                    // if (this.body.vel.y < 0) {
                    //     this.body.force.y = 0;
                    // }
                    this.holdSetMaxVelX = false;
                    if (this.boostedDir == "") {
                        this.body.force.x *= .9;
                        this.body.friction.x = .2;
                    } else if (this.boostedDir == "left" || this.boostedDir == "right") {
                        this.body.force.x = 0;
                        this.body.vel.x = this.boostedDir == "left" ? -6 : 6;
                    }
                    if (this.body.falling) {
                        this.fallCount += 1;
                        this.body.vel.y *= 1.0005
                        this.body.maxVel.y = FALL_SPEED;
                    }
                    this.handleAnimationTransitions();
                    me.collision.check(this)
                    this.body.update(dt);
                    return (this._super(me.Entity, 'update', [dt]))
                }
                this.handleAnimationTransitions();

                /////////////// MAX VEL HANDLER //////////////
                /// Decel ///
                if (!this.holdSetMaxVelX && !this.isCrouched) {
                    if (Math.abs(this.body.vel.x) > this.runSpeed) {
                        this.body.maxVel.x *= .987;
                    } else {
                        this.body.maxVel.x = this.runSpeed;
                    }
                    // /// Acceleration ///
                    // if (Math.abs(this.body.vel.x) < 1) {
                    //     this.body.maxVel.x = 1
                    // } else if (this.body.maxVel.x < this.runSpeed){
                    //     this.body.maxVel.x *= 1.005;
                    // } else {
                    //     this.body.maxVel.x = this.runSpeed
                    // }
                }

                ///////// HORIZONTAL MOVEMENT /////////
                this.move();
                ///////// CROUCH, CRAWL, & SLIDE /////////

                if (me.input.isKeyPressed('down') && this.fsm.state != 'crawl' && this.fsm.state != 'dash') {

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
                if (this.fsm.state == "crouch" && this.isGrounded() && (me.input.isKeyPressed('right') || me.input.isKeyPressed('left'))) {
                    this.fsm.dispatch("crawl");
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
                    this.body.maxVel.y = FALL_SPEED;
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
                            //cap jetPack vel without caping jump maxVel
                            if (this.body.vel.y > -12) {
                                this.body.vel.y -= jetForce;
                            }
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
                            game.HUD.powerUpItem.setOpacity(0);
                        }
                    } else {
                        if (me.input.isKeyPressed('attack')) {
                            this.powerUp();
                        }
                    }
                }
                if (this.pos.y > me.game.world.height || this.pos.y + 320 < me.game.world.pos.y) {
                    this.reSpawn();
                }
                if (this.time - this.lastCollision == dt * 2) {
                    console.log("exit")
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

                        // check for collision
                        var result = me.collision.rayCast(ray);
                        for (let index = 0; index < result.length; index++) {
                            if (result[index].name == "vanishingTile" && !result[index].vanishing) {
                                result[index].vanishing = true;
                                result[index].vanishTween.start()
                            }
                        }
                        break;
                    case game.collisionTypes.SPIKES:
                        if ((Math.abs(response.overlapV.y) + Math.abs(response.overlapV.x)) > 10) {
                            this.resetSettings(other.body.collisionType);
                            this.reSpawn();
                            this.hurt(750);
                        }
                        return false
                    case game.collisionTypes.PACMAN:
                        if (this.fsm.state == "fall") {
                            me.audio.play("land", false, null, .3);
                        }
                        if (this.pos.y < other.pos.y && this.body.falling) {
                            this.onMovingPlatform = true;
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
                    case game.collisionTypes.BOMB:

                        break;
                    case me.collision.types.ENEMY_OBJECT:
                        if (!other.isMovingEnemy) {
                            // spike or any other fixed danger
                            this.body.vel.y -= this.jumpSpeed * me.timer.tick;
                        } else {
                            // a regular moving enemy entity
                            if ((response.overlapV.y > 0) && this.body.falling && !this.renderable.isFlickering()) {
                                // jump
                                this.body.vel.y -= this.jumpSpeed * 1.5 * me.timer.tick;
                            }
                            else {
                                this.knockback(other);
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
            knockback: function (other, duration, forceX = 12, forceY = -10) {
                this.hurt(duration, true)
                this.body.vel.y = forceY;
                this.body.maxVel.x = forceX;
                // if (other.body.vel.x < 0) {
                //     this.body.force.x = -this.body.maxVel.x;
                // } else if (other.body.vel.x > 0) {
                //     this.body.force.x = this.body.maxVel.x;
                // } else if ((other.pos.x + (other.settings.height / 2)) < (this.pos.x + (this.settings.height / 2))) {
                //     this.body.force.x = this.body.maxVel.x;
                // } else {
                //     this.body.force.x = -this.body.maxVel.x;
                // }
                this.body.vel.x = 0
                this.body.force.x = 0
                this.body.force.y = 0
                this.body.force.x = this.centerX < other.centerX ? -forceX : forceX

            },
            hurt: function (duration = 1500, knockback) {
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

                    sprite.flicker(duration, () => {
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