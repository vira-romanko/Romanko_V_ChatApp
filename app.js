var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
//add socket here
const io = require('socket.io')();
const port = process.env.PORT || 3030;


//Connection our db for Log in functionality
// Username: Trevor
//Password: 123
var connection = mysql.createConnection({
    host     : 'localhost',
    port: 8889,
	user     : 'root',
	password : 'root',
	database : 'nodelogin'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//LOG OUT
app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
	});
});
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/login.html'));
});
//Checking authorization
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


// if user logs in succssesfylly, redner chat page
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
        response.sendFile(__dirname + '/views/home.html');
		//response.send('Welcome back, ' + request.session.username + '!');
		console.log('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
    //response.end();
});

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));
//App is running on post 3030
const server = app.listen(port, () => {
    console.log(`ChatApp is running on port ${port}`);
});




//SOCKET.IO STUFF
// attach out chat server to our app
io.attach(server);
io.on('connection', function(socket){ //socket is your connection
    console.log('a  user has connected');


		 
	
    
    socket.emit('connected', {sID: socket.id, message: " new connection"});

    socket.on('chat_message', function(msg){
        console.log(msg); // let's see what the playload is form the client side
        //tell the conneciton manager (socket.io) to send this messsage to everyone
        // anyone connected to our chat app will get this message (including the sender)
        io.emit('new_message', {id: socket.id, message: msg })
       
    })

    socket.on('typing', (data) => {
        io.emit('typing', data);
      });
      socket.on('stoptyping', () => {
        io.emit('stoptyping');
      });

    socket.on('disconnect', function(){
        console.log('a user has disconnected');
    })
    	
})