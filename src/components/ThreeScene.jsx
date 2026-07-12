import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BackgroundStars, TechNode } from './ThreeModels';

// Camera controller that tracks window scroll and interpolates position/rotation
const CameraController = () => {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Keyframes for the camera path corresponding to each page section
  const path = useMemo(() => {
    return {
      positions: [
        new THREE.Vector3(0, 0, 4.5),       // Section 0: Home (Center)
        new THREE.Vector3(1.8, -6, 2.5),    // Section 1: Events (Right)
        new THREE.Vector3(-1.8, -12, 2.5),  // Section 2: Hackathons (Left)
        new THREE.Vector3(0.5, -18.2, 2.0),  // Section 3: Puzzles (Center-ish)
        new THREE.Vector3(2.5, -24, 3.0),   // Section 4: Learning (Right-ish)
      ],
      targets: [
        new THREE.Vector3(0, 0, 0),         // Look at Home Core
        new THREE.Vector3(4, -6, -4),       // Look at Events Rings
        new THREE.Vector3(-5, -12, -3),     // Look at Hackathons Cube
        new THREE.Vector3(0, -18, -4),      // Look at Puzzles Octahedron
        new THREE.Vector3(5, -24, 0),       // Look at Learning Nucleus
      ],
    };
  }, []);

  useFrame((state) => {
    // 1. Calculate the overall scroll fraction (0 to 1)
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY;
    const t = scrollHeight > 0 ? scrollY / scrollHeight : 0;

    // 2. Map t [0..1] to index ranges [0..4]
    const floatIndex = t * 4;
    const baseIndex = Math.floor(floatIndex);
    const nextIndex = Math.min(baseIndex + 1, 4);
    const localRatio = floatIndex - baseIndex;

    // 3. Interpolate between current section and next section
    const targetPos = new THREE.Vector3().lerpVectors(
      path.positions[baseIndex],
      path.positions[nextIndex],
      localRatio
    );

    const targetLook = new THREE.Vector3().lerpVectors(
      path.targets[baseIndex],
      path.targets[nextIndex],
      localRatio
    );

    // 4. Smoothly ease (lerp) the actual camera towards the target path values
    state.camera.position.lerp(targetPos, 0.05);
    currentLookAt.current.lerp(targetLook, 0.05);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
};

const ThreeScene = () => {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#9d4edd" />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />

        {/* Cinematic Camera Controller */}
        <CameraController />

        {/* Starfield Backdrop */}
        <BackgroundStars />

        {/* 3D Tech Nodes mapped to section heights */}
        <TechNode position={[4, -6, -4]} type="rings" color="#9d4edd" scale={1.2} />

        {/* Hackathons Node */}
        <TechNode position={[-5, -12, -3]} type="nestedCubes" color="#00ffff" scale={1.2} />

        {/* Puzzles Node */}
        <TechNode position={[0, -18, -4]} type="octahedron" color="#9d4edd" scale={1.1} />

        {/* Learning Node */}
        <TechNode position={[5, -24, 0]} type="learningCloud" color="#00ffff" scale={1.1} />

        {/* Optional: subtle grid wires linking nodes down the scroll path */}
        <gridHelper args={[60, 60, '#3a1d5d', '#130d22']} position={[0, -12, -8]} rotation={[Math.PI / 2, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
