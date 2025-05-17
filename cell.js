class Cell {
  constructor(i, j, hue) {
    this.x = i * wid;
    this.y = j * hei;
    this.hue = hue;
    this.bright = 0;
    this.decay = 0.14;
  }

  show() {
    if (show_grids) {
      fill(this.hue, 85, this.bright, 50);
      rect(this.x, this.y, wid, hei);
    }
  }

  update() {
    this.bright = constrain(this.bright - this.decay, 0, 100);
  }
}
