// import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.ProtonParticleSystem = me.Container.extend({
            /**
             * constructor
             */

            init: function (x, y, settings) {

                this._super(me.Container, 'init', [me.game.viewport.x, me.game.viewport.y, 2000, 1080]);

                const orangeParticle = me.loader.getImage("orangeParticle")
                
                const orangeEmitter = new me.ParticleEmitter(this.pos.x, this.pos.y, {
                    image: orangeParticle,
                    width: 9,
                    height: 9,
                    totalParticles: 300,
                    angle: 0,
                    maxLife: 1000,
                    speed: 10,
                    minEndScale: 1,
                    maxEndScale: 1,
                    gravity: 0,
                    followTrajectory: true,
                    frequency: 50,
                    z: 11,
                    floating: true,
                });

                me.game.world.addChild(orangeEmitter);

                orangeEmitter.streamParticles();

            },
            update: function (dt) {
                // if(orangeEmitter.gravity == .1){
                //     orangeEmitter.gravity = -.1
                // }

                return false;
            },
            
        });
        

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin