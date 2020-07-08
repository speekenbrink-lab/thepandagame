// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% GENERAL INFORMATION %%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

var config = require(__dirname + '/config');

var MAXIMUMPLAYERS = config.maximumplayers;

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%% EXPRESS & SOCKET PACKAGES %%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

// This section follows http://rubentd.com/blog/creating-a-multiplayer-game-with-node-js/
// setting up server
var express = require("express");
var app = express();
app.use(config.path,express.static(__dirname + "/www"));
var server = app.listen(process.env.PORT || config.port, function(){
  var port = server.address().port;
  var address = ""
  if(config.local) {
    address += config.local_server + config.path + '/';
  } else {
    address += config.remote_server + config.path + '/';
  }
  console.log("Server running at port %s", port, Date());
  console.log("Server should be available at %s", address);
});
// allowing clients to dock
var io = require('socket.io')(server, {path: config.path + '/socket.io'});

// construct settings.js file with settings from config.js
app.get(config.path + '/js/settings.js', function(req, res){
  res.setHeader('Content-type', 'text/javascript');
  var global_string = 'var _DEBUG = ' + config.debug + '; ';
  if(config.local) {
    global_string += 'var _SERVER_ADDRESS = "' + config.local_server + '"; ';
  } else {
    global_string += 'var _SERVER_ADDRESS = "' + config.remote_server + '"; ';
  }
  global_string += 'var _PATH = "' + config.path + '"; ';
  global_string += 'var _PROLIFIC = ' + config.prolific + '; ';
  global_string += 'var _MAXDIMENSIONY = ' + config.maxDimensionY + '; ';
  global_string += 'var _HONEYCONVERSION = ' + config.honeyConversionRate + '; ';
  global_string += 'var _MAXDIMENSIONX = ' + config.maxDimensionX + '; ';
  global_string += 'var _TABLESIZE = ' + config.tableSize + '; ';
  global_string += 'var _ENERGY = ' + config.startingEnergy + '; ';
  global_string += 'var _HONEY = ' + config.startingHoney + '; ';
  global_string += 'var _CENTREREWARD = ' + config.honeywellCentreReward + '; ';
  global_string += 'var _FIRSTREWARD = ' + config.honeywellFirstReward + '; ';
  global_string += 'var _SECONDREWARD = ' + config.honeywellSecondReward + '; ';
  global_string += 'var _DEPLETE = ' + config.honeyDepleting + '; ';
  global_string += 'var _HONEYWELLS = ' + config.noOfhoneywells + '; ';
  res.send(global_string);
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  SERVER  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

// initialize three empty rooms with:
// ROOM NUMBER, NUMBER OF PREVIOUS PLAYERS, CONDITION, TRACESGRID, REWARDGRID, CURRENT PLAYER
var ROOMS = [
  [1,0,"conditionBaseline",[],[],],
  [2,0,"conditionEasier",[],[],],
  [3,0,"conditionHarder",[],[],]
];
// Initialize emoty grids
ROOMS[0][3] = createTraceGrid()
ROOMS[1][3] = createTraceGrid()
ROOMS[2][3] = createTraceGrid()

// Three rooms (conditions) should always share the same honeywell structure
var setOfHoneywells = createRewardGrid()
ROOMS[0][4] = setOfHoneywells
ROOMS[1][4] = setOfHoneywells
ROOMS[2][4] = setOfHoneywells

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  DATA: JSON  %%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

// to write data to JSON format
var fs = require('fs');
var path = require('path');

var date = new Date(); // add today's time and date to file
var y = date.getFullYear().toString();
var m = (date.getMonth()+1).toString();
if (m.length == 1){
  m = "0" + m;
};
var d = date.getDate().toString();
if (d.length == 1){
  d = "0" + d;
};
var h = date.getHours().toString();
if (h.length == 1){
  h = "0" + h;
};
var min = date.getMinutes().toString();
if (min.length == 1){
  min = "0" + min;
};

var jsonPath = path.join(__dirname, 'data/', y + m + d + '-' + h + min + '-' +'SessionData.json');
var sessionData = { table: []}; // creates empty JSON file

sessionData.table.push({Session: date})
var json = JSON.stringify(sessionData); // translate data into string
fs.writeFile(jsonPath, json, 'utf8', function(err){if (err){console.log(err)}}); // the file will be in root (e.g., for Mac: Users/username/)

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%% CONNECTION EVENTS %%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

io.on("connection", function(socket){
  console.log(socket.id + " connected " + Date());

  // when player connects, check whether there is an empty room
  var playerAdded = false;
  for (var i = 0; i <= ROOMS.length-1; i++) { // // find a room that contains no player
    if (ROOMS[i].length < 6 && ROOMS[i][1] < MAXIMUMPLAYERS){ // whether no player is already in there
      ROOMS[i].push(socket.id); // then push current player into room
      console.log("Player " + socket.id + " was sent to room " + ROOMS[i][0])
      // SEND DATA OF THIS ROOM TO PLAYER
      var data = ROOMS[i];
      io.to(socket.id).emit("tracesData", {data});
      var playerAdded = true;
      break; // found room, done
    }
  };
  if (!playerAdded) { // if no empty room has been found in previous ones (i.e., player not yet added)
    //push three new rooms
    var currentRooms = ROOMS.length
    setOfHoneywells = createRewardGrid();
    ROOMS.push([currentRooms+1,0,"conditionBaseline", [[],[]], [[],[]] ]);
    ROOMS.push([currentRooms+2,0,"conditionEasier", [[],[]], [[],[]] ]);
    ROOMS.push([currentRooms+3,0,"conditionHarder", [[],[]] , [[],[]] ]);
    ROOMS[ROOMS.length-3][3] = createTraceGrid();
    ROOMS[ROOMS.length-2][3] = createTraceGrid();
    ROOMS[ROOMS.length-1][3] = createTraceGrid();
    ROOMS[ROOMS.length-3][4] = setOfHoneywells;
    ROOMS[ROOMS.length-2][4] = setOfHoneywells;
    ROOMS[ROOMS.length-1][4] = setOfHoneywells;
    ROOMS[ROOMS.length-3].push(socket.id); // and push current player into the first of these new rooms
    console.log("Player " + socket.id + " was sent to room " + ROOMS[ROOMS.length-1][0])
    var data = ROOMS[ROOMS.length-3]
    io.to(socket.id).emit("tracesData", {data});
  };

  socket.on("send-data", function(clientData){
    console.log(socket.id + " SENDS DATA");

    for (var i = 0; i <= ROOMS.length-1; i++){ // look for player id in Rooms
      if (contains(ROOMS[i],socket.id)){
        var room = i; // if found, remember
      };
    };

    // SAVE DATA IN JSON FORMAT FOR ANALYSIS
    fs.readFile(jsonPath, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        // check whether data sent is valid otherwise skip using try and catch
        try {
          sessionData = JSON.parse(data); // now session data is an object
          sessionData.table.push(ROOMS[room]); // add starting state of room
          sessionData.table.push(clientData); // add client data
          json = JSON.stringify(sessionData); // convert session data back to json
          fs.writeFile(jsonPath, json, 'utf8', function(err){ // write it back
            if (err){
              console.log(JSON.stringify(data));
              console.log(err);
            };
          });
        } catch(err) {
          console.log(JSON.stringify(data));
          console.log(err);
        }
        console.log("JSON UPDATED")
    }});

    // EXTRACT DATA OF CHOICES FOR NEXT PLAYER IN THE SAME ROOM
    // wrapped in a timer function otherwise JSON is written after traces are added,
    // adding the current player's traces as well.
    var timer;
    timer = setTimeout(function(){
      var gameid = undefined;
      for (var i = 0; i < clientData.responses.length; i++){
        if (clientData.responses[i].trial_type == "game-html"){ // find the game data
          gameid = i;
        }
      }
      if (gameid != undefined){
        var count = Object.keys(clientData.responses[gameid]).length; // find out how often people walked
        var newGrid = clientData.responses[gameid][count-5]; // find the last grid to replace the old grid in this room

        // ADD TRACES AND REMOVE CURRENT PLAYER FROM THAT ROOM ONLY IF SENT
        // Otherwise pretend it never happened...
        ROOMS[room][3] = newGrid; // replace the grid of this room with the new grid
        ROOMS[room][1] += 1; // add one to the counter of players
      };
      ROOMS[room].splice(5,1) // remove player to open up room again
      console.log("Player " + socket.id + " was removed from room " + ROOMS[room][0])
    },100);
  });

  // when a connection gets lost, delete this player from room
  socket.on("disconnect", function() {
    console.log(socket.id + " disconnected " + Date())
    for (var i = 0; i <= ROOMS.length-1; i++){ // look for player id in Rooms
      if (contains(ROOMS[i],socket.id)){
        ROOMS[i].splice(5,1) // remove player to open up room again
        console.log("Player " + socket.id + " was removed from room " + ROOMS[i][0])
      };
    };
  })
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%% HELPER FUNCTIONS %%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

function isDivisibleByThree(num) {return (num % 3) === 0;}
function isDivisibleByTwo(num) {return (num % 2) === 0;}

function pad(number, length) {
  var num = '' + number;
  while (num.length < length) {
      num = '0' + num;
  }
  return num;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function contains(a, e) {
  var k = a.length;
  while (k--) {
     if (a[k] === e) {
         return true;
     };
  };
  return false;
};

// add an empty grid to the first room
function createTraceGrid(){
  var grid = []
  for(var i = 0; i <= config.maxDimensionX; i++) {
      grid[i] = []; // fill with rows
      for(var j = 0; j <= config.maxDimensionY; j++) {
          grid[i][j] = 0; // fill with cells that are now all 0
      };
  };
  return grid;
};

// add reward structure for this room
function createRewardGrid(){
  var rewards = [];
  for (var i = 0; i <= config.maxDimensionX; i++) {
      rewards[i] = []; // fill with rows
      for (var j = 0; j<= config.maxDimensionY; j++) {
        rewards[i][j] = 0; // assign each value with 0
      };
  };

  var existingHoneywells = 0;
  var honeywells = [[0],[0]]; // location of honeywells with placeholders to start with
  while (existingHoneywells < config.noOfhoneywells){
    // create the centre of the honeywell to be far enough within the dimensions of the grid so that a full well fits
    // ...and ensure additional honeywells don't overlap with existing honeywells
    var honeywellCentreX = 0;
    var closestRange = []; for (var i = -5; i <= 5; i++){closestRange.push(0+i)};
    while (honeywellCentreX < 2 | honeywellCentreX > config.maxDimensionX-2 | closestRange.includes(honeywellCentreX)){
      var honeywellCentreX = getRandomInt(config.maxDimensionX);
      var closest = honeywells[0].reduce(function(prev, curr) {
        return (Math.abs(curr - honeywellCentreX) < Math.abs(prev - honeywellCentreX) ? curr : prev);
      });
      var closestRange = []; for (var i = -5; i <= 5; i++){closestRange.push(closest+i)};
    }
    var honeywellCentreY = 0;
    while(honeywellCentreY < 2 | honeywellCentreY > config.maxDimensionY-2 | closestRange.includes(honeywellCentreY)){
      var honeywellCentreY = getRandomInt(config.maxDimensionY);
    }
    honeywells[0].push(honeywellCentreX);
    honeywells[1].push(honeywellCentreY);
    rewards[honeywellCentreX][honeywellCentreY] = config.honeywellCentreReward;

    // create the first layer around the honeywell centre
    var firstLayer = [[-1,0],[-1,-1],[-1,+1],[+1,0],[+1,-1],[+1,+1],[0,-1],[0,+1]]
    for (var i = 0; i < firstLayer.length; i++){
      var x = firstLayer[i][0];
      var y = firstLayer[i][1];
      rewards[honeywellCentreX+x][honeywellCentreY+y] = config.honeywellFirstReward;
    };

    // create the second layer around the honeywell centre
    var secondLayer = [[-2,-2],[-1,-2],[0,-2],[+1,-2],[+2,-2],[-2,-1],[+2,-1],[-2,0],[+2,0],[-2,+1],[-2,+1],[+2,+1],[-2,+2],[-1,+2],[0,+2],[+1,+2],[+2,+2]]
    for (var i = 0; i < secondLayer.length; i++){
      var x = secondLayer[i][0];
      var y = secondLayer[i][1];
      rewards[honeywellCentreX+x][honeywellCentreY+y] = config.honeywellSecondReward;
    };
    existingHoneywells++;
  };
  honeywells[0].shift() // remove initial placeholders to only remember the actual honeywells
  honeywells[1].shift() // remove initial placeholders to only remember the actual honeywells
  return rewards;
};
