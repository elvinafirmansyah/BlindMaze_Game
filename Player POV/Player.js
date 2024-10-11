import ObjectBase from "../initialComponents/ObjectBase.js";

class Player extends ObjectBase {
  _red = "red"; 
  _cellSize = 50
  _xVelocity = this._cellSize;
  _yVelocity = this._cellSize;
  constructor(context, x, y, width, height) {
    // 0 * 10
      super(x, y, width, height)

      this.context = context
  }

  move() {
    this.x += this._xVelocity;
    this.y += this._yVelocity;
  }
  
  draw() {
    this.context.fillStyle = this._red;
    this.context.fillRect(this.x, this.y, this.width, this.height)
  }
  
}

export default Player;