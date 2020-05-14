var express = require('express');
var app = express();
server = require('http').createServer();
io = require('socket.io')(server);

function Player() {
  this.playerID = "";
  this.posX = 0;
  this.posY = 0;
}

let playerMap = new Map()

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

  socket.on('updatePosition', data => {
    let playerData = playerMap.get(data.playerID);
    if(!playerData)
    {
      console.log("updatePosition ", data.playerID, " failed")
    }
    else
    {
      console.log("updatePosition ", data);
      playerData.posX = data.posX;
      playerData.posY = data.posY;
      let transitString = JSON.stringify(Array.from(playerMap));
      socket.broadcast.emit('updatePositionResponse', transitString);
    }  
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});