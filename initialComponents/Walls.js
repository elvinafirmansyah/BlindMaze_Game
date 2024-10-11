import ObjectBase from "./ObjectBase.js";

class Walls extends ObjectBase {
  _black = "black"; 
  _cellSize = 50
  constructor(context, x, y, width, height) {
    // 0 * 10
      super(x, y, width, height)

      this.context = context
  }

  draw() {
    this.context.fillStyle = this._black;
    this.context.fillRect(this.x, this.y, this.width, this.height)
  }
  
}

export default Walls;