game.GremlinEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        

        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.body.setMaxVelocity(0, 0);

        this.renderable.addAnimation("idle", [0, 1], 400);
        this.renderable.addAnimation("flip", [1, 2, 4, 5, 4, 5, 4, 5, 4, 3, 1], 150);
        this.renderable.addAnimation("dead", [1]);
        this.renderable.setCurrentAnimation("idle");
        this.anchorPoint.set(0, 0.02);

        // set a "enemyObject" type
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
        this.body.setFriction(2, 0);
        // don't update the entities when out of the viewport
        this.alwaysUpdate = false;
        this.isMovingEnemy = true;
        this.flip(this.pos);
    },

    flip: function (pos) {
        let _this = this
            let settings = {
                width: game.CassetteProjectile.width,
                height: game.CassetteProjectile.height,
                image: "cassette",
                framewidth: 24,
                x: pos.x,
                y: pos.y  ,
            }
            _this.timer = me.timer.setInterval(function(){
                _this.renderable.setCurrentAnimation("flip", "idle");
                if (_this.inViewport) {
                    me.game.world.addChild(me.pool.pull("cassetteProjectile", settings.x, settings.y, settings))
                }
                
            }, 3450);
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
                me.timer.clearInterval(this.timer);
            });
            // dead sfx
            // me.audio.play("enemykill", false);
            // give some score
            // game.data.score += 150;
        }

        return false;
    }

});