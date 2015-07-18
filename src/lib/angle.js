export default {
  abs(angle) {
    if (angle < 0) return angle + 360;
    if (angle > 360) return angle - 360;
    return angle;
  },

  toRadians(angle) {
    return angle * (Math.PI / 180);
  },

  fromRadians(radians) {
    return radians * (180 / Math.PI);
  },

  fromCoords(x1, y1, x2, y2) {
    return this.fromRadians(Math.atan2(x1 - x2, y1 - y2));
  },

  fromDirection(rect, direction) {
    switch (direction) {
      case 'top':
        return 0;
      case 'right top':
        return this.abs(
          this.fromCoords(rect.left, rect.bottom, rect.right, rect.top) + 90);
      case 'right':
        return 90;
      case 'right bottom':
        return this.abs(
          this.fromCoords(rect.left, rect.top, rect.right, rect.bottom) - 90);
      case 'bottom':
        return 180;
      case 'left bottom':
        return this.abs(
          this.fromCoords(rect.right, rect.top, rect.left, rect.bottom) + 90);
      case 'left':
        return 270;
      case 'left top':
        return this.abs(
          this.fromCoords(rect.right, rect.bottom, rect.left, rect.top) - 90);
    }
  }
};
