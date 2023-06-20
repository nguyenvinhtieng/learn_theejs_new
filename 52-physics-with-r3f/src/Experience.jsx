import { OrbitControls, useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics, RigidBody, Debug, CuboidCollider, BallCollider, CylinderCollider, InstancedRigidBodies } from '@react-three/rapier'
import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


export default function Experience()
{
    const [hitSound, setHitSound] = useState(() => new Audio('./hit.mp3'))
    const cube = useRef()
    const twister = useRef()
    const model = useGLTF("./hamburger.glb")
    const cubes = useRef()
    const cubeCount = 100
    const cubesTransform = useMemo(() => {
        const positions = []
        const rotations = []
        const scales = []
        for(let i= 0; i < cubeCount; i++) {
            positions.push([
                (Math.random() - 0.5) * 8,
                6 + i * 2,
                (Math.random() - 0.5) * 8,
            ])
            rotations.push([
                Math.random(),
                Math.random(),
                Math.random(),
            ])
            const scale = 0.2 + Math.random() * 0.8
            scales.push([scale, scale, scale])
        }
        return { positions, rotations, scales}
    }, [])
    // useEffect(() => {
    //     for(let i= 0; i < cubeCount; i++) {
    //         const matrix = new THREE.Matrix4()
    //         matrix.compose(
    //             new THREE.Vector3(i*2, 0, 0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1, 1, 1)
    //         )
    //         cubes.current.setMatrixAt(i, matrix)
    //     }
    // }, [])

    const cubeJumb = () => {
        const mass = cube.current.mass()
        cube.current.applyImpulse({x: 0, y: 5 * mass, z: 0})
        cube.current.applyTorqueImpulse({
            x: Math.random() - 0.5, 
            y: Math.random() - 0.5, 
            z: Math.random() - 0.5
        })
    }
    useFrame((state)=> {
        const time = state.clock.getElapsedTime()
        const eulerRotation = new THREE.Euler(0, time * 3, 0, 'XYZ')
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)
        twister.current.setNextKinematicRotation(quaternionRotation)

        const angle = time *0.5
        const x = Math.cos(angle)
        const z = Math.sin(angle)
        twister.current.setNextKinematicTranslation({x, y: -0.8, z})

    })

    const collisionEnter = (e) => {
        // hitSound.currentTime = 0
        // hitSound.volume = Math.random()
        // hitSound.play()
    }

    const collisionExit = (e) => {
        // console.log('collisionExit', e);
    }

    const collisionSleeping = (e) => {
        // console.log('collisionSleeping', e);
    }

    const collisionWakeup = (e) => {
        // console.log('collisionWakeup', e);
    }
    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />
        <Physics gravity={[0, - 9.08, 0]}>
            {/* <Debug></Debug> */}
            <RigidBody colliders="ball">
                <mesh castShadow position={ [ -3, 3, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>
            <RigidBody 
                ref={cube} 
                position={[2.5, 2, 0]} // Vị trí
                gravity={1} // Trọng lượng
                restitution={0} // Độ nhảy
                friction={0} // Ma sát
                colliders={false} // Không cho va chạm
                onCollisionEnter={collisionEnter}
                onCollisionExit={collisionExit}
                onSleep={collisionSleeping}
                onWakeup={collisionWakeup}
            >
                <mesh castShadow onClick={cubeJumb}>
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                <CuboidCollider mass={0.5} args={[0.5, 0.5, 0.5]} />
            </RigidBody>
            {/* <RigidBody colliders={false} position={ [ 0, 1, 0 ] } rotation={[Math.PI * 0.5, 0, 0]}>
                <BallCollider args={ [1.5] }></BallCollider>
                <mesh castShadow >
                    <torusGeometry args={ [ 1, 0.5, 16, 32 ] } />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody> */}
            {/* <RigidBody colliders="tri">
                <mesh castShadow position={ [ 0, 1, 0 ] } rotation={[Math.PI * 0.51, 0, 0]}>
                    <torusGeometry args={ [ 1, 0.5, 16, 32 ] } />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody> */}
            {/* <RigidBody>
                <mesh castShadow position={ [ 2, 2, 0 ] }>
                    <boxGeometry args={[3, 2, 1]}/>
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                <mesh castShadow position={ [ 2, 2, 3 ] }>
                    <boxGeometry args={[1, 1, 1]}/>
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody> */}
            
            <RigidBody type='fixed' friction={0}>
                <mesh receiveShadow position-y={ - 1.25 }>
                    <boxGeometry args={ [ 10, 0.5, 10 ] } />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

            <RigidBody
                position={[0, -0.8, 0]}
                friction={0}
                type='kinematicPosition'
                ref={twister}
            >
                <mesh castShadow scale={[0.4, 0.4, 3]}>
                    <boxGeometry />
                    <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>
            <RigidBody position={[0, 4, 0]} colliders={false}>
                <primitive object={model.scene} scale={0.25}/>
                <CylinderCollider args={[0.5, 1.25]}></CylinderCollider>
            </RigidBody>
            <RigidBody type="fixed">
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.25]}/>
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.25]}/>
                <CuboidCollider args={[0.5, 2, 5]} position={[5.25, 1, 0]}/>
                <CuboidCollider args={[0.5, 2, 5]} position={[-5.25, 1, 0]}/>
            </RigidBody>
            <InstancedRigidBodies
                positions={cubesTransform.positions}
                rotations={cubesTransform.rotations}
                scales={cubesTransform.scales}
            >
                <instancedMesh args={[null, null, cubeCount]} ref={cubes} castShadow>
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </instancedMesh>
            </InstancedRigidBodies>
        </Physics>

    </>
}