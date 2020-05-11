// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Explosion: {
            // ATTRIBUTES:
            default: null,        // The default value will be used only when the component attaching
                                  // to a node for the first time
            type: cc.Prefab, // optional, default is typeof default
            serializable: true,   // optional, default is true
        }, 
        Enemies: {
            default: [],       
            type: cc.Prefab, 
            serializable: true, 
        }, 
        timePassed: {
            default: 0,       
            type: cc.Integer, 
            visible: false,
        }, 
    },
    // LIFE-CYCLE CALLBACKS:
    spawEnemy(event)
    {
        var canvasSize = this.node.getContentSize();
        //Due to 0:0 in center
        var posX = Math.floor(Math.random() * canvasSize.width) - canvasSize.width / 2;
        var posY = Math.floor(Math.random() * canvasSize.height);
       
        var enemyType = Math.floor(Math.random() * this.Enemies.length);        
        var newEnemy = cc.instantiate(this.Enemies[enemyType]); 
        newEnemy.setPosition(posX, canvasSize.height / 2);
        this.node.addChild(newEnemy);
    },
    onLoad () {
        this.schedule(this.spawEnemy, 1 ,cc.macro.REPEAT_FOREVER, 3);
              
    },
    start () {     
    },
    update (dt) {
        this.timePassed = this.timePassed + dt;
        console.log("timePassed",  Math.floor(this.timePassed));
    },
});
