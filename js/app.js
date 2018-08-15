var app = {
  initDone: false,
  selectedThing: null,
  mode: 'line',
  drawables: [],
  pos: null,
  
  init: function() {
    var self = this;
    if(self.initDone)
      return;
    self.bindToolbarEvents();
    self.bindDrawAreaEvents();
    self.initDone = true;
  },
  
  bindToolbarEvents: function() {
    var self = this;
    document.getElementById('btn-line').addEventListener('click', function() {
      self.mode = 'line';
      self.pos = null;
      self.updateToolbarState();
    });
    document.getElementById('btn-select').addEventListener('click', function() {
      self.mode = 'select';
      self.pos = null;
      self.updateToolbarState();
    });
    document.getElementById('btn-erase').addEventListener('click', function() {
      if(self.selectedThing !== null) {
        self.drawables.forEach(function(drawable, index) {
          if(self.selectedThing === drawable) {
            self.drawables.splice(index, 1);
          }
        });
      }
      self.deselectThing();
      self.pos = null;
      self.render();
    });
    document.getElementById('btn-pencil').addEventListener('click', function() {
      self.mode = 'pencil';
      self.pos = null;
      self.updateToolbarState();
    });
    document.getElementById('btn-move').addEventListener('click', function() {
      self.mode = 'move';
      self.pos = null;
      self.updateToolbarState();
    });
  },
  
  updateToolbarState: function() {
    var self = this;
    document.getElementById('btn-line').className = self.mode === 'line' ? 'active' : '';
    document.getElementById('btn-select').className = self.mode === 'select' ? 'active' : '';
    document.getElementById('btn-pencil').className = self.mode === 'pencil' ? 'active' : '';
    document.getElementById('btn-move').className = self.mode === 'move' ? 'active' : '';
    self.deselectThing();
  },

  selectThing(thing) {
    this.selectedThing = thing;
  },

  deselectThing() {
    this.selectedThing = null;
    this.render();
  },
  
  bindDrawAreaEvents: function() {
    var self = this;
    var canvas = document.getElementById('canvas');
    canvas.addEventListener('click', function(e) {
      var x = e.offsetX, y = e.offsetY;
      if(self.mode === 'line') {
        if(!self.pos) {
          // save first click of the line
          self.pos = [ x, y ];
        } else {
          // create the line and add to the list
          var x0 = self.pos[0], y0 = self.pos[1];
          var length = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0));
          var line = new Line(x0, y0, x, y, length);
          self.drawables.push(line);
          self.pos = null;
        }
      } else if(self.mode === 'select') {
        if (self.drawables.length > 0) {
          var closestThing = null;
          var closestDistance = 10;
          self.drawables.forEach(function(drawable, index) {
            var squareDistance = drawable.squareDistanceFrom(x, y);
            if(squareDistance <= closestDistance) {
              closestDistance = squareDistance;
              closestThing = drawable;
            }
          });
          if(closestThing !== null) {
            self.selectThing(closestThing);
          } else {
            self.deselectThing();
          } //TODO: is this necessary?
        }
      }
      self.render();
    });
    canvas.addEventListener('mousedown', function(e) {
      if(self.mode === 'pencil') {
        x = e.offsetX, y = e.offsetY;
        self.pos = [ x, y ];
        var penciling = new Penciling();
        self.drawables.push(penciling);
      } else if(self.mode === 'move') {
        x = e.offsetX, y = e.offsetY;
        self.pos = [ x, y ];
        if (self.drawables.length > 0) {
          var closestThing = null;
          var closestDistance = 10;
          self.drawables.forEach(function(drawable, index) {
            var squareDistance = drawable.squareDistanceFrom(x, y);
            if(squareDistance <= closestDistance) {
              closestDistance = squareDistance;
              closestThing = drawable;
            }
          });
          if(closestThing !== null) {
            self.selectThing(closestThing);
            self.render();
          }
        }
      }
    });
    canvas.addEventListener('mousemove', function(e) {
      if(self.mode === 'pencil' && self.pos !== null) {
        x = e.offsetX, y = e.offsetY;
        // create the line and add to the list
        var x0 = self.pos[0], y0 = self.pos[1];
        var length = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0));
        var line = new Line(x0, y0, x, y, length);
        var mostRecentPenciling =  self.drawables[self.drawables.length-1];
        mostRecentPenciling.pushLine(line);
        self.pos = [ x, y ];
        self.render();
      } else if(self.mode === 'move'  && self.pos !== null) {
        x = e.offsetX, y = e.offsetY;
        var deltaX = x - self.pos[0];
        var deltaY = y - self.pos[1];
        
        //check if we can actually move
        let adjustedDeltas = self.selectedThing.canMove(canvas, deltaX, deltaY);
        deltaX = adjustedDeltas[0];
        deltaY = adjustedDeltas[1];

        self.selectedThing.move(deltaX, deltaY);
        self.pos = [ x, y ];
        self.render();
      }
    });
    canvas.addEventListener('mouseup', function(e) {
      if(self.mode === 'pencil' && self.pos !== null) {
        x = e.offsetX, y = e.offsetY;
        // create the line and add to the list
        var x0 = self.pos[0], y0 = self.pos[1];
        var length = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0));
        var line = new Line(x0, y0, x, y, length);
        var mostRecentPenciling =  self.drawables[self.drawables.length-1];
        mostRecentPenciling.pushLine(line);
        self.pos = null;
        self.render();
      } else if(self.mode === 'move' && self.pos !== null) {
        self.pos = null;
        self.deselectThing();
      }
    });
  },
  
  render: function() {
    var self = this;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    self.drawables.forEach(function(drawable) {
      drawable.draw(ctx);
    });
    
    if(self.selectedThing !== null) {
      self.selectedThing.drawEnds(ctx);
    }
  },
};
