/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameView = __webpack_require__(1);
	var key = __webpack_require__(7);

	var ctx = document.getElementById("game-canvas").getContext("2d");
	var gv = new GameView(ctx);
	gv.start();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	var key = __webpack_require__(7);

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
	      console.log("SPACE");
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(3);
	var Bullet = __webpack_require__(5);
	var Player = __webpack_require__(4);
	var Util = __webpack_require__(6);


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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Player = __webpack_require__(4);
	var Util = __webpack_require__(6);

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Bullet = __webpack_require__(5);

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);

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


/***/ },
/* 6 */
/***/ function(module, exports) {

	function Util() {}

	Util.inherits = function(ChildClass, ParentClass) {
	  function Surrogate(){}
	  Surrogate.prototype = ParentClass.prototype;
	  ChildClass.prototype = new Surrogate();
	  ChildClass.prototype.constructor = ChildClass;
	};

	Util.dist = function(pos1, pos2) {
	  var dx = pos1[0] - pos2[0];
	  var dy = pos1[1] - pos2[1];
	  var dist = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
	  return dist;
	};

	Util.BOUNCE_FACTORS = {
	  1: -5,
	  2: -8,
	  3: -10,
	  4: -12,
	  5: -14
	};

	Util.BALL_COLORS = {
	  1: "#4CAF50", // aqua-green
	  2: "#E64A19", // orange
	  3: "#7E57C2", // purple
	  4: "#e74c3c", // red
	  5: "#26A69A" //cyan
	};

	Util.LEVEL_MAP = {
	  1: [
	    { startX: 0, size: 1 },
	    { startX: -200, size: 1 },
	  ],

	  2: [
	    { startX: 0, size: 2 },
	    { startX: -200, size: 2 }
	  ],

	  3: [
	    { startX: 0, size: 3 },
	    { startX: -200, size: 3 }
	  ],

	  4: [
	    { startX: 0, size: 4 },
	    { startX: -200, size: 4 },
	  ],

	  5: [
	    { startX: 0, size: 5 },
	    { startX: -200, size: 5 }
	  ],

	  6: [
	    { startX: 0, size: 5 },
	    { startX: -200, size: 4 },
	    { startX: -400, size: 3 },
	    { startX: -600, size: 5 },
	  ],

	  7: [
	    { startX: 0, size: 5 },
	    { startX: -200, size: 5 },
	    { startX: -400, size: 5 },
	    { startX: -600, size: 4 },
	    { startX: -800, size: 3 },
	  ],

	  8: [
	    { startX: 0, size: 5 },
	    { startX: -200, size: 5 },
	    { startX: -400, size: 5 },
	    { startX: -600, size: 5 },
	    { startX: -800, size: 5 },
	  ]
	};

	module.exports = Util;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ }
/******/ ]);