// Clases de la biblioteca

import * as THREE from '../libs/three.module.js';
import { GUI } from '../libs/dat.gui.module.js';
import { TrackballControls } from '../libs/TrackballControls.js';
import { Stats } from '../libs/stats.module.js';
import * as TWEEN from '../libs/tween.esm.js';

// Clases de mi proyecto

import { PowerUp } from './PowerUp.js';
import { Valla } from './Valla.js';
import { Circuito } from './Circuito.js';
import { Coche } from './Coche.js';
import { Tronco } from './Tronco.js';
import { Boost } from './Boost.js';
import { Zepelin } from './Zepelin.js';

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.createLights();
    this.createCamera();

    this.currentCamera = 'normal';

    this.circuito = new Circuito(this.gui, 'Controles circuito');
    this.coche = new Coche(this.circuito.tubeGeometry, this.gui, 'coche');

    this.createLuz1(this.coche);
    this.createLuz2(this.coche);
    this.createLuz3(this.coche);

    this.createCameraSubjetiva(this.coche);

    this.botonesObjetos();
  }

  botonesObjetos() {
    const botonPowerUp = document.getElementById('btn-powerup');
    const botonValla = document.getElementById('btn-valla');
    const botonZepelin = document.getElementById('btn-zepelin');
    const botonTronco = document.getElementById('btn-tronco');
    const botonCoche = document.getElementById('btn-coche');
    const botonBoost = document.getElementById('btn-boost');
    const botonCircuito = document.getElementById('btn-circuito');

    botonPowerUp.addEventListener('click', () => this.añadirPowerUp());
    botonValla.addEventListener('click', () => this.añadirValla());
    botonZepelin.addEventListener('click', () => this.añadirZepelin());
    botonTronco.addEventListener('click', () => this.añadirTronco());
    botonCoche.addEventListener('click', () => this.añadirCoche());
    botonBoost.addEventListener('click', () => this.añadirBoost());
    botonCircuito.addEventListener('click', () => this.añadirCircuito());
  }

  borrarObjetos(){
    this.remove(this.powerUp);
    this.remove(this.valla);
    this.remove(this.zepelin);
    this.remove(this.tronco);
    this.remove(this.coche);
    this.remove(this.boost);
    this.remove(this.circuito)

    this.camera.position.set(0, 1, 2);
  }

  añadirPowerUp() {
    this.powerUp = new PowerUp(this.circuito.tubeGeometry, 0, 0);
    this.powerUp.position.y = -4;
    this.borrarObjetos();
    this.add(this.powerUp);
  }

  añadirValla() {
    this.valla = new Valla(this.circuito.tubeGeometry, 0, 0);
    this.valla.position.y = -4;
    this.borrarObjetos();
    this.add(this.valla);
  }

  añadirZepelin(){
    this.zepelin = new Zepelin(this.circuito.tubeGeometry, 0, 0);
    this.zepelin.position.y = -5.5;
    this.borrarObjetos();
    this.add(this.zepelin);
  }

  añadirTronco(){
    this.tronco = new Tronco(this.circuito.tubeGeometry, 0, 0);
    this.tronco.position.y = -4;
    this.borrarObjetos();
    this.add(this.tronco);
    console.log("Tronco");
  }

  añadirCoche(){
    this.coche.position.y = -4;
    this.borrarObjetos();
    this.add(this.coche);
  }

  añadirBoost(){
    this.boost = new Boost(this.circuito.tubeGeometry, 0, 0);
    this.boost.position.y = -4;
    this.borrarObjetos();
    this.add(this.boost);
  }

  añadirCircuito(){
    this.circuito = new Circuito(this.gui, "");
    this.borrarObjetos();
    this.camera.position.set(0, 1, 70);
    this.add(this.circuito);
  }

  createLuz1(coche) {
    this.pointLight1 = new THREE.PointLight(0xffffff);
    this.pointLight1.power = 500;
    this.pointLight1.position.set(0, 5, 0);
    coche.setLight(this.pointLight1);
  }

  createLuz2(coche) {
    this.pointLight2 = new THREE.PointLight(0xff0000);
    this.pointLight2.power = 0;
    this.pointLight2.position.set(0, 5, 0);
    coche.setLight(this.pointLight2);
  }

  createLuz3(coche) {
    this.pointLight3 = new THREE.PointLight(0x00ff00);
    this.pointLight3.power = 0;
    this.pointLight3.position.set(0, 5, 0);
    coche.setLight(this.pointLight3);
  }

  lucesMalas() {
    const tiempo1 = 400;
    const tiempo2 = 600;
    const tiempo3 = 1000;
    const self = this;

    this.pointLight1.power = 0;
    this.pointLight2.power = 1000;
    this.pointLight3.power = 0;

    setTimeout(() => {
      self.pointLight1.power = 500;
      self.pointLight2.power = 0;
    }, tiempo1);

    setTimeout(() => {
      self.pointLight1.power = 0;
      self.pointLight2.power = 1000;
    }, tiempo2);

    setTimeout(() => {
      self.pointLight1.power = 500;
      self.pointLight2.power = 0;
    }, tiempo3);
  }

  lucesBuenas() {
    const tiempo1 = 400;
    const tiempo2 = 600;
    const tiempo3 = 1000;
    const self = this;

    this.pointLight1.power = 0;
    this.pointLight2.power = 0;
    this.pointLight3.power = 1000;

    setTimeout(() => {
      self.pointLight1.power = 500;
      self.pointLight3.power = 0;
    }, tiempo1);

    setTimeout(() => {
      self.pointLight1.power = 0;
      self.pointLight3.power = 1000;
    }, tiempo2);

    setTimeout(() => {
      self.pointLight1.power = 500;
      self.pointLight3.power = 0;
    }, tiempo3);
  }

  createCamera() {
    const container = document.getElementById('WebGL-presentacion');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    this.camera.position.set(0, 1, 2);
    const look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);

    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }

  createCameraSubjetiva(coche) {
    const container = document.getElementById('WebGL-presentacion');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camaraSubjetiva = new THREE.PerspectiveCamera(45,width / height, 0.1, 30);
    coche.setCamaraSubjetiva(camaraSubjetiva);

    camaraSubjetiva.position.set(20, 12, 0);

    const puntoDeMiraRelativo = new THREE.Vector3(0, -10, 30);

    this.target = new THREE.Vector3();
    camaraSubjetiva.getWorldPosition(this.target);
    this.target.add(puntoDeMiraRelativo);

    camaraSubjetiva.lookAt(this.target);
  }

  createGUI() {
    const gui = new GUI();

    this.guiControls = {
      lightPower: 500.0,
      ambientIntensity: 0.5,
      axisOnOff: true
    };

    const folder = gui.addFolder('Luz y Ejes');

    folder.add(this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange(value => this.setLightPower(value));

    folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange(value => this.setAmbientIntensity(value));

    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes : ')
      .onChange(value => this.setAxisVisible(value));

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
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    const container = document.getElementById('WebGL-presentacion');
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    document.querySelector(myCanvas).appendChild(renderer.domElement);
    return renderer;
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
    const container = document.getElementById('WebGL-presentacion');
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.setCameraAspect(width / height);
    this.renderer.setSize(width, height);
  }

  update() {
    if (this.stats) this.stats.update();
    this.cameraControl.update();
    TWEEN.update();
    this.coche.updatePresentacion();
    this.renderer.render(this, this.getCamera());
    requestAnimationFrame(() => this.update());
  }
}

$(function () {
  const scene = new MyScene('#WebGL-presentacion');
  window.addEventListener('resize', () => scene.onWindowResize());
  scene.onWindowResize();
  scene.update();
});
