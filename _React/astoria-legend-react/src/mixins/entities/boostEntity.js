// import { stringify } from 'flatted';
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

                this.boostForceUP = -1.5;
                this.boostAccel = 2

                //replace default rectangle with topLine
                settings.shapes[0] = this.topLine
                this._super(me.Entity, 'init', [x, y, settings]);

                // add collision lines for left right bottom
                this.body.addShape(this.rightLine);
                this.body.addShape(this.bottomLine);
                this.body.addShape(this.leftLine);
                this.body.addShape(this.topLine);

                this.settings = settings;
                // set the collision type

                this.body.collisionType = game.collisionTypes.BOOST;
                this.layer = me.game.world.getChildByName("foreground")[0];
            },
            getOnOffTileIDs : function () {

            },
            swapTile: function (response, other) {
                let tile = {};
                if (response.indexShapeB == 0) {
                    tile = this.layer.getTile(other.pos.x, this.pos.y + 10)
                } else if (response.indexShapeB == 1) {
                    tile = this.layer.getTile(other.pos.x - 10, other.pos.y + other.height / 2)
                } else if (response.indexShapeB == 2) {
                    tile = this.layer.getTile(other.pos.x , other.pos.y - 10) 
                } else {
                    tile = this.layer.getTile(other.pos.x + other.width + 10, other.pos.y + other.height / 2 )
                }
                if (tile && tile.tileId == this.settings.offTile) {
                    this.layer.setTile(tile.col, tile.row, this.settings.onTile);
                    me.timer.setTimeout(() => {
                        this.layer.setTile(tile.col, tile.row, this.settings.offTile)
                    }, 100);
                }
            },
            update: function (dt) {

                // window.setDebugVal(`
                //     ${stringify(this.layer.getTile)}
                //  `)


                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                this.swapTile(response, other)
                //RIGHT
                if (this.settings.dir == "right") {
                    // if (this.topLine && !other.body.jumping && !other.body.falling) {
                    //     other.body.maxVel.x = other.body.facingLeft ? other.body.runSpeed / 2 : other.body.runSpeed;
                    //     other.body.force.x = other.body.maxVel.x;
                    //     other.body.boostedDir = "right";
                    //     return false;
                    // }


                }
                //UP


                if (this.settings.dir == "up") {
                    other.body.boostedDir = "up";
                    if (this.boostForceUP > -40) {
                        this.boostForce = (this.boostForceUP *= 1.1) * (this.boostAccel *= 0.2);
                    }
                    if (response.indexShapeB == 1 && me.input.isKeyPressed('left') ||
                        response.indexShapeB == 3 && me.input.isKeyPressed('right')) {
                        other.renderable.setCurrentAnimation("jump");
                        other.body.maxVel.y = 40;
                        other.body.vel.y = this.boostForceUP;
                        other.body.force.x = 0;
                    }
                    if (response.indexShapeB == 0) {
                        /// ADJUSTING CONSECUTIVE BOUNCE HEIGHTS ///
                        this.rebound = other.fallCount / 35;
                        if (this.rebound < 0.8) {
                            //Minimum rebound
                            this.rebound = 0.8;
                        }
                        if (this.rebound > 1.45) {
                            //Max rebound
                            this.rebound = 1.45;
                        }
                        other.body.jumping = true;
                        other.body.maxVel.y = other.body.boostedVerticalSpeed * this.rebound;
                        other.body.vel.y = -other.body.maxVel.y;
                        other.body.force.x = 0;
                        if (me.input.isKeyPressed('up')) {
                            other.body.maxVel.y = other.body.boostedVerticalSpeed * this.rebound * 1.33;
                        }
                    } if (response.indexShapeB == 2) {
                        other.body.maxVel.y = other.body.boostedVerticalSpeed * 0.9;
                        other.body.vel.y = -other.body.maxVel.y;
                        if (me.input.isKeyPressed('down')) {
                            other.body.vel.y = 1;  //unlatch?
                        }
                    }
                } else if (!this.boostedDir == "up") {
                    this.boostForceUP = 1.5;
                    this.boostAccel = 2.0;
                }

                if (this.topline && this.settings.dir == "left") {
                    other.body.maxVel.x = !other.body.facingLeft ? other.body.runSpeed / 2 : other.body.runSpeed;
                    other.body.force.x = -other.body.maxVel.x;
                    other.body.boostedDir = "left";
                }

                return false;


            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin