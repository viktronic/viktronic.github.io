function setup(){

	var arcShape = new THREE.Shape();
				arcShape.moveTo( 50, 10 );
				arcShape.absarc( 10, 10, 40, 0, Math.PI*2, false );
	var holePath = new THREE.Path();
				holePath.moveTo( 20, 10 );
				holePath.absarc( 10, 10, 10, 0, Math.PI*2, true );
				arcShape.holes.push( holePath );

	var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

	//var forma = new THREE.RingGeometry( 0.3, 2, 32 );
	var rueda = new THREE.ExtrudeGeometry( arcShape, extrudeSettings );
	var union = new THREE.CylinderGeometry( 10, 10, 150 );
	var caja = new THREE.BoxGeometry( 200, 30, 130 );
	var tubo = new THREE.CylinderGeometry( 10, 10, 100 );
	var visor = new THREE.BoxGeometry( 20, 10, 30 );

	var material = new THREE.MeshNormalMaterial();

	var mallaRueda1 = new THREE.Mesh( rueda, material );
	var mallaRueda2 = new THREE.Mesh( rueda, material );
	var mallaRueda3 = new THREE.Mesh( rueda, material );
	var mallaRueda4 = new THREE.Mesh( rueda, material );
	var mallaUnion1 = new THREE.Mesh( union, material );
	var mallaUnion2 = new THREE.Mesh( union, material );
	var mallaCaja = new THREE.Mesh( caja, material );
	var mallaTubo = new THREE.Mesh( tubo, material );
	var mallaVisor = new THREE.Mesh( visor, material );

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

	THREE.GeometryUtils.merge( robot, mallaRueda1 );
	THREE.GeometryUtils.merge( robot, mallaRueda2 );
	THREE.GeometryUtils.merge( robot, mallaRueda3 );
	THREE.GeometryUtils.merge( robot, mallaRueda4 );
	THREE.GeometryUtils.merge( robot, mallaUnion1 );
	THREE.GeometryUtils.merge( robot, mallaUnion2 );
	THREE.GeometryUtils.merge( robot, mallaCaja );
	THREE.GeometryUtils.merge( robot, mallaTubo );
	THREE.GeometryUtils.merge( robot, mallaVisor );

	mallaRobot = new THREE.Mesh( robot , material );

	camara = new THREE.PerspectiveCamera();
	camara.position.z = 500;

	escena = new THREE.Scene();
	escena.add( mallaRobot );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerHeight*.95, window.innerHeight*.95 );
	document.body.appendChild( renderer.domElement );
}

function loop(){
	requestAnimationFrame( loop );

	//mallaRobot.rotation.x += 0.01;
	mallaRobot.rotation.y += 0.01;

	renderer.render( escena, camara );
}

var mallaRobot, camara, escena, renderer;

setup();
loop();
