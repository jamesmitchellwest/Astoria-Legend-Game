import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.BoostEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {


                this._super(me.Entity, 'init', [x, y, settings]);
                this.lastCollision = 0;
                this.idleBoost = 6;
                this.boostForceUP = -.5;
                this.collisionInfo = {};
                this.settings = settings;
                this.body.collisionType = game.collisionTypes.BOOST;
                this.layer = me.game.world.getChildByName("foreground")[0];
                this.boostTileIDs = {
                    25: 29, //left
                    26: 30, //down
                    27: 31, //right
                    28: 32,  //up

                    61: 65, //left
                    62: 66, //down
                    63: 67, //right
                    64: 68,  //up

                    105: 109, //left
                    106: 110, //down
                    107: 111, //right
                    108: 112  //up
                }

            },
            resetValuesOnCollisionExit: function () {
                if (this.collisionInfo.dir == "up") {
                    game.mainPlayer.body.jumpForce = 0;
                }
                if (this.collisionInfo.dir == "up" && this.collisionInfo.line == "topOrBottom") {
                    this.colliding = false;
                    this.collisionInfo = {};
                } else {
                    game.mainPlayer.body.idleSpeed = 0;
                    this.boostForceUP = -1.5;
                    this.colliding = false;
                    game.mainPlayer.jumpEnabled = true;
                    this.collisionInfo = {};
                    if (game.mainPlayer.body.maxVel.x < game.mainPlayer.body.runSpeed) {
                        game.mainPlayer.body.maxVel.x = game.mainPlayer.body.runSpeed;
                    }
                }
            },
            swapTile: function (response, other) {
                let tile = undefined;
                if (response.overlapV.y > 0) {
                    tile = this.layer.getTile(other.pos.x + (other.width / 2), this.pos.y + 10)
                } else if (response.overlapV.x < 0) {
                    tile = this.layer.getTile(other.pos.x - 10, other.pos.y + other.height / 2)
                } else if (response.overlapV.y < 0) {
                    tile = this.layer.getTile(other.pos.x, other.pos.y - 10)
                } else {
                    tile = this.layer.getTile(other.pos.x + other.width + 10, other.pos.y + other.height / 2)
                }

                if (tile && tile.tileId in this.boostTileIDs) {
                    // console.log(tile.tileId)
                    this.layer.setTile(tile.col, tile.row, this.boostTileIDs[tile.tileId]);
                    me.timer.setTimeout(() => {
                        this.layer.setTile(tile.col, tile.row, tile.tileId)
                        this.lastCollision = me.timer.getTime()
                    }, 100);
                }
            },
            horizontalBoostHandler: function () {
                // boost accel //
                if (me.input.isKeyPressed(this.collisionInfo.dir) && game.mainPlayer.isCrouched == false) {
                    if (game.mainPlayer.body.maxVel.x < game.mainPlayer.body.runSpeed) {
                        game.mainPlayer.body.maxVel.x = game.mainPlayer.body.runSpeed
                    }
                    if (Math.abs(game.mainPlayer.body.vel.x) <= game.mainPlayer.body.boostedHorizontalSpeed) {
                        game.mainPlayer.body.maxVel.x += 0.25;
                    }
                }
                // boost decel //
                else if (me.input.isKeyPressed("left") && this.collisionInfo.dir == "right" && game.mainPlayer.isCrouched == false ||
                    me.input.isKeyPressed("right") && this.collisionInfo.dir == "left" && game.mainPlayer.isCrouched == false) {
                    game.mainPlayer.body.maxVel.x = game.mainPlayer.body.runSpeed / 2;
                }
                // idle and crouch handler //
                else {
                    if (game.mainPlayer.body.maxVel.x > this.idleBoost) {
                        game.mainPlayer.body.idleSpeed = this.collisionInfo.dir == "right" ? (game.mainPlayer.body.maxVel.x *= 0.95) : -(game.mainPlayer.body.maxVel.x *= 0.95)
                    } else {
                        game.mainPlayer.body.idleSpeed = this.collisionInfo.dir == "right" ? this.idleBoost : -this.idleBoost;
                    }

                }
            },
            boostAudio: function () {
                this.isAudioPlaying = true;
                me.audio.rate("boost_warp", this.audioRate *= 1.2)
                me.audio.play("boost_warp", false, () => {
                    if (this.boosting == true) {
                        this.boostAudio();
                    }
                }, 0.2)
            },
            update: function (dt) {
                if (this.colliding && me.timer.getTime() - this.lastCollision > 100) {
                    this.resetValuesOnCollisionExit()
                }

                /// AUDIO ///
                // if (this.boosting == true && !this.isAudioPlaying) {
                //     this.boostAudio();
                // }

                // if (!this.boosting) {
                //     me.audio.stop("boost_warp")
                //     this.isAudioPlaying = false;
                //     this.audioRate = 1;
                // }


                return true;
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                if (other.name == "mainPlayer") {
                    this.colliding = true;
                } else {
                    return false;
                }
                this.swapTile(response, other)
                //LEFT & RIGHT
                if (this.settings.dir == "right" || this.settings.dir == "left" && response.overlapV.y > 0) {
                    // if (game.mainPlayer.boostedDir != this.collisionInfo.dir) {
                    //     this.resetValuesOnCollisionExit()
                    //     game.mainPlayer.boostedDir = this.collisionInfo.dir;
                    // }
                    other.body.maxVel.y = other.body.jumpSpeed;
                    other.boostedDir = this.settings.dir;
                    this.collisionInfo.line = "topOrBottom";
                    this.collisionInfo.dir = this.settings.dir;
                    other.jumpEnabled = true;
                    this.horizontalBoostHandler();
                }
                //UP
                if (this.settings.dir == "up") {
                    if (other.body.jumping && other.boostedDir != "up") {
                        other.body.vel.y = -5;
                        other.body.jumpForce = 0;
                    }
                    other.boostedDir = "up";
                    //LEFT OR RIGHT SIDE - UP BOOST
                    if (response.overlapV.x != 0 && me.input.isKeyPressed('left') || me.input.isKeyPressed('right')
                    ) {
                        this.collisionInfo.line = "leftOrRight";
                        this.collisionInfo.dir = this.settings.dir;
                        other.jumpEnabled = false
                        other.body.jumping = true;
                        other.body.falling = false;
                        if (other.renderable.isFlippedX && other.selectedPlayer == "brad") {
                            other.renderable.setCurrentAnimation("bradJumpLeft")
                        } else {
                            other.renderable.setCurrentAnimation("jump")
                        }

                        if (other.body.vel.y <= 0) {
                            if (this.boostForceUP > -35) {
                                this.boostForce -= 1;
                                other.body.maxVel.y = 35;
                                other.body.vel.y = other.body.vel.y + this.boostForceUP;
                                other.body.force.x = 0;
                            }
                        } else if (other.body.vel.y > 4) {
                            other.body.vel.y *= .8
                        } else {
                            other.body.vel.y -= 1.25
                            other.pos.y -= 3;
                        }

                    }
                    //TOP SIDE - UP BOOST
                    if (response.overlapV.y > 0) {
                        me.audio.play("jump", false, null, 0.3)
                        this.collisionInfo.line = "topOrBottom";
                        this.collisionInfo.dir = this.settings.dir;
                        other.body.jumping = true;
                        other.body.falling = false;

                        if (me.input.keyStatus("jump")) {
                            me.audio.play(`grunt_${me.Math.round(me.Math.random(0.5, 5.5))}`);
                            if (other.selectedPlayer == "brad" && other.renderable.isFlippedX) {
                                other.fsm.dispatch("bradJumpLeft");
                            } else {
                                other.fsm.dispatch("jump");
                            }
                            this.bounceVelocity = other.fallCount > 40 ? other.body.boostedVerticalSpeed * 1.4 :
                                other.fallCount > 29 ? other.body.boostedVerticalSpeed * 1.25 :
                                    other.body.boostedVerticalSpeed * 1.1;
                        } else {
                            this.bounceVelocity = me.Math.clamp(other.fallCount * .68, 23, 35);
                        }

                        other.jumpEnabled = false;
                        other.body.maxVel.y = this.bounceVelocity;
                        other.body.vel.y = -other.body.maxVel.y;
                        other.body.force.x = 0;

                    }
                    //BOTTOM SIDE - UP BOOST
                    if (response.overlapV.y < 0) {
                        other.crouchDisabled = true
                        if (other.renderable.isFlippedX && other.selectedPlayer == "brad") {
                            other.renderable.setCurrentAnimation("bradJumpLeft")
                        } else {
                            other.renderable.setCurrentAnimation("jump")
                        }
                        this.collisionInfo.line = "topOrBottom"
                        this.collisionInfo.dir = this.settings.dir;
                        other.body.maxVel.y = 23;
                        other.body.vel.y = -other.body.maxVel.y;

                        if (me.input.isKeyPressed('down') || other.fsm.state == "hurt" || other.fsm.state == "electrocute") {
                            other.fsm.state = "fall"
                            other.body.vel.y = 1
                        }
                    }
                }
                //DOWN
                if (this.settings.dir == "down") {
                    other.boostedDir = "down";
                    this.collisionInfo.dir = this.settings.dir;
                    other.renderable.setCurrentAnimation("fall");
                    other.body.maxVel.y = 35;

                    if (other.body.falling && Math.abs(other.body.vel.y) < other.body.boostedVerticalSpeed) {
                        other.body.vel.y = other.body.vel.y += 0.5;
                    }
                    if (other.body.vel.y < 0) {
                        other.body.vel.y *= -.99
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