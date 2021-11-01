import { frames as animFrames } from '../../resources/texture.json'
const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.JetPackSprite = me.Sprite.extend({

            init: function (x, y) {
                const atlasData = game.getAtlasData(game.texture, 'jetpack');
                this._super(me.Sprite, "init", [game.mainPlayer.pos.x, game.mainPlayer.pos.y, {
                    image: game.texture,
                    atlas: atlasData.tpAtlas,
                    atlasIndices: atlasData.indices,
                }]);

                this.addAnimation("walk", [0, 1, 2, 1], 200);
                this.addAnimation("jump", [2]);
                this.addAnimation("fall", [1]);
                this.addAnimation("crouch", [3]);
                this.addAnimation("crawl", [3]);
                this.addAnimation("slideAttack", [4]);

                /////transparent frames////////
                this.addAnimation("idle", [0]);
                this.addAnimation("faceCamera", [0]);
                this.addAnimation("emote", [0]);

                this.anchorPoint.set(0.2, 0)
                this.alwaysUpdate = true;
                this.ignoreGravity = true;
                this.terminating = false;
                this.rotateVector = new me.Vector2d(this.pos.x, this.pos.y);
                this.explosionSpeed = 300;

                this.emitter = new me.ParticleEmitter(0, 0, {
                    name: "explosion",
                    ancestor: this,
                    image: me.loader.getImage("orangeParticle"),
                    totalParticles: 200,
                    angle: me.Math.degToRad(-90),
                    angleVariation: 1.8,
                    minLife: 800,
                    maxLife: 0,
                    speed: 0.27,
                    speedVariation: 0.5,
                    gravity: 0.1,
                    frequency: 5,
                    z: 11
                });
                this.emitter.container.width = me.game.world.width
                this.emitter.container.height = me.game.world.height
                this.emitter.container.updateChildBounds();

                me.game.world.addChild(this.emitter, 11);
            },
            terminate: function () {
                this.setOpacity(1)
                this.setCurrentAnimation("fall")
                this.destroyTween = new me.Tween(this.pos).to({ y: me.game.world.height }, (me.game.world.height - this.pos.y) * 2)
                this.destroyTween.easing(me.Tween.Easing.Quadratic.InOut);
                this.destroyTween.start();
                // setTimeout(() => {
                //     // this.destroyTween.stop();
                //     // me.game.world.addChild(new game.BombEntity, [this.pos.x, this.pos.y, {
                //     //     jetPackExplode: true,
                //     // }])
                //     me.game.world.removeChild(this);
                // }, 2000);
            },
            update: function (dt) {

                if (this.terminating) {
                    if (this.pos.y > me.game.viewport.y + me.game.viewport.height) {
                        this.destroyTween.stop();
                        me.game.world.removeChild(this);
                    } else {
                        this.rotateVector.set(this.height / 2, this.pos.y);
                        // this.rotateSpeed -= .01;
                        this.rotate(-0.15, this.rotateVector)
                    }
                    return true
                }

                let playerAnimation = game.mainPlayer.renderable.current.name;
                if (!this.isCurrentAnimation(playerAnimation)) {
                    this.setCurrentAnimation(playerAnimation)
                }
                if (this.isCurrentAnimation("idle") || this.isCurrentAnimation("faceCamera") || this.isCurrentAnimation == ("emote")) {
                    this.setOpacity(0);

                } else if (this.alpha == 0) {
                    this.setOpacity(1);
                }
                this.pos.x = game.mainPlayer.pos.x;
                this.pos.y = game.mainPlayer.pos.y;
                if (me.input.keyStatus('attack') && !this.emitter.stream) {
                    this.emitter.streamParticles();
                } else {
                    this.emitter.stopStream();
                }
                this.emitter.container.pos.y = this.pos.y + 110;

                if (game.mainPlayer.renderable.isFlippedX) {
                    this.flipX(true);
                    this.emitter.pos.x = this.pos.x + 43;
                } else {
                    this.flipX(false);
                    this.emitter.pos.x = this.pos.x + 16;
                }
                if (game.mainPlayer.jetFuel <= 0 && !this.terminating || game.mainPlayer.body.isWarping) {
                    this.terminate();
                    this.terminating = true;
                }
                return (this._super(me.Sprite, "update", [dt]));
            },
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin