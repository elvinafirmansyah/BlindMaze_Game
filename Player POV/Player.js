import ObjectBase from "../initialComponents/ObjectBase.js";

class Player extends ObjectBase {
  _red = "red"; 
  _cellSize = 50
  
  constructor(context, x, y, width, height) {
    // 0 * 10
      super(x, y, width, height)

      this.context = context

  }
  
  draw() {
    // this.context.fillRect(0, 0, this.width, this.height);
    this.context.fillStyle = this._red;
    this.context.fillRect(this.x, this.y, this.width, this.height)
  }
  
}

export default Player;