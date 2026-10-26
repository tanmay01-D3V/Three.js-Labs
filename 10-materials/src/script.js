import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'

/**
 * ============================================================
 * LAB NOTES — TEXTURE LOADING
 * ============================================================
 * Two loader types are used here:
 *  - TextureLoader     : loads a single 2D image (jpg/png)
 *  - CubeTextureLoader : loads 6 images to form a cubemap
 *                        (used for environment reflections)
 *
 * IMPORTANT: The original file had `textureLoader` commented out
 * but still referenced it everywhere → runtime crash.
 * Fix: instantiate BOTH loaders.
 * ============================================================
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

// --- 2D door textures (PBR set) ---
const doorColorTexture        = textureLoader.load('/textures/door/color.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture       = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture       = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture    = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture    = textureLoader.load('/textures/door/roughness.jpg')

/**
 * ============================================================
 * CUBEMAP USAGE — LAB NOTES
 * ============================================================
 * 1. scene.background  → visible skybox
 * 2. scene.environment → IBL reflections on PBR materials
 * 3. material.envMap   → per-material override (optional)
 *
 * A CubeTexture is sampled by DIRECTION, not UV — so it has
 * no place on geometry.background; it wraps the scene.
 * ============================================================
 */

// Show the cubemap as the scene backdrop
scene.background = environmentMapTexture

// (Already present) use it as image-based lighting
scene.environment = environmentMapTexture

// Optional: fine-tune reflection strength on our PBR material
material.envMapIntensity = 1.0

// Optional GUI control to compare effects live
gui.add(material, 'envMapIntensity').min(0).max(3).step(0.01)

// --- Matcap & gradient (loaded for learning, not used in final material) ---
const matcapTexture   = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

// LAB NOTE: For toon shading, gradients must NOT be interpolated.
// NearestFilter + no mipmaps keeps hard color bands.
gradientTexture.minFilter      = THREE.NearestFilter
gradientTexture.magFilter      = THREE.NearestFilter
gradientTexture.generateMipmaps = false

// --- Environment cubemap (used for reflections on MeshStandardMaterial) ---
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg'
])

/**
 * ============================================================
 * LAB NOTES — BASE SETUP
 * ============================================================
 */
const canvas = document.querySelector('canvas.webgl')
const scene  = new THREE.Scene()

// LAB NOTE: For MeshStandardMaterial, metalness only looks right
// when there is something to reflect. Setting scene.environment
// applies the cubemap as an IBL (image-based lighting) source.
// This line was MISSING in the original → metal looked flat/black.
scene.environment = environmentMapTexture

/**
 * ============================================================
 * LAB NOTES — MATERIALS (progression of what we tried)
 * ============================================================
 * The original file shows a learning progression:
 *
 *   MeshBasicMaterial  → no lights needed, no PBR
 *   MeshNormalMaterial → visualizes normals, great for debugging
 *   MeshMatcapMaterial → fake lighting via a matcap texture
 *   MeshDepthMaterial  → grayscale depth visualization
 *   MeshLambertMaterial → cheap diffuse lighting
 *   MeshPhongMaterial  → adds specular highlights (shininess)
 *   MeshToonMaterial   → cel-shaded look via gradientMap
 *   MeshStandardMaterial → physically based (metalness/roughness)
 *
 * We end on MeshStandardMaterial because it supports the full
 * PBR texture set (map, aoMap, displacementMap, normalMap,
 * metalnessMap, roughnessMap, alphaMap).
 * ============================================================
 */
const material = new THREE.MeshStandardMaterial()
material.metalness    = 0.7
material.roughness    = 0.2
material.map          = doorColorTexture
material.aoMap        = ambientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap   = doorHeightTexture
material.displacementScale = 0.05
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap    = doorNormalTexture

// LAB NOTE / WARNING:
// Using the COLOR map as `alphaMap` is unusual. An alpha map
// should be a grayscale mask where white = opaque, black =
// transparent. The door color texture will produce semi-random
// transparency. For a proper demo, load a dedicated alpha map:
//   const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
//   material.alphaMap = doorAlphaTexture
//   material.transparent = true
// Kept as-is to match the original, but flagged here.
material.alphaMap = doorColorTexture
material.transparent = true

/**
 * ============================================================
 * LAB NOTES — GUI (lil-gui)
 * ============================================================
 * Exposing PBR properties live lets us observe how metalness
 * and roughness change the look under the same lighting.
 * Step 0.0001 gives near-continuous control.
 * ============================================================
 */
const gui = new GUI()
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)

/**
 * ============================================================
 * LAB NOTES — GEOMETRIES
 * ============================================================
 * Three geometries are used to compare how the same material
 * maps onto different UV layouts:
 *   SphereGeometry → UVs wrap around, good for organic shapes
 *   PlaneGeometry  → flat, shows texture distortion clearly
 *   TorusGeometry  → UVs wrap around the tube
 *
 * `aoMap` (ambient occlusion) requires a SECOND UV set called
 * `uv2`. We copy the existing `uv` array into `uv2` so the AO
 * map aligns with the color map.
 *
 * DEPRECATION FIX: `PlaneBufferGeometry` and `TorusBufferGeometry`
 * are legacy names. In modern Three.js use `PlaneGeometry` and
 * `TorusGeometry` (BufferGeometry is the default now).
 * ============================================================
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material)
torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 * ============================================================
 * LAB NOTES — LIGHTING
 * ============================================================
 * MeshStandardMaterial needs light. AmbientLight gives a flat
 * base fill; PointLight adds directional PBR shading.
 * Combined with scene.environment (IBL), this is enough to
 * see metalness/roughness respond to the GUI.
 * ============================================================
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

/**
 * ============================================================
 * LAB NOTES — SIZES & RESIZE
 * ============================================================
 * On resize we must update:
 *   1. camera.aspect
 *   2. camera.projectionMatrix (via updateProjectionMatrix)
 *   3. renderer size
 *   4. pixel ratio (capped at 2 for performance)
 * ============================================================
 */
const sizes = {
    width:  window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width  = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * ============================================================
 * LAB NOTES — CAMERA & CONTROLS
 * ============================================================
 * OrbitControls with damping gives smooth, inertial rotation.
 * Damping requires controls.update() every frame (see tick).
 * ============================================================
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 2)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * ============================================================
 * LAB NOTES — RENDERER
 * ============================================================
 * Passing the canvas avoids creating a second one.
 * setPixelRatio(≤2) keeps sharpness on HiDPI screens without
 * tanking performance on 4K displays.
 * ============================================================
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * ============================================================
 * LAB NOTES — ANIMATION LOOP
 * ============================================================
 * requestAnimationFrame drives the loop (~60fps).
 * clock.getElapsedTime() gives a time value independent of
 * frame rate — essential for consistent rotation speed.
 * ============================================================
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate all three meshes to reveal texture mapping on each geometry
    plane.rotation.y  = 0.1  * elapsedTime
    sphere.rotation.y = 0.1  * elapsedTime
    torus.rotation.y  = 0.1  * elapsedTime

    plane.rotation.x  = 0.15 * elapsedTime
    sphere.rotation.x = 0.15 * elapsedTime
    torus.rotation.x  = 0.15 * elapsedTime

    // Required for damping to work
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()