const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.ALLogo = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                settings.image = game.loadTextTexture;
                settings.region = "al_logo";
                // call the super constructor
                this._super(me.Sprite, "init", [(me.game.viewport.width / 2) - (settings.width / 2), me.game.viewport.height * -0.4, settings]);

                this.addAnimation("idle", [0]);

                const tween = new me.Tween(this.pos).to({ y: me.game.viewport.height * -0.05 }, 3000)
                tween.easing(me.Tween.Easing.Elastic.InOut);
                tween.start();
                // this.setCurrentAnimation("idle");
                //this.anchorPoint.set(-.6, -.3);

                // don't update the entities when out of the viewport
                this.alwaysUpdate = false;
                this.floating = true;
            },

            /**
             * manage the enemy movement
             */
            update: function (dt) {


                // return true if we moved of if flickering
                return (this._super(me.Sprite, "update", [dt]));
            },

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin