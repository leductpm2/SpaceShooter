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
        ExplosionEffect: {           
            default: null, 
            type: cc.Prefab, 
            serializable: true,
        },
        ExplosionSound: {           
            default: null, 
            type: cc.AudioClip, 
            serializable: true,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onCollisionEnter(other, self)
    {  
        if(other.tag == 2) // Player bullet tag is 2
        {
            this.node.destroy();

            var explosiveEffect = cc.instantiate(this.ExplosionEffect);
            explosiveEffect.setPosition(this.node.position.x, this.node.position.y);
            parent.addChild(explosiveEffect);  
            
            cc.audioEngine.playEffect(this.ExplosionSound,false);
        }
    }, 

    onLoad () {    
        cc.director.getCollisionManager().enabled = true;         
    },

    start () {
        //var actionBy = cc.moveTo(1, cc.v2(newEnemy.position.x, newEnemy.position.y - this.EnemySpeed));    
      
    },

    update (dt) {
        this.node.setPosition(this.node.position.x, this.node.position.y - this.EnemySpeed);        
    },
});
