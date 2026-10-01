import "./style.css";
import * as THREE from "three";
// GSAP interpolates object properties over time and schedules its own updates.
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//Time
// let time = Date.now();

// Clock
// const clock = new THREE.Clock();

// Each tween targets the existing position object; durations and delays are seconds.
gsap.to(mesh.position, { duration: 2, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

//Animation

const tick = () => {
  // This render loop keeps displaying the scene while GSAP updates the mesh.
  //   Time
  //   const currenttime = Date.now();
  //   const deltaTime = currenttime - time;
  //   time = currenttime;

  //   Clock
  //   const elapsedTime = clock.getElapsedTime();

  //   update objects
  //   mesh.rotation.y = elapsedTime * Math.PI * 1;
  //   mesh.position.y = Math.cos(elapsedTime);
  //   mesh.position.x = Math.sin(elapsedTime);

  //   camera.position.x = Math.sin(elapsedTime);
  //   camera.position.y = Math.cos(elapsedTime);
  //   camera.lookAt(mesh.position)

  //render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
