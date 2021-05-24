 
let allFiles = []
const audioFiles = (ctx => {
    let keys = ctx.keys();
    return keys.map((file, i) => {

        return {
            name: keys[i].split("/")[keys[i].split("/").length - 1].split(".")[0],
            type: 'audio',//getType(keys[i].split("/")[keys[i].split("/").length - 1].split(".")[1]),
            src: `data/audio/`
        }
    });
    // debugger
})(require.context('../../public/data/audio', true, /.*/))

// debugger
allFiles = audioFiles.concat(
    (ctx => {
        let keys = ctx.keys();
        return keys.map((file, i) => {

            return {
                name: keys[i].split("/")[keys[i].split("/").length - 1].split(".")[0],
                type: 'image',//getType(keys[i].split("/")[keys[i].split("/").length - 1].split(".")[1]),
                src: `data/img/${keys[0].split("/")[1]}`
            }
        });
        // debugger
    })(require.context('../../public/data/img', true, /.*/)))

// debugger
export default [
    {
        "name": "surrender_fadein",
        "type": "audio",
        "src": "data/bgm/"
    },
    {
        "name": "surrender_intro",
        "type": "audio",
        "src": "data/bgm/"
    },
    {
        "name": "surrender",
        "type": "audio",
        "src": "data/bgm/"
    },
    {
        "name": "block_explosion",
        "type": "audio",
        "src": "data/sfx/"
    },
    {
        "name": "cassett_toss",
        "type": "audio",
        "src": "data/sfx/"
    },
    {
        "name": "cool_bloop",
        "type": "audio",
        "src": "data/sfx/"
    },
    {
        "name": "doyoyoying",
        "type": "audio",
        "src": "data/sfx/"
    },
    {
        "name": "fart_squish",
        "type": "audio",
        "src": "data/sfx/"
    },
    {
        "name": "phonebooth",
        "type": "audio",
        "src": "data/sfx/"
    },
    {
        "name": "shadedDark01",
        "type": "image",
        "src": "data/img/assets/UI/shadedDark01.png"
    },
    {
        "name": "shadedDark07",
        "type": "image",
        "src": "data/img/assets/UI/shadedDark07.png"
    },
    {
        "name": "shadedDark13",
        "type": "image",
        "src": "data/img/assets/UI/shadedDark13.png"
    },
    {
        "name": "shadedDark15",
        "type": "image",
        "src": "data/img/assets/UI/shadedDark15.png"
    },
    {
        "name": "shadedDark30",
        "type": "image",
        "src": "data/img/assets/UI/shadedDark30.png"
    },
    {
        "name": "shadedDark36",
        "type": "image",
        "src": "data/img/assets/UI/shadedDark36.png"
    },
    {
        "name": "background",
        "type": "image",
        "src": "data/img/background.png"
    },
    {
        "name": "BOOST_DOWN_DARK",
        "type": "image",
        "src": "data/img/BOOST_DOWN_DARK.png"
    },
    {
        "name": "BOOST_DOWN",
        "type": "image",
        "src": "data/img/BOOST_DOWN.png"
    },
    {
        "name": "BOOST_LEFT_DARK",
        "type": "image",
        "src": "data/img/BOOST_LEFT_DARK.png"
    },
    {
        "name": "BOOST_LEFT",
        "type": "image",
        "src": "data/img/BOOST_LEFT.png"
    },
    {
        "name": "BOOST_RIGHT_DARK",
        "type": "image",
        "src": "data/img/BOOST_RIGHT_DARK.png"
    },
    {
        "name": "BOOST_RIGHT",
        "type": "image",
        "src": "data/img/BOOST_RIGHT.png"
    },
    {
        "name": "BOOST_UP_DARK",
        "type": "image",
        "src": "data/img/BOOST_UP_DARK.png"
    },
    {
        "name": "BOOST_UP",
        "type": "image",
        "src": "data/img/BOOST_UP.png"
    },
    {
        "name": "clouds",
        "type": "image",
        "src": "data/img/clouds.png"
    },
    {
        "name": "PressStart2P",
        "type": "image",
        "src": "data/img/fnt/PressStart2P.png"
    },
    {
        "name": "brad_start_sprite",
        "type": "image",
        "src": "data/img/gui/brad_start_sprite.png"
    },
    {
        "name": "jim_sprite",
        "type": "image",
        "src": "data/img/gui/jim_sprite.png"
    },
    {
        "name": "load_bg",
        "type": "image",
        "src": "data/img/gui/load_bg.png"
    },
    {
        "name": "short_trees",
        "type": "image",
        "src": "data/img/gui/short_trees.png"
    },
    {
        "name": "start_text_sprite",
        "type": "image",
        "src": "data/img/gui/start_text_sprite.png"
    },
    {
        "name": "tall_trees",
        "type": "image",
        "src": "data/img/gui/tall_trees.png"
    },
    {
        "name": "title_screen",
        "type": "image",
        "src": "data/img/gui/title_screen.png"
    },
    {
        "name": "area_01_tielset",
        "type": "image",
        "src": "data/img/map/area_01_tielset.png"
    },
    {
        "name": "Neon-City-With-Overlays_0000_FG",
        "type": "image",
        "src": "data/img/Neon-City-With-Overlays_0000_FG.png"
    },
    {
        "name": "Neon-City-With-Overlays_0002_MG",
        "type": "image",
        "src": "data/img/Neon-City-With-Overlays_0002_MG.png"
    },
    {
        "name": "Neon-City-With-Overlays_0003_BG",
        "type": "image",
        "src": "data/img/Neon-City-With-Overlays_0003_BG.png"
    },
    {
        "name": "al_logo",
        "type": "image",
        "src": "data/img/sprite/al_logo.png"
    },
    {
        "name": "carl",
        "type": "image",
        "src": "data/img/sprite/carl.png"
    },
    {
        "name": "cassette",
        "type": "image",
        "src": "data/img/sprite/cassette.png"
    },
    {
        "name": "cube",
        "type": "image",
        "src": "data/img/sprite/cube.png"
    },
    {
        "name": "gremlin",
        "type": "image",
        "src": "data/img/sprite/gremlin.png"
    },
    {
        "name": "gripe_run_right",
        "type": "image",
        "src": "data/img/sprite/gripe_run_right.png"
    },
    {
        "name": "jim_start_sprite",
        "type": "image",
        "src": "data/img/sprite/jim_start_sprite.png"
    },
    {
        "name": "loading_sprite",
        "type": "image",
        "src": "data/img/sprite/loading_sprite.png"
    },
    {
        "name": "phonebooth",
        "type": "image",
        "src": "data/img/sprite/phonebooth.png"
    },
    {
        "name": "protonbeam",
        "type": "image",
        "src": "data/img/sprite/protonbeam.png"
    },
    {
        "name": "simon",
        "type": "image",
        "src": "data/img/sprite/simon.png"
    },
    {
        "name": "slimer",
        "type": "image",
        "src": "data/img/sprite/slimer.png"
    },
    {
        "name": "spinning_coin_gold",
        "type": "image",
        "src": "data/img/sprite/spinning_coin_gold.png"
    },
    {
        "name": "wheelie_right",
        "type": "image",
        "src": "data/img/sprite/wheelie_right.png"
    },
    {
        "name": "texture",
        "type": "image",
        "src": "data/img/texture.png"
    },
    {
        "name": "PressStart2P",
        "type": "binary",
        "src": "data/img/fnt/PressStart2P.fnt"
    },
    {
        "name": "texture",
        "type": "json",
        "src": "data/img/texture.json"
    },
    {
        "name": "area01",
        "type": "tmx",
        "src": "data/map/area01.tmx"
    },
    {
        "name": "area02",
        "type": "tmx",
        "src": "data/map/area02.tmx"
    },
    {
        "name": "loading_screen",
        "type": "tmx",
        "src": "data/map/loading_screen.tmx"
    },
    {
        "name": "title_screen",
        "type": "tmx",
        "src": "data/map/title_screen.tmx"
    },
    {
        "name": "area_01_tileset",
        "type": "tsx",
        "src": "data/map/area_01_tileset.tsx"
    }
];