// import { stringify } from 'flatted';
const trainMixin = async (me, game) => {
    const getTrain = async () => {
        game.TrainBackground = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                this._super(me.Sprite, 'init', [me.game.viewport.pos.x, 0, settings]);
                this.pos.z = 11
                this.floating = false
                this.settings = settings;
                this.addAnimation("idle", [0]);
                this.setCurrentAnimation("idle");
                this.anchorPoint.set(0, 0);
                this.ratio = { x: -0.2, y: 0.038 };
                this.alwaysUpdate = true
                this.startX = 0
            },
            update: function (dt) {
                this.startX += 1;
                var rx = this.ratio.x,
                    ry = this.ratio.y;

                if (rx === 0 && ry === 0) {
                    // static image
                    return;
                }
                var viewport = me.game.viewport,
                    width = this.width,
                    height = this.height,
                    bw = viewport.bounds.width,
                    bh = viewport.bounds.height,
                    ax = this.pos.x,
                    ay = this.anchorPoint.y,
                    vpos = viewport.pos

                // const x = ax * (rx - 1) * (bw - viewport.width) + this.offset.x - rx * vpos.x
                const y = (ay * (ry - 1) * (bh - viewport.height) + this.offset.y - ry * vpos.y); // Repeat horizontally; start drawing from left boundary



                // if (game.mainPlayer.renderable.isFlippedX) {
                //     // this.pos.x += .5 * + (game.mainPlayer.body.vel.x );
                // } else {
                //     this.pos.x +=  game.mainPlayer.body.vel.x > game.mainPlayer.body.runSpeed ? (-game.mainPlayer.body.vel.x / 100) : 1;
                // }
                this.pos.x += 3
                if (this.pos.x > viewport.width * 1.5) {
                    this.pos.x = -this.width
                }
                //  this.pos.y = me.game.viewport.pos.y + me.game.viewport.height / 2;
                 this.pos.y = me.game.viewport.pos.y + me.game.viewport.height * .675 ;

                return (this._super(me.Sprite, 'update', [dt]));
            }
        });

    }
    const extendedGame = await getTrain()

    return extendedGame
}
export default trainMixin