let cols = 120;
let rows = 80;

let wid, hei;
let nest_grid = [];
let food_grid = [];

let nest_col = 32;
let food_col = 71;

let show_grids = false;//true;//

let ants = [];
let n_ants = 1500;
let n_spawn = 10;

let nest;
let foods = [];

function setup() {
  createCanvas(1200, 1200);
  colorMode(HSB, 100);
  nest = { x: width / 2, y: height / 2 };
  wid = floor(width / cols);
  hei = floor(height / rows);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      food_grid.push(new Cell(i, j, food_col));
      nest_grid.push(new Cell(i, j, nest_col));
    }
  }

  for (let i = 0; i < n_spawn; i++) {
    ants.push(new Ant());
  }
}

function draw() {
  background(220);

  nest_grid[index(nest.x, nest.y)].bright = 10000;

  ants = ants.filter(function (val) {
    return val.age < val.lifespan;
  });

  if (ants.length < n_ants && frameCount % 4 == 0) {
    for (let i = 0; i < n_spawn; i++) {
      ants.push(new Ant());
    }
  }

  for (let cell of food_grid) {
    cell.show();
    cell.update();
  }

  for (let cell of nest_grid) {
    cell.show();
    cell.update();
  }

  for (let ant of ants) {
    ant.show();
    ant.update();
  }

  foods = foods.filter(function (val) { return val.amt > 0; })
  for (let food of foods) {
    food.show();
    food.update();
  }

  noStroke();
  fill(20, 100, 100);
  ellipse(nest.x, nest.y, 40);
}



function mouseClicked() {
  foods.push(new Food(mouseX, mouseY));
}
