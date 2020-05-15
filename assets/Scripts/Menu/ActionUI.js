var _scoreText = "";
cc.Class({
    extends: cc.Component,

    properties: {
        ScoreBoard: {
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
    updateScore(value, key, map) {
        _scoreText += key + ":" + value.score + "\n";
    },
    updateScoreBoard(data) {
        var newMap = new Map(JSON.parse(data));
        _scoreText = '';
        newMap.forEach(this.updateScore);
        this.ScoreBoard.getComponent(cc.Label).string = _scoreText;
    },

    showGameOver(data) {
        this.node.getChildByName("GameOver").active = true;
        this.node.getChildByName("ScoreBoard").active = false;

        this.node.getChildByName("GameOver").getChildByName("Score").getComponent(cc.Label).string = "Score: " + data;
    },
    hideGameOver() {
        this.node.getChildByName("GameOver").active = false;
    },
    restartCallback(button) {
        cc.director.loadScene("MainMenu");
    },
    onLoad() {
        this.node.getChildByName("GameOver").active = false;
        this.RestartButton.node.on('click', this.restartCallback, this);
        cc.director.preloadScene("MainMenu");
    },

    start() {

    },

    // update (dt) {},
});
