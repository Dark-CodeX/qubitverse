import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";

function BlochSphere({ vector }) {
    return (
        <>
            {/* Sphere */}
            <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    wireframe
                    transparent
                    opacity={0.2}
                    color="beige"
                />
            </mesh>

            {/* Axes */}
            <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="#ff5555" />
            <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} color="#55ff55" />
            <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} color="#5599ff" />

            {/* Labels */}
            <Text position={[1.35, 0, 0]} fontSize={0.1} color="#ff5555">
                X
            </Text>

            <Text position={[0, 1.35, 0]} fontSize={0.1} color="#55ff55">
                Y
            </Text>

            <Text position={[0, 0, 1.35]} fontSize={0.1} color="#5599ff">
                Z
            </Text>

            {/* Bloch labels */}
            <Text position={[0, 0, 1.15]} fontSize={0.1} color="grey">
                |0⟩
            </Text>

            <Text position={[0, 0, -1.15]} fontSize={0.1} color="grey">
                |1⟩
            </Text>

            {/* Vector */}
            <Line
                points={[
                    [0, 0, 0],
                    vector
                ]}
                color="blue"
                lineWidth={4}
            />

            {/* Vector tip (Updated to Cone) */}
            <mesh
                position={vector}
                onUpdate={(self) => {
                    self.lookAt(0, 0, 0);
                    self.rotateX(-Math.PI / 2);
                }}
            >
                {/* args: [radius, height, radialSegments] */}
                <coneGeometry args={[0.04, 0.12, 16]} />
                <meshBasicMaterial color="blue" />
            </mesh>
        </>
    );
}

export default function BlochSphereGraph({ no_qubits, blochData }) {
    const [selectedQubit, setSelectedQubit] = React.useState(0);
    const [currentBlochData, setCurrentBlochData] = React.useState(blochData[selectedQubit]);

    useEffect(() => {
        var d = blochData[selectedQubit];
        d = [d.x, d.y, d.z];
        setCurrentBlochData(d);
    }, [selectedQubit, blochData]);


    const handleQubitChange = (event) => {
        setSelectedQubit(parseInt(event.target.value));
    };

    return (
        <div>
            <div className="mb-4">
                <label htmlFor="qubit-select" className="mr-2 font-semibold">
                    Select Qubit:
                </label>
                <select
                    id="qubit-select"
                    value={selectedQubit}
                    onChange={handleQubitChange}
                    className="border rounded p-1"
                >
                    {Array.from({ length: no_qubits }, (_, index) => (
                        <option key={index} value={index}>
                            Qubit {index + 1}
                        </option>
                    ))}
                </select>
            </div>
            <Canvas style={{ height: "calc(100vh - 185px)", background: "#ffffff" }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <BlochSphere vector={currentBlochData} />
                <OrbitControls />
            </Canvas>
        </div>
    );
}