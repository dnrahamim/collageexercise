var app = {
  initDone: false,
  selectedThing: null,
  mode: 'line',
  lines: [],
  pencilings: [],
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
        if(self.selectedThing.type === 'line') {
          self.lines.splice(self.selectedThing.index, 1);
        }
      }
      self.deselectLine();
      self.pos = null;
      self.render();
    });
    document.getElementById('btn-pencil').addEventListener('click', function() {
      self.mode = 'pencil';
      self.pos = null;
      self.updateToolbarState();
    });
  },
  
  updateToolbarState: function() {
    var self = this;
    document.getElementById('btn-line').className = self.mode === 'line' ? 'active' : '';
    document.getElementById('btn-select').className = self.mode === 'select' ? 'active' : '';
    document.getElementById('btn-pencil').className = self.mode === 'pencil' ? 'active' : '';
  },

  selectThing(thing) {
    this.selectedThing = thing;
  },

  deselectThing() {
    this.selectedThing = null;
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
          line.index = self.lines.length; //use this index later
          self.lines.push(line);
          self.pos = null;
        }
      } else if(self.mode === 'select') {
        var closestThing = 'line';
        if (self.lines.length > 0 || self.pencilings.length > 0) {
          var closestDistance = 10;
          var closestIndex = -1;
          self.lines.forEach(function(line, index) {
            var squareDistance = line.squareDistanceFrom(x, y);
            if(squareDistance <= closestDistance) {
              closestDistance = squareDistance;
              closestThing = line;
            }
          });
          self.pencilings.forEach(function(penciling, index) {
            penciling.forEach(function(line, index) {
              var squareDistance = line.squareDistanceFrom(x, y);
              if(squareDistance <= closestDistance) {
                closestDistance = squareDistance;
                closestThing = penciling;
              }
            });
          });
          if(closestThing !== null) {
            self.selectThing(closestThing);
          } else {
            self.deselectThing();
          }
        }
      }
      self.render();
    });
    canvas.addEventListener('mousedown', function(e) {
      if(self.mode === 'pencil') {
        x = e.offsetX, y = e.offsetY;
        self.pos = [ x, y ];
        self.pencilings.push([]);
      }
    });
    canvas.addEventListener('mousemove', function(e) {
      if(self.mode === 'pencil' && self.pos !== null) {
        x = e.offsetX, y = e.offsetY;
        // create the line and add to the list
        var x0 = self.pos[0], y0 = self.pos[1];
        var length = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0));
        var line = new Line(x0, y0, x, y, length);
        self.pencilings[self.pencilings.length-1].push(line);
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
        self.pencilings[self.pencilings.length-1].push(line);
        self.pos = null;
        self.render();
      }
    });
  },
  
  render: function() {
    var self = this;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    self.lines.forEach(function(line) {
      line.draw(ctx);
    });
    self.pencilings.forEach(function(penciling) {
      penciling.forEach(function(line) {
        line.draw(ctx);
      });
    });
    
    if(self.selectedThing !== null) {
      debugger;
      self.selectedThing.drawEnds(ctx);
    }
  },
};
