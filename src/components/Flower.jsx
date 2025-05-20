import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Flower({ isWilted }) {
  const flowerRef = useRef();

  useFrame((state, delta) => {
    if (flowerRef.current) {
      flowerRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={flowerRef}>
      {/* Sap */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 2.4, 16]} />
        <meshStandardMaterial color={isWilted ? "#8B4513" : "#228B22"} />
      </mesh>

      {/* Yapraklar */}
      <mesh position={[-0.25, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <sphereGeometry args={[0.18, 16, 8, 0, Math.PI]} />
        <meshStandardMaterial color={isWilted ? "#A0522D" : "#2ecc40"} />
      </mesh>
      <mesh position={[0.25, -0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <sphereGeometry args={[0.18, 16, 8, 0, Math.PI]} />
        <meshStandardMaterial color={isWilted ? "#A0522D" : "#2ecc40"} />
      </mesh>

      {/* Taç yapraklar */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[Math.sin((i * Math.PI) / 3) * 0.35, 0.7, Math.cos((i * Math.PI) / 3) * 0.35]}
          rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}
        >
          <coneGeometry args={[0.18, 0.5, 12]} />
          <meshStandardMaterial color={isWilted ? "#A0522D" : ["#FF69B4", "#FFD700", "#FF8C00", "#FF69B4", "#FFD700", "#FF8C00"][i]} />
        </mesh>
      ))}

      {/* Çiçek merkezi */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={isWilted ? "#8B4513" : "#FFD700"} />
      </mesh>
    </group>
  );
}

export default Flower; 