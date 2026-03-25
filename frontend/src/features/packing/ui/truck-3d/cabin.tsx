"use client";

import { Wheel } from "./wheel";
import type { SubComponentProps } from "../../model/types";

const CABIN_LENGTH = 2.8;
const HITCH_GAP = 0.6;

export function Cabin({ width, depth, config }: SubComponentProps) {
  const w = width * 0.001;
  const d = depth * 0.001;
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
      
      {/* Front Wheels */}
      <Wheel position={[w / 2, 0.5, 0.8]} />
      <Wheel position={[-w / 2, 0.5, 0.8]} />
    </group>
  );
}
