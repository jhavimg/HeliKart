import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

import { helice } from './helice.js';
 
class Coche2 extends THREE.Object3D {
  constructor(tubeGeo, gui,titleGui) {
    super();
    this.createGUI(gui,titleGui);

    // Variables para animaciones
    this.reloj = new THREE. Clock ( ) ;
    this.relojMovimientoCoche = new THREE.Clock();
    this.velocidadCoche = 0.05;
    this.t = 0;

    this.velocidadElice = Math.PI ;
    this.tituloGui = titleGui
    this.variacion = 0.07; //como va a aumentar la x a mas chica mas lento sube
    this.alturaMax = 3;  //la altura maxima a la que llega el coche
    this.xIni = -3.8729833462074; //esto depende de la funcion que se elija => -0.2x² + alturaMaxima
    this.x = this.xIni; //es la x de donde va a salir la Y
    var mat = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });

    this.variacion = 0.05;              //como va a aumentar la x a mas chica mas lento sube
    this.alturaMax = 3;                 //la altura maxima a la que llega el coche
    this.xIni = -3.8729833462074;       //esto depende de la funcion que se elija => -0.2x² + alturaMaxima
    this.x = this.xIni; 

    // Nodo raiz del coche
    this.nodoRaizCoche = new THREE.Object3D();
    
    // Ejes para modelado del coche
    var ejes = new THREE.AxesHelper(3);
    this.add(ejes);

    // Insertamos estructura base del coche
    var estructuraBase = this.createEstructuraBase();
    
    // Insertamos coche
    var techo = this.createTecho();

    // Modelado de cristales
    var cristalesGeo = new THREE.CylinderGeometry(0.5 , 0.71 , 0.4 , 4);
    cristalesGeo.rotateY(Math.PI/4);
    cristalesGeo.translate(0 ,0.7 , 0);
    cristalesGeo.scale(1.485 , 0.99 , 0.99);
    var cristales = new THREE.Mesh(cristalesGeo , new THREE.MeshStandardMaterial({color: 0x0000FF, transparent: true,opacity: 0.5}));

    // Insertar motor en coche
    var motor = this.createEngine();
    motor.position.set(1.2, 0.5, 0);

    // Insertar ruedas al coche
    var ruedaD = this.createRuedas();
    ruedaD.position.set(-0.5 - 0.7 , -0.25 , 0);
    var ruedaT = this.createRuedas();
    ruedaT.position.set(0.5 + 0.7 , -0.25 , 0);

    // Insertar brazo al coche
    var brazo = this.createBrazo();
    brazo.position.set(1.4, 1, 0);

    // Insertar calandra
    this.angleC = 0;
    this.variacion_angleCIni = -0.08;
    this.calandra = this.createCalandra();
    this.calandra.scale.set(1, 0.85, 0.65);
    this.calandra.rotateZ(this.angleC);
    this.calandra.position.set(-1.75, 0.35, 0);

    // Añadir elementos del coche al nodo raiz
    this.nodoRaizCoche.add(estructuraBase);
    this.nodoRaizCoche.add(techo);
    this.nodoRaizCoche.add(cristales);
    this.nodoRaizCoche.add(motor);
    this.nodoRaizCoche.add(ruedaD);
    this.nodoRaizCoche.add(ruedaT);
    this.nodoRaizCoche.add(brazo);
    this.nodoRaizCoche.add(this.calandra);

    this.nodoRaizCoche.rotateY(Math.PI / 2);
    this.nodoRaizCoche.scale.set(0.25, 0.25, 0.25);

    this.add(this.nodoRaizCoche);

    // Posicionamiento de coche en tubo
    this.tubo = tubeGeo;
    this.path = tubeGeo.parameters.path; 
    this.radio = tubeGeo.parameters.radius;
    this.segmentos = tubeGeo.parameters.tubularSegments;

    // Inicialización de nodoPosOrientTubo
    this.nodoPosOrientTubo = new THREE.Object3D();
    this.nodoPosOrientTubo.add(this.nodoRaizCoche);
    this.nodoRaizCoche.position.y = this.radio + 0.5;
    this.add(this.nodoPosOrientTubo);
  }

  setCamaraSubjetiva(camara){
    this.camara = camara;
    this.nodoRaizCoche.add(camara);
  }

  getCamaraSubjetiva(){
    return this.camara;
  }

  // Funcion que modela estructura base del coche
  createEstructuraBase(){
    var mat = new THREE.MeshStandardMaterial({ 
        color: 0xFFFF00,
        metalness: 0.5,      
        roughness: 0.3, 
    });

    var cuerpoGeo = new THREE.BoxGeometry(1.5 , 1 , 1);
    var cuerpoMesh = new THREE.Mesh (cuerpoGeo, mat);

    var morroGeo_d = new THREE.CylinderGeometry(0.5 , 0.71 , 1 , 4);
    morroGeo_d.rotateZ(Math.PI / 2);
    morroGeo_d.rotateX(  Math.PI /4);
    morroGeo_d.translate(-0.5 + -0.75, 0 , 0);
    var morro_dMesh = new THREE.Mesh(morroGeo_d, mat);

    var morroGeo_t = new THREE.CylinderGeometry(0.5 , 0.71 , 1 , 4);
    morroGeo_t.rotateZ( - Math.PI / 2);
    morroGeo_t.rotateX( Math.PI /4);
    morroGeo_t.translate(0.5 + 0.75 , 0 , 0);
    var morro_tMesh = new THREE.Mesh(morroGeo_t, mat);

    // Unimos con csg los elementos que forma el cuerpo del coche
    var estructura_base = new CSG();
    estructura_base.union([cuerpoMesh, morro_dMesh, morro_tMesh]);

    // Hacemos el hueco para el motor
    var huecoMotor = new THREE.BoxGeometry(1, 0.4, 0.4);
    huecoMotor.translate(1.2, 0.5, 0);
    var huecoMotorMesh = new THREE.Mesh(huecoMotor, new THREE.MeshNormalMaterial());
    estructura_base.subtract([huecoMotorMesh]);

    var estructura_baseMesh = estructura_base.toMesh();
    return estructura_baseMesh;
  }

  // Funcion que modela techo del coche
  createTecho(){
    var mat = new THREE.MeshStandardMaterial({ 
        color: 0xFFFF00,
        metalness: 0.5,      
        roughness: 0.3, 
    });

    var techo = new CSG();

    var techoGeo = new THREE.CylinderGeometry(0.5 , 0.71 , 0.4 , 4);
    techoGeo.rotateY(Math.PI/4);
    techoGeo.translate(0 , 0.5 + 0.2 , 0);
    techoGeo.scale(1.5, 1, 1);
    var techoMesh = new THREE.Mesh(techoGeo , mat);

    var techo_restaGeo = new THREE.CylinderGeometry(0.5 , 0.71 , 0.4 , 4);
    techo_restaGeo.rotateY(Math.PI/4);
    techo_restaGeo.scale(1.35, 0.9, 0.9);
    techo_restaGeo.translate(-0.1 , 0.5 + 0.2 , 0);
    var techo_resta1 = new THREE.Mesh(techo_restaGeo , mat);

    var techo_restaGeo2 = new THREE.CylinderGeometry(0.5 , 0.71 , 0.4 , 4);
    techo_restaGeo2.rotateY(Math.PI/4);
    techo_restaGeo2.scale(1.3 , 0.9 , 2);
    techo_restaGeo2.translate(0 , 0.5 + 0.2, 0);
    var techo_resta2 = new THREE.Mesh(techo_restaGeo2 , mat);

    techo.subtract([techoMesh ,techo_resta1, techo_resta2]);
    var techoFinal = techo.toMesh();
    return techoFinal;
  }

  // Función que modela el motor
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
    
    var base = new THREE.BoxGeometry(1, 0.1, 0.4);
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

  createBrazo(){
    var brazo = new THREE.Mesh(new THREE.BoxGeometry(0.1 , 0.7 , 0.1) , new THREE.MeshStandardMaterial({ color: 0x000000 }));
    var brazo_movilGeom = new THREE.CylinderGeometry(0.05 , 0.05 , 0.6);
    brazo_movilGeom.rotateZ(Math.PI / 2);
    brazo_movilGeom.translate(0.25, 0, 0);
    this.brazo_movil = new THREE.Mesh(brazo_movilGeom , new THREE.MeshStandardMaterial({ color: 0x000000 }));

    this.angle = 0;                                 //angulo
    this.variacion_angleIni = 0.02;                 //variacion del angulo
    this.brazo_movil.position.set(0, 0.35, 0);
    this.brazo_movil.rotation.z =this.angle;
    
    
    this.elice = this.createHelice(this.tituloGui);
    this.elice.position.set(0.575, 0, 0);
    
    this.brazo_movil.add(this.elice);

    brazo.add(this.brazo_movil);
    return brazo;

  }

  createHelice(titulo){
    var elice1 = new helice(this.gui , this.tituloGui);

    var baseGeom =new THREE.CylinderGeometry(0.05 , 0.05 , 0.05);
    baseGeom.rotateZ(Math.PI / 2);
    var base = new THREE.Mesh( baseGeom, new  THREE.MeshStandardMaterial({ color: 0x3F3F3F }));

    var elice1 = new helice(this.gui , this.tituloGui);
    elice1.position.set(0, 0.05, 0);
    base.add(elice1);

    var elice2 = new helice(this.gui , this.tituloGui);
    elice2.rotateX( Math.PI / 2),
    elice2.position.set(0, 0, 0.05);
    base.add(elice2);

    var elice3 = new helice(this.gui , this.tituloGui);
    elice3.rotateX( Math.PI),
    elice3.position.set(0, -0.05, 0);
    base.add(elice3);

    var elice4 = new helice(this.gui , this.tituloGui);
    elice4.rotateX( 3 * Math.PI / 2),
    elice4.position.set(0, 0, -0.05);
    base.add(elice4);

    return base;
  }

  createCalandra(){
    var shape = new THREE.Shape( );
    shape.moveTo(-0.4 , 0.4);
    shape.lineTo(0.4 , 0.4);
    shape.lineTo(0.5 , -0.4);
    shape.lineTo(-0.5 , -0.4);
    shape.lineTo(-0.4 , 0.4);
    shape.closePath();

    var hole = new THREE.Shape( );
    hole.moveTo(-0.3 , 0.3);
    hole.lineTo(-0.25,0.3);
    hole.lineTo(-0.25,-0.3);
    hole.lineTo(-0.3,-0.3);
    hole.closePath();
    shape.holes.push(hole);

    var hole2 = new THREE.Shape();
    hole2.moveTo(-0.19, 0.3);
    hole2.lineTo(-0.14, 0.3);
    hole2.lineTo(-0.14, -0.3);
    hole2.lineTo(-0.19, -0.3);
    hole2.closePath();
    shape.holes.push(hole2);

    // Forma 3
    var hole3 = new THREE.Shape();
    hole3.moveTo(-0.08, 0.3);
    hole3.lineTo(-0.03, 0.3);
    hole3.lineTo(-0.03, -0.3);
    hole3.lineTo(-0.08, -0.3);
    hole3.closePath();
    shape.holes.push(hole3);

    // Forma 4
    var hole4 = new THREE.Shape();
    hole4.moveTo(0.03, 0.3);
    hole4.lineTo(0.08, 0.3);
    hole4.lineTo(0.08, -0.3);
    hole4.lineTo(0.03, -0.3);
    hole4.closePath();
    shape.holes.push(hole4);

    // Forma 5
    var hole5 = new THREE.Shape();
    hole5.moveTo(0.14, 0.3);
    hole5.lineTo(0.19, 0.3);
    hole5.lineTo(0.19, -0.3);
    hole5.lineTo(0.14, -0.3);
    hole5.closePath();
    shape.holes.push(hole5);

    var hole6 = new THREE.Shape();
    hole6.moveTo(0.25, 0.3);
    hole6.lineTo(0.3, 0.3);
    hole6.lineTo(0.3, -0.3);
    hole6.lineTo(0.25, -0.3);
    hole6.closePath();
    shape.holes.push(hole6);
    
    var material = new THREE.MeshStandardMaterial({
      color: 0xAAAAAA,  
      metalness: 0.8,      
      roughness: 0.2 
    });
    var options1 = { depth : 0.025 , steps : 1 , bevelEnabled : false } ;
    var geometry1 = new THREE. ExtrudeGeometry ( shape , options1 ) ;
    geometry1.translate(0 , -0.4 , 0);
    geometry1.rotateY(-Math.PI / 2);
    var cuerpo = new THREE.Mesh(geometry1, material);
    return cuerpo;
  }

  createGUI (gui,titleGui) {
    this.guiControls = {
      animacion : false,
      animacion2 : false,
      animacion3 : false,
      
      reset : () => {
        this.guiControls.animacion = false;
      }
    } 
    
    var folder = gui.addFolder (titleGui);

    folder.add (this.guiControls, 'animacion')
      .name ('Animación : ')
      .onChange ( (value) => this.doSalto(value) );
    folder.add (this.guiControls, 'animacion2')
      .name ('Animación2 : ')
      .onChange ( (value) => this.subirBrazo(value) );
    folder.add (this.guiControls, 'animacion3')
      .name ('Animación3 : ')
      .onChange ( (value) => this.disparar(value) );

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }

  doSalto(salto){
    this.hacerSalto = salto;
  }

  subirBrazo(subir){
    this.subir = subir;
  }

  disparar(disparo){
    this.abrir = disparo;
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

  volar(){
    //console.log(this.angle);

    if(this.angle <= 0){
      this.variacion_angle = this.variacion_angleIni;
    }else if(this.angle >= Math.PI /2){
      this.variacion_angle -= this.variacion_angleIni;
    }

    this.angle += this.variacion_angle;
    //console.log(this.angle);
    this.brazo_movil.rotation.z = this.angle;
  }

  hacerDisparo(){
    if(this.angleC >= 0){
      this.variacion_angleC = this.variacion_angleCIni;
    }else if(this.angleC <= -Math.PI /1.1){
      this.variacion_angleC = -this.variacion_angleCIni;
    }

    this.angleC += this.variacion_angleC;
    //console.log(this.variacion_angleC);
    this.calandra.rotation.z = this.angleC;

    if(this.angleC >= 0){
      this.abrir = false;
    }
  }
  
  update () {
    // Salto del coche
    if(this.hacerSalto){
        this.salto();
      }
      // Cambiar de posicion helice
      if(this.subir){
        this.volar();
      }
      // Hacer disparo con calandra
      if(this.abrir){
        this.hacerDisparo();
      }
      
    this.velocidad = Math.PI / 40;

    var segundosTranscurridos = this.reloj.getDelta ( ); 
    var esp_ang = this.velocidadElice * segundosTranscurridos ;
    this.elice.rotateX(esp_ang);

    // Animación para movimiento por el tubo
    // Posicionamiento en tubo
    this.t += this.relojMovimientoCoche.getDelta() * this.velocidadCoche;
    this.t = this.t % 1;

    var posTmp = this.path.getPointAt(this.t);
    this.nodoPosOrientTubo.position.copy (posTmp);
    var tangente = this.path.getTangentAt(this.t);
    posTmp.add (tangente);
    var segmentoActual = Math.floor(this.t * this.segmentos);

    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt (posTmp);
  }
}

export { Coche2 };
