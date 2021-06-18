const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.Backgrounds = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
               
                this._super(me.Sprite, "init", [ x , y -28, settings]);

            },

            /**
             * manage the enemy movement
             */
            update: function (dt) {


                // return true if we moved of if flickering
                return (this._super(me.Sprite, "update", [dt]));
            },

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin