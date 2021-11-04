import { frames as animFrames } from '../../resources/texture.json'
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        var Beam = me.Renderable.extend({
            /**
             * @ignore
             */
            init: function init(x, y) {
                this._super(me.Renderable, "init", [0, 0, 720, 200]);

                this.canv = me.video.createCanvas(1000, 1000, false);
                this.alwaysUpdate = true
                this.step = 7;

                // start and end coordinates for the line 
                this.x1 = new Array(0, 0, 'x');
                this.y1 = new Array(250, 0, 'y');
                this.x2 = new Array(700, 0, 'x');
                this.y2 = new Array(250, 0, 'y');

            },
            get_bounce_coord: function (coord_array) {
                coord_array[0] += this.step * coord_array[1];

                if ((coord_array[0] > (this.canv.height - 2 * this.step) && coord_array[2] === 'y')
                    || (coord_array[0] > (this.canv.width - 2 * this.step) && coord_array[2] === 'x')
                    || coord_array[0] < 2 * this.step) {
                    coord_array[1] *= -1;
                }
            },
            random_coord: function (type) {
                this.dimension = (this.type === 'x') ? this.canv.width : this.canv.height;
                return Math.random() * (this.dimension - 1 * this.step) - 10;
            },
            update: function (dt) {
                this._super(me.Renderable, "update", [dt]);
                return true;
            },
            draw: function draw(renderer) {
                
                var context = renderer.getContext2d(this.canv);
                /** coordinates for the control points of the bezier curve */
                this.cx1 = new Array(this.random_coord('x'), 1, 'x');
                this.cy1 = new Array(this.random_coord('y'), -1, 'y');
                this.cx2 = new Array(this.random_coord('x'), -1, 'x');
                this.cy2 = new Array(this.random_coord('y'), 1, 'y');

                /** get the new coords based on each ones current trajectory */
                this.get_bounce_coord(this.x1);
                this.get_bounce_coord(this.y1);
                this.get_bounce_coord(this.x2);
                this.get_bounce_coord(this.y2);

                this.get_bounce_coord(this.cx1);
                this.get_bounce_coord(this.cy1);
                this.get_bounce_coord(this.cx2);
                this.get_bounce_coord(this.cy2);

                for (let i = 5; i >= 0; i--) {
                    context.beginPath();
                    /** draw each line, the last line in each is always white */
                    context.lineWidth = (i + 1) * 4 - 2;

                    if (i === 0) {
                        context.strokeStyle = '#fff';
                    } else {
                        context.strokeStyle = 'rgba(205,178,42,0.2)';
                    }

                    context.moveTo(this.x1[0], this.y1[0]);
                    context.bezierCurveTo(this.cx1[0], this.cy1[0], this.cx2[0], this.cy2[0], this.x2[0], this.y2[0]);
                    context.stroke();
                    context.closePath();
                }
                renderer.drawImage(this.canv, 0, 0);
            }
        }); 
        game.SlimerContainer = me.Container.extend({
            /**
             * constructor
             */
            init: function (x, y, settings) {

                this.startX = x;
                this.startY = y;
                this.settings = settings
                this.maxSpeed = 3;
                // call the super constructor
                this._super(me.Container, "init", [x, y, settings.width, settings.height]);
                this.onChildChange = function () {
                    this.updateChildBounds();
                };
                this.beamSprite = game.texture.createAnimationFromName(animFrames.filter(x => x.filename.includes("protonbeam"))
                    .map(x => x.filename.includes("protonbeam") ? x.filename : null));
                this.addChild(this.beamSprite);
                this.slimerEntity = me.pool.pull("slimerEntity", x, y, Object.assign({
                    parent: this,
                }, settings))
                this.addChild(this.slimerEntity, 9);
                this.anchorPoint.set(0.5, 0);
                this.flipX(true)
                this.isMovingVertically = false;
                this.isMovingHorizontally = false;
                this.stopShot = true;



                this.addChild(new Beam(0, 0), 9)

            },
            moveTowardPlayer: function () {

                //////////////VERTICAL MOVEMENT//////////////////
                if (this.target && !this.isMovingVertically && !this.beamSprite.getOpacity()) {
                    this.isMovingVertically = true;
                    this.yTween = new me.Tween(this.pos)
                        .to({ y: this.target.y - 30 }, Math.abs(me.Math.clamp(this.pos.y - this.target.y, 400, Infinity)) * 9)
                        .onComplete(() => {
                            this.isMovingVertically = false;
                            // if (Math.floor(me.timer.getTime()) / 1000 - this.previousShotTime >= 5) {
                            //     // this.slimerEntity.shoot(); ////SHOOT
                            // }
                        })
                    this.yTween.easing(me.Tween.Easing.Quadratic.InOut);
                    this.yTween.start();
                }
                //////////////HORIZONTAL MOVEMENT//////////////////
                if (this.target && !this.isMovingHorizontally) {
                    this.isMovingHorizontally = true;
                    const horizontalTargetPos = this.pos.x >= this.target.x ? 350 : -350;
                    const xTween = new me.Tween(this.pos)
                        .to({ x: this.target.x + horizontalTargetPos }, Math.abs(me.Math.clamp(
                            this.target.x + horizontalTargetPos - this.target.x, 400, Infinity)) * 16)
                        .onComplete(() => {
                            this.isMovingHorizontally = false;
                        })
                    xTween.easing(me.Tween.Easing.Quadratic.InOut);
                    xTween.start();
                }
                if (this.target && !this.beamSprite.getOpacity()) {
                    if (this.pos.x >= this.target.x) {
                        this.slimerEntity.flip(true);
                    } else {
                        this.slimerEntity.flip(false);
                    }
                }
            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {

                this.target = game.mainPlayer.pos
                if (Math.abs(this.pos.y - this.target.y) < 50 && this.slimerEntity.shooting == false && this.stopShot) {
                    this.stopShot = false;

                    // this.slimerEntity.shoot();
                    setTimeout(() => {
                        this.stopShot = true;
                    }, 5000);
                }

                if (this.inViewport || !this.isMovingVertically && !this.slimerEntity.shooting) {
                    this.moveTowardPlayer();
                }


                this._super(me.Container, "update", [dt]);
                this.updateChildBounds();
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
                this.parent = settings.parent
                this.renderable = game.texture.createAnimationFromName(animFrames.filter(x => x.filename.includes("slimer"))
                    .map(x => x.filename.includes("slimer") ? x.filename : null));
                this.beamSprite = settings.parent.getChildAt(0);
                this.beamSprite.previousAnimFrame = 0;
                this.beamSprite.pos.x = this.width - 9;
                this.beamSprite.pos.y = (this.height / 2) - 5;

                this.beamSprite.addAnimation("shoot", [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0], 50);
                this.beamSprite.addAnimation("maxRange", [1, 2, 3, 4, 5, 0], 50);
                this.beamSprite.setCurrentAnimation("shoot");
                this.beamSprite.setOpacity(0);

                this.body.setMaxVelocity(2.5, 2.5);
                this.body.ignoreGravity = true;
                this.beamShape = new me.Rect(-5, this.height / 2, 0, this.beamSprite.height / 2)
                this.maskShape = new me.Rect(-5, this.height / 2, 0, this.beamSprite.height)
                this.beamSprite.mask = this.maskShape;
                this.body.addShape(this.beamShape);
                this.body.collisionType = me.collision.types.ENEMY_OBJECT;
                this.renderable.addAnimation("idle", [0, 1], 300);
                this.renderable.addAnimation("shoot", [4, 5], 100);
                this.renderable.setCurrentAnimation("idle");

                this.anchorPoint.set(0, 0.5)
                this.renderable.anchorPoint.set(0.5, 0.5)
                this.beamSprite.anchorPoint.set(-.079, 0)

                // don't update the entities when out of the viewport
                this.alwaysUpdate = false;
                this.isMovingEnemy = true;
                this.body.updateBounds();
                this.shooting = false;


            },

            flip: function (shouldBeFlipped) {
                if (shouldBeFlipped) {
                    this.parent.flipX(true);
                    this.anchorPoint.set(1, 0.5)
                    this.renderable.anchorPoint.set(1.5, 0.5)
                    this.beamSprite.anchorPoint.set(0.1, 0)
                } else {
                    this.parent.flipX(false);
                    this.anchorPoint.set(0, 0.5)
                    this.renderable.anchorPoint.set(-.5, 0.5)
                    this.beamSprite.anchorPoint.set(-.079, 0)
                }
                this.updateBeamHitbox();
            },
            shoot: function (pos) {
                this.shooting = true;
                var beam = this.beamSprite;
                beam.setAnimationFrame();
                beam.setOpacity(1);
                const _this = this
                beam.setCurrentAnimation("shoot", function () {
                    beam.setCurrentAnimation("maxRange");
                    setTimeout(function () {
                        beam.setOpacity(0);
                        _this.shooting = false;
                    }, 1000);

                });
            },

            updateBeamHitbox: function () {
                let shape = this.body.getShape(1);
                let flipped = this.parent.isFlippedX;
                let shapeXpos = flipped ? 5 : this.width + 5;
                let shapeYpos = this.height / 2;
                let targetBeamWidth = this.beamSprite.getCurrentAnimationFrame() * 45;
                if (this.beamSprite.getOpacity(1)) { // beam is visible
                    if (this.beamSprite.isCurrentAnimation("shoot")) { //shoot animation
                        if (targetBeamWidth > this.beamSprite.width) {
                            //kinda hacky but this caps the hitbox width
                            targetBeamWidth = this.beamSprite.width
                        }
                        shape.points[1].x = shape.points[2].x = flipped ? -targetBeamWidth : targetBeamWidth;
                        shape.setShape(shapeXpos, shapeYpos, shape.points);
                    } else { // max range
                        shape.points[1].x = shape.points[2].x = (flipped ? -this.beamSprite.width : this.beamSprite.width);
                        shape.setShape(shapeXpos, shapeYpos, shape.points);
                    }
                } else { //beam is not visible; set width to 0
                    shape.points[1].x = shape.points[2].x = 0;
                    shape.setShape(shapeXpos, shapeYpos, shape.points);
                }

                this.body.updateBounds();
                if (flipped) {
                    this.maskShape.points[1].x = this.maskShape.points[2].x = this.beamSprite.isCurrentAnimation("maxRange") ? this.beamSprite.width : targetBeamWidth;
                    this.beamSprite.mask.pos.x = -targetBeamWidth
                    this.maskShape.setShape(128, shapeYpos, this.maskShape.points);
                    this.beamSprite.mask = this.maskShape
                } else {
                    this.maskShape.points[1].x = this.maskShape.points[2].x = this.beamSprite.isCurrentAnimation("maxRange") ? this.beamSprite.width : targetBeamWidth;
                    this.maskShape.setShape(128, shapeYpos, this.maskShape.points);
                    this.beamSprite.mask = this.maskShape
                }


            },
            onDeactivateEvent: function () {
                me.timer.clearInterval(this.timer);
            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {

                if (this.beamSprite.previousAnimFrame != this.beamSprite.getCurrentAnimationFrame()) {
                    this.beamSprite.previousAnimFrame = this.beamSprite.getCurrentAnimationFrame();
                    this.updateBeamHitbox();
                }

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