import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class PowerUp extends THREE.Object3D {
  constructor(tubeGeo, t , rot) {
    super();

    this.puntos = 5;
   
    this.reloj = new THREE. Clock ( ) ;
    this.velocidad = Math.PI / 2 ;

    this.ti = t;
   
    this.nodoRaiz = new THREE.Object3D();
    this.createPowerUp();

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
    this.nodoRotacion.rotateZ(rot);
   
    this.cajaFigura = new THREE. Box3 ( ) ;
    this.cajaFigura.setFromObject ( this.nodoRaiz ) ;
    this.cajaVisible = new THREE.Box3Helper( this.cajaFigura , 0xCF00 ) ;
    this.add ( this.cajaVisible ) ;
  }

  createPowerUp(){
    var geometry = new THREE.CylinderGeometry(0.01, 0.5, 0.75, 4);

    // Textura piramides
    var loader = new THREE.TextureLoader();
    var textura = loader.load("img/piedra.png");
    const bumpMap = loader.load('img/Captura desde 2024-05-20 16-26-58.png');
    var stone = new THREE.MeshStandardMaterial({
      map: textura,
      bumpMap: bumpMap,
      bumpScale: 1,
      roughness: 0.7,
    });

    var rombo_up = new THREE.Mesh(geometry, stone);
    var rombo_down = new THREE.Mesh(geometry, stone);
    rombo_up.position.set(0, 0.75 / 2, 0);
    rombo_down.position.set(0, -0.75 / 2, 0);
    rombo_down.rotateX(-Math.PI);

    var esfera_resta = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.5));
    esfera_resta.rotateX(-Math.PI / 2);

    var piramida1_csg = new CSG();
    piramida1_csg.union([rombo_up]);
    piramida1_csg.subtract([esfera_resta]);
    var piramide2_csg = new CSG();
    piramide2_csg.union([rombo_down]);
    piramide2_csg.subtract([esfera_resta]);

    var piramide1Mesh = piramida1_csg.toMesh();
    var piramide2Mesh = piramide2_csg.toMesh();

    this.nodoRaiz.add(piramide1Mesh);
    this.nodoRaiz.add(piramide2Mesh)

    // ANILLO CON MATERIAL
    var materialAnillo = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      emissive: 0xDEBC12,
      roughness: 0,
      metalness: 1,
      fog: true
    });

    var anillo = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 16, 50), materialAnillo);
    anillo.rotateX(-Math.PI / 2);
    var anillo_csg = new CSG();
    anillo_csg.union([anillo]);
    anillo_csg.subtract([esfera_resta]);
   
    var anilloMesh = anillo_csg.toMesh();
    this.nodoRaiz.add(anilloMesh);

    // TEXTURA EN ESFERA
    const textureLoader = new THREE.TextureLoader();

    const lavabasecolor = textureLoader.load("./img/lava/Lava_005_COLOR.jpg");
    const lavanormalMap = textureLoader.load("./img/lava/Lava_005_NORM.jpg");
    const lavaheightMap = textureLoader.load("./img/lava/Lava_005_DISP.png");
    const lavaroughnessMap = textureLoader.load("./img/lava/Lava_005_ROUGH.jpg");
    const lavaambientOcclusionMap = textureLoader.load("./img/lava/Lava_005_OCC.jpg");
    const lavaemissive = textureLoader.load("./img/lava/Lava_005_MASK.jpg");

    var matEsfera = new THREE.MeshStandardMaterial({ color: 0xffff66, map: lavabasecolor, normalMap: lavanormalMap, displacementMap: lavaheightMap, displacementScale: 0.1, roughnessMap: lavaroughnessMap, roughness: 1, aoMap: lavaambientOcclusionMap, emissiveMap: lavaemissive });

    var esfera = new THREE.Mesh(new THREE.SphereGeometry(0.1) , matEsfera)
    this.nodoRaiz.add(esfera);
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