import { OrbitControls, TransformControls, PivotControls, Html, Text, Float, MeshReflectorMaterial } from '@react-three/drei';
import { useRef } from 'react';

export default function Experience() {
    const cubeRef = useRef();
    const cube2Ref = useRef();

    return <>
        <OrbitControls makeDefault/>
        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />
        <TransformControls position-x={ - 2 }>
            <mesh >
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>
        </TransformControls>

        <mesh position-x={ 2 } scale={ 1.5 } ref={cubeRef} >
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>
        <TransformControls object={cubeRef} mode='rotate'/>

        <PivotControls anchor={[0, 0, 0]} depthTest={false} lineWidth={4}>
            <mesh scale={ 0.5 } ref={cube2Ref}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
                <Html position={[1,1,0]} wrapperClass='label' center distanceFactor={6} occlude={[cubeRef, cube2Ref]} >
                    <h6>That a sphere</h6>
                </Html>
            </mesh>
        </PivotControls>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 } >
            <planeGeometry />
            {/* <meshStandardMaterial color="greenyellow" /> */}
            <MeshReflectorMaterial resolution={512} blur={[1000, 1000]} mixBlur={1} mirror={0.85} color="greenyellow"/>
        </mesh>
        <Float speed={5} floatIntensity={10}>
            <Text
                font='./bangers-v20-latin-regular.woff'
                fontSize={1}
                position-y={2}
                maxWidth={2}
                textAlign='center'
                color={"red"}
                >
                Hello
                <meshNormalMaterial/>
            </Text>
        </Float>
        
    </>
}