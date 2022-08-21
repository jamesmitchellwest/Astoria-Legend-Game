// import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.ProtonParticleSystem = me.Sprite.extend({
            /**
             * constructor
             */

            init: function (x, y, settings) {

                this._super(me.Sprite, "init", [game.mainPlayer.pos.x, game.mainPlayer.pos.y, {
                    image: me.loader.getImage("orangeParticle.png"),
                }]);

                this.emitter = new me.ParticleEmitter(0, 0, {
                    name: "explosion",
                    ancestor: this,
                    image: this.image,
                    totalParticles: 500,
                    angle: me.Math.degToRad(-90),
                    angleVariation: .1,
                    minLife: 200,
                    maxLife: 0,
                    speed: 5,
                    speedVariation: 0.5,
                    gravity: 0.1,
                    frequency: 5,
                    wind: -.05,
                    z: 9,
                    width: 5,
                    minEndScale: .2
                });

                me.game.world.addChild(this.orangeEmitter, 11);

                

            },
            update: function (dt) {
                
                this.emitter.streamParticles();

                return false;
            },

        });


    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin