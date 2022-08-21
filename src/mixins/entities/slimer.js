import { frames as animFrames } from '../../resources/texture.json'
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

            },
            moveTowardPlayer: function () {

                //////////////VERTICAL MOVEMENT//////////////////
                if (this.target && !this.isMovingVertically && !this.beamSprite.getOpacity()) {
                    this.isMovingVertically = true;
                    this.yTween = new me.Tween(this.pos)
                        .to({ y: this.target.y - 30 }, Math.abs(me.Math.clamp(this.pos.y - this.target.y, 300, Infinity)) * 9)
                        .onComplete(() => {
                            this.isMovingVertically = false;
                        })
                    this.yTween.easing(me.Tween.Easing.Quadratic.InOut);
                    this.yTween.start();
                }
                //////////////HORIZONTAL MOVEMENT//////////////////
                if (this.target && !this.isMovingHorizontally) {
                    this.isMovingHorizontally = true;
                    const horizontalTargetPos = this.pos.x >= this.target.x ? 200 : -200;
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
            opacitySwitch: function () {
                this.tweenIsBusy = true;
                this.alphaTween = new me.Tween(this.slimerEntity.renderable)
                    .to({ alpha: this.targetOpacity }, this.targetOpacity == 1 ? 1500 : 500).onComplete(() => {
                        this.tweenIsBusy = false;
                    })
                this.alphaTween.easing(me.Tween.Easing.Quadratic.InOut);
                this.alphaTween.start();
            },
            /**
             * manage the enemy movement
             */
            update: function (dt) {
                if (!this.slimerEntity.shooting && game.mainPlayer.pos.x < this.pos.x && !game.mainPlayer.renderable.isFlippedX ||
                    !this.slimerEntity.shooting && game.mainPlayer.pos.x > this.pos.x && game.mainPlayer.renderable.isFlippedX) {
                    this.isPlayerFacing = true;
                    if (this.slimerEntity.renderable.getOpacity() > .15 && !this.tweenIsBusy) {
                        this.targetOpacity = .15;
                        this.opacitySwitch();
                    }

                } else {
                    this.isPlayerFacing = false;
                    this.targetOpacity = 1;

                    if (this.slimerEntity.renderable.getOpacity() < 1 && !this.tweenIsBusy) {
                        this.opacitySwitch();
                    }
                    this.target = game.mainPlayer.pos
                    if (Math.abs(this.pos.y - this.target.y) < 50 && this.slimerEntity.shooting == false &&
                        this.stopShot && this.slimerEntity.renderable.alpha == 1) {
                        this.stopShot = false;
                        this.slimerEntity.shoot();
                        setTimeout(() => {
                            this.stopShot = true;
                        }, 3500);
                    }

                    if (this.inViewport && !this.slimerEntity.shooting) {
                        this.moveTowardPlayer();
                    }
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
                this.name = "slimer";
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

                this.renderable.addAnimation("idle", [0, 1], 300);
                this.renderable.addAnimation("shoot", [4, 5], 100);
                this.renderable.setCurrentAnimation("idle");
                this.renderable.setOpacity(0.15)
                this.anchorPoint.set(0, 0.5)
                this.renderable.anchorPoint.set(0.5, 0.5)
                this.beamSprite.anchorPoint.set(-.079, 0)

                // don't update the entities when out of the viewport
                
                this.isMovingEnemy = true;
                this.body.updateBounds();
                this.shooting = false;
                this.alwaysUpdate = false;

                this.body.collisionType = me.collision.types.ACTION_OBJECT;


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
                me.audio.play("protonbeam", false, null, 0.05)
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
                //beam shape
                if (this.shooting)
                 { // beam is visible
                    this.alwaysUpdate = true;
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
                    this.alwaysUpdate = false;
                    shape.points[1].x = shape.points[2].x = 0;
                    shape.setShape(shapeXpos, shapeYpos, shape.points);
                    if (game.mainPlayer.fsm.state == "electrocute") {
                        game.mainPlayer.fsm.dispatch("idle")
                    }
                }
                // mask
                if (this.shooting) {
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
                } else {
                    this.maskShape.points[1].x = this.maskShape.points[2].x = 0;
                    this.maskShape.setShape(128, shapeYpos, this.maskShape.points);
                }

                this.body.updateBounds();

            },
            slimeTween: function () {
                const slimeTween = new me.Tween(game.mainPlayer.renderable.tint)
                    .to({ r: 255, b: 255 }, 4000).onComplete(() => {
                        game.mainPlayer.slimed = false;
                        game.mainPlayer.resetSettings();
                    })
                slimeTween.easing(me.Tween.Easing.Quadratic.In);
                slimeTween.start();
            },
            electrocute: function () {
                me.game.viewport.shake(7, 1000, me.game.viewport.AXIS.BOTH);
                game.mainPlayer.fsm.dispatch("electrocute")
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
                if (other.name == "mainPlayer") {
                    //Player collided with beam
                    if (this.shooting && response.indexShapeB == 1) {
                        this.electrocute();
                    }
                    //Player collided with slimer--set tint and slow movement
                    if (!other.slimed && response.indexShapeB == 0) {
                        me.audio.play("slimer", false, null, 0.5)
                        other.slimed = true;
                        other.renderable.tint.setColor(150, 255, 150)
                        other.body.runSpeed = other.body.slimedSpeed;
                        this.slimeTween();
                    }
                }
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