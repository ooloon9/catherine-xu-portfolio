
const config = {
  cellSize: 0.75,
  zoomLevel: 1.23,
  lerpFactor: 0.075,
  backgroundColor: "rgba(0,0,0,1)",
  textColor: "rgba(128,128,128,1)",
  hovercolor: "rgba(255,255,255,0)",
};


let scene, camera, renderer, plane;
let isDragging = false,
  isClick = true,
  clickStartTime = 0;
let previousMouse = { x: 0, y: 0};
let offset = { x: 0, y: 0},
  targetoffset = { x: 0, y:0 };
let mousePosition = { x: -1, y: -1 };



