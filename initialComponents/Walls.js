import ObjectBase from "./ObjectBase.js";

class Walls extends ObjectBase {
  _cellColor = "rgba(255, 255, 255, 0.5)"; 
  _borderColor = "lightgray"
  _cellSize = 50
  constructor(context, x, y, width, height, type) {
    // 0 * 10
      super(x, y, width, height)

      this.context = context;
      this.type = type;
  }

  draw() {
    this.context.fillStyle = this._cellColor;
    this.context.fillRect(this.x, this.y, this.width, this.height);

    // this.context.strokeStyle = this._borderColor;
    // this.context.lineWidth = 0.2; // Set the width of the border
    // this.context.strokeRect(this.x, this.y, this.width, this.height);
  }
  
}

export default Walls;