game.BradStartSprite = me.GUI_Object.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {

        // call the super constructor
        this._super(me.GUI_Object, "init", [x, y, settings]);

        this.addAnimation("idle", [0]);
        this.addAnimation("hover", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 100);
        this.addAnimation("pause", [{ name: 12, delay: Infinity }]);
        this.addAnimation("emote", [13]);
        this.setCurrentAnimation("idle");
        //this.anchorPoint.set(-.6, -.3);


    },
    //** ADD TO title.js */
    // arrow: function () {
    //     let _this = this;
    //     if (me.input.isKeyPressed("right")) {
    //         _this.setCurrentAnimation("hover", "emote");
    //     }
    //     if (me.input.isKeyPressed("left")) {
    //         _this.setCurrentAnimation("idle");
    //     }
    //     if (_this.isCurrentAnimation("emote") && me.input.isKeyPressed("space")) {
    //         me.game.viewport.fadeIn("#202020", 500, function () {
    //             me.levelDirector.loadLevel("title_screen");
    //         });
    //     }

    // },

    onOver: function (event) {
        if (!this.isCurrentAnimation("emote")) {
            this.setCurrentAnimation("hover", "pause");
            me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
        }
        return false;

    },

    onOut: function (event) {
        if (!this.isCurrentAnimation("emote")) {
            this.setCurrentAnimation("idle");
        }
        return false;

    },

    onClick: function () {
        var jim = me.game.world.getChildByName("jim_start_sprite")[0];
        if (this.isCurrentAnimation("hover") || this.isCurrentAnimation("pause")) {
            this.setCurrentAnimation("emote");
            jim.setCurrentAnimation("idle");

        }
        me.audio.play("cool_bloop");

        var startButton = me.game.world.getChildByName("start_text_sprite")[0];
        startButton.setOpacity(1);


        return false;
    },
    /**
     * manage the enemy movement
     */
    update: function (dt) {


        // return true if we moved of if flickering
        return (this._super(me.GUI_Object, "update", [dt]));
    },

});