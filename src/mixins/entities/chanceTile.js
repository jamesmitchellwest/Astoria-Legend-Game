import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.ChanceTileEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {


                this.startY = y;
                this.settings = settings;

                this._super(me.Entity, 'init', [x, y, settings]);

                this.renderable = game.texture.createAnimationFromName([
                    "chance-0", "chance-1", "chance-2",

                ]);

                this.renderable.addAnimation("chanceTile", [2]);
                this.renderable.addAnimation("specialTile", [0]);
                this.renderable.addAnimation("collectedTile", [1]);
                this.renderable.setCurrentAnimation("chanceTile");

                this.renderable.anchorPoint.set(0, 0);

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

                if (other.name == "mainPlayer" && other.body.vel.y < 0 && response.overlapV.x == 0 &&
                    response.overlapV.y < 0 && !this.collected) {
                        me.audio.play("chanceTile", false, null, 0.2)
                    if (this.settings.type == "special") {
                        game.HUD.powerUpItem.specialOnly = true;
                    }
                    game.mainPlayer.jetFuel = 0;
                    other.powerUpItem = false;
                    this.collected = true;
                    this.collisionTween();
                    this.renderable.setCurrentAnimation("collectedTile")
                    game.HUD.powerUpItem.roll();
                    
                }
                return false;

            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin