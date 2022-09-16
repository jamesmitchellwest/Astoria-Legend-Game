import "../index.css"
const fullscreenPromptMixin = async (me, game) => {
    const getFullscreenPromptScreen = async () => {
        game.FullscreenPromptScreen = me.Stage.extend({
            /**
             *  action to perform on state change
             */
            onResetEvent: function () {
                me.game.viewport.fadeOut("#202020", 2000);
                const root = document.getElementById("root")
                //css
                const css = `
                @keyframes appear {
                    from { 
                        opacity: 0;
                    }
                }
                @keyframes fade {
                    from { 
                        opacity: 1;
                    }
                }
                #fs-prompt{
                    font-family: 'PressStart2P';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    z-index: 1;
                    font-size: 12px;
                    margin: auto;
                    transform: translateY(-50%) translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    opacity: 1;
                    animation: appear 3s;
                    animation-iteration-count: 1;
                }

                #fs-prompt > *{
                    display: inline-block;
                    white-space: nowrap;
                }
                #fs-prompt.hide {
                    opacity: 0;
                    animation: fade 2s;
                    animation-iteration-count: 1;
                }
                #fs-btn{
                    font-family: 'PIX_lite';
                    cursor: pointer;
                    letter-spacing: 3px;
                    background: #50ccf7;
                    outline: none;
                    border: none;
                    font-family: 'PIX_lite';
                    color: #fff;
                    font-size: 20px;
                    padding: 0px 15px 3px;
                    margin: 25px auto 0;
                }
                `
                const styleBlock = document.createElement('style')
                styleBlock.insertAdjacentHTML('afterbegin', css)
                //html
                this.fullscreenPromptRoot = document.createElement("div")
                this.fullscreenPromptRoot.setAttribute("id", "fs-prompt");
                root.appendChild(styleBlock)
                root.appendChild(this.fullscreenPromptRoot)
                this.fullscreenPromptRoot.insertAdjacentHTML(`afterbegin`,
                    `
                    <h2>Terms and Conditions:</h2><br>
                    <p>1: Be excellent to each other</p><br>
                    <p>2: Party on</p><br>
                    <button id="fs-btn">accept</button>
                    `);

                this.fullscreenPromptRoot.querySelector("button").addEventListener("click", () => this.clickEvent())

            },
            clickEvent: function () {
                this.fullscreenPromptRoot.classList.add("hide")
                setTimeout(() => {
                    if (!me.device.isFullscreen) {
                        me.device.requestFullscreen();
                    }
                    me.state.change(me.state.TITLE);
                }, 2000)
            },
            /**
             *  action to perform when leaving this screen (state change)
             */
            onDestroyEvent: function () {
                window.removeEventListener("click", this.clickEvent)
                this.fullscreenPromptRoot.remove()
            }
        });


    }
    const extendedGame = await getFullscreenPromptScreen()

    return extendedGame
}
export default fullscreenPromptMixin