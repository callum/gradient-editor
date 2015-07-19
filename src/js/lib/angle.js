export function abs(angle) {
  if (angle < 0) return angle + 360;
  if (angle > 360) return angle - 360;
  return angle;
}

export function toRadians(angle) {
  return angle * (Math.PI / 180);
}

export function fromRadians(radians) {
  return radians * (180 / Math.PI);
}

export function fromCoords(x1, y1, x2, y2) {
  return fromRadians(Math.atan2(x1 - x2, y1 - y2));
}
