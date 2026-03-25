"use client";

import * as THREE from "three";
import { Wheel } from "./wheel";
import type { SubComponentProps } from "../../model/types";

const CHASSIS_HEIGHT = 1.1;

export function Container({ width, height, depth, config }: SubComponentProps) {
  const w = width * 0.001;
  const h = height * 0.001;
  const d = depth * 0.001;
  const axles = Array.from({ length: config.wheels }, (_, i) => i * 1.1);

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, CHASSIS_HEIGHT - 0.05, 0]}>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Ghost Container Shell */}
      <mesh position={[0, CHASSIS_HEIGHT + h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Helper Edges */}
      <lineSegments position={[0, CHASSIS_HEIGHT + h / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color="#475569" transparent opacity={0.5} />
      </lineSegments>

      {/* Rear Axles */}
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
