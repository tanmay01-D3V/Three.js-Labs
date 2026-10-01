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
 * Position moves the object, scale changes its size, and both are local transforms.
 */
mesh.position.set(0.7, -0.6, 1);
mesh.scale.set(1, 1, 1);

/**
 * Rotation values are radians; PI / 4 is a 45-degree turn.
 */
mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0);

/**
 * Unlit material — no lighting response, good for isolating transforms
 */

const quaternionMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const quaternionMesh = new THREE.Mesh(geometry, quaternionMaterial);
quaternionMesh.position.set(-0.7, 0.6, 1);

/**
 * A quaternion stores rotation without the axis-order ambiguity of Euler angles.
 * Here it represents a 45-degree turn around the world Y axis.
 */

const rotationAxis = new THREE.Vector3(0, 1, 0);
const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(rotationAxis, Math.PI * 0.25);

/**
 * Copy the quaternion value into the mesh; later edits to the source quaternion
 * will not automatically change this mesh's rotation.
 */
quaternionMesh.quaternion.copy(quaternion);

scene.add(quaternionMesh);

/**
 * AxesHelper colors X red, Y green, and Z blue to make orientation visible.
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
  // Keep the camera's projection matched to the new viewport aspect ratio.
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

renderer.render(scene, camera);
