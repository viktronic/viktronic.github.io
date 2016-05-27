var keyboard = new THREEx.KeyboardState();

function completo(){
	THREE.ImageUtils.crossOrigin = '';
	this.textura = THREE.ImageUtils.loadTexture('http://threejs.org/examples/textures/brick_diffuse.jpg');
	var material = new THREE.MeshPhongMaterial({color: 0xff0000 });
	var material2 = new THREE.MeshPhongMaterial({map: this.textura });

	var union = new THREE.CylinderGeometry( 10, 10, 150 );
	var caja = new THREE.BoxGeometry( 200, 30, 130 );
	var tubo = new THREE.CylinderGeometry( 10, 10, 100 );
	//var visor = new THREE.BoxGeometry( 20, 10, 30 );

	this.mallaUnion1 = new THREE.Mesh( union, material );
	this.mallaUnion2 = new THREE.Mesh( union, material );
	this.mallaCaja = new THREE.Mesh( caja, material2 );
	this.mallaTubo = new THREE.Mesh( tubo, material );
	this.mallaVisor = new visor();
	this.mallaRueda1 = new rueda();
	this.mallaRueda2 = new rueda();
	this.mallaRueda3 = new rueda();
	this.mallaRueda4 = new rueda();

	this.mallaRueda1.position.set( 10, 10, 0);
	this.mallaRueda2.position.set( 160, 10, 0);
	this.mallaRueda3.position.set( 160, 10, 150);
	this.mallaRueda4.position.set( 10, 10, 150);
	this.mallaUnion1.position.set( 10, 10, 75);
	this.mallaUnion2.position.set( 160, 10, 75);
	this.mallaUnion2.rotation.x = 3.1416/2;
	this.mallaUnion1.rotation.x = 3.1416/2;
	this.mallaCaja.position.set( 85,30,80);
	this.mallaTubo.position.set( 0,90,80);
	this.mallaVisor.position.set(0,145,80);

	this.add(this.mallaCaja);
	this.add(this.mallaTubo);
	this.add(this.mallaVisor);
	this.add(this.mallaUnion1);
	this.add(this.mallaUnion2);
	this.add(this.mallaRueda1);
	this.add(this.mallaRueda2);
	this.add(this.mallaRueda3);
	this.add(this.mallaRueda4);
}
completo.prototype = new THREE.Object3D();

function rueda(){
	THREE.Object3D.call(this);
	this.arcShape = new THREE.Shape();
				this.arcShape.moveTo( 40, 0 );
				this.arcShape.absarc( 0, 0, 40, 0, Math.PI*2, false );
	this.holePath = new THREE.Path();
				this.holePath.moveTo( 10, 0 );
				this.holePath.absarc( 0, 0, 10, 0, Math.PI*2, true );
				this.arcShape.holes.push( this.holePath );


	this.extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

	this.rueda = new THREE.ExtrudeGeometry( this.arcShape, this.extrudeSettings );
	this.material = new THREE.MeshPhongMaterial({ color: 0x000000});
	this.mallaRueda = new THREE.Mesh( this.rueda, this.material );

	this.add(this.mallaRueda);
}
rueda.prototype = new THREE.Object3D();

function visor(){
	THREE.Object3D.call(this);
	this.malla = new THREE.Mesh( new THREE.BoxGeometry( 20, 10, 30 ), new THREE.MeshPhongMaterial({ color: 0x0000ff }) );
	this.malla.scale.set(2,2,2);
	this.add(this.malla);
}
visor.prototype = new THREE.Object3D();

function setup(){
	mallarobot = new completo();
	step = 0.1;
	var luzPuntual = new THREE.PointLight( 0xffffff );
  	luzPuntual.position.x = 50;
  	luzPuntual.position.y = 100;
  	luzPuntual.position.z = 500;

	escena = new THREE.Scene();
	escena.add(mallarobot);
	escena.add(luzPuntual);

	camara = new THREE.PerspectiveCamera();
	camara.position.z = 500;
	
	//5 ancho 8 altura
camara2 = new THREE.OrthographicCamera( 16 / - 2, 16 / 2, 10 / 2, 10 / - 2, 1, 1000 );
camara2.position.z=30;

  escena.add(camara);
  escena.add(camara2);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerHeight*.95, window.innerHeight*.95 );
	document.body.appendChild( renderer.domElement );
}

function loop(){
	requestAnimationFrame( loop );
	
	if (keyboard.pressed("P")) {
renderer.render(escena,camara);
}
else
{
renderer.render(escena,camara2);
}
	
	mallarobot.rotation.y += 0.01;
	mallarobot.mallaRueda1.rotation.z += 0.01;
	mallarobot.mallaRueda2.rotation.z += 0.01;
	mallarobot.mallaRueda3.rotation.z += 0.01;
	mallarobot.mallaRueda4.rotation.z += 0.01;
	mallarobot.mallaVisor.rotation.y += 0.01;
}

var mallaRobot, camara, camara2, escena, renderer, step;

setup();
loop();
