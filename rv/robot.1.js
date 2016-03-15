function setup(){
  //var cuboForma = new THREE.BoxGeometry(2,2,2);
  var ruedaForma= new THREE.Shape();
  ruedaForma.moveTo( 0, 0 );
  ruedaForma.lineTo( 2, 0.5 );
  ruedaForma.lineTo( 2, 1.5 );
  
  var ruedaGeometry = new THREE.ExtrudeGeometry( ruedaForma, {amount: 10});
  ruedaMalla = new THREE.Mesh( ruedaGeometry );
  
  escena = new THREE.Scene();
  escena.add( ruedaMalla );
  
  camara = new THREE.PerspectiveCamera();
  camara.position.z = 100;
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerHeight*.95,window.innerHeight*.95);
  document.body.appendChild( renderer.domElement );
}

function loop(){
  requestAnimationFrame( loop );
  ruedaMalla.position.x += 0.01;
  ruedaMalla.position.y += 0.01;
  
  renderer.render( escena, camara );
}

var ruedaMalla, escena, camara, renderer;
setup();
loop();
