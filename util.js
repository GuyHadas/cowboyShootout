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
