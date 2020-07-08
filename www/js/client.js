// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% GENERAL INFORMATION %%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

/* THIS JS SCRIPT: This script constitutes the client side of the game.
Its main purpose is to regulate incoming and outgoing communications between
individual clients and server */

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  CLIENT  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

// Connection event (client makes themselves known to server)
var socket = io.connect('' + _SERVER_ADDRESS + '', {path: _PATH + '/socket.io', secure: true});

// The following are all set server side in script config.js
var DEVELOPER = _DEBUG;
const maxDimensionY = _MAXDIMENSIONY;
const maxDimensionX = _MAXDIMENSIONX;
const tableSize = _TABLESIZE;
const startingEnergy = _ENERGY;
const startingHoney = _HONEY;
const honeywellCentreReward = _CENTREREWARD;
const honeywellFirstReward = _FIRSTREWARD;
const honeywellSecondReward = _SECONDREWARD;
const noOfhoneywells = _HONEYWELLS;

//var possiblePandaPositions = ["left","right"];
//var randomNumber = Math.floor(Math.random()*possiblePandaPositions.length);
//var pandaPosition = possiblePandaPositions[randomNumber]; // side the panda lives on ("right" or "left")
var points = 0;

/* The following functions tell the client what to do with SERVER COMMUNICATIONS */
var room = 9999;
var player = 9999;
var condition = "undefined";
var grid = [];
var rewards = [];

socket.on("tracesData", function(traces){
  console.log("Server sent data");
  room = traces.data[0];
  player = traces.data[1];
  condition = traces.data[2];
  grid = traces.data[3];
  rewards = traces.data[4];
});

var data = [["decisionX","decisionY","movement","energy","honey","points","tracesUp","tracesLeft","tracesRight","tracesDown"]];

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% HTML %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

if (_MAXDIMENSIONY > _MAXDIMENSIONX){
  var padding = _MAXDIMENSIONY.toString().length; // how much padding is needed based on number of cells
  var cellSize = tableSize/_MAXDIMENSIONX; // given table size and number of cells, how big can one cell be
} else {
  var padding = _MAXDIMENSIONX.toString().length; // how much padding is needed based on number of cells
  var cellSize = tableSize/_MAXDIMENSIONY; // given table size and number of cells, how big can one cell be
}

var honey = _HONEY;

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% CANVASES %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

/* rather than having a static table in the hmtl file, this creates a table
with canvases based on the above dimensions. */
var canvas = "canvas" // placeholder variable

// this is the console
var task_html = "<div id='practiceDisplay'><p style='font-size:30px;'><strong>PRACTICE ROUND</strong><p></div>";
task_html += "<div id='consoleDisplay'><table style='border:0px solid #FFFFFF' align='center' width='"
task_html += _MAXDIMENSIONX*(cellSize+4);
task_html += "'><colgroup>";
task_html += "<col span='1' style='width: 7%;'>";
task_html += "<col span='1' style='width: 14%;'>";
task_html += "<col span='1' style='width: 23%;'>";
task_html += "<col span='1' style='width: 21%;'>";
task_html += "<col span='1' style='width: 8%;'>";
task_html += "<col span='1' style='width: 8%;'>";
task_html += "<col span='1' style='width: 8%;'>";
task_html += "<col span='1' style='width: 8%;'>";
task_html += "</colgroup><tbody><tr>";
task_html += "<td align='left'><img width='40' src='images/pandaPaws.png'></td>" // energy image
task_html += "<td align='left' style='font-family:tahoma; font-size:20px'>Energy left:</td>" // energy description
task_html += "<td><progress id='energy' value='100' max='100'></progress></td>"
task_html += "<td align='right' style='font-family:tahoma; font-size:20px'>Honey collected: </td>" // honey description
task_html += "<td align='right' style='font-family:tahoma; font-size:20px' id='honey'></td>"; // honey to be updated here
task_html += "<td align='right'><img width='50' src='images/honeyFountain.png'></td>" // honey image
task_html += "<td align='right' style='font-family:tahoma; font-size:20px'>Bonus: </td>" // reward description
task_html += "<td align='right' style='font-family:tahoma; font-size:20px' id='points'></td>"; // rewards to be updated here
task_html += "</tr></tbody></table><hr><p></p></div>"

