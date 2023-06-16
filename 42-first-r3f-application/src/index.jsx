import './style.css'
import ReactDOM from 'react-dom/client'
import Experience from './Experience'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
const root = ReactDOM.createRoot(document.querySelector('#root'))
 
root.render(
    <Canvas
        // flat

        gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputEncoding: THREE.sRGBEncoding
        }}
        // orthographic
        camera={ {
            fov: 45,
            // zoom: 100,
            position: [3,2,10],
            near: 0.1,
            far: 100
        } }
    >
        <Experience></Experience>
    </Canvas>
)