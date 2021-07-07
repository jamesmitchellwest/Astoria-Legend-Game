import { stringify } from 'flatted';
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
                this.lastCollision = 0;

                this.boostForceUP = -1.5;
                this.boostAccel = 2
                this.collisionInfo = {};
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
            resetValuesOnCollisionExit: function () {
                if (this.collisionInfo.dir == "up" &&
                    this.collisionInfo.line == "topOrBottom"
                ) {
                    this.colliding = false;
                    this.collisionInfo = {};
                } else {
                    this.boostForceUP = -1.5;
                    this.boostAccel = 2;
                    this.colliding = false;
                    game.mainPlayer.jumpEnabled = true;
                    this.collisionInfo = {};
                    if(game.mainPlayer.body.maxVel.x < game.mainPlayer.body.runSpeed){
                        game.mainPlayer.body.maxVel.x = game.mainPlayer.body.runSpeed;
                    }
                }
                
            },
            swapTile: function (response, other) {
                let tile = {};
                if (response.indexShapeB == 0) {
                    tile = this.layer.getTile(other.pos.x + (other.width / 2), this.pos.y + 10)
                } else if (response.indexShapeB == 1) {
                    tile = this.layer.getTile(other.pos.x - 10, other.pos.y + other.height / 2)
                } else if (response.indexShapeB == 2) {
                    tile = this.layer.getTile(other.pos.x, other.pos.y - 10)
                } else {
                    tile = this.layer.getTile(other.pos.x + other.width + 10, other.pos.y + other.height / 2)
                }
                if (tile && tile.tileId == this.settings.offTile) {
                    this.layer.setTile(tile.col, tile.row, this.settings.onTile);
                    me.timer.setTimeout(() => {
                        this.layer.setTile(tile.col, tile.row, this.settings.offTile)
                        this.lastCollision = me.timer.getTime()
                    }, 100);
                }
            },
            update: function (dt) {

                // window.setDebugVal(`
                //     ${stringify(this.colliding)}
                //  `)
                if (this.colliding && me.timer.getTime() - this.lastCollision > 100) {
                    this.resetValuesOnCollisionExit()
                }

                return true;
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                if (other.name == "mainPlayer") {
                    this.colliding = true
                } else {
                    return false;
                }
                this.swapTile(response, other)
                //RIGHT
                if (this.settings.dir == "right") {
                    other.body.maxVel.y = other.body.jumpSpeed;
                    other.body.boostedDir = this.settings.dir;
                    this.collisionInfo.line = "topOrBottom";
                    this.collisionInfo.dir = this.settings.dir;
                    other.jumpEnabled = true;
                    other.bounceCounter = 0;
                    if (me.input.isKeyPressed("right")) {
                        if (other.body.maxVel.x < other.body.runSpeed) {
                            other.body.maxVel.x = other.body.runSpeed
                        }
                        if (Math.abs(other.body.vel.x) <= other.body.boostedHorizontalSpeed) {
                            other.body.maxVel.x *= 1.009
                        }

                    } else if (me.input.isKeyPressed("left")) {
                        other.body.maxVel.x = other.body.runSpeed / 2
                    } else {
                        other.pos.x += 3
                        other.body.maxVel.x = other.body.runSpeed
                    }
                }
                if (this.settings.dir == "left") {
                    other.body.maxVel.y = other.body.jumpSpeed;
                    other.body.boostedDir = this.settings.dir;
                    this.collisionInfo.line = "topOrBottom";
                    this.collisionInfo.dir = this.settings.dir;
                    other.jumpEnabled = true;
                    other.bounceCounter = 0;
                    if (me.input.isKeyPressed("left")) {
                        if (other.body.maxVel.x < other.body.runSpeed) {
                            other.body.maxVel.x = other.body.runSpeed
                        }
                        if (Math.abs(other.body.vel.x) <= other.body.boostedHorizontalSpeed) {
                            other.body.maxVel.x *= 1.009
                        }

                    } else if (me.input.isKeyPressed("right")) {
                        other.body.maxVel.x = other.body.runSpeed / 2
                    } else {
                        other.pos.x -= 3
                        other.body.maxVel.x = other.body.runSpeed
                    }
                }
                //UP
                if (this.settings.dir == "up") {
                    other.body.boostedDir = "up";

                    if (response.indexShapeB == 1 && me.input.isKeyPressed('left') ||
                        response.indexShapeB == 3 && me.input.isKeyPressed('right')
                    ) {
                        this.collisionInfo.line = "leftOrRight";
                        this.collisionInfo.dir = this.settings.dir;
                        other.jumpEnabled = false
                        other.body.jumping = true;
                        other.body.falling = false;
                        other.renderable.setCurrentAnimation("jump");

                        if (other.body.vel.y <= 0) {
                            if (this.boostForceUP > -40) {
                                this.boostForce = (this.boostForceUP *= 1.1) * (this.boostAccel *= 0.2);
                                other.body.maxVel.y = 40;
                                other.body.vel.y = this.boostForceUP;
                                other.body.force.x = 0;
                            }
                        } else {
                            if (other.body.vel.y > 4) {
                                other.body.vel.y *= .8
                            } else {
                                other.body.vel.y -= 1
                            }
                        }
                    }
                    if (response.indexShapeB == 0 &&
                        this.collisionInfo.line != "leftOrRight" &&
                        this.pos.y - other.pos.y == other.height &&
                        response.overlapV.y > 1 &&
                        response.overlapV.x == 0
                    ) {
                        this.collisionInfo.line = "topOrBottom";
                        this.collisionInfo.dir = this.settings.dir;
                        other.body.jumping = true;
                        if (other.body.falling && other.bounceCounter < 3) {
                            other.bounceCounter += 1;
                        }
                        other.body.falling = false;
                        other.fsm.dispatch("jump")

                        const bounceVelocity = response.overlapV.y > 25 || other.bounceCounter == 3 ? other.body.boostedVerticalSpeed * 1.5
                            : other.bounceCounter == 2 ? other.body.boostedVerticalSpeed * 1.2
                                : other.bounceCounter == 1 ? other.body.boostedVerticalSpeed
                                    : other.body.boostedVerticalSpeed;

                        other.jumpEnabled = false;
                        other.body.maxVel.y = bounceVelocity;
                        other.body.vel.y = -other.body.maxVel.y;
                        other.body.force.x = 0;

                    }
                    if (response.indexShapeB == 2 &&
                        this.collisionInfo.line != "leftOrRight" &&
                        response.overlapV.x == 0 &&
                        response.overlapV.y < 0 &&
                        other.pos.y - this.pos.y == this.height &&
                        (other.pos.x - this.pos.x) < (this.width - other.width) &&
                        other.pos.x > this.pos.x
                    ) {
                        this.collisionInfo.line = "topOrBottom"
                        this.collisionInfo.dir = this.settings.dir;
                        other.body.maxVel.y = other.body.boostedVerticalSpeed * 0.9;
                        other.body.vel.y = -other.body.maxVel.y;
                        if (me.input.isKeyPressed('down')) {
                            other.body.vel.y = 1;  //unlatch?
                        }
                    }
                }
                //DOWN
                if (this.settings.dir == "down") {
                    other.body.boostedDir = "down";
                    this.collisionInfo.dir = this.settings.dir;
                    other.renderable.setCurrentAnimation("fall");

                    if (other.body.falling && Math.abs(other.body.vel.y) < other.body.boostedVerticalSpeed) {
                        other.body.vel.y = other.body.maxVel.y *= 1.05;
                    }
                    if (other.body.jumping) {
                        other.body.vel.y *= .9
                    }

                }

                return false;


            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin