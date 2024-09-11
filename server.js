const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" folder
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining a room
    socket.on('join_room', (room, username) => {
        socket.join(room);
        io.to(room).emit('message', `${username} has joined the room`);
    });

    // Handle message sending
    socket.on('send_message', (message, room, username) => {
        io.to(room).emit('message', `${username}: ${message}`);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
