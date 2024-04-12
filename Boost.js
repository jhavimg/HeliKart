import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class Nitro extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    this.createGUI(gui,titleGui);
    
    var mat = new THREE.MeshNormalMaterial();

    var boost = new CSG();

    var cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.15 , 0.15 , 0.75 ) , mat);
    var tapa = new THREE.Mesh(new THREE.SphereGeometry(0.15 , 32 , 32 , 0 , Math.PI * 2 , 0 , Math.PI / 2) , mat);
    tapa.position.set(0 , 0.75 / 2 , 0);
    
    var tubo = this.createtubo();
    tubo.position.set(0.15 ,-0.75 / 2 + 0.001 , 0);
    var tubo1 = this.createtubo();
    tubo1.position.set(0 ,-0.75 / 2 + 0.001 , -0.15);
    var tubo2 = this.createtubo();
    tubo2.position.set(-0.15 ,-0.75 / 2 + 0.001 , 0);
    var tubo3 = this.createtubo();
    tubo3.position.set(0 ,-0.75 / 2 + 0.001 , 0.15);
    this.add(tubo);
    this.add(tubo1);
    this.add(tubo2);
    this.add(tubo3);
    this.add(cuerpo);
    this.add(tapa);
  }

  createtubo(){
    var tubo = new THREE.Object3D();

    var shape = new THREE.Shape();
    shape.moveTo(0 , 0);
    shape.lineTo(0.1 , 0);
    shape.lineTo(0.1 , 0.075 );
    shape.bezierCurveTo( 0.11  , 0.12 , 0.05 / 2 , 0.2 , 0 , 0.25);
    //shape.closePath();

    var point = shape.extractPoints (7).shape ;

    const geometria = new THREE.LatheGeometry(point , 32 /* , 0 , Math.PI */);

    const mat = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

    var revolution = new THREE.Mesh(geometria , mat);

    tubo.add(revolution);
    return tubo;
  }
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      segmentos : 10,
      angulo : Math.PI * 2,
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
        this.guiControls.segmentos = 10;
        this.guiControls.angulo = Math.PI * 2;
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
    folder.add (this.guiControls, 'segmentos', 3, 30 , 1).name ('Num Segmentos: ').listen();
    folder.add (this.guiControls, 'angulo', 0, Math.PI * 2 , 0.056 * Math.PI).name ('Angulo: ').listen();


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

  change(numSegments , angu ) {
    this.remove(this.revolution);
    const geometry = new THREE.LatheGeometry(this.point, numSegments, 0, angu); // Crea una nueva revolución con el número de segmentos especificado
    const mat = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

    this.revolution = new THREE.Mesh(geometry, mat);
    this.add(this.revolution); 
  }

  /* changeAngle(angu) {
    this.remove(this.revolution);
    const geometry = new THREE.LatheGeometry(this.point, this.num, 0, angu); // Crea una nueva revolución con el número de segmentos especificado
    const mat = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

    this.revolution = new THREE.Mesh(geometry, mat);
    this.add(this.revolution); 
  } */
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
    /* if(this.guiControls.segmentos !== this.num || this.guiControls.angulo !== this.angle){
      //console.log("hola");
      this.num = this.guiControls.segmentos;
      this.angle = this.guiControls.angulo;
      this.change(this.guiControls.segmentos , this.guiControls.angulo);
    } */

    /* if(this.guiControls.angulo !== this.angle){
      this.angle = this.guiControls.angulo;
      this.changeAngle(this.guiControls.angulo);
    } */
    
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { Nitro };
