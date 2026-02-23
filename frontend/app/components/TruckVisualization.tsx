"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";

interface PackedItem {
  boxId: string;
  name: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  rotation: string;
}

interface TruckVisualizationProps {
  vehicle: {
    width: number;
    height: number;
    depth: number;
  };
  packedItems: PackedItem[];
  volumeUtilization: number;
}

function Truck({
  width,
  height,
  depth,
}: {
  width: number;
  height: number;
  depth: number;
}) {
  // Scale factors to make visualization more reasonable
  const scaleX = 0.1;
  const scaleY = 0.1;
  const scaleZ = 0.1;

  return (
    <group>
      {/* Truck container with wireframe for visibility */}
      <mesh position={[0, (height * scaleY) / 2, 0]}>
        <boxGeometry args={[width * scaleX, height * scaleY, depth * scaleZ]} />
        <meshStandardMaterial
          color="#e5e7eb"
          transparent
          opacity={0.3}
          wireframe={true}
          wireframeLinewidth={2}
        />
      </mesh>

      {/* Truck base */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * scaleX * 1.1, depth * scaleZ * 1.1]} />
        <meshStandardMaterial color="#f3f4f6" side={THREE.DoubleSide} />
      </mesh>

      {/* Truck label */}
      <Html position={[0, (height * scaleY) / 2 + 1, 0]} center>
        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          Truck: {width} × {height} × {depth}
        </div>
      </Html>
    </group>
  );
}

/**
 * Generate a deterministic color for a box based on its name
 * Uses a hash function to create consistent colors for the same names
 */
function getColorForBoxName(name: string): string {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to HSL values for better visual distinction
  const hue = Math.abs(hash) % 360; // 0-360 degrees for full color spectrum
  const saturation = 70 + (Math.abs(hash) % 20); // 70-90% saturation
  const lightness = 40 + (Math.abs(hash) % 15); // 40-55% lightness

  // Convert HSL to RGB, then to hex
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert RGB to hex
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate a darker border color based on box name
 */
function getBorderColorForBoxName(name: string): string {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to HSL values for border (darker version)
  const hue = Math.abs(hash) % 360; // Same hue for consistency
  const saturation = 80 + (Math.abs(hash) % 15); // 80-95% saturation
  const lightness = 25 + (Math.abs(hash) % 10); // 25-35% lightness (darker)

  // Convert HSL to RGB, then to hex
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert RGB to hex
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function Box({
  item,
  truckWidth,
  truckHeight,
  truckDepth,
}: {
  item: PackedItem;
  truckWidth: number;
  truckHeight: number;
  truckDepth: number;
}) {
  // Scale factors to make visualization more reasonable
  const scaleX = 0.1;
  const scaleY = 0.1;
  const scaleZ = 0.1;

  // Position the box correctly within the truck
  const x = (item.x + item.w / 2 - truckWidth / 2) * scaleX;
  const y = (item.y + item.h / 2) * scaleY;
  const z = (item.z + item.d / 2 - truckDepth / 2) * scaleZ;

  // Generate color based on box name for visual distinction
  const boxColor = getColorForBoxName(item.name);
  const borderColor = getBorderColorForBoxName(item.name);

  // Calculate box dimensions
  const width = item.w * scaleX;
  const height = item.h * scaleY;
  const depth = item.d * scaleZ;

  return (
    <group position={[x, y, z]}>
      {/* Main box with border effect */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={boxColor} />
      </mesh>

      {/* Border edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color={borderColor} linewidth={2} />
      </lineSegments>

      {/* Name on the front face of the box */}
      <Text
        position={[0, 0, depth / 2 + 0.1]} // Position on the front face
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="black"
      >
        {item.name}
      </Text>
    </group>
  );
}

function StatsDisplay({
  volumeUtilization,
  boxCount,
}: {
  volumeUtilization: number;
  boxCount: number;
}) {
  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold text-lg mb-2">📊 Packing Statistics</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Volume Utilization:</span>
          <span className="font-semibold text-green-600">
            {volumeUtilization.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Boxes Packed:</span>
          <span className="font-semibold text-blue-600">{boxCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Efficiency:</span>
          <span className="font-semibold">
            {volumeUtilization > 80
              ? "🟢 Excellent"
              : volumeUtilization > 60
                ? "🟡 Good"
                : "🔴 Fair"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ControlsHint() {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
      <p className="text-sm text-gray-600">
        📱 <strong>Controls:</strong> Drag to rotate, Scroll to zoom,
        Right-click to pan
      </p>
    </div>
  );
}

export default function TruckVisualization({
  vehicle,
  packedItems,
  volumeUtilization,
}: TruckVisualizationProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-pulse">
          <p className="text-gray-500">Loading 3D visualization...</p>
          <p className="text-sm text-gray-400 mt-2">
            Preparing truck and boxes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 relative">
      <StatsDisplay
        volumeUtilization={volumeUtilization}
        boxCount={packedItems.length}
      />
      <ControlsHint />

      <Canvas camera={{ position: [15, 20, 25], fov: 50 }} shadows>
        {/* Improved lighting for better visibility */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <hemisphereLight args={["#b1e1ff", "#f0f0f0", 0.5]} />

        {/* Truck with boxes */}
        <Truck
          width={vehicle.width}
          height={vehicle.height}
          depth={vehicle.depth}
        />

        {packedItems.map((item) => (
          <Box
            key={item.boxId}
            item={item}
            truckWidth={vehicle.width}
            truckHeight={vehicle.height}
            truckDepth={vehicle.depth}
          />
        ))}

        {/* Grid and axes for reference */}
        <gridHelper
          args={[Math.max(vehicle.width, vehicle.depth) * 0.2, 20]}
          position={[0, -0.1, 0]}
        />
        <axesHelper args={[5]} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
          autoRotate={false}
        />

        {/* Add a ground plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </Canvas>

      {/* Legend/Key */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium mb-2">🎨 Color Legend</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 border mr-2"></div>
            <span>Truck (wireframe)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 mr-2"></div>
            <div className="w-3 h-3 bg-green-500 mr-2"></div>
            <div className="w-3 h-3 bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 bg-red-500 mr-2"></div>
            <div className="w-3 h-3 bg-purple-500 mr-2"></div>
            <span>Boxes (by name)</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Each box type has a unique color based on its name
        </p>
      </div>
    </div>
  );
}
