const mainPlayerMixin = async (me, game, toggleModal, getPrScores) => {
    const getMainPlayer = async () => {
        game.WarpEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                if (settings.type == "start") {
                    me.game.world.hasStart = true
                    game.mainPlayer.renderable.setOpacity(0);
                    game.mainPlayer.renderable.setCurrentAnimation("faceCamera");
                    game.startBooth = this;
                }
                if (settings.type == "finish") {
                    me.game.world.hasFinish = true
                }
                this.startY = y;
                this._super(me.Entity, "init", [
                    x, y, settings
                ]);



                this.settings = settings;
                // set the collision type
                this.type = this.settings.type;

                this.canFade = true;

                if (this.settings.to) {
                    const xPos = this.settings.to.length > 5 ? this.pos.x - ((this.settings.to.length - 5) * 11) : this.pos.x
                    let label = new me.BitmapText(xPos + 10, this.pos.y, {
                        font: "PressStart2P",
                        textAlign: "left",
                        textBaseline: "bottom",
                        text: this.settings.to
                    })
                    me.game.world.addChild(label, 8);
                }

                this.renderable = game.texture.createAnimationFromName([
                    "phonebooth-0", "phonebooth-1", "phonebooth-2",
                    "phonebooth-3", "phonebooth-4", "phonebooth-5",
                    "phonebooth-6", "phonebooth-7", "phonebooth-8",
                    "phonebooth-9", "phonebooth-10", "phonebooth-11",
                    "phonebooth-12", "phonebooth-13", "phonebooth-14",
                ]);
                this.renderable.mask = this.body.shapes[0]
                this.anchorPoint.set(0.5, 0.5);
                this.renderable.addAnimation("idle", [0]);
                this.renderable.addAnimation("open", [{ name: 1, delay: 150 }, { name: 2, delay: Infinity }]);
                this.renderable.addAnimation("close", [{ name: 1, delay: 150 }, { name: 0, delay: Infinity }]);
                this.renderable.addAnimation("flicker", [3, 2, 3, 2], 400);
                this.renderable.addAnimation("warp", [
                    { name: 4, delay: 150 },
                    { name: 5, delay: 150 },
                    { name: 6, delay: 150 },
                    { name: 7, delay: 150 },
                    { name: 6, delay: 150 },
                    { name: 8, delay: 150 },
                    { name: 6, delay: 150 },
                    { name: 7, delay: 150 },
                    { name: 8, delay: 150 },
                    { name: 7, delay: 150 },
                    { name: 6, delay: 150 },
                    { name: 9, delay: 150 },
                    { name: 10, delay: 150 },
                    { name: 11, delay: 150 },
                    { name: 12, delay: 150 },
                    { name: 13, delay: 150 },
                    { name: 12, delay: 100 },
                    { name: 13, delay: 75 },

                ]);
                this.renderable.addAnimation("land", [
                    { name: 13, delay: 150 },
                    { name: 12, delay: 150 },
                    { name: 13, delay: 150 },
                    { name: 12, delay: 150 },
                    { name: 11, delay: 50 },
                    { name: 10, delay: 50 },
                    { name: 6, delay: 100 },
                    { name: 5, delay: 100 },
                    { name: 6, delay: 100 },
                    { name: 5, delay: 100 },
                    { name: 4, delay: 200 },
                    { name: 2, delay: Infinity },

                ]);

                this.body.collisionType = game.collisionTypes.WARP;

                if (this.type == "start") {
                    this.pos.y = this.pos.y - me.game.viewport.height;
                    this.body.collisionType = game.collisionTypes.NO_OBJECT;
                }

                this.renderable.addAnimation("warped", [14]);
                this.renderable.setCurrentAnimation("idle");
            },
            startAnimation: function () {
                me.audio.play("phonebooth_landing", false, null, 0.7)
                if (this.type == "start") {
                    this.renderable.setCurrentAnimation("land")
                    const fadePlayer = new me.Tween(game.mainPlayer.renderable).to({ alpha: 1 }, 500)
                    fadePlayer.easing(me.Tween.Easing.Linear.None);
                    const land = new me.Tween(this.pos).to({ y: this.startY }, 1200)
                        .onComplete(() => {
                            setTimeout(() => {
                                fadePlayer.start();
                            }, 500);

                        });
                    land.easing(me.Tween.Easing.Quadratic.In);

                    land.start();
                }
            },
            warpTo: function (area) {
                me.game.viewport.fadeIn("#000", 500, function () {
                    me.game.world.hasStart = me.game.world.hasFinish = game.startBooth = false
                    me.levelDirector.loadLevel(area, {
                        onLoaded: function () {
                            if (me.game.world.hasStart && me.game.world.hasFinish) {
                                me.game.world.addChild(me.pool.pull("startSequence"), Infinity);
                            } else {
                                if (game.startBooth) {
                                    game.startBooth.startAnimation()

                                }
                            }
                        }
                    });
                });
            },
            maybeUpdatePersonalRecord: function (time) {
                const currentLevel = me.levelDirector.getCurrentLevelId()
                // debugger
                if (!me.save[currentLevel] || time < me.save[currentLevel]) {
                    me.save[currentLevel] = game.mainPlayer.time;
                    getPrScores();
                }
            },
            update: function (dt) {
                if (this.type != "start") {

                    if (this.renderable.isCurrentAnimation("open") && !me.collision.check(game.mainPlayer)) {
                        this.renderable.setAnimationFrame();
                        this.renderable.setCurrentAnimation("close")
                        if (this.doorOpenAudio) {
                            me.audio.fade("phonebooth_open", 0.1, 0, 100)
                            this.doorOpenAudio = false
                        }
                        if (!this.doorCloseAudio && !this.doorOpenAudio) {
                            this.doorCloseAudio = true
                            me.audio.play("phonebooth_close", false, () => this.doorCloseAudio = false, 0.1)
                        }
                    }
                    if (this.renderable.isCurrentAnimation("warp") &&
                        this.renderable.getCurrentAnimationFrame() > 15 &&
                        this.renderable.pos.y < 230) {
                        this.renderable.pos.y += 20;
                    }
                    if (this.renderable.isCurrentAnimation("warped") && this.canFade) {
                        this.warpTo(this.settings.to);
                        this.canFade = false;
                        if (this.type == "finish") {
                            this.maybeUpdatePersonalRecord(game.mainPlayer.time)
                            toggleModal(me.levelDirector.getCurrentLevelId(), game.mainPlayer.time);
                        }
                    }
                }
                if (this.type == "finish" && !this.ringing && !this.isWarping) {
                    this.ringing = true;
                    const volumePerspective = me.Math.clamp(Math.abs(40 / ((game.mainPlayer.pos.x - this.pos.x) + (game.mainPlayer.pos.y - this.pos.y))), 0, 0.15)
                    me.audio.play("phone_ring", false, null, volumePerspective)
                    setTimeout(() => {
                        this.ringing = false;
                    }, 3000);
                }

                return (this._super(me.Entity, 'update', [dt])) || this.renderable.isCurrentAnimation("warp");
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                if (other.name == "mainPlayer" && this.type != "start") {

                    if (!this.renderable.isCurrentAnimation("open") && !this.isWarping) {
                        this.renderable.setAnimationFrame();
                        this.renderable.setCurrentAnimation("open");
                        if (this.doorCloseAudio) {
                            this.doorCloseAudio = false;
                            me.audio.fade("phonebooth_close", 0.1, 0, 100)
                        }
                        if (!this.doorOpenAudio) {
                            this.doorOpenAudio = true
                            me.audio.play("phonebooth_open", false, () => this.doorOpenAudio = false, 0.1)
                        }
                    }

                    if (me.input.isKeyPressed('down') && !other.body.jumping && !other.body.falling) {
                        game.mainPlayer.jetFuel = 0;
                        if (this.renderable.isCurrentAnimation("open")) {
                            if (other.body.facingLeft) {
                                other.renderable.flipX(false);
                            }
                            other.isWarping = true;
                            this.isWarping = true;
                            var self = this;
                            self.renderable.setCurrentAnimation('flicker', function () {
                                other.renderable.setOpacity(0);
                                me.audio.play("phonebooth", false, null, 0.5);
                                self.renderable.setCurrentAnimation('warp', function () {
                                    self.renderable.pos.y = 0;
                                    self.renderable.setCurrentAnimation('warped');
                                });
                            });
                            other.renderable.setAnimationFrame();
                            other.renderable.setCurrentAnimation("emote");
                            me.audio.play(`yeah_${me.Math.round(me.Math.random(0.5, 2.5))}`, false, null, 0.4)
                            if (this.type == "finish") {
                                me.audio.play("horns", false, null, .15);
                            }
                        }
                    }
                }

                return false;
            }
        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin