import './App.css';
import { useState } from 'react'
import gameMixin from './mixins/game'
import loadMixin from './mixins/load'
import titleMixin from './mixins/title'
import playMixin from './mixins/play'
import bombMixin from './mixins/entities/bomb'
import hoverboardMixin from './mixins/entities/hoverboard'
import vanishingTileMixin from './mixins/entities/vanishingTile'
import spikesMixin from './mixins/entities/spikes'
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
import backgroundsMixin from './mixins/sprites/backgrounds'
import bradMixin from './mixins/sprites/brad_start_sprite'
import jimMixin from './mixins/sprites/jim_start_sprite'
import loadingMixin from './mixins/sprites/loading_sprite'
import startTextMixin from './mixins/sprites/start_text_sprite'
import { useEffect } from 'react';

function App() {
  let me = window.me
  const [debugVal, setDebugVal] = useState()
  window.setDebugVal = setDebugVal
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  useEffect(() => {
    let interval = null;
    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);
  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };
  window.startTimer = startTimer
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };
  useEffect(async () => {
    const game = await gameMixin(me)
    await loadMixin(me, game)
    await titleMixin(me, game)
    await playMixin(me, game)
    await playerMixin(me, game)
    await bombMixin(me, game)
    await hoverboardMixin(me, game)
    await vanishingTileMixin(me, game)
    await spikesMixin(me, game)
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
    await backgroundsMixin(me, game)
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
  const isDebug = window.location.hash.includes('debug')
  return (<>
    {isDebug && <div id="debugPanel" style={{
      color: 'white',
      position: 'absolute',
      width: '40%',
      overflow: 'scroll',
      height: '52%'
    }}>{debugVal}</div>
    }
    <div
      style={{
        position: 'absolute',
        right: 200, top: 10,
        color:'white'
      }}>
      <h1>
        <span className="digits">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
      </span>
        <span className="digits">
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
      </span>
        <span className="digits mili-sec">
          {("0" + ((time / 10) % 100)).slice(-2)}
        </span>
      </h1>
    </div>
  </>);
}

export default App;
