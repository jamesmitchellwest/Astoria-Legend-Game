game.ALLogo = me.Sprite.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        
        // call the super constructor
        this._super(me.Sprite, "init", [x, y , settings]);

        this.addAnimation("idle", [0]);
        this.setCurrentAnimation("idle");
        //this.anchorPoint.set(-.6, -.3);

        // don't update the entities when out of the viewport
        this.alwaysUpdate = false;

        this.isMovingEnemy = true;
        this.ease();

    },
    ease: function () {
        var _this = this;
        // if (_this.onMouseOver){
        //     _this.setCurrentAnimation("hover")
        // }
    },

    /**
     * manage the enemy movement
     */
    update : function (dt) {

        
        // return true if we moved of if flickering
        return (this._super(me.Sprite, "update", [dt]));
    },

});