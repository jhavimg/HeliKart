import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js';

const PUNTOS = -3;

class Tronco extends THREE.Object3D {
  constructor(tubeGeo, t) {
    super();
    this.ti = t;
    
    this.puntos = -5;

    this.nodoRaiz = new THREE.Object3D();
    this.nodoRaiz.add(this.createTronco());

    this.tubo = tubeGeo;
    this.path = tubeGeo.parameters.path; 
    this.radio = tubeGeo.parameters.radius;
    this.segmentos = tubeGeo.parameters.tubularSegments;

    //Nodo rotacion
    this.nodoRotacion = new THREE.Object3D();
    this.nodoRotacion.add(this.nodoRaiz);

    // Inicialización de nodoPosOrientTubo
    this.nodoPosOrientTubo = new THREE.Object3D();
    this.nodoPosOrientTubo.add(this.nodoRotacion);
    this.add(this.nodoPosOrientTubo);

    this.nodoRaiz.scale.set(0.25 , 0.25 , 0.25);
    this.nodoRaiz.position.y = this.radio + 0.25 * 0.25 + 0.05;
    
    this.cajaFigura = new THREE. Box3 ( ) ;
    this.cajaFigura.setFromObject ( this.nodoRaiz ) ;
    this.cajaVisible = new THREE.Box3Helper( this.cajaFigura , 0xCF00 ) ;
    this.add ( this.cajaVisible ) ;
  }

  createTronco(){
    var loader = new THREE.TextureLoader();
    var textura = loader.load('./img/tronco.png');
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set( 4, 4 );
        
    var material = new THREE.MeshStandardMaterial({
      map: textura,
    });

    var shape = new THREE.Shape();

    shape.moveTo(0.001, 0);
    shape.lineTo(0.25, 0.5);
    shape.lineTo(0.25, 2.5);
    shape.lineTo(0.001, 3);
    shape.lineTo(0.001, 0);
    
    
    var points = shape.extractPoints(10).shape;
    var cuerpo = new THREE.LatheGeometry(points, 15);
    cuerpo.rotateZ(Math.PI / 2);
    cuerpo.translate(1.5, 0, 0);
    var cuerpoMesh = new THREE.Mesh(cuerpo, material);

    var pincho = new THREE.CylinderGeometry(0.001, 0.05, 0.15, 64);
    pincho.translate(0, 0.3, 0);
    var pinchoMesh = new THREE.Mesh(pincho, material);
    
    var tronco_csg = new CSG();
    tronco_csg.union([cuerpoMesh, pinchoMesh]);
    pincho.translate(-0.5, 0, 0);
    pincho.rotateX(Math.PI / 4);
    tronco_csg.union([pinchoMesh]);
    pincho.rotateX(Math.PI / 4);
    pincho.translate(1, 0, 0);
    tronco_csg.union([pinchoMesh]);
    pincho.translate(0.25, 0, 0);
    pincho.rotateX(-Math.PI / 1.5);
    tronco_csg.union([pinchoMesh]);
    pincho.translate(-1.5, 0, 0);
    pincho.rotateX(-Math.PI / 4);
    tronco_csg.union([pinchoMesh]);
    pincho.translate(0.5, 0, 0);
    pincho.rotateX(-Math.PI / 5);
    tronco_csg.union([pinchoMesh]);
    pincho.translate(0.75, 0, 0);
    pincho.rotateX(-Math.PI / 6);
    tronco_csg.union([pinchoMesh]);
    pincho.rotateX(Math.PI * 1.5);
    pincho.translate(-1.35, 0, 0);
    tronco_csg.union([pinchoMesh]);
    pincho.translate(0.15, 0, 0);
    pincho.rotateX(-Math.PI);
    tronco_csg.union([pinchoMesh]);

    return tronco_csg.toMesh();
  }
  
  update () {
    var posTmp = this.path.getPointAt(this.ti);
    this.nodoPosOrientTubo.position.copy (posTmp);
    var tangente = this.path.getTangentAt(this.ti);
    posTmp.add (tangente);
    var segmentoActual = Math.floor(this.ti * this.segmentos);

    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt (posTmp);

    this.cajaFigura.setFromObject ( this.nodoRaiz ) ;
    this.cajaVisible = new THREE.Box3Helper( this.cajaFigura , 0xCF00 ) ;
  }

  getCaja(){
    return this.cajaFigura;
  }

  getPuntos(){
    return this.puntos;
  }
}

export { Tronco };
