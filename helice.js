import * as THREE from '../libs/three.module.js'

class helice extends THREE.Object3D {
  constructor() {
    super();

    var shape = new THREE.Shape();
    shape.moveTo(0 , 0);
    shape.quadraticCurveTo( - 0.05 , 0.025 , 0 , 0.05);
    shape.quadraticCurveTo( 0.05 , 0.07, 0.5, 0);
    shape.closePath();

    const extrudeSettings = { 
      depth: 1.3, 
      bevelEnabled: false, 
      bevelThickness: 5,//largo de lo abombao
      bevelSize: 1.5, //cuanto se va a abombarCoche
      bevelSegments: 60, //esto crea mas segmentos por lo q se ve mas redondeado
      curveSegments: 60 //segmentos para la curva del shape
    };
    
    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    geometry.translate(0 , -0.025 , 0);
    geometry.rotateX(-Math.PI / 2);
    geometry.rotateY(-Math.PI / 2)
    const mat = new THREE.MeshStandardMaterial({ color: 0x3F3F3F });

    var elice = new THREE.Mesh(geometry , mat);
    elice.position.y = 0.1;
    elice.scale.set(0.01 , 0.8 , 0.5);

    var brazo = new THREE.Mesh(new THREE.CylinderGeometry(0.02 , 0.025 , 0.1) , mat);
    brazo.position.y = 0.05;
    
    /* var cilindro = new THREE.Mesh(new THREE.) */
    this.add(elice);
    this.add(brazo);
  }
}

export { helice };
