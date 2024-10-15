import ObjectBase from "./ObjectBase.js";

class Horizontal extends ObjectBase {
  _bordercolor = "lightgray";

  constructor(context, y, width) {
    // 0 * 10
      super(0, y * 50 + 50, width, 1)

      this.context = context
  }

  draw() {
    this.context.fillStyle = this._bordercolor;
    this.context.fillRect(this.x, this.y, this.width, this.height)
  }
  
}

export default Horizontal;