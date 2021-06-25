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
                // this.setPoints((x, this.height / 2), (y, this.width / 2), (this.width / 2, this.height), (this.width, this.height / 2))

            },
            onOver: function (event) {
                if (!this.isCurrentAnimation("emote")) {
                    this.setCurrentAnimation("hover", "pause");
                    me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
                }
                return false;

            },

            onOut: function (event) {
                if (!this.isCurrentAnimation("emote")) {
                    this.setCurrentAnimation("idle");
                }
                return false;

            },

            onClick: function () {
                var brad = me.game.world.getChildByName("brad_start_sprite")[0];
                if (this.isCurrentAnimation("hover") || this.isCurrentAnimation("pause")) {
                    this.setCurrentAnimation("emote");
                    brad.setCurrentAnimation("idle");

                }
                me.audio.play("cool_bloop");

                var startButton = me.game.world.getChildByName("start_text_sprite")[0]
                startButton.setOpacity(1);

                return false;
            },

            /**
             * manage the enemy movement
             */
            update: function (dt) {


                // return true if we moved of if flickering
                return (this._super(me.GUI_Object, "update", [dt]));
            },

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin