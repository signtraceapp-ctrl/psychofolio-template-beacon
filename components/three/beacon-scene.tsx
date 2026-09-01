"use client";

/**
 * BEACON - 3D gece denizi + fener sahnesi.
 * Gerstner dalgali surekli su yuzeyi; uzakta donen fener isigi.
 * Kayirdikca fenere yaklasir, sis acilir, ufukta gun dogumu tonu belirir.
 *
 * progressRef: 0 -> acik deniz/sis, 1 -> fenerin dibinde/gun dogumu.
 * Koyu (gece laciverti) zemin uzerinde calisir - canvas seffaftir.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const SEA_W = 90;
const SEA_D = 140;
const GRID_X = 120;
const GRID_Z = 80;
const VERTEX_COUNT = GRID_X * GRID_Z;
const LIGHTHOUSE_Z = -52;
const FOAM_COUNT = 36;
const STAR_COUNT = 300;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smoothstep = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/* -- Gerstner wave (y-only for performance) -------------------------------- */
function gerstnerY(x: number, z: number, t: number): number {
  let y = 0.6 * Math.sin(x * 0.06 + z * 0.02 + t * 0.55);
  y += 0.35 * Math.sin(x * 0.04 - z * 0.05 + t * 0.4);
  y += 0.22 * Math.sin(x * 0.09 + z * 0.07 + t * 0.75);
  y += 0.14 * Math.sin(x * 0.15 + z * 0.12 + t * 1.2);
  y += 0.08 * Math.sin(x * 0.22 - z * 0.18 + t * 1.8);
  y += 0.04 * Math.sin(x * 0.35 + z * 0.28 + t * 2.4);
  return y;
}

