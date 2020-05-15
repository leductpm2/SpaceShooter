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
        LoseSound: {
            default: null,
            type: cc.AudioClip,
        },
        ExplosionEffect: {
            default: null,
            type: cc.Prefab,
        },
        playerID: {
            default: "",
            visible: false,
        }
    },
    statics: {
        mainGame: null,
    },
    // LIFE-CYCLE CALLBACKS:
    playerMovement(event) {
        var eventLocation = event.getLocation();
        var mousePosition = this.mainGame.convertToNodeSpaceAR(eventLocation);
        var posX = mousePosition.x;
        var posY = mousePosition.y;

        this.mainGame.getComponent("Main").onPlayerMove(posX, posY);
        this.node.setPosition(posX, posY);
    },
    shoot(playerID, posX, posY) {
        var newBullet = cc.instantiate(this.Bullet);
        newBullet.getComponent("Bullet").playerID = playerID;
        newBullet.setPosition(posX, posY);
        this.mainGame.addChild(newBullet);

        cc.audioEngine.playEffect(this.ShootSound, false);
    },
    playerShoot(event) {
        let posX = this.node.position.x;
        let posY = this.node.position.y;
        this.shoot(this.playerID, posX, posY);
        this.mainGame.getComponent("Main").onPlayerShoot(posX, posY);
    },
    onCollisionEnter(other, self) {
        if (other.tag == 3) // Enemy tag is 3
        {
            // Explosive effect
            var explosiveEffect = cc.instantiate(this.ExplosionEffect);
            explosiveEffect.setPosition(this.node.position.x, this.node.position.y);
            this.mainGame.addChild(explosiveEffect);
            //sound effect
            cc.audioEngine.playEffect(this.ExplosionSound, false);
            
            if (this.playerID == CURRENT_PLAYER_ID) // you die
            {
                this.mainGame.getComponent("Main").onPlayerDie(); // TODO
                cc.audioEngine.playEffect(this.LoseSound, false);
            }
            this.node.destroy();
        }
    },
    onLoad() {
        this.mainGame = this.node.parent;
        if ((this.playerID == CURRENT_PLAYER_ID) || window.IS_SINGLE) {
            this.mainGame.on('mousemove', this.playerMovement, this);
            this.mainGame.on('mousedown', this.playerShoot, this);
        }
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    start() {

    },

    // update (dt) {},
});
