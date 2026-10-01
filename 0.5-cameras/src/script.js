import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Previous mouse-position approach, kept as a note:
 * It stores pointer coordinates, but does not control the camera by itself.
 */
/*
const cursor = {
    x: 0,
    y: 0

}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})
  */

/**
 * Base
 */
// Canvas
// OrbitControls listens for pointer and wheel input on this rendered canvas.
const canvas = document.querySelector("canvas.webgl");

// Sizes
// Start at the viewport size; the resize handler keeps these values current.
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
// The scene is the world that holds objects and the camera.
const scene = new THREE.Scene();

// Object
// A mesh combines geometry (shape) and material (appearance).
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
);
scene.add(mesh);

// Camera
// PerspectiveCamera takes field of view, aspect ratio, near plane, and far plane.
const camera = new THREE.PerspectiveCamera(
  105,
  sizes.width / sizes.height,
  0.1,
  100,
);

// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)

// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 2;
// Aim the initial view at the mesh; OrbitControls should use this same target.
camera.lookAt(mesh.position);
scene.add(camera);

// OrbitControls changes the camera in response to pointer drag and wheel input.
const controls = new OrbitControls(camera, canvas);
controls.target.copy(mesh.position);
controls.enableDamping = true;
// Apply the initial target and orientation before the first render.
controls.update();

// Renderer
// WebGLRenderer draws the scene through the selected canvas.
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

window.addEventListener("resize", () => {
  // Refresh the viewport dimensions when the browser window changes size.
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update both the camera projection and drawing buffer to match the viewport.
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

// Animate
// The clock was used by the optional object rotation example below.
// const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();

  // Optional object animation: uncomment with the clock line above.
  // mesh.rotation.y = elapsedTime;

  // Previous cursor-driven camera examples, kept as notes:
  // Uncommenting these would compete with OrbitControls by resetting the camera.
  // camera.position.x = cursor.x * 10;
  // camera.position.y = cursor.y * 10;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);

  // Do not run the cursor-driven camera examples while OrbitControls is active.
  // For damping, update controls each frame before rendering.
  controls.update();

  // Draw the latest camera view and scene state.
  renderer.render(scene, camera);

  // Schedule another frame so damping can finish and input stays responsive.
  window.requestAnimationFrame(tick);
};

tick();
