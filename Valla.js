import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js';

const PUNTOS = -3;

class Valla extends THREE.Object3D {
  constructor(tubeGeo, t , rot) {
    super();
    this.ti = t;
    //this.add(valla);

    this.puntos = -3;

    this.nodoRaiz = new THREE.Object3D();
    this.nodoRaiz.add(this.createValla());

    //this.add(this.nodoRaiz);

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
    this.nodoRaiz.position.y = this.radio;
    this.nodoRotacion.rotateZ(rot);
    
    this.cajaFigura = new THREE. Box3 ( ) ;
    this.cajaFigura.setFromObject ( this.nodoRaiz ) ;
    this.cajaVisible = new THREE.Box3Helper( this.cajaFigura , 0xCF00 ) ;
    this.add ( this.cajaVisible ) ;
  }

  createValla(){
    var texture = new THREE.TextureLoader().load('./img/wood.jpg');
    var material = new THREE.MeshStandardMaterial ({map: texture});
    
    var base = new THREE.CylinderGeometry(0.05, 0.5, 0.3);
    base.translate(0, 0.15, 0);
    var baseMesh = new THREE.Mesh(base, material);

    var valla_csg = new CSG();
    valla_csg.union([baseMesh]);

    var palo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    palo.translate(0, 1, 0);
    var paloMesh = new THREE.Mesh(palo, material);
    valla_csg.union([paloMesh]);

    var barrera = new THREE.BoxGeometry(2, 0.3, 0.1);
    barrera.translate(1, 1.6, 0);
    var barreraMesh = new THREE.Mesh(barrera, material);
    valla_csg.union([barreraMesh]);
    barrera.translate(0, -0.6, 0);
    valla_csg.union([barreraMesh]);

    base.translate(2, 0, 0);
    valla_csg.union([baseMesh]);
    palo.translate(2, 0, 0);
    valla_csg.union([paloMesh]);
    

    return valla_csg.toMesh();
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

export { Valla };
