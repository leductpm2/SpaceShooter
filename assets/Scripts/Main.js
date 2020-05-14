// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { connect } from './socket.io.js';
var socket = null;
let playerMap = new Map()
const xah_obj_to_map = ( obj => {
    const mp = new Map;
    Object.keys ( obj ). forEach (k => { mp.set(k, obj[k]) });
    return mp;
});

var MainAPP = cc.Class({
    extends: cc.Component,

    properties: {
        Player: {
            default: null,       
            type: cc.Prefab, 
            serializable: true, 
        },
        playerID: '',
        nodeID:'',           
    },
    statics:{
        instance: null,
    },
    updatePosition(posX, posY) {
        if (!cc.sys.isNative) {
            console.log("updatePosition server");
     
            console.log("updatePosition server2");
            socket.emit('updatePosition', {
                "nodeID": this.nodeID,
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
            player.setPosition(value.posX, value.posY);        
            MainAPP.instance.node.addChild(player);    
            console.log("Create Player:", key ,"==", MainAPP.instance.playerID,"==", key == this.playerID);        
            if(key == MainAPP.instance.playerID)
            {
                MainAPP.instance.nodeID = player._id;
                console.log("Create Self Player:", value.playerID, " with ID:", player._id);
            }
            else
            {
                console.log("Create Player:", value.playerID, " with ID:", player._id);
            }
            playerMap.set(key, {
                "node": player,
                "playerID": key,
                "posX": value.posX,
                "posY": value.posY
            });
        }
        else
        {
            console.log( "update: ", playerData);
            playerData.node.setPosition(value.posX, value.posY);
        }       
    },
    onLoad () {  
        MainAPP.instance = this;
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

                socket.on('updatePositionResponse', (data) => {     
                    var newMap = new Map(JSON.parse(data));                        
                    newMap.forEach(this.updatePlayers);               
                });

            }); 
        }
    },

    start () {

    },

    // update (dt) {},
});
