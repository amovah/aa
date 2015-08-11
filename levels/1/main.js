const canvas = document.querySelector('canvas'),
    c = canvas.getContext('2d'),
    width = 500,
    height = 700,
    hw = width / 2,
    RAD = Math.PI / 180;

canvas.width = width;
canvas.height = height;

c.save();

function restore(context2d) {
  context2d.restore();
  context2d.setTransform(1, 0, 0, 1, 0, 0);
}
function clear(element, context2d) {
  restore(context2d);
  context2d.clearRect(0, 0, element.width, element.height);
}

function circle() {
  c.beginPath();
  c.fillStyle = 'black';
  c.moveTo(hw, hw);
  c.arc(hw, hw, width / 6, 0, Math.PI * 2);
  c.fill();
}

class Dot {
  constructor(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius;
    this.speed = speed;
  }

  draw() {
    let cosine = (hw - this.radius) * Math.cos(this.pos * RAD),
        sine = (hw - this.radius) * Math.sin(this.pos * RAD);

    restore(c);

    c.beginPath();
    c.fillStyle = 'black';
    c.translate(hw, hw);
    c.moveTo(cosine, sine);
    c.arc(cosine, sine, this.radius, 0, Math.PI * 2);
    c.fill();

    c.beginPath();
    c.strokeStyle = 'black';
    c.moveTo(cosine, sine);
    c.lineTo(0, 0);
    c.stroke();
  }

  update() {
    if (this.pos === 360 && this.speed > 0)
      this.pos = 0;
    else if (this.pos === 0 && this.speed < 0)
      this.pos = 360;
    this.pos += this.speed;
  }
}

class CollectionDots {
  constructor() {
    this.data = [];
  }

  add(dot) {
    for (let item of this.data) {
      let radius = (() => {
        let rad = item.radius < dot.radius ? dot.radius : item.radius;
        let cir = (hw - rad) * 2 * Math.PI / 360;
        let count = 0;
        while (count * cir < rad) {
          ++count;
        }
        return count * 2 - 1;
      })();
      if (item.pos - radius <= dot.pos && dot.pos <= item.pos + radius)
        return null;
    }
    this.data.push(dot);
  }

  draw() {
    for (let item of this.data) {
      item.draw();
      item.update();
    }
  }
}

class Bullets {
  constructor(count, radius, speed) {
    this.count = count;
    this.movement = 0;
    this.speed = speed;
    this.radius = radius;
  }

  draw() {
    for (let i = 0; i < this.count; ++i) {
      restore(c);

      c.beginPath();
      c.fillStyle = 'black';
      c.translate(0, width);
      c.moveTo(hw, 50 + ((this.radius) * 2 + 15) * i);
      c.arc(hw, 50 + ((this.radius) * 2 + 15) * i, this.radius, 0, Math.PI * 2);
      c.fill();
    }
  }

  move() {
    this.movement -= this.speed;

    for (let i = 0; i < this.count; ++i) {
      restore(c);

      c.beginPath();
      c.fillStyle = 'black';
      c.translate(0, width);
      c.moveTo(hw, this.movement + ((this.radius) * 2 + 15) * i);
      c.arc(hw, this.movement + ((this.radius) * 2 + 15) * i, this.radius, 0,
      Math.PI * 2);
      c.fill();
    }
  }
}

let dots = new CollectionDots();

let bullets = new Bullets(6, 15, 3);

function go() {
  clear(canvas, c);
  circle();
  dots.draw();
  if (bullets.movement > 0) {
    bullets.move();
    if (bullets.movement <= 0) {
      if (dots.add(new Dot(90, 15, -0.75)) === null)
        return;
      --bullets.count;
    }
  } else {
    bullets.draw();
  }
  window.requestAnimationFrame(go);
}

window.requestAnimationFrame(go);

canvas.addEventListener('click', () => {
  bullets.movement = 50;
});
