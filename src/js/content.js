import parser from 'gradient-parser';
import collide from 'point-circle-collision';
import actions from './lib/actions';
import * as colorStops from './lib/color-stops';
import * as linearGradient from './lib/linear-gradient';

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

  draw = (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const rect = target.getBoundingClientRect();

    const a = linearGradient.getAngle(rect, gradient.orientation);
    const l = linearGradient.getGradientLineLength(rect, a);
    const p = linearGradient.getGradientLinePoints(rect, a, l);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, .3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(p.x2, p.y2);
    ctx.stroke();

    const resolved = colorStops.resolve(gradient.colorStops, l);

    gradient.colorStops.forEach((stop, i) => {
      const deltaX = (((p.x2 - p.x1) * resolved[i]) / 100);
      const deltaY = (((p.y2 - p.y1) * resolved[i]) / 100);
      const x = p.x1 + deltaX;
      const y = p.y1 + deltaY;

      let radius = 6;

      if (e && collide([e.pageX, e.pageY], [x, y], radius)) {
        radius = 10;
      }

      ctx.fillStyle = 'white';
      ctx.shadowColor = 'rgba(0, 0, 0, .3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetY = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius + 3, 0, Math.PI * 2, false);
      ctx.fill();

      ctx.fillStyle = colorStops.getStopColorValue(stop);
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
    case actions.TERMINATE:
      cleanup();
      break;
  }
});

window.selectElement = (target) => {
  main(target);
};
