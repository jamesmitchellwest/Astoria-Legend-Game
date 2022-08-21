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
                this.body.setMaxVelocity(10, 0);
                if (settings.flipX) {
                    this.renderable.flipX(true);
                    this.body.vel.x = 10;
                } else {
                    this.body.vel.x = -10
                }
                this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
                this.pos.z = 8;
                this.alwaysUpdate = true;
                this.renderable.scale(1.5, 1.5)
            },
            update: function (dt) {
                // this.body.vel.x -= this.body.accel.x * dt / 1000;
                if (this.pos.x + this.height <= 0) {
                    me.game.world.removeChild(this);
                }
                const volumePerspective = me.Math.clamp(Math.abs(80 / ((game.mainPlayer.pos.x - this.pos.x) + (game.mainPlayer.pos.y - this.pos.y))), 0, 0.4)
                if(!this.cubeAudio){
                    this.cubeAudio = true;
                    me.audio.play("cube_flying", false, ()=> {this.cubeAudio = false}, volumePerspective)
                }
                this.body.update();
                me.collision.check(this);

                return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },
            onCollision: function (response, other) {
                me.game.world.removeChild(this);
                me.audio.play("hurt", false, null, .1)
            }
        });

        game.CubeProjectile.width = 21;
        game.CubeProjectile.height = 21;
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin