/**
 * Codigo de CinquefoilKnot https://github.com/mrdoob/three.js/blob/master/examples/jsm/curves/CurveExtras.js
 */

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

        const curve = new CinquefoilKnot(8);

        const radius = 2;

        const segments = 200;

        const tubeGeometry = new THREE.TubeGeometry(curve, segments, radius, segments, true);

        const material = new THREE.MeshLambertMaterial({ color: 0xff00ff });

        const tubeMesh = new THREE.Mesh(tubeGeometry, material);

        this.add(tubeMesh);

    }

    createGUI(gui, titleGui) {

    }

    update() {
    }
}

export { Circuito };
