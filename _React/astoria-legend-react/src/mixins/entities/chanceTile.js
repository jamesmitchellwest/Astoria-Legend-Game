import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.ChanceTileEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                // replace default rectangle with topLine

                this.topLine = new me.Line(0, 0, [
                    new me.Vector2d(5, 0),
                    new me.Vector2d(settings.width - 5, 0)
                ]);
                this.rightLine = new me.Line(0, 0, [
                    new me.Vector2d(settings.width, 5),
                    new me.Vector2d(settings.width, settings.height - 5)
                ]);
                this.bottomLine = new me.Line(0, 0, [
                    new me.Vector2d(5, settings.height),
                    new me.Vector2d(settings.width - 5, settings.height)
                ]);
                this.leftLine = new me.Line(0, 0, [
                    new me.Vector2d(0, 5),
                    new me.Vector2d(0, settings.height - 5)
                ]);

                settings.shapes[0] = this.topLine

                this._super(me.Entity, 'init', [x, y, settings]);

                this.body.addShape(this.rightLine);
                this.body.addShape(this.bottomLine);
                this.body.addShape(this.leftLine);

                this.body.collisionType = me.collision.types.WORLD_SHAPE;

                this.collected = false;

            },
            
            update: function (dt) {

                // window.setDebugVal(`
                //     ${stringify(me.collision)}
                //  `)

                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {

                if (other.name == "mainPlayer" && other.body.vel.y < 0 && response.overlapV.x == 0 && response.overlapV.y < 0 && !this.collected) {
                    this.collected = true;
                    game.HUD.PowerUpItem.roll();
                }
                return false;

            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin