class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.amt = random(1000, 5000);
  }

  show() {
    noStroke();
    fill(50, 100, 100);
    rect(this.x, this.y, 20, 20);
  }

  update() {
    food_grid[index(this.x, this.y)].bright = 10000;
  }
}
