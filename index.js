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

  let startX, startY;
  let endX, endY;

  switch (direction) {
    case 'top':
      startX = centerX;
      startY = Math.round(box.bottom);
      endX = startX;
      endY = Math.round(box.top);
      break;
    case 'right':
      startX = Math.round(box.left);
      startY = centerY;
      endX = Math.round(box.right);
      endY = startY;
      break;
    case 'left':
      startX = Math.round(box.right);
      startY = centerY;
      endX = Math.round(box.left);
      endY = startY;
      break;
    default:
      startX = centerX;
      startY = Math.round(box.top);
      endX = startX;
      endY = Math.round(box.bottom);
  }

  const path = new Path2D();
  path.moveTo(startX, startY);
  path.lineTo(endX, endY);

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.shadowColor = 'rgba(0, 0, 0, .3)';
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 2;
  ctx.stroke(path);

  style.colorStops.forEach((color, i, arr) => {
    const a = new Path2D();
    const v = (box.height / (arr.length - 1)) * i;
    const h = (box.width / (arr.length - 1)) * i;

    let x, y;

    switch (direction) {
      case 'top':
        x = startX;
        y = Math.round(startY - v);
        break;
      case 'right':
        x = Math.round(startX + h);
        y = startY;
        break;
      case 'left':
        x = Math.round(startX - h);
        y = startY;
        break;
      default:
        x = startX;
        y = Math.round(startY + v);
    }

    let radius = 6;

    if (e instanceof MouseEvent) {
      if (e.pageX > (x - radius) && e.pageX < (x + radius) &&
          e.pageY > (y - radius) && e.pageY < (y + radius)) {
        radius = 10;
      }
    }

    a.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color.value;
    ctx.fill(a);
    ctx.stroke(a);
  });
}

canvas.addEventListener('click', draw, false);
window.addEventListener('resize', draw, false);
draw();
