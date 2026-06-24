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
                color="#ffcc00"
                lineWidth={4}
            />

            {/* Vector tip */}
            <mesh position={vector}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color="#ffcc00" />
            </mesh>
        </>
    );
}

// i want to ask user for which qubit they want to see the bloch sphere for, and then display the bloch sphere for that qubit. The blochData prop will contain the bloch sphere data for all qubits, and we will use the selected qubit index to get the data for that qubit.   
export default function BlochSphereGraph({ no_qubits, blochData }) {
    const [selectedQubit, setSelectedQubit] = React.useState(0);

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
                <BlochSphere vector={blochData[selectedQubit]} />
                <OrbitControls />
            </Canvas>
        </div>
    );
}