game.BoostEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {

        this._super(me.Entity, 'init', [x, y, settings]);

        this.settings = settings;
        // set the collision type

        this.body.collisionType = game.collisionTypes.BOOST;
        
    },
    update: function (dt) {

        return (this._super(me.Entity, 'update', [dt]));
    },
    /**
     * collision handling
     */
    onCollision : function (response, other) {
            if(this.settings.dir == "right" && response.indexShapeA == 1 ){
                other.body.maxVel.x = other.body.facingLeft ? other.body.runSpeed / 2 : other.body.runSpeed;
                other.body.force.x = other.body.maxVel.x;
                other.body.boostedDir = "right";
            }
            if(this.settings.dir == "up" && !response.indexShapeA ){
                other.body.jumping = true;
                other.body.maxVel.y = other.body.boostedVerticalSpeed;
                other.body.vel.y = -other.body.maxVel.y;
                other.body.force.x = 0
                other.body.boostedDir = "up";
            }

        return false;
    }
});