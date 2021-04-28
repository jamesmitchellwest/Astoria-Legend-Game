/**
 * a player entity
 */
game.PlayerEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.runSpeed = 6;
        this.body.jumpSpeed = 18;
        this.body.boostedHorizontalSpeed = this.body.runSpeed * 2;
        this.body.boostedVerticalSpeed = this.body.jumpSpeed * 1.5;
        this.body.facingLeft = false;
        this.body.boostedDir = "";
        this.body.isWarping = false;


        // max walking & jumping speed
        this.body.setMaxVelocity(this.body.runSpeed, this.body.jumpSpeed);
        this.body.setFriction(2, 0);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [0, 1, 2, 3], 200);

        // define a standing animation (using the first frame)
        this.renderable.addAnimation("idle", [4, 5], 500);

        // define a jumping animation
        this.renderable.addAnimation("jump", [2]);

        // define a falling animation
        this.renderable.addAnimation("fall", [1]);

        // define a crouching animation
        this.renderable.addAnimation("crouch", [{ name: 6, delay: 1000 }, { name: 7, delay: Infinity }]);

        // define an attacking animation
        this.renderable.addAnimation("attack", [{ name: 8, delay: 50 }, { name: 9, delay: 150 }]);


        // set the standing animation as default
        this.renderable.setCurrentAnimation("idle");

        this.bottomLine = new me.Line(0, 0, [
            new me.Vector2d(30, 162),
            new me.Vector2d(30, 182)
        ]);
        this.body.addShape(this.bottomLine);
        this.leftLine = new me.Line(0, 0, [
            new me.Vector2d(-5, 50),
            new me.Vector2d(-5, 90)
        ]);
        this.body.addShape(this.leftLine);

        this.anchorPoint.set(-0.35, 0);

    },

    /**
     * update the entity
     */
    update: function (dt) {
        if (this.body.isWarping) {
            if (this.body.facingLeft) {
                this.renderable.flipX(false);
            }
            return true;
        }
        if (me.input.isKeyPressed('left')) {

            this.body.facingLeft = true;

            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the default force
            this.body.force.x = -this.body.runSpeed;

            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                if (!this.body.jumping && !this.body.falling) {
                    this.renderable.setAnimationFrame();
                    this.renderable.setCurrentAnimation("walk");
                }
            }
        } else if (me.input.isKeyPressed('right')) {

            this.body.facingLeft = false;

            // unflip the sprite
            this.renderable.flipX(false);
            // update the entity velocity


            if (this.body.boostedDir == "right") {
                this.body.maxVel.x = this.body.runSpeed * 2;
            } else {
                this.body.force.x = this.body.runSpeed;
            }

            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                if (!this.body.jumping && !this.body.falling) {
                    this.renderable.setAnimationFrame();
                    this.renderable.setCurrentAnimation("walk");
                }
            }
        } else if (me.input.isKeyPressed('down')) {

            if (me.collision.response.a.name == "warpEntity" &&
                me.collision.response.a.children[0].current.name == "open") {
                let booth = me.collision.response.a.children[0];
                booth.alwaysUpdate = true;
                this.body.isWarping = true;
                var self = this;
                booth.setCurrentAnimation('flicker', function () {
                    self.renderable.setOpacity(0)
                    me.audio.play("phonebooth", false);
                    booth.setCurrentAnimation('warp', function () {
                        booth.pos.y = 0;
                        booth.setCurrentAnimation('warped');
                    });
                });
                this.renderable.setAnimationFrame();
                this.renderable.setCurrentAnimation("crouch");
                return true;
            }

            if (!this.body.jumping && !this.body.falling && !this.renderable.isCurrentAnimation("crouch")) {
                this.renderable.flipX(false);
                this.body.force.x = 0;
                this.renderable.setAnimationFrame();
                this.renderable.setCurrentAnimation("crouch");
            }
        } else if (me.input.isKeyPressed('attack')) {

            this.renderable.setAnimationFrame();
            this.renderable.setCurrentAnimation("attack", "idle");
        } else {
            if (this.body.boostedDir) {
                //boosted but no key input.. reset default run speed
                this.body.maxVel.x = this.body.runSpeed

            } else {
                //no key input.. stand still
                this.body.force.x = 0;
            }

            if (this.body.facingLeft && this.renderable.isCurrentAnimation("crouch")) {
                this.renderable.flipX(true);
            }
            // change to the standing animation
            if (!this.body.jumping &&
                !this.body.falling &&
                !this.renderable.isCurrentAnimation("idle") &&
                !this.renderable.isCurrentAnimation("attack")) {
                this.renderable.setCurrentAnimation("idle");
            }
        }

        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.jumping = true;
                this.body.force.y = -this.body.maxVel.y;
            }
        }
        else {
            this.body.force.y = 0;
        }

        this.body.falling && !this.renderable.isCurrentAnimation("fall") && this.renderable.setCurrentAnimation("fall")
        this.body.jumping && !this.renderable.isCurrentAnimation("jump") && this.renderable.setCurrentAnimation("jump")

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     */
    onCollision: function (response, other) {


        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                if (this.body.boostedDir && !this.body.jumping) {
                    this.body.setMaxVelocity(this.body.runSpeed, this.body.jumpSpeed);
                    this.body.boostedDir = "";
                }
                break;
            case game.collisionTypes.BOOST:
                break;
            case me.collision.types.ENEMY_OBJECT:
                if (!other.isMovingEnemy) {
                    // spike or any other fixed danger
                    this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                    this.hurt();
                }
                else {
                    // a regular moving enemy entity
                    if ((response.overlapV.y > 0) && this.body.falling && !this.renderable.isFlickering()) {
                        // jump
                        this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                    }
                    else {
                        this.hurt();
                    }
                    // Not solid
                    return false;
                }
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        return response.indexShapeA === 0 ? true : false;

    },

    hurt: function () {
        var sprite = this.renderable;

        if (!sprite.isFlickering()) {

            // tint to red and flicker
            sprite.tint.setColor(255, 192, 192);
            sprite.flicker(750, function () {
                // clear the tint once the flickering effect is over
                sprite.tint.setColor(255, 255, 255);
            });

            // flash the screen
            // me.game.viewport.fadeIn("#FFFFFF", 75);
            // me.audio.play("die", false);
        }
    }
});