var Bullet = require('./bullet.js');

var cowboy = new Image();
cowboy.src = './cowboy.png';

function Player(pos, game) {
  this.pos = pos;
  this.vel = [0, 0];
  this.color = "#009900";
  this.radius = 20;
  this.game = game;
  this.shooting = false;
  this.lives = 5;
  this.dir = "stay";
}

Player.prototype.draw = function(ctx) {
  if (this.lives > 0) {
    ctx.font = "24px Open Sans";
    ctx.fillStyle = "#2ecc71";
    ctx.fillText("Lives: " + this.lives, 20, 30);
  } else {
    ctx.font = "24px Open Sans";
    ctx.fillStyle = "#e74c3c";
    ctx.fillText("Lives: " + this.lives, 20, 30);
  }

  ctx.drawImage(cowboy, this.pos[0] - 20, this.pos[1] - 25, 50, 50);

  if (this.shooting) {
    this.bullet.step();
  }
};

Player.prototype.shoot = function(ctx) {
  if (this.shooting === false) {
    this.shooting = true;
    this.bullet = new Bullet(ctx, this.color, this.pos.slice(), this);
  }
};

Player.prototype.move = function() {
     if (this.dir === "right") {
      if (this.pos[0] < 990) {
        this.pos[0] += 4;
      }
    } else if (this.dir === "left") {
      if (this.pos[0] > 10) {
        this.pos[0] += -4;
      }
    }
};

// Player.prototype.relocate = function() {
//   this.pos = this.game.randomPosition();
//   this.vel = Util.randomVec(0);
// };

// Player.prototype.power = function(impulse) {
//   this.vel[1] += impulse;
//   //
//   // if (Player.norm(this.vel[0], this.vel[1]) === 0) {
//   //   this.vel[1] += impulse;
//   // }
// };

// Player.norm = function(vx, vy) {
//   Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
// };

module.exports = Player;
