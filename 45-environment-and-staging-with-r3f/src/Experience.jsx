import { useFrame } from '@react-three/fiber'
import { useHelper, OrbitControls, BakeShadows, SoftShadows, AccumulativeShadows, RandomizedLight, ContactShadows, Sky, Environment, Lightformer, Stage } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useControls } from 'leva'

// SoftShadows({
//     frustum: {3.75},
//     size: {0.005},
//     near: {9.5},
//     samples: {17},
//     rings: {11}
// })

export default function Experience()
{
    const directionalLight = useRef()
    const cube = useRef()
    
    const { color, opacity, blur } = useControls("Shadow", {
        color: "#316d39",
        opacity: { value: 0.8, min: 0, max: 1 },
        blur: { value: 0.8, min: 0, max: 1 }
    })
    const  { sunPosition } = useControls("Sky", {
        sunPosition: {value: [0, 1, 0], step: 0.1}
     })
    const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } = useControls("Lighting", {
        envMapIntensity: {value: 1, min: 0, max: 10},
        envMapHeight: {value: 7, min: 0, max: 10},
        envMapRadius: {value: 28, min: 0, max: 100},
        envMapScale: {value: 100, min: 0, max: 1000},
    })
    useHelper(directionalLight, THREE.DirectionalLightHelper, 0.2, "hotpink")

    useFrame((state, delta) =>
    {   
        cube.current.position.x = Math.sin(state.clock.getElapsedTime()) * 2
        cube.current.rotation.y += delta * 0.2
    })

    return <>
        {/* <BakeShadows /> */}
        {/* <Environment 
            // background
            ground={{
                height: envMapHeight,
                radius: envMapRadius,
                scale: envMapScale
            }}
            // files={[
            //     "./environmentMaps/2/px.jpg",
            //     "./environmentMaps/2/nx.jpg",
            //     "./environmentMaps/2/py.jpg",
            //     "./environmentMaps/2/ny.jpg",
            //     "./environmentMaps/2/pz.jpg",
            //     "./environmentMaps/2/nz.jpg",
            // ]}
            // files="./environmentMaps/the_sky_is_on_fire_2k.hdr"
            preset='sunset'
            // resolution={1024}

        > */}
            {/* <color args={["blue"]} attach="background" /> */}
            {/* <mesh position-z={-5} scale={10} >
                <planeGeometry/>
                <meshBasicMaterial color="red"/>
            </mesh> */}
            {/* <Lightformer position-z={-5} scale={10} intensity={10} form="ring"></Lightformer> */}
        {/* </Environment> */}

        {/* <Perf position="top-left" /> */}
        {/* <color args={["#fffff"]} attach="background"/> */}

        <OrbitControls makeDefault />

        {/* <directionalLight 
            position={ sunPosition } 
            intensity={ 1.5 } 
            ref={directionalLight} 
            castShadow
            shadow-mapSize={ [1024, 1024] }
            shadow-camera-far={ 50 }
            shadow-camera-left={ -10 }
            shadow-camera-right={ 10 }
            shadow-camera-top={ 10 }
            shadow-camera-bottom={ -10 }
            shadow-camera-near={ 0.1 }
        /> */}
        {/* <ambientLight intensity={ 0.5 } /> */}
        {/* <ContactShadows
            position={[0, -0.99, 0]}
            scale={10}
            resolution={512}
            color={color}
            opacity={opacity}
            blur={blur}
            frames={1}
        ></ContactShadows> */}
        {/* <AccumulativeShadows 
            scale={10}
            position={[0, -0.99, 0]}
            color='#316d39'
            opacity={0.8}
            frames={Infinity}
            blend={100}
            temporal
        >
            <RandomizedLight 
                amount={8}
                radius={1}
                ambient={0.5}
                intensity={1}
                bias={0.001}
            position={[1,2,3]}></RandomizedLight>
        </AccumulativeShadows> */}


        {/* <Sky sunPosition={sunPosition} /> */}
        {/* <mesh  position-x={ - 2 } castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity}/>
        </mesh>

        <mesh ref={ cube } position-x={ 2 } scale={ 1.5 } castShadow>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple"  envMapIntensity={envMapIntensity}/>
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 } receiveShadow>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow"  envMapIntensity={envMapIntensity}/>
        </mesh> */}
        
        <Stage 
            shadows={{type: "contact", opacity: 0.8, width: 512, height: 512, blur: 1, far: 10, frames: 1}}
            environment="sunset"
        >
        <mesh  position-x={ - 2 } castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity}/>
        </mesh>

        <mesh ref={ cube } position-x={ 2 } scale={ 1.5 } castShadow>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple"  envMapIntensity={envMapIntensity}/>
        </mesh>

        </Stage>

    </>
}