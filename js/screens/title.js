game.TitleScreen = me.Stage.extend({
    /**
     *  action to perform on state change
     */
    onStartEvent: function() {
        
        let backgroundImage = new me.Sprite(
            me.game.viewport.width / 2, 
            me.game.viewport.height / 2, 
            {
            image: me.loader.getImage('title_screen')
        
    },
    )},

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        ; // TODO
    }

    
});
