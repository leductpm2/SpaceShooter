// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Point: {   
            default: null,
            type: cc.Node, 
            serializable: true,
        },
        RestartButton: {   
            default: null,
            type: cc.Button, 
            serializable: true,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    updateScore(point)
    {
        this.Point.getComponent(cc.Label).string = point;
    },
    showGameOver()
    {
        this.node.getChildByName("GameOver").active = true;
        this.node.getChildByName("ScoreBoard").active = false;

        this.node.getChildByName("GameOver").getChildByName("Point").getComponent(cc.Label).string = "Point: " + this.Point.getComponent(cc.Label).string ;
    },
    hideGameOver()
    {
        this.node.getChildByName("GameOver").active = false;
    },
    restartCallback(button) {
        // do whatever you want with button
        // In addition, attention to this way registered events, can not pass customEventData
        console.log("restartCallback");
        cc.director.loadScene("Level1");
    },
    onLoad () {
        this.node.getChildByName("GameOver").active = false;
        this.RestartButton.node.on('click', this.restartCallback, this);
        cc.director.preloadScene("Level1");
    },

    start () {

    },

    // update (dt) {},
});
