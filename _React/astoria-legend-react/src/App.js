
import './App.css';
import gameMixin from './mixins/game'
import playMixin from './mixins/play'
import cubeProjectileMixin from './mixins/entities/cubeProjectile'
import boostEntityMixin from './mixins/entities/boostEntity'
import boostTileMixin from './mixins/entities/boostTile'
import carlMixin from './mixins/entities/carl'
import eyeballMixin from './mixins/entities/eyeball'
import cassetteProjectileMixin from './mixins/entities/cassetteProjectile'
import gremlinMixin from './mixins/entities/gremlin'
import HUDMixin from './mixins/entities/HUD'
import pacManMixin from './mixins/entities/pacMan'
import playerMixin from './mixins/entities/player'
import skeletorMixin from './mixins/entities/skeletor'
import simonMixin from './mixins/entities/simon'
import warpEntityMixin from './mixins/entities/warpEntity'
import slimerMixin from './mixins/entities/slimer'
import logoMixin from './mixins/sprites/al_logo'
import bradMixin from './mixins/sprites/brad_start_sprite'
import jimMixin from './mixins/sprites/jim_start_sprite'
import loadingMixin from './mixins/sprites/loading_sprite'
import startTextMixin from './mixins/sprites/start_text_sprite'
import { useEffect } from 'react';

function App() {
  let me = window.me
  useEffect(async () => {
    const game = await gameMixin(me)
    await playMixin(me, game)
    await playerMixin(me, game)
    await cubeProjectileMixin(me, game)
    await boostEntityMixin(me, game)
    await boostTileMixin(me, game)
    await carlMixin(me, game)
    await eyeballMixin(me, game)
    await cassetteProjectileMixin(me, game)
    await gremlinMixin(me, game)
    await HUDMixin(me, game)
    await pacManMixin(me, game)
    await skeletorMixin(me, game)
    await simonMixin(me, game)
    await warpEntityMixin(me, game)
    await slimerMixin(me, game)

    await logoMixin(me, game)
    await bradMixin(me, game)
    await jimMixin(me, game)
    await loadingMixin(me, game)
    await startTextMixin(me, game)

    if (game.onload) {
      window.me.device.onReady(() => {
        game.onload();
      });
    }
  }, [me])
  return (
    <div id="screen">
    </div>
  );
}

export default App;
