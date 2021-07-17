import { stringify } from 'flatted';

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
                this.body.setMaxVelocity(2.5, 0);
                this.body.ignoreGravity = true;
                this.startSpeed = .05;
                this.renderable = game.texture.createAnimationFromName([
                    "hoverboard-00", "hoverboard-01", "hoverboard-02",
                ])
                this.renderable.addAnimation("hover", [0, 1, 2, 1], 200);
                this.renderable.setCurrentAnimation("hover");
                this.renderable.flipX(true)
                this.lateralDistance = settings.lateralDistance || 1000;

                this.body.collisionType = game.collisionTypes.MOVING_PLATFORM;
                this.body.setFriction(0, 0);
                // don't update the entities when out of the viewport
                this.alwaysUpdate = false;
                this.isMovingEnemy = true;
                this.body.vel.x = this.startSpeed
                this.moving = "right";
                this.passiveMovement();
            },
            passiveMovement: function () {
                this.tweenPause = false;
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
                    this.tweenPause = true;
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
                // window.setDebugVal(`
                //     ${stringify(this.moving)}
                //  `)


                if(this.pos.x - this.startX <= 0 && this.body.vel.x < 0) {
                    this.moving = "right";
                    this.body.vel.x = this.startSpeed
                }
                if (this.pos.x - this.startX >= this.lateralDistance && this.body.vel.x) {
                    this.moving = "left";
                    this.body.vel.x = -this.startSpeed
                    
                }
                /////slow down movement////
                if ((this.pos.x - this.startX < 110 && this.moving == "left") || 
                (this.pos.x - this.startX > this.lateralDistance - 110 && this.moving == "right")) {
                    this.body.vel.x *= .98;
                }
                if ((this.pos.x - this.startX < 120 && this.moving == "right") || 
                (this.pos.x - this.startX > this.lateralDistance - 120 && this.moving == "left")) {
                    this.body.vel.x *= 1.025;
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

                    if (response.overlapV.y > 0 && other.body.vel.y > 1 && !this.tweenPause) {
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