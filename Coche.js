import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class Coche extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    this.createGUI(gui,titleGui);
    
    this.variacion = 0.07; //como va a aumentar la x a mas chica mas lento sube
    this.alturaMax = 3;  //la altura maxima a la que llega el coche
    this.xIni = -3.8729833462074; //esto depende de la funcion que se elija => -0.2x² + alturaMaxima
    this.x = this.xIni; //es la x de donde va a salir la Y
    var mat = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });

    this.variacion = 0.05;              //como va a aumentar la x a mas chica mas lento sube
    this.alturaMax = 3;                 //la altura maxima a la que llega el coche
    this.xIni = -3.8729833462074;       //esto depende de la funcion que se elija => -0.2x² + alturaMaxima
    this.x = this.xIni;                 //es la x de donde va a salir la Y

    var mat = new THREE.MeshStandardMaterial({ 
      color: 0xFFFF00,
      metalness: 0.5,      
      roughness: 0.3, 
    });

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

    var techo = new CSG();

    var techoGeom = new THREE.CylinderGeometry(0.5 , 0.71 , 0.4 , 4);
    techoGeom.rotateY(Math.PI/4);
    techoGeom.translate(0 , 0.5 + 0.2 , 0);
    var techoMesh = new THREE.Mesh(techoGeom , mat);

    var techo_restaGeom = new THREE.CylinderGeometry(0.5 , 0.71 , 0.4 , 4);
    techo_restaGeom.scale(0.9 , 0.9 , 0.9);
    techo_restaGeom.rotateY(Math.PI/4);
    techo_restaGeom.translate(-0.1 , 0.5 + 0.2 , 0);
    var techo_resta = new THREE.Mesh(techo_restaGeom , mat);

    var techo_restaGeom1 = new THREE.CylinderGeometry(0.5 , 0.71 , 0.4 , 4);
    techo_restaGeom1.scale(0.9 , 0.9 , 0.9);
    techo_restaGeom1.rotateY(Math.PI/4);
    techo_restaGeom1.translate(0 , 0.5 + 0.2 , -0.1);
    var techo_resta1 = new THREE.Mesh(techo_restaGeom1 , mat);

    var techo_restaGeom2 = new THREE.CylinderGeometry(0.5 , 0.71 , 0.4 , 4);
    techo_restaGeom2.scale(0.9 , 0.9 , 0.9);
    techo_restaGeom2.rotateY(Math.PI/4);
    techo_restaGeom2.translate(0 , 0.5 + 0.2 , 0.1);
    var techo_resta2 = new THREE.Mesh(techo_restaGeom2 , mat);
    techo.subtract([techoMesh , techo_resta , techo_resta1 , techo_resta2]);
    var techoFinal = techo.toMesh();

    var cristalesGeom = new THREE.CylinderGeometry(0.5 , 0.71 , 0.4 , 4);
    cristalesGeom.scale(0.99 , 0.99 , 0.99);
    cristalesGeom.rotateY(Math.PI/4);
    cristalesGeom.translate(0 ,0.7 , 0);
    var cristales = new THREE.Mesh(cristalesGeom , new THREE.MeshStandardMaterial({color: 0x0000FF, transparent: true,opacity: 0.5}));

    var coche = new CSG();
    coche.union([cuerpo, morro_t , morro_d , techoFinal]);

    var huecoMotor = new THREE.BoxGeometry(0.45, 0.4, 0.3);
    huecoMotor.translate(0.75, 0.5, 0);
    var huecoMotorMesh = new THREE.Mesh(huecoMotor, new THREE.MeshNormalMaterial());
    coche.subtract([huecoMotorMesh]);

    var coche_mesh = coche.toMesh();
    //coche_mesh.scale.set(1.5 , 0.75 , 1);
    var resultado = new THREE.Mesh();
    resultado.add(coche_mesh);
    resultado.add(cristales);
    resultado.scale.set(1.5 , 0.75 , 1);

    var ruedaD = this.createRuedas();
    ruedaD.position.set(-0.5 - 0.7 , -0.15 , 0);
    var ruedaT = this.createRuedas();
    ruedaT.position.set(0.5 + 0.7 , -0.15 , 0);
    this.add(ruedaD);
    this.add(ruedaT);
    this.add(resultado);

    var motor = this.createEngine();
    motor.position.set(1.1, 0.5, 0);
    this.add(motor);
  }

  createEngine(){
    var material = new THREE.MeshStandardMaterial({
      color: 0xAAAAAA,  
      metalness: 0.8,      
      roughness: 0.2 
    });

    var materialCil = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });

    var cilPrincipal = new THREE.CylinderGeometry(0.1, 0.1, 0.6);
    cilPrincipal.rotateZ(Math.PI / 2);
    cilPrincipal.scale(1, 2, 1.3);
    var cilPrincipalMesh = new THREE.Mesh(cilPrincipal, material);

    var cilindro1 = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    cilindro1.translate(-0.25, 0, 0.1);
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
    cilindro1.translate(0.1, 0, 0);
    motor.union([cilindro1Mesh]);
    
    var cilindro2 = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    cilindro2.translate(0.25, 0, -0.1);
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
    cilindro2.translate(-0.1, 0, 0);
    motor.union([cilindro2Mesh]);
    
    var base = new THREE.BoxGeometry(0.72, 0.1, 0.3);
    base.translate(0, -0.2, 0);
    var baseMesh = new THREE.Mesh(base, material);
    motor.union([baseMesh]);

    var engine = motor.toMesh();
    return engine;
  }

  createRuedas(){
    var material = new THREE.MeshStandardMaterial({
      color: 0xCFCFCF, // Color base
      metalness: 0.5, // Nivel de metalicidad
    }); 
    var eje = new THREE.Mesh(new THREE.CylinderGeometry(0.05 , 0.05 , 1.7) , material);
    eje.rotateX(Math.PI /2);

    var llantaI = this.createLlanta();
    llantaI.position.y = 0.8;
    llantaI.rotateX(Math.PI / 2);
    eje.add(llantaI);

    var llantaD = this.createLlanta();
    llantaD.position.y = -0.8;
    llantaD.rotateX(Math.PI / 2);
    eje.add(llantaD);

    var neumaticoGeom = new THREE.CylinderGeometry(0.35 , 0.35 , 0.19);
    var neumaticoI = new THREE.Mesh(neumaticoGeom , new THREE.MeshStandardMaterial({color: 0x000000}));
    var neumaticoD = new THREE.Mesh(neumaticoGeom , new THREE.MeshStandardMaterial({color: 0x000000}));
    neumaticoI.position.set(0,0.6 + 0.1,0);
    neumaticoD.position.set(0,-0.6 - 0.1,0);
    eje.add(neumaticoI);
    eje.add(neumaticoD);
    return eje;
  }

  createLlanta(){
    var material = new THREE.MeshStandardMaterial({
      color: 0xCFCFCF, // Color base
      metalness: 0.7, // Nivel de metalicidad
      roughness: 0.2,
    });

    var circunferencia = new THREE.TorusGeometry(0.25, 0.05);
    var circunferenciaMesh = new THREE.Mesh(circunferencia, material);

    var llanta_csg = new CSG();
    llanta_csg.union([circunferenciaMesh]);

    var radio = new THREE.BoxGeometry(0.005, 0.25, 0.02);
    radio.translate(0, 0.15, 0);
    var radioMesh = new THREE.Mesh(radio, material);
    llanta_csg.union([radioMesh]);
    for(var i = 0; i < 9; i++){
      radio.rotateZ(Math.PI / 4);
      llanta_csg.union([radioMesh]);
    }
    var llanta = llanta_csg.toMesh();
    return llanta;
  }

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      animacion : false,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.animacion = false;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);

    folder.add (this.guiControls, 'animacion')
      .name ('Animación : ')
      .onChange ( (value) => this.doSalto(value) );
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }


  change(numSegments , angu ) {
    this.remove(this.revolution);
    const geometry = new THREE.LatheGeometry(this.point, numSegments, 0, angu); // Crea una nueva revolución con el número de segmentos especificado
    const mat = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

    this.revolution = new THREE.Mesh(geometry, mat);
    this.add(this.revolution); 
  }

  doSalto(salto){
    this.hacerSalto = salto;
  }

  //funcion que saca la Y de la parabola -0.2x² + alturaMax
  calcularY(x) {
    var y = -0.2 * x * x + this.alturaMax;
    return y;
  }

  salto(){
    this.position.set(0 , this.calcularY(this.x) , 0); //establece la altura
    this.x += this.variacion;
    if(this.x >= Math.abs(this.xIni)){  //si llega al final de la palabola desactiva la animación
      this.hacerSalto = false;
      this.x = this.xIni;
    }
  }
  
  update () {
    if(this.hacerSalto){
      this.salto();
    }
  }
}

export { Coche };
