game.SlimerEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {

        this.startX = x;
        this.startY = y;

        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.body.setMaxVelocity(2.5, 2.5);

        this.renderable.addAnimation("idle", [0, 1], 300);
        // this.renderable.addAnimation("shoot", [4, 5], 100);
        this.renderable.setCurrentAnimation("idle");

        // set a "enemyObject" type
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        // don't update the entities when out of the viewport
        this.alwaysUpdate = false;

        this.isMovingEnemy = true;
        this.changeDirection(this.pos)
    },
    changeDirection: function () {
        var _this = this;
        //temporary not so great random movement
        this.timer = me.timer.setInterval(function () {
            //horizontal
            if (_this.startX - _this.pos.x > 500 || _this.pos.x < 200 || Math.random() < 0.5) {
                _this.body.force.x = _this.body.maxVel.x
                _this.renderable.flipX(false);
            } else {
                _this.body.force.x = -_this.body.maxVel.x
                _this.renderable.flipX(true);
            }
            //vertical
            if (_this.pos.y > _this.startY) {
                _this.body.force.y = -_this.body.maxVel.x;
            } else {
                _this.body.force.y = _this.body.maxVel.x;
            }
        }, 3000);

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
            //stop shooting
            // me.timer.clearInterval(this.timer);
            //avoid further collision and delete it
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            // set dead animation
            // this.renderable.setCurrentAnimation("dead");
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
            // game.data.score += 150;
        }

        return false;
    }

});