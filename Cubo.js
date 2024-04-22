import * as THREE from '../libs/three.module.js'

class Cubo extends THREE.Object3D {
  constructor(tubeGeo, gui, titleGui) {
    super();

    this.createGUI(gui, titleGui);

    var boxGeom = new THREE.BoxGeometry(1, 1, 1);
    var boxMat = new THREE.MeshNormalMaterial;

    var box = new THREE.Mesh(boxGeom, boxMat);
    //this.add(box);

    // Posicionamiento de coche en tubo
    this.tubo = tubeGeo;
    this.path = tubeGeo.parameters.path; 
    this.radio = tubeGeo.parameters.radius;
    this.segmentos = tubeGeo.parameters.tubularSegments;

    // Inicialización de nodoPosOrientTubo
    this.nodoPosOrientTubo = new THREE.Object3D();
    this.add(this.nodoPosOrientTubo);
    this.nodoPosOrientTubo.add (box);
  }

  createGUI(gui, titleGui) {
    this.guiControls = {
      sizeX: 1.0,
      sizeY: 1.0,
      sizeZ: 1.0,

      rotX: 0.0,
      rotY: 0.0,
      rotZ: 0.0,

      posX: 0.0,
      posY: 0.0,
      posZ: 0.0,

      reset: () => {
        this.guiControls.sizeX = 1.0;
        this.guiControls.sizeY = 1.0;
        this.guiControls.sizeZ = 1.0;

        this.guiControls.rotX = 0.0;
        this.guiControls.rotY = 0.0;
        this.guiControls.rotZ = 0.0;

        this.guiControls.posX = 0.0;
        this.guiControls.posY = 0.0;
        this.guiControls.posZ = 0.0;
      }
    }

    var folder = gui.addFolder(titleGui);
    
    folder.add(this.guiControls, 'sizeX', 0.1, 5.0, 0.01).name('Tamaño X : ').listen();
    folder.add(this.guiControls, 'sizeY', 0.1, 5.0, 0.01).name('Tamaño Y : ').listen();
    folder.add(this.guiControls, 'sizeZ', 0.1, 5.0, 0.01).name('Tamaño Z : ').listen();

    folder.add(this.guiControls, 'rotX', 0.0, Math.PI / 2, 0.01).name('Rotación X : ').listen();
    folder.add(this.guiControls, 'rotY', 0.0, Math.PI / 2, 0.01).name('Rotación Y : ').listen();
    folder.add(this.guiControls, 'rotZ', 0.0, Math.PI / 2, 0.01).name('Rotación Z : ').listen();

    folder.add(this.guiControls, 'posX', -20.0, 20.0, 0.01).name('Posición X : ').listen();
    folder.add(this.guiControls, 'posY', 0.0, 10.0, 0.01).name('Posición Y : ').listen();
    folder.add(this.guiControls, 'posZ', -20.0, 20.0, 0.01).name('Posición Z : ').listen();

    folder.add(this.guiControls, 'reset').name('[ Reset ]');
  }

  update() {
    // Posicionamiento en tubo
    var t = (performance.now() % 10000) / 10000; // Ejemplo de animación continua
    var posTmp = this.path.getPointAt(t);
    var tangente = this.path.getTangentAt(t);
    var segmentoActual = Math.floor(t * this.segmentos);
    var binormal = this.tubo.binormals[segmentoActual];

    // Desplazamiento adicional en la dirección de la binormal para posicionar el coche encima del tubo
    var desplazamiento = binormal.clone().multiplyScalar(this.radio + 0.5); // Ajusta este valor según la altura del coche
    posTmp.add(desplazamiento);

    // Posicionar y orientar el nodo del coche
    this.nodoPosOrientTubo.position.copy(posTmp);
    this.nodoPosOrientTubo.up = binormal;
    this.nodoPosOrientTubo.lookAt(posTmp.clone().add(tangente));
  }
}

export { Cubo };
