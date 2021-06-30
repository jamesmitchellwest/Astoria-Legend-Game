// import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.VanishingTileEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                //replace default rectangle with topLine

                this._super(me.Entity, 'init', [x, y, settings]);


                this.settings = settings;
                this.body.collisionType = game.collisionTypes.WORLD_SHAPE;

                this.opacityCounter = 1;

            },
            vanish: function () {
                let _this = this;
                this.opacityCounter -= .1;
                setTimeout(() => {
                    _this.setOpacity(_this.opacityCounter);
                }, 500);
                this.unVanish();

            },
            unVanish: function () {
                if (this.getOpacity(0)) {

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
                    this.vanish();

                    if (mainPlayer && this.getOpacity(0)) {
                        return true
                    }
                } else {
                    return false;
                }

            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin