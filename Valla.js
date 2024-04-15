import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js';

const PUNTOS = -3;

class Valla extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

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
    

    var valla = valla_csg.toMesh();
    this.add(valla);

  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX : 1.0,
      sizeY : 1.0,
      sizeZ : 1.0,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
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
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.01).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.01).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.01).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI/2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI/2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.01).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.01).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.01).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.01).name ('Posición Z : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    // this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    // this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    // this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { Valla };
