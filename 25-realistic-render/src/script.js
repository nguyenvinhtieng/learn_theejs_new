import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Update all materials

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}


// Enviroment Map
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/0/px.jpg",
    "/textures/environmentMaps/0/nx.jpg",
    "/textures/environmentMaps/0/py.jpg",
    "/textures/environmentMaps/0/ny.jpg",
    "/textures/environmentMaps/0/pz.jpg",
    "/textures/environmentMaps/0/nz.jpg",
])
environmentMapTexture.encoding = THREE.sRGBEncoding

scene.background = environmentMapTexture
scene.environment = environmentMapTexture


debugObject.envMapIntensity = 2
gui.add(debugObject, "envMapIntensity").min(0).max(10).step(0.001).onChange(updateAllMaterials)
/**
 * Model
 */

const gltfLoader = new GLTFLoader()
gltfLoader.load(
    // "/models/FlightHelmet/glTF/FlightHelmet.gltf",
    "/models/hamburger.glb",
    (gltf) => {
        // gltf.scene.scale.set(10, 10, 10)
        gltf.scene.scale.set(0.5, 0.5, 0.5)
        gltf.scene.position.set(0, - 4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, "y").min(-Math.PI).max(Math.PI).step(0.001).name("rotation")

        updateAllMaterials()
    }
)

// Light 
const direcionalLight = new THREE.DirectionalLight(0xffffff, 3)
direcionalLight.position.set(0.25, 3, - 2.25)
direcionalLight.castShadow = true
direcionalLight.shadow.camera.far = 15
direcionalLight.shadow.mapSize.set(1024, 1024)
direcionalLight.shadow.normalBias = 0.05

scene.add(direcionalLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(direcionalLight, 0.2)
scene.add(directionalLightHelper)

const directionalLightCameraHelper = new THREE.CameraHelper(direcionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)


gui.add(direcionalLight, "intensity").min(0).max(10).step(0.001)
gui.add(direcionalLight.position, "x").min(-5).max(5).step(0.001).name("lightX")
gui.add(direcionalLight.position, "y").min(-5).max(5).step(0.001).name("lightY")
gui.add(direcionalLight.position, "z").min(-5).max(5).step(0.001).name("lightZ")

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap



gui.add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Cineon: THREE.CineonToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
})

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001)


/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()