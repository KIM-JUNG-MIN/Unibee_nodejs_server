
tool.maxDistance = 2;
tool.maxDistance = 80;

var sessionId = io.socket.sessionid;

function randomColor() {

  return {
    hue: Math.random() * 360,
    saturation: 0.8,
    brightness: 0.8,
    alpha: 0.5
  };

}

paths = {};
function onMouseDown(event) {
  // Create the new path
  color = randomColor();

  startPath( event.point, color, sessionId );

  // Inform the backend
  emit("startPath", {point: event.point, color: color}, sessionId);

}
document.onmousedown=onMouseDown;

function onMouseDrag(event) {

  var step        = event.delta / 2;
  step.angle     += 90;
  var top         = event.middlePoint + step;
  var bottom      = event.middlePoint - step;

  continuePath( top, bottom, sessionId );

  emit("continuePath", {top: top, bottom: bottom}, sessionId);

}

function onMouseUp(event) {

  endPath(event.point, sessionId);

  emit("endPath", {point: event.point}, sessionId);

}


// -----------------
// Drawing functions
// Use to draw multiple users paths
// -----------------


function startPath( point, color, sessionId ) {

  paths[sessionId] = new Path();
  paths[sessionId].fillColor = color;
  paths[sessionId].add(point);

}

function continuePath(top, bottom, sessionId) {

  var path    = paths[sessionId];

  path.add(top);
  path.insert(0, bottom);

}

function endPath(point, sessionId) {

  var path = paths[sessionId];

  path.add(point);
  path.closed = true;
  path.smooth();

  delete paths[sessionId]

}


// -----------------
// Emit
// Use to inform the server of user events
// -----------------


function emit(eventName, data) {
  io.emit(eventName, data, sessionId);
}


// -----------------
// On
// Draw other users paths
// -----------------


io.on( 'startPath', function( data, sessionId ) {
  startPath(data.point, data.color, sessionId);
})


io.on( 'continuePath', function( data, sessionId ) {
  continuePath(data.top, data.bottom, sessionId);
  view.draw();
})


io.on( 'endPath', function( data, sessionId ) {
  endPath(data.point, sessionId);
  view.draw();
})
