var GameView = require("./gameView.js");
var key = require("./keymaster.js");

var ctx = document.getElementById("game-canvas").getContext("2d");
var gv = new GameView(ctx);
gv.start();
