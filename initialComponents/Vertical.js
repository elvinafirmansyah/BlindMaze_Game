import ObjectBase from "./ObjectBase.js";

class Vertical extends ObjectBase {
  _bordercolor = "lightgray";
  _cellSize = 50
  constructor(context, x, height) {
    // 0 * 10
      super(x * 50 + 50, 0, 1, height)

      this.context = context
  }

  draw() {
    this.context.fillStyle = this._bordercolor;
    this.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

export default Vertical;