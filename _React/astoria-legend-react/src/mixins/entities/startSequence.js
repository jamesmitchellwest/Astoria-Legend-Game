const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.StartContainer = me.Container.extend({

            init: function () {
                // call the constructor
                this._super(me.Container, "init", [
                    me.game.viewport.width / 2, 250, me.game.viewport.width, me.game.viewport.height
                ]);

                // persistent across level change
                this.isPersistent = true;

                // Use screen coordinates
                this.floating = true;

                // make sure our object is always draw first
                // if (!me.state.isPaused && me.input.isKeypressed("pause")) {
                //     me.state.isPaused()


                // give a name
                this.name = "START_SEQUENCE";

                this.addChild(new game.StartContainer.start(this.pos.x = me.game.viewport.width / 2, this.pos.y = me.game.viewport.height / 2,));

                //////// letters ////////
                this.addChild(new game.StartContainer.three(this.pos.x = me.game.viewport.width / 2, this.pos.y = me.game.viewport.height / 2,));
                this.addChild(new game.StartContainer.two(this.pos.x = me.game.viewport.width / 2, this.pos.y = me.game.viewport.height / 2,));
                this.addChild(new game.StartContainer.one(this.pos.x = me.game.viewport.width / 2, this.pos.y = me.game.viewport.height / 2,));
                this.addChild(new game.StartContainer.go(this.pos.x = me.game.viewport.width / 2, this.pos.y = me.game.viewport.height / 2,));
            },



        });
        game.StartContainer.start = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.loadTextTexture,
                    region: "start_text_sprite-1",
                }]);
                // this.onClick();
            },
            onClick: function () {
                me.audio.play("teleport", false, null, 0.1)
                const _this = this;
                const up = new me.Tween(this.pos).to({ y: this.pos.y + 301 }, 1000)
                const disappear = new me.Tween(this).to({ alpha: 0 }, 700)
                    .onComplete(() => {
                        _this.ancestor.getNextChild(_this).setOpacity(1);
                        me.audio.play("countdown", false, null, 0.4)
                        me.audio.play("3", false, null, 0.15)
                    });

                up.easing(me.Tween.Easing.Back.In);
                up.easing(me.Tween.Easing.Quadratic.Out);
                disappear.easing(me.Tween.Easing.Linear.None);
                up.start();
                disappear.start();

            },
            update: function () {
                if (this.getOpacity() && me.input.isKeyPressed('enter')) {
                    this.onClick();
                }


                return true;
            }
        });
        game.StartContainer.three = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y,) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.startSequenceTexture,
                    region: "3",
                }]);
                this.timeout = false
                this.setOpacity(0)
            },
            Count: function () {
                const _this = this;
                const down = new me.Tween(this.pos).to({ y: this.pos.y + 500 }, 1000)
                const disappear = new me.Tween(this).to({ alpha: 0 }, 700)
                    .onComplete(() => {
                        _this.ancestor.getNextChild(_this).setOpacity(1);
                        game.startBooth.startAnimation()
                        me.audio.play("phonebooth_landing", false, null, 0.7)
                        me.audio.play("countdown", false, null, 0.4)
                        me.audio.play("2", false, null, 0.2)
                    });

                down.easing(me.Tween.Easing.Quadratic.In);
                disappear.easing(me.Tween.Easing.Linear.None);
                down.start();
                disappear.start();

            },
            update: function () {
                if (this.getOpacity() && !this.timeout) {
                    this.timeout = true
                    setTimeout(() => {
                        this.Count();
                        
                    }, 500);
                }
                return true;
            }
        });
        game.StartContainer.two = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y,) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.startSequenceTexture,
                    region: "2",
                }]);
                this.timeout = false;
                this.setOpacity(0)
            },
            Count: function () {
                const _this = this;
                const down = new me.Tween(this.pos).to({ y: this.pos.y + 500 }, 1000)
                const disappear = new me.Tween(this).to({ alpha: 0 }, 700)
                    .onComplete(() => {
                        _this.ancestor.getNextChild(_this).setOpacity(1);
                        me.audio.play("countdown", false, null, 0.4)
                        me.audio.play("1", false, null, 0.25)
                    });

                down.easing(me.Tween.Easing.Quadratic.In);
                disappear.easing(me.Tween.Easing.Linear.None);
                down.start();
                disappear.start();

            },
            update: function () {
                if (this.getOpacity() && !this.timeout) {
                    this.timeout = true
                    setTimeout(() => {
                        this.Count();
                    }, 500);
                }
                return true;
            }
        });
        game.StartContainer.one = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y,) {
                this.startY = y;
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.startSequenceTexture,
                    region: "1",
                }]);
                this.timeout = false;
                this.setOpacity(0)
            },
            Count: function () {
                const _this = this;
                const down = new me.Tween(this.pos).to({ y: this.pos.y + 500 }, 1000)
                const disappear = new me.Tween(this).to({ alpha: 0 }, 700)
                    .onComplete(() => {
                        _this.ancestor.getNextChild(_this).setOpacity(1);
                        me.audio.play("go", false, null, 0.3)
                        me.audio.play("go_voice", false, null, 0.4)
                        if (me.game.world.hasStart && me.game.world.hasFinish) {
                            game.mainPlayer.timerActive = true
                        }
                    });

                down.easing(me.Tween.Easing.Quadratic.In);
                disappear.easing(me.Tween.Easing.Linear.None);
                down.start();
                disappear.start();

            },
            update: function () {
                if (this.getOpacity() && !this.timeout) {
                    this.timeout = true
                    setTimeout(() => {
                        this.Count();
                    }, 500);
                }
                return true;
            }
        });
        game.StartContainer.go = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y,) {
                this.startY = y;
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.startSequenceTexture,
                    region: "go",
                }]);
                this.timeout = false;
                this.setOpacity(0)
            },
            Count: function () {

                const disappear = new me.Tween(this).to({ alpha: 0 }, 1200)
                    .onComplete(() => {
                        me.game.world.removeChild(this.ancestor)
                    });
                disappear.easing(me.Tween.Easing.Linear.None);

                disappear.start();

            },
            update: function () {
                if (this.getOpacity() && !this.timeout) {
                    this.timeout = true
                    setTimeout(() => {
                        this.Count();
                    }, 500);
                }

                return true;
            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin