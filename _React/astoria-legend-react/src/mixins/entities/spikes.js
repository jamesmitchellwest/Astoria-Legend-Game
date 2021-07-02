import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.SpikesEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                this._super(me.Entity, 'init', [x, y, settings]);

                this.settings = settings;
                this.body.collisionType = game.collisionTypes.SPIKES;
                this.alwaysUpdate = false;


            },

            update: function (dt) {

                return (this._super(me.Entity, 'update', [dt]));
            },
            onCollision: function (response, other) {
                return false;
            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin