cc.Class({
    extends: cc.Component,

    properties: {     
        ExplosionEffect: {           
            default: null, 
            type: cc.Prefab, 
        },
        ExplosionSound: {           
            default: null, 
            type: cc.AudioClip, 
        },
        _enemyID:"",
    },
    statics:{
        mainGame: null,
    },
    // LIFE-CYCLE CALLBACKS:
    destroyEnemy(){
        // Explosive effect
        var explosiveEffect = cc.instantiate(this.ExplosionEffect);
        explosiveEffect.setPosition(this.node.position.x, this.node.position.y);
        this.mainGame.addChild(explosiveEffect);  

        //sound effect
        cc.audioEngine.playEffect(this.ExplosionSound,false);

        this.node.destroy();
    },
    onCollisionEnter(other, self)
    {  
        if(other.tag == 2) // Player bullet tag is 2
        {           
            this.mainGame.getComponent("Main").onEnemyDestroy(this._enemyID, other._name);
            // TODO: send to server and destroy on another client
            this.destroyEnemy();
            return;
        }
        if(other.tag == 4) // bounding box tag is 4
        {
            this.mainGame.getComponent("Main").onEnemyDestroy(this._enemyID, false);  
            this.destroyEnemy();  
            return;         
        }
    }, 

    onLoad () {
        this.mainGame = this.node.parent;    
        cc.director.getCollisionManager().enabled = true;         
    },

    start () {
        //var actionBy = cc.moveTo(1, cc.v2(newEnemy.position.x, newEnemy.position.y - this.EnemySpeed));          
    },

    update (dt) {
        this.node.setPosition(this.node.position.x, this.node.position.y - window.ENEMY_SPEED);      
    },
});
