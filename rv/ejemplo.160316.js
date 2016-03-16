function setup(){
THREE.ImageUtils.crossOrigin = '';
var textura = THREE.ImageUtils.loadTexture('http://threejs.org/examples/texture/brick_difusse.jpg');
  var forma = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( {map: textura} );
  malla = new THREE.Mesh( forma, material );
  
  escena = new THREE.Scene();
  escena.add(malla);
  
  camara = new THREE.PerspectiveCamera();
  camara.position.z = 5;
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerHeight*.95, window.innerHeight*.95);
  document.body.appendChild( renderer.domElement );
}

function loop(){
  requestAnimationFrame( loop );
  malla.rotation.y += 0.01;
  malla.rotation.x += 0.01;
  
  renderer.render( escena, camara );
} 

var renderer, camara, escena, malla;
setup();
loop();
