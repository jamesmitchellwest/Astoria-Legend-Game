import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.MagicTileEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this.startFrame = settings.startFrame;

                this._super(me.Entity, 'init', [x + 30, y, settings]);

                this.renderable = game.powerUpTexture.createAnimationFromName([
                    "magicTile-0", "magicTile-1", "magicTile-2", "magicTile-3", "magicTile-4",

                ]);

                this.renderable.addAnimation("notActive", [0], Infinity);
                this.renderable.addAnimation("startFrame1", [1, 2, 3, 4], 100);
                this.renderable.addAnimation("startFrame2", [2, 3, 4, 1], 100);
                this.renderable.addAnimation("startFrame3", [3, 4, 1, 2], 100);
                this.renderable.addAnimation("startFrame4", [4, 1, 2, 3], 100);

                this.renderable.setCurrentAnimation("notActive");
                this.renderable.setOpacity(0.1)
                this.body.collisionType = me.collision.types.NO_OBJECT;
            },
            opacityTween: function(){
                const platformFade = new me.Tween(this.renderable).to({ alpha: 0.1 }, 1000).onComplete(() => {
                    this.body.collisionType = me.collision.types.NO_OBJECT;
                    this.renderable.setCurrentAnimation("notActive");
                });
                platformFade.easing(me.Tween.Easing.Linear.None);
                platformFade.start();
            },
            update: function (dt) {
                if (game.mainPlayer.magicTileActive && !this.active) {
                    this.active = true;
                    this.body.collisionType = me.collision.types.WORLD_SHAPE;
                    this.renderable.setOpacity(1);
                    if (this.startFrame == "1") {
                        this.renderable.setCurrentAnimation("startFrame1");
                    }
                    if (this.startFrame == "2") {
                        this.renderable.setCurrentAnimation("startFrame2");
                    }
                    if (this.startFrame == "3") {
                        this.renderable.setCurrentAnimation("startFrame3");
                    }
                    if (this.startFrame == "4") {
                        this.renderable.setCurrentAnimation("startFrame4");
                    }

                } else if (!game.mainPlayer.magicTileActive && this.active) {
                    this.active = false;
                    this.opacityTween();
                }

                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {


                return false;

            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin