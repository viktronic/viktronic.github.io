function setup(){

  var esferaForma = new THREE.SphereGeometry();
  var cilindroForma = new THREE.CylinderGeometry();
  
  var esfera1 = new THREE.Mesh( esferaForma );
  var esfera2 = new THREE.Mesh( esferaForma );
  var cilindro = new THREE.Mesh( cilindroForma );
  
  esfera1.position.y = 2;
  esfera2.position.y = -2;
  
  var forma = new THREE.Geometry();
  
  THREE.GeometryUtils.merge( forma, esfera1 );
  THREE.GeometryUtils.merge( forma, esfera2 );
  THREE.GeometryUtils.merge( forma, cilindro );
  
  malla = new THREE.Mesh( forma );
  
  escena = new THREE.Scene();
  escena.add( malla );
  
  camara = new THREE.PerspectiveCamera();
  camara.position.z = 10;
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerSize*.95, window.innerHeight*.95 );
  document.body.appendChild( renderer.domElement );
}

function loop(){
  
  requestAnimationFrame( loop );
  malla.rotation.x += 0.01;
  malla.rotation.y += 0.01;
  renderer.render( escena, camara );
}

var escena, camara, renderer, malla;
setup();
loop();
