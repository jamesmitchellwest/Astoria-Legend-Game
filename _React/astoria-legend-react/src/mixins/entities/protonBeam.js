const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.ProtonBeam = me.Entity.extend({

            init: function (x, y, settings) {


                this._super(me.Entity, "init", [settings.containerWidth - 8, settings.containerHeight / 2 - 6, settings]);
                // this.body.addShape(new me.Rect(x, y, this.width, this.height));
                this.renderable = game.texture.createAnimationFromName([
                    "protonbeam-0", "protonbeam-1", "protonbeam-2",
                    "protonbeam-3", "protonbeam-4", "protonbeam-5",
                    "protonbeam-6", "protonbeam-7", "protonbeam-8",
                    "protonbeam-9", "protonbeam-10", "protonbeam-11",
                    "protonbeam-12", "protonbeam-13", "protonbeam-14",
                    "protonbeam-15", "protonbeam-16", "protonbeam-17",
                    "protonbeam-18", "protonbeam-19", "protonbeam-20",
                    "protonbeam-21", "protonbeam-22", "protonbeam-23",
                    "protonbeam-24", "protonbeam-25", "protonbeam-26",
                    "protonbeam-27", "protonbeam-28", "protonbeam-29",
                    "protonbeam-30", "protonbeam-31", "protonbeam-32",
                    "protonbeam-33", "protonbeam-34", "protonbeam-35",
                ]);
                this.anchorPoint.set(0.5, 0.5);
                this.body.setVelocity(30, 0);
                this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
                this.pos.z = 8;
                this.renderable.addAnimation("shoot", [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 31, 32, 33], 50);
                this.renderable.addAnimation("maxRange", [34, 35], 50);
                this.renderable.setCurrentAnimation("shoot");
                this.renderable.setOpacity(0);
                this.shoot();
            },

            shoot: function (pos) {
                var _this = this;

                this.timer = me.timer.setInterval(function () {
                    _this.renderable.setOpacity(1);
                    _this.renderable.setAnimationFrame();
                    _this.renderable.setCurrentAnimation("shoot", function () {
                        _this.renderable.setCurrentAnimation("maxRange");
                        setTimeout(function () {
                            _this.renderable.setOpacity(0);
                        }, 1000);
                    });

                }, 3000);


            },
            update: function (dt) {
                // this.body.vel.x -= this.body.accel.x * dt / 1000;

                // if (this.pos.x + this.height <= 0) {
                //     me.game.world.removeChild(this);
                // }

                this.body.update();
                // me.collision.check(this);

                return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },
            onDeactivateEvent: function () {
                me.timer.clearInterval(this.timer);
            },
            onCollision: function (res, other) {
                other.name == "mainPlayer" && other.hurt();
                return false;
            }
        });

        game.ProtonBeam.width = 720;
        game.ProtonBeam.height = 48;
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin