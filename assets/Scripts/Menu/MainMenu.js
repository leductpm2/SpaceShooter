cc.Class({
    extends: cc.Component,

    properties: {
        SingleplayerButton: {
            default: null,
            type: cc.Button,
        },
        MultiplayerButton: {
            default: null,
            type: cc.Button,
        },
    },
    // LIFE-CYCLE CALLBACKS:
    singleplayerButton(button) {
        window.IS_SINGLE = true;
        cc.director.loadScene("Multiplayer");
    },
    multiplayerButton(button) {
        window.IS_SINGLE = false;
        cc.director.loadScene("Multiplayer");
    },
    onLoad() {
        this.SingleplayerButton.node.on('click', this.singleplayerButton, this);
        this.MultiplayerButton.node.on('click', this.multiplayerButton, this);
        cc.director.preloadScene("Multiplayer");
    },

    start() {

    },

    // update (dt) {},
});
