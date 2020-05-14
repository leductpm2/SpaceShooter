var express = require('express');
var app = express();
server = require('http').createServer();
io = require('socket.io')(server);

function Player() {
  this.playerID = "";
  this.posX = 0;
  this.posY = 0;
  this.score = 0;
}

var playerMap = new Map();
var enemiesArr = [];
var countID = 0;

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;
const TOTAL_ENEMY_TYPE = 3;
var posX;
var posY;
var enemyType;
setInterval(function() {  
  posX = Math.floor(Math.random() * SCREEN_WIDTH) - SCREEN_WIDTH / 2;
  posY = SCREEN_HEIGHT / 2;   
  enemyType = Math.floor(Math.random() * TOTAL_ENEMY_TYPE); 
  io.emit('ServerUpdate', { 
    "time": Date.now(),
    "posX": posX,
    "posY": posY,
    "type": enemyType,
    "id": countID,
  });
  enemiesArr.push(countID);
  countID = countID + 1;
}, 1000);



io.on('connection', socket => { 
  var socketId = socket.id;  
  console.log('New connection ', socketId);

  socket.on('CreatePlayer', data => {
    if(!playerMap.get(socketId))
    {
      var newPlayer = new Player();        
      newPlayer.playerID = socketId;
      playerMap.set(socketId, newPlayer);
      console.log("Create new Player:", newPlayer.playerID, playerMap);
      let transitString = JSON.stringify(Array.from(playerMap));
      io.emit('CreatePlayerResponse', transitString);
    }
    else
    {
      console.log("Already Created:", socketId);
    }    
  }); 

  socket.on('onPlayerMove', data => {
    let playerData = playerMap.get(data.playerID);
    if(!playerData)
    {
      console.log("onPlayerMove ", data.playerID, " failed")
    }
    else
    {      
      playerData.posX = data.posX;
      playerData.posY = data.posY;
      let transitString = JSON.stringify(Array.from(playerMap));
      socket.broadcast.emit('onPlayerMoveResponse', transitString);
    }  
  });

  socket.on('onPlayerShoot', data => {
    let playerData = playerMap.get(data.playerID);
    if(!playerData)
    {
      console.log("onPlayerShoot ", data.playerID, " failed")
    }
    else
    {
      console.log("onPlayerShoot ", data);
      socket.broadcast.emit('onPlayerShootResponse', data);
    } 
  });

  socket.on('onEnemyDestroy', data => {
    var index = enemiesArr.indexOf(data.enemyID);
    console.log(enemiesArr, index, data.enemyID);
    if(index != -1)
    {     
      let playerData = playerMap.get(data.playerID);
      if(playerData)
      {       
        playerData.score = playerData.score + 1;  
        console.log("Player Gain Score ", data.playerID, " total:", playerData.score);        
      }
      else{
        console.log("Enemy dead");
      }
     
      enemiesArr.splice(index, 1);
    }
    else{
      console.log("Enemy already dead");
    }
  }); 


  socket.on('disconnect', () => {
    console.log('User disconnected ', socketId);
    playerMap.delete(socketId);
    socket.broadcast.emit('playerDisconect', socketId);
  }); 

  // setInterval(function() {
  //   console.log(posX, posY, enemyType); // should put here , if not value change
  //   socket.emit('ServerUpdate', { 
  //     "time": Date.now(),
  //     "posX": posX,
  //     "posY": posY,
  //     "type": enemyType,
  //   });
  // }, 1500);
});
// var lastUpdateTime = (new Date()).getTime();
// setInterval(function() {
//   // code ...
//   var currentTime = (new Date()).getTime();
//   var timeDifference = currentTime - lastUpdateTime;
//   player.x += 5 * timeDifference;
//   lastUpdateTime = currentTime;
// }, 1000 / 60);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('listening on *:', PORT); 
});