/* -- Deterministic PRNG (mulberry32) --------------------------------------- */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -- Build sea grid geometry data ------------------------------------------ */
function buildSeaGrid() {
  const positions = new Float32Array(VERTEX_COUNT * 3);
  const indices: number[] = [];
  let idx = 0;
  for (let ix = 0; ix < GRID_X; ix++) {
    for (let iz = 0; iz < GRID_Z; iz++) {
      const x = (ix / (GRID_X - 1) - 0.5) * SEA_W;
      const z = -(iz / (GRID_Z - 1)) * SEA_D + 12;
      positions[idx] = x;
      positions[idx + 1] = 0;
      positions[idx + 2] = z;
      idx += 3;
    }
  }
  for (let ix = 0; ix < GRID_X - 1; ix++) {
    for (let iz = 0; iz < GRID_Z - 1; iz++) {
      const a = ix * GRID_Z + iz;
      const b = a + 1;
      const c = (ix + 1) * GRID_Z + iz;
      const d = c + 1;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }
  return { positions, indices: new Uint32Array(indices) };
}

/* == Continuous Water Surface ============================================== */
function Sea({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const seaGeoRef = useRef<THREE.BufferGeometry>(null);
  const seaGrid = useMemo(() => buildSeaGrid(), []);
  const basePositions = useMemo(() => new Float32Array(seaGrid.positions), [seaGrid]);

  useFrame(({ clock }) => {
    const geo = seaGeoRef.current;
    if (!geo) return;
    const t = clock.getElapsedTime();
    const p = progressRef.current;
    const calm = 1 - p * 0.35;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < VERTEX_COUNT; i++) {
      const x = basePositions[i * 3];
      const z = basePositions[i * 3 + 2];
      arr[i * 3 + 1] = gerstnerY(x, z, t) * calm - 2.2;
    }
    posAttr.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh frustumCulled={false}>
      <bufferGeometry ref={seaGeoRef}>
        <bufferAttribute attach="attributes-position" args={[seaGrid.positions, 3]} />
        <bufferAttribute attach="index" args={[seaGrid.indices, 1]} />
      </bufferGeometry>
      <meshPhysicalMaterial
        color="#081e36"
        roughness={0.25}
        metalness={0.5}
        clearcoat={0.3}
        clearcoatRoughness={0.2}
        envMapIntensity={1.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* == Foam Sprites ========================================================== */
function Foam({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const foamBasePositions = useMemo(() => {
    const rng = mulberry32(42);
    const arr: { x: number; z: number }[] = [];
    for (let i = 0; i < FOAM_COUNT; i++) {
      arr.push({ x: (rng() - 0.5) * SEA_W * 0.8, z: -rng() * SEA_D * 0.6 + 8 });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    const calm = 1 - progressRef.current * 0.35;
    for (let i = 0; i < FOAM_COUNT; i++) {
      const bx = foamBasePositions[i].x;
      const bz = foamBasePositions[i].z;
      const y = gerstnerY(bx, bz, t) * calm - 2.2;
      const threshold = 0.15;
      const waveHeight = gerstnerY(bx, bz, t) * calm;
      const visible = waveHeight > threshold;
      const scale = visible ? (waveHeight - threshold) * 3.0 : 0;
      dummy.position.set(bx, y + 0.05, bz);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FOAM_COUNT]} frustumCulled={false}>
      <planeGeometry args={[0.6, 0.6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

/* == Stars ================================================================= */
function Stars() {
  const starsData = useMemo(() => {
    const rng = mulberry32(777);
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = (rng() - 0.5) * 180;
      positions[i * 3 + 1] = 15 + rng() * 50;
      positions[i * 3 + 2] = LIGHTHOUSE_Z - 20 - rng() * 60;
      sizes[i] = 0.08 + rng() * 0.18;
    }
    return { positions, sizes };
  }, []);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starsData.positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[starsData.sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} sizeAttenuation color="#c8d8f0" transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* == Sky Gradient Backplane ================================================ */
function SkyBackplane() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, "#0f1e38");
      g.addColorStop(0.5, "#0b1626");
      g.addColorStop(0.8, "#0d1a2c");
      g.addColorStop(0.95, "#1a2a44");
      g.addColorStop(1, "#2a3850");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 4, 256);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  return (
    <mesh position={[0, 20, LIGHTHOUSE_Z - 60]}>
      <planeGeometry args={[200, 80]} />
      <meshBasicMaterial map={tex} depthWrite={false} />
    </mesh>
  );
}

/* == Lighthouse ============================================================ */
function Lighthouse({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const beamRef = useRef<THREE.Group>(null);
  const beamMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const reflGeoRef = useRef<THREE.BufferGeometry>(null);

  const glowTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
      g.addColorStop(0, "rgba(255,222,150,0.9)");
      g.addColorStop(0.4, "rgba(255,214,130,0.35)");
      g.addColorStop(1, "rgba(255,210,120,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  const beamGradientTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 128;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, "rgba(255,217,138,0.6)");
      g.addColorStop(0.3, "rgba(255,217,138,0.35)");
      g.addColorStop(0.7, "rgba(255,217,138,0.1)");
      g.addColorStop(1, "rgba(255,217,138,0.0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 4, 128);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  const reflData = useMemo(() => {
    const count = 44;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const h1 = Math.abs(Math.sin(i * 127.1 + 311.7)) * 43758.5453;
      const h2 = Math.abs(Math.sin(i * 269.3 + 183.1)) * 43758.5453;
      pos[i * 3] = ((h1 - Math.floor(h1)) - 0.5) * 1.6;
      pos[i * 3 + 1] = -2.2 - i * 0.28 - (h2 - Math.floor(h2)) * 0.2;
      pos[i * 3 + 2] = 0;
      const fade = 1 - i / count;
      col[i * 3] = 1.0;
      col[i * 3 + 1] = 0.85 * fade;
      col[i * 3 + 2] = 0.55 * fade;
    }
    return { positions: pos, colors: col, count };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = progressRef.current;
    if (beamRef.current) beamRef.current.rotation.y = t * 0.55;
    const sweep = 0.55 + 0.45 * Math.max(0, Math.sin(t * 0.55 + Math.PI / 2));
    if (beamMatRef.current) beamMatRef.current.opacity = (0.1 + p * 0.14) * sweep;
    if (haloMatRef.current) haloMatRef.current.opacity = (0.04 + p * 0.06) * sweep;
    if (glowRef.current) {
      const s = 6 + sweep * 3 + p * 4;
      glowRef.current.scale.set(s, s, 1);
    }
    const geo = reflGeoRef.current;
    if (geo) {
      const attr = geo.getAttribute("position") as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < reflData.count; i++) {
        arr[i * 3] = Math.sin(t * 1.2 + i * 0.7) * 0.7;
        arr[i * 3 + 1] = -2.2 - i * 0.28 + Math.sin(t * 0.8 + i * 0.5) * 0.18;
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group position={[6, -2.2, LIGHTHOUSE_Z]}>
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[1.05, 1.6, 10, 14]} />
        <meshStandardMaterial color="#1c2b40" roughness={0.8} metalness={0.1} />
      </mesh>
      {[2.2, 5.2, 8.2].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[1.38 - y * 0.055, 1.44 - y * 0.055, 1.1, 14]} />
          <meshStandardMaterial color="#2e4460" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, 10.6, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 1.3, 10]} />
        <meshStandardMaterial color="#ffd98a" emissive="#ffd98a" emissiveIntensity={1.5} roughness={0.3} metalness={0.0} transparent />
      </mesh>
      <mesh position={[0, 11.7, 0]}>
        <coneGeometry args={[1.05, 0.9, 10]} />
        <meshStandardMaterial color="#16233a" roughness={0.7} metalness={0.1} />
      </mesh>
      <sprite ref={glowRef} position={[0, 10.6, 0]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <group ref={beamRef} position={[0, 10.6, 0]}>
        <mesh position={[0, 0, 14]} rotation-x={-Math.PI / 2}>
          <coneGeometry args={[3.2, 28, 12, 1, true]} />
          <meshBasicMaterial ref={beamMatRef} map={beamGradientTex} color="#ffd98a" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0, 0, 13.5]} rotation-x={-Math.PI / 2}>
          <coneGeometry args={[4.2, 27, 12, 1, true]} />
          <meshBasicMaterial color="#ffd98a" transparent opacity={0.03} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0, 0, 13]} rotation-x={-Math.PI / 2}>
          <coneGeometry args={[5.5, 26, 12, 1, true]} />
          <meshBasicMaterial ref={haloMatRef} color="#ffd98a" transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      <points frustumCulled={false} position={[0, 0, 2]}>
        <bufferGeometry ref={reflGeoRef}>
          <bufferAttribute attach="attributes-position" args={[reflData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[reflData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.32} sizeAttenuation vertexColors transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

/* == Horizon =============================================================== */
function Horizon({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 128;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, "rgba(255,190,110,0)");
      g.addColorStop(0.55, "rgba(255,186,110,0.55)");
      g.addColorStop(1, "rgba(255,160,90,0.85)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 4, 128);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(() => {
    const p = progressRef.current;
    if (matRef.current) matRef.current.opacity = smoothstep(0.72, 0.98, p) * 0.8;
  });

  return (
    <mesh position={[0, 2.4, LIGHTHOUSE_Z - 26]}>
      <planeGeometry args={[160, 14]} />
      <meshBasicMaterial ref={matRef} map={tex} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/* == Scene Rig ============================================================= */
function SceneRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const smoothP = useRef(0);
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const fogRef = useRef<THREE.Fog>(null);
  const fogColor = useMemo(() => new THREE.Color("#0d1a2c"), []);
  const fogWarm = useMemo(() => new THREE.Color("#27354a"), []);
  const rollQuat = useRef(new THREE.Quaternion());
  const rollAxis = useRef(new THREE.Vector3(0, 0, 1));

  useFrame(({ clock, scene }) => {
    smoothP.current += (progressRef.current - smoothP.current) * 0.08;
    const p = smoothP.current;
    const t = clock.getElapsedTime();
    if (!fogRef.current && scene.fog) fogRef.current = scene.fog as THREE.Fog;
    const fog = fogRef.current;
    if (fog) {
      fog.near = lerp(4, 14, p);
      fog.far = lerp(50, 140, p);
      fog.color.copy(fogColor).lerp(fogWarm, smoothstep(0.7, 1, p));
    }
    const z = lerp(26, -30, p);
    const y = lerp(1.6, 3.6, p) + Math.sin(t * 0.6) * 0.25 * (1 - p * 0.7);
    const x = lerp(-3, 2.5, p) + Math.sin(t * 0.35) * 0.4 * (1 - p);
    camera.position.set(x, y, z);
    look.set(6 * p, lerp(2, 8.5, p), LIGHTHOUSE_Z);
    camera.lookAt(look);
    const rollAngle = Math.sin(t * 0.4) * 0.02 * (1 - p * 0.8);
    rollQuat.current.setFromAxisAngle(rollAxis.current, rollAngle);
    camera.quaternion.multiply(rollQuat.current);
  });

  return (
    <>
      <Sea progressRef={progressRef} />
      <Foam progressRef={progressRef} />
      <Stars />
      <SkyBackplane />
      <Lighthouse progressRef={progressRef} />
      <Horizon progressRef={progressRef} />
      <ambientLight intensity={0.25} color="#1a2a44" />
      <directionalLight position={[-10, 40, -20]} intensity={0.15} color="#a0b8d8" />
      <directionalLight position={[20, 30, 10]} intensity={0.3} color="#8899bb" />
      <pointLight position={[6, 12, LIGHTHOUSE_Z]} intensity={0.8} color="#ffd98a" distance={30} decay={2} />
    </>
  );
}

/* == Main Export ============================================================ */
export function BeaconScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [-3, 1.6, 26], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog("#0d1a2c", 4, 50);
      }}
    >
      <SceneRig progressRef={progressRef} />
    </Canvas>
  );
}
