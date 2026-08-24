import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './ArrayCourse.css';

// ─── 6 Array Concept Checkpoints as 3D HUMANOID DEMON FIGHTERS ───────────────
const DEMON_CHECKPOINTS_3D = [
  {
    id: 1,
    title: 'Array Basics & Contiguous RAM',
    position: [0, 1.2, -15],
    demonName: 'MEMORY WARRIOR DEMON',
    maxHp: 5,
    isBoss: false,
    color: '#ef4444',
    speaker: 'ARRAY GUIDE',
    dialogue: [
      "DEMON DEFEATED! You slayed District 1: The Memory Warrior Demon!",
      "An ARRAY is a linear data structure stored in consecutive, contiguous memory locations in RAM.",
      "Because all elements sit back-to-back, the CPU calculates memory locations instantly without searching!"
    ],
    code: `// Sequential Memory Allocation
const arr = [10, 20, 30, 40];
// Slot 0 -> Address 0x1000 (Val: 10)
// Slot 1 -> Address 0x1004 (Val: 20)
// Slot 2 -> Address 0x1008 (Val: 30)`
  },
  {
    id: 2,
    title: 'Zero Indexing & O(1) Access',
    position: [0, 1.2, -45],
    demonName: 'INDEX SHADOW DEMON',
    maxHp: 5,
    isBoss: false,
    color: '#3b82f6',
    speaker: 'ARRAY GUIDE',
    dialogue: [
      "DEMON DEFEATED! District 2: Index Shadow Demon banished!",
      "Arrays are ZERO-INDEXED. Index 0 means offset 0 from the base memory address.",
      "Formula: Target_Address = Base_Address + (Index * Element_Byte_Size).",
      "Since address calculation takes 1 math step, array indexing is ALWAYS O(1) Constant Time!"
    ],
    code: `const arr = ['Alpha', 'Beta', 'Gamma'];
console.log(arr[0]); // 'Alpha' -> O(1)
console.log(arr[2]); // 'Gamma' -> O(1)`
  },
  {
    id: 3,
    title: 'Insertion & Deletion Shifting',
    position: [0, 1.2, -75],
    demonName: 'SHIFT BERSERKER DEMON',
    maxHp: 5,
    isBoss: false,
    color: '#f97316',
    speaker: 'ARRAY GUIDE',
    dialogue: [
      "DEMON DEFEATED! District 3: Shift Berserker Demon crushed!",
      "Adding or removing items at the END (push/pop) is fast — O(1).",
      "BUT inserting or deleting in the FRONT or MIDDLE requires SHIFTING all subsequent items right or left!",
      "That element movement overhead makes worst-case insertion/deletion O(n) Linear Time."
    ],
    code: `const arr = [1, 2, 3, 4];
arr.push(5);        // O(1) - Added at end
arr.unshift(0);     // O(n) - Shifted 5 items right!
arr.splice(2, 1);   // O(n) - Removed & shifted left`
  },
  {
    id: 4,
    title: 'Linear vs Binary Search',
    position: [0, 1.2, -105],
    demonName: 'SEARCH STRIKER DEMON',
    maxHp: 5,
    isBoss: false,
    color: '#eab308',
    speaker: 'ARRAY GUIDE',
    dialogue: [
      "DEMON DEFEATED! District 4: Search Striker Demon eliminated!",
      "Linear Search scans item-by-item from index 0 to n-1 -> O(n).",
      "If the array is SORTED, Binary Search cuts the search range in HALF at every single step!",
      "Binary Search speed is O(log n). Finding 1 in 1,000,000 takes only ~20 comparisons!"
    ],
    code: `// Binary Search O(log n)
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = (left + right) >> 1;
    if (arr[mid] === target) return mid;
    arr[mid] < target ? left = mid + 1 : right = mid - 1;
  }
  return -1;
}`
  },
  {
    id: 5,
    title: 'Two Pointer Technique',
    position: [0, 1.2, -135],
    demonName: 'TWIN POINTER DEMON',
    maxHp: 5,
    isBoss: false,
    color: '#8b5cf6',
    speaker: 'ARRAY GUIDE',
    dialogue: [
      "DEMON DEFEATED! District 5: Twin Pointer Demon destroyed!",
      "Place one pointer at Left (index 0) and one at Right (index n-1).",
      "Move pointers toward each other based on comparison conditions.",
      "Solves Target Pair Sum, Palindromes, and Array Reversing in O(n) time with O(1) extra space!"
    ],
    code: `// Two Pointer Target Sum in O(n)
function twoSumSorted(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    let sum = arr[l] + arr[r];
    if (sum === target) return [l, r];
    sum < target ? l++ : r--;
  }
  return [];
}`
  },
  {
    id: 6,
    title: 'Sliding Window Pattern',
    position: [0, 1.2, -165],
    demonName: 'SLIDING WINDOW OVERLORD (FINAL BOSS)',
    maxHp: 7,
    isBoss: true,
    color: '#a855f7',
    speaker: 'ARRAY GUIDE',
    dialogue: [
      "ULTIMATE VICTORY! You slayed the 7-Strike Sliding Window Overlord Boss!",
      "Instead of recalculating overlapping subarray sums from scratch (O(n * k)), slide a window of size K!",
      "Subtract the element exiting on the left, add the new element entering on the right.",
      "Transforms nested loops O(n * k) into a single pass O(n) algorithm!"
    ],
    code: `// Max Sum Subarray of Size K in O(n)
function maxSubarraySum(arr, k) {
  let win = arr.slice(0, k).reduce((a,b)=>a+b, 0);
  let max = win;
  for (let i = k; i < arr.length; i++) {
    win += arr[i] - arr[i - k]; // Slide window
    max = Math.max(max, win);
  }
  return max;
}`
  }
];

