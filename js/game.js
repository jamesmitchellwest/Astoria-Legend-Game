
/* Game namespace */
var game = {

    // an object where to store game information
    data: {
        // score
        score: 0
    },
    collisionTypes: {
        BOOST : me.collision.types.USER << 0,
        WARP : me.collision.types.USER << 1,
    },
    // Run on page load.
    "onload": function () {
        // Initialize the video.
        if (!me.video.init(1920, 1080, { parent: "screen", scale: "auto", scaleMethod: "flex-width" })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded": function () {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // register our player entity in the object pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("cubeProjectile", game.CubeProjectile);
        me.pool.register("simon", game.SimonEntity);
        me.pool.register("warpEntity", game.WarpEntity);
        me.pool.register("boostEntity", game.BoostEntity);
        me.pool.register("boostTile", game.BoostTile, true);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        // map X, Up Arrow and Space for jump
        me.input.bindKey(me.input.KEY.X, "jump", true);
        me.input.bindKey(me.input.KEY.UP, "jump", true);
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        //attack
        me.input.bindKey(me.input.KEY.A, "attack", true);
        // start the game
        me.state.change(me.state.PLAY);
    }
};
