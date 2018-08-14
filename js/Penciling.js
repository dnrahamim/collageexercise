var Penciling = function() {
  this.lines = [];
};

Penciling.prototype.pushLine = function(line) {
    this.lines.push(line);
}

Penciling.prototype.drawEnds = function(ctx) {
    console.log('bagel');
};

Penciling.prototype.draw = function(ctx) {
    this.lines.forEach(function(line) {
        line.draw(ctx);
    });
};