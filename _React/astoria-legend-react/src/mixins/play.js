
const playMixin = async (me, game) => {
    const getPlayScreen = async () => {
        game.PlayScreen = me.Stage.extend({
            /**
             *  action to perform on state change
             */
            onResetEvent: function () {
                // load a level
                me.levelDirector.loadLevel("long_one");
                // me.audio.play("surrender");

                // reset the score
                game.data.score = 0;
                // // add our HUD to the game world
                if (typeof this.HUD === "undefined") {
                    this.HUD = new game.HUD.UIContainer();
                    me.game.world.addChild(this.HUD);
                }
                if (me.game.world.hasStart && me.game.world.hasFinish) {
                    me.game.world.addChild(me.pool.pull("startSequence"), Infinity);
                } else {
                    if(game.startBooth){
                       game.startBooth.startAnimation() 
                    }
                    
                }


                // if (typeof this.PauseContainer === "undefined") {
                //     this.PauseContainer = new game.PauseContainer;
                // }
                // me.game.world.addChild(this.PauseContainer);              

                // // display if debugPanel is enabled or on mobile
                // if ((me.plugins.debugPanel && me.plugins.debugPanel.panel.visible) || me.device.touch) {
                //     if (typeof this.virtualJoypad === "undefined") {
                //         this.virtualJoypad = new game.HUD.VirtualJoypad();
                //     }
                //     me.game.world.addChild(this.virtualJoypad);
                // }
            },

            /**
             *  action to perform when leaving this screen (state change)
             */
            onDestroyEvent: function () {
                // remove the HUD from the game world
                // me.game.world.removeChild(this.HUD);
            }
        });


    }
    const extendedGame = await getPlayScreen()

    return extendedGame
}
export default playMixin