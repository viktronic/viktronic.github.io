function Sensor(position,direction){
 THREE.Raycaster.call(this,position,direction);
 this.colision=false;
}
Sensor.prototype=new THREE.Raycaster();

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

function completo( x=0, y=0 ){
	Agent.call(this,x,y);
	var material = new THREE.MeshPhongMaterial({color: 0xff0000 });

	var union = new THREE.CylinderGeometry( 10, 10, 150 );
	var caja = new THREE.BoxGeometry( 200, 30, 130 );
	var tubo = new THREE.CylinderGeometry( 10, 10, 100 );
	//var visor = new THREE.BoxGeometry( 20, 10, 30 );

	this.sensor = new Sensor();
	this.sensor2 = new Sensor();
	this.sensor3 = new Sensor();
	this.actuator = new Array();
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
completo.prototype = new Agent();

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
    this.add(new completo(j-offset,-(i-offset)));
  }
 }
}

completo.prototype.sense=function(environment){
 this.sensor.set(this.position, new THREE.Vector3(-Math.cos(this.rotation.y),-Math.sin(this.rotation.y),0));
 this.sensor2.set(this.position, new THREE.Vector3(Math.sin(this.rotation.y),-Math.cos(this.rotation.y),0));
 this.sensor3.set(this.position, new THREE.Vector3(-Math.sin(this.rotation.y),Math.cos(this.rotation.y),0));
 var obstaculo = this.sensor.intersectObjects(environment.children,true);
 var obstaculo2 = this.sensor2.intersectObjects(environment.children,true);
 var obstaculo3 = this.sensor3.intersectObjects(environment.children,true);
 if ((obstaculo.length>0&&(obstaculo[0].distance<=0.5)))
  this.sensor.colision=true;
 else
  this.sensor.colision=false;

 if((obstaculo2.length>0&&(obstaculo2[0].distance<=0.5)))
  this.sensor2.colision=true;
 else
  this.sensor2.colision=false;

 if((obstaculo3.length>0&&(obstaculo3[0].distance<=0.5)))
  this.sensor3.colision=true;
 else
  this.sensor3.colision=false;
}

completo.prototype.plan = function(environment){
 this.actuator.commands=[];
 if(this.sensor.colision==false)
   this.actuator.commands.push('Derecho');
 else
 	if(this.sensor2.colision==false)
       this.actuator.commands.push('RotarDerecha');
    else if(this.sensor3.colision==false)
       this.actuator.commands.push('RotarIzquierda');
   	else 
   	   this.actuator.commands.push('Para');
}

completo.prototype.act=function(environment){
 var command=this.actuator.commands.pop();
 if(command==undefined)
  console.log('Undefined command');
 else if(command in this.operations)
  this.operations[command](this);
 else
  console.log('Unknown command'); 
}

completo.prototype.operations = {};

completo.prototype.operations.Derecho = function(mallarobot,step){
 if(step==undefined)
 step=0.1;
 
 mallarobot.scale.set( 0.01, 0.01, 0.01);
 mallarobot.rotation.x = Math.PI/2;
 //mallarobot.rotation.y = -Math.PI/2;
 //mallarobot.arrow.setDirection(new THREE.Vector3(-Math.cos(mallarobot.rotation.y),0,-Math.sin(mallarobot.rotation.y)));
 mallarobot.mallaRueda1.rotation.z += 0.01;
 mallarobot.mallaRueda2.rotation.z += 0.01;
 mallarobot.mallaRueda3.rotation.z += 0.01;
 mallarobot.mallaRueda4.rotation.z += 0.01;
 mallarobot.mallaVisor.rotation.y += 0.1;

 mallarobot.position.x -= step*Math.cos(mallarobot.rotation.y);
 mallarobot.position.y -= step*Math.sin(mallarobot.rotation.y);
};

completo.prototype.operations.RotarIzquierda = function(mallarobot,angulo){
 if(angulo==undefined){
  angulo=Math.PI/2;
 }
 mallarobot.rotation.y-=angulo;
};

completo.prototype.operations.RotarDerecha = function(mallarobot,angulo){
 if(angulo==undefined){
  angulo=Math.PI/2;
 }
 mallarobot.rotation.y+=angulo;
};

completo.prototype.operations.Para = function(mallarobot,angulo){
};

function setup(){
 var mapa = new Array();
  mapa[0] = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  mapa[1] = "x           x    x           x";
  mapa[2] = "x           x    x           x";
  mapa[3] = "x           x    x           x";
  mapa[4] = "x  x  xxxxxxx    x     xxx   x";
  mapa[5] = "x  x  x          x       x   x";
  mapa[6] = "x  x  x      xxxxx     xxx   x";
  mapa[7] = "x  x     x             x     x";
  mapa[8] = "x  x     x             x     x";
  mapa[9] = "x  x     x             x     x";
 mapa[10] = "x  xxx   xxxxxxxxx     xxx   x";
 mapa[11] = "x    x           x       x   x";
 mapa[12] = "x    x           x       x   x";
 mapa[13] = "x  xxx   xxxx    x    x  x   x";
 mapa[14] = "x  x     x            x  x   x";
 mapa[15] = "x  x     x            x  x   x";
 mapa[16] = "x  xxx   x     xxxxxxxx  x   x";
 mapa[17] = "x        x  r  x             x";
 mapa[18] = "x        x     x             x";
 mapa[19] = "x        x     x             x";
 mapa[20] = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
 mapa[21] = "x                            x";
 mapa[22] = "x                            x";
 mapa[23] = "x                            x";
 mapa[24] = "x                            x";
 mapa[25] = "x                            x";
 mapa[26] = "x                            x";
 mapa[27] = "x                            x";
 mapa[28] = "x                            x";
 mapa[29] = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
 entorno=new Environment();
 entorno.setMap(mapa);
 var piso=new THREE.Mesh(new THREE.BoxGeometry(29,30,0.1), new THREE.MeshLambertMaterial({color:0x00ff00}));
 piso.position.z=-0.5;
 piso.position.x=-0.5;
 piso.position.y=0.5;
 luzPuntual = new THREE.PointLight(0xffffff);
 luzPuntual.position.y=15;
 luzPuntual.position.z=15;
 /*
 luzPuntual = new THREE.PointLight(0xffffff);
 luzPuntual.position.x=0;  
 luzPuntual.position.y=10;
 luzPuntual.position.z=30;*/
 camara=new THREE.PerspectiveCamera();
 camara.position.z=40;
 renderer = new THREE.WebGLRenderer();
 renderer.setSize(window.innerHeight*0.95, window.innerHeight*0.95);
 document.body.appendChild(renderer.domElement);
 entorno.add(camara);
 entorno.add(luzPuntual);
 entorno.add(piso);
 renderer.shadowMap.enabled=true;
 piso.receiveShadow=true;
 luzPuntual.castShadow=true;

}

function loop(){
 requestAnimationFrame(loop);
 entorno.sense();
 entorno.plan();
 entorno.act();
 renderer.render(entorno,camara);
}

var luzPuntual, camara, entorno, renderer, step, mallarobot, angulo,object;

setup();
loop();
