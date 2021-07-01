import frames from '../resources/texture.json'
import loadTextFrames from '../resources/load_text.json'
import loadJimFrames from '../resources/load_jim.json'
import loadBradFrames from '../resources/load_brad.json'
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
                VANISHING_TILE: me.collision.types.USER << 5,
            },
            // Run on page load.
            "onload": () => {
                // Initialize the video.
                if (!me.video.init(1920, 1080, { parent: "root", scale: "auto", scaleMethod: "flex-width"})) {
                    alert("Your browser does not support HTML5 canvas.");
                    return;
                }

                // Initialize the audio.
                me.audio.init("webm, mp3");

                // set and load all resources.
                // (this will also automatically switch to the loading screen)
                const audioFiles = (ctx => {
                    let keys = ctx.keys();
                    return keys.map((file, i) => {

                        return {
                            name: keys[i].split("/")[keys[i].split("/").length - 1].split(".")[0],
                            type: 'audio',//getType(keys[i].split("/")[keys[i].split("/").length - 1].split(".")[1]),
                            src: `data/audio/`
                        }
                    });
                })(require.context('../../public/data/audio', true, /.*/))

                
                const images = (ctx => {
                        let keys = ctx.keys();
                        return keys.map((file, i) => {
                            const fileName = keys[i].split("/")[keys[i].split("/").length - 1].split(".")[0],
                                source = `data/img/${keys[i].split("/")[1]}`

                            return {
                                name: fileName,
                                type: 'image',//getType(keys[i].split("/")[keys[i].split("/").length - 1].split(".")[1]),
                                src: source
                            }
                        });
                    })(require.context('../../public/data/img', true, /.*/))
                const textures = (ctx => {
                    let keys = ctx.keys();

                    return keys.map((file, i) => {
                        const fileName = keys[i].split("/")[keys[i].split("/").length - 1].split(".")[0],
                        source = `data/img/texture/${keys[i].split("/")[1]}`
                        return {
                            name: fileName,
                            type: 'json',//getType(keys[i].split("/")[keys[i].split("/").length - 1].split(".")[1]),
                            src: source
                        }
                    });
                })(require.context('../../public/data/img/texture', true, /.*/));
                const allFiles = audioFiles.concat(images,textures);
                me.loader.preload([
                    {
                        name: 'PressStart2P',
                        type: 'binary',
                        src: `data/fnt/PressStart2P.fnt`
                    },
                    {
                        name: 'PressStart2P',
                        type: 'image',
                        src: `data/fnt/PressStart2P.png`
                    },
                    {
                        name: 'area01',
                        type: 'tmx',
                        src: `data/map/area01.tmx`
                    },
                    {
                        name: 'area02',
                        type: 'tmx',
                        src: `data/map/area02.tmx`
                    },
                    {
                        name: 'loading_screen',
                        type: 'tmx',
                        src: `data/map/loading_screen.tmx`
                    },
                    {
                        name: 'title_screen',
                        type: 'tmx',
                        src: `data/map/title_screen.tmx`
                    },
                    {
                        name: 'area03',
                        type: 'tmx',
                        src: `data/map/area03.tmx`
                    },
                    {
                        name: 'area04',
                        type: 'tmx',
                        src: `data/map/area04.tmx`
                    },
                    {
                        name: 'main_tileset',
                        type: 'tsx',
                        src: `data/map/main_tileset.tsx`
                    },
                ])
                me.loader.preload(allFiles.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i), loaded);
            },
        }
        const loaded = () => {
            setTimeout(() => {
                window.startTimer()
            }, 400)
            const tximage = me.loader.getImage("texture")
            const loadTextImage = me.loader.getImage("load_text")
            const loadJimImage = me.loader.getImage("load_jim")
            const loadBradImage = me.loader.getImage("load_brad")
            game.texture = new me.video.renderer.Texture(
                frames,
                tximage
            );
            game.loadTextTexture = new me.video.renderer.Texture(
                loadTextFrames,
                loadTextImage
            );
            game.loadJimTexture = new me.video.renderer.Texture(
                loadJimFrames,
                loadJimImage
            );
            game.loadBradTexture = new me.video.renderer.Texture(
                loadBradFrames,
                loadBradImage
            );
            // set the "Play/Ingame" Screen Object
            me.state.set(me.state.PLAY, new game.PlayScreen());
            me.state.set(me.state.TITLE, new game.TitleScreen());

            // register our player entity in the object pool
            me.pool.register("mainPlayer", game.PlayerEntity);
            me.pool.register("cubeProjectile", game.CubeProjectile);
            me.pool.register("cassetteProjectile", game.CassetteProjectile);
            me.pool.register("bomb", game.BombEntity);
            me.pool.register("vanishingTile", game.VanishingTileEntity);
            me.pool.register("spikes", game.SpikesEntity);
            me.pool.register("pacMan", game.PacManEntity);
            me.pool.register("simon", game.SimonEntity);
            me.pool.register("slimer", game.SlimerContainer);
            me.pool.register("slimerEntity", game.SlimerEntity);
            me.pool.register("carl", game.CarlEntity);
            me.pool.register("eyeball", game.EyeballEntity);
            me.pool.register("gremlin", game.GremlinEntity);
            me.pool.register("skeletor", game.SkeletorEntity);
            me.pool.register("warpEntity", game.WarpEntity);
            me.pool.register("boostEntity", game.BoostEntity);
            me.pool.register("boostTile", game.BoostTile, true);

            // // title screen sprites
            me.pool.register("jim_start_sprite", game.JimStartSprite);
            me.pool.register("brad_start_sprite", game.BradStartSprite);
            me.pool.register("start_text_sprite", game.StartTextSprite);
            me.pool.register("al_logo", game.ALLogo);
            me.pool.register("backgrounds", game.Backgrounds);
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

        };
        window.game = game
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