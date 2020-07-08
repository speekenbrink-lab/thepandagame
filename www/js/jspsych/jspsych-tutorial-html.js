/** (July 2012, Erik Weitnauer)
The html-plugin will load and display an external html pages. To proceed to the next, the
user might either press a button on the page or a specific key. Afterwards, the page get hidden and
the plugin will wait of a specified time before it proceeds.

documentation: docs.jspsych.org
*/

jsPsych.plugins['tutorial-html'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'tutorial-html',
    description: '',
    parameters: {
      url: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'URL',
        default: undefined,
        description: 'The url of the external html page'
      },
      cont_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Continue key',
        default: null,
        description: 'The key to continue to the next page.'
      },
      cont_btn: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Continue button',
        default: null,
        description: 'The button to continue to the next page.'
      },
      check_fn: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Check function',
        default: function() { return true; },
        description: ''
      },
      force_refresh: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Force refresh',
        default: false,
        description: 'Refresh page.'
      },
      // if execute_Script == true, then all javascript code on the external page
      // will be executed in the plugin site within your jsPsych test
      execute_script: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Execute scripts',
        default: true,
        description: 'If true, JS scripts on the external html file will be executed.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    display_element.innerHTML = task_html;

    var url = trial.url;
    if (trial.force_refresh) {
      url = trial.url + "?t=" + performance.now();
    }

    tutorialGrid = createTraceGrid();

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% IMAGES %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

    var pandaLeft = new Image();
    pandaLeft.src = "images/pandaLeft.png";
    var pandaRight = new Image();
    pandaRight.src = "images/pandaRight.png";
    var pandaHappyLeft = new Image();
    pandaHappyLeft.src = "images/pandaHappyLeft.png";
    var pandaHappyRight = new Image();
    pandaHappyRight.src = "images/pandaHappyRight.png";

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% REWARDS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

    // shades of one colour for the path traces
    var colours = chroma.scale(['#e8ffe1','#79885d']).mode('lch').colors(20);

    document.getElementById(canvas.concat(pad(maxDimensionX,padding),pad(0,padding))).style.background = "black";
    var pandaL = document.getElementById("canvasLeft");
    var ctxL = pandaL.getContext("2d");
    pandaLeft.onload = function() {
        ctxL.drawImage(pandaLeft, 0, 0, 60, 45);
    };

    document.getElementById(canvas.concat(pad(0,padding),pad(0,padding))).style.background = "black";
    var pandaR = document.getElementById("canvasRight");
    var ctxR = pandaR.getContext("2d");
    pandaRight.onload = function() {
        ctxR.drawImage(pandaRight, 0, 0, 60, 45);
    };

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% START %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

    if (_MAXDIMENSIONX % 2 == 0){ // if grid is of even size
      var currentX = _MAXDIMENSIONX/2; // starting one to the left of centre
    } else { // if not
      var currentX = (_MAXDIMENSIONX+1)/2; // starting in the centre
    }
    var currentY = _MAXDIMENSIONY; // starting canvas at the bottom

    tutorialGrid[currentX][currentY] += 1; // add one trace to starting point and...
    // ... update the frame and colour of the starting point
    document.getElementById(canvas.concat(pad(currentX,padding),pad(currentY,padding))).style.background = colours[tutorialGrid[currentX][currentY]]; // display current number of traces
    document.getElementById(canvas.concat(pad(currentX,padding),pad(currentY,padding))).style.border = "2px solid #000000"; // starting border

    let energy = document.getElementById("energy")
    document.getElementById("honey").innerHTML = honey;
    document.getElementById("points").innerHTML = "£ "+0.00;

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% MOVING %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

    $(document).keyup(function(event) {
      var moved = 0;
      if (energy.value > 0 & event.keyCode == 37 & currentX > 0){ // ASCII code for key 'Arrow Left' and condition it is not on the boundary
        document.getElementById(canvas.concat(pad(currentX,padding),pad(currentY,padding))).style.border = "2px solid #FFFFFF";
        currentX -= 1; // decrease X coordinate by 1
        moved = 1;
      } else if (energy.value > 0 & event.keyCode == 39 & currentX < maxDimensionX){ // 'right'
        document.getElementById(canvas.concat(pad(currentX,padding),pad(currentY,padding))).style.border = "2px solid #FFFFFF";
        currentX += 1; // increase X coordinate by 1
        moved = 1;
      } else if (energy.value > 0 & event.keyCode == 38 & currentY > 0) { // 'up'
        document.getElementById(canvas.concat(pad(currentX,padding),pad(currentY,padding))).style.border = "2px solid #FFFFFF";
        currentY -= 1; // decrease Y coordinate by 1
        moved = 1;
      } else if (energy.value > 0 & event.keyCode == 40 & currentY < maxDimensionY){ // 'down'
        document.getElementById(canvas.concat(pad(currentX,padding),pad(currentY,padding))).style.border = "2px solid #FFFFFF";
        currentY += 1; // increase Y coordinate by 1
        moved = 1;
      };
      if (moved == 1){
        tutorialGrid[currentX][currentY] += 1; // increase traces counter in the grid for that cell
        energy.value -= 1;
        document.getElementById("honey").innerHTML = honey.toFixed(0); // update honey counter
        document.getElementById(canvas.concat(pad(currentX,padding),pad(currentY,padding))).style.background = colours[tutorialGrid[currentX][currentY]]; // display current number of traces
        if (energy.value <= 0){ // check whether the game should be over now
          theEnd();
        } else {
          if (honey > 0){
            if ((currentX == 0 & currentY == 0) | (currentX == maxDimensionX & currentY == 0)){ // if panda is reached
              points += honey/_HONEYCONVERSION; // convert honey to points
              honey = 0; // set honey to zero
              document.getElementById("points").innerHTML = "£ " + points.toFixed(2); // update field
              document.getElementById("honey").innerHTML = honey.toFixed(0); // update field
              var c = document.getElementById("canvasLeft");
              var ctx = c.getContext("2d");
              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
              ctx.drawImage(pandaHappyLeft, 0, 0, 60, 45);
              var c = document.getElementById("canvasRight");
              var ctx = c.getContext("2d");
              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
              ctx.drawImage(pandaHappyRight, 0, 0, 60, 45);
              document.getElementById("bambooDisplayStart").style.visibility = "hidden"; // hide bamboo at start position
              document.getElementById("bambooDisplayEnd").style.visibility = "visible"; // show bamboo at end position
            };
          };
        document.getElementById(canvas.concat(pad(currentX,padding),pad(currentY,padding))).style.border = "2px solid #000000"; // set current frame to black
        };
      };
    });

    function theEnd(){
      alert("Oh no. You've run out of energy.\n\nYou'll be redirected shortly.");
      setTimeout(function(){jsPsych.finishTrial();}, 1000);
    };

    /*
    load(display_element, url, function() {
      var t0 = performance.now();
      var finish = function() {
        if (trial.check_fn && !trial.check_fn(display_element)) { return };
        if (trial.cont_key) { display_element.removeEventListener('keydown', key_listener); }
        var trial_data = {
          rt: performance.now() - t0,
          url: trial.url
        };
        display_element.innerHTML = '';
        jsPsych.finishTrial(trial_data);
      };

      // by default, scripts on the external page are not executed with XMLHttpRequest().
      // To activate their content through DOM manipulation, we need to relocate all script tags
      if (trial.execute_script) {
        for (const scriptElement of display_element.getElementsByTagName("script")) {
        const relocatedScript = document.createElement("script");
        relocatedScript.text = scriptElement.text;
        scriptElement.parentNode.replaceChild(relocatedScript, scriptElement);
        };
      }

      //if (trial.cont_btn) { display_element.querySelector('#'+trial.cont_btn).addEventListener('click', finish); }
      if (trial.cont_key) {
        var key_listener = function(e) {
          if (e.which == trial.cont_key) finish();
        };
        display_element.addEventListener('keydown', key_listener);
      }
    });*/
  };

  // helper to load via XMLHttpRequest
  function load(element, file, callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file, true);
    xmlhttp.onload = function(){
        if(xmlhttp.status == 200 || xmlhttp.status == 0){ //Check if loaded
            element.innerHTML = xmlhttp.responseText;
            callback();
        }
    }
    xmlhttp.send();
  }

  return plugin;
})();
