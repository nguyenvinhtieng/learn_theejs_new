import { useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, meshBounds } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export default function Experience()
{
    const cube = useRef()
    const sphere = useRef()
    const model = useGLTF("./hamburger.glb")

    useFrame((state, delta) =>
    {
        cube.current.rotation.y += delta * 0.2
    })

    const eventHandler = (event) => {
        event.stopPropagation()

        cube.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 50%)`)
    }
    const sphereEventHandler = (event) => {
        event.stopPropagation()
        sphere.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 50%)`)
    }
    const hamburgerEventHandler = (event) => {
        console.log(event.object.name);
        event.stopPropagation()
    }

    return <>

        <OrbitControls makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <mesh ref={sphere} position-x={ - 2 } onClick={sphereEventHandler}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh 
            raycast={meshBounds}
            ref={ cube } 
            position-x={ 2 } 
            scale={ 1.5 } 
            onClick={eventHandler}
            onPointerEnter={()=> document.body.style.cursor = 'pointer'}
            onPointerLeave={()=> document.body.style.cursor = 'auto'}
        >
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

        <primitive 
            object={ model.scene } 
            position-y={ 0.25 } 
            scale={0.25}
            onClick={hamburgerEventHandler}
        />

    </>
}