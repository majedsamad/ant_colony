let modes = { 1: "FOOD", 2: "NEST" };

function index(x, y) {
  let i = floor((x / width) * cols);
  let j = floor((y / height) * rows);
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  } else {
    return i + j * cols;
  }
}

let grad_grid_sz = 8;

class Ant {
  constructor() {
    this.reset();
    this.alpha = random(80, 100);
    this.hue = random(0, 100);
    this.pickup_dist = 20;
    this.size = 4;
    this.pre = 0.25;
    this.jit = 2;
    this.speed = 5;
    this.frames_till_jit = random(10, 50);
    this.frames_till_drop = 1;//random(1, 2);
    this.age = 0;
    this.lifespan = random(150, 300);
    this.pher_strength = 0.13;
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.vx = random(-10, 10);
    this.vy = random(-10, 10);
    this.mode = 1;
  }

  show() {
    let col;
    if (modes[this.mode] === "NEST") {
      col = nest_col;
    } else if (modes[this.mode] == "FOOD") {
      col = food_col;
    }
    fill(col, 65, 60, this.alpha);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  brighten(ind, grid, val) {
    if (ind > -1) {
      let cell = grid[ind];
      cell.bright = constrain(cell.bright + val, 0, 100);
    }
  }

  getGrad(grid) {
    let cnt = 0;
    let cell;
    let sum_x = 0;
    let sum_y = 0;
    let sum_bright = 0;
    for (let i = -grad_grid_sz; i < grad_grid_sz + 1; i++) {
      for (let j = -grad_grid_sz; j < grad_grid_sz + 1; j++) {
        let ind = index(this.x + i * wid, this.y + j * hei);
        if (i != 0 && j != 0 && ind > -1) {
          cell = grid[ind];
          cnt++;
          let bright = cell.bright;
          sum_x += (cell.x + wid / 2 - this.x) * bright;
          sum_y += (cell.y + hei / 2 - this.y) * bright;
          sum_bright += bright;
        }
      }
    }
    sum_x /= cnt * sum_bright;
    sum_y /= cnt * sum_bright;
    if (cnt == 0 || sum_bright == 0) {
      return { x: 0.6 * this.vx, y: 0.6 * this.vy };
    } else {
      return { x: sum_x, y: sum_y };
    }
  }

  drop(ind, grid) {
    this.brighten(ind, grid, this.pher_strength);
  }

  update() {
    this.age++;
    let grid = [];
    let ind = index(this.x, this.y);
    let grad = { x: 0, y: 0 };

    if (modes[this.mode] === "FOOD") {
      if (frameCount % this.frames_till_drop == 0) {
        this.drop(ind, nest_grid);
      }
      grad = this.getGrad(food_grid);
    }

    if (modes[this.mode] === "NEST") {
      if (frameCount % this.frames_till_drop == 0) {
        this.drop(ind, food_grid);
      }
      grad = this.getGrad(nest_grid);
    }

    if (this.x <= 0 || this.x >= width || this.y <= 0 || this.y >= height) {
      this.reset();
    }

    this.x = constrain(this.x + this.vx, 0, width);
    this.y = constrain(this.y + this.vy, 0, height);

    let rnd_x = 0;
    let rnd_y = 0;
    if (frameCount % round(this.frames_till_jit) == 0) {
      rnd_x = random(-this.jit, this.jit);
      rnd_y = random(-this.jit, this.jit);
    }
    this.vx = this.pre * this.vx + grad.x + rnd_x;
    this.vy = this.pre * this.vy + grad.y + rnd_y;

    let hyp = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    this.vx *= this.speed / hyp;
    this.vy *= this.speed / hyp;

    for (let food of foods) {
      let dist_to_food = dist(this.x, this.y, food.x, food.y);
      if (dist_to_food < this.pickup_dist && food.amt > 0) {
        this.drop(ind, food_grid);
        food.amt--;
        this.mode = 2; // "NEST";
      }
    }

    let dist_to_nest = dist(this.x, this.y, nest.x, nest.y);
    if (dist_to_nest < this.pickup_dist) {
      this.mode = 1; // "FOOD";
    }
  }
}
