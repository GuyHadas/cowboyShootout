# Cowboy Shootout
Cowboy Shootout is a fun browser game built using Javascript and HTML 5 Canvas.

## Sample Code

### Game.js
```javascript

...

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

...

```


### Ball.js

```javascript

...

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

  ...
```

### Bullet.js
```javascript

...

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

...
```
