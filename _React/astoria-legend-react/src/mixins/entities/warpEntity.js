const mainPlayerMixin = async (me, game, toggleModal) => {
    const getMainPlayer = async () => {
        game.WarpEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this._super(me.Entity, "init", [
                    x, y, settings
                ]);

                this.settings = settings;
                // set the collision type

                this.body.collisionType = game.collisionTypes.WARP;
                this.canFade = true;
                // basic renderable that cast a ray across the world
                me.game.world.addChild(new me.BitmapText(this.pos.x, this.pos.y, {
                    font: "PressStart2P",
                    textAlign: "left",
                    textBaseline: "bottom",
                    text: this.settings.to
                }),8);
                this.renderable = game.texture.createAnimationFromName([
                    "phonebooth-0", "phonebooth-1", "phonebooth-2",
                    "phonebooth-3", "phonebooth-4", "phonebooth-5",
                    "phonebooth-6", "phonebooth-7", "phonebooth-8",
                    "phonebooth-9", "phonebooth-10", "phonebooth-11",
                    "phonebooth-12", "phonebooth-13", "phonebooth-14",
                ]);
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
                this.renderable.addAnimation("warped", [14]);
                this.renderable.setCurrentAnimation("idle");
            },
            warpTo: function (area) {
                me.game.viewport.fadeIn("#000", 500, function () {
                    me.levelDirector.loadLevel(area);
                });
            },
            update: function (dt) {
                if (this.renderable.isCurrentAnimation("open") && !me.collision.check(game.mainPlayer)) {
                    this.renderable.setAnimationFrame();
                    this.renderable.setCurrentAnimation("close")
                }
                if (this.renderable.isCurrentAnimation("warp") &&
                    this.renderable.getCurrentAnimationFrame() > 15 &&
                    this.renderable.pos.y < 230) {
                    this.renderable.pos.y += 20;
                }
                if (this.renderable.isCurrentAnimation("warped") && this.canFade) {
                    this.warpTo(this.settings.to);
                    this.canFade = false;
                    toggleModal(me.levelDirector.getCurrentLevelId());
                }


                return (this._super(me.Entity, 'update', [dt])) || this.renderable.isCurrentAnimation("warp");
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                if (other.name == "mainPlayer") {

                    if (!this.renderable.isCurrentAnimation("open") &&
                        !this.renderable.isCurrentAnimation("flicker") &&
                        !this.renderable.isCurrentAnimation("warp") &&
                        !this.renderable.isCurrentAnimation("warped")) {
                        this.renderable.setAnimationFrame();
                        this.renderable.setCurrentAnimation("open");
                    }

                    if (me.input.isKeyPressed('down') && !other.body.jumping && !other.body.falling) {
                        if (this.renderable.isCurrentAnimation("open")) {
                            if (other.body.facingLeft) {
                                other.renderable.flipX(false);
                            }
                            other.body.isWarping = true;
                            var self = this;
                            self.renderable.setCurrentAnimation('flicker', function () {
                                other.renderable.setOpacity(0);
                                me.audio.play("phonebooth", false);
                                self.renderable.setCurrentAnimation('warp', function () {
                                    self.renderable.pos.y = 0;
                                    self.renderable.setCurrentAnimation('warped');
                                });
                            });
                            other.renderable.setAnimationFrame();
                            other.renderable.setCurrentAnimation("emote");
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