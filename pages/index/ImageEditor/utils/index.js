export function getDistance(p1, p2) {
  var x = p2.pageX - p1.pageX,
      y = p2.pageY - p1.pageY;
  return Math.sqrt((x * x) + (y * y));
};

export function getAngle(p1, p2) {
  var x = p1.pageX - p2.pageX,
      y = p1.pageY- p2.pageY;
  return Math.atan2(y, x) * 180 / Math.PI;
};
