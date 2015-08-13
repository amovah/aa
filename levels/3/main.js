const canvas = document.querySelector('canvas');

canvas.width = 500;
canvas.height = 500 + 300;

let dots = new CollectionDots(canvas);
dots.add(0, 15, 0.75);
dots.add(60, 15, 0.75);
dots.add(120, 15, 0.75);
dots.add(180, 15, 0.75);
dots.add(240, 15, 0.75);
dots.add(300, 15, 0.75);

let bullets = new Bullets(canvas, 6, 15, 10);

function start() {
  clear(canvas);
  circle(canvas, 1);
  dots.draw();
  if (bullets._move) {
    bullets.move();
    if (!bullets._move) {
      if (dots.add(90, 15, 0.75) === null)
        return;
      --bullets.count;
    }
  } else {
    bullets.draw();
  }
  window.requestAnimationFrame(start);
}

window.requestAnimationFrame(start);

canvas.addEventListener('click', () => {
  bullets.shoot();
});
