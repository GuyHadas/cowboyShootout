var Ball = require("./ball.js");
var Bullet = require("./bullet.js");
var Player = require("./player.js");
var Util = require("./util.js");


function Game(initialized) {
  this.DIM_X = 1000;
  this.DIM_Y = 600;
  this.balls = [];
  this.level = 1;
  this.addBalls();
  this.player = new Player([500, 580], this);
  this.gameOver = false;
  this.gameWon = false;
  this.initialized = initialized;
}

var LEVEL_MAP = Util.LEVEL_MAP;


Game.prototype.allObjects = function() {
  return this.balls.concat(this.player);
};

Game.prototype.clearBalls = function() {
  this.balls = [];
};

Game.prototype.removeBall = function(ball) {
  var index = this.balls.indexOf(ball);
  this.balls.splice(index, 1);
};

Game.prototype.addBalls = function() {
  var self = this;
  LEVEL_MAP[this.level].forEach(function(ball) {
    self.balls.push(new Ball([ball.startX, 500], [2, 2], ball.size, self));
  });
};

Game.prototype.addBall = function(ball) {
  this.balls.push(new Ball(
    [ball.startX, ball.startY],
    ball.vel,
    ball.size,
    this
  ));
};

Game.prototype.split = function(ball) {
  this.removeBall(ball);

  this.addBall({
    startX: ball.pos[0],
    startY: ball.pos[1],
    vel: [2, -4],
    size: (ball.size - 1) });

  this.addBall({
    startX: ball.pos[0],
    startY: ball.pos[1],
    vel: [-2, -4],
    size: (ball.size - 1)
  });
};

Game.prototype.draw = function(ctx) {
  if (this.initialized) {
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    this.allObjects().forEach(function(object) {
      object.draw(ctx);
    });

    ctx.font = "24px Open Sans";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + this.level, 900, 30);

    if (this.gameOver) {
      ctx.font = "64px Open Sans";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Game Over", 335, 270);
      ctx.fillText("Hit SPACE to play again", 150, 340);
    } else if (this.gameWon) {
      ctx.font = "64px Open Sans";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Congratulations You Win!", 115, 270);
      ctx.fillText("Hit SPACE to play again", 150, 340);
    }
  } else {
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);

    this.player.draw(ctx);

    ctx.font = "24px Open Sans";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + this.level, 900, 30);
  }

};

Game.prototype.step = function() {
  if (this.initialized) {
    this.moveObjects();
    this.checkCollisions();
    this.checkForWin();
  }
};

Game.prototype.moveObjects = function() {
  this.allObjects().forEach(function(object) {
    object.move();
  });
};

Game.prototype.checkCollisions = function() {
  for (var i = 0; i < this.allObjects().length - 1; i++) {
    for (var j = i + 1; j < this.allObjects().length; j++) {
      if (this.allObjects()[i].isCollidedWith(this.allObjects()[j])) {
        this.allObjects()[i].collideWith(this.allObjects()[j]);
      }
    }
  }
};


Game.prototype.checkForWin = function() {
  if (this.balls.length === 0 && this.player.lives > 0) {
    if (this.level < 8) {
      this.level += 1;
      this.clearBalls();
      this.addBalls();
    } else {
      this.gameWon = true;
    }
  }
};


Game.prototype.playerHit = function() {
  this.player.pos = [500, 580];
  this.player.shooting = false;
  this.player.lives -= 1;
  this.clearBalls();
  if (this.player.lives > 0) {
    this.addBalls();
  } else {
    this.gameOver = true;
  }
};

module.exports = Game;
