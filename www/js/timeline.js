/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%% CONSENT %%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

var check_consent = function(elem) {
  if(_DEBUG) return true;
  if (document.getElementById('consent_checkbox1').checked) {
    return true;
  }
  else {
    alert("If you wish to participate, you must agree to the statement above by checking the box next to the statement");
    return false;
  }
  return false;
};

var consent = {
  type:'external-html',
  url: "consent.html",
  cont_btn: "consent_button",
  check_fn: check_consent,
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%% PROLIFIC %%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

// welcome page with prolific or other id
var check_id = function(elem) {
  if(!_PROLIFIC) return true;
  var matches = elem.querySelectorAll('div.jspsych-survey-text-question');
  for(var index=0; index<matches.length; index++){
    var val = matches[index].querySelector('textarea, input').value;
    if(val.length == 0) {
      alert("You must fill in this field to proceed.")
      return false;
    }
  }
  return true;
};

var welcomeProlific = {
  type: 'survey-text-check',
  preamble: '<div style="margin: 50px"><h2>Important!</h2><div class="border"><p>To proceed, please provide the ID you received from Prolific <strong>exactly</strong> as you were given.</p><p>We won\'t be able to pay you otherwise.</p></div>',
  questions: [{prompt: '<p class="middle"><b>Prolific ID:</b></p>', rows: 1, columns: 30, input_type: 'text', step: 1, min: 0, max: 1000000000000000000000000}],
  check_fn: check_id,
};

/*var welcome = {
  type: 'survey-text-check',
  preamble: '<div style="margin: 50px"><h2>Important!</h2><div class="border"><p>If you would like to receive credits for this study, please enter your <strong>email address</strong> here.</p><p>Otherwise we won\'t be able to grant you the credits.</p></div>',
  questions: [{prompt: '<p class="middle"><b>Email address:</b></p>', rows: 1, columns: 30, input_type: 'text', step: 1, min: 0, max: 1000000000000000000000000}],
  check_fn: check_id,
};
*/

// for lab members
var welcome = {
  type: 'survey-text-check',
  preamble: '<div style="margin: 50px"><div class="border"><p>Please enter your <strong>name</strong> here so we can follow up with you in case there are any questions. Thank you!</p></div>',
  questions: [{prompt: '<p class="middle"><b>Name:</b></p>', rows: 1, columns: 30, input_type: 'text', step: 1, min: 0, max: 1000000000000000000000000}],
  check_fn: check_id,
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%% DEMOGRAPHICS %%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

var gender = {
  type: 'survey-multi-choice',
  questions: [
    {prompt: "First, we would like to ask you a few things about yourself.<br><br><strong>What is your gender?</strong>", name: 'Gender', options: ["Female", "Male", "Other", "Prefer not to say"], required: true},
  ],
};

var check_age = function(elem) {
  var matches = elem.querySelectorAll('div.jspsych-survey-text-question');
  for(var index=0; index<matches.length; index++){
    var val = matches[index].querySelector('textarea, input').value;
    if (val < 18 | val > 99) {
      alert("Please enter your age.\nYou have to be at least 18 if you want to participate.")
      return false
    };

  }
  return true;
};

var age = {
  type: 'survey-text-check',
  questions: [{prompt: '<p class="middle"><strong>What is your age?</strong></p>', name: 'Age', rows: 1, columns: 10, input_type: 'number', step: 1, min: 18, max: 99}],
  check_fn: check_age,
  on_finish: function(){
   player.age = tryParseJsonString(jsPsych.data.getLastTrialData().json())[0].responses.substr(7,tryParseJsonString(jsPsych.data.getLastTrialData().json())[0].responses.length-9);
  },
};


/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%% INSTRUCTIONS %%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

var instructionsFirstPlayer = {
  type: "instructions",
  pages: [
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot1.png' height='300px'></img><p style='margin: 50px'>There are two hungry panda bears on the other side of a mountain range!<br>You can feed them by <strong>delivering the honey in your pot to one of the pandas </strong>(or even to both).</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot2.png' height='300px'></img><p style='margin: 50px'>To make the pandas happy, take the honey pot to a panda.<br>Don’t worry if you reach only one of the pandas, they will share their food with each other anyway!<br><strong>The honey you deliver will then convert into bonus payments</strong> that you will receive at the end of the game.</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot3.png' height='300px'></img><p style='margin: 50px'>The problem is that you have a limited amount of energy – the pink bar indicates how much energy you have left.<br><strong>When you run out of energy, the game will be over.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot4.1.png' height='300px'></img><p style='margin: 50px'>To increase your bonus payment, try to find more honey. <strong>There are six hidden honeywells in the playing field.</strong> The tile in the center of the honeywell contains the most honey, adjacent tiles contain less honey and the outermost tiles contain the least amount of honey. <strong>To convert the honey you collected to bonus payments you must reach a panda before you run out of energy.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot5.png' height='300px'></img><p style='margin: 50px'>You will only see the honeywells when you step on them. The amount of honey you have collected is indicated above.<br>The honey flows slowly from the wells so <strong>each time you step on the same honey tile it will be worth less and less</strong>. The honeywells replenish quickly so <strong>you need not worry if previous players have found the honey before you, there is still plenty of honey for you!</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot6.png' height='300px'></img><p style='margin: 50px'>Tiles turn green when you step on them – the darker a tile the more it has been walked on.</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/Practice Round.png' height='150px'></img><p style='margin: 50px'><strong>Use the four arrow keys of your keyboard to move around.</strong><br><br>Take as much time to go back now and re-read these instructions as you like.<br>Are you ready for the practice round? Click ‘Next’ to try the game once before the actual game starts.</p>"],
  show_clickable_nav: true,
  timing_post_trial: 2000
};

var instructionsBaseline = {
  type: "instructions",
  pages: [
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot1.png' height='300px'></img><p style='margin: 50px'>There are two hungry panda bears on the other side of a mountain range!<br>You can feed them by <strong>delivering the honey in your pot to one of the pandas </strong>(or even to both).</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot2.png' height='300px'></img><p style='margin: 50px'>To make the pandas happy, take the honey pot to a panda.<br>Don’t worry if you reach only one of the pandas, they will share their food with each other anyway!<br><strong>The honey you deliver will then convert into bonus payments</strong> that you will receive at the end of the game.</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot3.png' height='300px'></img><p style='margin: 50px'>The problem is that you have a limited amount of energy – the pink bar indicates how much energy you have left.<br><strong>When you run out of energy, the game will be over.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot4.1.png' height='300px'></img><p style='margin: 50px'>To increase your bonus payment, try to find more honey. <strong>There are six hidden honeywells in the playing field.</strong> The tile in the center of the honeywell contains the most honey, adjacent tiles contain less honey and the outermost tiles contain the least amount of honey. <strong>To convert the honey you collected to bonus payments you must reach a panda before you run out of energy.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot5.png' height='300px'></img><p style='margin: 50px'>You will only see the honeywells when you step on them. The amount of honey you have collected is indicated above.<br>The honey flows slowly from the wells so <strong>each time you step on the same honey tile it will be worth less and less</strong>. The honeywells replenish quickly so <strong>you need not worry if previous players have found the honey before you, there is still plenty of honey for you!</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot6.png' height='300px'></img><p style='margin: 50px'>Green tiles indicate that these have been stepped on by previous players – the darker a tile the more it has been walked on.</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/Practice Round.png' height='150px'></img><p style='margin: 50px'><strong>Use the four arrow keys of your keyboard to move around.</strong><br><br>Take as much time to go back now and re-read these instructions as you like.<br>Are you ready for the practice round? Click ‘Next’ to try the game once before the actual game starts.</p>"],
  show_clickable_nav: true,
  timing_post_trial: 2000
};

var instructionsEasier = {
  type: "instructions",
  pages: [
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot1.png' height='300px'></img><p style='margin: 50px'>There are two hungry panda bears on the other side of a mountain range!<br>You can feed them by <strong>delivering the honey in your pot to one of the pandas</strong> (or even to both).</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot2.png' height='300px'></img><p style='margin: 50px'>To make the pandas happy, take the honey pot to a panda.<br>Don’t worry if you reach only one of the pandas, they will share their food with each other anyway!<br><strong>The honey you deliver will then convert into bonus payments</strong> that you will receive at the end of the game.</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot3.png' height='300px'></img><p style='margin: 50px'>The problem is that you have a limited amount of energy – the pink bar indicates how much energy you have left.<br><strong>When you run out of energy, the game will be over.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot4.1.png' height='300px'></img><p style='margin: 50px'>To increase your bonus payment, try to find more honey. <strong>There are six hidden honeywells in the playing field.</strong> The tile in the center of the honeywell contains the most honey, adjacent tiles contain less honey and the outermost tiles contain the least amount of honey. <strong>To convert the honey you collected to bonus payments you must reach a panda before you run out of energy.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot5.png' height='300px'></img><p style='margin: 50px'>You will only see the honeywells when you step on them. The amount of honey you have collected is indicated above.<br>The honey flows slowly from the wells so <strong>each time you step on the same honey tile it will be worth less and less</strong>. The honeywells replenish quickly so <strong>you need not worry if previous players have found the honey before you, there is still plenty of honey for you!</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot6.png' height='300px'></img><p style='margin: 50px'>Green tiles indicate that these have been stepped on by previous players – the darker a tile the more it has been walked on. <strong>Importantly, walking on green tiles requires less energy. The darker the tile, the less energy it consumes.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/Practice Round.png' height='150px'></img><p style='margin: 50px'><strong>Use the four arrow keys of your keyboard to move around.</strong><br><br>Take as much time to go back now and re-read these instructions as you like.<br>Are you ready for the practice round? Click ‘Next’ to try the game once before the actual game starts.</p>"],
  show_clickable_nav: true,
  timing_post_trial: 2000
};

var instructionsHarder = {
  type: "instructions",
  pages: [
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot1.png' height='300px'></img><p style='margin: 50px'>There are two hungry panda bears on the other side of a mountain range!<br>You can feed them by <strong>delivering the honey in your pot to one of the pandas</strong> (or even to both).</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot2.png' height='300px'></img><p style='margin: 50px'>To make the pandas happy, take the honey pot to a panda.<br>Don’t worry if you reach only one of the pandas, they will share their food with each other anyway!<br><strong>The honey you deliver will then convert into bonus payments</strong> that you will receive at the end of the game.</p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot3.png' height='300px'></img><p style='margin: 50px'>The problem is that you have a limited amount of energy – the pink bar indicates how much energy you have left.<br><strong>When you run out of energy, the game will be over.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot4.1.png' height='300px'></img><p style='margin: 50px'>To increase your bonus payment, try to find more honey. <strong>There are six hidden honeywells in the playing field.</strong> The tile in the center of the honeywell contains the most honey, adjacent tiles contain less honey and the outermost tiles contain the least amount of honey. <strong>To convert the honey you collected to bonus payments you must reach a panda before you run out of energy.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot5.png' height='300px'></img><p style='margin: 50px'>You will only see the honeywells when you step on them. The amount of honey you have collected is indicated above.<br>The honey flows slowly from the wells so <strong>each time you step on the same honey tile it will be worth less and less</strong>. The honeywells replenish quickly so <strong>you need not worry if previous players have found the honey before you, there is still plenty of honey for you!</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/screenShot6.png' height='300px'></img><p style='margin: 50px'>Green tiles indicate that these have been stepped on by previous players – the darker a tile the more it has been walked on. <strong>Importantly, walking on green tiles requires more energy. The darker the tile, the more energy it consumes.</strong></p>",
    "<h2>INSTRUCTIONS</h2><img src='images/Practice Round.png' height='150px'></img><p style='margin: 50px'><strong>Use the four arrow keys of your keyboard to move around.</strong><br><br>Take as much time to go back now and re-read these instructions as you like.<br>Are you ready for the practice round? Click ‘Next’ to try the game once before the actual game starts.</p>"],
  show_clickable_nav: true,
  timing_post_trial: 2000
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%% TUTORIAL %%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

var tutorial = {
  type:'tutorial-html',
  url: "tutorial.html",
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%% INSTRUCTIONS REMINDER %%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

var instructionsSummaryFirstPlayer = {
  type: "instructions",
  pages: [
    "<h2>SUMMARY OF INSTRUCTIONS</h2><p style='margin: 50px'>Before the actual game starts, please remember:</p><p><strong>You must reach the panda to convert any honey to bonus payments.<br>The game is over when you run out of energy.</strong><br><br>Please do not refresh your browser during the game. You won't be able to complete the study if you do.</p><p>When you are ready, click ‘Next’ to start the game. </p>"],
  show_clickable_nav: true,
  timing_post_trial: 2000
};
var instructionsSummary = {
  type: "instructions",
  pages: [
    "<h2>SUMMARY OF INSTRUCTIONS</h2><p style='margin: 50px'>Before the actual game starts, please remember:</p><p><strong>You must reach the panda to convert any honey to bonus payments.<br>Green tiles mean that others have walked there before you.<br>The game is over when you run out of energy.</strong><br><br>Please do not refresh your browser during the game. You won't be able to complete the study if you do.</p><p>When you are ready, click ‘Next’ to start the game. </p>"],
  show_clickable_nav: true,
  timing_post_trial: 2000
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%% GAME %%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

var game = {
  type:'game-html',
  url: "game.html",
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%% POST-GAME Qs %%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

var strategy = {
  type: 'survey-text-check',
  preamble: '<div style="margin: 50px"><div class="border"><p>We would now like to ask you a few questions about the game.</p></div>',
  button_label: 'Next',
  questions: [{prompt: '<p><b>Please briefly describe your strategy in the game. What were your decisions based on?<b></p>', rows: 10, columns: 60, input_type: 'text', step: 1, min: 0, max: 1000000000000000000000000}],
  check_fn: check_id,
};


var scale = [
  "Strongly<br><b>Disagree</b>",
  "Disagree",
  "Somewhat Disagree",
  "Neutral",
  "Somewhat Agree",
  "Agree",
  "Strongly<br><b>Agree</b>"
];

var scale2 = [
  "<i>I did not<br>reach the panda</i>",
  "Strongly<br><b>Disagree</b>",
  "Disagree",
  "Somewhat Disagree",
  "Neutral",
  "Somewhat Agree",
  "Agree",
  "Strongly<br><b>Agree</b>"
];

var multiplechoice1 = {
  type: 'survey-likert',
  preamble: 'Please answer these questions as spontaneously and truthfully as possible.<br>There are no right or wrong answers.',
  questions: [
    {prompt: "<b>I walked on the green tiles as much as possible.</b>", name: 'DarkTiles', labels: scale, required: true},
    {prompt: "<b>I walked on the white tiles as much as possible.</b>", name: 'WhiteTiles', labels: scale, required: true},
    {prompt: "<b>I followed the green tiles to find honeywells.</b>", name: 'Exploitation', labels: scale, required: true},
    {prompt: "<b>I avoided the green tiles to find honeywells.</b>", name: 'Exploration', labels: scale, required: true},
    {prompt: "<b>I tried to collect as much honey as possible.</b>", name: 'Honey', labels: scale, required: true},
    {prompt: "<b>I tried to reach one of the pandas as quickly as possible.</b>", name: 'Panda', labels: scale, required: true}
  ],
  randomize_question_order: true
};

var multiplechoice1FirstPlayer = {
  type: 'survey-likert',
  preamble: 'Please answer these questions as spontaneously and truthfully as possible.<br>There are no right or wrong answers.',
  questions: [
    {prompt: "<b>I tried to collect as much honey as possible.</b>", name: 'Honey', labels: scale, required: true},
    {prompt: "<b>I tried to reach one of the pandas as quickly as possible.</b>", name: 'Panda', labels: scale, required: true}
  ],
  randomize_question_order: true
};

var multiplechoice2 = {
  type: 'survey-likert',
  preamble: 'Please answer these questions as spontaneously and truthfully as possible.<br>There are no right or wrong answers.',
  questions: [
    {prompt: "<b>After I reached the panda, there was no energy left to do anything else.</b>", name: 'NoEnergy', labels: scale2, required: true},
    {prompt: "<b>After I reached the panda, I randomly pressed the arrow keys.</b>", name: 'Random', labels: scale2, required: true},
    {prompt: "<b>After I reached the panda, I tried to discover a new honeywell.</b>", name: 'Honeywell', labels: scale2, required: true},
    {prompt: "<b>After I reached the panda, I tried to return to a honeywell to gain more honey.</b>", name: 'Exploration', labels: scale2, required: true},
    {prompt: "<b>After I reached the panda, I tried to reach the other panda.</b>", name: 'Panda', labels: scale2, required: true},
    {prompt: "<b>After I reached the panda, I tried to return to a honeywell to make it more visible to others.</b>", name: 'CooperationHoney', labels: scale2, required: true},
    {prompt: "<b>After I reached the panda, I stepped on tiles in a manner that would help others retain more energy.</b>", name: 'CooperationEnergy', labels: scale2, required: true}
  ],
  randomize_question_order: true
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%% SEND DATA TO SERVER %%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

var sendDataEvent = function(data){
  socket.emit('send-data', data);
};

var sendData = {
  type: 'call-function',
  func: function(){
    var dat = {
      'id': socket.id,
      'room': room,
      'player': player,
      'condition': condition,
      'responses': tryParseJsonString(jsPsych.data.get().json()),
      'browser': browserInfo(),
      'browser_interaction': tryParseJsonString(jsPsych.data.getInteractionData().json()),
      'reward': points,
    }
    console.log(dat);
    sendDataEvent(dat);
    window.removeEventListener("beforeunload", reload_event_listener);
  }
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%% DEBRIEF %%%%%%%%%%%%%%%%%%%%%%%% */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

var debrief = {
  type: "instructions",
  pages: ["<h4>Thank you for participating in this experiment!</h4><p>The aim of the experiment is to explore how information about paths created by previous players (i.e., green tiles) influences the paths taken by subsequent players. More specifically, we are interested in understating how the cost associated with following the steps of previous players affects the paths formed by subsequent players. The energy cost of following existing paths varies between different groups of players - for one group the energy cost is not associated with green tiles; for the second group, following green tiles is less costly than walking untrodden tiles; for the third group, following green tiles is more costly than walking untrodden tiles. In our analysis we want to find out what effect these different costs have on the strategies players use to maximize rewards.</p><p>The data collected during the course of the research is anonymous. You will not be able to be identified in any ensuing reports or publications. Also note that you are able to withdraw your data any time, if requested, without providing an explanation.</p><p>Should you have any further queries, please contact Tal Arkushin (tal.arkushin.19@ucl.ac.uk) or Sabine Topf (sabine.topf.14@ucl.ac.uk).</p>"
  ],
  show_clickable_nav: true,
  timing_post_trial: 2000
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

// create the experiment timeline
var timeline = [];

// start the experiment
setTimeout(function(){
  timeline.push(consent);
  if(_PROLIFIC){timeline.push(welcomeProlific)} else {timeline.push(welcome)};
  timeline.push(gender);
  timeline.push(age);
  if (player == 0){
    timeline.push(instructionsFirstPlayer)
  } else if (player != 0 & condition == "conditionEasier"){
    timeline.push(instructionsEasier);
  } else if (player != 0 & condition == "conditionHarder"){
    timeline.push(instructionsHarder);
  } else {
    timeline.push(instructionsBaseline);
  };
  timeline.push(tutorial);
  if (player == 0){
    timeline.push(instructionsSummaryFirstPlayer);
  } else {
    timeline.push(instructionsSummary);
  }
  timeline.push(game);
  timeline.push(strategy);
  if (player ==0){
    timeline.push(multiplechoice1FirstPlayer);
  } else {
    timeline.push(multiplechoice1);
  };
  timeline.push(multiplechoice2);
  timeline.push(sendData)
  timeline.push(debrief);

  jsPsych.init({
    timeline: timeline,
    on_finish: function() {
    //  jsPsych.data.displayData(); // displays trial data in window
    window.location = String("https://app.prolific.co/submissions/complete?cc=703A0860") // redirect to the correct prolific address
    }
  });
}, 300);
