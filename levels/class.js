const RAD = Math.PI / 180;

function restore(ctx) {
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
function clear(canvas) {
  const ctx = canvas.getContext('2d');

  restore(ctx);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function circle(canvas, level) {
  const ctx = canvas.getContext('2d'),
        hw = canvas.width / 2;

  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.moveTo(hw, hw);
  ctx.arc(hw, hw, hw / 3, 0, Math.PI * 2);
  ctx.fill();
}

class Dot {
  constructor(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius;
    this.speed = speed;
  }

  draw(ctx, hw) {
    let cosine = (hw - this.radius) * Math.cos(this.pos * RAD),
        sine = (hw - this.radius) * Math.sin(this.pos * RAD);

    restore(ctx);

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.translate(hw, hw);
    ctx.moveTo(cosine, sine);
    ctx.arc(cosine, sine, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(cosine, sine);
    ctx.lineTo(0, 0);
    ctx.stroke();
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
  constructor(canvas) {
    this.data = [];
    this.canvas = canvas;
  }

  add(pos, radius, speed) {
    const hw = canvas.width / 2;

    for (let item of this.data) {
      let scopeRad = (() => {
        let rad = item.radius < radius ? radius : item.radius;
        let cir = (hw - rad) * 2 * Math.PI / 360;
        let count = 0;
        while (count * cir < rad) {
          ++count;
        }
        return count * 2 - 1;
      })();
      if (item.pos - scopeRad <= pos && pos <= item.pos + scopeRad)
        return null;
    }
    this.data.push(new Dot(pos, radius, speed));
  }

  draw() {
    const ctx = this.canvas.getContext('2d'),
          hw = this.canvas.width / 2;
    for (let item of this.data) {
      item.draw(ctx, hw);
      item.update();
    }
  }
}

class Bullets {
  constructor(canvas, count, radius, speed) {
    this.canvas = canvas;
    this.count = count;
    this.radius = radius;
    this.speed = speed;
    this.pos = 0;
    this._move = false;
  }

  draw() {
    const ctx = this.canvas.getContext('2d'),
          width = this.canvas.width,
          hw = width / 2;

    for (let i = 0; i < this.count; ++i) {
      restore(ctx);

      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.translate(0, width);
      ctx.moveTo(hw, 50 + ((this.radius) * 2 + 50) * i);
      ctx.arc(hw, 50 + ((this.radius) * 2 + 50) * i, this.radius, 0,
      Math.PI * 2);
      ctx.fill();
    }
  }

  shoot() {
    if (this.count === 0)
      return;
    this._move = true;
    this.pos = 50;
  }

  move() {
    this.pos -= this.speed;
    if (this.pos <= 0)
      this._move = false;

    const ctx = this.canvas.getContext('2d'),
          width = this.canvas.width,
          hw = width / 2;

    for (let i = 0; i < this.count; ++i) {
      restore(ctx);

      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.translate(0, width);
      ctx.moveTo(hw, this.pos + ((this.radius) * 2 + 50) * i);
      ctx.arc(hw, this.pos + ((this.radius) * 2 + 50) * i, this.radius, 0,
      Math.PI * 2);
      ctx.fill();
    }
  }
}
