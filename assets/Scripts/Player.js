// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Bullet: {
            default: null,       
            type: cc.Prefab, 
            serializable: true, 
        },
        ShootSound: {
            default: null,       
            type: cc.AudioClip, 
            serializable: true, 
        },
        parent:{
            default: null,
            visible: false,
        }
    },

    // LIFE-CYCLE CALLBACKS:
    playerMovement(event)
    {
        var mousePosition = event.getLocation();
        mousePosition = parent.convertToNodeSpaceAR(mousePosition);
        posX = mousePosition.x;
        posY = mousePosition.y;     

        this.node.setPosition(posX, posY);
    },
    playerShoot(event)
    {
        var newBullet = cc.instantiate(this.Bullet);
        newBullet.setPosition(this.node.position.x, this.node.position.y);
        parent.addChild(newBullet);       

        // var mousePosition = event.getLocation();
        // mousePosition = this.node.convertToNodeSpaceAR(mousePosition);
        // this.posX = mousePosition.x;
        // this.posY = mousePosition.y;

        // var actionBy = cc.moveTo(0.2,cc.v2(this.posX,this.posY));
        // var destruction = cc.callFunc(function(){
        //     newBullet.destroy();
        // },this);
        // var sequence = cc.sequence(actionBy,destruction);
        // newBullet.runAction(sequence);
        cc.audioEngine.playEffect(this.ShootSound,false);
    },
    onLoad () {        
        parent = this.node.parent;       
        parent.on('mousemove', this.playerMovement, this);
        parent.on('mousedown', this.playerShoot, this);        
    },
    start () {
      
    },

    // update (dt) {},
});
