import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader }  from 'three/examples/jsm/loaders/GLTFLoader'
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

let model = null

const gltfLoader = new GLTFLoader()
gltfLoader.load(
    "/models/Duck/glTF/Duck.gltf",
    (gltf) => {
        gltf.scene.position.y = - 1.2
        scene.add(gltf.scene)
        model = gltf.scene
    }
)

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
directionalLight.position.set(2, 2, 2)
scene.add(directionalLight)

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
// const object3 = new THREE.Mesh(
//     new THREE.TorusGeometry(0.3, 0.2, 16, 32),
//     new THREE.MeshBasicMaterial({ color: '#ff0000' })
// )
object3.position.x = 2

scene.add(object1, object2, object3)


// Raycaster
const raycaster = new THREE.Raycaster()
// raycaster.
const rayOrigin = new THREE.Vector3(- 3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
// console.log(rayDirection);
rayDirection.normalize()
// console.log(rayDirection);

raycaster.set(rayOrigin, rayDirection)

const intersect = raycaster.intersectObject(object2)
console.log(intersect);

const intersects = raycaster.intersectObjects([object1, object2, object3])
console.log(intersects);


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

// Mouse Event
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})
window.addEventListener('click', (event) => {
    if(currentIntersect) {

        switch(currentIntersect.object) {
            case object1:
                console.log('click on object 1');
                break
            case object2:
                console.log('click on object 2');
                break
            case object3:
                console.log('click on object 3');
                break
            default:
                break
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update object
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // const rayOrigin = new THREE.Vector3(- 3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigin, rayDirection)
    
    // const objectsToTest = [object1, object2, object3]
    // const intersects = raycaster.intersectObjects(objectsToTest)

    // for(const object of objectsToTest) {
    //     object.material.color.set('#ff0000')
    // }

    // for(const intersect of intersects) {
    //     intersect.object.material.color.set('#0000ff')
    // }


    raycaster.setFromCamera(mouse, camera)
    const objectsToTest = [object1, object2, object3]
    let intersects = raycaster.intersectObjects(objectsToTest)
    



    for(const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }

    for(const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    if(intersects.length) {
        // Something is hovered
        if(currentIntersect === null) {
            console.log('mouse enter');
        }
        currentIntersect = intersects[0]
    }else {
        // Nothing is hovered
        if(currentIntersect) {
            console.log('mouse leave');
        }
        currentIntersect = null
    }

    // Iintersects with model
    if(model) {
        const intersectsModel = raycaster.intersectObject(model, true)
        if(intersectsModel.length) {
            model.scale.set(1.5, 1.5, 1.5)
        }else {
            model.scale.set(1, 1, 1)
        }
    }





    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()