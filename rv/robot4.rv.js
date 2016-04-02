function rueda(){
	THREE.Object3D.call(this);
	THREE.ImageUtils.crossOrigin = '';
	this.textura = THREE.ImageUtils.loadTexture('http://threejs.org/examples/textures/brick_diffuse.jpg');
	this.arcShape = new THREE.Shape();
				this.arcShape.moveTo( 50, 10 );
				this.arcShape.absarc( 10, 10, 40, 0, Math.PI*2, false );
	this.holePath = new THREE.Path();
				this.holePath.moveTo( 20, 10 );
				this.holePath.absarc( 10, 10, 10, 0, Math.PI*2, true );
				this.arcShape.holes.push( this.holePath );

	this.extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

	this.rueda = new THREE.ExtrudeGeometry( this.arcShape, this.extrudeSettings );
	this.material = new THREE.MeshPhongMaterial({ map: this.textura});
	this.mallaRueda = new THREE.Mesh( this.rueda, this.material );

	this.add(this.mallaRueda);
}
rueda.prototype = new THREE.Object3D();

function visor(){
	THREE.Object3D.call(this);
	this.malla = new THREE.Mesh( new THREE.BoxGeometry( 20, 10, 30 ), new THREE.MeshPhongMaterial({ color: 0x0000ff }) );

	this.add(this.malla);
}
visor.prototype = new THREE.Object3D();

function setup(){
	var material = new THREE.MeshPhongMaterial({color: 0xff0000 });

	var union = new THREE.CylinderGeometry( 10, 10, 150 );
	var caja = new THREE.BoxGeometry( 200, 30, 130 );
	var tubo = new THREE.CylinderGeometry( 10, 10, 100 );
	//var visor = new THREE.BoxGeometry( 20, 10, 30 );

	var mallaUnion1 = new THREE.Mesh( union, material );
	var mallaUnion2 = new THREE.Mesh( union, material );
	var mallaCaja = new THREE.Mesh( caja, material );
	var mallaTubo = new THREE.Mesh( tubo, material );
	mallaVisor = new visor();

	mallaRueda1 = new rueda();
	mallaRueda2 = new rueda();
	mallaRueda3 = new rueda();
	mallaRueda4 = new rueda();

	mallaRueda1.position.set( 0, 0, 0);
	mallaRueda2.position.set( 150, 0, 0);
	mallaRueda3.position.set( 150, 0, 150);
	mallaRueda4.position.set( 0, 0, 150);
	mallaUnion1.position.set( 10, 10, 75);
	mallaUnion2.position.set( 160, 10, 75);
	mallaUnion2.rotation.x = 3.1416/2;
	mallaUnion1.rotation.x = 3.1416/2;
	mallaCaja.position.set( 85,30,80);
	mallaTubo.position.set( 0,90,80);
	mallaVisor.position.set(0,145,80);

	var robot = new THREE.Geometry();

	THREE.GeometryUtils.merge( robot, mallaUnion1 );
	THREE.GeometryUtils.merge( robot, mallaUnion2 );
	THREE.GeometryUtils.merge( robot, mallaCaja );
	THREE.GeometryUtils.merge( robot, mallaTubo );
	THREE.GeometryUtils.merge( robot, mallaVisor );

	mallaRobot = new THREE.Mesh( robot , material );

	var luzPuntual = new THREE.PointLight( 0xffffff );
  	luzPuntual.position.x = 50;
  	luzPuntual.position.y = 100;
  	luzPuntual.position.z = 500;

	escena = new THREE.Scene();
	escena.add( mallaRobot );
	escena.add( mallaRueda1 );
	escena.add( mallaRueda2 );
	escena.add( mallaRueda3 );
	escena.add( mallaRueda4 );
	escena.add( mallaVisor );

	escena.add(luzPuntual);

	camara = new THREE.PerspectiveCamera();
	camara.position.z = 500;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerHeight*.95, window.innerHeight*.95 );
	document.body.appendChild( renderer.domElement );
}

function loop(){
	requestAnimationFrame( loop );

	renderer.render( escena, camara );
}

var mallaRobot, camara, escena, renderer;
var mallaRueda1, mallaRueda2, mallaRueda3, mallaRueda4, mallaVisor;

setup();
loop();
