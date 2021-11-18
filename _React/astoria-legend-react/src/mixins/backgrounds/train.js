// import { stringify } from 'flatted';
const trainMixin = async (me, game) => {
    const getTrain = async () => {
        game.TrainBackground = me.ImageLayer.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                debugger
                this._super(me.ImageLayer, 'init', [x, y, settings]);


                this.settings = settings;

            },
            update: function (dt) {



                return (this._super(me.ImageLayer, 'update', [dt]));
            }
        });

    }
    const extendedGame = await getTrain()

    return extendedGame
}
export default trainMixin