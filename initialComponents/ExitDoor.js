import ObjectBase from "../initialComponents/ObjectBase.js";

class ExitDoor extends ObjectBase {
  _cellSize = 50;
  _color = "yellow";
  _borderColor = "lightgray";
  
  constructor(context, x, y, width, height, type) {
    // 0 * 10
      super(x, y, width, height)

      this.context = context;
      this.type = type;
  }
  
  draw() {
    this.context.fillStyle = this._color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
  
}

export default ExitDoor;