// ─── Quiz Questions ──────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    question: 'Why is Array element access O(1) constant time?',
    options: [
      'Arrays search through items automatically',
      'Memory is contiguous so target = Base_Address + Index * Size',
      'JS converts arrays into hash maps',
      'Elements are loaded from disk'
    ],
    correct: 1,
    explanation: 'Contiguous RAM slots allow direct math calculation of the exact memory address in 1 CPU cycle!'
  },
  {
    question: 'What is the time complexity of inserting at index 0 of an array of N items?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
    correct: 2,
    explanation: 'All N existing elements must shift right by 1 index to make room at index 0.'
  },
  {
    question: 'Binary Search on a sorted array of 1,000,000 items takes at most ~how many steps?',
    options: ['1,000,000 steps', '500,000 steps', '20 steps', '100 steps'],
    correct: 2,
    explanation: 'log2(1,000,000) ≈ 20 steps because the search space is halved every iteration!'
  },
  {
    question: 'Which pattern is optimal for Maximum Sum Subarray of size K?',
    options: ['Binary Search', 'Sliding Window', 'Stack Overflow', 'Merge Sort'],
    correct: 1,
    explanation: 'Sliding Window computes subsegment sum changes in O(1) per step, yielding O(N) total runtime.'
  }
];

// ─── 3D PLAYER CHARACTER (WITH DAMAGE FLASH EFFECT) ────────────────────────
function PlayerCharacter3D({ position, rotation, isMoving, isSlashing, isPlayerHit }) {
  const meshRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const swordArmRef = useRef();

  useFrame(({ clock }) => {
    if (isMoving) {
      const t = clock.getElapsedTime() * 10;
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t) * 0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(t) * 0.5;
      if (meshRef.current) meshRef.current.position.y = position[1] + Math.abs(Math.sin(t * 2)) * 0.08;
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (meshRef.current) meshRef.current.position.y = position[1];
    }

    if (swordArmRef.current) {
      if (isSlashing) {
        swordArmRef.current.rotation.z = Math.PI / 4 + Math.sin(clock.getElapsedTime() * 25) * 1.1;
        swordArmRef.current.rotation.x = -Math.PI / 3;
      } else {
        swordArmRef.current.rotation.z = Math.PI / 6;
        swordArmRef.current.rotation.x = 0;
      }
    }
  });

  const bodyColor = isPlayerHit ? '#ef4444' : '#00e5ff';

  return (
    <group ref={meshRef} position={position} rotation={[0, rotation, 0]}>
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.48, 0.48, 0.48]} />
        <meshLambertMaterial color={isPlayerHit ? '#ff0000' : '#f87171'} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.66, 0]}>
        <boxGeometry args={[0.52, 0.14, 0.52]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      {/* Torso / Jacket */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.6, 0.7, 0.3]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Backpack */}
      <mesh position={[0, 0.8, 0.2]}>
        <boxGeometry args={[0.4, 0.45, 0.18]} />
        <meshLambertMaterial color="#3b82f6" />
      </mesh>

      {/* RIGHT ARM HOLDING SWORD */}
      <group ref={swordArmRef} position={[0.38, 0.8, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.16, 0.4, 0.16]} />
          <meshLambertMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0, -0.42, -0.2]}>
          <boxGeometry args={[0.3, 0.05, 0.1]} />
          <meshLambertMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[0, -0.42, -0.8]}>
          <boxGeometry args={[0.05, 0.07, 1.1]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.16, 0.18, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      <mesh ref={rightLegRef} position={[0.16, 0.18, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

// ─── 3D HUMANOID MOVING DEMON FIGHTER (SHADOW FIGHT AI & PATROL) ───────────
function DemonCheckpoint3D({ checkpoint, isDefeated, isHit, playerPos, onDemonAttackPlayer, updateDemonPosition }) {
  const demonGroupRef = useRef();
  const demonArmRef = useRef();
  const demonLegLeftRef = useRef();
  const demonLegRightRef = useRef();

  const demonPos = useRef([...checkpoint.position]);
  const lastAttackTime = useRef(0);
  const patrolDir = useRef(1);

  useFrame(({ clock }) => {
    if (!isDefeated) {
      const now = clock.getElapsedTime();
      const dist = Math.hypot(playerPos[0] - demonPos.current[0], playerPos[2] - demonPos.current[2]);

      let isMoving = false;

      // SHADOW FIGHT AI: If player gets within 14 units, Demon walks/chases player!
      if (dist < 14 && dist > 3.0) {
        isMoving = true;
        const speed = 0.045;
        const dx = playerPos[0] - demonPos.current[0];
        const dz = playerPos[2] - demonPos.current[2];
        const angle = Math.atan2(dx, dz);

        demonPos.current[0] += Math.sin(angle) * speed;
        demonPos.current[2] += Math.cos(angle) * speed;

        if (demonGroupRef.current) {
          demonGroupRef.current.rotation.y = angle;
        }
      } else if (dist >= 14) {
        // Patrol back and forth along X axis
        isMoving = true;
        demonPos.current[0] += patrolDir.current * 0.02;
        if (Math.abs(demonPos.current[0] - checkpoint.position[0]) > 3.5) {
          patrolDir.current *= -1;
        }
        if (demonGroupRef.current) {
          demonGroupRef.current.rotation.y = patrolDir.current > 0 ? Math.PI / 2 : -Math.PI / 2;
        }
      }

      // Update position in shared parent ref for accurate hit detection & health bar rendering
      updateDemonPosition(checkpoint.id, demonPos.current);

      // Update Group Position in Scene
      if (demonGroupRef.current) {
        demonGroupRef.current.position.set(demonPos.current[0], demonPos.current[1], demonPos.current[2]);
      }

      // Walking Leg Animation
      if (isMoving) {
        const t = clock.getElapsedTime() * 10;
        if (demonLegLeftRef.current) demonLegLeftRef.current.rotation.x = Math.sin(t) * 0.5;
        if (demonLegRightRef.current) demonLegRightRef.current.rotation.x = -Math.sin(t) * 0.5;
      }

      // FAST SHADOW FIGHT STRIKE: Demon strikes player every 1.2s when close (< 3.5 units)
      if (dist <= 3.5 && now - lastAttackTime.current > 1.2) {
        lastAttackTime.current = now;
        onDemonAttackPlayer(checkpoint.id);

        if (demonArmRef.current) {
          demonArmRef.current.rotation.x = -Math.PI / 2;
          setTimeout(() => {
            if (demonArmRef.current) demonArmRef.current.rotation.x = 0;
          }, 250);
        }
      }
    }
  });

  if (isDefeated) return null;

  const sizeScale = checkpoint.isBoss ? 1.45 : 1.0;
  const demonJacketColor = isHit ? '#ffffff' : checkpoint.isBoss ? '#7e22ce' : '#dc2626';

  return (
    <group ref={demonGroupRef} scale={[sizeScale, sizeScale, sizeScale]}>
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.48, 0.48, 0.48]} />
        <meshLambertMaterial color="#450a0a" />
      </mesh>
      {/* Glowing Red Eyes */}
      <mesh position={[0.12, 1.45, -0.26]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.12, 1.45, -0.26]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Horns */}
      <mesh position={[-0.22, 1.75, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.08, 0.4, 6]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.22, 1.75, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.08, 0.4, 6]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.6, 0.7, 0.3]} />
        <meshLambertMaterial color={demonJacketColor} />
      </mesh>

      {/* RIGHT ARM WITH DARK SWORD */}
      <group ref={demonArmRef} position={[0.38, 0.8, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.16, 0.4, 0.16]} />
          <meshLambertMaterial color="#450a0a" />
        </mesh>
        <mesh position={[0, -0.42, -0.2]}>
          <boxGeometry args={[0.3, 0.05, 0.1]} />
          <meshLambertMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0, -0.42, -0.8]}>
          <boxGeometry args={[0.05, 0.07, 1.1]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh ref={demonLegLeftRef} position={[-0.16, 0.18, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>
      <mesh ref={demonLegRightRef} position={[0.16, 0.18, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>

      {/* Floating Floor Aura Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.7, 16]} />
        <meshBasicMaterial color={checkpoint.color} side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ─── MESSENGER ABETO CYBERPUNK ANIME STREET ENVIRONMENT ─────────────────────
function StreetEnvironment3D() {
  const fogRef = useRef();

  useFrame(({ clock }) => {
    // Subtle fog color pulse
    if (fogRef.current) {
      const t = clock.getElapsedTime() * 0.3;
      const r = 0.01 + Math.sin(t) * 0.005;
      const b = 0.05 + Math.sin(t * 0.7) * 0.01;
      fogRef.current.color.setRGB(r, 0.02, b);
    }
  });

  const neonColors = ['#00e5ff', '#a855f7', '#f43f5e', '#10b981', '#ff6b9d', '#3b82f6'];

  return (
    <group>
      {/* Scene Fog */}
      <fog ref={fogRef} attach="fog" args={['#030510', 15, 80]} />

      {/* Dark Cyber Road */}
      <mesh position={[0, 0, -90]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 220]} />
        <meshLambertMaterial color="#060a14" />
      </mesh>

      {/* Road Edge Neon Strips (continuous glowing lane markers) */}
      <mesh position={[-5.8, 0.02, -90]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 220]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.4} />
      </mesh>
      <mesh position={[5.8, 0.02, -90]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 220]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.4} />
      </mesh>

      {/* Cyan Neon Center Dashed Lines */}
      {Array.from({ length: 22 }).map((_, i) => (
        <mesh key={`cl-${i}`} position={[0, 0.02, -i * 10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.25, 3.5]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Sidewalks */}
      <mesh position={[-7.5, 0.05, -90]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 220]} />
        <meshLambertMaterial color="#0c1220" />
      </mesh>
      <mesh position={[7.5, 0.05, -90]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 220]} />
        <meshLambertMaterial color="#0c1220" />
      </mesh>

      {/* Sidewalk Edge Glow Lines */}
      <mesh position={[-6.0, 0.06, -90]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 220]} />
        <meshBasicMaterial color="#9d4edd" transparent opacity={0.25} />
      </mesh>
      <mesh position={[6.0, 0.06, -90]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 220]} />
        <meshBasicMaterial color="#9d4edd" transparent opacity={0.25} />
      </mesh>

      {/* Cyberpunk Buildings with Neon Signs & Street Lamps */}
      {Array.from({ length: 12 }).map((_, i) => {
        const z = -i * 17;
        const hLeft = 10 + (i % 4) * 5;
        const hRight = 12 + ((i + 2) % 4) * 4;
        const neonL = neonColors[i % neonColors.length];
        const neonR = neonColors[(i + 3) % neonColors.length];

        return (
          <group key={`bld-${i}`}>
            {/* LEFT BUILDING */}
            <mesh position={[-11, hLeft / 2, z]}>
              <boxGeometry args={[5, hLeft, 9]} />
              <meshLambertMaterial color="#080c18" />
            </mesh>
            {/* Building window glow strips (left) */}
            {Array.from({ length: Math.floor(hLeft / 3) }).map((_, j) => (
              <mesh key={`wl-${i}-${j}`} position={[-8.45, 2 + j * 3, z]}>
                <boxGeometry args={[0.05, 0.6, 1.5]} />
                <meshBasicMaterial color={j % 2 === 0 ? neonL : '#1e293b'} transparent opacity={j % 2 === 0 ? 0.6 : 0.1} />
              </mesh>
            ))}
            {/* LEFT Neon Sign Billboard */}
            <mesh position={[-8.35, hLeft * 0.65, z]}>
              <boxGeometry args={[0.15, 2.5, 1.8]} />
              <meshBasicMaterial color={neonL} />
            </mesh>
            {/* Sign Glow Point Light */}
            <pointLight position={[-8, hLeft * 0.65, z]} color={neonL} intensity={2} distance={10} />

            {/* RIGHT BUILDING */}
            <mesh position={[11, hRight / 2, z]}>
              <boxGeometry args={[5, hRight, 9]} />
              <meshLambertMaterial color="#0a0f1e" />
            </mesh>
            {/* Building window glow strips (right) */}
            {Array.from({ length: Math.floor(hRight / 3) }).map((_, j) => (
              <mesh key={`wr-${i}-${j}`} position={[8.45, 2 + j * 3, z]}>
                <boxGeometry args={[0.05, 0.6, 1.5]} />
                <meshBasicMaterial color={j % 2 === 0 ? neonR : '#1e293b'} transparent opacity={j % 2 === 0 ? 0.6 : 0.1} />
              </mesh>
            ))}
            {/* RIGHT Neon Sign Billboard */}
            <mesh position={[8.35, hRight * 0.65, z]}>
              <boxGeometry args={[0.15, 2.5, 1.8]} />
              <meshBasicMaterial color={neonR} />
            </mesh>
            {/* Sign Glow Point Light */}
            <pointLight position={[8, hRight * 0.65, z]} color={neonR} intensity={2} distance={10} />

            {/* STREET LAMPS — LEFT */}
            {i % 2 === 0 && (
              <group position={[-6.2, 0, z]}>
                {/* Lamp post */}
                <mesh position={[0, 2.2, 0]}>
                  <boxGeometry args={[0.08, 4.4, 0.08]} />
                  <meshLambertMaterial color="#1a1a2e" />
                </mesh>
                {/* Lamp arm */}
                <mesh position={[0.6, 4.2, 0]}>
                  <boxGeometry args={[1.2, 0.06, 0.06]} />
                  <meshLambertMaterial color="#1a1a2e" />
                </mesh>
                {/* Lamp bulb glow */}
                <mesh position={[1.1, 4.0, 0]}>
                  <sphereGeometry args={[0.15, 8, 8]} />
                  <meshBasicMaterial color="#00e5ff" />
                </mesh>
                <pointLight position={[1.1, 3.8, 0]} color="#00e5ff" intensity={4} distance={12} />
              </group>
            )}

            {/* STREET LAMPS — RIGHT */}
            {i % 2 === 1 && (
              <group position={[6.2, 0, z]}>
                <mesh position={[0, 2.2, 0]}>
                  <boxGeometry args={[0.08, 4.4, 0.08]} />
                  <meshLambertMaterial color="#1a1a2e" />
                </mesh>
                <mesh position={[-0.6, 4.2, 0]}>
                  <boxGeometry args={[1.2, 0.06, 0.06]} />
                  <meshLambertMaterial color="#1a1a2e" />
                </mesh>
                <mesh position={[-1.1, 4.0, 0]}>
                  <sphereGeometry args={[0.15, 8, 8]} />
                  <meshBasicMaterial color="#a855f7" />
                </mesh>
                <pointLight position={[-1.1, 3.8, 0]} color="#a855f7" intensity={4} distance={12} />
              </group>
            )}
          </group>
        );
      })}

      {/* Ground Reflection Plane (subtle mirror effect) */}
      <mesh position={[0, -0.01, -90]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 220]} />
        <meshLambertMaterial color="#020408" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}


