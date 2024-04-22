
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import * as TWEEN from '../libs/tween.esm.js'

// Clases de mi proyecto

import { Boost } from './Boost.js'
import { PowerUp } from './PowerUp.js'
import { Coche } from './Coche.js'
import { Zepelin } from './Zepelin.js'
import { Valla } from './Valla.js'
import { Circuito } from './Circuito.js'
import { Tronco } from './Tronco.js'
import { Cubo } from './Cubo.js'

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI ();
    this.initStats();
    this.createLights ();
    this.createCamera ();
    
    this.circuito = new Circuito(this.gui, "");
    this.add(this.circuito);

    this.coche = new Cubo(this.circuito.tubeGeometry, this.gui, "Controles coche");
    this.add(this.coche);

    this.clock = new THREE.Clock();
    this.t = 0;
  }

  // updateCarPosition(){
  //   this.segmentos = 100;
  //   this.binormales = this.circuito.curve.computeFrenetFrames (this.segmentos, true).binormals;

  //   var origen = {t: 0};
  //   var fin = {t: 1};
  //   var tiempoDeRecorrido = 40000;

  //   var animacion = new TWEEN.Tween (origen).to (fin, tiempoDeRecorrido)
  //     .onUpdate (() => {
  //       var posicion = this.circuito.curve.getPointAt (origen.t);
  //       var tangente = this.circuito.curve.getTangentAt (origen.t);
  //       var binormales = this.binormales[Math.floor(origen.t * this.segmentos)];

  //       var offset = binormales.clone().multiplyScalar(0.5);
  //       posicion.add(offset);

  //       this.coche.position.copy (posicion);

  //       var normal = this.circuito.curve.getNormal(origen.t);
  //       this.coche.up.copy(binormales);
  //       this.coche.lookAt(posicion.clone().add(tangente));
  //     })
  //     .repeat(Infinity)
  //     .start();
  // }
  
  initStats() {
  
    var stats = new Stats();
    
    stats.setMode(0); // 0: fps, 1: ms
    
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;
  }
  
  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);

    
    this.camera.position.set (0, 2, 10);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }
  
  createGround () {
    var geometryGround = new THREE.BoxGeometry (10,0.2,10);
    
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshStandardMaterial ({map: texture});
    
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    ground.position.y = -0.1;
    
    this.add (ground);
  }
  
  createGUI () {
    var gui = new GUI();
    
    this.guiControls = {
      lightPower : 500.0, 
      ambientIntensity : 0.5,   
      axisOnOff : true
    }

    var folder = gui.addFolder ('Luz y Ejes');
    
    folder.add (this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange ( (value) => this.setLightPower(value) );
    
    folder.add (this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange ( (value) => this.setAmbientIntensity(value) );
      
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }
  
  createLights () {
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add (this.ambientLight);
    
    this.pointLight = new THREE.PointLight( 0xffffff );
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set( -1, 3, 1 );
    this.add (this.pointLight);
  }
  
  setLightPower (valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    
    var renderer = new THREE.WebGLRenderer();
    
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  initKeyHandlers() {
    this.movingForward = false;

    window.addEventListener('keydown', (event) => {
      if (event.key === 'w' || event.key === 'W') {
        this.movingForward = true;
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.key === 'w' || event.key === 'W') {
        this.movingForward = false;
      }
    });
  }

  update () {
    
    if (this.stats) this.stats.update();
    this.cameraControl.update();

    this.circuito.update();
    this.coche.update();
    // TWEEN.update();
    
    // if (this.movingForward) {
    //   this.coche.mesh.position.z -= 0.1;
    // }

    this.renderer.render (this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  
  var scene = new MyScene("#WebGL-output");

  window.addEventListener ("resize", () => scene.onWindowResize());
  
  scene.update();
});
