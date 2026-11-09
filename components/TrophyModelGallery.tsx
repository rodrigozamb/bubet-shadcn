"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as THREE from "three";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type PrizeType = "PRIMEIRO" | "SEGUNDO" | "TERCEIRO" | "ESTANDARTE";

export interface Prize {
  id: string;
  nome: string;
  descricao: string;
  url: string;
  created_at: string;
  competidor_id: string;
  type: PrizeType;
}

interface TrophyModelGalleryProps {
  prizes: Prize[];
  shelfTitle: string;
}

function ModelScene({ src }: { src: string }) {
  const { scene } = useGLTF(src);

  const model = useMemo(() => {
    const clonedScene = scene.clone();
    clonedScene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    const bounds = new THREE.Box3().setFromObject(clonedScene);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const group = new THREE.Group();

    clonedScene.position.sub(center);
    group.rotation.y = Math.PI * 0.4;
    group.scale.setScalar(2.4 / maxDimension);
    group.add(clonedScene);

    return group;
  }, [scene]);

  return <primitive object={model} />;
}

function ModelLights() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 3, 2]} intensity={1.6} />
      <directionalLight position={[-2, 1, -2]} intensity={0.7} />
    </>
  );
}

function ModelCard({ prize }: { prize: Prize }) {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <article ref={cardRef} className="flex min-w-0 flex-col items-center text-center">
      <button
        aria-label={`Ampliar ${prize.nome}`}
        className="relative h-24 w-full cursor-zoom-in rounded-sm outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-amber-500 sm:h-28"
        onClick={() => setOpen(true)}
        type="button"
      >
        {isVisible && (
          <Canvas
            aria-hidden="true"
            camera={{ position: [0, 1.2, 4], fov: 45 }}
            dpr={[1, 1.25]}
            gl={{ alpha: true, antialias: true }}
            style={{ pointerEvents: "none" }}
          >
            <ModelLights />
            <Suspense fallback={null}>
              <ModelScene src={prize.url} />
            </Suspense>
          </Canvas>
        )}
      </button>
      <p className="mt-2 line-clamp-2 min-h-10 w-full text-xs font-semibold leading-5 text-stone-800 sm:text-sm">
        {prize.nome}
      </p>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-3xl overflow-hidden border-[#64452f] bg-[#f2f0e8] p-4 sm:p-6">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-stone-900">{prize.nome}</DialogTitle>
            <DialogDescription className="text-stone-600">
              {prize.descricao}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[min(68vh,560px)] min-h-72 overflow-hidden rounded-sm bg-[radial-gradient(ellipse_at_center,#fffdf5_0%,#e7e4d8_72%,#d8d2c3_100%)]">
            {open && (
              <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }} dpr={[1, 2]} shadows>
                <ModelLights />
                <Suspense fallback={null}>
                  <ModelScene src={prize.url} />
                </Suspense>
                <OrbitControls
                  enableDamping
                  enablePan={false}
                  enableRotate
                  minPolarAngle={0.01}
                  maxPolarAngle={Math.PI - 0.01}
                />
              </Canvas>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}

export function TrophyModelGallery({
  prizes,
  shelfTitle,
}: TrophyModelGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = scrollRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [prizes, updateScrollState]);

  const scroll = (direction: -1 | 1) => {
    const track = scrollRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-36 items-end gap-2 pb-0 sm:min-h-44 sm:gap-3">
      <button
        aria-label="Prêmios anteriores"
        className="mb-10 grid size-9 shrink-0 place-items-center rounded-full border border-[#805638] bg-[#f8f5eb] text-stone-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
        disabled={atStart}
        onClick={() => scroll(-1)}
        type="button"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
      </button>
      <div
        ref={scrollRef}
        aria-label={`Prêmios: ${shelfTitle}`}
        className="grid min-w-0 flex-1 grid-flow-col gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-1 pb-1"
        onScroll={updateScrollState}
        role="region"
        style={{ gridAutoColumns: "calc((100% - 4rem) / 5)" }}
      >
        {prizes.map((prize) => (
          <ModelCard key={prize.id} prize={prize} />
        ))}
      </div>
      <button
        aria-label="Próximos prêmios"
        className="mb-10 grid size-9 shrink-0 place-items-center rounded-full border border-[#805638] bg-[#f8f5eb] text-stone-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
        disabled={atEnd}
        onClick={() => scroll(1)}
        type="button"
      >
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}