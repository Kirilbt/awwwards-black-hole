import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Setup
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Test
const test = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshNormalMaterial({ wireframe: true }),
)
scene.add(test)

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
 * Tick loop
 */
const tick = () =>
{
    // Update camera and controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Keep ticking
    window.requestAnimationFrame(tick)
}

tick()