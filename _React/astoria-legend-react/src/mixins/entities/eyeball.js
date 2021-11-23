import { frames as animFrames } from '../../resources/texture.json'
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.EyeballEntity = me.Entity.extend({

            init: function (x, y, settings) {
                this.startX = x;

                this._super(me.Entity, "init", [x + 13, y + 30, settings]);
                this.settings = settings
                this.renderable = game.texture.createAnimationFromName(animFrames.filter(x => x.filename.includes("eyeball"))
                    .map(x => x.filename.includes("eyeball") ? x.filename : null));
                this.renderable.addAnimation("init", [0]);
                this.renderable.addAnimation("fall", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, { name: 13, delay: 3000 }]);
                this.renderable.addAnimation("retract", [15, 16, 17]);
                this.renderable.setCurrentAnimation("init");
                this.renderable.setOpacity(0);
                this.renderable.anchorPoint.set(0, 0);
                this.body.setVelocity(0, 0);
                this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
                this.pos.z = 8;
                this.isAnimating = false;
                this.height = 8;
                this.frameHeights = {
                    "init": [9],
                    "fall": [9, 39, 54, 69, 84, 99, 114, 129, 144, 159, 174, 189, 204, 219, 225, 219, 204, 219],
                    "retract": [180, 120, 60],
                }
            },

            update: function (dt) {

                if (this.renderable.isCurrentAnimation("init")) {
                    this.renderable.setOpacity(0);
                } else { this.renderable.setOpacity(1) }
                let _this = this;
                if (this.settings.parent.renderable.isCurrentAnimation("eyeball") &&
                    !this.isAnimating) {
                    this.isAnimating = true;
                    this.renderable.setCurrentAnimation("fall", function () {
                        _this.renderable.setCurrentAnimation("retract", function () {
                            _this.renderable.setCurrentAnimation("init")
                            _this.isAnimating = false;

                        })

                    })
                }

                if (this.previousAnimFrame != this.renderable.getCurrentAnimationFrame()) {
                    this.previousAnimFrame = this.renderable.getCurrentAnimationFrame();

                    this.height = this.frameHeights[this.renderable.current.name][this.renderable.getCurrentAnimationFrame()]
                    let shape = this.body.getShape(0)
                    shape.points[2].y = shape.points[3].y = this.height;
                    shape.setShape(0, 0, shape.points)
                }






                // this.body.vel.x -= this.body.accel.x * dt / 1000;

                this.body.update();

                return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },
            onCollision: function (response, other) {
                return false;
            }
        });

        game.EyeballEntity.width = 18;
        game.EyeballEntity.height = 9;

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin