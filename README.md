
# HOW TO RUN THE GAME

1. Go to https://nodejs.org/en/ and download and install node.js
2. In Terminal, go to the direction of the 'pathtraces' folder
3. Run 'node index.js'
4. In Terminal, you should see which (local) address the game is running at.
5. Open any browser and type that address into it. You should now see the game. In Terminal you will still see key activities such as when a new player logs on/off, which room they are sent to and whether they send any data. If you play the game once and refresh the browser afterwards, you should be sent to the same room and then see the traces of the first (or other previous) player(s).


***

# FOLDER STRUCTURE


Below a short explanation of the 'pathtraces' folder structure and where to find what. It is roughly ordered by importance.

**config.js**
- this file contains all the important server and game settings; once everything is tested and works well, the only changes will be done here.

**index.js**
- this is the server-side script
- rooms are created here
- the server sends information such as traces to the client (see www/js/client.js)
- the server receives data from the client (see www/js/client.js)

# data 
- data will be saved here when the server is running in a file called JSON; this will need to be parsed later (i.e., transformed into an R readable format). It may be empty before being run for the first time.

# www

**index.html**
- This is the main html site that most of the program has access to. It redirects to the following two pages before returning to it (chiefly for instructions, reception of data, post-game questions and debrief)

**consent.html**
- This is the html site that checks whether consent has been given, i.e., whether both boxes have been ticked.

**game.html**
- This is the page where the actual panda game happens. It is an empty page except that it links to specific css.

**tutorial.html**
- This were the tutorial of the panda game happens. It is an empty page except that it links to specific css.

## css (subfolder of www)

**jspsych.css**
- style sheet (how the html appears) for the jspsych plugins

**panda.css**
- style sheet for the panda game (see www/game.html)

## images (subfolder of www)
- folder with all the images

## js (subfolder of www)

**timeline.js**
- this makes use of the jspsych plugins (contained in the folder above).
- It details the order of events, e.g. here: consent, instructions, game, questions, debrief.

**client.js**
- this regulates all incoming and outgoing communication with the server
- most importantly, it receives the config settings from the server and thus 'knows' where the previous traces are etc.
- it also creates the html objects that are then used for the game

**jquery-3..3.1.min.js**
- a library that makes js manipulation of html objects easier. See https://jquery.com/

**socket.io.js**
- a piece of software (a real-time engine) that enables client communication with the node server. See https://socket.io/

### jspych (subfolder of js)
- contains all jspych plugins. See https://www.jspsych.org

**jspsych.js**
**jspsych-call-function.js**
- this is the core of the jspsych functionality. It is downloaded and left as is.

**jspsych-external-html.js**
- This plugin links to external html, in this case away from index.html and to consent.html

**jspsych-game-html.js**
**jspsych-tutorial-html.js**
- This is a self-written plugin that contains all the game functionality and is based on the existing jspsych-external-html.js. It links to game.hmtl.
- jspsych-tutorial-html.js is a simplified version of jspsych-game-html.js without traces and honeywells

**jspsych-image-button-response.js**
**jspsych-instructions.js**
**jspsych-survey-multi-choice.js**
**jspsych-survey-text-check.js**
- These four are various plugins that can be used for (as the names suggest) multiple-choice questions, text entry etc.
