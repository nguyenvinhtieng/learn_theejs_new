import { extend, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CustomObject from './CustomObject'

extend({ OrbitControls })

export default function Experience() {
  const {camera, gl} = useThree()
  const cubeRef = useRef()
  const sphereRef = useRef()
  const groupRef = useRef()

  useFrame((state, delta) => {
    // cubeRef.current.rotation.y += 0.01
    // sphereRef.current.position.y = Math.abs(Math.sin(delta) * 2)
    // state.camera.position.x = Math.sin(state.clock.elapsedTime) * 8
    // state.camera.position.z = Math.cos(state.clock.elapsedTime) * 8
    // state.camera.lookAt(0,0,0)
    groupRef.current.rotation.y += 0.01
  })

  return (
    <>
      <axesHelper args={[5]} />
      {/* <orbitControls args={[camera, gl.domElement]}/> */}

      <directionalLight intensity={ 0.5 } position={[1,2,3]}/>

      <ambientLight intensity={ 0.2 } />
      <group ref={groupRef}>
        <mesh ref={sphereRef} position-x={ - 2 }>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh ref={cubeRef} rotation-y={ Math.PI * 0.25 } position-x={ 2 } scale={ 1.5 }>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>

      <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <CustomObject></CustomObject>
    </>
  )
}
