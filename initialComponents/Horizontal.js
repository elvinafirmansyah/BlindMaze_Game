import ObjectBase from "./ObjectBase.js";

class Horizontal extends ObjectBase {
  _black = "black";
  constructor(context, y, width) {
    // 0 * 10
      super(0, y * 50 + 50, width, 1)

      this.context = context
  }

  draw() {
    this.context.fillStyle = this._black;
    this.context.fillRect(this.x, this.y, this.width, this.height)
  }
  
}

export default Horizontal;