import parser from 'gradient-parser';
import collide from 'point-circle-collision';

import { getLengths, resolveLengths } from './lib/color-stops';
import { getAngle, getGradientLineLength, getGradientLinePoints } from './lib/linear-gradient';

let canvas, draw;

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

  if (styles.backgroundImage === 'none') return;

  const canvas = createCanvas();
  const { orientation, colorStops } = parser.parse(styles.backgroundImage)[0];

  draw = (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const rect = target.getBoundingClientRect();

    const angle = getAngle(rect, orientation);
    const length = getGradientLineLength(rect, angle);

    const p = getGradientLinePoints(rect, angle, length);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, .3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(p.x2, p.y2);
    ctx.stroke();

    const lengths = resolveLengths(getLengths(colorStops), length);

    colorStops.forEach((stop, i) => {
      const deltaX = (((p.x2 - p.x1) * lengths[i]) / 100);
      const deltaY = (((p.y2 - p.y1) * lengths[i]) / 100);
      const x = p.x1 + deltaX;
      const y = p.y1 + deltaY;

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

main(document.getElementById('test'));

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
