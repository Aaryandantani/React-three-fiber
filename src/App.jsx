import React, { useState, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, TrackballControls } from "@react-three/drei";

// Enhanced Word component with animations
function Word({ position, text, setPara, index }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Animation state
  const originalPosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const targetPosition = useRef(new THREE.Vector3(...position));
  const currentPosition = useRef(new THREE.Vector3(...position));
  const scale = useRef(1);
  const targetScale = useRef(1);

  useFrame((state, delta) => {
    if (ref.current) {
      // Smooth position animation
      currentPosition.current.lerp(targetPosition.current, delta * 3);
      ref.current.position.copy(currentPosition.current);
      
      // Smooth scale animation
      scale.current = THREE.MathUtils.lerp(scale.current, targetScale.current, delta * 5);
      ref.current.scale.setScalar(scale.current);
      
      // Gentle floating animation
      const time = state.clock.elapsedTime;
      const floatOffset = Math.sin(time * 0.5 + index * 0.3) * 0.1;
      ref.current.position.y += floatOffset;
      
      // Subtle rotation on hover
      if (hovered) {
        ref.current.rotation.y = Math.sin(time * 2) * 0.1;
      } else {
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, delta * 3);
      }
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    targetScale.current = 1.2;
    // Slight outward movement on hover
    const direction = originalPosition.clone().normalize();
    targetPosition.current = originalPosition.clone().add(direction.multiplyScalar(1.5));
  };

  const handlePointerOut = () => {
    setHovered(false);
    targetScale.current = 1;
    targetPosition.current = originalPosition.clone();
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    setPara(text);
    
    // Click animation
    targetScale.current = 0.8;
    setTimeout(() => {
      targetScale.current = 1.2;
      setTimeout(() => {
        targetScale.current = 1;
        setClicked(false);
      }, 150);
    }, 100);
  };

  const fontProps = {
    fontSize: 1.1,
    letterSpacing: -0.05,
    color: clicked ? "#FF6B6B" : hovered ? "#05719D" : "#FFFFFF",
    anchorX: "center",
    anchorY: "middle",
    outlineWidth: hovered ? 0.03 : 0.02,
    outlineColor: hovered ? "#0891b2" : "#000000",
    maxWidth: 8,
    "material-toneMapped": false,
    "material-transparent": true,
    "material-opacity": hovered ? 1 : 0.9,
  };

  return (
    <Text
      ref={ref}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      onPointerDown={handleClick}
      {...fontProps}
    >
      {text}
    </Text>
  );
}

// Enhanced Cloud component
function Cloud({ count = 10, radius = 20, paragraphs = [], setPara }) {
  const groupRef = useRef();
  
  // Slow rotation animation for the entire cloud
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const items = useMemo(() => {
    const words = paragraphs
      .filter((p) => p && p.para)
      .map((p) => p.para);

    const temp = [];
    const spherical = new THREE.Spherical();
    const total = Math.min(count, words.length);

    for (let i = 0; i < total; i++) {
      const phi = Math.acos(1 - (2 * i) / (total - 1)) * 0.8;
      const theta = 2 * Math.PI * i * 0.618033988749895;
      spherical.set(radius, phi, theta);
      const pos = new THREE.Vector3().setFromSpherical(spherical);
      temp.push({
        pos: [
          pos.x * (1 + Math.random() * 0.1),
          pos.y * (1 + Math.random() * 0.1),
          pos.z * (1 + Math.random() * 0.1)
        ],
        word: words[i]
      });
    }
    return temp;
  }, [paragraphs, count, radius]);

  return (
    <group ref={groupRef}>
      {items.map((it, idx) => (
        <Word 
          key={idx} 
          position={it.pos} 
          text={it.word} 
          setPara={setPara} 
          index={idx}
        />
      ))}
    </group>
  );
}

// Animated background particles
function BackgroundParticles() {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200
        ],
        scale: Math.random() * 0.5 + 0.1
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        particle.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.01;
        particle.rotation.z = state.clock.elapsedTime * 0.2 + i;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position} scale={particle.scale}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color="#05719D" 
            transparent 
            opacity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function App() {
  const [paragraphs] = useState([
    { para: "Welcome to 3D Text Cloud" },
    { para: "Interactive Experience" },
    { para: "Beautiful Animations" },
    { para: "Modern Web Technology" },
    { para: "Three.js Power" },
    { para: "React Three Fiber" },
    { para: "WebGL Graphics" },
    { para: "Immersive Design" },
    { para: "Creative Visualization" },
    { para: "Dynamic Typography" },
    { para: "Smooth Interactions" },
    { para: "Responsive Controls" },
    { para: "Engaging Interface" },
    { para: "Visual Storytelling" },
    { para: "Data Visualization" },
    { para: "Next Generation UI" },
    { para: "Cross Platform" },
    { para: "High Performance" },
    { para: "GPU Accelerated" },
    { para: "Real-time Rendering" },
    { para: "Touch Enabled" },
    { para: "Mobile Friendly" },
    { para: "Accessibility Ready" },
    { para: "Fast Loading" },
    { para: "Clean Architecture" },
    { para: "Scalable Design" },
    { para: "Modern JavaScript" },
    { para: "Component Based" },
    { para: "Reusable Code" },
    { para: "Best Practices" },
    { para: "Professional Quality" },
    { para: "Enterprise Ready" },
    { para: "Open Source" },
    { para: "Community Driven" },
    { para: "Continuous Innovation" },
    { para: "Future Proof" },
    { para: "Industry Standard" },
    { para: "Production Ready" },
    { para: "Scalable Solution" },
    { para: "Cutting Edge" },
  ]);

  const [selectedPara, setSelectedPara] = useState("");
  const [loading] = useState(false);
  const [error] = useState(null);

  // Auto-clear selected text after 5 seconds
  useEffect(() => {
    if (selectedPara) {
      const timer = setTimeout(() => {
        setSelectedPara("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedPara]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
    }}>
      {/* Enhanced Canvas */}
      <Canvas 
        camera={{ position: [0, 0, 32], fov: 70 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#05719D" />
        <spotLight
          position={[20, 20, 20]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#ffffff"
        />
        
        <BackgroundParticles />
        <Cloud count={paragraphs.length} paragraphs={paragraphs} setPara={setSelectedPara} />
        
        <TrackballControls
          enableZoom={true}
          enablePan={true}
          rotateSpeed={1.5}
          zoomSpeed={1.0}
          panSpeed={0.6}
          dynamicDampingFactor={0.15}
          minDistance={15}
          maxDistance={100}
        />
      </Canvas>

      {/* Enhanced UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10
      }}>
        {/* Top Header */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '12px 24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h1 style={{
              margin: 0,
              color: 'white',
              fontSize: '24px',
              fontWeight: '600',
              textShadow: '0 0 20px rgba(5, 113, 157, 0.5)'
            }}>
              3D Text Cloud
            </h1>
          </div>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '8px 16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px'
          }}>
            Drag • Scroll • Click
          </div>
        </div>

        {/* Selected Text Display */}
        {selectedPara && (
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(5, 113, 157, 0.95)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            padding: '20px 40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease-out',
            maxWidth: '80vw',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '500',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              lineHeight: 1.4
            }}>
              {selectedPara}
            </div>
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '20px',
              width: '16px',
              height: '16px',
              background: 'linear-gradient(45deg, #05719D, #0891b2)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
          </div>
        )}

        {/* Instructions */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '12px 16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '12px',
          lineHeight: 1.5,
          maxWidth: '200px'
        }}>
          <div style={{ marginBottom: '4px', color: 'white', fontWeight: '500' }}>Controls:</div>
          <div>• Hover to highlight</div>
          <div>• Click to select</div>
          <div>• Drag to rotate</div>
          <div>• Scroll to zoom</div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '18px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(5, 113, 157, 0.3)',
              borderTop: '3px solid #05719D',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 15px'
            }} />
            Loading...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(220, 38, 38, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '20px 30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '16px',
            textAlign: 'center'
          }}>
            ⚠️ Error: {error}
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}