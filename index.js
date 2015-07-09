import gradient from 'gradient-parser';

const target = document.getElementById('target');
const canvas = document.getElementById('canvas');

const style = gradient.parse(window.getComputedStyle(target).backgroundImage)[0];

function draw(e) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const box = target.getBoundingClientRect();

  const direction = style.orientation && style.orientation.value;

  const centerX = Math.round(box.left + (box.width / 2));
  const centerY = Math.round(box.top + (box.height / 2));

  const path = {};

  switch (direction) {
    case 'top':
      path.x1 = centerX;
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
      path.y1 = centerY;
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
      path.x1 = centerX;
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
      path.y1 = centerY;
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
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 2;

  ctx.moveTo(path.x1, path.y1);
  ctx.lineTo(path.x2, path.y2);
  ctx.stroke();

  style.colorStops.forEach((color, i, stops) => {
    const vectorX = (box.width / (stops.length - 1)) * i;
    const vectorY = (box.height / (stops.length - 1)) * i;

    let x, y;

    switch (direction) {
      case 'top':
        x = path.x1;
        y = path.y1 - vectorY;
        break;
      case 'right top':
        x = path.x1 + vectorX;
        y = path.y1 - vectorY;
        break;
      case 'right':
        x = path.x1 + vectorX;
        y = path.y1;
        break;
      case 'right bottom':
        x = path.x1 + vectorX;
        y = path.y1 + vectorY;
        break;
      case 'bottom': default:
        x = path.x1;
        y = path.y1 + vectorY;
        break;
      case 'left bottom':
        x = path.x1 + vectorX;
        y = path.y1 + vectorY;
        break;
      case 'left':
        x = path.x1 - vectorX;
        y = path.y1;
        break;
      case 'left top':
        x = path.x1 - vectorX;
        y = path.y1 - vectorY;
        break;
    }

    let radius = 6;

    if (e instanceof MouseEvent) {
      if (e.pageX > (x - radius) && e.pageX < (x + radius) &&
          e.pageY > (y - radius) && e.pageY < (y + radius)) {
        radius = 10;
      }
    }

    ctx.fillStyle = color.value;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
  });
}

canvas.addEventListener('click', draw, false);
window.addEventListener('resize', draw, false);
draw();