// ─── 3D Camera & Scene Manager ─────────────────────────────────────────────
function GameScene3D({
  playerPos,
  playerRot,
  isMoving,
  isSlashing,
  isPlayerHit,
  completedCheckpoints,
  demonHpState,
  hitDemonId,
  onDemonAttackPlayer,
  updateDemonPosition
}) {
  const { camera } = useThree();

  useFrame(() => {
    const targetCamX = playerPos[0];
    const targetCamY = playerPos[1] + 4.5;
    const targetCamZ = playerPos[2] + 7.5;

    camera.position.x += (targetCamX - camera.position.x) * 0.12;
    camera.position.y += (targetCamY - camera.position.y) * 0.12;
    camera.position.z += (targetCamZ - camera.position.z) * 0.12;
    camera.lookAt(playerPos[0], playerPos[1] + 1.2, playerPos[2] - 1.5);
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[15, 30, 15]} intensity={1.1} />

      <StreetEnvironment3D />

      {DEMON_CHECKPOINTS_3D.map((cp) => {
        const isDefeated = completedCheckpoints.includes(cp.id);
        const isHit = hitDemonId === cp.id;

        return (
          <DemonCheckpoint3D
            key={cp.id}
            checkpoint={cp}
            isDefeated={isDefeated}
            isHit={isHit}
            playerPos={playerPos}
            onDemonAttackPlayer={onDemonAttackPlayer}
            updateDemonPosition={updateDemonPosition}
          />
        );
      })}

      <PlayerCharacter3D
        position={playerPos}
        rotation={playerRot}
        isMoving={isMoving}
        isSlashing={isSlashing}
        isPlayerHit={isPlayerHit}
      />
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Main Component: 3D Shadow Fight Demon Fighter Course
// ═════════════════════════════════════════════════════════════════════════════
export default function ArrayCourse({ onClose }) {
  const [playerPos, setPlayerPos] = useState([0, 0, 0]);
  const [playerRot, setPlayerRot] = useState(Math.PI);
  const [isMoving, setIsMoving] = useState(false);
  const [isSlashing, setIsSlashing] = useState(false);

  // PLAYER HEALTH: Starts at 10 HP (10 Strikes from Demon = GAME OVER)
  const [playerHp, setPlayerHp] = useState(10);
  const [isPlayerHit, setIsPlayerHit] = useState(false);

  const [completedCheckpoints, setCompletedCheckpoints] = useState([]);
  const [demonHpState, setDemonHpState] = useState({
    1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 7
  });
  const [hitDemonId, setHitDemonId] = useState(null);

  // Store dynamic moving demon positions
  const demonLivePositionsRef = useRef({
    1: [0, 1.2, -15],
    2: [0, 1.2, -45],
    3: [0, 1.2, -75],
    4: [0, 1.2, -105],
    5: [0, 1.2, -135],
    6: [0, 1.2, -165]
  });

  const updateDemonPosition = (id, pos) => {
    demonLivePositionsRef.current[id] = [...pos];
  };

  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [gameState, setGameState] = useState('map'); // 'map' | 'dialogue' | 'quiz' | 'victory' | 'gameover'
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const keysPressed = useRef({});
  const gameLoopRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(k)) {
        keysPressed.current[k] = true;
      }
    };
    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(k)) {
        keysPressed.current[k] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'map') return;

    const SPEED = 0.24;
    const updateMovement = () => {
      let moveZ = 0;
      let moveX = 0;

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) moveZ -= 1;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) moveZ += 1;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) moveX -= 1;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) moveX += 1;

      if (moveX !== 0 || moveZ !== 0) {
        setIsMoving(true);
        let rot = Math.atan2(-moveX, -moveZ);
        setPlayerRot(rot);

        setPlayerPos((prev) => {
          const nextX = Math.max(-5, Math.min(5, prev[0] + moveX * SPEED));
          const nextZ = Math.max(-190, Math.min(5, prev[2] + moveZ * SPEED));
          return [nextX, prev[1], nextZ];
        });
      } else {
        setIsMoving(false);
      }

      gameLoopRef.current = requestAnimationFrame(updateMovement);
    };

    gameLoopRef.current = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState]);

  // PLAYER SLASH ATTACK DEMON (DETERMINED BY DYNAMIC LIVE DEMON POSITION)
  const handleSlash = () => {
    if (gameState !== 'map') return;

    setIsSlashing(true);
    setTimeout(() => setIsSlashing(false), 250);

    DEMON_CHECKPOINTS_3D.forEach((cp) => {
      const livePos = demonLivePositionsRef.current[cp.id] || cp.position;
      const dist = Math.hypot(playerPos[0] - livePos[0], playerPos[2] - livePos[2]);

      // Generous hit distance threshold (5.5 units) so sword hits land on moving demons
      if (dist < 5.5 && !completedCheckpoints.includes(cp.id)) {
        setHitDemonId(cp.id);
        setTimeout(() => setHitDemonId(null), 180);

        setDemonHpState((prev) => {
          const currentHp = prev[cp.id];
          const newHp = currentHp - 1;

          if (newHp <= 0) {
            setTimeout(() => {
              setActiveCheckpoint(cp);
              setDialogueIndex(0);
              setGameState('dialogue');
            }, 200);
          }

          return { ...prev, [cp.id]: Math.max(0, newHp) };
        });
      }
    });
  };

  // DEMON COUNTER-ATTACK PLAYER (Player loses 1 HP)
  const handleDemonAttackPlayer = (demonId) => {
    if (gameState !== 'map') return;

    setIsPlayerHit(true);
    setTimeout(() => setIsPlayerHit(false), 200);

    setPlayerHp((prevHp) => {
      const newHp = prevHp - 1;
      if (newHp <= 0) {
        // PLAYER DIED -> GAME OVER
        setGameState('gameover');
        return 0;
      }
      return newHp;
    });
  };

  // RESTART GAME (Resets Player HP, Demon HPs, and Position)
  const restartGame = () => {
    setPlayerHp(10);
    setPlayerPos([0, 0, 0]);
    setCompletedCheckpoints([]);
    setDemonHpState({ 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 7 });
    setActiveCheckpoint(null);
    setGameState('map');
  };

  const nextDialogue = () => {
    if (!activeCheckpoint) return;
    if (dialogueIndex < activeCheckpoint.dialogue.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      if (!completedCheckpoints.includes(activeCheckpoint.id)) {
        const nextDone = [...completedCheckpoints, activeCheckpoint.id];
        setCompletedCheckpoints(nextDone);

        if (nextDone.length === DEMON_CHECKPOINTS_3D.length) {
          setTimeout(() => setGameState('quiz'), 250);
          return;
        }
      }
      setGameState('map');
      setActiveCheckpoint(null);
    }
  };

  const handleQuizOptionSelect = (idx) => {
    if (quizSubmitted) return;
    setQuizSelected(idx);
  };

  const submitQuizAnswer = () => {
    if (quizSelected === null || quizSubmitted) return;
    setQuizSubmitted(true);
    if (quizSelected === QUIZ_QUESTIONS[quizIndex].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setQuizSelected(null);
      setQuizSubmitted(false);
    } else {
      setGameState('victory');
    }
  };

  return (
    <div className="m-3d-container">
      {/* ── TOP HUD (PLAYER HP & DEMON TRACKER) ─────────────────────────── */}
      <div className="m-hud">
        <div className="m-hud-brand">
          <span className="m-hud-badge">⚔️ SHADOW FIGHT</span>
          <h2>ARRAY CITY · DEMON BATTLE</h2>
        </div>

        {/* PLAYER HEALTH BAR (10 STRIKES MAXIMUM) */}
        <div className="player-hp-hud-box">
          <span className="player-hp-label">YOUR HP:</span>
          <div className="player-hp-hearts">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className={`hp-heart ${i < playerHp ? 'alive' : 'dead'}`}>
                ❤️
              </span>
            ))}
          </div>
          <span className="player-hp-num">{playerHp} / 10</span>
        </div>

        <div className="m-hud-progress">
          <span className="m-progress-lbl">SLAYED:</span>
          <div className="m-stars">
            {DEMON_CHECKPOINTS_3D.map((cp) => (
              <span
                key={cp.id}
                className={`m-star ${completedCheckpoints.includes(cp.id) ? 'done' : ''}`}
              >
                👹
              </span>
            ))}
          </div>
          <span className="m-count">{completedCheckpoints.length} / {DEMON_CHECKPOINTS_3D.length}</span>
        </div>
        <button className="m-close-btn" onClick={onClose}>✕ EXIT</button>
      </div>

      {/* ── 3D CANVAS VIEWPORT ───────────────────────────────────────────── */}
      <div className="m-canvas-wrap" onClick={handleSlash} onTouchStart={handleSlash}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          camera={{ position: [0, 4.5, 7.5], fov: 60 }}
        >
          <GameScene3D
            playerPos={playerPos}
            playerRot={playerRot}
            isMoving={isMoving}
            isSlashing={isSlashing}
            isPlayerHit={isPlayerHit}
            completedCheckpoints={completedCheckpoints}
            demonHpState={demonHpState}
            hitDemonId={hitDemonId}
            onDemonAttackPlayer={handleDemonAttackPlayer}
            updateDemonPosition={updateDemonPosition}
          />
        </Canvas>

        {/* ── FLOATING DEMON HEALTH BARS OVERLAY ───────────────────────── */}
        {DEMON_CHECKPOINTS_3D.map((cp) => {
          if (completedCheckpoints.includes(cp.id)) return null;
          const currentHp = demonHpState[cp.id];
          const dist = Math.hypot(playerPos[0] - cp.position[0], playerPos[2] - cp.position[2]);
          const isNearby = dist < 12;

          if (!isNearby) return null;

          const hpPercent = (currentHp / cp.maxHp) * 100;

          return (
            <div
              key={cp.id}
              className={`demon-hp-bar-overlay ${cp.isBoss ? 'boss-hp-bar' : ''}`}
            >
              <div className="demon-hp-title">
                {cp.isBoss ? '👑 FINAL BOSS: ' : '👹 '}{cp.demonName}
              </div>
              <div className="demon-hp-track">
                <div className="demon-hp-fill" style={{ width: `${hpPercent}%` }} />
              </div>
              <div className="demon-hp-text">
                {currentHp} / {cp.maxHp} HP REMAINING
              </div>
            </div>
          );
        })}

        {/* Side Icons */}
        <div className="m-side-icons">
          <div className="m-icon-box">🎵</div>
          <div className="m-icon-box">👕</div>
          <div className="m-icon-box">🎒</div>
        </div>

        {/* Controls Overlay */}
        <div className="m-controls-hint">
          <div className="m-keys">
            <span className="m-k">W</span>
            <span className="m-k">A</span>
            <span className="m-k">S</span>
            <span className="m-k">D</span>
          </div>
          <span>WASD to Walk · <strong>CLICK to Strike Demon ⚔️ (Dodge their attacks! 10 Hits = Game Over)</strong></span>
        </div>
      </div>

      {/* ── MESSENGER DIALOGUE BOX ───────────────────────────────────────── */}
      {gameState === 'dialogue' && activeCheckpoint && (
        <div className="m-dialogue-overlay">
          <div className="m-dialogue-container">
            <div className="m-speaker-tab">
              <span>{activeCheckpoint.speaker}</span>
            </div>
            <div className="m-dialogue-box">
              <p className="m-dialogue-text">{activeCheckpoint.dialogue[dialogueIndex]}</p>

              {dialogueIndex === activeCheckpoint.dialogue.length - 1 && activeCheckpoint.code && (
                <pre className="m-code-block">{activeCheckpoint.code}</pre>
              )}

              <button className="m-next-btn" onClick={nextDialogue}>
                <div className="m-play-tri" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GAME OVER SCREEN (10 DEMON STRIKES TAKEN) ───────────────────── */}
      {gameState === 'gameover' && (
        <div className="m-dialogue-overlay">
          <div className="gameover-card">
            <div className="gameover-skull">💀</div>
            <h2>YOU DIED!</h2>
            <p className="gameover-sub">The Demons struck you 10 times and defeated you!</p>
            <button className="gameover-restart-btn" onClick={restartGame}>
              🔄 RESTART GAME
            </button>
          </div>
        </div>
      )}

      {/* ── QUIZ MODAL ──────────────────────────────────────────────────── */}
      {gameState === 'quiz' && (
        <div className="m-dialogue-overlay">
          <div className="m-quiz-card">
            <div className="m-quiz-header">
              <h3>🏆 FINAL ARRAY BOSS QUIZ</h3>
              <span>Question {quizIndex + 1} / {QUIZ_QUESTIONS.length}</span>
            </div>
            <div className="m-quiz-body">
              <p className="m-quiz-q">{QUIZ_QUESTIONS[quizIndex].question}</p>
              <div className="m-options">
                {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => {
                  let cls = 'm-opt';
                  if (quizSelected === i) cls += ' sel';
                  if (quizSubmitted) {
                    if (i === QUIZ_QUESTIONS[quizIndex].correct) cls += ' ok';
                    else if (quizSelected === i) cls += ' err';
                  }
                  return (
                    <button key={i} className={cls} onClick={() => handleQuizOptionSelect(i)} disabled={quizSubmitted}>
                      <span className="m-opt-k">{String.fromCharCode(65 + i)}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <div className={`m-expl ${quizSelected === QUIZ_QUESTIONS[quizIndex].correct ? 'ok' : 'err'}`}>
                  <strong>{quizSelected === QUIZ_QUESTIONS[quizIndex].correct ? 'Correct!' : 'Incorrect!'}</strong>
                  <p>{QUIZ_QUESTIONS[quizIndex].explanation}</p>
                </div>
              )}
            </div>
            <div className="m-quiz-footer">
              {!quizSubmitted ? (
                <button className="m-qbtn" onClick={submitQuizAnswer} disabled={quizSelected === null}>SUBMIT ANSWER</button>
              ) : (
                <button className="m-qbtn next" onClick={nextQuizQuestion}>
                  {quizIndex < QUIZ_QUESTIONS.length - 1 ? 'NEXT QUESTION ▶' : 'FINISH COURSE 🏆'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── VICTORY CARD ────────────────────────────────────────────────── */}
      {gameState === 'victory' && (
        <div className="m-dialogue-overlay">
          <div className="m-victory-card">
            <div className="m-vicon">🏆</div>
            <h2>DEMON SLAYER MASTER!</h2>
            <p className="m-vsub">You slayed all 6 Demons & the 7-Strike Overlord Boss!</p>
            <div className="m-vstats">
              <div className="m-vs"><span className="m-vv">6/6</span><span className="m-vl">Demons Slayed</span></div>
              <div className="m-vs"><span className="m-vv">{quizScore}/{QUIZ_QUESTIONS.length}</span><span className="m-vl">Quiz Score</span></div>
              <div className="m-vs"><span className="m-vv">+500 XP</span><span className="m-vl">Reward</span></div>
            </div>
            <button className="m-vbtn" onClick={onClose}>RETURN TO HUB →</button>
          </div>
        </div>
      )}
    </div>
  );
}
