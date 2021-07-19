// import { stringify } from 'flatted';

const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.SkeletorEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {


                // call the super constructor
                this._super(me.Entity, "init", [
                    x, y, settings
                ]);
                this.renderable = game.texture.createAnimationFromName([
                    "skeletor-0", "skeletor-1", "skeletor-2",]);
                this.anchorPoint.set(0.5, 0.5);
                this.body.setMaxVelocity(0, 0);

                this.renderable.addAnimation("idle", [0, 1], 500);
                this.renderable.addAnimation("shoot", [1, 2, 1, 2,], 200);
                this.renderable.addAnimation("dead", [1]);
                this.renderable.setCurrentAnimation("idle");

                // set a "enemyObject" type
                this.body.collisionType = me.collision.types.ENEMY_OBJECT;
                this.body.setFriction(2, 0);
                // don't update the entities when out of the viewport
                this.alwaysUpdate = false;
                this.pacmanDeleteAfter = settings.pacmanDeleteAfter;
                this.isMovingEnemy = true;
                this.settings = settings;
                this.settings.flipX = this.settings.flipX || false
                if(this.settings.flipX){
                    this.renderable.flipX(true)
                }
                this.shoot(this.pos)
            },

            shoot: function (pos) {
                const pacmanSettings = {
                    width: game.PacManEntity.width,
                    height: game.PacManEntity.height,
                    region: "pacMan",
                    image: game.entity_texture_1,
                    framewidth: 60,
                    x: this.settings.flipX ? pos.x : pos.x + this.width,
                    y: pos.y + (this.height / 2) - 30,
                    pacmanDeleteAfter: this.pacmanDeleteAfter,
                    flipX: this.settings.flipX,
                }


                this.timer = me.timer.setInterval(() => {
                    this.renderable.setAnimationFrame();
                    this.renderable.setCurrentAnimation("shoot", "idle");
                    if (this.inViewport) {
                        me.game.world.addChild(me.pool.pull("pacMan", pacmanSettings.x, pacmanSettings.y, pacmanSettings))
                    }

                }, 3000);


            },

            /**
             * manage the enemy movement
             */
            update: function (dt) {

                //     window.setDebugVal(`
                //     ${stringify(this.inViewport)}
                //  `)

                if (this.alive) {

                    // check & update movement
                    this.body.update(dt);

                }

                // return true if we moved of if flickering
                return (this._super(me.Entity, "update", [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },
            onDeactivateEvent: function () {
                me.timer.clearInterval(this.timer);
            },

            /**
             * collision handle
             */
            onCollision: function (response) {
                // res.y >0 means touched by something on the bottom
                // which mean at top position for this one
                if (this.alive && (response.overlapV.y > 0) && response.a.body.falling && !response.a.renderable.isFlickering()) {
                    // make it dead
                    this.alive = false;
                    //avoid further collision and delete it
                    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
                    // set dead animation
                    this.renderable.setCurrentAnimation("dead");
                    // tint to red
                    this.renderable.tint.setColor(255, 192, 192);
                    // make it flicker and call destroy once timer finished
                    var self = this;
                    this.renderable.flicker(750, function () {
                        me.game.world.removeChild(self);
                    });
                    // dead sfx
                    // me.audio.play("enemykill", false);
                    // give some score
                    game.data.score += 150;
                }

                return false;
            }

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin