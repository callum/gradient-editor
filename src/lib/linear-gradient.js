import angle from './angle';

export default class LinearGradient {
  constructor(rect, orientation) {
    this.rect = rect;
    this.orientation = orientation;
  }

  getGradientLineLength() {
    const radians = angle.toRadians(this.getAngle());

    return Math.abs(this.rect.width * Math.sin(radians)) +
           Math.abs(this.rect.height * Math.cos(radians));
  }

  getGradientLinePoints() {
    const perpendicularRadians = angle.toRadians(angle.abs(this.getAngle() - 90));
    const gradientLinelength = this.getGradientLineLength();

    const width = (Math.cos(perpendicularRadians) * gradientLinelength) / 2;
    const height = (Math.sin(perpendicularRadians) * gradientLinelength) / 2;

    const centerX = this.rect.left + (this.rect.width / 2);
    const centerY = this.rect.top + (this.rect.height / 2);

    return {
      x1: centerX - width, y1: centerY - height,
      x2: centerX + width, y2: centerY + height
    };
  }

  getAngle() {
    if (this.orientation) {
      switch (this.orientation.type) {
        case 'directional':
          return this.getDirectionalAngle();
        case 'angular':
          return parseInt(this.orientation.value, 10);
        default:
          return 180;
      }
    }
  }

  getDirectionalAngle() {
    const { top, right, bottom, left } = this.rect;

    switch (this.orientation.value) {
      case 'top':
        return 0;
      case 'right top':
        return angle.abs(angle.fromCoords(left, bottom, right, top) + 90);
      case 'right':
        return 90;
      case 'right bottom':
        return angle.abs(angle.fromCoords(left, top, right, bottom) - 90);
      case 'bottom':
        return 180;
      case 'left bottom':
        return angle.abs(angle.fromCoords(right, top, left, bottom) + 90);
      case 'left':
        return 270;
      case 'left top':
        return angle.abs(angle.fromCoords(right, bottom, left, top) - 90);
    }
  }
}
