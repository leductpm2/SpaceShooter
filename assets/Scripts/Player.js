var last_shoot = 0;
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
    normalize(posX, posY) {
        let length = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2));
        if (length < PLAYER_SPEED)
            return [posX, posY];
        return [posX * (1 / length), posY * (1 / length)];
    },
    playerMovement(event) {
        let eventLocation = event.getLocation();
        let mousePosition = this.mainGame.convertToNodeSpaceAR(eventLocation);
        let posX = mousePosition.x;
        let posY = mousePosition.y;

        let playerPosX = this.node.position.x;
        let playerPosY = this.node.position.y;

        let vectorX = posX - playerPosX;
        let vectorY = posY - playerPosY;

        let distance = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
        if (distance <= PLAYER_SPEED) {

        }
        else {
            let normalize = this.normalize(vectorX, vectorY);
            posX = playerPosX + normalize[0] * PLAYER_SPEED;
            posY = playerPosY + normalize[1] * PLAYER_SPEED;
        }
        this.mainGame.getComponent("Main").onPlayerMove(posX, posY);
        this.node.setPosition(posX, posY);
    },
    shoot(playerID, posX, posY) {
        let newBullet = cc.instantiate(this.Bullet);
        newBullet.getComponent("Bullet").playerID = playerID;
        newBullet.setPosition(posX, posY);
        this.mainGame.addChild(newBullet);

        cc.audioEngine.playEffect(this.ShootSound, false);
    },
    playerShoot(event) {        
        if (last_shoot + PLAYER_RATE_OF_FIRE <= Date.now()) {
            last_shoot = Date.now();

            let posX = this.node.position.x;
            let posY = this.node.position.y;
            this.shoot(this.playerID, posX, posY);
            this.mainGame.getComponent("Main").onPlayerShoot(posX, posY);
        }
    },
    onCollisionEnter(other, self) {
        if (other.tag == 3) // Enemy tag is 3
        {
            // Explosive effect
            let explosiveEffect = cc.instantiate(this.ExplosionEffect);
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
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    start() {

    },

    // update (dt) {},
});
