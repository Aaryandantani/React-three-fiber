import React, { useState, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Text, TrackballControls } from "@react-three/drei";
import "./App.css";

// Word component
function Word({ position, text, setPara }) {
	const ref = useRef();
	const [hovered, setHovered] = useState(false);
	const fontProps = {
		fontSize: 1.1, // smaller font size for better fit
		letterSpacing: -0.05,
		color: hovered ? "#05719D" : "white",
		anchorX: "center",
		anchorY: "middle",
		outlineWidth: 0.02,
		outlineColor: "#000",
		maxWidth: 8,
		"material-toneMapped": false,
	};
	return (
		<Text
			ref={ref}
			position={position}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
			onClick={(e) => {
				e.stopPropagation();
				setPara(text);
			}}
			onPointerDown={(e) => {
				e.stopPropagation();
				setPara(text);
			}}
			{...fontProps}
		>
			{text}
		</Text>
	);
}

// Cloud component
function Cloud({ count = 10, radius = 20, paragraphs = [], setPara }) {
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

	return items.map((it, idx) => (
		<Word key={idx} position={it.pos} text={it.word} setPara={setPara} />
	));
}

export default function App() {
	const [paragraphs, setParagraphs] = useState([
		// Existing content
		{ para: "Welcome to 3D Text Cloud" },
		{ para: "It will be highlighted" },
		{ para: "And displayed at the top" },
		{ para: "Enjoy the 3D experience!" },
		{ para: "WebGL power in your browser" },
		{ para: "Perfect for data visualization" },
		{ para: "Create amazing user experiences" },
		{ para: "Endless creative possibilities" },
		{ para: "Try dragging to rotate the view" },
		{ para: "Scroll to zoom in and out" },
		{ para: "Right-click and drag to pan" },
		{ para: "Customize colors and styles" },
		{ para: "Share your 3D creations" },

		// New content - Technology
		{ para: "Next generation web graphics" },
		{ para: "Immersive 3D environments" },
		{ para: "Real-time rendering power" },
		{ para: "Interactive data exploration" },
		{ para: "Beautiful visual storytelling" },

		// New content - Features
		{ para: "Smooth animations" },
		{ para: "Responsive design" },
		{ para: "Touch enabled" },
		{ para: "High performance" },
		{ para: "Cross-platform" },

		// New content - Creative
		{ para: "Unleash your creativity" },
		{ para: "Visualize complex ideas" },
		{ para: "Engage your audience" },
		{ para: "Bring data to life" },
		{ para: "Tell compelling stories" },

		// New content - Technical
		{ para: "Built with Three.js" },
		{ para: "React Three Fiber" },
		{ para: "WebGL 2.0" },
		{ para: "Modern JavaScript" },
		{ para: "GPU Accelerated" },

		// New content - Interactive
		{ para: "Drag to rotate" },
		{ para: "Scroll to zoom" },
		{ para: "Right-click to pan" },
		{ para: "Hover to highlight" },
		{ para: "Click to select" },

		// New content - Inspirational
		{ para: "Think differently" },
		{ para: "Create boldly" },
		{ para: "Innovate fearlessly" },
		{ para: "Inspire others" },
		{ para: "Make an impact" },

		// New content - Visual
		{ para: "Dynamic typography" },
		{ para: "Vibrant colors" },
		{ para: "Smooth transitions" },
		{ para: "Clean aesthetics" },
		{ para: "Modern design" },

		// New content - Functionality
		{ para: "Intuitive controls" },
		{ para: "Responsive layout" },
		{ para: "Fast loading" },
		{ para: "Mobile friendly" },
		{ para: "Accessible" },
	]);

	const [selectedPara, setSelectedPara] = useState("");
	const [loading] = useState(false);
	const [error] = useState(null);

	return (
		<div className="app">
			<div className="canvas-container">
				<Canvas camera={{ position: [0, 0, 32], fov: 70 }}>
					<ambientLight intensity={0.5} />
					<pointLight position={[10, 10, 10]} />
					<Cloud count={paragraphs.length} paragraphs={paragraphs} setPara={setSelectedPara} />
					<TrackballControls
						enableZoom={true}
						enablePan={true}
						rotateSpeed={2.0}
						zoomSpeed={1.2}
						panSpeed={0.8}
						dynamicDampingFactor={0.2}
					/>
				</Canvas>
			</div>

			{selectedPara && (
				<div className="paraText">
					{selectedPara}
				</div>
			)}

			{loading && <div className="loadingOverlay">Loading...</div>}
			{error && <div className="errorOverlay">Error: {error}</div>}

			<div className="topLink">
				<a href="#" target="_blank" rel="noopener noreferrer">
					3D Text Cloud
				</a>
			</div>
		</div>
	);
}