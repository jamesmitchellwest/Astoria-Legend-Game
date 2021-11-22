const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.CarlEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {


                // call the super constructor
                this._super(me.Entity, "init", [
                    x, y, settings
                ]);
                this.settings = settings;
                this.settings.state = this.settings.state || "moving"
                this.renderable = game.texture.createAnimationFromName([
                    "carl-0", "carl-1", "carl-2",
                    "carl-3", "carl-4", "carl-5",
                    "carl-6", "carl-7",

                ]);

                var eyeballSettings = {
                    width: game.EyeballEntity.width,
                    height: game.EyeballEntity.height,
                    region: "eyeball",
                    image: game.entity_texture_1,
                    framewidth: 18,
                    parent: this,
                }

                if (settings.state == "hanging") {
                    this.renderable.flipY(true);
                    me.game.world.addChild(me.pool.pull("eyeball", x, y, eyeballSettings))
                }
                this.anchorPoint.set(0.5, 0.5);
                this.body.setMaxVelocity(6, 0);

                this.renderable.addAnimation("idle", [0, 1], 500);
                this.renderable.addAnimation("roll", [2, 3, 4, 5], 70);
                this.renderable.addAnimation("dead", [6]);
                this.renderable.addAnimation("eyeball", [7]);
                this.renderable.setCurrentAnimation("idle");

                // set a "enemyObject" type
                this.body.collisionType = me.collision.types.ENEMY_OBJECT;
                this.body.setFriction(1, 0);
                // don't update the entities when out of the viewport
                this.alwaysUpdate = false;
                this.counter = 0;
                this.isMovingEnemy = true;
                this.movingLeft = false;
                this.handleAnimationStates();
            },

            handleAnimationStates: function () {
                let _this = this;
                if (this.settings.state == "hanging") { //handling inverted carl animation
                    this.timer = me.timer.setInterval(function () {
                        if (_this.renderable.isCurrentAnimation("idle")) {
                            _this.renderable.setCurrentAnimation("eyeball")
                        } else {
                            _this.renderable.setCurrentAnimation("idle")
                        }
                    }, 5000);
                }
            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {

                this.counter += 10;
                if (this.settings.state == "moving") { // alternating rolling left, right, and idle
                    if (this.counter == this.settings.rollDuration && this.body.vel.x != 0) {

                        this.body.force.x = 0;
                        this.renderable.setCurrentAnimation("idle")
                        this.movingLeft ? this.renderable.flipX(true) : this.renderable.flipX(false);
                    }
                    if (this.counter > 2500 + this.settings.rollDuration && this.body.vel.x == 0) {

                        this.movingLeft = !this.movingLeft
                        this.renderable.setCurrentAnimation("roll")
                        this.movingLeft ? this.body.force.x = -5 : this.body.force.x = 5;
                        this.counter -= this.counter
                    }
                }

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
            onCollision: function (response, other) {
                // res.y >0 means touched by something on the bottom
                // which mean at top position for this one
                if (other.name == "mainPlayer") {
                    if (this.alive && (response.overlapV.y > 0) &&
                        response.a.body.falling &&
                        !response.a.renderable.isFlickering()) {
                        // make it dead
                        this.alive = false;
                        me.audio.play("fart_squish", false, null, 0.2)
                        me.audio.play("cool_bloop", false, null, 0.15)
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
                    }
                    // dead sfx
                    // me.audio.play("enemykill", false);
                    // give some score
                }

                return false;
            }

        });
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin