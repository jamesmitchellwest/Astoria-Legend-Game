import { frames as animFrames } from '../../resources/load_jim.json'
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.JimStartSprite = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                settings.image = game.loadJimTexture
                // call the super constructor
                this._super(me.GUI_Object, "init", [me.game.viewport.width * 0.46 - settings.width, me.game.viewport.height * 0.2, settings]);
                const jimSprite = settings.image.createAnimationFromName(animFrames.filter(x => x.filename.includes("jim_start_sprite"))
                    .map(x => x.filename.includes("jim_start_sprite") ? x.filename : null));
                this.anim = jimSprite.anim
                this.atlasIndices = jimSprite.atlasIndices
                this.current = jimSprite.current
                this.textureAtlas = jimSprite.textureAtlas
                this.anchorPoint.set(0, 0);
                this.addAnimation("idle", [0]);
                this.addAnimation("hover", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 100);
                this.addAnimation("pause", [{ name: 12, delay: Infinity }]);
                this.addAnimation("emote", [13]);
                this.setCurrentAnimation("idle");
                this.isClickable = false
                this.alwaysUpdate = true;
                this.start_gui = undefined
                this.brad_gui = undefined
                this.clickOverlay = document.createElement('div');
                this.clickOverlay.style.cssText = `height: 50vh;
                                                    position: absolute;
                                                    z-index: 1;
                                                    top: 31vh;
                                                    transform: rotate(45deg);
                                                    aspect-ratio: 1 / 1;
                                                    right: ${me.game.viewport.width * 0.6 * (window.innerWidth / me.game.viewport.width)}px;`
                document.getElementById("root").appendChild(this.clickOverlay);
                window.addEventListener("resize", () => this.resizeEvent())
                this.clickOverlay.addEventListener("click", () => this.clickEvent())

            },

            resizeEvent: function () {
                this.clickOverlay.style.right = `${me.game.viewport.width * 0.6 * (window.innerWidth / me.game.viewport.width)}px`
            },
            // onOver: function (event) {
            //     if (!this.isCurrentAnimation("emote")) {
            //         this.setCurrentAnimation("hover", "pause");
            //     }
            //     return false;

            // },

            // onOut: function (event) {
            //     if (!this.isCurrentAnimation("emote")) {
            //         this.setCurrentAnimation("idle");
            //     }
            //     return false;

            // },

            clickEvent: function () {
                this.start_gui.isClickable = true;
                this.start_gui.setOpacity(1);
                game.selectedPlayer = 'jim';
                if (this.isCurrentAnimation("idle") || this.isCurrentAnimation("pause")) {
                    this.setCurrentAnimation("emote");
                    this.brad_gui.setCurrentAnimation("idle");
                }
                me.audio.play("cool_bloop");
            },

            update: function (dt) {
                if (!this.start_gui) {
                    this.start_gui = me.game.world.getChildByName("start_text_sprite")[0]
                }
                if (!this.brad_gui) {
                    this.brad_gui = me.game.world.getChildByName("brad_start_sprite")[0]
                }
                this.pos.x = me.game.viewport.width * 0.46 - this.width
                // return true if we moved of if flickering
                return true
            },
            onDestroyEvent: function () {
                window.removeEventListener("resize", this.resizeEvent)
                this.clickOverlay.remove()
            }
        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin