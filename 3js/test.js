import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// add camera controls
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-10 ,10, 25);
orbit.update();
// create a plane
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true; // enable plane to receive shadow

// add a Grid Helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// create a Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

// create Ambient Light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);


const halfWidth = planeGeometry.parameters.width / 2;
const halfHeight = planeGeometry.parameters.height / 2;

const spotLight1 = new THREE.SpotLight(0xFFFFFF, 100000);
const spotLight2 = new THREE.SpotLight(0xFFFFFF, 100000);
const spotLight3 = new THREE.SpotLight(0xFFFFFF, 100000);
const spotLight4 = new THREE.SpotLight(0xFFFFFF, 100000);
spotLight1.position.set(halfWidth, 120, halfHeight);
spotLight2.position.set(-halfWidth, 120, halfHeight);
spotLight3.position.set(-halfWidth, 120, -halfHeight);
spotLight4.position.set(halfWidth, 120, -halfHeight);
scene.add(spotLight1);
scene.add(spotLight2);
scene.add(spotLight3);
scene.add(spotLight4);
spotLight1.castShadow = true;
spotLight2.castShadow = true;
spotLight3.castShadow = true;
spotLight4.castShadow = true;
spotLight1.angle = 0.2;
spotLight2.angle = 0.2;
spotLight3.angle = 0.2;
spotLight4.angle = 0.2;

const gltfLoader = new GLTFLoader();

// Load the table tennis model
gltfLoader.load('./table/scene.gltf', function(gltf){
    const tableTennisModel = gltf.scene;
    
    // Add the table tennis model to the scene
    scene.add(tableTennisModel);
    tableTennisModel.scale.set(5,5,5);
});

// use the GUI
const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.05,
    angle: 0.2,
    penumbra: 0,
    intensity: 100000
};

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 100000);


let step = 0;

function animate(time){
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight1.angle = options.angle;
    spotLight1.penumbra = options.penumbra;
    spotLight1.intensity = options.intensity;
    spotLight2.angle = options.angle;
    spotLight2.penumbra = options.penumbra;
    spotLight2.intensity = options.intensity;
    spotLight3.angle = options.angle;
    spotLight3.penumbra = options.penumbra;
    spotLight3.intensity = options.intensity;
    spotLight4.angle = options.angle;
    spotLight4.penumbra = options.penumbra;
    spotLight4.intensity = options.intensity;
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);