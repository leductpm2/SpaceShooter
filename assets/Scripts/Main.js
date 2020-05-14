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
        }       
    },
    statics:{
        instance: null,
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
            console.log("Create Player:", key ,"==", MainAPP.instance.playerID,"==", key == this.playerID); 
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
            socket = connect('http://192.168.1.28:3000');            
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
            }); 
        } 
    },
    onLoad () {  
        MainAPP.instance = this;
        this.serverHandler();
    },

    start () {

    },

    // update (dt) {},
});
