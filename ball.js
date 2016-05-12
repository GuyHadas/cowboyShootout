var Player = require('./player.js');
var Util = require('./util.js');

function Ball(pos, vel, size, game) {
    this.pos = pos;
    this.vel = vel;
    this.size = size;
    this.color = BALL_COLORS[this.size];
    this.radius = 10 * this.size;
    this.game = game;
}

var BALL_COLORS = Util.BALL_COLORS;

var BOUNCE_FACTORS = Util.BOUNCE_FACTORS;

Ball.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
};



Ball.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
  this.vel[1] += 0.2;


  if (this.pos[1] >= 590) {
    this.vel[1] = BOUNCE_FACTORS[this.size];
  }

  if (this.pos[0] >= 1000 - this.radius) {
    this.vel[0] = -2;
  } else if (this.pos[0] <= this.radius) {
    this.vel[0] = 2;
  }

};


Ball.prototype.isCollidedWith = function(otherObject) {
  if (Util.dist(
    this.pos, otherObject.pos) < this.radius + otherObject.radius
  ) {
    return true;
  } else {
    return false;
  }
};

Ball.prototype.collideWith = function(otherObject) {
  if (otherObject.__proto__ === Player.prototype) {
    this.game.playerHit();
  }
};



module.exports = Ball;
