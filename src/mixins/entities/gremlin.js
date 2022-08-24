const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.GremlinEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {


                // call the super constructor
                this._super(me.Entity, "init", [
                    x, y, settings
                ]);
                this.settings = settings;
                this.renderable = game.texture.createAnimationFromName([
                    "gremlin-0", "gremlin-1", "gremlin-2",
                    "gremlin-3", "gremlin-4", "gremlin-5",
                ]);
                this.anchorPoint.set(0.5, 0.5);
                this.body.setMaxVelocity(0, 0);
                this.renderable.addAnimation("idle", [0, 1], 400);
                this.renderable.addAnimation("flip", [1, 2, 4, 5, 4, 5, 4, 5, 4, 3, 1], 150);
                this.renderable.addAnimation("dead", [1]);
                this.renderable.setCurrentAnimation("idle");

                // set a "enemyObject" type
                this.body.collisionType = me.collision.types.ENEMY_OBJECT;
                this.body.setFriction(2, 0);
                // don't update the entities when out of the viewport
                this.alwaysUpdate = false;
                this.isMovingEnemy = true;
                this.lastProjectileTime = 0
            },

            flip: function (pos) {

                me.audio.play("gremlin_flip", false, null, this.volumePerspective)
                let settings = {
                    width: game.CassetteProjectile.width,
                    height: game.CassetteProjectile.height,
                    region: "cassette",
                    image: game.entity_texture_1,
                    framewidth: 24,
                    x: pos.x - 15,
                    y: pos.y + 65,
                }
                this.renderable.setCurrentAnimation("flip", "idle");
                setTimeout(() => {
                    me.game.world.addChild(me.pool.pull("cassetteProjectile", settings.x, settings.y, settings))
                    me.audio.play("whoosh_1", false, null, this.volumePerspective + .1)
                }, 500)
                setTimeout(() => {
                    me.game.world.addChild(me.pool.pull("cassetteProjectile", settings.x, settings.y, settings))
                    me.audio.play("whoosh_1", false, null, this.volumePerspective + .1)
                }, 1000)
                me.game.world.addChild(me.pool.pull("cassetteProjectile", settings.x, settings.y, settings))
                me.audio.play("whoosh_1", false, null, this.volumePerspective + .1)
                this.lastProjectileTime = me.timer.getTime()
            },

            /**
             * manage the enemy movement
             */
            update: function (dt) {

                this.volumePerspective = me.Math.clamp(Math.abs(100 / ((game.mainPlayer.pos.x - this.pos.x) + (game.mainPlayer.pos.y - this.pos.y))), 0, 0.3)

                if (this.alive) {
                    if (me.timer.getTime() - this.lastProjectileTime > 5000) {
                        this.flip(this.pos)
                    }

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
                        me.timer.clearInterval(this.timer);
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