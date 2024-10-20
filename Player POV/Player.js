import ObjectBase from "../initialComponents/ObjectBase.js";

class Player extends ObjectBase {
  _cellSize = 50;
  _playerColor = "red";
  _borderColor = "lightgray";
  
  constructor(context, x, y, width, height) {
    // 0 * 10
      super(x, y, width, height)

      this.context = context
      this.radius = 15;
  }
  
  draw() {
    // this.context.fillRect(0, 0, this.width, this.height);
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = this._playerColor;
    this.context.fill();
    this.context.lineWidth = 1;
    this.context.strokeStyle = this._borderColor;
    this.context.stroke();
  }
  
}

export default Player;