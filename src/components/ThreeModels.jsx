import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// Rotating particle starfield for the Cosmos theme
export const BackgroundStars = () => {
  const starsRef = useRef();

  useFrame((state) => {
    if (starsRef.current) {
      // Slowly rotate the stars to create a sense of drift
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
      starsRef.current.rotation.x = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1.5} />
    </group>
  );
};

// Main floating interactive tech nodes
export const TechNode = ({ position, type, color, scale = 1 }) => {
  const meshRef = useRef();
  const outerRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const explodeRef = useRef(0);

  // Define paths for deconstruction
  const path1 = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.3, -0.8, 0),
    new THREE.Vector3(-0.6, 0.8, 0),
    new THREE.Vector3(0.5, -0.8, 0),
    new THREE.Vector3(1.2, 0.8, 0)
  ]), []);

  const path2 = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.8, -0.8, 0.1),
    new THREE.Vector3(-0.1, 0.8, 0.1),
    new THREE.Vector3(1.0, -0.8, 0.1),
    new THREE.Vector3(1.7, 0.8, 0.1)
  ]), []);

  // Split paths into blocks (similar to the igloo block elements)
  const blocks = useMemo(() => {
    const list = [];
    const N = 12; // Number of blocks per curve segment

    // Sample Curve 1 (Light Blue)
    const pts1 = path1.getPoints(N);
    pts1.forEach((pt, i) => {
      const basePos = pt.clone();
      const dir = basePos.clone().normalize();
      const randomOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      );
      list.push({
        id: `l-${i}`,
        basePos,
        dir,
        randomOffset,
        color: '#2196f3',
        emissive: '#00e5ff',
        size: 0.15 + Math.random() * 0.04
      });
    });

    // Sample Curve 2 (Dark Blue)
    const pts2 = path2.getPoints(N);
    pts2.forEach((pt, i) => {
      const basePos = pt.clone();
      const dir = basePos.clone().normalize();
      const randomOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      );
      list.push({
        id: `d-${i}`,
        basePos,
        dir,
        randomOffset,
        color: '#0d47a1',
        emissive: '#03045e',
        size: 0.15 + Math.random() * 0.04
      });
    });

    // Bottom-Left Dot
    const dot1Pos = new THREE.Vector3(-1.3, -1.3, 0.05);
    list.push({
      id: 'dot1',
      basePos: dot1Pos,
      dir: dot1Pos.clone().normalize(),
      randomOffset: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2),
      color: '#00e5ff',
      emissive: '#00e5ff',
      size: 0.18,
      isDot: true
    });

    // Top-Right Dot
    const dot2Pos = new THREE.Vector3(1.7, 1.3, 0.05);
    list.push({
      id: 'dot2',
      basePos: dot2Pos,
      dir: dot2Pos.clone().normalize(),
      randomOffset: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2),
      color: '#00e5ff',
      emissive: '#00e5ff',
      size: 0.18,
      isDot: true
    });

    return list;
  }, [path1, path2]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Smoothly scale on hover
    const targetScale = hovered ? scale * 1.25 : scale;
    if (groupRef.current) {
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1);
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.1);
      groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.1);
    }

    if (type === 'nexusLogo' && meshRef.current) {
      // Periodic deconstruction cycle (explodes and implodes naturally over time)
      // and goes to full deconstruction/explosion on hover!
      const baseExplode = 0.12 + Math.sin(elapsed * 1.2) * 0.12;
      const targetExplode = hovered ? 0.95 : baseExplode;
      explodeRef.current = THREE.MathUtils.lerp(explodeRef.current, targetExplode, 0.08);

      const meshes = meshRef.current?.children;
      if (meshes) {
        blocks.forEach((block, idx) => {
          const mesh = meshes[idx];
          if (mesh) {
            const t = explodeRef.current;

            // Outward displacement vector
            const offset = block.dir.clone().multiplyScalar(t * 1.6).add(block.randomOffset.clone().multiplyScalar(t * 0.6));
            mesh.position.copy(block.basePos).add(offset);

            // Floating wiggle
            mesh.position.y += Math.sin(elapsed * 1.5 + idx) * 0.02;

            // Add chaotic rotation during explosion
            mesh.rotation.x = elapsed * 0.25 + t * idx * 0.3;
            mesh.rotation.y = elapsed * 0.35 + t * idx * 0.2;
          }
        });
      }
    } else if (meshRef.current) {
      // Base rotations for other shapes
      const speed = hovered ? 0.8 : 0.2;
      meshRef.current.rotation.x = elapsed * speed;
      meshRef.current.rotation.y = elapsed * (speed * 1.5);
    }

    if (outerRef.current) {
      // Outer shell counter-rotation
      outerRef.current.rotation.y = -elapsed * 0.15;
      outerRef.current.rotation.z = elapsed * 0.1;

      // Floating oscillation
      outerRef.current.position.y = Math.sin(elapsed + position[0]) * 0.15;
    }
  });

  const renderGeometry = () => {
    switch (type) {
      case 'nexusLogo': { // Nexus 3D Interactive Logo
        return (
          <group ref={outerRef}>
            <group ref={meshRef}>
              {blocks.map((block) => (
                <mesh key={block.id} position={block.basePos}>
                  {block.isDot ? (
                    <sphereGeometry args={[block.size, 16, 16]} />
                  ) : (
                    <boxGeometry args={[block.size, block.size, block.size]} />
                  )}
                  <meshStandardMaterial
                    color={block.color}
                    emissive={block.emissive}
                    emissiveIntensity={hovered ? 2.5 : 1.3}
                    roughness={0.1}
                    metalness={0.9}
                  />
                </mesh>
              ))}
            </group>
          </group>
        );
      }

      case 'torusKnot': // Hero Node (glowing core)
        return (
          <>
            <mesh ref={meshRef}>
              <torusKnotGeometry args={[0.8, 0.25, 120, 16]} />
              <meshStandardMaterial
                color={color}
                wireframe
                emissive={color}
                emissiveIntensity={1.5}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
            <mesh ref={outerRef}>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                wireframe
                transparent
                opacity={0.08}
              />
            </mesh>
          </>
        );

      case 'rings': // Events Node (nested timeline rings)
        return (
          <group ref={outerRef}>
            {/* Inner rotating torus */}
            <mesh ref={meshRef}>
              <torusGeometry args={[0.8, 0.12, 16, 100]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.2}
                roughness={0.2}
              />
            </mesh>
            {/* Outer ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.2, 0.05, 8, 100]} />
              <meshStandardMaterial
                color="#00ffff"
                wireframe
                emissive="#00ffff"
                emissiveIntensity={0.8}
              />
            </mesh>
            {/* Orbiting small tech sphere */}
            <mesh position={[1.5, 0, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
            </mesh>
          </group>
        );

      case 'nestedCubes': // Hackathon Node (futuristic compiler cube)
        return (
          <group ref={outerRef}>
            <mesh ref={meshRef}>
              <boxGeometry args={[1.1, 1.1, 1.1]} />
              <meshStandardMaterial
                color={color}
                wireframe
                emissive={color}
                emissiveIntensity={1.8}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.5}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[1.6, 1.6, 1.6]} />
              <meshStandardMaterial
                color="#ffffff"
                wireframe
                transparent
                opacity={0.05}
              />
            </mesh>
          </group>
        );

      case 'octahedron': // Puzzle Node (secure morphing core)
        return (
          <group ref={outerRef}>
            <mesh ref={meshRef}>
              <octahedronGeometry args={[0.9]} />
              <meshStandardMaterial
                color={color}
                wireframe
                emissive={color}
                emissiveIntensity={2}
                roughness={0}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial
                color="#00ffff"
                transparent
                opacity={0.3}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
          </group>
        );

      case 'learningCloud': // Learning Node (central nucleus with orbiting elements)
        return (
          <group ref={outerRef}>
            {/* Nucleus */}
            <mesh ref={meshRef}>
              <dodecahedronGeometry args={[0.7]} />
              <meshStandardMaterial
                color={color}
                wireframe
                emissive={color}
                emissiveIntensity={1.5}
              />
            </mesh>
            {/* Orbital ring */}
            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
              <torusGeometry args={[1.4, 0.03, 8, 64]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
            </mesh>
            {/* Satellite nodes */}
            <mesh position={[1.4 * Math.cos(0), 0, 1.4 * Math.sin(0)]}>
              <octahedronGeometry args={[0.15]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
            </mesh>
            <mesh position={[1.4 * Math.cos(Math.PI), 0, 1.4 * Math.sin(Math.PI)]}>
              <tetrahedronGeometry args={[0.15]} />
              <meshStandardMaterial color="#9d4edd" emissive="#9d4edd" emissiveIntensity={1} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh ref={meshRef}>
            <boxGeometry />
            <meshStandardMaterial color={color} />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[scale, scale, scale]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { setHovered(false); }}
    >
      {renderGeometry()}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Mouse-driven Nexus N particle assembly
// Particles start scattered; moving cursor to screen center assembles the logo
// ─────────────────────────────────────────────────────────────────────────────
export const NexusParticles = () => {
  const CURVE_COUNT = 140;   // particles per curve segment
  const DOT_COUNT = 2;     // accent dot particles

  // ── Target positions: sample points along the Nexus logo curves ─────────
  const path1 = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.3, -0.9, 0),
    new THREE.Vector3(-0.6, 0.9, 0),
    new THREE.Vector3(0.5, -0.9, 0),
    new THREE.Vector3(1.2, 0.9, 0),
  ]), []);

  const path2 = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.8, -0.9, 0.08),
    new THREE.Vector3(-0.1, 0.9, 0.08),
    new THREE.Vector3(1.0, -0.9, 0.08),
    new THREE.Vector3(1.7, 0.9, 0.08),
  ]), []);

  const targets1 = useMemo(() => path1.getPoints(CURVE_COUNT - 1), [path1]);
  const targets2 = useMemo(() => path2.getPoints(CURVE_COUNT - 1), [path2]);

  const dotTargets = useMemo(() => [
    new THREE.Vector3(-1.3, -1.4, 0.05),
    new THREE.Vector3(1.7, 1.4, 0.05),
  ], []);

  // ── Random scattered start positions ────────────────────────────────────
  const randoms1 = useMemo(() => Array.from({ length: CURVE_COUNT }, () => new THREE.Vector3(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 6,
  )), []);

  const randoms2 = useMemo(() => Array.from({ length: CURVE_COUNT }, () => new THREE.Vector3(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 6,
  )), []);

  const dotRandoms = useMemo(() => [
    new THREE.Vector3(-5, 4, 2),
    new THREE.Vector3(5, -4, -2),
  ], []);

  // ── Refs ────────────────────────────────────────────────────────────────
  const mesh1 = useRef();
  const mesh2 = useRef();
  const dotMesh = useRef();
  const groupRef = useRef();                      // parent group for tilt
  const progress = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Normalized mouse: (0,0)=center, range -1..1
  const mouseRef = useRef({ x: 1, y: 1 });       // start away → scattered

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // ── Assembly progress (distance from screen center) ────────────────
    const rawDist = Math.sqrt(mouseRef.current.x ** 2 + mouseRef.current.y ** 2);
    const targetProgress = 1 - THREE.MathUtils.clamp((rawDist - 0.15) / 0.40, 0, 1);
    const lerpSpeed = targetProgress > progress.current ? 0.10 : 0.04;
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress, lerpSpeed);

    const t = progress.current;
    const scatter = 1 - t;

    // ── Floating offsets (kick in only when assembled) ─────────────────
    const floatY = Math.sin(elapsed * 1.1) * 0.10 * t;
    const floatX = Math.sin(elapsed * 0.6) * 0.03 * t;
    const floatZ = Math.cos(elapsed * 0.9) * 0.04 * t;

    // ── Cursor → 3D space projection  (camera z=5, fov=50) ────────────
    const fovHalfRad = (50 * Math.PI) / 180 / 2;
    const halfH = Math.tan(fovHalfRad) * 5;     // ≈ 2.33
    const aspect = window.innerWidth / window.innerHeight;
    const mouse3D = {
      x: mouseRef.current.x * halfH * aspect,
      y: -mouseRef.current.y * halfH,              // flip Y (screen vs 3D)
    };

    // Interaction strength: quadratic, only meaningful near full assembly
    const interact = t * t;

    // ── Group tilt: parallax when assembled ────────────────────────────
    if (groupRef.current) {
      const tiltX = -mouseRef.current.y * 0.28 * t;
      const tiltY = mouseRef.current.x * 0.28 * t;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tiltX, 0.06);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, tiltY, 0.06);
    }

    // ── Helper: update one InstancedMesh ──────────────────────────────
    const updateMesh = (mesh, targets, randoms) => {
      if (!mesh.current) return;
      targets.forEach((target, i) => {
        const r = randoms[i];

        // Base position: lerp scatter → assembled
        let px = r.x + (target.x - r.x) * t;
        let py = r.y + (target.y - r.y) * t;
        let pz = r.z + (target.z - r.z) * t;

        // Gentle drift when scattered
        px += Math.sin(elapsed * 0.9 + i * 0.4) * 0.06 * scatter;
        py += Math.cos(elapsed * 0.7 + i * 0.3) * 0.06 * scatter;

        // Floating oscillation when assembled
        py += floatY;
        px += floatX;
        pz += floatZ;

        // ── Cursor ripple / repulsion on assembled logo ────────────
        if (interact > 0.05) {
          const dx = px - mouse3D.x;
          const dy = py - mouse3D.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const repelR = 0.65;
          if (dist < repelR) {
            const force = ((repelR - dist) / repelR) * 0.55 * interact;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
            pz += 0.18 * interact * ((repelR - dist) / repelR); // push forward
          }
        }

        dummy.position.set(px, py, pz);
        const s = 0.5 + t * 0.7;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      });
      mesh.current.instanceMatrix.needsUpdate = true;
    };

    updateMesh(mesh1, targets1, randoms1);
    updateMesh(mesh2, targets2, randoms2);

    // ── Accent dots ───────────────────────────────────────────────────
    if (dotMesh.current) {
      dotTargets.forEach((target, i) => {
        const r = dotRandoms[i];
        let px = r.x + (target.x - r.x) * t;
        let py = r.y + (target.y - r.y) * t + floatY;
        let pz = r.z + (target.z - r.z) * t + floatZ;

        // Dots repel too
        if (interact > 0.05) {
          const dx = px - mouse3D.x;
          const dy = py - mouse3D.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const repelR = 0.5;
          if (dist < repelR) {
            const force = ((repelR - dist) / repelR) * 0.6 * interact;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
        }

        dummy.position.set(px, py, pz);
        const s = 0.6 + t * 0.6;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        dotMesh.current.setMatrixAt(i, dummy.matrix);
      });
      dotMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Curve 1 — Light Blue particles */}
      <instancedMesh ref={mesh1} args={[null, null, CURVE_COUNT]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial
          color="#2196f3"
          emissive="#00e5ff"
          emissiveIntensity={2.2}
          roughness={0.1}
          metalness={0.8}
        />
      </instancedMesh>

      {/* Curve 2 — Dark Blue particles */}
      <instancedMesh ref={mesh2} args={[null, null, CURVE_COUNT]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial
          color="#0d47a1"
          emissive="#1565c0"
          emissiveIntensity={2.2}
          roughness={0.1}
          metalness={0.8}
        />
      </instancedMesh>

      {/* Accent dot particles — Cyan */}
      <instancedMesh ref={dotMesh} args={[null, null, DOT_COUNT]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={3.2}
        />
      </instancedMesh>
    </group>
  );
};
