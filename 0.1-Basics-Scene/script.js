import * as THREE from "three";

// A scene is the 3D world container; meshes and cameras are added to it.
const scene = new THREE.Scene();
// PerspectiveCamera arguments: field of view, aspect ratio, near clip, far clip.
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  2000,
);
camera.position.z = 4;

// The renderer turns the scene and camera view into pixels in the browser.
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// A mesh combines shape (geometry) with appearance (material).
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

(function animate() {
  // Queue the next frame so motion continues while the browser is drawing.
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
})();
