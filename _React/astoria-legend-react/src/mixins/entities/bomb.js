// import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.BombEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this.topLine = new me.Line(0, 0, [
                    new me.Vector2d(settings.width / 2, settings.height / 2),
                    new me.Vector2d(settings.width / 2, 0)
                ]);
                this.rightLine = new me.Line(0, 0, [
                    new me.Vector2d(settings.width / 2, settings.height / 2),
                    new me.Vector2d(settings.width, settings.height / 2)
                ]);
                this.bottomLine = new me.Line(0, 0, [
                    new me.Vector2d(settings.width / 2, settings.height / 2),
                    new me.Vector2d(settings.width / 2 , settings.height)
                ]);
                this.leftLine = new me.Line(0, 0, [
                    new me.Vector2d(settings.width / 2, settings.height / 2),
                    new me.Vector2d(0, settings.height / 2)
                ]);

                
                //replace default rectangle with topLine
                settings.shapes[0] = this.topLine
                this._super(me.Entity, 'init', [x, y, settings]);

                // add collision lines for left right bottom
                this.body.addShape(this.rightLine);
                this.body.addShape(this.bottomLine);
                this.body.addShape(this.leftLine);
                this.body.addShape(this.topLine);

                this.settings = settings;
                // set the collision type

                this.body.collisionType = game.collisionTypes.ENEMY_OBJECT;
            },
           

           
            
            update: function (dt) {

                return (this._super(me.Entity, 'update', [dt]));
            },
            /**
             * collision handling
             */
            onCollision: function (response, other) {
                

                return true;


            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin