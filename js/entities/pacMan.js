game.PacManEntity = me.Entity.extend({
    
    init: function (x, y, settings) {
        this.startX = x;
        
        this._super(me.Entity, "init", [settings.x, settings.y, settings]);
        // this.body.addShape(new me.Rect(x, y, this.width, this.height));
        this.renderable = game.texture.createAnimationFromName([
            "pacMan-0", "pacMan-1", "pacMan-2"
        ]);
        this.anchorPoint.set(0.5, 0.5);
        this.body.setVelocity(30, 0);
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        this.pos.z = 8;
        this.alwaysUpdate = true;
    },

    update: function (dt) {
        // this.body.vel.x -= this.body.accel.x * dt / 1000;

        this.body.vel.x = 5;
        if (this.pos.x - this.startX > 2160) { //do something better
            me.game.world.removeChild(this);
        }

        this.body.update();
        me.collision.check(this);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
    onCollision: function (res, other) {
        if (this.pos.x - this.startX > 25){
        other.name == "mainPlayer" && other.hurt();
        me.game.world.removeChild(this);
        }
    }
});

game.PacManEntity.width = 60;
game.PacManEntity.height = 60;