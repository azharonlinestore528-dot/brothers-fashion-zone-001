'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus } from '@react-three/drei';
import * as THREE from 'three';

function ClothMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const count = 64;
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3, 4, count, count);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const pinTop = y > 1.8;
      if (!pinTop) {
        const wave = Math.sin(time * 2 + x * 3) * 0.15;
        const wave2 = Math.cos(time * 1.5 + y * 2) * 0.1;
        pos.setZ(i, wave + wave2);
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#C9B99A" side={THREE.DoubleSide} />
    </mesh>
  );
}

function FloatingRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1.current) ring1.current.rotation.y += 0.003;
    if (ring2.current) ring2.current.rotation.y -= 0.002;
    if (ring3.current) ring3.current.rotation.y += 0.004;
  });

  return (
    <>
      <Torus ref={ring1} args={[1.2, 0.02, 16, 100]} position={[-1, 0.5, 1]}>
        <meshStandardMaterial color="#C9B99A" wireframe />
      </Torus>
      <Torus ref={ring2} args={[0.8, 0.02, 16, 100]} position={[1, -0.5, 0.5]}>
        <meshStandardMaterial color="#FFD600" wireframe />
      </Torus>
      <Torus ref={ring3} args={[1.5, 0.015, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#C9B99A" wireframe opacity={0.5} transparent />
      </Torus>
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} />
      <pointLight position={[-5, 0, 5]} color="#FFD600" intensity={0.5} />
      <ClothMesh />
      <FloatingRings />
    </>
  );
}

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}