function completo(){
	var material = new THREE.MeshPhongMaterial({color: 0xff0000 });

	var union = new THREE.CylinderGeometry( 10, 10, 150 );
	var caja = new THREE.BoxGeometry( 200, 30, 130 );
	var tubo = new THREE.CylinderGeometry( 10, 10, 100 );
	//var visor = new THREE.BoxGeometry( 20, 10, 30 );

	this.mallaUnion1 = new THREE.Mesh( union, material );
	this.mallaUnion2 = new THREE.Mesh( union, material );
	this.mallaCaja = new THREE.Mesh( caja, material );
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
	THREE.ImageUtils.crossOrigin = '';
	this.textura = THREE.ImageUtils.loadTexture('http://threejs.org/examples/textures/brick_diffuse.jpg');
	this.arcShape = new THREE.Shape();
				this.arcShape.moveTo( 40, 0 );
				this.arcShape.absarc( 0, 0, 40, 0, Math.PI*2, false );
	this.holePath = new THREE.Path();
				this.holePath.moveTo( 10, 0 );
				this.holePath.absarc( 0, 0, 10, 0, Math.PI*2, true );
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
	this.malla.scale.set(2,2,2);
	this.add(this.malla);
}
visor.prototype = new THREE.Object3D();

function setup(){
	cubo1 = new THREE.Mesh( new THREE.BoxGeometry( 1, 57, 5),
                          new THREE.MeshNormalMaterial());
  	cubo2 = new THREE.Mesh( new THREE.BoxGeometry( 1, 57, 5),
                          new THREE.MeshNormalMaterial());
  	cubo3 = new THREE.Mesh( new THREE.BoxGeometry( 60, 1, 5),
                          new THREE.MeshNormalMaterial());
  	cubo4 = new THREE.Mesh( new THREE.BoxGeometry( 60, 1, 5),
                          new THREE.MeshNormalMaterial());
	mallarobot = new completo();

	cubo1.position.x = 30;
  	cubo2.position.x = -30;
  	cubo3.position.y = 28;
  	cubo4.position.y = -28;

  	mallarobot.scale.set( 0.05, 0.05, 0.05);
  	mallarobot.rotation.x = 3.1416/2;
  	mallarobot.rotation.y = (5*3.1416)/4;
  	

	var luzPuntual = new THREE.PointLight( 0xffffff );
  	luzPuntual.position.x = 50;
  	luzPuntual.position.y = 100;
  	luzPuntual.position.z = 500;

	escena = new THREE.Scene();
	escena.add(mallarobot);
	escena.add(luzPuntual);
	escena.add(cubo1);
	escena.add(cubo2);
	escena.add(cubo3);
	escena.add(cubo4);

	camara = new THREE.PerspectiveCamera();
	camara.position.z = 70;

	raycaster1 = new THREE.Raycaster( mallarobot.position, new THREE.Vector3(1,0,0));
    raycaster2 = new THREE.Raycaster( mallarobot.position, new THREE.Vector3(-1,0,0));
    raycaster3 = new THREE.Raycaster( mallarobot.position, new THREE.Vector3(0,1,0));
    raycaster4 = new THREE.Raycaster( mallarobot.position, new THREE.Vector3(0,-1,0));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerHeight*.95, window.innerHeight*.95 );
	document.body.appendChild( renderer.domElement );

	stepx=0.1;
	stepy=0.1;
	steprot = 0;
}

function loop(){
	obstaculo1 = raycaster1.intersectObject( cubo1 );
  	obstaculo2 = raycaster2.intersectObject( cubo2 );
  	obstaculo3 = raycaster3.intersectObject( cubo3 );
  	obstaculo4 = raycaster4.intersectObject( cubo4 );
  	if ((obstaculo1.length > 0 && (obstaculo1[0].distance <= 10)) || (obstaculo2.length > 0 && (obstaculo2[0].distance <= 10))){
      	stepx = -stepx;
      	//stepy = 0;
      }

     if ((obstaculo3.length > 0 && (obstaculo3[0].distance <= 10)) || (obstaculo4.length > 0 && (obstaculo4[0].distance <= 10))){
     	stepy = -stepy;
     	//stepx = 0;
     }

	requestAnimationFrame( loop );
	renderer.render( escena, camara );
	
	mallarobot.mallaRueda1.rotation.z += 0.01;
	mallarobot.mallaRueda2.rotation.z += 0.01;
	mallarobot.mallaRueda3.rotation.z += 0.01;
	mallarobot.mallaRueda4.rotation.z += 0.01;
	mallarobot.mallaVisor.rotation.y += 0.1;

	mallarobot.position.x += stepx;
	mallarobot.position.y += stepy;
	//mallarobot.rotation.y += 0.01;
	raycaster1.set( mallarobot.position, new THREE.Vector3(1,0,0) );
  	raycaster2.set( mallarobot.position, new THREE.Vector3(-1,0,0) );
  	raycaster3.set( mallarobot.position, new THREE.Vector3(0,1,0) );
  	raycaster4.set( mallarobot.position, new THREE.Vector3(0,-1,0) );
}

var mallaRobot, camara, escena, renderer, step;
var cubo1, cubo2, cubo3, cubo4;
var raycaster1, raycaster2, raycaster3, raycaster4;
var stepx,stepy,steprot;

setup();
loop();
