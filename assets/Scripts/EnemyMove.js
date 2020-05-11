// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        EnemySpeed: {
            // ATTRIBUTES:
            default: 1, 
            type: cc.Integer, 
            serializable: true,   // optional, default is true
        }, 
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        //var actionBy = cc.moveTo(1, cc.v2(newEnemy.position.x, newEnemy.position.y - this.EnemySpeed));    
      
    },

    update (dt) {
        this.node.setPosition(this.node.position.x, this.node.position.y - this.EnemySpeed);        
    },
});
