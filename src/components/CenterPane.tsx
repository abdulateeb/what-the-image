import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, Line, useTexture, Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Info } from 'lucide-react';

const LAYERS = [
  { id: 4, title: 'Semantic Understanding', desc: 'Meaning and context extraction', color: '#8b5cf6', y: 4 },
  { id: 3, title: 'Object & Pattern Recognition', desc: 'Identify structures and key patterns', color: '#f59e0b', y: 2 },
  { id: 2, title: 'Attention Mapping', desc: 'Focus on important regions', color: '#10b981', y: 0 },
  { id: 1, title: 'Feature Extraction', desc: 'Edges, textures and micro patterns', color: '#3b82f6', y: -2 },
  { id: 0, title: 'Input Layer', desc: 'Raw image data', color: '#fafafa', y: -4 }
];

function InputLayer({ url, y }: { url: string | null, y: number }) {
  const texture = useTexture(url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial map={texture} transparent opacity={0.9} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[6.1, 6.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}

function FeatureLayer({ y }: { y: number }) {
  const particles = useMemo(() => {
    const temp = [];
    for(let i=0; i<800; i++) {
      temp.push((Math.random() - 0.5) * 5.8, 0, (Math.random() - 0.5) * 5.8);
    }
    return new Float32Array(temp);
  }, []);

  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <Points positions={particles}>
        <PointMaterial transparent color="#3b82f6" size={0.04} sizeAttenuation={true} depthWrite={false} />
      </Points>
      <gridHelper args={[6, 30, '#3b82f6', '#3b82f6']} position={[0, 0.01, 0]} material-opacity={0.15} material-transparent />
      <Line points={[[-3, 0, -3], [3, 0, -3], [3, 0, 3], [-3, 0, 3], [-3, 0, -3]]} color="#3b82f6" lineWidth={1} opacity={0.5} transparent />
    </group>
  );
}

function AttentionLayer({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1, 0.02, 1]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh position={[-1.5, 0.02, -0.5]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh position={[0.5, 0.02, -1.5]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <Line points={[[-3, 0, -3], [3, 0, -3], [3, 0, 3], [-3, 0, 3], [-3, 0, -3]]} color="#10b981" lineWidth={1} opacity={0.5} transparent />
    </group>
  );
}

function ObjectLayer({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <Line points={[[-2, 0.05, -2], [-0.5, 0.05, -2], [-0.5, 0.05, -0.5], [-2, 0.05, -0.5], [-2, 0.05, -2]]} color="#f59e0b" lineWidth={2} />
      <Line points={[[1, 0.05, 0], [2.5, 0.05, 0], [2.5, 0.05, 2], [1, 0.05, 2], [1, 0.05, 0]]} color="#f59e0b" lineWidth={2} />
      <mesh position={[-1.25, 0.05, -1.25]}><sphereGeometry args={[0.06]} /><meshBasicMaterial color="#f59e0b"/></mesh>
      <mesh position={[1.75, 0.05, 1]}><sphereGeometry args={[0.06]} /><meshBasicMaterial color="#f59e0b"/></mesh>
      <Line points={[[-3, 0, -3], [3, 0, -3], [3, 0, 3], [-3, 0, 3], [-3, 0, -3]]} color="#f59e0b" lineWidth={1} opacity={0.5} transparent />
    </group>
  );
}

function SemanticLayer({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <Line points={[[0, 0.05, 0], [-1.5, 0.05, -1.5]]} color="#8b5cf6" lineWidth={2} opacity={0.8} transparent />
      <Line points={[[0, 0.05, 0], [1.5, 0.05, -1]]} color="#8b5cf6" lineWidth={2} opacity={0.8} transparent />
      <Line points={[[0, 0.05, 0], [0, 0.05, 2]]} color="#8b5cf6" lineWidth={2} opacity={0.8} transparent />
      <Line points={[[-1.5, 0.05, -1.5], [-2, 0.05, 1]]} color="#8b5cf6" lineWidth={2} opacity={0.4} transparent />
      
      <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.1]} /><meshBasicMaterial color="#ffffff"/></mesh>
      <mesh position={[-1.5, 0.05, -1.5]}><sphereGeometry args={[0.08]} /><meshBasicMaterial color="#8b5cf6"/></mesh>
      <mesh position={[1.5, 0.05, -1]}><sphereGeometry args={[0.08]} /><meshBasicMaterial color="#8b5cf6"/></mesh>
      <mesh position={[0, 0.05, 2]}><sphereGeometry args={[0.08]} /><meshBasicMaterial color="#8b5cf6"/></mesh>
      <mesh position={[-2, 0.05, 1]}><sphereGeometry args={[0.08]} /><meshBasicMaterial color="#8b5cf6"/></mesh>
      <Line points={[[-3, 0, -3], [3, 0, -3], [3, 0, 3], [-3, 0, 3], [-3, 0, -3]]} color="#8b5cf6" lineWidth={1} opacity={0.5} transparent />
    </group>
  );
}

function Scene({ sourceImage }: { sourceImage: string | null }) {
  return (
    <>
      <OrthographicCamera makeDefault position={[20, 15, 20]} zoom={35} near={-100} far={100} onUpdate={c => c.lookAt(0,0,0)} />
      <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} maxPolarAngle={Math.PI/2.5} minPolarAngle={Math.PI/6} />
      
      <group>
        <Line points={[[0, -4, 0], [0, 4, 0]]} color="#ffffff" opacity={0.3} transparent lineWidth={1} />
        
        <InputLayer url={sourceImage} y={-4} />
        <FeatureLayer y={-2} />
        <AttentionLayer y={0} />
        <ObjectLayer y={2} />
        <SemanticLayer y={4} />

        {LAYERS.map((layer) => (
          <Html key={layer.id} position={[0, layer.y, 0]} zIndexRange={[100, 0]}>
            <div className="flex items-center pointer-events-none ml-[40px] lg:ml-[120px] -mt-[10px] lg:-mt-[12px]">
              <div className="flex items-center opacity-80">
                <div className="w-0 h-0 border-y-[3px] lg:border-y-[4px] border-y-transparent border-r-[4px] lg:border-r-[6px]" style={{ borderRightColor: layer.color }}></div>
                <div className="w-[16px] lg:w-[40px] h-[1px]" style={{ backgroundColor: layer.color }}></div>
              </div>
              <div className="flex flex-col ml-1.5 lg:ml-3 text-left w-24 lg:w-48 shrink-0">
                <span className="text-[9px] lg:text-xs font-bold leading-tight lg:whitespace-nowrap drop-shadow-md" style={{ color: layer.color }}>{layer.title}</span>
                <span className="text-[10px] text-[#a1a1aa] leading-snug hidden lg:block mt-0.5">{layer.desc}</span>
              </div>
            </div>
          </Html>
        ))}
      </group>
    </>
  );
}

export function CenterPane({ sourceImage }: { sourceImage: string | null }) {
  return (
    <div className="w-full h-full bg-[#161618] flex flex-col relative overflow-hidden">
      
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">Analysis Pipeline</h2>
            <Info size={14} className="text-[#a1a1aa]" />
          </div>
          <div className="flex items-center gap-2 text-sm text-[#10B981] font-medium">
            <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
            {sourceImage ? 'Analysis Complete' : 'Awaiting Input'}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full cursor-move">
        <Canvas gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#161618']} />
          <Suspense fallback={null}>
            <Scene sourceImage={sourceImage} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
