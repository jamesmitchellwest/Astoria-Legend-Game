import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.MagicTileEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this.startX = x;
                this.startY = y;
                this.settings = settings;
                this.startFrame = settings.startFrame;

                this._super(me.Entity, 'init', [x, y, settings]);

                this.renderable = game.powerUpTexture.createAnimationFromName([
                    "magicTile-0", "magicTile-1", "magicTile-2", "magicTile-3", "magicTile-4",

                ]);
                this.renderable.pos._x = 30;
                this.renderable.addAnimation("notActive", [0], Infinity);
                this.renderable.addAnimation("startFrame1", [1, 2, 3, 4], 100);
                this.renderable.addAnimation("startFrame2", [2, 3, 4, 1], 100);
                this.renderable.addAnimation("startFrame3", [3, 4, 1, 2], 100);
                this.renderable.addAnimation("startFrame4", [4, 1, 2, 3], 100);

                this.renderable.setCurrentAnimation("notActive");

                if (this.settings.gate == true) {
                    this.body.collisionType = me.collision.types.WORLD_SHAPE;
                    this.renderable.setOpacity(1);
                    this.renderable.pos._y = 30;
                    this.renderable.rotate(me.Math.degToRad(this.settings.orientation));
                } else {
                    this.body.collisionType = me.collision.types.NO_OBJECT;
                    this.renderable.setOpacity(0.1);
                }
                this.siblings = undefined

            },
            opacityTween: function () {
                const platformFade = new me.Tween(this.renderable).to({ alpha: 0.1 }, 1000).onComplete(() => {
                    this.body.collisionType = me.collision.types.NO_OBJECT;
                    this.renderable.setCurrentAnimation("notActive");
                    this.alwaysUpdate = false;
                });
                platformFade.easing(me.Tween.Easing.Linear.None);
                platformFade.start();
            },
            gateTween: function () {
                this.alwaysUpdate = true;
                this.openCloseGate = new me.Tween(this.pos).to(
                    { x: this.gatePosX, y: this.gatePosY }, 2000).onComplete(() => {
                        if (this.pos.x == this.startX && this.pos.y == this.startY) {
                            this.alwaysUpdate = false;
                        }
                    })
                this.openCloseGate.easing(me.Tween.Easing.Linear.None);
                this.openCloseGate.start();
            },
            alwaysUpdateGroup: function () {
                this.siblings = this.siblings || me.game.world.getChildByName("magicTile").filter((el) => el.settings.group == this.settings.group);
                for (let index = 0; index < this.siblings.length; index++) {
                    this.siblings[index].alwaysUpdate = true;
                }
            },
            update: function (dt) {
                if (!this.settings.gate == true && game.mainPlayer.magicTileActive && !this.active) {
                    this.active = true;
                    this.body.collisionType = me.collision.types.WORLD_SHAPE;
                    this.renderable.setOpacity(1);
                    this.alwaysUpdate = true;
                    if (this.startFrame == "1") {
                        this.renderable.setCurrentAnimation("startFrame1");
                    }
                    if (this.startFrame == "2") {
                        this.renderable.setCurrentAnimation("startFrame2");
                    }
                    if (this.startFrame == "3") {
                        this.renderable.setCurrentAnimation("startFrame3");
                    }
                    if (this.startFrame == "4") {
                        this.renderable.setCurrentAnimation("startFrame4");
                    }
                }
                if (this.settings.gate == true && game.mainPlayer.magicTileActive && !this.active) {
                    //GATE OPEN ANIMATION

                    //get all the "gate" magicTiles in the same group defined in Tiled and turn on "alwaysUpdate"
                    if (this.settings.group && !this.siblings) {
                        this.alwaysUpdateGroup()
                    }
                    this.active = true;
                    this.gatePosX = this.startX + this.settings.openX;
                    this.gatePosY = this.startY + this.settings.openY;
                    this.gateTween();
                }
                if (!game.mainPlayer.magicTileActive && this.active) {
                    //GATE CLOSE ANIMATION
                    
                    //get all the "gate" magicTiles in the same group defined in Tiled and turn on "alwaysUpdate"
                    if (this.siblings) {
                        this.alwaysUpdateGroup()
                    }
                    this.active = false;
                    if (this.settings.gate == true) {
                        this.gatePosX = this.startX;
                        this.gatePosY = this.startY;
                        this.openCloseGate.stop();
                        this.gateTween();
                    } else {
                        this.opacityTween();
                    }
                }
                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {

                return false;

            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin