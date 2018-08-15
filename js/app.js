var app = {
  initDone: false,
  selectedThing: null,
  mode: 'line',
  selectables: [],
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
        self.selectables.forEach(function(selectable, index) {
          if(self.selectedThing === selectable) {
            self.selectables.splice(index, 1);
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
  },
  
  updateToolbarState: function() {
    var self = this;
    document.getElementById('btn-line').className = self.mode === 'line' ? 'active' : '';
    document.getElementById('btn-select').className = self.mode === 'select' ? 'active' : '';
    document.getElementById('btn-pencil').className = self.mode === 'pencil' ? 'active' : '';
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
          self.selectables.push(line);
          self.pos = null;
        }
      } else if(self.mode === 'select') {
        var closestThing = null;
        if (self.selectables.length > 0) {
          var closestDistance = 10;
          self.selectables.forEach(function(selectable, index) {
            var squareDistance = selectable.squareDistanceFrom(x, y);
            if(squareDistance <= closestDistance) {
              closestDistance = squareDistance;
              closestThing = selectable;
            }
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
        var penciling = new Penciling();
        self.selectables.push(penciling);
      }
    });
    canvas.addEventListener('mousemove', function(e) {
      if(self.mode === 'pencil' && self.pos !== null) {
        x = e.offsetX, y = e.offsetY;
        // create the line and add to the list
        var x0 = self.pos[0], y0 = self.pos[1];
        var length = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0));
        var line = new Line(x0, y0, x, y, length);
        var mostRecentPenciling =  self.selectables[self.selectables.length-1];
        mostRecentPenciling.pushLine(line);
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
        var mostRecentPenciling =  self.selectables[self.selectables.length-1];
        mostRecentPenciling.pushLine(line);
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
    self.selectables.forEach(function(selectable) {
      selectable.draw(ctx);
    });
    
    if(self.selectedThing !== null) {
      self.selectedThing.drawEnds(ctx);
    }
  },
};
