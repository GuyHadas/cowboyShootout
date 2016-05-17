var Game = require("./game.js");
var key = require("./keymaster.js");

function GameView(ctx) {
  this.ctx = ctx;
  this.game = new Game(false);
}

GameView.prototype.start = function() {
  document.addEventListener("keydown", keyDownHandler.bind(this), false);
  document.addEventListener("keyup", keyUpHandler.bind(this), false);
  this.animate();
};


function keyDownHandler(e) {
  if(e.keyCode === 39) {
    this.game.player.dir = "right";
  } else if(e.keyCode === 37) {
    this.game.player.dir = "left";
  } else if (e.keyCode === 32) {
      if (!this.game.initialized) {
        this.game.initialized = true;
        $('.instructions-wrapper').css("display", "none");
      } else {
        if (this.game.gameOver || this.game.gameWon) {
          this.game = new Game(true);
        } else {
          this.game.player.shoot(this.ctx);
        }
      }
  }
}

function keyUpHandler(e) {
  if(e.keyCode === 39) {
    if (this.game.player.dir !== "left") {
      this.game.player.dir = "stay";
    }
  }
  else if(e.keyCode === 37) {
    if (this.game.player.dir !== "right") {
      this.game.player.dir = "stay";
    }
  }
}
GameView.prototype.animate = function() {
  this.game.step();
  this.game.draw(this.ctx);

  requestAnimationFrame(this.animate.bind(this));
};


module.exports = GameView;
