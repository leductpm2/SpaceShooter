// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { connect } from './socket.io.js';
var socket = null;
var playerMap = null;
var MainAPP = cc.Class({
    extends: cc.Component,

    properties: {
        Player: {
            default: null,
            type: cc.Prefab,
        },
        Enemies: {
            default: [],
            type: cc.Prefab,
            serializable: true,
        },
        ActionUI: {
            default: null,
            type: cc.Node,
        },
    },
    statics: {
        instance: null,
    },
    spawEnemy(posX, posY, type, id) {
        var newEnemy = cc.instantiate(this.Enemies[type]);
        newEnemy.getComponent("Enemy")._enemyID = id;
        newEnemy.setPosition(posX, posY);
        this.node.addChild(newEnemy);
    },
    onEnemyDestroy(enemyID, hitterID) {
        if (!cc.sys.isNative && !IS_SINGLE) {
            if (hitterID == CURRENT_PLAYER_ID) {
                socket.emit('onEnemyDestroy', {
                    "enemyID": enemyID,
                    "playerID": hitterID,
                });
            }
        }
    },
    onPlayerMove(posX, posY) {
        if (!cc.sys.isNative && !IS_SINGLE) {
            socket.emit('onPlayerMove', {
                "playerID": CURRENT_PLAYER_ID,
                "posX": posX,
                "posY": posY,
            });
        }
    },
    onPlayerShoot(posX, posY) {
        if (!cc.sys.isNative && !IS_SINGLE) {
            socket.emit('onPlayerShoot', {
                "playerID": CURRENT_PLAYER_ID,
                "posX": posX,
                "posY": posY,
            });
        }
    },
    onPlayerDie() {
        if (!cc.sys.isNative && !IS_SINGLE) {
            socket.emit('onPlayerDie', CURRENT_PLAYER_ID);
            socket.on('onPlayerDieResponse', (data) => {
                this.ActionUI.getComponent("ActionUI").showGameOver(data);
                socket.disconnect();
            });
        }
        else
        {
            this.ActionUI.getComponent("ActionUI").showGameOver("TODO");
        }
    },
    updatePlayers(value, key, map) {
        let playerData = playerMap.get(key);
        if (!playerData) {
            var player = cc.instantiate(MainAPP.instance.Player);
            player.getComponent("Player").playerID = key;
            player.setPosition(value.posX, value.posY);
            MainAPP.instance.node.addChild(player);
            console.log("Create Player: ", key, " | ", key == CURRENT_PLAYER_ID);

            playerMap.set(key, {
                "node": player,
                "playerID": key,
                "posX": value.posX,
                "posY": value.posY
            });
        }
        else {
            playerData.node.setPosition(value.posX, value.posY);
        }
    },
    serverHandler() {
        if (!cc.sys.isNative) {
            socket = connect(IS_ONLINE ? SERVER_ADDRESS_ONLINE : SERVER_ADDRESS_LOCAL);

            socket.on('connect', () => {
                CURRENT_PLAYER_ID = socket.id;
                console.log('Socket connected id:', CURRENT_PLAYER_ID);
                socket.emit('createPlayer', CURRENT_PLAYER_ID);
            });

            socket.on('onPlayerCreated', (data) => {
                var newMap = new Map(JSON.parse(data));
                newMap.forEach(this.updatePlayers);
            });

            socket.on('onPlayerMoveResponse', (data) => {
                var newMap = new Map(JSON.parse(data));
                newMap.forEach(this.updatePlayers);
            });

            socket.on('onPlayerShootResponse', (data) => {
                if (playerMap.has(data.playerID)) {
                    let playerData = playerMap.get(data.playerID);
                    playerData.node.getComponent("Player").shoot(data.playerID, data.posX, data.posY);
                }
                else {
                    console.log("onPlayerShootResponse not found player ", data.playerID);
                }
            });

            socket.on('onEnemySpaw', (data) => {
                this.spawEnemy(data.posX, data.posY, data.type, data.id);
            });

            socket.on('onScoreChange', (data) => {
                this.ActionUI.getComponent("ActionUI").updateScoreBoard(data);
            });

            socket.on('onPlayerDisconect', (data) => {
                if (playerMap.has(data)) {
                    playerMap.get(data).node.destroy();
                }
            });
        }
    },
    onLoad() {
        MainAPP.instance = this;
    },

    start() {
        if (IS_SINGLE) {
            var player = cc.instantiate(MainAPP.instance.Player);
            player.setPosition(0, 0);
            this.node.addChild(player);
            // spaw enemy
            setInterval(function () {
                let posX = Math.floor(Math.random() * SCREEN_WIDTH) - SCREEN_WIDTH / 2;
                let posY = SCREEN_HEIGHT / 2;
                let type = Math.floor(Math.random() * TOTAL_ENEMY_TYPE);

                var newEnemy = cc.instantiate(MainAPP.instance.Enemies[type]);
                newEnemy.setPosition(posX, posY);
                MainAPP.instance.node.addChild(newEnemy);
            }, 1000);

        }
        else {
            playerMap = new Map();
            this.serverHandler();
        }

    },

    // update (dt) {},
});
