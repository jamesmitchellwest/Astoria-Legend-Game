import frames from '../resources/texture.json'
import loadTextFrames from '../resources/load_text.json'
import loadJimFrames from '../resources/load_jim.json'
import loadBradFrames from '../resources/load_brad.json'
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
                        name: 'astoria01',
                        type: 'tmx',
                        src: `data/map/astoria01.tmx`
                    },
                    {
                        name: 'main_tileset',
                        type: 'tsx',
                        src: `data/map/main_tileset.tsx`
                    },
                ])
                me.loader.preload(allFiles.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i), loaded, false);


            },

            /**
             *  action to perform when leaving this screen (state change)
             */
            onDestroyEvent: function () {
                ; // TODO
            }


        });
        const loaded = () => {
            setTimeout(() => {
                window.startTimer()
            }, 400)
            const tximage = me.loader.getImage("texture")
            const loadJimImage = me.loader.getImage("load_jim")
            const loadBradImage = me.loader.getImage("load_brad")
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

            // register our player entity in the object pool
            me.pool.register("mainPlayer", game.PlayerEntity);
            me.pool.register("cubeProjectile", game.CubeProjectile, true);
            me.pool.register("cassetteProjectile", game.CassetteProjectile, true);
            me.pool.register("bomb", game.BombEntity, true);
            me.pool.register("hoverboard", game.HoverboardEntity);
            me.pool.register("vanishingTile", game.VanishingTileEntity, true);
            me.pool.register("spikes", game.SpikesEntity, true);
            me.pool.register("pacMan", game.PacManEntity, true);
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

            // title screen sprites
            me.pool.register("jim_start_sprite", game.JimStartSprite);
            me.pool.register("brad_start_sprite", game.BradStartSprite);
            me.pool.register("al_logo", game.ALLogo);
            me.pool.register("backgrounds", game.Backgrounds);
        };
    }
    const extendedGame = await getLoadScreen()

    return extendedGame
}
export default loadMixin