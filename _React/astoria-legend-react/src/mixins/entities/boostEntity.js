const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.BoostEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this.topLine = new me.Line(0, 0, [
                    new me.Vector2d(0, 0),
                    new me.Vector2d(settings.width, 0)
                ]);
                this.rightLine = new me.Line(0, 0, [
                    new me.Vector2d(settings.width, 0),
                    new me.Vector2d(settings.width, settings.height)
                ]);
                this.bottomLine = new me.Line(0, 0, [
                    new me.Vector2d(0, settings.height),
                    new me.Vector2d(settings.width, settings.height)
                ]);
                this.leftLine = new me.Line(0, 0, [
                    new me.Vector2d(0, 0),
                    new me.Vector2d(0, settings.height)
                ]);

                //replace default rectangle with topLine
                settings.shapes[0] = this.topLine
                this._super(me.Entity, 'init', [x, y, settings]);

                // add collision lines for left right bottom
                this.body.addShape(this.rightLine);
                this.body.addShape(this.bottomLine);
                this.body.addShape(this.leftLine);

                this.settings = settings;
                // set the collision type

                this.body.collisionType = game.collisionTypes.BOOST;
                this.layer = me.game.world.getChildByName("foreground")[0];
            },
            update: function (dt) {

                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                if (this.settings.dir == "right") {
                    other.body.maxVel.x = other.body.facingLeft ? other.body.runSpeed / 2 : other.body.runSpeed;
                    other.body.force.x = other.body.maxVel.x;
                    other.body.boostedDir = "right";

                    let tile = this.layer.getTile(other.pos.x, other.pos.y + (this.pos.y - other.pos.y))
                    if (tile.tileId != 67) {
                        this.layer.setTile(tile.col, tile.row, 67);
                        me.timer.setTimeout(() => {
                            this.layer.setTile(tile.col, tile.row, 63)
                        }, 100);
                    }

                }
                if (this.settings.dir == "up") {
                    other.body.jumping = true;
                    other.body.maxVel.y = other.body.boostedVerticalSpeed;
                    other.body.vel.y = -other.body.maxVel.y;
                    other.body.force.x = 0
                    other.body.boostedDir = "up";
                }

                return false;
            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin