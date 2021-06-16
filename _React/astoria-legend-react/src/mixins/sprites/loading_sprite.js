import { frames as animFrames } from '../../resources/load_text.json'
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.LoadingSprite = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                settings.image = game.loadTextTexture
                // call the super constructor
                this._super(me.Sprite, "init", [x, y, settings]);
                const loadingSprite = settings.image.createAnimationFromName(animFrames.filter(x => x.filename.includes("loading_sprite"))
                    .map(x => x.filename.includes("loading_sprite") ? x.filename : null));
                this.anim = loadingSprite.anim
                this.atlasIndices = loadingSprite.atlasIndices
                this.current = loadingSprite.current
                this.textureAtlas = loadingSprite.textureAtlas
                this.anchorPoint.set(0, 0)
                this.addAnimation("loading", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 15, 16, 15, 17, 18, 19, 20, 21, 22, 23, 24, 23, 24], 200);
                this.addAnimation("fade", [{ name: 24, delay: Infinity }]);
                let _this = this
                this.setCurrentAnimation("loading", function () {

                    _this.setCurrentAnimation("fade");
                    _this.fade();
                });


            },
            fade: function () {
                me.game.viewport.fadeIn("#202020", 500, function () {
                    me.levelDirector.loadLevel("title_screen");
                });

            },



            /**
             * manage the enemy movement
             */
            update: function (dt) {

                // return true if we moved of if flickering
                return (this._super(me.Sprite, "update", [dt]));
            },

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin