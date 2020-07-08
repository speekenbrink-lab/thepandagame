// For Documentation see
// https://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files

var config = {};
config.debug = false;
config.prolific = true;
config.path = "/panda";
config.port = "8077";
config.local = false; // set to true for local game and to false for server games
config.local_server = "http://localhost:" + config.port;
config.remote_server = "https://palsws07.psychlangsci.ucl.ac.uk";

config.maximumplayers = 20; // number of participants in one room before it gets shut again
config.maxDimensionY = 30; // number of cells per column (+ 1, because it starts counting from 0); ideally even number
config.maxDimensionX = 60; // number of cells per row (+ 1, because it starts counting from 0); ideally even number
config.tableSize = 300; // width and height of table in px; 300 works on most screens
config.startingEnergy = 120;
config.startingHoney = 10;
config.honeyConversionRate = 300; // honey divided by the conversion rate = £ bonus payment
config.honeywellCentreReward = 10; // reward received in the centre of the well
config.honeywellFirstReward = 4; // reward received in the first layer around the well
config.honeywellSecondReward = 2; // reward received in the second layer around the well
config.honeyDepleting = 1;
config.noOfhoneywells = 6; // how many honeywells there are; too many will crash as it tries not to make them overlapping; <=6 is good for this size field

module.exports = config;
