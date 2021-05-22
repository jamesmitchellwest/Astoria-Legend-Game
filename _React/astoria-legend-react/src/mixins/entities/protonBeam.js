const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async function () {
        game.ProtonBeam = me.Sprite.extend({

            init: function (x, y, settings) {

                this._super(me.Sprite, "init", [settings.containerWidth - 8, settings.containerHeight / 2 - 6, Object.assign({
                    image: game.texture,
                    region: "protonbeam-0"
                }, settings)]);
                const sprite =  game.texture.createAnimationFromName([
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
                // this.body.addShape(new me.Rect(x, y, this.width, this.height));

                this.anchorPoint.set(0.5, 0.5);
                this.pos.z = 8;
                this.addAnimation("shoot", [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 31, 32, 33], 50);
                this.addAnimation("maxRange", [34, 35], 50);
                this.setCurrentAnimation("shoot");
                this.setOpacity(0);
                this.shoot();
            },

            shoot: function (pos) {
                var _this = this;

                this.timer = me.timer.setInterval(function () {
                    _this.setOpacity(1);
                    // _this.setAnimationFrame();
                    // _this.setCurrentAnimation("shoot", function () {
                    //     _this.setCurrentAnimation("maxRange");
                    //     setTimeout(function () {
                    //         _this.setOpacity(0);
                    //     }, 1000);
                    // });

                }, 3000);


            },
            update: function (dt) {
                // this.body.vel.x -= this.body.accel.x * dt / 1000;

                // if (this.pos.x + this.height <= 0) {
                //     me.game.world.removeChild(this);
                // }

                // me.collision.check(this);

                return (this._super(me.Sprite, 'update', [dt]));
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