const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.Backgrounds = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                this._super(me.Sprite, "init", [x, y, settings]);
                this.tallTrees = false;
                this.shortTrees = false;
                
            },
            moveTrees: function() {
                const tallTween = new me.Tween(this.tallTrees.pos).to({ x: -2048 }, 80000)
                tallTween.easing(me.Tween.Easing.Linear.None);
                tallTween.start();
                tallTween.repeat(Infinity);
                ///////
                const shortTween = new me.Tween(this.shortTrees.pos).to({ x: -2048 }, 45000)
                shortTween.easing(me.Tween.Easing.Linear.None);
                shortTween.start();
                shortTween.repeat(Infinity);
                
            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {
                
                if (me.game.world.getChildByName("backgrounds")[0] && me.game.world.getChildByName("backgrounds")[1] && !this.tallTrees && !this.shortTrees) {
                    this.tallTrees = me.game.world.getChildByName("backgrounds")[0];
                    this.shortTrees = me.game.world.getChildByName("backgrounds")[1];
                    this.moveTrees();
                }


                // return true if we moved of if flickering
                return (this._super(me.Sprite, "update", [dt]));
            },

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin