
/* Game namespace */
var game = {

    // an object where to store game information
    data: {
        // score
        score: 0
    },
    collisionTypes: {
        BOOST: me.collision.types.USER << 0,
        BOOSTTILE: me.collision.types.USER << 1,
        WARP: me.collision.types.USER << 2,
    },
    // Run on page load.
    "onload": function () {
        // Initialize the video.
        if (!me.video.init(1920, 1080, { parent: "screen", scale: "auto", scaleMethod: "flex-width" })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("webm, mp3");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded": function () {


        game.texture = new me.video.renderer.Texture(
            me.loader.getJSON("texture"),
            me.loader.getImage("texture")
        );
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // register our player entity in the object pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("cubeProjectile", game.CubeProjectile);
        me.pool.register("cassetteProjectile", game.CassetteProjectile);
        me.pool.register("pacMan", game.PacManEntity);
        me.pool.register("protonBeam", game.ProtonBeam);
        me.pool.register("simon", game.SimonEntity);
        me.pool.register("slimer", game.SlimerContainer);
        me.pool.register("slimerEntity", game.SlimerEntity);
        me.pool.register("carl", game.CarlEntity);
        me.pool.register("gremlin", game.GremlinEntity);
        me.pool.register("skeletor", game.SkeletorEntity);
        me.pool.register("warpEntity", game.WarpEntity);
        me.pool.register("boostEntity", game.BoostEntity);
        me.pool.register("boostTile", game.BoostTile, true);

        // title screen sprites
        me.pool.register("jim_start_sprite", game.JimStartSprite);
        me.pool.register("brad_start_sprite", game.BradStartSprite);
        me.pool.register("start_text_sprite", game.StartTextSprite);
        me.pool.register("al_logo", game.ALLogo);
        me.pool.register("loading_sprite", game.LoadingSprite);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        // map X, Up Arrow and Space for jump
        me.input.bindKey(me.input.KEY.X, "jump", false);
        me.input.bindKey(me.input.KEY.UP, "jump", false);
        me.input.bindKey(me.input.KEY.SPACE, "jump", false);
        //attack
        me.input.bindKey(me.input.KEY.SPACE, "attack", true);
        // start the game
        me.state.change(me.state.PLAY);
    }
};
