import { stringify } from 'flatted';

const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.HoverboardEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                this.startX = x;
                this.startY = y;


                // call the super constructor
                this._super(me.Entity, "init", [
                    x, y, settings
                ]);
                this.settings = settings;


                this.anchorPoint.set(0.5, 0.2);
                this.body.setMaxVelocity(2.5, 5);
                this.body.ignoreGravity = true;
                this.startSpeed = .05;
                this.renderable = game.texture.createAnimationFromName([
                    "hoverboard-00", "hoverboard-01", "hoverboard-02",
                ])
                this.renderable.addAnimation("hover", [0, 1, 2, 1], 200);
                this.renderable.setCurrentAnimation("hover");
                this.renderable.flipX(true)
                this.lateralDistance = settings.lateralDistance || 1000;
                this.verticalDistance = settings.verticalDistance || 1000;
                this.pauseDuration = settings.pauseDuration || 2500;
                this.timeout = false;
                this.lastCollision = 0

                this.body.collisionType = game.collisionTypes.MOVING_PLATFORM;
                this.body.setFriction(0, 0);
                // don't update the entities when out of the viewport
                this.height = this.settings.height - 50;

                if (this.settings.direction != "up") {
                    this.moving = "right";
                    this.body.vel.x = this.startSpeed
                    this.alwaysUpdate = false;
                } else {
                    this.alwaysUpdate = true;
                }

                this.doPassiveTweens();
            },
            doPassiveTweens: function () {
                this.tweenPause = false;
                const downTween = this.downTween = new me.Tween(this.pos).to({ y: this.pos.y + 8 }, 800)
                    .onComplete(() => { upTween.start() });
                const upTween = this.upTween = new me.Tween(this.pos).to({ y: this.pos.y - 8 }, 800)
                    .onComplete(() => { downTween.start() });
                downTween.easing(me.Tween.Easing.Cubic.InOut);
                upTween.easing(me.Tween.Easing.Cubic.InOut);
                downTween.start();
            },
            doCollisionTweens: function () {

                if (!this.colliding) {
                    me.audio.play("hoverboard_landing", false, null, .1)
                    this.colliding = true;
                    this.downTween.stop();
                    this.upTween.stop();
                    this.tweenPause = true;
                    const reboundTween = this.reboundTween = new me.Tween(this.pos).to({ y: this.startY }, 1000)
                        .onComplete(() => {
                            if (this.settings.direction == "up") {
                                this.body.vel.y = -5;
                                this.moving = "up";
                            } else {
                                this.doPassiveTweens();
                            }
                        })
                    reboundTween.easing(me.Tween.Easing.Quadratic.In);
                    reboundTween.easing(me.Tween.Easing.Elastic.Out);
                    const dropTween = new me.Tween(this.pos).to({ y: this.pos.y + 20 }, 200)
                        .onComplete(() => {
                            reboundTween.start()
                        })

                    dropTween.easing(me.Tween.Easing.Quadratic.Out);
                    dropTween.start();
                }

            },
            verticalUpdate: function () {
                if (this.startY - this.pos.y >= this.verticalDistance && this.moving == "up" && !this.timeout) {
                    this.body.vel.y = 0;
                    this.timeout = true;
                    setTimeout(() => {
                        this.body.vel.y = 8;
                        this.moving = "down";
                        this.timeout = false;
                    }, this.pauseDuration);
                }
                if (this.startY - this.pos.y <= 0 && this.body.vel.y > 0 && this.moving == "down") {
                    this.moving = "idle";
                    this.body.vel.y = 0;
                    this.doPassiveTweens();
                }
            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {
                // window.setDebugVal(`
                //     ${stringify(this.moving)}
                //  `)
                if (this.settings.direction == "up") {
                    // update vertical hoverboard
                    this.verticalUpdate()
                } else {
                    // update horizontal hoverboard
                    if (this.pos.x - this.startX <= 0 && this.body.vel.x < 0) {
                        this.moving = "right";
                        this.body.vel.x = this.startSpeed
                    }
                    if (this.pos.x - this.startX >= this.lateralDistance && this.body.vel.x) {
                        this.moving = "left";
                        this.body.vel.x = -this.startSpeed
                    }
                    /////slow down movement////
                    if ((this.pos.x - this.startX < 110 && this.moving == "left") ||
                        (this.pos.x - this.startX > this.lateralDistance - 110 && this.moving == "right")) {
                        this.body.vel.x *= .98;
                    }
                    if ((this.pos.x - this.startX < 120 && this.moving == "right") ||
                        (this.pos.x - this.startX > this.lateralDistance - 120 && this.moving == "left")) {
                        this.body.vel.x *= 1.025;
                    }
                }
                // collision stuff
                if (this.colliding && me.timer.getTime() - this.lastCollision > 100) {
                    this.colliding = false
                }
                if (this.colliding && !me.input.keyStatus("jump")) {
                    game.mainPlayer.pos.y = this.pos.y - game.mainPlayer.height
                }

                // check & update movement
                if (this.inViewport || this.settings.direction == "up") {
                    this.body.update(dt);
                }

                // audio 
                const volumePerspective = me.Math.clamp(Math.abs(60 / ((game.mainPlayer.pos.x - this.pos.x) + (game.mainPlayer.pos.y - this.pos.y))), 0, 0.3)
                if (this.inViewport && !this.playing) {
                    this.playing = true;
                    me.audio.play("hoverboard", false, null, volumePerspective)
                    setTimeout(() => {
                        this.playing = false;
                    }, 240);
                }

                // return true if we moved of if flickering
                return (this._super(me.Entity, "update", [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },

            /**
             * collision handle
             */
            onCollision: function (response, other) {
                if (other.name == "mainPlayer") {

                    if (response.overlapV.y > 0 && !this.tweenPause) {

                        this.doCollisionTweens();

                    }
                    this.lastCollision = me.timer.getTime()
                }
                return false;
            }

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin