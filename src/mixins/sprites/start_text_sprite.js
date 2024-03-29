import { frames as animFrames } from '../../resources/load_text.json'
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.StartTextSprite = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                settings.image = game.loadTextTexture
                this.settings = settings;
                // call the super constructor
                this._super(me.GUI_Object, "init", [(me.game.viewport.width / 2) - (settings.width /2 + me.game.viewport.width * 0.015), me.game.viewport.height * 0.7, settings]);
                const startSprite = settings.image.createAnimationFromName(animFrames.filter(x => x.filename.includes("start_text_sprite"))
                    .map(x => x.filename.includes("start_text_sprite") ? x.filename : null));
                this.anim = startSprite.anim
                this.atlasIndices = startSprite.atlasIndices
                this.alwaysUpdate = true
                this.current = startSprite.current
                this.textureAtlas = startSprite.textureAtlas
                this.isClickable = false;
                this.anchorPoint.set(0, 0)
                this.addAnimation("appear", [0, 1], 200);
                this.addAnimation("click", [1]);
                this.anchorPoint.set(0, 0);
                this.pos.set(this.settings.x,this.settings.y,3)
                this.setOpacity(0)
            },
            onOver: function () {
                this.setCurrentAnimation("click")
            },
            onOut: function () {
                this.setCurrentAnimation("appear")
            },
            onClick: function () {

                me.state.change(me.state.PLAY);
                me.audio.play("teleport", 0.08);
            },


            ///////**ADD TO title.js */
            // start: function(){
            //     let _this = this
            //     if (me.input.isKeyPressed("space") && _this.isOpacity(1)){
            //     _this.setCurrentAnimation("click")
            //     }

            // },

            update: function (dt) {
                this.pos.x = (me.game.viewport.width / 2) - (this.settings.width /2 + me.game.viewport.width * 0.015)
                // return true if we moved of if flickering
                return (this._super(me.GUI_Object, "update", [dt]));
            },

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin