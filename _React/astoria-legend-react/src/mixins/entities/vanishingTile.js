import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.VanishingTileEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                settings.image = game.texture;
                settings.region = "vanishingTile_0";
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

                this.body.collisionType = game.collisionTypes.VANISHING_TILE;

                this.collisionObject = false;
                this.fading = false;


                this.vanishTween = new me.Tween(this.renderable).to({ alpha: 0 }, 800)
                    .onComplete(() => {

                        if (!me.collision.check(this) && this.body.collisionType != game.collisionTypes.VANISHING_TILE) {
                            this.appearTween.start();
                        } else {
                            this.fading = false;
                        }

                    })

                this.vanishTween.easing(me.Tween.Easing.Linear.None);
                this.appearTween = new me.Tween(this.renderable).to({ alpha: 1 }, 800)
                    .onComplete(() => {
                        this.fading = false;
                        this.body.collisionType = game.collisionTypes.VANISHING_TILE
                    })
                this.appearTween.easing(me.Tween.Easing.Linear.None);
                this.appearTween.delay(1000);
            },
            update: function (dt) {
                if (this.renderable.getOpacity() < 0.02) {
                    this.body.collisionType = game.collisionTypes.HOLLOW;
                }


                // window.setDebugVal(`
                //     ${stringify(me.collision)}
                //  `)

                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {

                if (other.name == "mainPlayer") {
                    if (!this.fading) {
                        this.fading = true;
                        this.vanishTween.start()
                    }
                }
                return false;

            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin