// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { connect } from './socket.io.js';
var socket = null;
let playerMap = new Map()
var MainAPP = cc.Class({
    extends: cc.Component,

    properties: {
        Player: {
            default: null,       
            type: cc.Prefab, 
            serializable: true, 
        },
        playerID:{
            default: "",
            visible: false,
        },
        Enemies: {
            default: [],       
            type: cc.Prefab, 
            serializable: true, 
        },        
    },
    statics:{
        instance: null,
    },
    spawEnemy(posX, posY, type, id)
    {     
        var newEnemy = cc.instantiate(this.Enemies[type]); 
        newEnemy.getComponent("EnemyMove").enemyID = id;      
        newEnemy.setPosition(posX, posY);      
        this.node.addChild(newEnemy);
    },
    onEnemyDestroy(enemyID, bulletHit) {
        if (!cc.sys.isNative) {    
            let hitter = '';
            if(bulletHit)  
            {
                hitter = this.playerID;
            }
            socket.emit('onEnemyDestroy', {
                "enemyID": enemyID,
                "playerID": hitter,
            });
        }
    },
    onPlayerMove(posX, posY) {
        if (!cc.sys.isNative) {          
            socket.emit('onPlayerMove', {                
                "playerID": this.playerID,
                "posX": posX,
                "posY": posY,
            });
        }
    },
    onPlayerShoot(posX, posY) {
        if (!cc.sys.isNative) {          
            socket.emit('onPlayerShoot', {                
                "playerID": this.playerID,
                "posX": posX,
                "posY": posY,
            });
        }
    },
    updatePlayers(value, key, map) {
        console.log(`m[${key}] = ${value}`);
        let playerData = playerMap.get(key);
        if(!playerData)
        {
            var player = cc.instantiate(MainAPP.instance.Player);  
            player.getComponent("Player").playerID = key;
            console.log("Create Player:", key ,"==", MainAPP.instance.playerID,"==", key == MainAPP.instance.playerID); 
            player.setPosition(value.posX, value.posY);        
            MainAPP.instance.node.addChild(player);   
            playerMap.set(key, {
                "node": player,
                "playerID": key,
                "posX": value.posX,
                "posY": value.posY
            });           
        }
        else
        {         
            playerData.node.setPosition(value.posX, value.posY);
        }       
    },
    serverHandler(){
        if (!cc.sys.isNative) {
            //socket = connect('https://space-shooter-cocos.herokuapp.com'); 
            socket = connect('192.168.1.28:3000');          
            console.log(socket);   
            socket.on('connect', () => {
                this.playerID = socket.id;
                console.log('Socket connected id:', this.playerID);                
                socket.emit('CreatePlayer', 'Hello Server');
                socket.on('CreatePlayerResponse', (data) => {                  
                    var newMap = new Map(JSON.parse(data));                   
                    newMap.forEach(this.updatePlayers);    
                });

                socket.on('onPlayerMoveResponse', (data) => {     
                    var newMap = new Map(JSON.parse(data));                        
                    newMap.forEach(this.updatePlayers);               
                });

                
                socket.on('onPlayerShootResponse', (data) => { 
                    if(playerMap.has(data.playerID))
                    {
                        let playerData = playerMap.get(data.playerID);                  
                        playerData.node.getComponent("Player").shoot(data.playerID, data.posX, data.posY);
                    }
                    else
                    {
                        console.log("onPlayerShootResponse not found player ", data.playerID);
                    }           
                });

                socket.on('playerDisconect', (data) => { 
                if(playerMap.has(data))
                {
                    console.log("playerDisconect Client");
                    playerMap.get(data).node.destroy();
                }                                             
                });   

                socket.on('ServerUpdate', (data) => { 
                    this.spawEnemy(data.posX, data.posY, data.type, data.id);
                    console.log("Server Update:", data.time, " | Client: ",Date.now());                      
                });                
            }); 
        } 
    },
    onLoad () {  
        console.log("BULLET_SPEED", BULLET_SPEED);
        MainAPP.instance = this;
        this.serverHandler();
    },

    start () {

    },

    // update (dt) {},
});
