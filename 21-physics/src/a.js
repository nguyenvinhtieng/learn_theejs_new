import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'


/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

// Physics
const world = new CANNON.World()
world.gravity.set(0, - 9.82, 0) // set trọng lực, thao chiều x và z = 0 là trục đứng là 8.82 m/s2

// Materials
// const concreteMaterial = new CANNON.Material('concrete') // tạo vật liệu bê tông
// const plasticMaterial = new CANNON.Material('plastic') // tạo vật liệu nhựa

// const concretePlasticContactMaterial = new CANNON.ContactMaterial( // tạo vật liệu tiếp xúc
//     concreteMaterial, // vật liệu 1
//     plasticMaterial, // vật liệu 2
//     {
//         friction: 0.1, // ma sát
//         restitution: 0.7 // độ bật
//     }
// )


const defaultMaterial = new CANNON.Material('default') // tạo vật liệu mặc định
const defaultContactMaterials = new CANNON.ContactMaterial( // tạo vật liệu tiếp xúc mặc định
    defaultMaterial, // vật liệu 1
    defaultMaterial, // vật liệu 2
    {
        friction: 0.1, // ma sát
        restitution: 0.7 // độ bật
    }
)

world.addContactMaterial(defaultContactMaterials) // thêm vật liệu tiếp xúc vào thế giới
world.defaultContactMaterial = defaultContactMaterials // vật liệu tiếp xúc mặc định
// Sphere
const sphereShape = new CANNON.Sphere(0.5) // tạo hình cầu với bán kính 0.5
const sphereBody = new CANNON.Body({
    mass: 1, // khối lượng
    position: new CANNON.Vec3(0, 3, 0), // vị trí
    shape: sphereShape, // hình dạng
})
sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
world.addBody(sphereBody) // thêm hình cầu vào thế giới

const floorShape = new CANNON.Plane() // tạo hình phẳng
const floorBody = new CANNON.Body({
    mass: 0, // khối lượng
    position: new CANNON.Vec3(0, 0, 0), // vị trí
    shape: floorShape, // hình dạng
    // material: defaultMaterial // vật liệu
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5) // xoay hình phẳng 90 độ
world.addBody(floorBody) // thêm hình phẳng vào thế giới

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physics world
    sphereBody.applyForce(new CANNON.Vec3(- 0.5, 0, 0), sphereBody.position)

    world.step(1 / 60, deltaTime, 3) // 1/60 là 60fps, 3 là số lần lặp lại
    
    sphere.position.copy(sphereBody.position) // copy vị trí của hình cầu vào vị trí của hình cầu trong thế giới
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()