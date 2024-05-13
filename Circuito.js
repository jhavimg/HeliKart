

import * as THREE from 'three';

class CinquefoilKnot extends THREE.Curve {

    constructor(scale = 10) {
        super();
        this.scale = scale;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const point = optionalTarget;

        const p = 2;
        const q = 5;

        t *= Math.PI * 2;

        const x = (2 + Math.cos(q * t)) * Math.cos(p * t);
        const y = (2 + Math.cos(q * t)) * Math.sin(p * t);
        const z = Math.sin(q * t);

        return point.set(x, y, z).multiplyScalar(this.scale);
    }
}

class Circuito extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();

        this.createGUI(gui, titleGui);

        const curve = new CinquefoilKnot(10);

        const radius = 4;

        const segments = 500;

        this.tubeGeometry = new THREE.TubeGeometry(curve, segments, radius, segments, true);

        // Cargador de texturas
        const self = this; 

        const loader = new THREE.TextureLoader();
        loader.load('./img/textura_circuito3.jpg', function(texture) {
            
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(50, 2);

            const material = new THREE.MeshPhongMaterial({ map: texture });
            const tubeMesh = new THREE.Mesh(self.tubeGeometry, material);
            self.add(tubeMesh);  // Añadir el mesh a la instancia correcta de Circuito
        });

        // this.material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        // const tubeMesh = new THREE.Mesh(this.tubeGeometry, this.material);

        this.curve = curve;
        // this.add(tubeMesh);

    }

    createGUI(gui, titleGui) {

    }

    update() {
        
    }
}

export { Circuito };
