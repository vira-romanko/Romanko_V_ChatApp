var express = require('express');
var app = express();
//add socket here
const io = require('socket.io')();

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// attach out chat server to our app
io.attach(server);
io.on('connection', function(socket){ //socket is your connection
    console.log('a  user has connected');
    socket.emit('connected', {sID: socket.id, message: " new connection"});

    socket.on('chat_message', function(msg){
        console.log(msg); // let's see what the playload is form the client side
        //tell the conneciton manager (socket.io) to send this messsage to everyone
        // anyone connected to our chat app will get this message (including the sender)
        io.emit('new_message', {id: socket.id, message: msg})
    })

    socket.on('disconnect', function(){
        console.log('a user has disconnected');
    })
})