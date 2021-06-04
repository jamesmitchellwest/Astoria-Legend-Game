game.CarlEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {

        this.startX = x;
        this.starty = y;
        

        // call the super constructor
        this._super(me.Entity, "init", [
            x, y, settings
        ]);
        this.renderable = game.texture.createAnimationFromName([
            "carl-0", "carl-1", "carl-2",
            "carl-3", "carl-4", "carl-5",
            "carl-6"
        ]);
        this.anchorPoint.set(0.5, 0.5);
        this.body.setMaxVelocity(6, 0);

        this.renderable.addAnimation("idle", [0, 1,], 500);
        this.renderable.addAnimation("roll", [2, 3, 4, 5], 70);
        this.renderable.addAnimation("dead", [6]);
        this.renderable.setCurrentAnimation("idle");

        // set a "enemyObject" type
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
        this.body.setFriction(1, 0);
        // don't update the entities when out of the viewport
        this.alwaysUpdate = false;

        this.isMovingEnemy = true;
        this.rolling = (false);
        // this.facingRight = false;
        // this.facingLeft = false;
        // this.rollingRight = false;
        this.center = this.startX - 100
        this.roll();


    },

    roll: function () {
        let _this = this;
        
        _this.timer = me.timer.setInterval(function () {

            if (_this.renderable.isCurrentAnimation("roll") && _this.body.force.x > 0) {
                _this.body.force.x = 0;
                _this.renderable.setCurrentAnimation("idle");
                _this.renderable.flipX (false);
            }

            else if (_this.renderable.isCurrentAnimation("roll") && _this.body.force.x < 0) {            
                _this.body.force.x = 0;
                _this.renderable.setCurrentAnimation("idle");
                _this.renderable.flipX (true);
            }

            else if (_this.renderable.isCurrentAnimation("idle") && _this.pos.x < _this.startX) {
                _this.body.force.x = _this.body.maxVel.x;
                _this.renderable.setCurrentAnimation("roll");

            }   
            else {
                _this.body.force.x = -_this.body.maxVel.x;
                _this.renderable.setCurrentAnimation("roll");
            }   
            }, 2000);
    },

    /**
     * manage the enemy movement
     */
    update: function (dt) {

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
            });
            // dead sfx
            // me.audio.play("enemykill", false);
            // give some score
            game.data.score += 150;
        }

        return false;
    }

});