// this is the panda image
task_html += "<div id='pandaDisplay'><table style='border:0px' align='center' width='"
task_html += _MAXDIMENSIONX*(cellSize+5);
task_html += "'><colgroup>";
task_html += "<col span='1' style='width: 5%;'>";
task_html += "<col span='1' style='width: 90%;'>";
task_html += "<col span='1' style='width: 5%;'>";
task_html += "</colgroup><tbody><tr>";
task_html += "<td align='left'><canvas id='canvasLeft' width='62' height='47'></canvas></td>"; // canvas for panda image left
task_html += "<td align='center'><img id='bambooDisplayEnd' style='visibility:hidden' width='80' src='images/honeySpreader.png'></td>"; // canvas for panda image left
task_html += "<td align='right'><canvas id='canvasRight' width='62' height='47'></canvas></td>"; // canvas for panda image right
task_html += "</tr></tbody></table></div>";

// this is the grid
task_html += "<div id='gridDisplay'>";
task_html += "<table align='center'><tbody>"; // create a new table
for (i = 0; i <= _MAXDIMENSIONY; i++){
  task_html += "<tr>" // create a new row
  for (j = 0; j <= _MAXDIMENSIONX; j++){ // add a new canvas in that row
    var xCoordinate = pad(i,padding); // canvas x coordinate
    var yCoordinate = pad(j,padding); // canvas y coordinate
    task_html += "<td><canvas width='"
    task_html += cellSize;
    task_html += "' height='"
    task_html += cellSize;
    task_html += "' style='border:2px solid #FFFFFF; display:block'; id='"
    task_html += canvas.concat(yCoordinate,xCoordinate); // create canvas id based on its location
    task_html += "'></canvas></td>"
  };
  task_html += "</tr>" // end of that row
}
task_html += "</tbody></table>";
task_html += "</div>"; // end of table

// this is the bamboo image
task_html += "<div id='bambooDisplayStart'><table style='border:0px' align='center' width='"
task_html += _MAXDIMENSIONX*(cellSize+4);
task_html += "'><tbody><tr>";
task_html += "<td align='center'><img width='80' src='images/honeySpreader.png'></td>" // bamboo image
task_html += "</tr></tbody></table></div>"

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%% HELPER FUNCTIONS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

/* This function allows to 'pad' a number e.g. turn '4' into '04'
It is needed to uniquely name the canvases which are defined by x and y coordinates,
otherwise x=1 and y=12 (112) would be the same as x=11 and y=2 (112) */
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

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function browserInfo() {
  return info = {
    'browser': navigator.userAgent,
    'screen': {
      'availWidth': window.screen.availWidth,
      'availHeight': window.screen.availHeight,
      'width': window.screen.width,
      'height': window.screen.height
    }
  };
}

function tryParseJsonString(str) {
    try {
      return  JSON.parse(str);
    } catch (e) {
        return str;
    }
    return str;
}

document.addEventListener("contextmenu", function(e){
  e.preventDefault();
}, false);

var reload_event_listener = function (e) {
    var confirmationMessage = "If you reload this page, you will exit the experiment. All your data will be lost. Are you sure you want to reload this page?";
    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
};

function createTraceGrid(){
  var grid = []
  for(var i = 0; i <= _MAXDIMENSIONX; i++) {
      grid[i] = []; // fill with rows
      for(var j = 0; j <= _MAXDIMENSIONY; j++) {
          grid[i][j] = 0; // fill with cells that are now all 0
      };
  };
  return grid;
};
