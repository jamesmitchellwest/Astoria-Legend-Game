game.CassetteProjectile = me.Entity.extend({
    
    init: function (x, y, settings) {

        
        this._super(me.Entity, "init", [settings.x, settings.y, settings]);
        // this.body.addShape(new me.Rect(x, y, this.width, this.height));
        // this.body.setVelocity (-2,-5);
        this.body.force.y = .5;
        this.body.force.x = -.2
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        //this.pos.z = 3;
        this.alwaysUpdate = true;
        this.spin = 0;
        this.rotate();
    },

    rotate: function(){
        let _this = this;

        _this.timer = me.timer.setInterval(function(){
            _this.spin = _this.spin + 1;
            _this.renderable.rotate(_this.spin);
        },100);
    },

    update: function (dt) {
        // this.body.vel.x -= this.body.acc.y = 1 * dt / 1000;
        // if (this.pos.x + this.height <= 0) {
        //     me.game.world.removeChild(this);
        // }

        this.body.update();
        // me.collision.check(this);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
    onCollision: function (res, other) {
        other.name == "mainPlayer" && other.hurt();
        me.game.world.removeChild(this);
    }
});

game.CassetteProjectile.width = 24;
game.CassetteProjectile.height = 15;