import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.ChanceTileEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this.topLine = new me.Line(0, 0, [
                    new me.Vector2d(0, 0),
                    new me.Vector2d(settings.width, 0)
                ]);
                this.rightLine = new me.Line(0, 0, [
                    new me.Vector2d(settings.width, 0),
                    new me.Vector2d(settings.width, settings.height)
                ]);
                this.bottomLine = new me.Line(0, 0, [
                    new me.Vector2d(0, settings.height),
                    new me.Vector2d(settings.width, settings.height)
                ]);
                this.leftLine = new me.Line(0, 0, [
                    new me.Vector2d(0, 0),
                    new me.Vector2d(0, settings.height)
                ]);

                this.startY = y;
                this.settings = settings;
                settings.shapes[0] = this.topLine

                this._super(me.Entity, 'init', [x, y, settings]);

                this.renderable = game.texture.createAnimationFromName([
                    "chance-0", "chance-1", "chance-2",

                ]);

                this.renderable.addAnimation("chanceTile", [2]);
                this.renderable.addAnimation("specialTile", [0]);
                this.renderable.addAnimation("collectedTile", [1]);
                this.renderable.setCurrentAnimation("chanceTile");

                this.renderable.anchorPoint.set(0, 0);
                this.body.addShape(this.rightLine);
                this.body.addShape(this.bottomLine);
                this.body.addShape(this.leftLine);

                this.body.collisionType = me.collision.types.WORLD_SHAPE;
                if (settings.type == "special") {
                    this.renderable.setCurrentAnimation("specialTile")
                }
                this.collected = false;

            },
            collisionTween: function () {
                const downTween = new me.Tween(this.pos).to({ y: this.startY  }, 1500)
                const upTween = new me.Tween(this.pos).to({ y: this.pos.y - 20 }, 100).onComplete(() => {
                    downTween.start();
                });

                upTween.easing(me.Tween.Easing.Linear.None);
                downTween.easing(me.Tween.Easing.Elastic.Out);
                upTween.start();

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

                if (other.name == "mainPlayer" && other.body.vel.y < 0 &&
                    !other.powerUpItem && response.overlapV.x == 0 &&
                    response.overlapV.y < 0 && !this.collected) {
                    if (this.settings.type == "special") {
                        game.HUD.PowerUpItem.specialOnly = true;
                    }
                    this.collected = true;
                    this.collisionTween();
                    this.renderable.setCurrentAnimation("collectedTile")
                    game.HUD.PowerUpItem.roll();
                    game.HUD.PowerUpItem.setOpacity(1);
                }
                return false;

            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin