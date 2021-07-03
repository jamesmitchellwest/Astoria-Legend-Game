// import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.HoverboardEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                this.startY = y + settings.height / 2;

                this._super(me.Entity, 'init', [x, y, settings]);
                this.pos.x = this.pos.x + settings.width / 2
                this.pos.y = this.pos.y + settings.height / 2;

                this.renderable = game.texture.createAnimationFromName([
                    "hoverboard-00", "hoverboard-01", "hoverboard-02",
                ])

                this.renderable.addAnimation("hover", [0, 1, 2, 1], 200);
                this.renderable.setCurrentAnimation("hover");

                this.settings = settings;
                // set the collision type

                this.body.collisionType = game.collisionTypes.MOVING_PLATFORM;
            },
            passiveMovement: function () {

            },
            collisionMovement: function () {
                if (this.pos.y == this.startY) {
                    const reboundTween = new me.Tween(this.pos).to({ y: this.startY }, 1000)
                    reboundTween.easing(me.Tween.Easing.Quadratic.In);
                    reboundTween.easing(me.Tween.Easing.Elastic.Out);
                    const dropTween = new me.Tween(this.pos).to({ y: this.pos.y + 20 }, 200)
                        .onComplete( function(){
                            reboundTween.start()
                        })
                        
                    dropTween.easing(me.Tween.Easing.Quadratic.Out);
                    dropTween.start();
                }

            },
            update: function (dt) {



                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                if (other.name == "mainPlayer") {

                    if (response.overlapV.y > 0 && other.body.falling) {
                        this.collisionMovement();
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