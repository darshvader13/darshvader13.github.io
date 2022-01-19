const path = require('path');
const express = require('express');
const http = require('http');
const formatMessage = require('./helpers/formatDate')
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require('./helpers/userHelper');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Set public directory
app.use(express.static(path.join(__dirname, 'public')));

// this block will run when the client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room, color}) => {
    const user = newUser(socket.id, username, room, color);
    socket.join(user.room);
	
    // General welcome
    // Broadcast everytime users connects
	
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage("", `${user.username} has joined the room`), user.color
      );
    // Current active users and room name
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });
  });

  // Listen for client message
  socket.on('chatMessage', ( msg ) => {
    const user = getActiveUser(socket.id);
	io.to(user.room).emit('message', formatMessage(user.username, msg), user.color);
  });

  socket.on('audioMessage', ( blob ) => {
    const user = getActiveUser(socket.id);
	const poop = 'AUDIO MESSAGE';
	io.to(user.room).emit('audio', formatMessage(user.username, poop), user.color, blob);
  });
  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = exitRoom(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage("", `${user.username} has left the room`), user.color
      );
      // Current active users and room name
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;;
server.listen(PORT);