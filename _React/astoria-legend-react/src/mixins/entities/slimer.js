import {frames as animFrames} from '../../resources/texture.json'
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.SlimerContainer = me.Container.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this.startX = x;
                this.startY = y;
                this.settings = settings
                this.maxSpeed = 3;
                this.velX = 0;
                this.velY = 0;
                // call the super constructor
                this._super(me.Container, "init", [x, y, settings.width, settings.height]);
                this.onChildChange = function () {
                    this.updateChildBounds();
                };
                const beamSprite = game.texture.createAnimationFromName(animFrames.filter(x => x.filename.includes("protonbeam"))
                    .map(x => x.filename.includes("protonbeam") ? x.filename : null));

                this.addChild(beamSprite);
                this.addChild(me.pool.pull("slimerEntity", x, y, Object.assign({
                    parent: this,
                }, settings)), 9);
                // this.changeDirection();

            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {

                this._super(me.Container, "update", [dt]);
                this.updateChildBounds();
            },
            onDeactivateEvent: function () {
                me.timer.clearInterval(this.timer);
            },

        });

        game.SlimerEntity = me.Entity.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this.startX = x;
                this.startY = y;

                // call the super constructor
                this._super(me.Entity, "init", [
                    0, 0, settings
                ]);

                this.renderable = game.texture.createAnimationFromName([
                    "slimer-0", "slimer-1", "slimer-2",
                    "slimer-3"
                ]);
                this.beamSprite = settings.parent.getChildAt(0);
                this.beamSprite.pos.x = this.width - 9;
                this.beamSprite.pos.y = (this.height / 2) - 5;

                this.beamSprite.addAnimation("shoot", [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 31, 32, 33], 50);
                this.beamSprite.addAnimation("maxRange", [34, 35], 50);
                this.beamSprite.setCurrentAnimation("shoot");
                this.renderable.anchorPoint.set(0, 0);
                this.beamSprite.anchorPoint.set(0, 0);

                this.body.setMaxVelocity(2.5, 2.5);
                this.body.ignoreGravity = true;
                // this.body.force.x=-10
                // this.beamSprite.anchorPoint.set(0.5, 0.5);
                this.beamShape = new me.Rect(this.width, this.height / 2, 0, this.beamSprite.height / 2)
                this.body.addShape(this.beamShape);

                this.body.collisionType = me.collision.types.ENEMY_OBJECT;
                // this.beamShape.collisionType = me.collision.types.ENEMY_OBJECT;
                this.renderable.addAnimation("idle", [0, 1], 300);
                // this.renderable.addAnimation("shoot", [4, 5], 100);
                this.renderable.setCurrentAnimation("idle");


                // don't update the entities when out of the viewport
                this.alwaysUpdate = false;

                this.isMovingEnemy = true;
                this.shoot();
            },

            shoot: function (pos) {
                var beam = this.beamSprite;
                var _this = this;
                this.timer = me.timer.setInterval(function () {
                    beam.setOpacity(1);
                    beam.setAnimationFrame();
                    beam.setCurrentAnimation("shoot", function () {
                        beam.setCurrentAnimation("maxRange");
                        setTimeout(function () {
                            beam.setOpacity(0);
                        }, 1000);
                    });

                }, 3000);


            },
            updateBeamHitbox: function () {
                let shape = this.body.getShape(1);
                if (this.beamSprite.getOpacity()) { // beam is visible
                    if (this.beamSprite.isCurrentAnimation("shoot")) { //shoot animation
                        if (this.beamSprite.getCurrentAnimationFrame() !== 0) {
                            let targetBeamWidth = this.beamSprite.getCurrentAnimationFrame() * 45;
                            if (targetBeamWidth > this.beamSprite.width) {
                                targetBeamWidth = this.beamSprite.width
                            }
                            shape.points[1].x = shape.points[2].x = targetBeamWidth;
                            shape.setShape(this.width, this.height / 2, shape.points);
                        }
                    } else { // max range
                        shape.points[1].x = shape.points[2].x = this.beamSprite.width;
                        shape.setShape(this.width, this.height / 2, shape.points);
                    }
                } else { //beam is not visible; set width to 0
                    shape.points[1].x = shape.points[2].x = 0;
                    shape.setShape(this.width, this.height / 2, shape.points);
                }
                this.body.updateBounds();
            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {

                this.updateBeamHitbox();

                // check & update movement
                this.body.update(dt);
                this._super(me.Entity, "update", [dt]);
                return true;
            },

            /**
             * collision handle
             */
            onCollision: function (response, other) {

                other.name == "mainPlayer" && other.hurt();
                return false
            }

        });

        game.SlimerEntity.width = 128;
        game.SlimerEntity.height = 128;
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin