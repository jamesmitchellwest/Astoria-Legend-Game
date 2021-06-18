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

                let tallTrees = [];
                
                function checkIfBGLoaded() {
                    if (me.game.world.getChildByName("backgrounds")) {
                        tallTrees = me.game.world.getChildByName("backgrounds")[0]
                        const tallTween = new me.Tween(tallTrees.pos).to({ x: -10 }, 3000)
                            tallTween.easing(me.Tween.Easing.Linear.Out);
                            tallTween.start();
                    } else {
                        window.requestAnimationFrame(checkIfBGLoaded);
                    }
                };

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
