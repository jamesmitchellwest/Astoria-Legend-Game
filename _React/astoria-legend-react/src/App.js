import './App.css';
import { useState } from 'react'
import Modal from './components/modal';
import useModal from "./hooks/useModal";
import PrModal from './components/prModal';
import usePrModal from "./hooks/usePrModal";
import gameMixin from './mixins/game'
import loadMixin from './mixins/load'
import titleMixin from './mixins/title'
import playMixin from './mixins/play'
import bombMixin from './mixins/entities/bomb'
import trainMixin from './mixins/backgrounds/train'
import jetPackMixin from './mixins/entities/jetPack'
import protonParticleSystemMixin from './mixins/entities/protonParticleSystem'
import hoverboardMixin from './mixins/entities/hoverboard'
import vanishingTileMixin from './mixins/entities/vanishingTile'
import magicTileMixin from './mixins/entities/magicTile'
import brickTileMixin from './mixins/entities/brickTile'
import chanceTileMixin from './mixins/entities/chanceTile'
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
import pauseMenuMixin from './mixins/entities/pauseMenu'
import startSequenceMixin from './mixins/entities/startSequence'
import logoMixin from './mixins/sprites/al_logo'
import backgroundsMixin from './mixins/sprites/backgrounds'
import bradMixin from './mixins/sprites/brad_start_sprite'
import jimMixin from './mixins/sprites/jim_start_sprite'
import loadingMixin from './mixins/sprites/loading_sprite'
import startTextMixin from './mixins/sprites/start_text_sprite'
import controlsMixin from './mixins/entities/controls'
import { useEffect } from 'react';

function App() {
  let me = window.me
  // const [debugVal, setDebugVal] = useState()
  // window.setDebugVal = setDebugVal

  const {area, myScore, isVisible, toggleModal, getScores, setScores } = useModal();
  const {prModalIsVisible, togglePrModal,getPrScores} = usePrModal()
  useEffect(async () => {
    const game = await gameMixin(me)
    await loadMixin(me, game)
    await titleMixin(me, game)
    await playMixin(me, game)
    await playerMixin(me, game, isVisible)
    await bombMixin(me, game)
    await trainMixin(me, game)
    await jetPackMixin(me, game)
    await protonParticleSystemMixin(me, game)
    await hoverboardMixin(me, game)
    await vanishingTileMixin(me, game)
    await magicTileMixin(me, game)
    await brickTileMixin(me, game)
    await chanceTileMixin(me, game)
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
    await warpEntityMixin(me, game, toggleModal, getPrScores)
    await slimerMixin(me, game)
    await pauseMenuMixin(me, game)
    await startSequenceMixin(me, game)

    await logoMixin(me, game)
    await backgroundsMixin(me, game)
    await bradMixin(me, game)
    await jimMixin(me, game)
    await loadingMixin(me, game)
    await startTextMixin(me, game)
    await controlsMixin(me, game)

    if (game.onload) {
      window.me.device.onReady(() => {
        game.onload();
      });
    }
  }, [me])
  // const isDebug = window.location.hash.includes('debug')
  return (<>
  
    <div style={{position: 'absolute', zIndex: '3'}} onClick={togglePrModal}>
      <img src="/data/img/menu_icon.png" />
    </div>
    <div id="overlay"></div>
    <PrModal prModalIsVisible={prModalIsVisible} getPrScores={getPrScores} hideModal={togglePrModal} />

    <Modal area={area} myScore={myScore} isVisible={isVisible} getScores={getScores} setScores={setScores}  hideModal={toggleModal} />
  </>);
}

export default App;
