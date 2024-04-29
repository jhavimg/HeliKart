import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js';

const PUNTOS = -3;

class Tronco extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

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

    var tronco = tronco_csg.toMesh();
    this.nodoRaiz = new THREE.Object3D();
    this.nodoRaiz.add(tronco);

    this.add(this.nodoRaiz);
    
    this.cajaFigura = new THREE. Box3 ( ) ;
    this.cajaFigura.setFromObject ( this.nodoRaiz ) ;
    this.cajaVisible = new THREE.Box3Helper( this.cajaFigura , 0xCF00 ) ;
    this.add ( this.cajaVisible ) ;
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
    this.cajaFigura.setFromObject ( this.nodoRaiz ) ;
    this.cajaVisible = new THREE.Box3Helper( this.cajaFigura , 0xCF00 ) ;
  }
}

export { Tronco };
