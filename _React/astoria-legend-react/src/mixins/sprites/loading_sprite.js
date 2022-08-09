import { stringify } from 'flatted';
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
                this._super(me.Sprite, "init", [me.game.viewport.width / 2 - settings.width / 2, y, settings]);
                const loadingSprite = settings.image.createAnimationFromName(animFrames.filter(x => x.filename.includes("loading_sprite"))
                    .map(x => x.filename.includes("loading_sprite") ? x.filename : null));
                this.anim = loadingSprite.anim
                this.atlasIndices = loadingSprite.atlasIndices
                this.current = loadingSprite.current
                this.textureAtlas = loadingSprite.textureAtlas
                this.anchorPoint.set(0, 0)
                this.addAnimation("loading", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], Infinity);
                this.addAnimation("tween", [15, 16, 15, 16, 15, 17, 18, 19, 20, 21, 22, 23, 24, 23, 24], 200);
                this.addAnimation("fade", [{ name: 24, delay: Infinity }]);
                this.setCurrentAnimation("loading");
                // me.loader.onProgress = this.updateProgress.bind(this);

            },
            fade: function () {
                me.game.viewport.fadeIn("#202020", 500, function () {
                    me.state.change(me.state.PLAY);
                });

            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {
                // window.setDebugVal(`
                //     ${stringify())}
                //  `)
                if (this.isCurrentAnimation('loading')) {
                    this.setAnimationFrame(Math.floor(14 * me.loader.getLoadProgress()))
                }
                if (me.loader.getLoadProgress() == 1 && this.isCurrentAnimation("loading")) {
                    this.setAnimationFrame()
                    this.setCurrentAnimation("tween", () => {
                        this.setCurrentAnimation("fade");
                        this.fade();
                    });
                }
                // return true if we moved of if flickering
                return (this._super(me.Sprite, "update", [dt]));
            },

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin