import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class PowerUp extends THREE.Object3D {
  constructor(tubeGeo, t) {
    super();

    this.puntos = 5;
    
    this.reloj = new THREE. Clock ( ) ;
    this.velocidad = Math.PI / 2 ;

    this.ti = t;
    
    this.nodoRaiz = new THREE.Object3D();
    this.nodoRaiz.add(this.createPowerUp());

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

    this.nodoRaiz.scale.set(0.2 , 0.2 , 0.2);
    this.nodoRaiz.position.y = this.radio + 0.75 * 0.25;
    
    this.cajaFigura = new THREE. Box3 ( ) ;
    this.cajaFigura.setFromObject ( this.nodoRaiz ) ;
    this.cajaVisible = new THREE.Box3Helper( this.cajaFigura , 0xCF00 ) ;
    this.add ( this.cajaVisible ) ;
  }

  createPowerUp(){
    var geometry = new THREE.CylinderGeometry(0.01 , 0.5 , 0.75 , 4);
    var mat = new THREE.MeshNormalMaterial();

    var boost = new CSG();

    var rombo_up = new THREE.Mesh(geometry , mat);
    var rombo_down = new THREE.Mesh(geometry , mat);
    var anillo = new THREE.Mesh (new THREE.TorusGeometry(0.42 , 0.08 , 16 , 50) , mat );
    var esfera_resta = new THREE.Mesh(new THREE.CylinderGeometry(0.25 , 0.25 , 1.5));
    var esfera = new THREE.Mesh(new THREE.SphereGeometry(0.2) , mat)
    esfera_resta.rotateX(-Math.PI/2 );
    rombo_up.position.set(0 , 0.75/2 , 0);
    rombo_down.position.set(0 , -0.75/2, 0);
    rombo_down.rotateX(-Math.PI );
    anillo.rotateX(-Math.PI/2 );

    boost.union([rombo_up , rombo_down]);
    boost.union([anillo]);
    boost.subtract([esfera_resta]);
    boost.union([esfera]);

    return boost.toMesh();
  }
  
  update () {

    var segundosTranscurridos = this.reloj.getDelta ( ); 
    var esp_ang = this.velocidad * segundosTranscurridos ;
    this.nodoRaiz.rotateY(esp_ang);

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

export { PowerUp };
