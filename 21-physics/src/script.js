import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = (collision) => {
    console.log(collision);
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if(impactStrength > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}
/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}
debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5, {x: (Math.random() - 0.5) * 3, y: 2, z: (Math.random() - 0.5) * 3})
}
debugObject.creatBox = () => {
    createBox(Math.random(), Math.random(), Math.random(), {x: (Math.random() - 0.5) * 3, y: 2, z: (Math.random() - 0.5) * 3})
}
debugObject.reset = () => {
    for(const object of objectsToUpdate) {
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)
        scene.remove(object.mesh)
    }
    objectsToUpdate.splice(0, objectsToUpdate.length)
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'creatBox')
gui.add(debugObject, 'reset')
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
world.broadphase = new CANNON.SAPBroadphase(world) // tạo phạm vi rộng
world.allowSleep = true // cho phép ngủ
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

// Utils
const objectsToUpdate = []

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})
const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Canon Js
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 1),
        shape: shape,
        material: defaultMaterial
    })
    body.addEventListener('collide', playHitSound )

    body.position.copy(position)
    world.addBody(body)

    // Saves
    objectsToUpdate.push({mesh, body})
}

// Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})
const createBox = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    )
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Canon Js
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 1),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound )
    world.addBody(body)

    // Saves
    objectsToUpdate.push({mesh, body})
}


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

    world.step(1 / 60, deltaTime, 3) // 1/60 là 60fps, 3 là số lần lặp lại
    
    for(const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()