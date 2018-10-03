var canvas; //dimensions
var canvasContext; //graphic information

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100; //constant aka cant be changed
const PADDLE_WIDTH = 10;

var ballX = 0;
var ballY = 0;
var ballSpeedX =0;
var ballSpeedY = 0;
var StartballSpeedX;

var player1Score = 0; 
var player2Score = 0; 
const WINNING_SCORE = 3;
var startScreen = true;

var winScreen = true; 
var socket;

var direction = Math.floor(Math.random() * 2);
var id = Math.random();
var bloop = false;

var once = false
var soundPlayed = true;
var audio;
var sound;

var value;

socket = io.connect("http://localhost:8080/") //open a connection to the server tht has the socket server on it  

var directionData = {
				id: id,
				way: direction,	
			}
	
window.onload = function()
{ //only after the page has finished loading
	
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");
		
	socket.emit('startDirection', directionData); //emit this before anything else
	socket.on('startData',startData1);
	console.log("this should only appear once");
	console.log("p1 : ", ballSpeedX);
	
		
	var framesPerSecond = 30; // will be forgotton once this method is done
	setInterval(function()
	{
			moveEverything();
			drawEverything();
			socket.on('paddle', paddleLocation);
			socket.on('gameStarted', startGame);
	}, 1000/framesPerSecond); // every second it calls drawEverything and loops
	
	canvas.addEventListener("mousemove",
		function(evt) { 
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y -(PADDLE_HEIGHT/2); //updates the paddle1Y pos to max the mouse y pos
		});
	
	canvas.addEventListener("mousedown", mouseclick);
	
}

function startData1(data)
{
	if( id != data.player1ID) // this means we are player 2
	{
		console.log("before id :",id," before direction: ", direction);
		console.log("p2 id:",data.player2ID, "p2 direction: ", data.player2Direction);
		StartballSpeedX = -5; 
		console.log("player 2 ballSpeedX set to: ", ballSpeedX);
	}

	if( id == data.player1ID) // this means we are player 1
	{
		console.log("before id:",id," before direction: ", direction);
		console.log("p1 id:",data.player1ID, "p1 direction: ", data.player1Direction);
		StartballSpeedX = 5; 
		console.log("player 1 ballSpeedX set to: ", ballSpeedX);
	}
	setDirection = true;
	console.log(setDirection);
}
	
function startGame(data)
{
	ballRestart()
	winScreen = false;
	player1Score = 0;
	player2Score = 0;
	soundPlayed = false; 
	if(player1Score == 0 && player2Score == 0)
	{
		ballSpeedX =  StartballSpeedX;
	}
}

function paddleLocation(data)
{
	paddle2Y = data.paddle;
}

function calculateMousePos(evt){  //event every time the mouse moves and give the mouse location

	var rect = canvas.getBoundingClientRect(); //canvas area
	var root = document.documentElement; //get browser coridances
	var mouseX = evt.clientX - rect.left - root.scrollLeft; //evt.clientX is the mouse X
	var mouseY = evt.clientY - rect.top - root.scrollTop; // doing all this gets the x,y of the mouse in the canvis
	return{
		//returns the mouse locations
		x:mouseX,
		y:mouseY
	};
}

function mouseclick(evt)
{
	if(winScreen == true)
	{
		console.log("mouseclicked");
		player1Score = 0;
		player2Score = 0;
		winScreen = false;
		winDisplayed = false;	
		
			var startData = {
				winScreen: winScreen
			}
		
		socket.emit('startGame', startData); //saying someone has pressed to play
	}
}

function ballRestart()
{
	if(player1Score == WINNING_SCORE || player2Score == WINNING_SCORE)
	{
		winScreen = true;
	}
    ballSpeedX = -ballSpeedX; //This is the code that sometimes reverse the direction!!!!!!!!!!!!!!!!!!!!!!!!!!
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}


function moveEverything()
{
		var BPData = {
			paddle: paddle1Y,
			ballX: ballX,
			ballY: ballY
		}

	socket.emit('paddle',  BPData); //sending the data

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	
	if(ballX > canvas.width)
	{
		if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) //paddle top + the height = full paddle
		{
			ballSpeedX = -ballSpeedX;
			sound = "ding";
			soundFactory(sound);
			var bounce = ballY - (paddle2Y + PADDLE_HEIGHT/2); // plus or minus value based on where it hits in relations to middle of the paddle
			ballSpeedY = bounce * 0.5 + 10; //coz the bounce number was too damn big
			console.log(ballSpeedY);
		}
		else
		{
			sound = "win";
			soundFactory(sound);
		    player1Score++
			ballRestart()
		}
	}
	
	if(ballX < 0)
	{
		if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) //paddle bot + the height = full paddle
		{
			ballSpeedX = -ballSpeedX; //two negitives = positive
			sound = "ding";
			soundFactory(sound);
			var bounce = ballY - (paddle1Y + PADDLE_HEIGHT/2); 
			ballSpeedY = bounce * 0.5 + 10;
		}
		else
		{
			sound = "lose";
			soundFactory(sound);
			player2Score++
			ballRestart()
		}
	}
		
	if(ballY < 0)
	{
		ballSpeedY = -ballSpeedY;
	}
	
	if(ballY > canvas.height)
	{
		ballSpeedY = -ballSpeedY; //two negitives = positive
	}

}

	function soundFactory(sound)
	{
		console.log("hello");
		 switch(sound) {
        case "win":
            audio = new Audio('win.mp3');
			audio.play();
        break;
        case "lose":
			audio = new Audio('lose.mp3');
			audio.play();	
        break;
        case "ding":
        	audio = new Audio('paddleSound.mp3');
			audio.play();
        break;
		}
	}
 	
function drawEverything()
{

	drawMaker(0,0,canvas.width,canvas.height, "black"); //this is another way using a method
	
	if(winScreen == true)
	{
		ballSpeedX=0;
		canvasContext.font = "30px Georgia";
		canvasContext.fillStyle = "white";
		canvasContext.fillText("Click on screen to start/restart", 175,250);
			
		if(soundPlayed == false)
		{
			if(player1Score == WINNING_SCORE)
			{
				sound = "win";
				soundFactory(sound);		
			}
			else
			{	
				sound = "lose";
				soundFactory(sound);
			}
		soundPlayed = true;
		startScreen = false;
		
		}
		
		if(startScreen == false)
		{
		
			if(player1Score == WINNING_SCORE)
			{
				canvasContext.fillText("YOU WIN!", 325,100);			
			}
			else
			{
				canvasContext.fillText("YOU LOSE!", 325,100);	
			}
		}
	  return;
	}

	drawMaker(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT, "white"); //paddle1
	drawMaker(790,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT, "white"); //paddle2
	
	for( var i = 0; i< canvas.height; i= i + 40) //draw it after black coz layers
	{
		drawMaker(canvas.width/2-1, i,2,20,"white"); // xLoc,yLoc,wide,tall,colour 
	}
	
	//score board
	canvasContext.font = "30px Georgia";
	
	canvasContext.fillText("current score", 300,20);
	canvasContext.fillText(player1Score, 330,50);
	canvasContext.fillText(player2Score, 430,50);

	drawCircleBall(ballX,ballY,10,"red");
	//drawMaker(ballX,210,10,10, "red"); // old ball
}

function drawCircleBall(centerX,centerY,radius,drawColor)
{
	//make ball circle
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);// X,Y center of circle,radius,angles,radians how many times it goes round,true for top
	canvasContext.fill();
}

function drawMaker(leftX, topY,width, height,drawColor) //colour factory
{
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY,width, height);

}