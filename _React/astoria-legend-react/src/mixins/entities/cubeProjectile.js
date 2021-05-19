const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.CubeProjectile = me.Entity.extend({

            init: function (x, y, settings) {


                this._super(me.Entity, "init", [settings.x, settings.y, settings]);
                // this.body.addShape(new me.Rect(x, y, this.width, this.height));
                this.renderable = game.texture.createAnimationFromName([
                    "cube-0", "cube-1", "cube-2",
                    "cube-3",
                ]);
                this.anchorPoint.set(0.5, 0.5);
                this.body.setVelocity(30, 0);
                this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
                this.pos.z = 8;
                this.alwaysUpdate = true;
            },

            update: function (dt) {
                // this.body.vel.x -= this.body.accel.x * dt / 1000;

                this.body.vel.x = -10;
                if (this.pos.x + this.height <= 0) {
                    me.game.world.removeChild(this);
                }

                this.body.update();
                me.collision.check(this);

                return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },
            onCollision: function (res, other) {
                other.name == "mainPlayer" && other.hurt();
                me.game.world.removeChild(this);
            }
        });

        game.CubeProjectile.width = 21;
        game.CubeProjectile.height = 21;
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin