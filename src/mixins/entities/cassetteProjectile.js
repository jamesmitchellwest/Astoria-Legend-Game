const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.CassetteProjectile = me.Entity.extend({

            init: function (x, y, settings) {
                this.startY = y;
                this._super(me.Entity, "init", [settings.x + 60, settings.y + 100, settings]);
                this.renderable = game.texture.createAnimationFromName([
                    "cassette-0", "cassette-1", "cassette-2",
                ]);
                this.mass = 0.6;
                this.anchorPoint.set(0.5, 0.5);
                this.renderable.addAnimation("one", [0])
                this.renderable.addAnimation("two", [1])
                this.renderable.addAnimation("three", [2])
                this.random = Math.random()
                if (this.random > .66) {
                    this.renderable.setCurrentAnimation("one")
                }
                else if (this.random < .33) {
                    this.renderable.setCurrentAnimation("two")
                }
                else {
                    this.renderable.setCurrentAnimation("three")
                }

                this.body.force.y = me.Math.random(-12, -9);
                this.body.force.x = me.Math.random(-2, 2)
                this.body.setMaxVelocity(5, 15)
                this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
                this.alwaysUpdate = true;
            },

            update: function (dt) {
                this.body.force.y *= .85;
                this.renderable.rotate(.2);
                if (this.pos.y - this.startY > 1080) {
                    me.game.world.removeChild(this);
                }
                this.body.update(dt);
                return (this._super(me.Entity, "update", [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },
            onCollision: function (response, other) {
                if(other.name == "mainPlayer"){
                    if (!this.audioPlaying){
                        this.audioPlaying = true;
                        me.audio.play("doyoyoying", false, null, .15)
                    me.audio.play("cassett_hit", false, ()=>{this.audioPlaying = false}, .3)
                    }
                    me.game.world.removeChild(this);
                }
            }
        });

        game.CassetteProjectile.width = 24;
        game.CassetteProjectile.height = 15;
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin