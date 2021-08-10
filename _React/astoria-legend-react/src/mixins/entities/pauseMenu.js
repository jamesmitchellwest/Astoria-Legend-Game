const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {
        game.PauseContainer = me.Container.extend({

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
                this.name = "PAUSE_MENU";
                
                this.addChild(new game.PauseContainer.menu_bg(this.pos.x, this.pos.y,));

                //////// letters ////////
                this.addChild(new game.PauseContainer.p(this.pos.x - 116, this.pos.y - 104));
                this.addChild(new game.PauseContainer.a(this.pos.x - 58, this.pos.y - 104));
                this.addChild(new game.PauseContainer.u(this.pos.x, this.pos.y - 104));
                this.addChild(new game.PauseContainer.s(this.pos.x + 58, this.pos.y - 104));
                this.addChild(new game.PauseContainer.e(this.pos.x + 116, this.pos.y - 104));

                ////// buttons /////
                this.addChild(new game.PauseContainer.home(this.pos.x, this.pos.y + 21));
                this.addChild(new game.PauseContainer.restart(this.pos.x - 145, this.pos.y + 25));
                this.addChild(new game.PauseContainer.settings(this.pos.x + 145, this.pos.y + 25));
                this.addChild(new game.PauseContainer.resume(this.pos.x + 164, this.pos.y + 127));

                /////// container tween - not working? ////////
                this.pauseTween = new me.Tween(this.pos).to({ y: me.game.viewport.height / 2 }, 800)
                this.pauseTween.easing(me.Tween.Easing.Cubic.InOut);
                this.pauseTween.start();


            },

            update: function () {

                return true;
            },

        });
        game.PauseContainer.menu_bg = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "menu_bg",

                }]);
            },
        });
        game.PauseContainer.p = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y,) {
                this.startY = y;
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "p",
                }]);

                this.tween();
            },
            tween: function () {
                const down = new me.Tween(this.pos).to({ y: this.startY }, 500)
                    .onComplete(() => {
                        setTimeout(() => {
                            up.start();
                        }, 3000);

                    })
                down.easing(me.Tween.Easing.Quadratic.In);
                down.easing(me.Tween.Easing.Bounce.Out);
                const _this = this;
                const up = new me.Tween(this.pos).to({ y: this.pos.y - 15 }, 100)
                    .onComplete(() => {
                        _this.ancestor.getNextChild(_this).tween();
                        down.start();
                    });

                up.easing(me.Tween.Easing.Back.In);
                up.easing(me.Tween.Easing.Quadratic.Out);
                up.start();
            },
            update: function () {

                return true;
            }
        });
        game.PauseContainer.a = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this.startY = y;
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "a",
                }]);

            },
            tween: function () {
                const down = new me.Tween(this.pos).to({ y: this.startY }, 500)
                down.easing(me.Tween.Easing.Quadratic.In);
                down.easing(me.Tween.Easing.Bounce.Out);
                const _this = this;
                const up = new me.Tween(this.pos).to({ y: this.pos.y - 15 }, 100)
                    .onComplete(() => {
                        _this.ancestor.getNextChild(_this).tween();
                        down.start();
                    });

                up.easing(me.Tween.Easing.Back.In);
                up.easing(me.Tween.Easing.Quadratic.Out);
                up.start();
            },
            update: function () {

                return true;
            }
        });
        game.PauseContainer.u = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this.startY = y;
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "u",
                }]);

            },
            tween: function () {
                const down = new me.Tween(this.pos).to({ y: this.startY }, 500)
                down.easing(me.Tween.Easing.Quadratic.In);
                down.easing(me.Tween.Easing.Bounce.Out);
                const _this = this;
                const up = new me.Tween(this.pos).to({ y: this.pos.y - 15 }, 100)
                    .onComplete(() => {
                        _this.ancestor.getNextChild(_this).tween();
                        down.start();
                    });

                up.easing(me.Tween.Easing.Back.In);
                up.easing(me.Tween.Easing.Quadratic.Out);
                up.start();
            },
            update: function () {

                return true;
            }
        });
        game.PauseContainer.s = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this.startY = y;
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "s",
                }]);

            },
            tween: function () {
                const down = new me.Tween(this.pos).to({ y: this.startY }, 500)
                down.easing(me.Tween.Easing.Quadratic.In);
                down.easing(me.Tween.Easing.Bounce.Out);
                const _this = this;
                const up = new me.Tween(this.pos).to({ y: this.pos.y - 15 }, 100)
                    .onComplete(() => {
                        _this.ancestor.getNextChild(_this).tween();
                        down.start();
                    });

                up.easing(me.Tween.Easing.Back.In);
                up.easing(me.Tween.Easing.Quadratic.Out);
                up.start();
            },
            update: function () {

                return true;
            }
        });
        game.PauseContainer.e = me.Sprite.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this.startY = y;
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "e",
                }]);

            },
            tween: function () {
                const down = new me.Tween(this.pos).to({ y: this.startY }, 500)
                down.easing(me.Tween.Easing.Quadratic.In);
                down.easing(me.Tween.Easing.Bounce.Out);
                const _this = this;
                const up = new me.Tween(this.pos).to({ y: this.pos.y - 15 }, 100)
                    .onComplete(() => {
                        down.start();
                    });

                up.easing(me.Tween.Easing.Back.In);
                up.easing(me.Tween.Easing.Quadratic.Out);
                up.start();
            },
        });
        game.PauseContainer.home = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "home",
                }]);


            },

            onOver: function () {
                this.flicker(500)
                return false;

            },

            onOut: function () {

                return false;

            },

            update: function () {

                return true;
            }
        });
        game.PauseContainer.restart = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "restart",
                }]);

            },
            onOver: function () {
                this.flicker(500)
                return false;

            },

            onOut: function () {

                return false;

            },

            update: function () {

                return true;
            }
        });
        game.PauseContainer.settings = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "settings",
                }]);
            },
            onOver: function () {
                this.flicker(500)
                return false;

            },

            onOut: function () {

                return false;

            },

            update: function () {

                return true;
            }
        });
        game.PauseContainer.resume = me.GUI_Object.extend({
            /**
             * constructor
             */
            init: function (x, y) {
                this._super(me.GUI_Object, "init", [x, y, {
                    image: game.pauseTexture,
                    region: "resume",
                }]);
            },
            onOver: function () {
                this.flicker(500)
                return false;

            },

            onOut: function () {

                return false;

            },

            update: function () {

                return true;
            }
        });

    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin