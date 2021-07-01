import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.VanishingTileEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                settings.image = game.texture;
                settings.region = "vanishingTile_0";
                // replace default rectangle with topLine
                this.lines = []

                this.lines.push( new me.Line(x, y, [
                    new me.Vector2d(0, 0),
                    new me.Vector2d(settings.width, 0)
                ]));
                this.lines.push( new me.Line(x, y, [
                    new me.Vector2d(settings.width, 0),
                    new me.Vector2d(settings.width, settings.height)
                ]));
                this.lines.push( new me.Line(x, y, [
                    new me.Vector2d(0, settings.height),
                    new me.Vector2d(settings.width, settings.height)
                ]));
                this.lines.push( new me.Line(x, y, [
                    new me.Vector2d(0, 0),
                    new me.Vector2d(0, settings.height)
                ]));
                

                this._super(me.Entity, 'init', [x, y, settings]);

                this.body.collisionType = me.collision.types.WORLD_SHAPE;

                this.collisionObject = false;

                this.vanishTween = new me.Tween(this.renderable).to({ alpha: 0 }, 2000)
                    .onComplete(() => {

                        if ((this.collisionObject.pos.y) - (this.pos.y)) {

                            this.appearTween.start();
                        }
                    })
                this.vanishTween.easing(me.Tween.Easing.Linear.None);
                this.appearTween = new me.Tween(this.renderable).to({ alpha: 1 }, 2000)
                    .onComplete(() => { (this.body.collisionType = me.collision.types.WORLD_SHAPE) })
                this.appearTween.easing(me.Tween.Easing.Linear.None);



            },
            checkCollision: function (){
                const collisions = []
                for (let index = 0; index < 4; index++) {
                collisions.push(me.collision.rayCast(this.lines[index]))                    
                }
                debugger
            },
            update: function (dt) {
                if(this.renderable.alpha == 0 && this.collisionObject) {
                    
                }

                // window.setDebugVal(`
                //     ${stringify(me.collision.check(this.collisionObject))}
                //  `)

                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {

                if (other.name == "mainPlayer") {
                    if (!this.collisionObject) {
                        this.collisionObject = other;
                    }
                    this.checkCollision();
                    this.vanishTween.start();
                    if (this.renderable.getOpacity() < 0.25) {
                        this.body.collisionType = me.collision.types.NO_OBJECT;
                    }
                }
                return false;

            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin