

const sence = new THREE.Scene();

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
sence.add(cube);


// Sizes
const sizes = {
  width: 800,
  height: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 1.2;
camera.position.x = 1.2;
sence.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas')
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(sence, camera)