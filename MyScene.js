
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
  constructor(myCanvas) {
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.initStats();
    this.createLights();
    this.createCamera();

    // Default to normal camera
    this.currentCamera = 'normal';

    //Se crea el circuito
    this.circuito = new Circuito(this.gui, "Controles circuito");
    this.add(this.circuito);

    //Se crea el personaje
    this.coche = new Coche(this.circuito.tubeGeometry, this.gui, "coche");
    this.add(this.coche);

    // Camara subjetiva
    this.createCameraSubjetiva(this.coche);

    // Añadir objetos al circuito
    this.createObjetos();
    for (var i = 0; i < this.vectorCircuito.length; i++) {
      var vector = this.vectorCircuito[i];
      for (var j = 0; j < vector.length; j++) {
        this.add(vector[j]);
      }
    }

    // Añadir zepelin al circuito
    this.pickableObjets = [];
    this.pickableObjets.push(
      new Zepelin(this.circuito.tubeGeometry, 0.08)
    );

    this.add(this.pickableObjets[0]);

    // Picking
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    // Panel
    this.puntos = 0;
    this.velocidad = 0;
    this.createInfoPanel();
  }

  createObjetos() {
    this.vectorCircuito = [];
    this.parte1 = [];
    this.parte2 = [];
    this.parte3 = [];
    this.parte4 = [];
    this.parte5 = [];

    //Añadir aqui lo objetos (cuidado con la posicion y el vector donde se introduce) 
    this.parte1.push(new Valla(this.circuito.tubeGeometry, 0.05));
    this.parte1.push(new Tronco(this.circuito.tubeGeometry, 0.1));
    this.parte2.push(new Boost(this.circuito.tubeGeometry, 0.21));
    this.parte3.push(new Tronco(this.circuito.tubeGeometry, 0.41));
    this.parte4.push(new Valla(this.circuito.tubeGeometry, 0.61));
    this.parte5.push(new PowerUp(this.circuito.tubeGeometry, 0.81));


    this.vectorCircuito.push(this.parte1);
    this.vectorCircuito.push(this.parte2);
    this.vectorCircuito.push(this.parte3);
    this.vectorCircuito.push(this.parte4);
    this.vectorCircuito.push(this.parte5);
  }

  createInfoPanel() {
    const puntos = document.getElementById('puntos');
    puntos.innerText = 'Puntos: 0';

    const velocidad = document.getElementById('velocidad');
    velocidad.innerText = 'Velocidad: 0 km/h';
  }

  updateScore() {
    document.getElementById('puntos').innerText = 'Puntos: ' + this.puntos;
  }

  updateSpeed() {
    document.getElementById('velocidad').innerText = 'Velocidad: ' + this.velocidad + ' km/h';
  }

  calculateScore() {
    this.puntos += 1;
  }

  calculateSpeed() {

  }

  initStats() {

    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    $("#Stats-output").append(stats.domElement);

    this.stats = stats;
  }

  createCamera() {
    // Cámara normal
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);

    this.camera.position.set(0, 2, 75);
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);

    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }

  createCameraSubjetiva(coche) {
    // Camara subjetiva
    var camaraSubjetiva = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
    coche.setCamaraSubjetiva(camaraSubjetiva);

    camaraSubjetiva.position.set(15, 5, 0);

    var puntoDeMiraRelativo = new THREE.Vector3(0, -10, 30);

    this.target = new THREE.Vector3();
    camaraSubjetiva.getWorldPosition(this.target);
    this.target.add(puntoDeMiraRelativo);

    camaraSubjetiva.lookAt(this.target);

  }

  createGround() {
    var geometryGround = new THREE.BoxGeometry(10, 0.2, 10);

    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshStandardMaterial({ map: texture });

    var ground = new THREE.Mesh(geometryGround, materialGround);

    ground.position.y = -0.1;

    this.add(ground);
  }

  createGUI() {
    var gui = new GUI();

    this.guiControls = {
      lightPower: 500.0,
      ambientIntensity: 0.5,
      axisOnOff: true
    }

    var folder = gui.addFolder('Luz y Ejes');

    folder.add(this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange((value) => this.setLightPower(value));

    folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange((value) => this.setAmbientIntensity(value));

    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes : ')
      .onChange((value) => this.setAxisVisible(value));

    return gui;
  }

  createLights() {
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add(this.ambientLight);

    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set(-1, 3, 1);
    this.add(this.pointLight);
  }

  setLightPower(valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity(valor) {
    this.ambientLight.intensity = valor;
  }

  setAxisVisible(valor) {
    this.axis.visible = valor;
  }

  createRenderer(myCanvas) {

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

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  checkCollisions() {
    /* this.coche.balas.forEach((bala, index) => {
      if (bala.position.distanceTo(this.pickableObjets[0].position) < 1) { // Asegúrate de que este umbral es adecuado
        var zepelin = this.pickableObjets[0];
        this.remove(zepelin);
        this.pickableObjets.splice(0, 1);
        this.coche.remove(bala); // Elimina la bala
        this.coche.balas.splice(index, 1); // Elimina la bala de la lista
      }
    }); */

    for (let i = this.coche.balas.length - 1; i >= 0; i--) {
      let bala = this.coche.balas[i];
      this.pickableObjets.forEach((zepelin, index) => {
        if (bala.position.distanceTo(zepelin.position) < 1) { // Ajusta según la escala y el tamaño
          this.remove(zepelin);
          this.pickableObjets.splice(index, 1); // Elimina el zepelin de la lista
          this.coche.remove(bala); // Elimina la bala del coche
          this.coche.balas.splice(i, 1); // Elimina la bala de la lista de balas
        }
      });
    }
  }

  removeZepelin(zepelin) {
    // Encuentra y elimina el zepelín de la lista de objetos seleccionables
    const index = this.pickableObjets.indexOf(zepelin);
    console.log(index);
    if (index !== -1) {
      this.pickableObjets.splice(index, 1); // Elimina el zepelín de la lista
    }

    // Elimina el zepelín de la escena
    this.remove(zepelin);
  }

  update() {

    if (this.stats) this.stats.update();
    this.cameraControl.update();

    //this.coche.update();

    /* for (var i = 0; i < this.parte1.length; i++) {
      this.parte1[i].update();
    } */
    for (var i = 0; i < this.vectorCircuito.length; i++) {
      var vector = this.vectorCircuito[i];
      for (var j = 0; j < vector.length; j++) {
        vector[j].update();
      }
    }

    var posicionCoche = this.coche.getTi();
    if (posicionCoche >= 0 && posicionCoche < 0.2) {

      for (var j = 0; j < this.parte1.length; j++) {
        if (this.coche.getCaja().intersectsBox(this.parte1[j].getCaja())) {
          console.log("ha chocado con ", this.parte1[j]);
          var borrar = this.parte1[j];
          this.parte1.splice(j, 1);
          this.remove(borrar);
        }
      }
    } else if (posicionCoche >= 0.2 && posicionCoche < 0.4) {

      for (var j = 0; j < this.parte2.length; j++) {
        if (this.coche.getCaja().intersectsBox(this.parte2[j].getCaja())) {
          console.log("ha chocado con ", this.parte2[j]);
          var borrar = this.parte2[j];
          this.parte2.splice(j, 1);
          this.remove(borrar);
        }
      }
    } else if (posicionCoche >= 0.4 && posicionCoche < 0.6) {

      for (var j = 0; j < this.parte3.length; j++) {
        if (this.coche.getCaja().intersectsBox(this.parte3[j].getCaja())) {
          console.log("ha chocado con ", this.parte3[j]);
          var borrar = this.parte3[j];
          this.parte3.splice(j, 1);
          this.remove(borrar);
        }
      }
    } else if (posicionCoche >= 0.6 && posicionCoche < 0.8) {

      for (var j = 0; j < this.parte4.length; j++) {
        if (this.coche.getCaja().intersectsBox(this.parte4[j].getCaja())) {
          console.log("ha chocado con ", this.parte4[j]);
          var borrar = this.parte4[j];
          this.parte4.splice(j, 1);
          this.remove(borrar);
        }
      }
    }
    else if (posicionCoche >= 0.8 && posicionCoche < 1) {

      for (var j = 0; j < this.parte5.length; j++) {
        if (this.coche.getCaja().intersectsBox(this.parte5[j].getCaja())) {
          console.log("ha chocado con ", this.parte5[j]);
          var borrar = this.parte5[j];
          this.parte5.splice(j, 1);
          this.remove(borrar);
        }
      }
    }

    // Animaciones coche
    this.coche.update();
    if (this.coche.getTi() < posicionCoche) {
      console.log("vuelta completada");
    }

    // this.checkCollisions();

    if (this.pickableObjets.length > 0) {
      for (var i = 0; i < this.pickableObjets.length; i++) {
        this.pickableObjets[i].update();
      }
    }

    this.renderer.render(this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }
}

$(function () {

  var scene = new MyScene("#WebGL-output");

  window.addEventListener("resize", () => scene.onWindowResize());

  window.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      scene.toggleCamera();
    } else if (event.key === 'w' || event.key === 'W') {
      scene.coche.doSalto(true);
    } else if (event.key === 'a' || event.key === 'A') {
      scene.coche.hacerGiro("izquierda");
      //scene.coche.giro("izquierda");
    }
    else if (event.key === 'd' || event.key === 'D') {
      scene.coche.hacerGiro("derecha");
      //scene.coche.giro("derecha");
    }
  });

  window.addEventListener("mousedown", function (event) {
    scene.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    scene.mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

    scene.raycaster.setFromCamera(scene.mouse, scene.coche.getCamaraSubjetiva());
    var pickedObjects = scene.raycaster.intersectObjects(scene.pickableObjets, true);

    if (pickedObjects.length > 0) {
      var obj = pickedObjects[0].object;
      if (obj.userData instanceof Zepelin) {
        console.log("Pick en zepelin");
        scene.removeZepelin(obj.userData);
      }
    }
  });

  scene.update();
});