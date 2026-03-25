"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import type {
  PackedItem,
  TruckConfig,
  ContainerDimensions,
} from "../model/types";
import { Cabin, Container, CargoBox } from "./truck-3d";

const MM_TO_M = 0.001;

const GET_TRUCK_CONFIG = (depth: number): TruckConfig => {
  if (depth < 4500)
    return { type: "SMALL", wheels: 1, cabinScale: 0.7, cabinOffset: 0.2 };
  if (depth < 8500)
    return { type: "MEDIUM", wheels: 2, cabinScale: 0.85, cabinOffset: 0.4 };
  return { type: "LARGE", wheels: 3, cabinScale: 1.0, cabinOffset: 0.6 };
};

interface TruckVisualizationProps {
  vehicle: ContainerDimensions;
  packedItems: PackedItem[];
}

function TruckVisualizationContent({
  vehicle,
  packedItems,
}: TruckVisualizationProps) {
  const config = useMemo(
    () => GET_TRUCK_CONFIG(vehicle.depth),
    [vehicle.depth],
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

        <group key={`${vehicle.width}-${vehicle.height}-${vehicle.depth}`}>
          <Cabin
            width={vehicle.width}
            depth={vehicle.depth}
            height={vehicle.height}
            config={config}
          />
          <Container
            width={vehicle.width}
            height={vehicle.height}
            depth={vehicle.depth}
            config={config}
          />

          {packedItems.map((item) => (
            <CargoBox
              key={item.id}
              item={item}
              truckW={vehicle.width}
              truckD={vehicle.depth}
            />
          ))}
        </group>
      </Canvas>
    </div>
  );
}

export function TruckVisualization({
  vehicle,
  packedItems,
}: TruckVisualizationProps) {
  if (typeof window === "undefined") {
    return (
      <div className="w-full h-full min-h-[600px] bg-slate-100 animate-pulse rounded-xl" />
    );
  }

  return (
    <TruckVisualizationContent vehicle={vehicle} packedItems={packedItems} />
  );
}
