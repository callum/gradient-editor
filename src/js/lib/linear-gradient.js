import * as a from './angle';

export function getAngle(rect, orientation) {
  if (orientation) {
    switch (orientation.type) {
      case 'directional':
        return getDirectionalAngle(rect, orientation);
      case 'angular':
        return parseInt(orientation.value, 10);
    }
  } else {
    return 180;
  }
}

export function getDirectionalAngle(rect, orientation) {
  const { top, right, bottom, left } = rect;

  switch (orientation.value) {
    case 'top':
      return 0;
    case 'right top':
      return a.abs(a.fromCoords(left, bottom, right, top) + 90);
    case 'right':
      return 90;
    case 'right bottom':
      return a.abs(a.fromCoords(left, top, right, bottom) - 90);
    case 'bottom':
      return 180;
    case 'left bottom':
      return a.abs(a.fromCoords(right, top, left, bottom) + 90);
    case 'left':
      return 270;
    case 'left top':
      return a.abs(a.fromCoords(right, bottom, left, top) - 90);
  }
}

export function getGradientLineLength(rect, angle) {
  const radians = a.toRadians(angle);

  return Math.abs(rect.width * Math.sin(radians)) +
         Math.abs(rect.height * Math.cos(radians));
}

export function getGradientLinePoints(rect, angle, gradientLinelength) {
  const perpendicularRadians = a.toRadians(a.abs(angle - 90));

  const width = (Math.cos(perpendicularRadians) * gradientLinelength) / 2;
  const height = (Math.sin(perpendicularRadians) * gradientLinelength) / 2;

  const centerX = rect.left + (rect.width / 2);
  const centerY = rect.top + (rect.height / 2);

  return {
    x1: centerX - width, y1: centerY - height,
    x2: centerX + width, y2: centerY + height
  };
}
