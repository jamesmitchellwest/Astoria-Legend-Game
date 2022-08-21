const titleMixin = async (me, game) => {
    const getTitleScreen = async () => {
        game.TitleScreen = me.Stage.extend({
            /**
             *  action to perform on state change
             */
            onResetEvent: function () {
                // load a level
                me.levelDirector.loadLevel("title_screen");
                const bg = new me.Sprite(0, 0, {
                    image: "title_screen",
                    anchorPoint: new me.Vector2d(0, 0)
                });
                bg.scale(1.1,1.1)
                bg.translate(-50,-50)
                me.game.world.addChild(bg, 1);
                me.game.viewport.fadeOut("#202020", 2000);
            },

            /**
             *  action to perform when leaving this screen (state change)
             */
            onDestroyEvent: function () {

            }


        });
    }
    const extendedGame = await getTitleScreen()

    return extendedGame
}
export default titleMixin
