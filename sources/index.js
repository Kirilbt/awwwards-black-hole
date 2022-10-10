import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import discVertex from './shaders/disc/vertex.glsl'
import discFragment from './shaders/disc/fragment.glsl'

/**
 * Setup
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// // Test
// const test = new THREE.Mesh(
//     new THREE.SphereGeometry(),
//     new THREE.MeshNormalMaterial({ wireframe: true }),
// )
// scene.add(test)

/**
 * Sizes
 */
const sizes = { width: window.innerWidth, height: window.innerHeight }
window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 500)
camera.position.set(0, 0.8, 10)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.4

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
renderer.setSize(sizes.width, sizes.height)

/**
 * Noises
 */
const noises = {}
noises.scene = new THREE.Scene()
noises.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
noises.camera.position.set(0, 0, 5)
noises.scene.add(noises.camera)

// Plane
noises.plane = {}
noises.plane.geometry = new THREE.PlaneGeometry(2, 2)
noises.plane.material = new THREE.MeshBasicMaterial({
  color: 'red',
  wireframe: true
})
noises.plane.mesh = new THREE.Mesh(noises.plane.geometry, noises.plane.material)
noises.scene.add(noises.plane.mesh)

// Render Target
noises.renderTarget = new THREE.WebGLRenderTarget(
  256,
  256,
  {
    generateMipmaps: false,
    type: THREE.FloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping
  }
)

// Render the noises into the render target
renderer.setRenderTarget(noises.renderTarget)
renderer.render(noises.scene, noises.camera)
renderer.setRenderTarget(null)

/**
 * Disc
 */
const disc = {}

// Gradient
disc.gradient = {}
disc.gradient.canvas = document.createElement('canvas')
disc.gradient.canvas.width = 1
disc.gradient.canvas.height = 128
// disc.gradient.canvas.style.position = 'absolute'
// disc.gradient.canvas.style.top = 0
// disc.gradient.canvas.style.left = 0
// disc.gradient.canvas.style.zIndex = 1
// document.body.append(disc.gradient.canvas)
disc.gradient.context = disc.gradient.canvas.getContext('2d')
disc.gradient.style = disc.gradient.context.createLinearGradient(0, 0, 0, disc.gradient.canvas.height)
disc.gradient.style.addColorStop(0, '#fffbf9')
disc.gradient.style.addColorStop(0.1, '#ffbc68')
disc.gradient.style.addColorStop(0.2, '#ff5600')
disc.gradient.style.addColorStop(0.4, '#ff0053')
disc.gradient.style.addColorStop(0.8, '#cc00ff')
disc.gradient.context.fillStyle = disc.gradient.style
disc.gradient.context.fillRect(0, 0, disc.gradient.canvas.width, disc.gradient.canvas.height)
disc.gradient.texture = new THREE.CanvasTexture(disc.gradient.canvas)


// Mesh
disc.geometry = new THREE.CylinderGeometry(1.5, 6, 0, 64, 8, true)
disc.material = new THREE.ShaderMaterial({
  vertexShader: discVertex,
  fragmentShader: discFragment,
  uniforms: {
    uGradientTexture: { value: disc.gradient.texture }
  }
})
disc.mesh = new THREE.Mesh(disc.geometry, disc.material)
scene.add(disc.mesh)

/**
 * Tick loop
 */
const tick = () =>
{
    // Update camera and controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    // renderer.render(noises.scene, noises.camera)

    // Keep ticking
    window.requestAnimationFrame(tick)
}

tick()
