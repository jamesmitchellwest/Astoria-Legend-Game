/**
 * a player entity
 */
game.PlayerEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [
            x, y ,
            Object.assign({
                image: game.texture,
                region : "jim_sprite-0"
            }, settings)
        ]);
        this.body.runSpeed = 9;
        this.body.jumpSpeed = this.body.jumpForce = 18;
        this.body.boostedHorizontalSpeed = this.body.runSpeed * 2;
        this.body.boostedVerticalSpeed = this.body.jumpSpeed * 1.5;
        this.body.facingLeft = false;
        this.body.boostedDir = "";
        this.body.isWarping = false;
        this.body.crouching = false;

        // max walking & jumping speed
        this.body.setMaxVelocity(this.body.runSpeed, this.body.jumpSpeed);
        this.body.setFriction(0.7, 0);
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.renderable = game.texture.createAnimationFromName([
            "jim_sprite-0", "jim_sprite-1", "jim_sprite-2",
            "jim_sprite-3", "jim_sprite-4", "jim_sprite-5",
            "jim_sprite-6", "jim_sprite-7", "jim_sprite-8",
            "jim_sprite-9", "jim_sprite-10", "jim_sprite-11",
            "jim_sprite-12", "jim_sprite-13",
        ]);
        this.anchorPoint.set(0.5, 0.5);
        this.renderable.addAnimation("walk", [0, 1, 2, 3], 200);
        this.renderable.addAnimation("idle", [4, 5], 500);
        this.renderable.addAnimation("jump", [2]);
        this.renderable.addAnimation("fall", [1]);
        this.renderable.addAnimation("crouch", [6]);

        this.renderable.addAnimation("emote", [{ name: "jim_sprite-10", delay: 1000 }, { name: "jim_sprite-11", delay: Infinity }]);
        this.renderable.addAnimation("attack", [{ name: "jim_sprite-8", delay: 50 }, { name: "jim_sprite-9", delay: 150 }]);
        this.renderable.addAnimation("crouchAttack", [{ name: "jim_sprite-7", delay: 50 }, { name: "jim_sprite-12", delay: 150 }]);


        // // set the standing animation as default
        // this.renderable.setCurrentAnimation("idle");

        // this.bottomLine = new me.Line(0, 0, [
        //     new me.Vector2d(30, 162),
        //     new me.Vector2d(30, 182)
        // ]);
        // this.body.addShape(this.bottomLine);
        // this.leftLine = new me.Line(0, 0, [
        //     new me.Vector2d(-5, 50),
        //     new me.Vector2d(-5, 90)
        // ]);
        // this.body.addShape(this.leftLine);

        // this.crouchBox = this.body.addShape(new me.Rect(0, 0, this.width, this.height / 2));

        

    },

    /**
     * update the entity
     */
    update: function (dt) {

        if (this.body.isWarping) {
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
        } else {
            if (!this.body.boostedDir) {
                this.body.force.x = 0;
            }
            if (!this.renderable.isCurrentAnimation("idle")) {
                if (!this.body.jumping &&
                    !this.body.falling &&
                    !me.input.isKeyPressed('down') &&
                    !this.renderable.isCurrentAnimation("attack")) {
                    this.renderable.setAnimationFrame();
                    this.renderable.setCurrentAnimation("idle");
                }
            }
        }

        if (me.input.isKeyPressed('down') &&
            !this.body.jumping &&
            !this.body.falling &&
            !this.renderable.isCurrentAnimation("crouch") &&
            !this.renderable.isCurrentAnimation("crouchAttack")) {
            // this.renderable.flipX(false);
            this.body.force.x = 0;
            this.renderable.setAnimationFrame();
            this.renderable.setCurrentAnimation("crouch");
        }
        // debugVal(me.timer.tick);
        if (me.input.isKeyPressed('jump') && this.body.jumpForce > 7 ) {
                this.body.jumpForce *= .9;
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.jumping = true;
                this.body.force.y -= this.body.jumpForce;
            }
        }
        else {
            this.body.force.y= 0;
        }

        if (me.input.isKeyPressed('attack')) {
            if (this.renderable.isCurrentAnimation("crouch") || this.renderable.isCurrentAnimation("crouchAttack")) {
                this.renderable.setAnimationFrame();
                this.renderable.setCurrentAnimation("crouchAttack", "crouch");
            } else {
                this.renderable.setAnimationFrame();
                this.renderable.setCurrentAnimation("attack", "idle");
            }
        }

        // TODO: emote
        // if (!this.body.jumping && !this.body.falling && !this.renderable.isCurrentAnimation("emote")) {
        //     this.renderable.flipX(false);
        //     this.body.force.x = 0;
        //     this.renderable.setAnimationFrame();
        //     this.renderable.setCurrentAnimation("emote");
        // }

        if (this.body.falling && !this.renderable.isCurrentAnimation("fall")) {
            this.renderable.setCurrentAnimation("fall")
        }
        if (this.body.jumping && !this.renderable.isCurrentAnimation("jump")) {
            this.renderable.setCurrentAnimation("jump")
        }
        if(this.body.jumping && this.body.falling){
            this.body.jumping = false;
        }

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
                if(this.body.falling && this.body.jumpForce != this.body.jumpSpeed){
                    this.body.jumpForce = this.body.jumpSpeed;
                }
                
                break;
            case game.collisionTypes.BOOST:
                if(this.body.falling && this.body.jumpForce != this.body.jumpSpeed){
                    this.body.jumpForce = this.body.jumpSpeed;
                }
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

        return true;

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