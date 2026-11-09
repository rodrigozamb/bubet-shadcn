"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const modelUrl = "/3dmodels/TUBI/trofeuCampeao.glb";

function TrophyModel() {
  const { scene } = useGLTF(modelUrl);

  const model = useMemo(() => {
    const clonedScene = scene.clone();

    clonedScene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const modelGroup = new THREE.Group();

    clonedScene.position.sub(center);
    modelGroup.rotation.y = Math.PI * 0.4;
    modelGroup.scale.setScalar(2.4 / maxDimension);
    modelGroup.add(clonedScene);

    return modelGroup;
  }, [scene]);

  return <primitive object={model} />;
}

function TrophyLights() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 3, 2]} intensity={1.6} />
      <directionalLight position={[-2, 1, -2]} intensity={0.7} />
    </>
  );
}

export function ChampionTrophy() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Ampliar troféu de campeão"
        className="relative h-24 w-full cursor-zoom-in rounded-sm outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-amber-500 sm:h-28"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Canvas
          aria-hidden="true"
          camera={{ position: [0, 1.2, 4], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          shadows
          style={{ pointerEvents: "none" }}
        >
          <TrophyLights />
          <Suspense fallback={null}>
            <TrophyModel />
          </Suspense>
        </Canvas>
      </button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-3xl overflow-hidden border-[#64452f] bg-[#f2f0e8] p-4 sm:p-6">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-stone-900">Troféu de campeão</DialogTitle>
            <DialogDescription className="text-stone-600">
              Modelo 3D do troféu
            </DialogDescription>
          </DialogHeader>
          <div className="h-[min(68vh,560px)] min-h-72 overflow-hidden rounded-sm bg-[radial-gradient(ellipse_at_center,#fffdf5_0%,#e7e4d8_72%,#d8d2c3_100%)]">
            <Canvas
              camera={{ position: [0, 1.5, 4], fov: 45 }}
              dpr={[1, 2]}
              shadows
            >
              <TrophyLights />
              <Suspense fallback={null}>
                <TrophyModel />
              </Suspense>
              <OrbitControls
                enableDamping
                enablePan={false}
                enableRotate
                minPolarAngle={0.01}
                maxPolarAngle={Math.PI - 0.01}
              />
            </Canvas>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

useGLTF.preload(modelUrl);