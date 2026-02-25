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

// --- Constants ---
const MM_TO_M = 0.001;
const CHASSIS_HEIGHT = 1.1;
const CABIN_LENGTH = 2.8; // Length of the tractor unit
const HITCH_GAP = 0.6; // Physical gap between trailer wall and cabin back

// --- Types ---
interface PackedItem {
  boxId: string;
  name: string;
  x: number;
  y: number;
  z: number; // mm
  w: number;
  h: number;
  d: number; // mm
}

interface TruckVisualizationProps {
  vehicle: { width: number; height: number; depth: number };
  packedItems: PackedItem[];
  volumeUtilization?: number;
}

// --- Components ---

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.48, 0.48, 0.4, 32]} />
        <meshStandardMaterial color="#111" roughness={1} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.42, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function TractorUnit({
  truckWidth,
  truckDepth,
}: {
  truckWidth: number;
  truckDepth: number;
}) {
  const w = truckWidth * MM_TO_M;
  const d = truckDepth * MM_TO_M;

  // Calculate the front edge of the trailer
  const trailerFrontZ = d / 2;
  // Position the cabin center beyond the front edge + gap + half cabin length
  const cabinCenterZ = trailerFrontZ + HITCH_GAP + CABIN_LENGTH / 2;

  return (
    <group position={[0, 0, cabinCenterZ]}>
      {/* Lower Engine/Chassis Block */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[w * 1.05, 1.0, CABIN_LENGTH]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Driver Cab */}
      <mesh position={[0, 2.1, -0.2]}>
        <boxGeometry args={[w, 2.0, CABIN_LENGTH * 0.7]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Roof Deflector - Sloped to meet trailer height */}
      <mesh position={[0, 3.4, -0.4]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[w * 0.95, 0.8, 1.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Windshield - Facing Front (+Z) */}
      <mesh position={[0, 2.4, 0.8]}>
        <boxGeometry args={[w * 0.9, 1.1, 0.05]} />
        <meshStandardMaterial color="#000" transparent opacity={0.8} />
      </mesh>

      {/* Front Grille Area */}
      <mesh position={[0, 1.0, CABIN_LENGTH / 2 + 0.01]}>
        <boxGeometry args={[w * 0.7, 0.8, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Headlights */}
      <mesh position={[w * 0.35, 0.5, CABIN_LENGTH / 2 + 0.02]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#fff"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-w * 0.35, 0.5, CABIN_LENGTH / 2 + 0.02]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#fff"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Front Wheels (Steer Axle) */}
      <Wheel position={[w / 2, 0.5, 0.8]} />
      <Wheel position={[-w / 2, 0.5, 0.8]} />
    </group>
  );
}

function Trailer({
  width,
  height,
  depth,
}: {
  width: number;
  height: number;
  depth: number;
}) {
  const w = width * MM_TO_M;
  const h = height * MM_TO_M;
  const d = depth * MM_TO_M;

  return (
    <group>
      {/* 1. Trailer Floor */}
      <mesh position={[0, CHASSIS_HEIGHT - 0.05, 0]}>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* 2. Ghost Trailer (Side Walls) */}
      <mesh position={[0, CHASSIS_HEIGHT + h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Trailer Edges */}
      <lineSegments position={[0, CHASSIS_HEIGHT + h / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color="#475569" transparent opacity={0.5} />
      </lineSegments>

      {/* 4. Rear Wheels (Triple Axle) */}
      <group position={[0, 0.5, 0]}>
        {[-1.1, 0, 1.1].map((z, i) => (
          <group key={i}>
            <Wheel position={[w / 2, 0, -d / 2 + 2.5 + z]} />
            <Wheel position={[-w / 2, 0, -d / 2 + 2.5 + z]} />
          </group>
        ))}
      </group>
    </group>
  );
}

function ItemBox({
  item,
  truckW,
  truckH,
  truckD,
}: {
  item: PackedItem;
  truckW: number;
  truckH: number;
  truckD: number;
}) {
  const w = item.w * MM_TO_M;
  const h = item.h * MM_TO_M;
  const d = item.d * MM_TO_M;

  // POSITIONAL LOGIC:
  // Data: x=0, z=0 is Rear-Left-Bottom.
  // Scene: Center of trailer is 0,0,0.
  const posX = item.x * MM_TO_M + w / 2 - (truckW * MM_TO_M) / 2;
  const posY = item.y * MM_TO_M + h / 2 + CHASSIS_HEIGHT;
  const posZ = item.z * MM_TO_M + d / 2 - (truckD * MM_TO_M) / 2;

  const color = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < item.name.length; i++)
      hash = item.name.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 60%, 50%)`;
  }, [item.name]);

  return (
    <group position={[posX, posY, posZ]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color="black" transparent opacity={0.2} />
      </lineSegments>
      {w > 0.4 && (
        <Text
          position={[0, 0, d / 2 + 0.01]}
          fontSize={0.12}
          color="white"
          maxWidth={w}
        >
          {item.name}
        </Text>
      )}
    </group>
  );
}

// --- Main Visualization ---

export default function TruckVisualization({
  vehicle,
  packedItems,
  volumeUtilization = 0,
}: TruckVisualizationProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient)
    return (
      <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-xl" />
    );

  const truckLengthM = vehicle.depth * MM_TO_M;
  const cameraPos: [number, number, number] = [
    truckLengthM * 1.2,
    truckLengthM * 0.6,
    truckLengthM * 1.2,
  ];

  return (
    <div className="w-full h-[600px] bg-[#f8fafc] relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Header Overlay */}

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={cameraPos} fov={30} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          target={[0, 1, 0]}
        />

        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
        <Environment preset="city" />

        <ContactShadows
          opacity={0.3}
          scale={60}
          blur={2.4}
          far={10}
          color="#000"
        />
        <gridHelper args={[100, 40, "#e2e8f0", "#f1f5f9"]} />

        <group>
          {/* Tractor (Cabin) positioned dynamically outside trailer front */}
          <TractorUnit truckWidth={vehicle.width} truckDepth={vehicle.depth} />

          {/* Trailer (Cargo Container) centered at 0,0,0 */}
          <Trailer
            width={vehicle.width}
            height={vehicle.height}
            depth={vehicle.depth}
          />

          {/* Items strictly within trailer bounds */}
          {packedItems.map((item) => (
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

      <div className="absolute bottom-6 left-6 flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-white/80 px-4 py-2 rounded-full border border-slate-100 backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        SYSTEM READY: {packedItems.length} ITEMS PACKED
      </div>
    </div>
  );
}
