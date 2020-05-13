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
        LoseSound:{
            default: null,
            type: cc.AudioClip, 
            serializable: true, 
        },
        parent:{ //TODO: remove
            default: null,
            visible: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    playerMovement(event)
    {
        var eventLocation = event.getLocation();
        var mousePosition = parent.convertToNodeSpaceAR(eventLocation);
        var posX = mousePosition.x;
        var posY = mousePosition.y;     

        this.node.setPosition(posX, posY);
    },
    playerShoot(event)
    {
        var newBullet = cc.instantiate(this.Bullet);
        newBullet.setPosition(this.node.position.x, this.node.position.y);
        parent.addChild(newBullet);   

        cc.audioEngine.playEffect(this.ShootSound,false);
    },
    onCollisionEnter(other, self)
    {  
        if(other.tag == 3) // Enemy tag is 3
        {
            parent.getComponent("Main").gameOver(); // TODO
            cc.audioEngine.playEffect(this.LoseSound,false);
            this.node.destroy();
        }
    },   
    onLoad () {  
        parent = this.node.parent;       
        parent.on('mousemove', this.playerMovement, this);
        parent.on('mousedown', this.playerShoot, this);  

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;       
    },
    start () {
      
    },

    // update (dt) {},
});
