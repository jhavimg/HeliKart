import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js';

function generarPuntosCirculo(radio, numPuntos) {
  var puntos = [];

  // Calcular el ángulo entre cada punto
  var anguloIncremento = (2 * Math.PI) / numPuntos;

  // Generar los puntos del círculo
  for (var i = 0; i < numPuntos; i++) {
      // Calcular el ángulo para este punto
      var angulo = i * anguloIncremento;

      // Calcular las coordenadas x e y para este punto
      var x = radio * Math.cos(angulo);
      var y = radio * Math.sin(angulo);

      // Crear un nuevo Vector2 con las coordenadas x e y y agregarlo a la lista de puntos
      puntos.push(new THREE.Vector2(x, y));
  }

  return puntos;
}

class Zepelin extends THREE.Object3D {
  constructor(tubeGeo, t) {
    super();
    this.ti = t;
    this.relojMovimientoZepelin = new THREE.Clock();

    this.nodoRaizZepelin = new THREE.Object3D();

    this.globo = this.createGlobo();
    this.globo.position.y = 1.7;
    this.globo.userData = this;

    this.nodoRaizZepelin.add(this.globo);

    this.cabina = this.createCabina();
    this.cabina.userData = this;
    this.cabina.position.y = -0.1

    this.nodoRaizZepelin.add(this.cabina);
    
    var flap1 = this.createFlaps();
    flap1.userData = this;
    flap1.position.set(0 , 1.3 , -4);
    this.globo.add(flap1);

    var flap2 = this.createFlaps();
    flap2.userData = this;
    flap2.position.set(1.3 , 0 , -4);
    flap2.rotateX(-Math.PI/2);
    this.globo.add(flap2);

    var flap3 = this.createFlaps();
    flap3.userData = this;
    flap3.position.set(-1.3 , 0 , -4);
    flap3.rotateX(Math.PI/2)
    this.globo.add(flap3);

    this.nodoRaizZepelin.scale.set(0.25 , 0.25 , 0.25);
    this.add(this.nodoRaizZepelin);

    this.nodoRaizZepelin.userData = this;
    this.nodoRaizZepelin.rotateY(Math.PI / 2);

    //Nodo rotacion
    this.nodoRotacion = new THREE.Object3D();
    this.nodoRotacion.add(this.nodoRaizZepelin);

    // Posicionar zepelin en circuito
    this.tubo = tubeGeo;
    this.path = tubeGeo.parameters.path; 
    this.radio = tubeGeo.parameters.radius;
    this.segmentos = tubeGeo.parameters.tubularSegments;

    this.nodoPosOrientTubo = new THREE.Object3D();
    this.nodoPosOrientTubo.add(this.nodoRotacion);
    this.add(this.nodoPosOrientTubo);

    this.nodoRaizZepelin.scale.set(0.25 , 0.25 , 0.25);
    this.nodoRaizZepelin.position.y = this.radio + 1;

    // Movimiento del zepelin
    this.movimiento = true;
    this.direccion = 1;
    this.recorrido = 2.5;
    this.velocidadGiro = Math.PI * 0.05;

    // Puntos zepelin
    this.puntos = 10;
  }

  createGlobo(){
    var shape = new THREE.Shape();
    var puntos = generarPuntosCirculo(0.2 , 64);
    shape.moveTo(puntos[0].x, puntos[0].y);

    // Crear líneas hacia los puntos restantes
    for (var i = 1; i < puntos.length; i++) {
        shape.lineTo(puntos[i].x, puntos[i].y);
    }

    const extrudeSettings = { 
      depth: 0, 
      bevelEnabled: true, 
      bevelThickness: 5,//largo de lo abombao
      bevelSize: 1.5, //cuanto se va a abombar
      bevelSegments: 60, //esto crea mas segmentos por lo q se ve mas redondeado
      curveSegments: 60 //segmentos para la curva del shape
    };
    
    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

    var mat = new THREE.MeshStandardMaterial({
      color: 0x0009FF,
    });

    var globo = new THREE.Mesh(geometry , mat);
    globo.position.y = 1.7;

    return globo;
  }

  createCabina(){
    var cabina_cuerpo = new THREE.Mesh(new THREE.BoxGeometry(0.7 , 0.3 , 1.5) , new THREE.MeshStandardMaterial({color: 0xCFCFFF,}));
    var cabina_delantera = new THREE.Mesh(new THREE.CylinderGeometry(0.7 / 2 , 0.7 / 2 , 0.3) , new THREE.MeshNormalMaterial());
    var cabina_trasera = new THREE.Mesh(new THREE.CylinderGeometry(0.7 / 2 , 0.7 / 2 , 0.3) , new THREE.MeshNormalMaterial());
    cabina_cuerpo.position.set(0 , 0 , 0 );
    cabina_delantera.position.set(0 , 0 , 1.5 / 2 );
    cabina_trasera.position.set(0 , 0 , -1.5 / 2 );

    var Figura_cabina = new CSG();
    Figura_cabina.union([cabina_cuerpo , cabina_delantera , cabina_trasera]);
    var cabina = Figura_cabina.toMesh();
    
    return cabina;
  }

  createFlaps(){
    var shape = new THREE.Shape();
    shape.moveTo(0,0);
    shape.lineTo(0 , 1); shape.lineTo(0.7 , 1); shape.lineTo(2 , 0); shape.closePath();
    
    const extrudeSettings = { 
      depth: 0, 
      bevelEnabled: true, 
      bevelThickness: 0.05,//largo de lo abombao
      bevelSize: 0.1, //cuanto se va a abombar
      bevelSegments: 60, //esto crea mas segmentos por lo q se ve mas redondeado
      curveSegments: 60 //segmentos para la curva del shape
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

    var mat = new THREE.MeshStandardMaterial({
      color: 0x0009FF,
    });

    var flap = new THREE.Mesh(geometry , mat);
    flap.rotateY(-Math.PI/2);
    return flap;
  }

  getPuntos(){
    return this.puntos;
  }
  
  update () {

    // Posicionar en circuito
    var posTmp = this.path.getPointAt(this.ti);
    this.nodoPosOrientTubo.position.copy (posTmp);
    var tangente = this.path.getTangentAt(this.ti);
    posTmp.add (tangente);
    var segmentoActual = Math.floor(this.ti * this.segmentos);

    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt (posTmp);
  
    // Movimiento del zepelin
    var segundosTranscurridos = this.relojMovimientoZepelin.getDelta ( ); 
    var anguloMovimiento = this.velocidadGiro * segundosTranscurridos ;
    this.nodoRotacion.rotateZ(-anguloMovimiento);

  }

  
}

export { Zepelin };
