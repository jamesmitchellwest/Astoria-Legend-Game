// import { stringify } from 'flatted';
const trainMixin = async (me, game) => {
    const getTrain = async () => {
        game.TrainBackground = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                this._super(me.Sprite, 'init', [x, me.game.viewport.height / 2, settings]);
                this.floating = true
                this.addAnimation("idle", [0]);
                this.parentLayer = me.game.world.getChildByName('Image Layer 2')[0];
                this.setCurrentAnimation("idle");
                this.anchorPoint.set(0, 0);
                this.alwaysUpdate = true
                this.startX = 0
            },
            update: function (dt) {
                this.startX += 1
                if(this.pos.x > me.game.viewport.width){
                    this.startX = -this.width
                }
                this.pos.x = this.parentLayer.pos.x + this.startX
                this.pos.y = this.parentLayer.pos.y + (me.game.viewport.height + 60 )
                return (this._super(me.Sprite, 'update', [dt]));
            }
        });

    }
    const extendedGame = await getTrain()

    return extendedGame
}
export default trainMixin