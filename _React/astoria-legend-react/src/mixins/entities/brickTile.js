import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.BrickTileEntity = me.Entity.extend({
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

                this.startY = y;
                this.settings = settings;
                settings.shapes[0] = this.topLine

                this._super(me.Entity, 'init', [x - 15, y - 15, settings]);

                this.renderable = game.texture.createAnimationFromName([
                    "brick-0", "brick-1", "brick-2", "brick-3",
                ]);

                this.renderable.addAnimation("init", [0]);
                this.renderable.addAnimation("break", [
                    { name: 1, delay: 150 },
                    { name: 2, delay: 150 },
                    { name: 3, delay: Infinity }
                ]);
                this.renderable.setCurrentAnimation("init");
                this.renderable.anchorPoint.set(0, 0)

                this.body.addShape(this.rightLine);
                this.body.addShape(this.bottomLine);
                this.body.addShape(this.leftLine);

                this.body.collisionType = me.collision.types.WORLD_SHAPE;

            },
            collisionTween: function () {

                const fadeTween = new me.Tween(this.renderable).to({ alpha: 0 }, 800)
                const downTween = new me.Tween(this.pos).to({ y: this.startY }, 700).onComplete(() => {
                    me.game.world.removeChild(this);
                });
                const upTween = new me.Tween(this.pos).to({ y: this.pos.y - 20 }, 100).onComplete(() => {
                    downTween.start();
                });
                fadeTween.easing(me.Tween.Easing.Linear.None);
                upTween.easing(me.Tween.Easing.Linear.None);
                downTween.easing(me.Tween.Easing.Elastic.Out);
                upTween.start();
                fadeTween.start();

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
                    this.body.collisionType = me.collision.types.NO_OBJECT;
                    other.body.vel.y = 1;
                    this.collisionTween();
                    this.renderable.setCurrentAnimation("break");

                }
                return false;

            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin