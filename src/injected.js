import parser from 'gradient-parser';
import collide from 'point-circle-collision';

let canvas, draw;

function createCanvas() {
  canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
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

function main() {
  cleanup();

  const target = $0;
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
    const box = target.getBoundingClientRect();

    const direction = gradient.orientation && gradient.orientation.value;

    const center = {
      x: box.left + (box.width / 2),
      y: box.top + (box.height / 2)
    };

    const path = {};

    switch (direction) {
      case 'top':
        path.x1 = center.x;
        path.y1 = box.bottom;
        path.x2 = path.x1;
        path.y2 = box.top;
        break;
      case 'right top':
        path.x1 = box.left;
        path.y1 = box.bottom;
        path.x2 = box.right;
        path.y2 = box.top;
        break;
      case 'right':
        path.x1 = box.left;
        path.y1 = center.y;
        path.x2 = box.right;
        path.y2 = path.y1;
        break;
      case 'right bottom':
        path.x1 = box.left;
        path.y1 = box.top;
        path.x2 = box.right;
        path.y2 = box.bottom;
        break;
      case 'bottom': default:
        path.x1 = center.x;
        path.y1 = box.top;
        path.x2 = path.x1;
        path.y2 = box.bottom;
        break;
      case 'left bottom':
        path.x1 = box.right;
        path.y1 = box.top;
        path.x2 = box.left;
        path.y2 = box.bottom;
        break;
      case 'left':
        path.x1 = box.right;
        path.y1 = center.y;
        path.x2 = box.left;
        path.y2 = path.y1;
        break;
      case 'left top':
        path.x1 = box.right;
        path.y1 = box.bottom;
        path.x2 = box.left;
        path.y2 = box.top;
        break;
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, .3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 2;

    ctx.moveTo(path.x1, path.y1);
    ctx.lineTo(path.x2, path.y2);
    ctx.stroke();

    gradient.colorStops.forEach((stop, i, stops) => {
      const length = stops.length - 1;
      const v = {
        x: (box.width / length) * i,
        y: (box.height / length) * i
      };

      let x, y;

      switch (direction) {
        case 'top':
          x = path.x1;
          y = path.y1 - v.y;
          break;
        case 'right top':
          x = path.x1 + v.x;
          y = path.y1 - v.y;
          break;
        case 'right':
          x = path.x1 + v.x;
          y = path.y1;
          break;
        case 'right bottom':
          x = path.x1 + v.x;
          y = path.y1 + v.y;
          break;
        case 'bottom': default:
          x = path.x1;
          y = path.y1 + v.y;
          break;
        case 'left bottom':
          x = path.x1 + v.x;
          y = path.y1 + v.y;
          break;
        case 'left':
          x = path.x1 - v.x;
          y = path.y1;
          break;
        case 'left top':
          x = path.x1 - v.x;
          y = path.y1 - v.y;
          break;
      }

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

window.addEventListener('message', (e) => {
  const payload = e.data;

  switch (payload.type) {
    case 'INITIALIZE':
      main();
      break;

    case 'CLEANUP':
      cleanup();
      break;
  }
}, false);
