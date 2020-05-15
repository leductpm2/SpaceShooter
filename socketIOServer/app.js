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
function Enemy() {
  this.enemyID = "";
  this.posX = 0;
  this.posY = 0;
  this.type = 0;
}

var playerMap = new Map();
var enemiesArr = [];
var countID = 0;

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;
const TOTAL_ENEMY_TYPE = 3;
setInterval(function () {
  let newEnemy = new Enemy();
  newEnemy.id = countID;
  newEnemy.posX = Math.floor(Math.random() * SCREEN_WIDTH) - SCREEN_WIDTH / 2;
  newEnemy.posY = SCREEN_HEIGHT / 2;
  newEnemy.type = Math.floor(Math.random() * TOTAL_ENEMY_TYPE);

  enemiesArr.push(countID);
  countID = countID + 1;

  // io.emit('onEnemySpaw', {
  //   "time": Date.now(),
  //   "posX": posX,
  //   "posY": posY,
  //   "type": enemyType,
  //   "id": countID,
  // });
  io.emit('onEnemySpaw', newEnemy);
}, 1000);

io.on('connection', socket => {
  let socketId = socket.id;
  console.log('New connection ', socketId);

  socket.on('createPlayer', data => {
    if (playerMap.get(data)){
      console.log("Player already Created:", data);
    }
    else  {
      let newPlayer = new Player();
      newPlayer.playerID = data;
      playerMap.set(data, newPlayer);
      console.log("Created new Player:", socketId, newPlayer.playerID);
      
      let transitString = JSON.stringify(Array.from(playerMap));
      io.emit('onPlayerCreated', transitString);
    }    
  });

  socket.on('onPlayerMove', data => {
    let playerData = playerMap.get(data.playerID);
    if (playerData) {    
      playerData.posX = data.posX;
      playerData.posY = data.posY;
      let transitString = JSON.stringify(Array.from(playerMap));
      socket.broadcast.emit('onPlayerMoveResponse', transitString);
    }
    else{
      console.log("onPlayerMove ", data.playerID, " failed");   
    }
  });

  socket.on('onPlayerShoot', data => {
    let playerData = playerMap.get(data.playerID);
    if (playerData) {
      socket.broadcast.emit('onPlayerShootResponse', data);
    }
    else {
      console.log("onPlayerShoot ", data.playerID, " failed");
    }
  });

  socket.on('onEnemyDestroy', data => {
    var index = enemiesArr.indexOf(data.enemyID);
    if (index != -1) {
      let playerData = playerMap.get(data.playerID);
      if (playerData) {
        playerData.score = playerData.score + 1;
        let transitString = JSON.stringify(Array.from(playerMap));
        io.emit('onScoreChange', transitString);
        console.log("Player Gain Score ", data.playerID, " total:", playerData.score);
      }// else enemy remove after go out screen      
      enemiesArr.splice(index, 1);
    }// enemy be killed by other player
  });

  socket.on('onPlayerDie', data => {
    let playerData = playerMap.get(data);
    if (playerData) {
      let score = playerData.score;
      socket.emit('onPlayerDieResponse', score);
      socket.broadcast.emit('playerDisconect', data);
      playerMap.delete(data);
    }
    else {
      console.log("onPlayerDie ", data, " fail");
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected ', socketId);
    playerMap.delete(socketId);
    socket.broadcast.emit('onPlayerDisconect', socketId);
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Server listening on *:', PORT);
});