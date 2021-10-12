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
                game.HUD.PowerUpItem = createPowerUpItem();
                // add our child score object at position
                this.addChild(new game.HUD.ScoreItem(-10, -10));
                this.addChild(game.HUD.PowerUpItem);
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
                    me.game.viewport.height + y,
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

                // recalculate the object position if the canvas is resize
                me.event.subscribe(me.event.CANVAS_ONRESIZE, (function (w, h) {
                    this.pos.set(w, h, 0).add(this.relative);
                }).bind(this));
            },

            /**
             * update function
             */
            update: function (/*dt*/) {
                // we don't draw anything fancy here, so just
                // return true if the score has been updated
                if (this.score !== game.data.score) {
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

            powerUpItem.pos.x = me.game.viewport.width / 2;
            powerUpItem.pos.y = me.game.viewport.height - 150;


            powerUpItem.addAnimation("roll", [0, 1, 2, 3, 4], 100)
            powerUpItem.addAnimation("superJump", [0], Infinity)
            powerUpItem.addAnimation("dash", [1], Infinity)
            powerUpItem.addAnimation("teleport", [2], Infinity)
            powerUpItem.addAnimation("jimSpecial", [3], Infinity)
            powerUpItem.addAnimation("bradSpecial", [4], Infinity)

            powerUpItem.setCurrentAnimation("superJump")
            
            powerUpItem.setOpacity(0);

            powerUpItem.roll = function () {
                //roll animation
                powerUpItem.setCurrentAnimation("roll");
                
                setTimeout(() => {
                    powerUpItem.powerUpRoll = me.Math.round(me.Math.randomFloat(.5, 5.5));
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
                        powerUpItem.setCurrentAnimation("jimSpecial");
                        game.mainPlayer.powerUpItem = "jimSpecial"
                        game.mainPlayer.jetFuel = 100;
                    }
                    if (powerUpItem.powerUpRoll == 5) {
                        powerUpItem.setCurrentAnimation("bradSpecial");
                        game.mainPlayer.powerUpItem = "bradSpecial"
                    }
                }, 2000);  
            }
            
            return powerUpItem
            
        }


        // this.setOpacity(0);











    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin