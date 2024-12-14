import ObjectBase from "./ObjectBase.js";

class Walls extends ObjectBase {
  _cellColor = "rgba(255, 255, 255, 0.5)"; 
  _borderColor = "lightgray"
  _cellSize = 50
  constructor(context, x, y, width, height, type, bgColor) {
    // 0 * 10
      super(x, y, width, height)

      this.context = context;
      this.type = type;
      this.bgColor = bgColor;
  }

  draw() {
    this.context.fillStyle = this.bgColor;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
  
}

export default Walls;