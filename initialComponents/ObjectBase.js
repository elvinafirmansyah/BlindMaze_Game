class ObjectBase {
  constructor(x, y, width, height, positionIdx = null) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.positionIdx = positionIdx
  }

}

export default ObjectBase;