var Line = function(x1, y1, x2, y2, length, index) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.length = Geometry.squareDistance(x1, y1, x2, y2);
};

Line.prototype.draw = function(ctx) {
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.stroke();
};

Line.prototype.drawEnd = function(ctx, x, y) {
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y, 5, 5, 0, 0, 2 * Math.PI);
  ctx.stroke();
}

Line.prototype.drawEnds = function(ctx) {
  this.drawFirstEnd(ctx);
  this.drawLastEnd(ctx);
};

Line.prototype.drawFirstEnd = function(ctx) {
  this.drawEnd(ctx, this.x1, this.y1);
}

Line.prototype.drawLastEnd = function(ctx) {
  this.drawEnd(ctx, this.x2, this.y2);
}

Line.prototype.canMove = function(canvas, dx, dy) {
  let dxok = 0;
  let dyok = 0;
  let newy1 = this.y1 + dy;
  let newy2 = this.y2 + dy;
  let newx1 = this.x1 + dx;
  let newx2 = this.x2 + dx;
  if(newy1 < canvas.height && newy1 > 0 &&
    newy2 < canvas.height && newy2 > 0) {
    dyok = dy;
  }
  if(newx1 < canvas.width && newx1 > 0 &&
    newx2 < canvas.width && newx2 > 0) {
    dxok = dx;
  }
  return [dxok, dyok];
}

Line.prototype.move = function(dx, dy) {
  this.x1 += dx;
  this.y1 += dy;
  this.x2 += dx;
  this.y2 += dy;
};

Line.prototype.squareDistanceFrom = function(x, y) {
  var x1 = this.x1, y1 = this.y1, x2 = this.x2, y2 = this.y2;
  return Geometry.squareDistanceToSegment(x, y, x1, y1, x2, y2);
};
