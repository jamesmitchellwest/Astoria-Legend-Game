import loadTextFrames from '../resources/load_text.json'
const gameMixin = async (me) => {
    const getGame = async () => {
        const game = {

            // an object where to store game information
            data: {
                // score
                score: 0
            },
            collisionTypes: {
                BOOST: me.collision.types.USER << 0,
                BOOSTTILE: me.collision.types.USER << 1,
                WARP: me.collision.types.USER << 2,
                PACMAN: me.collision.types.USER << 3,
                MOVING_PLATFORM: me.collision.types.USER << 4,
                HOLLOW: me.collision.types.USER << 5,
                SPIKES: me.collision.types.USER << 6,
                VANISHING_TILE: me.collision.types.USER << 7,
            },
            // Run on page load.
            "onload": () => {
                // Initialize the video.
                if (!me.video.init(1920, 1080, { parent: "root", scale: "auto", scaleMethod: "flex-width" })) {
                    alert("Your browser does not support HTML5 canvas.");
                    return;
                }

                // Initialize the audio.
                me.audio.init("mp3");

                
                const loadFiles = [{
                    'name': 'load_text',
                    'type': 'image',
                    'src': 'data/img/load_text.png'
                },
                {
                    'name': 'load_text',
                    'type': 'json',
                    'src': 'data/img/texture/load_text.json'
                },
                {
                    'name': 'loading_screen',
                    'type': 'tmx',
                    'src': `data/map/loading_screen.tmx`
                }];
                me.loader.preload(loadFiles, loaded, false);
            },
        }
        const loaded = () => {
            const loadTextImage = me.loader.getImage("load_text")
            game.loadTextTexture = new me.video.renderer.Texture(
                loadTextFrames,
                loadTextImage
            );
            me.state.set(me.state.PLAY, new game.PlayScreen());
            me.state.set(me.state.TITLE, new game.TitleScreen());
            me.state.set(me.state.LOADING, new game.LoadScreen());
            me.pool.register("start_text_sprite", game.StartTextSprite);
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
            me.input.bindKey(me.input.KEY.SPACE, "attack" || "powerUp", true);
            //pause
            me.input.bindKey(me.input.KEY.ESC, "pause");
            // start the game
            me.input.bindKey(me.input.KEY.ENTER, "enter");
            me.state.change(me.state.LOADING);

        };
        // window.game = game
        return game
    }
    const extendedGame = await getGame()
    return extendedGame
}
export default gameMixin

 // async hook snippet
//  const game = (me, game) => {
//     const getGame = async () => {


//     }
//     const extendedGame = await getGame()

//     return extendedGame
// }
// export default game