const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.SimonEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                // call the super constructor
                this._super(me.Entity, "init", [
                    x, y, settings
                ]);
                this.body.setMaxVelocity(0, 0);
                this.renderable = game.texture.createAnimationFromName([
                    "simon-0", "simon-1", "simon-2",
                    "simon-3", "simon-4", "simon-5",
                    "simon-6"
                ]);
                this.anchorPoint.set(0.5, 0.4);
                this.renderable.addAnimation("idle", [0, 1, 2, 3], 500);
                this.renderable.addAnimation("shoot", [4, 5, 4, 5, 4, 5], 150);
                this.renderable.addAnimation("dead", [6]);
                this.renderable.setCurrentAnimation("idle");
                this.settings = settings;
                this.lastProjectileTime = 0

                // set a "enemyObject" type
                this.body.collisionType = me.collision.types.ENEMY_OBJECT;

                // don't update the entities when out of the viewport
                this.alwaysUpdate = false;

                this.isMovingEnemy = true;
                if (this.settings.flipX) {
                    this.renderable.flipX(true)
                }
            },
            shoot: function (pos) {
                const volumePerspective = me.Math.clamp(Math.abs(60 / ((game.mainPlayer.pos.x - this.pos.x) + (game.mainPlayer.pos.y - this.pos.y))), 0, 0.3)
                me.audio.play("simon_burp", false, null, volumePerspective)

                var settings = {
                    width: game.CubeProjectile.width,
                    height: game.CubeProjectile.height,
                    region: "cube",
                    image: game.entity_texture_1,
                    framewidth: 21,
                    x: this.settings.flipX ? pos.x + 60 : pos.x - 75,
                    y: pos.y + 35,
                    flipX: this.settings.flipX,
                }

                this.renderable.setAnimationFrame();
                this.renderable.setCurrentAnimation("shoot", "idle");
                me.game.world.addChild(me.pool.pull("cubeProjectile", settings.x, settings.y, settings))
                this.lastProjectileTime = me.timer.getTime()

            },

            /**
             * manage the enemy movement
             */
            update: function (dt) {

                if (this.alive) {

                    if (me.timer.getTime() - this.lastProjectileTime > 3000) {
                        this.shoot(this.pos)
                    }

                    // check & update movement
                    this.body.update(dt);

                }

                // return true if we moved of if flickering
                return (this._super(me.Entity, "update", [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },
            onDeactivateEvent: function () {

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
                    //stop shooting
                    me.timer.clearInterval(this.timer);
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
                }

                return false;
            }

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin