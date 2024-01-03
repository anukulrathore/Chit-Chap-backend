const express = require('express');
const socketio = require('socket.io')
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors()); 
const port = process.env.PORT;

const users = [{}];

app.get('/', function (req,res){
    res.send('Hello from server')
})

const server = app.listen(port, () =>{
    console.log(`Server listening on port 5000`);
});

const io = socketio(server)

io.on('connection', (socket) => {
    console.log('New connection')
    socket.on('joined', ({user})=>{
        users[socket.id]=user;
        console.log(`${users[socket.id]} has joined`);
        socket.broadcast.emit('userjoined', {user:"Admin", message: `${users[socket.id]} has joined the chat.`})
        socket.emit('welcome', {user:"Admin", message: `Welcome to the chat ${users[socket.id]}.`});
        
    })
    socket.on('sentmsg', ({message,id})=>{
        io.emit('sharemsg',{user:users[id], message,id});
    })
    socket.on('disconnect', ()=>{
        console.log(`${users[socket.id]}`);
        socket.broadcast.emit('leave', {user:"Admin", message: `${users[socket.id]} has left the chat`});
    })

})