const titleMixin = async (me, game) => {
    const getTitleScreen = async () => {
        game.TitleScreen = me.Stage.extend({
            /**
             *  action to perform on state change
             */
            onResetEvent: function () {
                // load a level
                me.levelDirector.loadLevel("title_screen");
                // me.audio.play("surrender");

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
