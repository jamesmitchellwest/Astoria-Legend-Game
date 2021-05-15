game.CassetteProjectile = me.Entity.extend({
    
    init: function (x, y, settings) {
        this.startY = y;
        this._super(me.Entity, "init", [settings.x + 60, settings.y + 100, settings]);
        this.body.force.y = -5;
        this.body.force.x = Math.random() < 0.5 ? 5 : -5;
        this.body.setMaxVelocity(5, 15)
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        this.alwaysUpdate = false;
    },

    update: function (dt) {
        this.body.force.y *= .9;
        this.renderable.rotate(.2);
        if (this.pos.y - this.startY > 1080 ) {
            me.game.world.removeChild(this);
        }
        this.body.update(dt);
        return (this._super(me.Entity, "update", [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
    onCollision: function (res, other) {
        other.name == "mainPlayer" && other.hurt();
        me.game.world.removeChild(this);
    }
});

game.CassetteProjectile.width = 24;
game.CassetteProjectile.height = 15;