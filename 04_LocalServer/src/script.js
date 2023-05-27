import * as THREE from "three"

const sence = new THREE.Scene()

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
sence.add(cube)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
})
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.render(sence, camera)