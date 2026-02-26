"use client";

import { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  PerspectiveCamera,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

const MM_TO_M = 0.001;
const CHASSIS_HEIGHT = 1.1;
const CABIN_LENGTH = 2.8;
const HITCH_GAP = 0.6;

const GET_TRUCK_CONFIG = (depth: number) => {
  if (depth < 4500) {
    return { type: "SMALL", wheels: 1, cabinScale: 0.7, cabinOffset: 0.2 }; // 1 rear axle (2 wheels)
  } else if (depth < 8500) {
    return { type: "MEDIUM", wheels: 2, cabinScale: 0.85, cabinOffset: 0.4 }; // 2 rear axles (4 wheels)
  } else {
    return { type: "LARGE", wheels: 3, cabinScale: 1.0, cabinOffset: 0.6 }; // 3 rear axles (6 wheels)
  }
};
// --- Sub-components ---

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.45, 0.45, 0.4, 32]} />
        <meshStandardMaterial color="#111" roughness={1} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.42, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function TractorUnit({ width, depth, config }: any) {
  const w = width * MM_TO_M;
  const d = depth * MM_TO_M;
  const { cabinScale } = config;

  const trailerFrontZ = -d / 2;
  const cabinCenterZ =
    trailerFrontZ - HITCH_GAP - (CABIN_LENGTH * cabinScale) / 2;

  return (
    <group
      position={[0, 0, cabinCenterZ]}
      rotation={[0, Math.PI, 0]}
      scale={cabinScale}
    >
      {/* Chassis */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[w * 1.1, 1.0, CABIN_LENGTH]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Cab Body */}
      <mesh position={[0, 2.1, -0.2]}>
        <boxGeometry args={[w, 2.0, CABIN_LENGTH * 0.7]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 2.4, 0.8]}>
        <boxGeometry args={[w * 0.9, 1.1, 0.05]} />
        <meshStandardMaterial color="#000" transparent opacity={0.8} />
      </mesh>
      <Wheel position={[w / 2, 0.5, 0.8]} />
      <Wheel position={[-w / 2, 0.5, 0.8]} />
    </group>
  );
}

function Trailer({ width, height, depth, config }: any) {
  const w = width * MM_TO_M;
  const h = height * MM_TO_M;
  const d = depth * MM_TO_M;

  // Generate axles based on config wheels count
  const axles = Array.from({ length: config.wheels }, (_, i) => i * 1.1);

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, CHASSIS_HEIGHT - 0.05, 0]}>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Ghost Container */}
      <mesh position={[0, CHASSIS_HEIGHT + h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Edges */}
      <lineSegments position={[0, CHASSIS_HEIGHT + h / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color="#475569" transparent opacity={0.5} />
      </lineSegments>

      {/* Dynamic Axles */}
      <group position={[0, 0.5, 0]}>
        {axles.map((zOffset, i) => (
          <group key={i} position={[0, 0, d / 2 - 1.2 - zOffset]}>
            <Wheel position={[w / 2, 0, 0]} />
            <Wheel position={[-w / 2, 0, 0]} />
          </group>
        ))}
      </group>
    </group>
  );
}

// --- Main Visualization ---

export default function TruckVisualization({ vehicle, packedItems }: any) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // Compute config based on current vehicle dimensions
  const config = useMemo(
    () => GET_TRUCK_CONFIG(vehicle.depth),
    [vehicle.depth],
  );

  if (!isClient)
    return (
      <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-xl" />
    );

  const truckLengthM = vehicle.depth * MM_TO_M;

  return (
    <div className="w-full h-full min-h-[600px] bg-[#f8fafc] relative">
      <Canvas shadows>
        <PerspectiveCamera
          makeDefault
          position={[truckLengthM * 1.5, 5, truckLengthM * 1.5]}
          fov={35}
        />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          target={[0, 1.5, 0]}
        />

        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 5]} intensity={1} castShadow />
        <Environment preset="city" />
        <ContactShadows
          opacity={0.2}
          scale={60}
          blur={2.4}
          far={10}
          color="#000"
        />
        <gridHelper args={[100, 50, "#cbd5e1", "#f1f5f9"]} />

        {/* KEY TRICK: Adding a key here forces React to destroy and 
          recreate the group when dimensions change, ensuring a clean rerender.
        */}
        <group key={`${vehicle.width}-${vehicle.height}-${vehicle.depth}`}>
          <TractorUnit
            width={vehicle.width}
            depth={vehicle.depth}
            config={config}
          />
          <Trailer
            width={vehicle.width}
            height={vehicle.height}
            depth={vehicle.depth}
            config={config}
          />

          {packedItems.map((item: any) => (
            <ItemBox
              key={item.boxId}
              item={item}
              truckW={vehicle.width}
              truckH={vehicle.height}
              truckD={vehicle.depth}
            />
          ))}
        </group>
      </Canvas>
    </div>
  );
}

function ItemBox({ item, truckW, truckH, truckD }: any) {
  const w = item.w * MM_TO_M;
  const h = item.h * MM_TO_M;
  const d = item.d * MM_TO_M;

  // Server 0 is Cabin (Front). Three.js Front is -depth/2.
  const posX = item.x * MM_TO_M + w / 2 - (truckW * MM_TO_M) / 2;
  const posY = item.y * MM_TO_M + h / 2 + CHASSIS_HEIGHT;
  const posZ = -((truckD * MM_TO_M) / 2) + item.z * MM_TO_M + d / 2;

  const color = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < item.name.length; i++)
      hash = item.name.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 65%, 45%)`;
  }, [item.name]);

  return (
    <group position={[posX, posY, posZ]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.7} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color="black" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}
