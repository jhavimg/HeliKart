import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Boost extends THREE.Object3D {
  constructor(tubeGeo, t , rot) {
    super();
    this.ti = t;

    this.puntos = 5;

    this.reloj = new THREE.Clock();
    this.velocidad = Math.PI / 2;

    this.tubo = tubeGeo;
    this.path = tubeGeo.parameters.path; 
    this.radio = tubeGeo.parameters.radius;
    this.segmentos = tubeGeo.parameters.tubularSegments;

    this.nodoRaiz = new THREE.Object3D();
    this.nodoRaiz.add(this.createBoost());

    //Nodo rotacion
    this.nodoRotacion = new THREE.Object3D();
    this.nodoRotacion.add(this.nodoRaiz);

    // Inicialización de nodoPosOrientTubo
    this.nodoPosOrientTubo = new THREE.Object3D();
    this.nodoPosOrientTubo.add(this.nodoRotacion);
    this.add(this.nodoPosOrientTubo);

    this.nodoRaiz.scale.set(0.15, 0.15, 0.15);
    this.nodoRaiz.position.y = this.radio + 0.2;
    this.nodoRotacion.rotateZ(rot);

    this.cajaFigura = new THREE.Box3();
    this.cajaFigura.setFromObject(this.nodoRaiz);

  }

  createBoost(){
    var material = new THREE.MeshStandardMaterial({
      color: 0xCFCFCF,
      metalness: 0.6,
      roughness: 0,
    });

    var material2 = new THREE.MeshStandardMaterial({
      color: 0x110000,
      metalness: 0.6,
      roughness: 0,
    });

    var material3 = new THREE.MeshStandardMaterial({
      color: 0x3C4DF5,
      metalness: 0.6,
      roughness: 1,
    });

    var cil = new THREE.CylinderGeometry(0.5, 0.5, 2);
    var esf = new THREE.SphereGeometry(0.5);

    esf.translate(0, 1, 0);

    var cilMesh = new THREE.Mesh(cil, material);
    var esfMesh = new THREE.Mesh(esf, material);

    var csg = new CSG();
    csg.union([cilMesh, esfMesh]);

    var cil2 = new THREE.CylinderGeometry(0.05, 0.05, 0.75);
    cil2.translate(0, 1.8, 0);
    var cil2Mesh = new THREE.Mesh(cil2, material2);

    var cil3 = new THREE.CylinderGeometry(0.05, 0.05, 0.25);
    cil3.rotateZ(Math.PI / 2);
    cil3.translate(0.125, 2, 0);
    var cil3Mesh = new THREE.Mesh(cil3, material);

    var valvula = new THREE.CylinderGeometry(0.05, 0.02, 0.25);
    valvula.rotateZ(Math.PI / 2);
    valvula.translate(0.35, 2, 0);
    var valvulaMesh = new THREE.Mesh(valvula, material);

    var rueda = new THREE.CylinderGeometry(0.25, 0.25, 0.05);
    rueda.translate(0, 2.25, 0);
    var ruedaMesh = new THREE.Mesh(rueda, material);

    var ruedaCil = new THREE.CylinderGeometry(0.1, 0.1, 0.1);
    ruedaCil.translate(0.25, 2.25, 0);
    var ruedaCilMesh = new THREE.Mesh(ruedaCil, material);

    var RuedaCsg = new CSG();
    RuedaCsg.union([ruedaMesh]);
    RuedaCsg.subtract([ruedaCilMesh]);

    ruedaCil.translate(-0.5, 0, 0);
    RuedaCsg.subtract([ruedaCilMesh]);
    ruedaCil.translate(0.25, 0, 0.25);
    RuedaCsg.subtract([ruedaCilMesh]);
    ruedaCil.translate(0, 0, -0.5);
    RuedaCsg.subtract([ruedaCilMesh]);

    var rueGeo = RuedaCsg.toGeometry();
    rueGeo.translate(0, -0.1, 0);
    var rueMesh = new THREE.Mesh(rueGeo, material);

    var csg2 = new CSG();
    csg2.union([rueMesh, cil3Mesh, valvulaMesh, cil2Mesh]);
    

    var shape = new THREE.Shape();
    shape.moveTo(0.001, 5);
    shape.lineTo(0.3, 5);
    shape.bezierCurveTo(0.3, 5.5, 0.35, 5.8, 0.001, 6);

    var point = shape.extractPoints(7).shape;
    var propulsor = new THREE.LatheGeometry(point, 10);

    var csg3 = new CSG();
    propulsor.translate(0.5, -6, 0);
    var propulsorMesh = new THREE.Mesh(propulsor, material3);
    csg3.union([propulsorMesh]);
    propulsor.rotateY(Math.PI / 2);
    csg3.union([propulsorMesh]);
    propulsor.rotateY(Math.PI / 2);
    csg3.union([propulsorMesh]);
    propulsor.rotateY(Math.PI / 2);
    csg3.union([propulsorMesh]);

    var boostMesh = new THREE.Mesh();
    boostMesh.add(csg.toMesh());
    boostMesh.add(csg2.toMesh());
    boostMesh.add(csg3.toMesh());
    return boostMesh;
  }

  update() {

    var segundosTranscurridos = this.reloj.getDelta();
    var esp_ang = this.velocidad * segundosTranscurridos;
    this.nodoRaiz.rotateY(esp_ang);

    var posTmp = this.path.getPointAt(this.ti);
    this.nodoPosOrientTubo.position.copy (posTmp);
    var tangente = this.path.getTangentAt(this.ti);
    posTmp.add (tangente);
    var segmentoActual = Math.floor(this.ti * this.segmentos);

    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt (posTmp);

    this.cajaFigura.setFromObject(this.nodoRaiz);
  }

  getCaja() {
    return this.cajaFigura;
  }

  getPuntos(){
    return this.puntos;
  }
}



export { Boost };