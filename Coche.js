import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

import { helice } from './helice.js';
 
class Coche extends THREE.Object3D {
  constructor(tubeGeo , gui,titleGui) {
    super();
    
    this.createGUI(gui,titleGui);
    
    this.relojElice = new THREE. Clock ( ) ;
    this.velocidadElice = 3 * Math.PI ;
    this.relojMovimientoCoche = new THREE.Clock();
    this.t = 0;
    this.puntos = 0;
    //this.relojGiro = new THREE.Clock();

    //velocidad de movimiento de las animaciones///////////
    this.velocidadSalto = 1.5 ;
    this.velocidadBrazo = 1;
    this.velocidadCalandra = -10;
    this.velocidadCoche = 0.025;
    this.tiempoEspera = 0;
    this.tiempoEsperaMaximo = 2;
    this.velocidadGiro = Math.PI ;
    //////////////////////////////////////////////////////

    //Prueba de choques//////////////////////////////////////////////////
    /* this.avanza = 0.1;
    this.posIni = -2.5;
    this.cochedetinido = false;
    this.mantenerArriba = false; */
    //////////////////////////////////////////////////////////////////////


    //Variables animación salto///////////////////////////////////////////////////////////////////////////////
    this.tituloGui = titleGui
    this.variacion = 0.07; //como va a aumentar la x a mas chica mas lento sube
    this.alturaMax = 3;  //la altura maxima a la que llega el coche
    this.xIni = -3.8729833462074; //esto depende de la funcion que se elija => -0.2x² + alturaMaxima
    this.x = this.xIni; //es la x de donde va a salir la Y
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    var chasis = this.createChasis();

    var ruedaD = this.createRuedas();
    ruedaD.position.set(-0.5 - 0.7 , -0.15 , 0);
    var ruedaT = this.createRuedas();
    ruedaT.position.set(0.5 + 0.7 , -0.15 , 0);

    var motor = this.createEngine();
    motor.position.set(1.1, 0.5, 0);

    var brazo = this.createBrazo();
    brazo.position.set(1.1, 0.7, 0);

    //Calandra y varible para su movimiento/////////
    this.angleC = 0;
    //this.variacion_angleCIni = -0.08;
    this.calandra = this.createCalandra();
    this.calandra.scale.set(1, 0.65, 0.65);
    this.calandra.rotateZ(this.angleC);
    this.calandra.position.set(-1.5, 0.26, 0);
    /////////////////////////////////////////////////////

    this.nodoRaizCoche = new THREE.Object3D();
    this.nodoRaizCoche.add(chasis);
    this.nodoRaizCoche.add(ruedaD);
    this.nodoRaizCoche.add(ruedaT);
    this.nodoRaizCoche.add(motor);
    this.nodoRaizCoche.add(this.calandra);
    this.nodoRaizCoche.add(brazo);

    this.nodoRaizCoche.rotateY(Math.PI/2);
    
    this.nodoRaizCoche.scale.set(0.25, 0.25, 0.25); //Escalado del coche para ponerlo en el circuito
    this.coche = new THREE.Object3D();
    
    this.add(this.nodoRaizCoche);
    
    // Posicionamiento de coche en tubo
    this.tubo = tubeGeo;
    this.path = tubeGeo.parameters.path; 
    this.radio = tubeGeo.parameters.radius;
    this.segmentos = tubeGeo.parameters.tubularSegments;

    //Nodo rotacion
    this.nodoRotacion = new THREE.Object3D();
    this.nodoRotacion.add(this.nodoRaizCoche);

    // Inicialización de nodoPosOrientTubo
    this.nodoPosOrientTubo = new THREE.Object3D();
    this.nodoPosOrientTubo.add(this.nodoRotacion);
    this.nodoRaizCoche.position.y = this.radio + 0.15;
    this.add(this.nodoPosOrientTubo);

    // Balas
    this.balas = [];
    this.nodoRaizCoche.add(this.balas);

    // Hitbox
    this.cajaFigura = new THREE.Box3();
    this.cajaFigura.setFromObject ( this.nodoRaizCoche ) ;
    this.cajaVisible = new THREE.Box3Helper( this.cajaFigura , 0xCF00 ) ;
    this.add ( this.cajaVisible ) ;
  }

