const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.HoverboardEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {
                this.startX = x;
                this.startY = y;


                // call the super constructor
                this._super(me.Entity, "init", [
                    x, y, settings
                ]);
                this.settings = settings;


                this.anchorPoint.set(0.5, 0.2);
                this.body.setMaxVelocity(6, 0);
                this.body.ignoreGravity = true;

                this.renderable = game.texture.createAnimationFromName([
                    "hoverboard-00", "hoverboard-01", "hoverboard-02",
                ])
                this.renderable.addAnimation("hover", [0, 1, 2, 1], 200);
                this.renderable.setCurrentAnimation("hover");

                this.lateralDistance = this.startX + settings.lateralDistance || 1000;

                this.body.collisionType = game.collisionTypes.MOVING_PLATFORM;
                this.body.setFriction(0, 0);
                // don't update the entities when out of the viewport
                this.alwaysUpdate = false;
                this.isMovingEnemy = true;
                this.moveRight = true;

                this.passiveMovement();
            },
            passiveMovement: function () {
                const downTween = this.downTween = new me.Tween(this.pos).to({ y: this.startY + 8 }, 800)
                    .onComplete(() => { upTween.start() });
                const upTween = this.upTween = new me.Tween(this.pos).to({ y: this.startY }, 800)
                    .onComplete(() => { downTween.start() });
                downTween.easing(me.Tween.Easing.Cubic.InOut);
                upTween.easing(me.Tween.Easing.Cubic.InOut);
                downTween.start();
            },
            collisionMovement: function () {

                if (this.pos.y == me.Math.clamp(this.pos.y, this.startY, this.startY + 8)) {
                    const reboundTween = this.reboundTween = new me.Tween(this.pos).to({ y: this.startY }, 1000)
                        .onComplete(() => { this.passiveMovement() })
                    reboundTween.easing(me.Tween.Easing.Quadratic.In);
                    reboundTween.easing(me.Tween.Easing.Elastic.Out);
                    const dropTween = new me.Tween(this.pos).to({ y: this.pos.y + 20 }, 200)
                        .onComplete(() => {
                            reboundTween.start()
                        })

                    dropTween.easing(me.Tween.Easing.Quadratic.Out);
                    dropTween.start();
                }

            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {
                if (this.body.vel.x !== 0) {
                    if (this.pos.x <= this.startX) { //stop moving left
                        this.moveRight = true;
                        this.body.vel.x = 0;
                    }
                    if (this.pos.x >= this.lateralDistance) { //stop moving right
                        this.moveRight = false;
                        this.body.vel.x = 0;
                    }
                }
                if (this.body.vel.x == 0) {
                    if (this.moveRight = true) { //move right
                        this.body.vel.x = 2;
                    } else {
                        this.body.vel.x = -2; //move left
                    }
                }


                if (this.inViewport) {

                    // check & update movement
                    this.body.update(dt);
                }

                // return true if we moved of if flickering
                return (this._super(me.Entity, "update", [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
            },

            /**
             * collision handle
             */
            onCollision: function (response, other) {
                if (other.name == "mainPlayer") {

                    if (response.overlapV.y > 0 && other.body.vel.y > 1) {
                        this.downTween.stop();
                        this.upTween.stop();
                        this.collisionMovement();
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