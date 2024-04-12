import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class Coche extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    this.createGUI(gui,titleGui);
    
    var mat = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });

    var cuerpo = new THREE.Mesh(new THREE.BoxGeometry(1 , 1 , 1 ) , mat);
    var morroGeom_d = new THREE.CylinderGeometry(0.5 , 0.71 , 0.5 , 4);
    morroGeom_d.rotateZ(Math.PI / 2);
    morroGeom_d.rotateX(  Math.PI /4);
    morroGeom_d.translate(-0.5 - 0.249 , 0 , 0);
    var morro_d = new THREE.Mesh(morroGeom_d);
    
    var morroGeom_t = new THREE.CylinderGeometry(0.5 , 0.71 , 0.5 , 4);
    morroGeom_t.rotateZ( - Math.PI / 2);
    morroGeom_t.rotateX( Math.PI /4);
    morroGeom_t.translate(0.5 + 0.249 , 0 , 0);
    var morro_t = new THREE.Mesh(morroGeom_t);

    var coche = new CSG();
    coche.union([cuerpo, morro_t , morro_d]);
    var coche_mesh = coche.toMesh();
    coche_mesh.scale.set(1.5 , 0.75 , 1);

    var ruedaD = this.createRuedas();
    ruedaD.position.set(-0.5 - 0.7 , -0.15 , 0);
    var ruedaT = this.createRuedas();
    ruedaT.position.set(0.5 + 0.7 , -0.15 , 0);
    this.add(ruedaD);
    this.add(ruedaT);
    this.add(coche_mesh);

    var motor = this.createEngine();
    motor.position.set(1, 0.5, 0);
    this.add(motor);
  }

  createEngine(){
    var material = new THREE.MeshStandardMaterial({
      color: 0xAAAAAA,  
      metalness: 0.8,      
      roughness: 0.2 
    });

    var materialCil = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });

    // var materialCil = new THREE.MeshBasicMaterial({
    //   color: 0xaaaaaa, 
    //   metalness: 0.8,    
    //   roughness: 0.3 
    // });

    var cilPrincipal = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
    cilPrincipal.rotateZ(Math.PI / 2);
    cilPrincipal.scale(1, 2, 1);
    var cilPrincipalMesh = new THREE.Mesh(cilPrincipal, material);

    var cilindro1 = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    cilindro1.translate(-0.2, 0, 0.1);
    cilindro1.rotateX(Math.PI / 5);
    var cilindro1Mesh = new THREE.Mesh(cilindro1, materialCil);

    var motor = new CSG();
    motor.union([cilPrincipalMesh, cilindro1Mesh]);
    cilindro1.translate(0.1, 0, 0);
    motor.union([cilindro1Mesh]);
    cilindro1.translate(0.1, 0, 0);
    motor.union([cilindro1Mesh]);
    cilindro1.translate(0.1, 0, 0);
    motor.union([cilindro1Mesh]);
    cilindro1.translate(0.1, 0, 0);
    motor.union([cilindro1Mesh]);
    
    var cilindro2 = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    cilindro2.translate(0.2, 0, -0.1);
    cilindro2.rotateX(-Math.PI / 5);
    var cilindro2Mesh = new THREE.Mesh(cilindro2, materialCil);

    motor.union([cilindro2Mesh]);
    cilindro2.translate(-0.1, 0, 0);
    motor.union([cilindro2Mesh]);
    cilindro2.translate(-0.1, 0, 0);
    motor.union([cilindro2Mesh]);
    cilindro2.translate(-0.1, 0, 0);
    motor.union([cilindro2Mesh]);
    cilindro2.translate(-0.1, 0, 0);
    motor.union([cilindro2Mesh]);

    var engine = motor.toMesh();
    return engine;
  }

  createRuedas(){
    var material = new THREE.MeshStandardMaterial({
      color: 0xCFCFCF, // Color base
      metalness: 0.5, // Nivel de metalicidad
    }); 
    var eje = new THREE.Mesh(new THREE.CylinderGeometry(0.05 , 0.05 , 1.2) , material);
    eje.rotateX(Math.PI /2);

    var llantaI = new THREE.Mesh(new THREE.CylinderGeometry(0.2 , 0.2 , 0.2) , material);
    llantaI.position.y = 0.6 + 0.1;
    eje.add(llantaI);
    var llantaD = new THREE.Mesh(new THREE.CylinderGeometry(0.2 , 0.2 , 0.2) , material);
    llantaD.position.y = -0.6 - 0.1;
    eje.add(llantaD);

    var neumaticoGeom = new THREE.CylinderGeometry(0.35 , 0.35 , 0.19)
    var neumaticoI = new THREE.Mesh(neumaticoGeom , new THREE.MeshStandardMaterial({color: 0x000000}));
    var neumaticoD = new THREE.Mesh(neumaticoGeom , new THREE.MeshStandardMaterial({color: 0x000000}));
    neumaticoI.position.set(0,0.6 + 0.1,0);
    neumaticoD.position.set(0,-0.6 - 0.1,0);
    eje.add(neumaticoI);
    eje.add(neumaticoD);
    return eje;
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

export { Coche };
