var Penciling = function() {
  this.lines = [];
};

Penciling.prototype.pushLine = function(line) {
    this.lines.push(line);
}

Penciling.prototype.drawEnds = function(ctx) {
    this.lines[0].drawFirstEnd(ctx);
    this.lines[this.lines.length-1].drawLastEnd(ctx);
};

Penciling.prototype.draw = function(ctx) {
    this.lines.forEach(function(line) {
        line.draw(ctx);
    });
};

Penciling.prototype.canMove = function(canvas, dx, dy) {
    let okdx = dx;
    let okdy = dy;
    this.lines.forEach(function(line) {
        let adjustedDeltas = line.canMove(canvas, dx, dy);
        if(adjustedDeltas[0] === 0) {
            okdx = 0;
        }
        if(adjustedDeltas[1] === 0) {
            okdy = 0;
        }
    });
    return [okdx, okdy];
}

Penciling.prototype.move = function(dx, dy) {
    this.lines.forEach(function(line) {
        line.move(dx, dy);
    });
}

Penciling.prototype.squareDistanceFrom = function(x, y) {
    var closestDistance = -1;
    this.lines.forEach(function(line, index) {
        var squareDistance = line.squareDistanceFrom(x, y);
        if(squareDistance <= closestDistance || closestDistance < 0) {
          closestDistance = squareDistance;
          closestLine = line;
        }
    });
    return closestDistance;
};