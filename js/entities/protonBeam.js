game.ProtonBeam = me.Entity.extend({
    
    init: function (x, y, settings) {

        
        this._super(me.Entity, "init", [settings.containerWidth - 8, settings.containerHeight / 2 - 6, settings]);
        // this.body.addShape(new me.Rect(x, y, this.width, this.height));
        this.body.setVelocity(30, 0);
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        this.pos.z = 8;
        this.renderable.addAnimation("shoot", [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,31,32,33], 50);
        this.renderable.addAnimation("maxRange", [34,35],50);
        this.renderable.setCurrentAnimation("shoot");
        this.renderable.setOpacity(0);
        this.shoot();
    },

    shoot: function (pos) {
        var _this = this;

        this.timer = me.timer.setInterval(function(){
            _this.renderable.setOpacity(1);
            _this.renderable.setAnimationFrame();
            _this.renderable.setCurrentAnimation("shoot", function(){
                _this.renderable.setCurrentAnimation("maxRange");
                setTimeout(function () {
                    _this.renderable.setOpacity(0);
                }, 1000);
            });
            
        }, 3000 );
       
        
    },
    update: function (dt) {
        // this.body.vel.x -= this.body.accel.x * dt / 1000;

        // if (this.pos.x + this.height <= 0) {
        //     me.game.world.removeChild(this);
        // }

        this.body.update();
        // me.collision.check(this);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
    onDeactivateEvent: function () {
        me.timer.clearInterval(this.timer);
    },
    onCollision: function (res, other) {
        other.name == "mainPlayer" && other.hurt();
        return false;
    }
});

game.ProtonBeam.width = 720;
game.ProtonBeam.height = 48;