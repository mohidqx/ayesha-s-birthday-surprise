import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import * as THREE from "three";

const FloatingHeart = ({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x, y + 0.25);
    shape.bezierCurveTo(x, y + 0.25, x - 0.25, y, x - 0.25, y);
    shape.bezierCurveTo(x - 0.55, y, x - 0.55, y + 0.35, x - 0.55, y + 0.35);
    shape.bezierCurveTo(x - 0.55, y + 0.55, x - 0.35, y + 0.75, x, y + 0.95);
    shape.bezierCurveTo(x + 0.35, y + 0.75, x + 0.55, y + 0.55, x + 0.55, y + 0.35);
    shape.bezierCurveTo(x + 0.55, y + 0.35, x + 0.55, y, x + 0.25, y);
    shape.bezierCurveTo(x + 0.1, y, x, y + 0.25, x, y + 0.25);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  }), []);

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale} rotation={[Math.PI, 0, 0]}>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#e11d48"
          emissive="#e11d48"
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </Float>
  );
};

const FloatingRose = ({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.15;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.4;
    }
  });

  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.15, 0.15, 0.3, 0.4, 0, 0.6);
    shape.bezierCurveTo(-0.3, 0.4, -0.15, 0.15, 0, 0);
    return shape;
  }, []);

  const petalGeomSettings = useMemo(() => ({
    depth: 0.02,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.01,
    bevelThickness: 0.01,
  }), []);

  const petals = useMemo(() => {
    const items = [];
    for (let layer = 0; layer < 3; layer++) {
      const count = layer === 0 ? 5 : layer === 1 ? 7 : 9;
      const layerScale = 1 - layer * 0.25;
      const layerY = layer * 0.05;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + layer * 0.3;
        items.push({ angle, layerScale, layerY, key: `${layer}-${i}` });
      }
    }
    return items;
  }, []);

  return (
    <Float speed={speed * 0.8} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef} position={position} scale={scale}>
        {petals.map((p) => (
          <mesh
            key={p.key}
            rotation={[0.3, p.angle, 0.2 * p.layerScale]}
            position={[0, p.layerY, 0]}
            scale={p.layerScale}
          >
            <extrudeGeometry args={[petalShape, petalGeomSettings]} />
            <meshStandardMaterial
              color="#e8456b"
              emissive="#c2185b"
              emissiveIntensity={0.2}
              metalness={0.1}
              roughness={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        {/* Center of the rose */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#d4a017" emissive="#d4a017" emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
};

const AnimatedRibbon = ({ startPos, color, speed }: { startPos: [number, number, number]; color: string; speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0.5, 0.3),
      new THREE.Vector3(2, -0.3, -0.2),
      new THREE.Vector3(3, 0.4, 0.1),
      new THREE.Vector3(4, 0, -0.3),
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
    return tubeGeo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
      meshRef.current.position.y = startPos[1] + Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.5;
    }
  });

  return (
    <Float speed={speed * 0.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={startPos} geometry={geometry} scale={0.6}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.4}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
};

const GoldenStar = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    const colors = new Float32Array(300 * 3);
    
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 5;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.83; colors[i * 3 + 1] = 0.69; colors[i * 3 + 2] = 0.69;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.83; colors[i * 3 + 1] = 0.69; colors[i * 3 + 2] = 0.22;
      } else {
        colors[i * 3] = 0.88; colors[i * 3 + 1] = 0.44; colors[i * 3 + 2] = 0.63;
      }
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const Scene = () => {
  const hearts = useMemo(() => [
    { position: [-3, 2, -3] as [number, number, number], scale: 0.3, speed: 0.8 },
    { position: [4, -1, -4] as [number, number, number], scale: 0.25, speed: 1.2 },
    { position: [-2, -2, -2] as [number, number, number], scale: 0.2, speed: 1 },
    { position: [3, 3, -5] as [number, number, number], scale: 0.35, speed: 0.6 },
    { position: [0, -3, -3] as [number, number, number], scale: 0.22, speed: 1.1 },
  ], []);

  const roses = useMemo(() => [
    { position: [-4, 0, -3] as [number, number, number], scale: 0.4, speed: 0.6 },
    { position: [3, 2, -4] as [number, number, number], scale: 0.35, speed: 0.8 },
    { position: [0, -2, -2.5] as [number, number, number], scale: 0.3, speed: 0.7 },
    { position: [-2, 3, -5] as [number, number, number], scale: 0.45, speed: 0.5 },
    { position: [5, -2, -4.5] as [number, number, number], scale: 0.28, speed: 0.9 },
  ], []);

  const ribbons = useMemo(() => [
    { startPos: [-5, 1, -3] as [number, number, number], color: "#e8456b", speed: 0.7 },
    { startPos: [3, -1, -4] as [number, number, number], color: "#d4af37", speed: 0.5 },
    { startPos: [-1, 3, -5] as [number, number, number], color: "#e88ca5", speed: 0.6 },
    { startPos: [5, 2, -3.5] as [number, number, number], color: "#c2185b", speed: 0.8 },
  ], []);

  const stars = useMemo(() => [
    { position: [-4, 1, -2] as [number, number, number], scale: 0.8 },
    { position: [5, 2, -3] as [number, number, number], scale: 0.6 },
    { position: [-1, 4, -4] as [number, number, number], scale: 0.7 },
    { position: [2, -2, -2] as [number, number, number], scale: 0.5 },
    { position: [-3, -3, -3] as [number, number, number], scale: 0.65 },
    { position: [4, -1, -5] as [number, number, number], scale: 0.55 },
  ], []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffd700" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#e11d48" />
      <pointLight position={[0, 5, 5]} intensity={0.2} color="#e88ca5" />
      
      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      <ParticleField />
      
      {hearts.map((heart, i) => (
        <FloatingHeart key={`heart-${i}`} {...heart} />
      ))}

      {roses.map((rose, i) => (
        <FloatingRose key={`rose-${i}`} {...rose} />
      ))}

      {ribbons.map((ribbon, i) => (
        <AnimatedRibbon key={`ribbon-${i}`} {...ribbon} />
      ))}
      
      {stars.map((star, i) => (
        <GoldenStar key={`star-${i}`} {...star} />
      ))}
    </>
  );
};

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default Background3D;
