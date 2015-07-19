import parser from 'gradient-parser';
import collide from 'point-circle-collision';
import actionTypes from './lib/action-types';
import { getLengths, resolveLengths } from './lib/color-stops';
import { getAngle, getGradientLineLength, getGradientLinePoints } from './lib/linear-gradient';

let canvas, draw;

function createCanvas() {
  const c = document.createElement('canvas');
  document.body.appendChild(c);

  c.style.position = 'absolute';
  c.style.top = '0';
  c.style.left = '0';
  c.style.zIndex = '1000';

  return c;
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
  if (target.isEqualNode(canvas)) return;

  cleanup();

  let gradient;

  try {
    gradient = parser.parse(getComputedStyle(target).backgroundImage)[0];
  } catch (e) {
    return;
  }

  canvas = createCanvas();

  const { orientation, colorStops } = gradient;

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

chrome.runtime.onMessage.addListener(payload => {
  const { action } = payload;

  switch (action) {
    case actionTypes.TERMINATE:
      cleanup();
      break;
  }
});

window.selectElement = (target) => {
  main(target);
};
