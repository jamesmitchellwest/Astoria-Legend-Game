import frames from '../resources/texture.json'
import loadTextFrames from '../resources/load_text.json'
import loadJimFrames from '../resources/load_jim.json'
import loadBradFrames from '../resources/load_brad.json'
import pauseFrames from '../resources/pause_menu.json'
import startSequenceFrames from '../resources/start_sequence.json'
import powerUpFrames from '../resources/power_ups.json'
const loadMixin = async (me, game) => {
    const getLoadScreen = async () => {
        game.LoadScreen = me.Stage.extend({
            /**
             *  action to perform on state change
             */
            onResetEvent: function () {
                // load a level
                me.levelDirector.loadLevel("loading_screen");



                // set and load all resources.
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
                const allFiles = audioFiles.concat(images, textures);
                const levelsEtc = [
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
                        name: 'Home',
                        type: 'tmx',
                        src: `data/map/Home.tmx`
                    },
                    {
                        name: 'River City',
                        type: 'tmx',
                        src: `data/map/River City.tmx`
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
                        name: 'City Skyline',
                        type: 'tmx',
                        src: `data/map/City Skyline.tmx`
                    },
                    {
                        name: 'Sunset Tsunami',
                        type: 'tmx',
                        src: `data/map/Sunset Tsunami.tmx`
                    },
                    {
                        name: 'Neon Jungle',
                        type: 'tmx',
                        src: `data/map/Neon Jungle.tmx`
                    },
                    {
                        name: 'Elevate',
                        type: 'tmx',
                        src: `data/map/Elevate.tmx`
                    },
                    {
                        name: 'long_one',
                        type: 'tmx',
                        src: `data/map/long_one.tmx`
                    },
                    {
                        name: 'main_tileset',
                        type: 'tsx',
                        src: `data/map/main_tileset.tsx`
                    },
                    {
                        name: 'Moon',
                        type: 'tmx',
                        src: `data/map/Moon.tmx`
                    },
                    {
                        name: 'Special',
                        type: 'tmx',
                        src: `data/map/Special.tmx`
                    },
                    {
                        name: 'area02',
                        type: 'tmx',
                        src: `data/map/area02.tmx`
                    },
                ]
                me.loader.preload(levelsEtc)
                me.loader.preload(allFiles.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i), loaded);

                //init local storage
                const localStorageDefaults = game.data.levels.reduce((k, v) => (k[v] = 0, k), {});
                me.save.add(localStorageDefaults)

            },

            /**
             *  action to perform when leaving this screen (state change)
             */
            onDestroyEvent: function () {
                ; // TODO
            }


        });
        const loaded = () => {
            const tximage = me.loader.getImage("texture")
            const loadJimImage = me.loader.getImage("load_jim")
            const loadBradImage = me.loader.getImage("load_brad")
            const pauseMenu = me.loader.getImage("pause_menu")
            const startSequenceTexture = me.loader.getImage("start_sequence")
            const powerUpTexture = me.loader.getImage("power_ups")

            game.texture = new me.video.renderer.Texture(
                frames,
                tximage
            );

            game.loadJimTexture = new me.video.renderer.Texture(
                loadJimFrames,
                loadJimImage
            );
            game.loadBradTexture = new me.video.renderer.Texture(
                loadBradFrames,
                loadBradImage
            );
            game.pauseTexture = new me.video.renderer.Texture(
                pauseFrames,
                pauseMenu
            );
            game.startSequenceTexture = new me.video.renderer.Texture(
                startSequenceFrames,
                startSequenceTexture
            );
            game.powerUpTexture = new me.video.renderer.Texture(
                powerUpFrames,
                powerUpTexture
            );

            // register our player entity in the object pool
            me.pool.register("mainPlayer", game.PlayerEntity);
            me.pool.register("playerShadow", game.ShadowSprite, true);
            me.pool.register("cubeProjectile", game.CubeProjectile, true);
            me.pool.register("cassetteProjectile", game.CassetteProjectile, true);
            me.pool.register("bomb", game.BombEntity, true);
            me.pool.register("train", game.TrainBackground);
            me.pool.register("protonParticleSystem", game.ProtonParticleSystem);
            me.pool.register("hoverboard", game.HoverboardEntity);
            me.pool.register("vanishingTile", game.VanishingTileEntity, true);
            me.pool.register("magicTile", game.MagicTileEntity);
            me.pool.register("brickTile", game.BrickTileEntity, true);
            me.pool.register("chanceTile", game.ChanceTileEntity, true);
            me.pool.register("spikes", game.SpikesEntity, true);
            me.pool.register("pacMan", game.PacManEntity, true);
            me.pool.register("simon", game.SimonEntity);
            me.pool.register("slimer", game.SlimerContainer);
            me.pool.register("pauseMenu", game.PauseContainer);
            me.pool.register("startSequence", game.StartContainer);
            me.pool.register("slimerEntity", game.SlimerEntity);
            me.pool.register("carl", game.CarlEntity);
            me.pool.register("eyeball", game.EyeballEntity);
            me.pool.register("gremlin", game.GremlinEntity);
            me.pool.register("skeletor", game.SkeletorEntity);
            me.pool.register("warpEntity", game.WarpEntity);
            me.pool.register("boostEntity", game.BoostEntity);
            me.pool.register("jetPack", game.JetPackSprite);
            me.pool.register("boostTile", game.BoostTile, true);

            // title screen sprites
            me.pool.register("jim_start_sprite", game.JimStartSprite);
            me.pool.register("brad_start_sprite", game.BradStartSprite);
            me.pool.register("al_logo", game.ALLogo);
            me.pool.register("backgrounds", game.Backgrounds);

            

            // me.state.change(me.state.PLAY)
        };
    }
    const extendedGame = await getLoadScreen()

    return extendedGame
}
export default loadMixin
