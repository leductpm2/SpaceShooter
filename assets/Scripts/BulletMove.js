// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        BulletSpeed: {
            // ATTRIBUTES:
            default: 3, 
            type: cc.Integer, 
            serializable: true,   // optional, default is true
        }, 
        playerID:{
            default: "",
            visible: false,
        }   
    },

    // LIFE-CYCLE CALLBACKS:
    onCollisionEnter(other, self)
    {  
        if(other.tag == 3) // Enemy tag is 2
        {
            this.node.destroy();
        }
    },

    onLoad () {   
        cc.director.getCollisionManager().enabled = true;         
    },
    
    start () {      
    },

    update (dt) {
        this.node.setPosition(this.node.position.x, this.node.position.y + this.BulletSpeed);        
    },
});