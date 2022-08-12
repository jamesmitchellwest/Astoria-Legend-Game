import nipplejs from 'nipplejs';

const mainPlayerMixin = async (me, game) => {
    const getMainPlayer = async () => {

        // game.HUD.Button = me.GUI_Object.extend({
        //     /**
        //      * constructor
        //      */
        //     init: function (x, y) {
        //         this._super(me.GUI_Object, "init", [x, y, {
        //             image: game.texture,
        //             region: "shadedDark36"
        //         }]);
        //         this.setOpacity(0.5);
        //         this.anchorPoint.set(0, 0);
        //     },

        //     /**
        //      * function called when the object is clicked on
        //      */
        //     onClick: function (event) {
        //         this.setOpacity(0.75);
        //         me.input.triggerKeyEvent(me.input.KEY.UP, true);
        //         return false;
        //     },

        //     /**
        //      * function called when the object is clicked on
        //      */
        //     onRelease: function (event) {
        //         this.setOpacity(0.5);
        //         me.input.triggerKeyEvent(me.input.KEY.UP, false);
        //         return false;
        //     }
        // });

        game.loadControls = () => {
            // CREATE X JOYSTICK
            const joystickL = nipplejs.create({
                zone: document.getElementById('x_joystick'),
                mode: 'dynamic',
                position: { left: '25%', top: '75%' },
                color: 'white',
                size: 100,
                lockX: true,
                displayBeforeTouch: true,
                catchDistance: 0,
                dynamicPage: true
            });
            // CREATE Y JOYSTICK
            const joystickR = nipplejs.create({
                zone: document.getElementById('y_joystick'),
                mode: 'dynamic',
                position: { left: '75%', top: '75%' },
                color: 'white',
                size: 100,
                lockY: true,
                displayBeforeTouch: true,
                catchDistance: 0,
                dynamicPage: true
    
            });
            // HANDLE X JOYSTICK
            joystickL.on('dir:left plain:left', function (evt, data) {
                if (data.direction) {
                    me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
                    me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
                }
            })
                .on('dir:right plain:right', function (evt, data) {
                    if (data.direction) {
                        me.input.triggerKeyEvent(me.input.KEY.RIGHT, true);
                        me.input.triggerKeyEvent(me.input.KEY.LEFT, false);
                    }
                })
                .on('end', function (evt, data) {
                    me.input.triggerKeyEvent(me.input.KEY.LEFT, false);
                    me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
                });
            // HANDLE Y JOYSTICK
            joystickR.on('dir:up plain:up', function (evt, data) {
                if (data.direction) {
                    me.input.triggerKeyEvent(me.input.KEY.UP, true);
                    me.input.triggerKeyEvent(me.input.KEY.DOWN, false);
                }
            })
                .on('dir:down plain:down', function (evt, data) {
                    if (data.direction) {
                        me.input.triggerKeyEvent(me.input.KEY.DOWN, true);
                        me.input.triggerKeyEvent(me.input.KEY.UP, false);
                    }
                })
                .on('end', function (evt, data) {
                    me.input.triggerKeyEvent(me.input.KEY.UP, false);
                    me.input.triggerKeyEvent(me.input.KEY.DOWN, false);
                });
        }
    }
    const extendedGame = await getMainPlayer()

    return extendedGame
}
export default mainPlayerMixin