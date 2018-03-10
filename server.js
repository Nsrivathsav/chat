var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io= require('socket.io').listen(server);
users=[];
connections=[];

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';


//server.listen(process.env.PORT || 3000);

server.listen(server_port, server_ip_address, function () {
   console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});
console.log("server is on live");
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',function(socket){
  connections.push(socket);
  console.log('Info: %s sockets connected',connections.length);


  //disconnect
  socket.on('disconnect',function(data){
    users.splice(users.indexOf(socket.username),1);
    updateUserNames();
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected; %s sockects connected',connections.length);
    //console.log("socket iNfo:  ", socket);
  });

  socket.on('send msg', function(data){
    io.sockets.emit('new msg', {msg:data,user:socket.username});
  })

  socket.on('new user',function(data,callback){
    callback(true);
    socket.username=data;
    users.push(data);
    updateUserNames();
  })
  function updateUserNames(){
    io.sockets.emit('get users', users);
  }
});
