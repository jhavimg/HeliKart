
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
import { Coche2 } from './Coche2.js'

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI ();
    this.initStats();
    this.createLights ();
    this.createCamera ();

    // Default to normal camera
    this.currentCamera = 'normal';

    this.circuito = new Circuito(this.gui, "Controles circuito");
    this.add(this.circuito);

    this.coche = new Coche(this.circuito.tubeGeometry, this.gui, "coche");

    this.add(this.coche);

    // Camara subjetiva
    this.createCameraSubjetiva(this.coche);

    this.add(this.coche);
  }
  
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
    // Cámara normal
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);

    this.camera.position.set (0, 2, 75);
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }

  createCameraSubjetiva(coche){
    // Camara subjetiva
    var camaraSubjetiva = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
    coche.setCamaraSubjetiva(camaraSubjetiva);

    camaraSubjetiva.position.set (15, 6, 0);

    var puntoDeMiraRelativo = new THREE.Vector3 (0, -10, 30);

    this.target = new THREE.Vector3();
    camaraSubjetiva.getWorldPosition (this.target);
    this.target.add (puntoDeMiraRelativo);

    camaraSubjetiva.lookAt (this.target);

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

  toggleCamera() {
    this.currentCamera = this.currentCamera === 'normal' ? 'subjetiva' : 'normal';
  }
  
  getCamera() {
    if (this.currentCamera === 'subjetiva') {
      return this.coche.getCamaraSubjetiva();
    } else {
      return this.camera;
    }
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    
    if (this.stats) this.stats.update();
    this.cameraControl.update();

  
    this.coche.update();

    this.renderer.render (this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  
  var scene = new MyScene("#WebGL-output");

  window.addEventListener ("resize", () => scene.onWindowResize());

  window.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      scene.toggleCamera();
    }else if(event.key === 'w' || event.key === 'W' ){
      scene.coche.doSalto(true);
    }else if(event.key === 'w' || event.key === 'W' ){
      scene.coche.doSalto(true);
    }
  });

  window.addEventListener("click", (event)  => {
    if(event.button === 0) {
        console.log("se le ha dado al boton izquierdo");
    }
});
  
  scene.update();
});