function sensor(position,direction){
	THREE.raycaster.call(this,position,direction);
	this.collision=false;
}
sensor.prototype = new THREE.Raycaster();

function rueda(){
	THREE.Object3D.call(this);
	this.arcShape = new THREE.Shape();
				this.arcShape.moveTo( 50, 10 );
				this.arcShape.absarc( 10, 10, 40, 0, Math.PI*2, false );
	this.holePath = new THREE.Path();
				this.holePath.moveTo( 20, 10 );
				this.holePath.absarc( 10, 10, 10, 0, Math.PI*2, true );
				this.arcShape.holes.push( this.holePath );

	this.extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

	this.rueda = new THREE.ExtrudeGeometry( this.arcShape, this.extrudeSettings );
	this.material = new THREE.MeshPhongMaterial({ color: 0x000000 });
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

function RBA(x=0,y=0){
Agent.call(this,x,y);
THREE.ImageUtils.crossOrigin = '';
	var textura = THREE.ImageUtils.loadTexture('http://threejs.org/examples/textures/brick_diffuse.jpg');
	var material = new THREE.MeshPhongMaterial({color: 0xff0000 });
	var material2 = new THREE.MeshPhongMaterial({map: textura });

	var union = new THREE.CylinderGeometry( 10, 10, 150 );
	var caja = new THREE.BoxGeometry( 200, 30, 130 );
	var tubo = new THREE.CylinderGeometry( 10, 10, 100 );
	//var visor = new THREE.BoxGeometry( 20, 10, 30 );

	var mallaUnion1 = new THREE.Mesh( union, material );
	var mallaUnion2 = new THREE.Mesh( union, material );
	this.mallaCaja = new THREE.Mesh( caja, material2 );
	var mallaTubo = new THREE.Mesh( tubo, material );
	this.mallaVisor = new visor();

	this.mallaRueda1 = new rueda();
	this.mallaRueda2 = new rueda();
	this.mallaRueda3 = new rueda();
	this.mallaRueda4 = new rueda();

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
	//THREE.GeometryUtils.merge( robot, mallaCaja );
	THREE.GeometryUtils.merge( robot, mallaTubo );
	//THREE.GeometryUtils.merge( robot, mallaVisor );
	this.mallaRobot = new THREE.Mesh( robot , material );
	
	this.sensor=new sensor();
 	this.actuator=new Array();
 	
 	this.add(mallaCaja);
 	this.add(mallaVisor);
 	this.add(mallaRueda1);
 	this.add(mallaRueda2);
 	this.add(mallaRueda3);
 	this.add(mallaRueda4);
 	this.add(mallaRobot);
}
RBA.prototype = new Agent();

function Wall(size,x=0,y=0){
 THREE.Mesh.call(this,new THREE.BoxGeometry(size,size,size), new THREE.MeshNormalMaterial()); 
 this.size=size;
 this.position.x=x;
 this.position.y=y;
}
Wall.prototype=new THREE.Mesh();

Environment.prototype.setMap=function(map){
 var offset=Math.floor(map.length/2);
 for(var i=0;i<map.length;i++){
  for(var j=0;j<map.length;j++){
   if(map[i][j]==="x")
    this.add(new Wall(1, j-offset,-(i-offset)));
   else if(map[i][j]==="r")
    this.add(new RBA(j-offset,-(i-offset)));
  }
 }
}	

RBA.prototype.sense=function(environment){
 this.sensor.set(this.position, new THREE.Vector3(Math.cos(this.rotation.z),Math.sin(this.rotation.z),0));
 //this.sensor2.set(this.position, new THREE.Vector3(Math.sin(this.rotation.z),Math.cos(this.rotation.z),0));
 var obstaculo = this.sensor.intersectObjects(environment.children,true);
 //var obstaculo2 = this.sensor2.intersectObjects(environment.children,true);
 if ((obstaculo.length>0&&(obstaculo[0].distance<=1)))
  this.sensor.colision=true;
 else
  this.sensor.colision=false;
 /*if((obstaculo2.length>0&&(obstaculo2[0].distance<=1)))
  this.sensor2.colision=true;
 else
  this.sensor2.colision=false;*/
}

RBA.prototype.plan = function(environment){
 this.actuator.commands=[];
 /*if(this.sensor.colision==false && this.sensor2.colision==true)
  this.actuator.commands.push('Derecho');
 else if(this.sensor.colision==true && this.sensor2.colision==true)
   this.actuator.commands.push('RotarDerecha');
 else
   this.actuator.commands.push('RotarIzquierda');*/
  if(this.sensor.colision==true)
   this.actuator.commands.push('RotarIzquierda');
  else
   this.actuator.commands.push('Derecho');
}

RBA.prototype.act=function(environment){
 var command=this.actuator.commands.pop();
 if(command==undefined)
  console.log('Undefined command');
 else if(command in this.operations)
  this.operations[command](this);
 else
  console.log('Unknown command'); 
}

RBA.prototype.operations = {};

RBA.prototype.operations.Derecho = function(robot,step){
 if(step==undefined)
  step=0.1;
 robot.position.x+=step*Math.cos(robot.rotation.z);
 robot.position.y+=step*Math.sin(robot.rotation.z);
 robot.Cuerpo.rotation.z-=0.5;
};

RBA.prototype.operations.RotarDerecha = function(robot,angulo){
 if(angulo==undefined){
  angulo=-Math.PI/2;
 }
 robot.rotation.z+=angulo;
};

RBA.prototype.operations.RotarIzquierda = function(robot,angulo){
 if(angulo==undefined){
  angulo=Math.PI/2;
 }
 robot.rotation.z+=angulo;
};

function setup(){
	var mapa = new Array();
  mapa[0] = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  mapa[1] = "x   r                      x";
  mapa[2] = "x                          x";
  mapa[3] = "x                          x";
  mapa[4] = "x                          x";
  mapa[5] = "x                          x";
  mapa[6] = "x                          x";
  mapa[7] = "x                          x";
  mapa[8] = "x                          x";
  mapa[9] = "x                          x";
 mapa[10] = "x                          x";
 mapa[11] = "x                          x";
 mapa[12] = "x                          x";
 mapa[13] = "xXXXXXXXXXXXX    XXXXXXXXXXx";
 mapa[14] = "x                          x";
 mapa[15] = "x                          x";
 mapa[16] = "x                          x";
 mapa[17] = "x                          x";
 mapa[18] = "x                          x";
 mapa[19] = "x                          x";
 mapa[20] = "x                          x";
 mapa[21] = "x                          x";
 mapa[22] = "x                          x";
 mapa[23] = "x                          x";
 mapa[24] = "x                          x";
 mapa[25] = "x                          x";
 mapa[26] = "x                          x";
 mapa[27] = "x                          x";
 mapa[28] = "x r                        x";
 mapa[29] = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx";

 entorno=new Environment();
 entorno.setMap(mapa);

	var luzPuntual = new THREE.PointLight( 0xffffff );
  	luzPuntual.position.x = 50;
  	luzPuntual.position.y = 100;
  	luzPuntual.position.z = 500;

	camara = new THREE.PerspectiveCamera();
	camara.position.z = 50;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerHeight*.95, window.innerHeight*.95 );
	document.body.appendChild( renderer.domElement );
	entorno.add(camara);
 	entorno.add(luzPuntual);
}

function loop(){
 requestAnimationFrame(loop);
 entorno.sense();
 entorno.plan();
 entorno.act();
 renderer.render(entorno,camara);
}

var entorno,luzPuntual,robot,step,angulo,camara,renderer;

setup();
loop();
