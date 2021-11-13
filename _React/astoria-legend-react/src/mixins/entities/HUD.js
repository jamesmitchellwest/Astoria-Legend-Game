import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.HUD = game.HUD || {};

        /**
         * a HUD container and child items
         */
        game.HUD.UIContainer = me.Container.extend({

            init: function () {
                // call the constructor
                this._super(me.Container, "init");

                // Use screen coordinates
                this.floating = true;
                this.isPersistent = true;

                // make sure our object is always draw first
                this.z = Infinity;

                // give a name
                this.name = "HUD";
                if (!game.HUD.PowerUpItem) {
                    game.HUD.PowerUpItem = createPowerUpItem();
                    this.addChild(game.HUD.PowerUpItem);
                }

                // add our child score object at position
                this.addChild(new game.HUD.ScoreItem(-10, -10));



                // this.addChild(new game.HUD.miniMap);
                // this.addChild(new game.HUD.miniMapFrame);

                // add our audio control object
                // this.addChild(new game.HUD.AudioControl(36, 56));

                if (!me.device.isMobile) {
                    // add our fullscreen control object
                    // this.addChild(new game.HUD.FSControl(36 + 10 + 48, 56));
                }
            }
        });

        /**
         * a basic control to toggle fullscreen on/off
         */
        game.HUD.FSControl = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.texture,
                    region: "shadedDark30"
                }]);
                this.setOpacity(0.5);
            },

            /**
             * function called when the pointer is over the object
             */
            onOver: function (/* event */) {
                this.setOpacity(1.0);
            },

            /**
             * function called when the pointer is leaving the object area
             */
            onOut: function (/* event */) {
                this.setOpacity(0.5);
            },

            /**
             * function called when the object is clicked on
             */
            onClick: function (/* event */) {
                if (!me.device.isFullscreen) {
                    me.device.requestFullscreen();
                } else {
                    me.device.exitFullscreen();
                }
                return false;
            }
        });

        /**
         * a basic control to toggle fullscreen on/off
         */
        game.HUD.AudioControl = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.texture,
                    region: "shadedDark13" // ON by default
                }]);
                this.setOpacity(0.5);
                this.isMute = false;
            },

            /**
             * function called when the pointer is over the object
             */
            onOver: function (/* event */) {
                this.setOpacity(1.0);
            },

            /**
             * function called when the pointer is leaving the object area
             */
            onOut: function (/* event */) {
                this.setOpacity(0.5);
            },

            /**
             * function called when the object is clicked on
             */
            onClick: function (/* event */) {
                if (this.isMute) {
                    me.audio.unmuteAll();
                    this.setRegion(game.texture.getRegion("shadedDark13"));
                    this.isMute = false;
                } else {
                    me.audio.muteAll();
                    this.setRegion(game.texture.getRegion("shadedDark15"));
                    this.isMute = true;
                }
                return false;
            }
        });

        /**
         * a basic HUD item to display score
         */
        game.HUD.ScoreItem = me.Renderable.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this.relative = new me.Vector2d(x, y);

                // call the super constructor
                // (size does not matter here)
                this._super(me.Renderable, "init", [
                    me.game.viewport.width + x,
                    50,
                    10,
                    10
                ]);
                // create a font
                this.font = new me.BitmapText(0, 0, {
                    font: "PressStart2P",
                    textAlign: "right",
                    textBaseline: "bottom"
                });

                // local copy of the global score
                this.score = -1;
                this.alpha = 0;
                // recalculate the object position if the canvas is resize
                me.event.subscribe(me.event.CANVAS_ONRESIZE, (function (w, h) {
                    this.pos.set(w, 50, 0).add(this.relative);
                }).bind(this));
            },

            /**
             * update function
             */
            update: function (/*dt*/) {
                // we don't draw anything fancy here, so just
                // return true if the score has been updated
                if (this.score !== game.data.score) {
                    if (game.data.score == 0) {
                        this.alpha = 0
                    } else {
                        this.alpha = 1
                    }
                    this.score = game.data.score;
                    return true;
                }
                return false;
            },



            /**
             * draw the score
             */
            draw: function (renderer) {
                this.font.draw(renderer, game.data.score, this.pos.x, this.pos.y);
            }

        });
        function createPowerUpItem() {
            let powerUpItem = game.powerUpTexture.createAnimationFromName([
                "powerUp-1", "powerUp-2", "powerUp-3", "powerUp-4", "powerUp-5",
            ]);

            powerUpItem.pos.set(me.game.viewport.width / 2, me.game.viewport.height - 150, 9)


            powerUpItem.addAnimation("roll", [0, 1, 2, 3, 4], 100)
            powerUpItem.addAnimation("superJump", [0], Infinity)
            powerUpItem.addAnimation("dash", [1], Infinity)
            powerUpItem.addAnimation("teleport", [2], Infinity)
            powerUpItem.addAnimation("jimSpecial", [3], Infinity)
            powerUpItem.addAnimation("bradSpecial", [4], Infinity)

            powerUpItem.setCurrentAnimation("superJump")
            powerUpItem.specialOnly = false;
            powerUpItem.setOpacity(0);

            powerUpItem.roll = function () {
                //roll animation
                powerUpItem.setOpacity(1);
                powerUpItem.setCurrentAnimation("roll");


                setTimeout(() => {
                    if (powerUpItem.specialOnly == true) {
                        powerUpItem.powerUpRoll = 4;
                    } else {
                        powerUpItem.powerUpRoll = me.Math.round(me.Math.randomFloat(4, 4));
                    }
                    if (powerUpItem.powerUpRoll == 1) {
                        powerUpItem.setCurrentAnimation("superJump");
                        game.mainPlayer.powerUpItem = "superJump"
                    }
                    if (powerUpItem.powerUpRoll == 2) {
                        powerUpItem.setCurrentAnimation("dash");
                        game.mainPlayer.powerUpItem = "dash"
                    }
                    if (powerUpItem.powerUpRoll == 3) {
                        powerUpItem.setCurrentAnimation("teleport");
                        game.mainPlayer.powerUpItem = "teleport"
                    }
                    if (powerUpItem.powerUpRoll == 4) {
                        if (game.mainPlayer.selectedPlayer == "jim") {
                            powerUpItem.setCurrentAnimation("jimSpecial");
                            game.mainPlayer.powerUpItem = "jimSpecial"
                            game.mainPlayer.jetFuel = 103;
                            powerUpItem.specialOnly = false;
                            powerUpItem.ancestor.addChild(new game.HUD.jetFuelLife);
                            me.game.world.addChild(new game.JetPackSprite);

                        } else {
                            powerUpItem.setCurrentAnimation("bradSpecial");
                            game.mainPlayer.powerUpItem = "bradSpecial"
                        }
                    }

                }, 2000);
            }

            return powerUpItem

        }

        game.HUD.jetFuelLife = me.Sprite.extend({

            init: function (x, y) {

                this._super(me.Sprite, "init", [me.game.viewport.width / 2, me.game.viewport.height - 150, {
                    image: game.powerUpTexture,
                    region: "powerUp-4"
                }]);
                this.floating = true;
                this.tint.setColor(38, 37, 43, .5);
                this.mask = new me.Rect(this.pos.x, this.pos.y, this.width, 103 - game.mainPlayer.jetFuel)
            },
            update: function (/*dt*/) {
                if (game.mainPlayer.jetFuel != false) {
                    this.mask.height = 103 - game.mainPlayer.jetFuel;
                }
                if (this.mask.height > 103 || game.mainPlayer.jetFuel == 0 || game.mainPlayer.isWarping) {
                    this.ancestor.removeChild(this);
                }
                return false;
            },
        });

        game.HUD.miniMap = me.Sprite.extend({

            init: function (x, y) {

                // debugger

                this._super(me.Sprite, "init", [me.game.viewport.width - 700, me.game.viewport.height - 450, {
                    image: `minimap-${me.levelDirector.getCurrentLevelId()}`,
                    z: 10
                }]);
                // Top left corner of map minus offsets

                this.anchorPoint.set(0, 0)

                this.pos.z = 10;
                this.setOpacity(0.85);
                this.floating = true;
                const imageMinusOffsetX = this.width - 600;
                const imageMinusOffsetY = this.height - 400;
                this.horizontalScrollRatio = me.game.world.width / imageMinusOffsetX;
                this.verticalScrollRatio = me.game.world.height / imageMinusOffsetY;

                this.mask = new me.Rect(me.game.viewport.width - 400, me.game.viewport.height - 250, 298, 198);
            },
            update: function (/*dt*/) {

                this.pos.x = (me.game.viewport.width - 700) - game.mainPlayer.pos.x / this.horizontalScrollRatio + 150;
                this.pos.y = (me.game.viewport.height - 450) - game.mainPlayer.pos.y / this.verticalScrollRatio + 100;

                return false;
            },


        });

        game.HUD.miniMapFrame = me.Sprite.extend({

            init: function (x, y) {

                this.miniMapFrame = me.loader.getImage("miniMapFrame");

                this._super(me.Sprite, "init", [me.game.viewport.width - 400, me.game.viewport.height - 250, {
                    image: this.miniMapFrame,
                }]);
                this.anchorPoint.set(0, 0);
                this.floating = true;


            },
            update: function (/*dt*/) {



                return false;
            },

        });


    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin