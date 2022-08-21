// import { stringify } from 'flatted';
const bombMixin = async (me, game) => {
    const getBomb = async () => {
        game.BombEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this._super(me.Entity, 'init', [x, y, settings]);

                this.renderable = game.texture.createAnimationFromName([
                    "bomb_00", "bomb_01", "bomb_02", "bomb_03", "bomb_04", "bomb_05",
                ])

                this.pos.x = this.pos.x + settings.width / 2;
                this.pos.y = this.pos.y + settings.height / 2;


                this.renderable.addAnimation("bomb", [0]);
                this.renderable.addAnimation("explode", [{ name: 1, delay: 75 }, { name: 2, delay: 150 }, { name: 3, delay: 75 }]);
                this.renderable.addAnimation("smoke", [{ name: 4, delay: 250 }, { name: 5, delay: Infinity }]);
                this.renderable.addAnimation("jetPackExplode", [1]);


                this.settings = settings;
                // set the collision type
                this.body.collisionType = me.collision.types.ENEMY_OBJECT;
                if (this.jetPackExplode) {
                    this.renderable.setCurrentAnimation("jetPackExplode")
                } else {
                    this.renderable.setCurrentAnimation("bomb");
                }
            },
            explode: function () {
                me.audio.play("block_explosion", false, null, 0.2)
                this.body.collisionType = me.collision.types.NO_OBJECT;
                this.renderable.setCurrentAnimation("explode", "smoke")
                setTimeout(() => {
                    const smokeFade = new me.Tween(this.renderable).to({ alpha: 0 }, 1000)
                    const smokeRise = new me.Tween(this.pos).to({ x: this.settings.x + 7, y: this.settings.y - 16 }, 1000)
                    smokeFade.easing(me.Tween.Easing.Linear.None);
                    smokeRise.easing(me.Tween.Easing.Linear.None);
                    smokeFade.start();
                    smokeRise.start();
                }, 300);

            },
            update: function (dt) {
                if (this.jetPackExplode) {
                    this.explode();
                }
                if (this.renderable.alpha == 0 && this.renderable.isCurrentAnimation("smoke")) {
                    me.game.world.removeChild(this);
                }


                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                if (other.name == "mainPlayer") {
                    if (this.renderable.isCurrentAnimation("bomb"))
                        this.explode();
                }


                return false;


            }
        });
        game.BombEntity.width = 60;
        game.BombEntity.height = 60;

    }
    const extendedGame = await getBomb()

    return extendedGame
}
export default bombMixin