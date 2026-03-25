"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { PackedItem } from "../../model/types";

const MM_TO_M = 0.001;
const CHASSIS_HEIGHT = 1.1;

interface CargoBoxProps {
  item: PackedItem;
  truckW: number;
  truckD: number;
}

export function CargoBox({ item, truckW, truckD }: CargoBoxProps) {
  const w = item.width * MM_TO_M;
  const h = item.height * MM_TO_M;
  const d = item.depth * MM_TO_M;

  // Origin Mapping: Converts 0,0,0 (Bottom-Front-Left) to Three.js Center-relative
  const posX = item.x * MM_TO_M + w / 2 - (truckW * MM_TO_M) / 2;
  const posY = item.y * MM_TO_M + h / 2 + CHASSIS_HEIGHT;
  const posZ = -((truckD * MM_TO_M) / 2) + item.z * MM_TO_M + d / 2;

  const color = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < item.name.length; i++) {
      hash = item.name.charCodeAt(i) + ((hash << 5) - hash);
    }
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
