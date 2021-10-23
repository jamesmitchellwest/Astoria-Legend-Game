// import { stringify } from 'flatted';
// const mainPlayerMixin = async (me, game) => {
//     const getMainPlayer = async () => {
//         game.BrickTileEntity = me.Entity.extend({
//             /**
//              * constructor
//              */
//             init: function (x, y, settings) {
//                 settings.image = game.br;
//                 settings.region = "chanceTile";
//                 // replace default rectangle with topLine

//                 this.topLine = new me.Line(0, 0, [
//                     new me.Vector2d(5, 0),
//                     new me.Vector2d(settings.width - 5, 0)
//                 ]);
//                 this.rightLine = new me.Line(0, 0, [
//                     new me.Vector2d(settings.width, 5),
//                     new me.Vector2d(settings.width, settings.height - 5)
//                 ]);
//                 this.bottomLine = new me.Line(0, 0, [
//                     new me.Vector2d(5, settings.height),
//                     new me.Vector2d(settings.width - 5, settings.height)
//                 ]);
//                 this.leftLine = new me.Line(0, 0, [
//                     new me.Vector2d(0, 5),
//                     new me.Vector2d(0, settings.height - 5)
//                 ]);

//                 this.startY = y;
//                 this.settings = settings;
//                 settings.shapes[0] = this.topLine

//                 this._super(me.Entity, 'init', [x, y,]);

//                 this.body.addShape(this.rightLine);
//                 this.body.addShape(this.bottomLine);
//                 this.body.addShape(this.leftLine);

//                 this.body.collisionType = me.collision.types.WORLD_SHAPE;
//                 if (settings.type == "special") {
//                     this.renderable.tint.setColor(200, 0, 0)
//                 }
//                 this.collected = false;

//             },
//             collision: function () {
//                 const downTween = new me.Tween(this.pos).to({ y: this.startY }, 1500)
//                 const upTween = new me.Tween(this.pos).to({ y: this.pos.y - 20 }, 100).onComplete(() => {
//                     downTween.start();
//                 });

//                 upTween.easing(me.Tween.Easing.Linear.None);
//                 downTween.easing(me.Tween.Easing.Elastic.Out);
//                 upTween.start();

//             },

//             update: function (dt) {

//                 // window.setDebugVal(`
//                 //     ${stringify(me.collision)}
//                 //  `)

//                 return (this._super(me.Entity, 'update', [dt]));
//             },
//             /**
//              * collision handling
//              */
//             onCollision: function (response, other) {

//                 if (other.name == "mainPlayer" && other.body.vel.y < 0 &&
//                     !other.powerUpItem && response.overlapV.x == 0 &&
//                     response.overlapV.y < 0 && !this.collected) {
//                     this.collected = true;
//                     this.collision();
//                     this.renderable.tint.setColor(150, 120, 200);
//                     game.HUD.PowerUpItem.roll();
//                     game.HUD.PowerUpItem.setOpacity(1);
//                 }
//                 return false;

//             }
//         });

//     }
//     const extendedGame = await getMainPlayer()

//     return extendedGame
// }
// export default mainPlayerMixin