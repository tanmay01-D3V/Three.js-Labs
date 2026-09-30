import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * position and scale
 */
mesh.position.set(0.7, -0.6, 1);
mesh.scale.set(1, 1, 1);

/**
 * rotation 
 */
mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0);

/**
 * Unlit material — no lighting response, good for isolating transforms
 */

const quaternionMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const quaternionMesh = new THREE.Mesh(geometry, quaternionMaterial);
quaternionMesh.position.set(-0.7, 0.6, 1);

/**
 * Build a 45° rotation around the world Y axis
 */

const rotationAxis = new THREE.Vector3(0, 1, 0);
const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(rotationAxis, Math.PI * 0.25);

/**
 * Snapshot the rotation into the mesh's transform (value copy, not reference)

 */
quaternionMesh.quaternion.copy(quaternion);

scene.add(quaternionMesh);

/**
 * axis helper
 */

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

renderer.render(scene, camera);
