import { OrbitControls, Text3D, Center, useMatcapTexture } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const meshMatcapMaterial = new THREE.MeshMatcapMaterial();
const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);

export default function Experience()
{
    const [ matcapTexture ] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256)
    // const [ torusGeometry, setTorusGeometry ] = useState()
    // const [ meshMatcapMaterial, setMeshMatcapMaterial ] = useState()
    const groupRef = useRef()
    const donuts = useRef([])

    useEffect(()=> {
        matcapTexture.encoding = THREE.sRGBEncoding
        matcapTexture.needsUpdate = true

        meshMatcapMaterial.matcap = matcapTexture
        meshMatcapMaterial.needsUpdate = true
    }, [])
    useFrame((_, delta)=> {
        // console.log(groupRef.current);
        // const childrents = groupRef.current.children
        // for (let i = 0; i < childrents.length; i++) {
        //     const child = childrents[i];
        //     child.rotation.x += delta * 0.1
        //     child.rotation.y += delta * 0.1
        // }
        for (let i = 0; i < donuts.current.length ; i++) {
            const child = donuts.current[i];
            child.rotation.x += delta * 0.1
            child.rotation.y += delta * 0.1
        }
    })
    return <>

        <Perf position="top-left" />
        {/* <torusGeometry ref={ setTorusGeometry } args={ [ 1, 0.6, 16, 32 ] } />
        <meshMatcapMaterial ref={setMeshMatcapMaterial} matcap={matcapTexture}  /> */}

        <OrbitControls makeDefault />
        {/* <group ref={ groupRef }> */}
            { [...Array(100)].map((_, index) =>
                <mesh 
                    ref={ ref => donuts.current[index] = ref }
                    key={index}
                    geometry={torusGeometry}
                    material={meshMatcapMaterial}
                    position={ [ 
                        (Math.random() - 0.5) * 10, 
                        (Math.random() - 0.5) * 10, 
                        (Math.random() - 0.5) * 10 
                    ] }
                    scale={ 0.2 * Math.random() + 0.2}
                    rotation={[
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        Math.random() * Math.PI
                    ]}
                >
                </mesh>
            ) }
        {/* </group> */}
        <Center>
            <Text3D 
                font="./fonts/helvetiker_regular.typeface.json"
                material={meshMatcapMaterial}
                fontSize={ 0.75 }
                position={ [ 0, 0, 0 ] }
                height={ 0.2 }
                curveSegments={ 12 }
                bevelEnabled
                bevelThickness={ 0.02 }
                bevelSize={ 0.02 }
                bevelOffset={ 0 }
                bevelSegments={ 5 }
            >
                Hello
            </Text3D>
        </Center>
    </>
}