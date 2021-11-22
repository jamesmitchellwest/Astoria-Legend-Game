// import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.PacManEntity = me.Entity.extend({

            init: function (x, y, settings) {
                this.startX = x;
                this._super(me.Entity, "init", [settings.x, settings.y, settings]);
                // this.body.addShape(new me.Rect(x, y, this.width, this.height));
                this.renderable = game.texture.createAnimationFromName([
                    "pacman-0", "pacman-1", "pacman-2"
                ]);
                this.isMovingEnemy = true;
                this.anchorPoint.set(0.5, 0.5);
                this.body.friction.set(0, 0)
                this.body.setMaxVelocity(5, 0);
                if (settings.flipX) {
                    this.renderable.flipX(true);
                    this.body.vel.x = -5;
                } else {
                    this.body.vel.x = 5
                }
                this.body.collisionType = game.collisionTypes.PACMAN;
                this.pos.z = 8;
                this.alwaysUpdate = true;
                this.inViewport = true
                this.pacmanDeleteAfter = settings.pacmanDeleteAfter || me.game.world.width;
            },
            update: function (dt) {
                // window.setDebugVal(`
                //     ${stringify(this.body.vel.x)}
                //  `)
                if (this.pacmanDeleteAfter > 0) {
                    if (Math.abs(this.pos.x - this.startX) > this.pacmanDeleteAfter && this.renderable.alpha == 1) {
                        const fadeAndRemove = new me.Tween(this.renderable).to({ alpha: 0 },);
                        fadeAndRemove.easing(me.Tween.Easing.Linear.None);
                        fadeAndRemove.start();
                    }
                }
                if (this.renderable.alpha == 0) {
                    me.game.world.removeChild(this);
                }
                const volumePerspective = me.Math.clamp(Math.abs(40 / ((game.mainPlayer.pos.x - this.pos.x) + (game.mainPlayer.pos.y - this.pos.y))), 0, 0.2)
                if (this.inViewport && !this.playing) {
                    this.playing = true;
                    me.audio.play("pacman", false, () => { this.playing = false }, volumePerspective > .06 ? volumePerspective : 0)
                }

                this.body.update();
                me.collision.check(this);

                return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },
            onCollision: function (response, other) {

                return false
            }

        });

        game.PacManEntity.width = 60;
        game.PacManEntity.height = 60;
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin