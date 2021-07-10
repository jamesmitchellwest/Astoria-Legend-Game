const titleMixin = async (me, game) => {
    const getTitleScreen = async () => {
        game.TitleScreen = me.Stage.extend({
            /**
             *  action to perform on state change
             */
            onResetEvent: function () {
                // load a level
                me.levelDirector.loadLevel("title_screen");


            (function checkIfBGLoaded() {
                if (me.game.world.getChildAt(0)) {
                    var backgroundImage = me.game.world.getChildByName("title_screen")[0]
                    backgroundImage.repeat = false;
                    var viewportWidth = me.game.viewport.width
                    var viewportHeight = me.game.viewport.height
                    backgroundImage.scale(viewportWidth / backgroundImage.imagewidth, viewportWidth / backgroundImage.imagewidth)
                } else {
                    window.requestAnimationFrame(checkIfBGLoaded);
                }
            })();

    },

        /**
         *  action to perform when leaving this screen (state change)
         */
        onDestroyEvent: function () {
                ; // TODO
}


        });
    }
const extendedGame = await getTitleScreen()

return extendedGame
}
export default titleMixin
