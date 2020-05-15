cc.Class({
    extends: cc.Component,

    properties: {
        playerID: {
            default: "",
            visible: false,
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onCollisionEnter(other, self) {
        if (other.tag == 3) // Enemy tag is 2
        {
            this.node.destroy();
        }
        if(other.tag == 4) // bounding box tag is 4
        {
            this.node.destroy();
        }
    },

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        this.getComponent(cc.CircleCollider)._name = this.playerID;
    },

    start() {
    },

    update(dt) {
        this.node.setPosition(this.node.position.x, this.node.position.y + window.BULLET_SPEED);
    },
});