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
                this.timer = me.timer.setInterval(function () {
                    if (_this.mainPlayer.recordPos && _this.mainPlayer.body.vel.y === 0) {
                        _this.reSpawnPosX = Math.round(_this.mainPlayer.pos.x); 
                        _this.reSpawnPosY = Math.round(_this.mainPlayer.pos.y);
                    }
                }, 2000)
            },
            update: function (dt) {
            
                if(me.game.world.getChildByName("mainPlayer")[0])
                    this.mainPlayer = me.game.world.getChildByName("mainPlayer")[0];
                    this.recordPlayerPos();


                window.setDebugVal(`
                    ${stringify(this.reSpawnPosX)}
                    ${stringify(this.reSpawnPosY)}
                    ${stringify(this.mainPlayer.body.vel.y)}
                 `)


                return (this._super(me.Entity, 'update', [dt]));
            },
            onCollision: function (response, other) {
                if (other.name == "mainPlayer") {
                    other.pos.x = this.reSpawnPosX;
                    other.pos.y = this.reSpawnPosY;
                }

                return false;


            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin