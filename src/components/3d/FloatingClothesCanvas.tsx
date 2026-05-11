'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = ['#F5F0E8', '#2A2A2A', '#C1440E', '#C9B99A'];

function FabricPanel({ color, phase, y }: { color: string; phase: number; y: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.002;
    meshRef.current.position.y = y + Math.sin(state.clock.getElapsedTime() + phase) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[0, y, 0]}>
      <planeGeometry args={[1.5, 2]} />
      <meshStandardMaterial color={color} transparent opacity={0.88} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[5, 5, 5]} color="white" />
      <pointLight position={[-5, 0, 5]} color="#87CEEB" intensity={0.5} />
      <pointLight position={[0, 0, -5]} color="#C9B99A" intensity={0.3} />
      <FabricPanel color={COLORS[0]} phase={0} y={1} />
      <FabricPanel color={COLORS[1]} phase={1} y={0} />
      <FabricPanel color={COLORS[2]} phase={2} y={-1} />
      <FabricPanel color={COLORS[3]} phase={3} y={-2} />
    </>
  );
}

export function FloatingClothesCanvas() {
  return (
    <div className="absolute inset-0 hidden md:block">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}