  shoot(zepelin){
    // Disparo al zepelin
    const materialBala = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    var geometriaBala = new THREE.SphereGeometry(0.1);
    const bala = new THREE.Mesh(geometriaBala, materialBala);
    bala.position.copy(this.nodoRaizCoche.position);

    var velocidadBala = 1;
    var direccion = new THREE.Vector3();
    direccion.subVectors(zepelin.userData.position, bala.position).normalize();
    bala.velocity = direccion.multiplyScalar(velocidadBala);

    this.balas.push(bala);
    this.add(bala);
  }

  setCamaraSubjetiva(camara){
    this.camara = camara;
    this.nodoRaizCoche.add(camara);
  }

  getCamaraSubjetiva(){
    return this.camara;
  }

  createChasis(){
    var mat = new THREE.MeshStandardMaterial({ 
      color: 0xFFFF00,
      metalness: 0.5,      
      roughness: 0.3, 
    });

    var cuerpoGeom = new THREE.BoxGeometry(1 , 1 , 1 );
    var cuerpo = new THREE.Mesh( cuerpoGeom, mat);

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
    cristales.scale.set(1.5 , 0.75 , 1)

    var coche_csg = new CSG();
    coche_csg.union([cuerpo, morro_t , morro_d , techoFinal]);

    var huecoMotor = new THREE.BoxGeometry(0.45, 0.4, 0.3);
    huecoMotor.translate(0.75, 0.5, 0);
    var huecoMotorMesh = new THREE.Mesh(huecoMotor, new THREE.MeshNormalMaterial());
    coche_csg.subtract([huecoMotorMesh]);

    var coche_mesh = coche_csg.toMesh();
    coche_mesh.scale.set(1.5 , 0.75 , 1);
    var chasis = new THREE.Mesh();
    chasis.add(coche_mesh);
    chasis.add(cristales);

    return chasis;
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

  createHelice(){
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
    //shape.lineTo(-0.4 , 0.4);
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
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      animacion : false,
      animacion2 : false,
      animacion3 : false,
      
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
    folder.add (this.guiControls, 'animacion2')
      .name ('Animación2 : ')
      .onChange ( (value) => this.subirBrazo(value) );
    folder.add (this.guiControls, 'animacion3')
      .name ('Animación3 : ')
      .onChange ( (value) => this.disparar(value) );

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }

  doSalto(salto){
    this.relojSalto = new THREE.Clock();
    this.hacerSalto = salto;
    this.relojBrazo = new THREE.Clock();
    this.subir = salto;
  }

  subirBrazo(subir){
    this.relojBrazo = new THREE.Clock();
    this.subir = subir;
  }

  disparar(disparo){
    this.relojCalandra = new THREE.Clock();
    this.abrir = disparo;
  }

  //funcion que saca la Y de la parabola -0.2x² + alturaMax
  calcularY(x) {
    var y = -0.2 * x * x + this.alturaMax;
    return y;
  }

  salto(){
    this.hacerSalto = false;
    // Definimos la altura final y el tiempo de animación
    var alturaInicial = this.nodoRaizCoche.position.y;
    var alturaFinal = this.nodoRaizCoche.position.y + 3;
    var duracionAnimacion = 3000;

    // Animacion subir arriba del salto
    var tweenSaltoArriba = new TWEEN.Tween(this.nodoRaizCoche.position)
      .to({ y: alturaFinal }, duracionAnimacion)
      .easing(TWEEN.Easing.Quadratic.InOut);
    
    // Animación volver a abajo
    var tweenSaltAbajo = new TWEEN.Tween(this.nodoRaizCoche.position)
      .to({ y: alturaInicial}, duracionAnimacion)
      .easing(TWEEN.Easing.Quadratic.InOut);

    tweenSaltoArriba.chain(tweenSaltAbajo);
    tweenSaltoArriba.start();
  }

  volar(){
    var segundosTranscurridos = this.relojBrazo.getDelta ( ); 
    var variacion = this.velocidadBrazo * segundosTranscurridos ;

    if (this.angle >= Math.PI / 2 && !this.mantenerArriba) {
      this.tiempoEspera = this.tiempoEsperaMaximo;
      this.mantenerArriba = true;
    }
  
    if (this.tiempoEspera > 0) {
      this.tiempoEspera -= segundosTranscurridos;
      this.variacion_angle = 0;
    }else{
      if(this.angle <= 0){
        this.variacion_angle = variacion;
      }else if(this.angle >= Math.PI /2){
        this.variacion_angle -= variacion;
      }
    }

    this.angle += this.variacion_angle;
    this.brazo_movil.rotation.z = this.angle;

    if(this.angle < 0){
      this.subir = false;
      this.brazo_movil.rotation.z = 0;
      this.angle = 0;
      this.mantenerArriba = false;
    }
  }

  hacerDisparo(zepelin){
    // Define el ángulo final y el tiempo de animación
    var anguloFinal = -Math.PI / 1.1;
    var duracionAnimacion = 1000; // duración de la animación en milisegundos

    // Animación de apertura de la calandra
    var tweenAbrir = new TWEEN.Tween(this.calandra.rotation)
        .to({ z: anguloFinal }, duracionAnimacion)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(() => {
            this.shoot(zepelin);  // Dispara cuando la animación se completa
        });

    // Animación de cierre de la calandra
    var tweenCerrar = new TWEEN.Tween(this.calandra.rotation)
        .to({ z: 0 }, duracionAnimacion)
        .easing(TWEEN.Easing.Quadratic.In)
        .onComplete(() => {
        });

    // Encadena las animaciones para que una comience después de que la otra termine
    tweenAbrir.chain(tweenCerrar);
    tweenAbrir.start();
  }

  hacerGiro(direccion){
    //this.relojGiro = new THREE.Clock();
    //this.relojMovimientoCoche.getDelta();
    this.girol = true;
    this.giro(direccion);
  }

  deternerCoche(){
    this.avanza = 0;
    this.cochedetinido = true;
    this.posIni = 0;
  }

  giro(direccion){
    var segundosTranscurridos = this.relojMovimientoCoche.getDelta ( ); 
    var esp_ang = this.velocidadGiro * segundosTranscurridos ;
    console.log(esp_ang);
    if(direccion == 'izquierda'){
      this.nodoRotacion.rotateZ(-esp_ang);
    }else if(direccion == 'derecha'){
      this.nodoRotacion.rotateZ(esp_ang);
    }
  }
  
  update () {
    if(this.hacerSalto){
      this.salto();
    }
    if(this.subir){
      this.volar();
    }

    if(this.cochedetinido){
      this.nodoRaizCoche.position.set(-1 , 0 , 0);

    }

    // Movimiento hélices
    var segundosTranscurridos = this.relojElice.getDelta ( ); 
    var esp_ang = this.velocidadElice * segundosTranscurridos ;
    this.elice.rotateX(esp_ang);

    // Animación para movimiento por el tubo
    this.t += this.relojMovimientoCoche.getDelta() * this.velocidadCoche;
    this.ti = this.t % 1;
    //this.ti = 0.09;
    var posTmp = this.path.getPointAt(this.ti);
    this.nodoPosOrientTubo.position.copy (posTmp);
    var tangente = this.path.getTangentAt(this.ti);
    posTmp.add (tangente);
    var segmentoActual = Math.floor(this.ti * this.segmentos);

    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt (posTmp);

    // Hitbox
    this.cajaFigura.setFromObject ( this.nodoRaizCoche ) ;
    this.cajaVisible = new THREE.Box3Helper( this.cajaFigura , 0xCF00 ) ;
  }

  getCaja(){
    return this.cajaFigura;
  }

  getTi(){
    return this.ti;
  }

  addPuntos(puntos){
    this.puntos += puntos;
  }

  getPuntos(){
    return this.puntos;
  }

  vueltaCompletada(){
    this.velocidadCoche += this.velocidadCoche * 0.1;
    console.log(this.velocidadCoche);
  }

  getVelocidad(){
    return this.velocidadCoche;
  }


}

export { Coche };