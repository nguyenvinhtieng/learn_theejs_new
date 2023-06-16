import * as THREE from 'three';
import { useRef, useMemo, useEffect } from 'react';

export default function CustomObject() {
  const geometryRef = useRef();

  const verticesCount = 10 * 3;

  const positions = useMemo(()=> {
    const positions = new Float32Array(verticesCount * 3);
    const color = new Float32Array(verticesCount * 3);
  
    for(let i = 0; i < verticesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
  
      color[i * 3 + 0] = Math.random();
      color[i * 3 + 1] = Math.random();
      color[i * 3 + 2] = Math.random();
    }

    return positions;
  }, [])

  useEffect(() => {
    geometryRef.current.computeVertexNormals()
  }, [])

  return <mesh>
    <bufferGeometry ref={geometryRef}>
      <bufferAttribute 
        attach="attributes-position" 
        count={verticesCount} 
        itemSize={3} 
        array={positions}
        
      />
    </bufferGeometry>
    <meshStandardMaterial color="red" side={THREE.DoubleSide} />
  </mesh>
}
