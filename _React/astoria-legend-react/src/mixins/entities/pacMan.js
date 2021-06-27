import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.PacManEntity = me.Entity.extend({

            init: function (x, y, settings) {
                this.startX = x;

                this._super(me.Entity, "init", [settings.x, settings.y, settings]);
                // this.body.addShape(new me.Rect(x, y, this.width, this.height));
                this.renderable = game.texture.createAnimationFromName([
                    "pacMan-0", "pacMan-1", "pacMan-2"
                ]);
                this.isMovingEnemy = true;
                this.anchorPoint.set(0.5, 0.5);
                this.body.friction.set(0, 0)
                this.body.setMaxVelocity(5, 0);
                this.body.vel.x = 5
                this.body.collisionType = game.collisionTypes.PACMAN;
                this.pos.z = 8;
                this.alwaysUpdate = true;
                this.inViewport = true
            },
            update: function (dt) {
                window.setDebugVal(`
                    ${stringify(this.body.vel.x)}
                 `)
                if(!this.inViewport){
                    me.game.world.removeChild(this);
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