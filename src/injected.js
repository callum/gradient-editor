import parser from 'gradient-parser';
import collide from 'point-circle-collision';
import angle from './lib/angle';

let canvas, draw;

function getPoints(rect, gradientAngle) {
  const centerX = rect.left + (rect.width / 2);
  const centerY = rect.top + (rect.height / 2);
  const radians = angle.toRadians(gradientAngle);
  const perpendicularRadians = angle.toRadians(angle.abs(gradientAngle - 90));

  const gradientLinelength =
    Math.abs(rect.width * Math.sin(radians)) +
    Math.abs(rect.height * Math.cos(radians));

  const w = (Math.cos(perpendicularRadians) * gradientLinelength) / 2;
  const h = (Math.sin(perpendicularRadians) * gradientLinelength) / 2;

  return {
    x1: centerX - w, y1: centerY - h,
    x2: centerX + w, y2: centerY + h
  };
}

function createCanvas() {
  canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '1000';

  return canvas;
}

function cleanup() {
  if (canvas && draw) {
    canvas.removeEventListener('click', draw, false);
    window.removeEventListener('resize', draw, false);
    document.body.removeChild(canvas);
    canvas = undefined;
    draw = undefined;
  }
}

function main(target) {
  cleanup();

  const styles = getComputedStyle(target);

  if (styles.backgroundImage === 'none') {
    return;
  }

  const gradient = parser.parse(styles.backgroundImage)[0];
  const canvas = createCanvas();

  draw = (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const rect = target.getBoundingClientRect();

    const { orientation, colorStops } = gradient;

    let gradientAngle = 180;

    if (orientation) {
      switch (orientation.type) {
        case 'directional':
          gradientAngle = angle.fromDirection(rect, orientation.value);
          break;
        case 'angular':
          gradientAngle = parseInt(gradient.orientation.value, 10);
          break;
      }
    }

    const points = getPoints(rect, gradientAngle);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, .3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.moveTo(points.x1, points.y1);
    ctx.lineTo(points.x2, points.y2);
    ctx.stroke();

    gradient.colorStops.forEach((stop, i, stops) => {
      const deltaX = ((points.x2 - points.x1) / (stops.length - 1)) * i;
      const deltaY = ((points.y2 - points.y1) / (stops.length - 1)) * i;
      const x = points.x1 + deltaX;
      const y = points.y1 + deltaY;

      let radius = 6;

      if (e && collide([e.pageX, e.pageY], [x, y], radius)) {
        radius = 10;
        window.postMessage({ stop }, '*');
      }

      ctx.fillStyle = 'white';
      ctx.shadowColor = 'rgba(0, 0, 0, .3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetY = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius + 3, 0, Math.PI * 2, false);
      ctx.fill();

      ctx.fillStyle = stop.value;
      ctx.shadowColor = null;
      ctx.shadowBlur = null;
      ctx.shadowOffsetY = null;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.fill();
    });
  };

  canvas.addEventListener('click', draw, false);
  window.addEventListener('resize', draw, false);
  draw();
}

window.test = () => main(document.getElementById('test'));

window.addEventListener('message', (e) => {
  console.log(e);

  const payload = e.data;

  switch (payload.type) {
    case 'INITIALIZE':
      main($0);
      break;

    case 'TERMINATE':
      cleanup();
      break;
  }
}, false);
