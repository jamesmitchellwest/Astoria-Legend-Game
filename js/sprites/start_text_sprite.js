game.StartTextSprite = me.GUI_Object.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        
        // call the super constructor
        this._super(me.GUI_Object, "init", [x, y , settings]);

        this.addAnimation("appear", [0, 1], 200);
        this.addAnimation("click", [1]);
        //this.anchorPoint.set(-.6, -.3);

        // don't update the entities when out of the viewport
        this.alwaysUpdate = false;

        this.setOpacity(0)



    },
    onOver: function(){
        this.setCurrentAnimation("click")
    },
    onOut: function(){
        this.setCurrentAnimation("appear")
        },


///////**ADD TO title.js */
    // start: function(){
    //     let _this = this
    //     if (me.input.isKeyPressed("space") && _this.isOpacity(1)){
    //     _this.setCurrentAnimation("click")
    //     }
        
    // },
    


    /**
     * manage the enemy movement
     */
    update : function (dt) {

        
        // return true if we moved of if flickering
        return (this._super(me.GUI_Object, "update", [dt]));
    },

});