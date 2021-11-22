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
                this.parentLayer = me.game.world.getChildByName(settings.parentLayer)[0];
                this.setCurrentAnimation("idle");
                this.anchorPoint.set(0, 0);
                this.alwaysUpdate = true
                this.startX = x;
                this.speed = 2;
                this.previousPosX = 0
            },
            update: function (dt) {
                var resetPoint = me.game.viewport.width * 1.2
                this.startX += this.speed
                this.previousPosX = this.pos.x;
                if(this.pos.x - (this.parentLayer.pos.x + this.startX) < -2000){
                    this.startX = this.pos.x
                }
                if(this.inViewport && this.pos.x - (this.parentLayer.pos.x + this.startX) > 2000){
                    this.startX -= this.parentLayer.pos.x
                }
                this.pos.x = this.parentLayer.pos.x + this.startX 
                this.pos.y = this.parentLayer.pos.y + (me.game.viewport.height + 60)
                if (this.pos.x > resetPoint) {
                    this.startX -= resetPoint + this.width
                }
                return false
            }
        });

    }
    const extendedGame = await getTrain()

    return extendedGame
}
export default trainMixin