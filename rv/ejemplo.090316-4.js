function setup(){
  var forma = new BoxGeometry( 1, 1, 1 );
  var material = new MeshLambertMaterial( { color: 0xffffff } );
  malla = new THREE.Mesh( forma, material );
  
  var luzPuntual = new THREE.PointLight( 0x0000ff );
  luzPuntual.position.x = 10;
  luzPuntual.position.y = 10;
  luzPuntual.position.z = 10;
  
  escena = new THREE.Scene();
  escena.add( malla );
  escena.add( luzPuntual );
  
  camara = new THREE.PerspectiveCamera();
  camara.position.z = 5;
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerHeight*.95, window.innerHeight*.95 );
  document.body.appendChild(renderer.domElement);
}

function loop(){
  requestAnimationFrame();
  
}
