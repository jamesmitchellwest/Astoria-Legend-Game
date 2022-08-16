// import { stringify } from 'flatted';
const shadowMixin = async (me, game) => {
    const getShadow = async () => {
        game.ShadowSprite = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                const atlasData = game.getAtlasData(game.texture, `${game.selectedPlayer}_sprite`);
                this._super(me.Sprite, "init", [game.mainPlayer.pos.x, game.mainPlayer.pos.y, {
                    image: game.texture,
                    atlas: atlasData.tpAtlas,
                    atlasIndices: atlasData.indices,
                }]);

                this.anchorPoint.set(0.5, 0.5);

            },
            update: function (dt) {
                return false
            }
        });
        game.ShadowSprite.width = 99;
        game.ShadowSprite.height = 162;

    }
    const extendedGame = await getShadow()

    return extendedGame
}
export default shadowMixin