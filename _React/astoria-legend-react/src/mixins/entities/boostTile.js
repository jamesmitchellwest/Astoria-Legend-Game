const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.BoostTile = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this._super(me.Entity, 'init', [x, y, settings]);

                this.settings = settings;
                // set the collision type

                this.body.collisionType = game.collisionTypes.BOOSTTILE;

                if (this.settings.dir == "right") {
                    this.body.offTile = 62;
                    this.body.onTile = 66
                } else if (this.settings.dir == "up") {
                    this.body.offTile = 63;
                    this.body.onTile = 67
                }

                // define a jumping animation
                this.renderable.addAnimation("off", [this.body.offTile]);

                // define a falling animation
                this.renderable.addAnimation("on", [this.body.onTile], 150);

                this.renderable.setCurrentAnimation("off");
            },
            update: function (dt) {
                return this.renderable.isCurrentAnimation("on") && (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                this.renderable.setCurrentAnimation("on", "off");

                return false;
            }
        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin