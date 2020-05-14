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
        },
        ShootSound: {
            default: null,       
            type: cc.AudioClip,
        },
        LoseSound:{
            default: null,
            type: cc.AudioClip,
        },
        playerID:{
            default: "",
            visible: false,
        }       
    },
    statics:{
        mainGame: null,
    },
    // LIFE-CYCLE CALLBACKS:
    playerMovement(event)
    {                       
        var eventLocation = event.getLocation();
        var mousePosition = mainGame.convertToNodeSpaceAR(eventLocation);
        var posX = mousePosition.x;
        var posY = mousePosition.y;     

        mainGame.getComponent("Main").onPlayerMove(posX, posY);
        this.node.setPosition(posX, posY);
    },
    shoot(playerID, posX, posY){
        var newBullet = cc.instantiate(this.Bullet);
        console.log("shoot", playerID, posX, posY);
        newBullet.getComponent("BulletMove").playerID = playerID;
        newBullet.setPosition(posX, posY);
        mainGame.addChild(newBullet);   
        console.log("shoot");
        cc.audioEngine.playEffect(this.ShootSound,false);     
    },
    playerShoot(event)
    {       
        let posX =this.node.position.x;
        let posY = this.node.position.y;     
        this.shoot(this.playerID, posX, posY);
        mainGame.getComponent("Main").onPlayerShoot(posX, posY);
    },
    onCollisionEnter(other, self)
    {  
        if(other.tag == 3) // Enemy tag is 3
        {
            mainGame.getComponent("Main").gameOver(); // TODO
            cc.audioEngine.playEffect(this.LoseSound,false);
            this.node.destroy();
        }
    },   
    onLoad () {  
        mainGame = this.node.parent;
        console.log("onLoad", this.playerID, "+++", mainGame.getComponent("Main").playerID);       
        if(this.playerID == mainGame.getComponent("Main").playerID)        
        {   
            mainGame.on('mousemove', this.playerMovement, this);
            mainGame.on('mousedown', this.playerShoot, this);  
        }    
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;       
    },
    start () {
      
    },

    // update (dt) {},
});
