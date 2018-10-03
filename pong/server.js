
var app = require('express')(); //express initalizer app to be a function handler to supply http server line 2
var http = require('http').Server(app);
var io = require('socket.io')(http); //socket.io intergrates with node.js http server and is a client library that loads on the brower side

var player1ID;
var player1Direction;
var player2ID;
var player2Direction;


 app.get( '/*' , function( req, res )  //searchs the folder and sends all that is can to the html
	{
		
        var file = req.params[0];//make it an array incase we want to send more than one in the fututre aka menu if time allows
       
		//console.log('trying to route' + '/' + file);
        res.sendFile( __dirname + '/' + file );

    }); 



io.on('connection', function(socket)//this one tells when user connects and disconnects
{
	
  socket.on('xConnected', function (name){ //display name when connected
	  console.log(name , " connected!");
  });
  
  socket.on('paddle',function (data){  
  
	//console.log(data.id,":",data.way);
	  socket.broadcast.emit('paddle', data); //this one does not go back to itself like the chat io.emit
	  
  });
  
 
    socket.on('chat message', function(msg){   //chat function
   io.emit('chatMessage', msg); //emit for everyone
	console.log(msg.name ,'send:', msg.message); 
  });
  
  socket.on("startDirection", function(directionData){ //chose the direction
	  	if(player1ID == null)
			{
				player1ID = directionData.id;
				player1Direction = directionData.way;
				//console.log("player1ID = ",player1ID);
			}
			
			if(player2ID == null && directionData.id != player1ID)
			{	
				player2ID = directionData.id;
				player2Direction = directionData.id;
				//console.log("player2ID = ",player2ID);
			}
		
			
		if(player1ID != null && player2ID != null)
		{
			//console.log(player1ID, "", player2ID);
			
				player1Direction = 0;
				player2Direction = 1;
				
					startdata = {		
						player1ID: player1ID,
						player1Direction: player1Direction,
						player2ID: player2ID,
						player2Direction: player2Direction,
					}
				//console.log("player 1:", player1Direction, "player 2:", player2Direction);
				io.emit('startData',startdata);		
			
		}
  });
  
  
  socket.on('startGame', function(startGame){ //someone clicked to startGame

	  io.emit('gameStarted', startGame);
  });
  
  
  socket.on('disconnect', function(){//listens for a disconnect
    console.log('A user has disconnected');//log it to the console
  });
  
});


http.listen(8080, function() //make it listen on port 8080
{
  console.log('listening on *http://localhost:8080/');  //tells the cmd tht
});






