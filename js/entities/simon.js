game.SimonEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        
        // call the super constructor
        this._super(me.Entity, "init", [x, y , settings]);
        this.body.setMaxVelocity(0, 0);

        this.renderable.addAnimation("idle", [0, 1, 2, 3], 500);
        this.renderable.addAnimation("shoot", [4, 5], 100);
        this.renderable.addAnimation("dead", [6]);
        this.renderable.setCurrentAnimation("idle");
        this.anchorPoint.set(-.6, -.3);

        // set a "enemyObject" type
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        // don't update the entities when out of the viewport
        this.alwaysUpdate = false;

        this.isMovingEnemy = true;
        this.shoot(this.pos)
    },
    shoot: function (pos) {
        var _this = this;
        var settings = {
            width: game.CubeProjectile.width,
            height: game.CubeProjectile.height,
            image: "cube",
            framewidth: 21,
            x: pos.x - 75,
            y: pos.y + 35,
        }
        this.timer = me.timer.setInterval(function(){
            _this.renderable.setAnimationFrame();
            _this.renderable.setCurrentAnimation("shoot", "idle");
            me.game.world.addChild(me.pool.pull("cubeProjectile", settings.x, settings.y, settings))
        }, 3000 );
       
        
    },

    /**
     * manage the enemy movement
     */
    update : function (dt) {

        if (this.alive)    {

            // check & update movement
            this.body.update(dt);

        }

        // return true if we moved of if flickering
        return (this._super(me.Entity, "update", [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * collision handle
     */
    onCollision : function (response) {
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (response.overlapV.y > 0) && response.a.body.falling && !response.a.renderable.isFlickering()) {
            // make it dead
            this.alive = false;
            //stop shooting
            me.timer.clearInterval(this.timer);
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
            // game.data.score += 150;
        }

        return false;
    }

});