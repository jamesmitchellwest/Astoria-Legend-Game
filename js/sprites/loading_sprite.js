game.LoadingSprite = me.GUI_Object.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        
        // call the super constructor
        this._super(me.Sprite, "init", [x, y , settings]);

        this.addAnimation("loading", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 15, 16, 15, 17, 18, 19, 20, 21, 22, 23, 24, 23, 24], 200);
        this.addAnimation("fade", [{name: 24, delay: Infinity}]);
        let _this = this
        this.setCurrentAnimation("loading", function(){
        
            _this.setCurrentAnimation("fade");
            _this.fade();
        });


    },
    fade: function() {
            me.game.viewport.fadeIn("#202020", 500, function () {
            me.levelDirector.loadLevel("title_screen");
        });
            
    },
    


    /**
     * manage the enemy movement
     */
    update : function (dt) {
     
        // return true if we moved of if flickering
        return (this._super(me.Sprite, "update", [dt]));
    },

});