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


        var beamSettings = {
            width: game.ProtonBeam.width,
            height: game.ProtonBeam.height,
            framewidth: 720,
            containerWidth: this.width,
            containerHeight: this.height
        }

        this.addChild(me.pool.pull("protonBeam", beamSettings.x, beamSettings.y, beamSettings));

        this.addChild(me.pool.pull("slimerEntity", x, y, settings), 9);
        this.changeDirection();

    },

    changeDirection: function () {
        var _this = this;
        //temporary not so great random movement
        this.timer = me.timer.setInterval(function () {
            // horizontal
            if (_this.startX < _this.pos.x || Math.random() < 0.1) {
                _this.velX = -2.5;
                _this.flipX(false);
            } else if (_this.startX - _this.pos.x < 1200 || Math.random() < 0.1) {
                _this.velX = 2.5
                _this.flipX(true);
            }
            // vertical
            if (_this.pos.y > _this.startY) {
                _this.velY = -1;
            } else {
                _this.velY = 1;
            }
        }, 3000);

    },
    /**
     * manage the enemy movement
     */
    update: function (dt) {
        if (this.velX < this.maxSpeed) {
            this.velX += .005
        }
        if (this.velY < this.maxSpeed) {
            this.velY += .005
        }
        this.pos.x += this.velX;
        this.pos.y += this.velY;
        // return true if we moved of if flickering
        return (this._super(me.Container, "update", [dt]));
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
        this.anchorPoint.set(0.5, 0.5);
        this.body.setMaxVelocity(2.5, 2.5);
        this.body.ignoreGravity = true;

        this.renderable.addAnimation("idle", [0, 1], 300);
        // this.renderable.addAnimation("shoot", [4, 5], 100);
        this.renderable.setCurrentAnimation("idle");

        // set a "enemyObject" type
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        // don't update the entities when out of the viewport
        this.alwaysUpdate = false;

        this.isMovingEnemy = true;
    },

    /**
     * manage the enemy movement
     */
    update: function (dt) {

        // if (this.alive) {

        // check & update movement
        this.body.update(dt);

        // }

        // 
        this._super(me.Entity, "update", [dt]);
        return true;
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

game.SlimerEntity.width = 128;
game.SlimerEntity.height = 128;