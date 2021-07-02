import { stringify } from 'flatted';
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.SpikesEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                this._super(me.Entity, 'init', [x, y, settings]);

                this.settings = settings;
                this.body.collisionType = me.collision.types.ENEMY_OBJECT;

                    
                    
                this.alwaysUpdate = true;
                

            },
            recordPlayerPos: function () {
                let _this = this;
                // this.timer = me.timer.setInterval(function () {
                    if (_this.mainPlayer.recordPos)
                        _this.reSpawnPos = _this.mainPlayer.pos;
                // }, 2000)
            },
            update: function (dt) {
            
                if(me.game.world.getChildByName("mainPlayer")[0])
                    this.mainPlayer = me.game.world.getChildByName("mainPlayer")[0];
                    this.recordPlayerPos();


                window.setDebugVal(`
                    ${stringify(this.reSpawnPos)}
                    ${stringify(this.mainPlayer.recordPos)}
                 `)


                return (this._super(me.Entity, 'update', [dt]));
            },
            onCollision: function (response, other) {
                if (other.name == "mainPlayer") {
                    other.body.pos.x = this.reSpawnPos.x;
                    other.body.pos.y = this.reSpawnPos.y;
                }

                return false;


            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin