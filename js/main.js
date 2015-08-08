const CIRCLE_CANVAS = document.getElementById('circle');
const BULLET_CANVAS = document.getElementById('bullet');

const circle = CIRCLE_CANVAS.getContext('2d');
const bullet = BULLET_CANVAS.getContext('2d');

const RADIAN = Math.PI/180;

let deg = 0;
let current = 90;
let connectedBullet = [];
let bullets = 6;

function clearCanvas(ctx, canvas) {
  ctx.beginPath();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCircle() {
  circle.beginPath();
  circle.translate(250, 250);
  circle.fillStyle = 'black';
  circle.arc(0, 0, 80, 0, Math.PI*2);
  circle.fill();

  for (let item of connectedBullet) {
    let cosine = 240 * Math.cos( item * RADIAN);
    let sine = 240 * Math.sin( item * RADIAN);
    circle.beginPath();
    circle.setTransform(1, 0, 0, 1, 0, 0);
    circle.translate(250, 250);
    circle.rotate(-deg * RADIAN);
    circle.translate(cosine, sine);
    circle.fillStyle = 'black';
    circle.arc(0, 0, 10, 0, Math.PI*2);
    circle.fill();

    circle.beginPath();
    circle.moveTo(0, 0);
    circle.lineTo(-cosine, -sine);
    circle.stroke();
  }
}

let inter = setInterval(function() {
  clearCanvas(circle, CIRCLE_CANVAS);
  ++deg;
  ++current++;
  if (current == 360) current = 0;
  if (deg == 360) deg = 0;

  drawCircle();
}, 20);

function add(deg) {
  for (let item of connectedBullet) {
    if ( (item + 4) >= deg && deg >= (item - 4)) {
      clearInterval(inter);
      circle.setTransform(1, 0, 0, 1, 0, 0);
      circle.beginPath();
      circle.fillStyle = 'red';
      circle.fillRect(0, 0, 600, 600);
      drawCircle();
      return;
    }
  }
  connectedBullet.push(deg);
}

function drawBullets() {
  for (let i = 0; i < bullets; i++) {
    bullet.beginPath();
    bullet.fillStyle = 'black';
    bullet.moveTo(260, 50 + (25 * i));
    bullet.arc(250, 50 + (25 * i), 10, 0, Math.PI * 2);
    bullet.fill();
  }
}

drawBullets();

let shootedBullet;
function shoot() {
  if (bullets != 0) {
    let move = 50;
    shootedBullet = setInterval(function() {
      clearCanvas(bullet, BULLET_CANVAS);

      bullet.beginPath();
      bullet.fillStyle = 'black';
      bullet.moveTo(260, move);
      bullet.arc(250, move, 10, 0, Math.PI * 2);
      bullet.fill();

      drawBullets();

      --move;

      if (move == 10) {
        --bullets;

        clearInterval(shootedBullet);

        add(current);

        clearCanvas(bullet, BULLET_CANVAS);

        drawBullets();

        if (bullets == 0) {
          clearInterval(inter);
          circle.setTransform(1, 0, 0, 1, 0, 0);
          circle.beginPath();
          circle.fillStyle = 'green';
          circle.fillRect(0, 0, 600, 600);
          drawCircle();

          alert(`you've won`);
        }
      }
    }, 1);
  }
}

CIRCLE_CANVAS.addEventListener('click', () => {
  shoot();
});

BULLET_CANVAS.addEventListener('click', () => {
  shoot();
});
