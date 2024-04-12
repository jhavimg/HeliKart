import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js';

function generarPuntosCirculo(radio, numPuntos) {
  var puntos = [];

  // Calcular el ángulo entre cada punto
  var anguloIncremento = (2 * Math.PI) / numPuntos;

  // Generar los puntos del círculo
  for (var i = 0; i < numPuntos; i++) {
      // Calcular el ángulo para este punto
      var angulo = i * anguloIncremento;

      // Calcular las coordenadas x e y para este punto
      var x = radio * Math.cos(angulo);
      var y = radio * Math.sin(angulo);

      // Crear un nuevo Vector2 con las coordenadas x e y y agregarlo a la lista de puntos
      puntos.push(new THREE.Vector2(x, y));
  }

  return puntos;
}

class Zepelin extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    var shape = new THREE.Shape();
    var puntos = generarPuntosCirculo(0.2 , 64);
    shape.moveTo(puntos[0].x, puntos[0].y); // Esto siempre poner ponerlo
    // Crear líneas hacia los puntos restantes
    for (var i = 1; i < puntos.length; i++) {
        shape.lineTo(puntos[i].x, puntos[i].y);
    }
    
    /* const v1 = new THREE.Vector3(1 , 0 , 1);
    const v2 = new THREE.Vector3(0 , 1 , 0);
    const curve = new THREE.LineCurve3(v1 , v2); //curve

    const extrudePath = new THREE.CurvePath();
    extrudePath.add(curve); */

    const extrudeSettings = { 
      depth: 0, 
      bevelEnabled: true, 
      bevelThickness: 5,//largo de lo abombao
      bevelSize: 1.5, //cuanto se va a abombar
      bevelSegments: 60, //esto crea mas segmentos por lo q se ve mas redondeado
      curveSegments: 60 //segmentos para la curva del shape
    };
    
    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

    const mat = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

    this.corazon = new THREE.Mesh(geometry , mat);
    this.corazon.position.y = 1.7;

    var cabina_cuerpo = new THREE.Mesh(new THREE.BoxGeometry(0.7 , 0.3 , 1.5) , new THREE.MeshNormalMaterial());
    var cabina_delantera = new THREE.Mesh(new THREE.CylinderGeometry(0.7 / 2 , 0.7 / 2 , 0.3) , new THREE.MeshNormalMaterial());
    var cabina_trasera = new THREE.Mesh(new THREE.CylinderGeometry(0.7 / 2 , 0.7 / 2 , 0.3) , new THREE.MeshNormalMaterial());
    cabina_cuerpo.position.set(0 , 0 , 0 );
    cabina_delantera.position.set(0 , 0 , 1.5 / 2 );
    cabina_trasera.position.set(0 , 0 , -1.5 / 2 );

    var Figura_cabina = new CSG();
    Figura_cabina.union([cabina_cuerpo , cabina_delantera , cabina_trasera]);
    var cabina = Figura_cabina.toMesh();
    cabina.position.y = -0.1
    this.add(this.corazon);
    this.add(cabina);

  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
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
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
   
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { Zepelin };