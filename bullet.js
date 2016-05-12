var Util = require('./util.js');

var rope = new Image();
rope.src = './rope.png';


function Bullet(ctx, color, startPos, player) {
  this.color = color;
  this.startPos = startPos;
  this.endPos = startPos;
  this.vel = [0, 10];
  this.ctx = ctx;
  this.player = player;
}

Bullet.prototype.draw = function() {

  this.ctx.drawImage(rope, this.startPos[0], this.endPos[1], 5, 600 - this.endPos[1]);


  // this.ctx.fillStyle = this.color;
  // this.ctx.beginPath();
  // this.ctx.moveTo(this.startPos[0], 600);
  // this.ctx.lineTo(this.startPos[0], this.endPos[1]);
  // this.ctx.stroke();
};

Bullet.prototype.move = function() {
  this.endPos[1] -= this.vel[1];
};

Bullet.prototype.step = function() {
  this.move();
  this.hitBall();
  this.hitCeiling();
  this.draw();
};

Bullet.prototype.hitCeiling = function() {
  if (this.endPos[1] <= 0) {
    this.player.shooting = false;
  }
};

Bullet.prototype.hitBall = function() {
  var self = this;
  this.player.game.balls.forEach(function(ball) {
    if (
      (ball.pos[0] + (ball.radius) >= self.startPos[0] &&
      ball.pos[0] - (ball.radius) <= self.startPos[0]) &&

      ball.pos[1] + (ball.radius) >= self.endPos[1])

      {
        self.player.shooting = false;
        if (ball.size === 1) {
          self.player.game.removeBall(ball);
        } else {
          self.player.game.split(ball);
        }
      }
  });
};



module.exports = Bullet;
