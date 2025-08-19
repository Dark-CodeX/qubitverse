import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Rect, Text, Group, Circle, Shape } from "react-konva";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import SendToBackEnd_Calculate from "./SendToBackEnd";
import { Button } from "./ui/button";
import ProbGraph from "./ProbGraph";
import HilbertSpaceResult from "./HilbertSpaceResult";
import { DataSet } from "vis-network/standalone";
import MeasurementChart from "./MeasurementChart";

// =======================
// CONFIG CONSTANTS
// =======================
const qubitSpacing = 50; // vertical spacing between qubit lines
const gateSize = 45; // width/height for single-qubit gate squares
const canvasMinX = 50; // left bound for gates on the stage
const canvasMaxX = window.innerWidth-300 - gateSize; // right bound so gate stays visible


// =======================
// GATE LIST
// =======================
const gatesList = [
    "I",
    "X",
    "Y",
    "Z",
    "H",
    "S",
    "T",
    "P",
    "Rx",
    "Ry",
    "Rz",
    "V",
    "V†",
    "CNOT",
    "CZ",
    "SWAP",
    "M"
];

// =======================
// GATE TOOLTIP DATA (LaTeX + descriptions)
// =======================
const gateTooltips = {
    I: {
        desc: "Identity Gate",
        latex: "$$I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$$",
    },
    X: {
        desc: "Pauli-X (NOT) Gate",
        latex: "$$X = \\begin{pmatrix}0 & 1\\\\ 1 & 0\\end{pmatrix}$$",
    },
    Y: {
        desc: "Pauli-Y Gate",
        latex: "$$Y = \\begin{pmatrix}0 & -i\\\\ i & 0\\end{pmatrix}$$",
    },
    Z: {
        desc: "Pauli-Z Gate",
        latex: "$$Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$",
    },
    S: {
        desc: "Phase π/2 Shift",
        latex: "$$S = \\begin{pmatrix} 1 & 0 \\\\ 0 & i \\end{pmatrix}$$",
    },
    T: {
        desc: "Phase π/4 Shift",
        latex: "$$T = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{iπ/4} \\end{pmatrix}$$",
    },
    H: {
        desc: "Hadamard (Superposition) Gate",
        latex:
            "$$H = \\frac{1}{\\sqrt{2}} \\begin{pmatrix}1 & 1\\\\ 1 & -1\\end{pmatrix}$$",
    },
    P: {
        desc: "General Phase Shift Gate",
        latex:
            "$$P(\\theta) = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\theta} \\end{pmatrix}$$",
    },
    Rx: {
        desc: "Rotation around X-axis",
        latex:
            "$$R_x(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -i\\sin(\\theta/2) \\\\ -i\\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}$$",
    },
    Ry: {
        desc: "Rotation around Y-axis",
        latex:
            "$$R_y(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -\\sin(\\theta/2) \\\\ \\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}$$",
    },
    Rz: {
        desc: "Rotation around Z-axis",
        latex:
            "$$R_z(\\theta) = \\begin{pmatrix} e^{-i\\theta/2} & 0 \\\\ 0 & e^{i\\theta/2} \\end{pmatrix}$$",
    },
    V: {
        desc: "Square-root of NOT Gate (alias for √X)",
        latex:
            "$$V = \\frac{1}{2} \\begin{pmatrix} 1 + i & 1 - i \\\\ 1 - i & 1 + i \\end{pmatrix}$$",
    },
    "V†": {
        desc: "Adjoint of the V gate (alias for (√X)⁻¹)",
        latex:
            "$$V† = \\frac{1}{2} \\begin{pmatrix} 1 - i & 1 + i \\\\ 1 + i & 1 - i \\end{pmatrix}$$",
    },
    CNOT: {
        desc: "Controlled-NOT (Entanglement) Gate",
        latex:
            "$$CNOT = \\begin{pmatrix}1 & 0 & 0 & 0\\\\ 0 & 1 & 0 & 0\\\\ 0 & 0 & 0 & 1\\\\ 0 & 0 & 1 & 0\\end{pmatrix}$$",
    },
    CZ: {
        desc: "Controlled-Z Gate",
        latex:
            "$$CZ = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & -1 \\end{pmatrix}$$",
    },
    SWAP: {
        desc: "SWAP Gate",
        latex:
            "$$SWAP = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}$$",
    },
    M: {
        desc: "Measure",
        latex:
            "$$\\text{Measure }n^{\\text{th}}\\text{ Qubit}$$"
    }
};


// Helper to clamp a value between min and max
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

// =======================
// SINGLE-QUBIT GATE COMPONENT
// =======================
const QuantumGate = ({
    x,
    y,
    text,
    draggable,
    onDragEnd,
    fixedY,
    onRightClick,
    order,
    params = {},
}) => {
    const isRotationGate = params.theta !== undefined;
    let thetalength = 0;
    if (params.theta != null) {
        thetalength = params.theta.toString().length;
    }
    return (
        <Group
            draggable={draggable}
            x={x}
            y={y}
            dragBoundFunc={
                fixedY !== undefined
                    ? (pos) => ({
                        x: clamp(pos.x, canvasMinX, canvasMaxX),
                        y: fixedY,
                    })
                    : undefined
            }
            onDragEnd={onDragEnd}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                onRightClick();
            }}
        >
            <Rect
                width={gateSize}
                height={gateSize}
                fill="white"
                stroke="black"
                strokeWidth={2}
                cornerRadius={5}
            />
            <Text
                text={text}
                fontSize={16}
                fontFamily="Fira Code, monospace"
                x={text.length > 1 ? gateSize / 2 - 10 : gateSize / 2 - 5}
                y={gateSize / 2 - 10}
            />
            {isRotationGate && (
                <Text
                    text={`${params.theta}°`}
                    fontSize={10}
                    x={thetalength === 1 ? gateSize / 2 - 19 : gateSize / 2 - 20}
                    y={gateSize / 2 + 8}
                    width={gateSize - 4}
                    align="center"
                />
            )}
            {order !== undefined && (
                <Text
                    text={String(order)}
                    fontSize={12}
                    fill="red"
                    x={gateSize - 10}
                    y={3}
                />
            )}
        </Group>
    );
};

// =======================
// CNOT GATE COMPONENT
// =======================
const CNOTGate = ({ x, control, target, onDragEnd, onRightClick, order }) => {
    const yControl = (control + 1) * qubitSpacing;
    const yTarget = (target + 1) * qubitSpacing;
    return (
        <Group
            draggable
            x={x}
            y={0}
            dragBoundFunc={(pos) => ({
                x: clamp(pos.x, canvasMinX, canvasMaxX),
                y: 0,
            })}
            onDragEnd={onDragEnd}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                onRightClick();
            }}
        >
            <Line points={[0, yControl, 0, yTarget]} stroke="black" strokeWidth={2} />
            <Circle x={0} y={yControl} radius={6} fill="black" />
            <Circle x={0} y={yTarget} radius={10} stroke="black" strokeWidth={2} />
            <Line points={[-6, yTarget, 6, yTarget]} stroke="black" strokeWidth={2} />
            <Line
                points={[0, yTarget - 6, 0, yTarget + 6]}
                stroke="black"
                strokeWidth={2}
            />
            {order !== undefined && (
                <Text
                    text={String(order)}
                    fontSize={12}
                    fill="red"
                    x={5}
                    y={(yControl + yTarget) / 2 - 5}
                />
            )}
        </Group>
    );
};

// =======================
// CZ GATE COMPONENT
// =======================
const CZGate = ({
    x,
    control,
    target,
    onDragStart,
    onDragEnd,
    onRightClick,
    order,
}) => {
    const yControl = (control + 1) * qubitSpacing;
    const yTarget = (target + 1) * qubitSpacing;
    return (
        <Group
            draggable
            x={x}
            y={0}
            dragBoundFunc={(pos) => ({
                x: clamp(pos.x, canvasMinX, canvasMaxX),
                y: 0,
            })}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                onRightClick();
            }}
        >
            <Line points={[0, yControl, 0, yTarget]} stroke="black" strokeWidth={2} />
            <Circle x={0} y={yControl} radius={6} fill="black" />
            <Rect
                x={-20}
                y={yTarget - 20}
                width={40}
                height={40}
                fill="white"
                stroke="black"
                strokeWidth={2}
                cornerRadius={5}
            />
            <Text
                text="Z"
                fontSize={18}
                x={-6}
                y={yTarget - 8}
                fontFamily="Fira Code, monospace"
            />
            {order !== undefined && (
                <Text
                    text={String(order)}
                    fontSize={12}
                    fill="red"
                    x={5}
                    y={(yControl + yTarget) / 2 - 5}
                />
            )}
        </Group>
    );
};

// =======================
// SWAP GATE COMPONENT
// =======================
const SWAPGate = ({
    x,
    qubit1,
    qubit2,
    onDragStart,
    onDragEnd,
    onRightClick,
    order,
}) => {
    const y1 = (qubit1 + 1) * qubitSpacing;
    const y2 = (qubit2 + 1) * qubitSpacing;
    const topY = Math.min(y1, y2);
    const bottomY = Math.max(y1, y2);
    return (
        <Group
            draggable
            x={x}
            y={0}
            dragBoundFunc={(pos) => ({
                x: clamp(pos.x, canvasMinX, canvasMaxX),
                y: 0,
            })}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                onRightClick();
            }}
        >
            <Line points={[0, topY, 0, bottomY]} stroke="black" strokeWidth={2} />
            {/* 'X' cross on qubit1 */}
            <Line points={[-8, y1 - 8, 8, y1 + 8]} stroke="black" strokeWidth={2} />
            <Line points={[8, y1 - 8, -8, y1 + 8]} stroke="black" strokeWidth={2} />
            {/* 'X' cross on qubit2 */}
            <Line points={[-8, y2 - 8, 8, y2 + 8]} stroke="black" strokeWidth={2} />
            <Line points={[8, y2 - 8, -8, y2 + 8]} stroke="black" strokeWidth={2} />
            {order !== undefined && (
                <Text
                    text={String(order)}
                    fontSize={12}
                    fill="red"
                    x={5}
                    y={(topY + bottomY) / 2 - 5}
                />
            )}
        </Group>
    );
};

// =======================
// Measure Nth COMPONENT
// =======================
const MeasureNthComponent = ({
    x,
    y,
    draggable,
    onDragEnd,
    fixedY,
    onRightClick,
    order
}) => {
    return (
        <Group
            x={x}
            y={y}
            draggable={draggable}
            dragBoundFunc={
                fixedY !== undefined
                    ? (pos) => ({
                        x: clamp(pos.x, canvasMinX, canvasMaxX),
                        y: fixedY,
                    })
                    : undefined
            }
            onDragEnd={onDragEnd}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                onRightClick();
            }}
        >
            {/* Rectangle Border */}
            <Rect
                width={gateSize}
                height={gateSize}
                fill="white"
                stroke="black"
                strokeWidth={2}
                cornerRadius={5}
            />

            {/* Semicircle */}
            <Shape
                sceneFunc={(context, shape) => {
                    context.beginPath();
                    context.arc(gateSize / 2, gateSize / 2 + 5, gateSize / 2.5, Math.PI, 0, false);
                    context.strokeShape(shape);
                }}
                stroke="red"
                strokeWidth={2}
            />

            {/* Diagonal Line */}
            <Line
                points={[gateSize * 0.4, gateSize * 0.7, gateSize * 0.85, gateSize * 0.15]}
                stroke="black"
                strokeWidth={2}
            />
            {/* Small Circle */}
            <Circle x={gateSize * 0.4} y={gateSize * 0.7} radius={3} fill="black" />
            {order !== undefined && (
                <Text
                    text={String(order)}
                    fontSize={12}
                    fill="red"
                    x={gateSize - 10}
                    y={3}
                />
            )}
        </Group>
    );
};

// =======================
// MAIN QUANTUM CIRCUIT COMPONENT
// =======================
const QuantumCircuit = ({ numQubits, setNumQubits }) => {
    // Result or Log Data from the Backend
    const [resultData, setResultData] = useState(null);
    // Probs Data for BarGraph
    const [probData, setProbData] = useState([]);
    // Result Graph Edges
    const [edgesResultGraph, setEdgesResultGraph] = useState(null);
    // Result Graph Vertices
    const [verticesResultGraph, setVerticesResultGraph] = useState(null);
    // Result Measurement
    const [measuredValue, setMeasuredValue] = useState(NaN);
    // Measurement History
    const [measurementHist, setMeasurementHist] = useState([]);
    // Single-qubit gates
    const [gates, setGates] = useState([]); // { x, y, text, params? }
    // CNOT gates
    const [cnotGates, setCnotGates] = useState([]); // { x, control, target }
    // CZ gates
    const [czGates, setCzGates] = useState([]); // { x, control, target }
    // SWAP gates
    const [swapGates, setSwapGates] = useState([]); // { x, qubit1, qubit2 }
    // Measure Nth Qubit 
    const [measureNthQubit, setMeasureNthQubit] = useState([]); // {x, y}
    // Error to show when delete Qubit is clicked and numQubits goes less than 1
    const [delQubError, setDelQubError] = useState(false);

    // For rotation/phase gates
    const [rotationModalOpen, setRotationModalOpen] = useState(false);
    const [rotationValue, setRotationValue] = useState(45);
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const [rotationType, setRotationType] = useState("P");

    // For CNOT selection
    const [cnotModalOpen, setCnotModalOpen] = useState(false);
    const [cnotX, setCnotX] = useState(0);
    const [cnotControl, setCnotControl] = useState(0);
    const [cnotTarget, setCnotTarget] = useState(1);

    // For CZ selection
    const [czModalOpen, setCzModalOpen] = useState(false);
    const [czX, setCzX] = useState(0);
    const [czControl, setCzControl] = useState(0);
    const [czTarget, setCzTarget] = useState(1);

    // For SWAP selection
    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [swapX, setSwapX] = useState(0);
    const [swapQubit1, setSwapQubit1] = useState(0);
    const [swapQubit2, setSwapQubit2] = useState(1);

    // Tooltip state
    const [tooltip, setTooltip] = useState({
        visible: false,
        x: 0,
        y: 0,
        desc: "",
        latex: "",
    });
    const [isDragging, setIsDragging] = useState(false);

    // Tabs state ("Circuit" or "Result")
    const [activeTab, setActiveTab] = useState("Circuit");

    const stageRef = useRef(null);

    // =======================
    // ORDERING: Combined ordering for all gates on a qubit line
    // =======================
    const combinedGroups = {};
    // Single-qubit
    gates.forEach((g, i) => {
        const qid = Math.round((g.y + gateSize / 2) / qubitSpacing) - 1;
        if (!combinedGroups[qid]) combinedGroups[qid] = [];
        combinedGroups[qid].push({ type: "single", index: i, x: g.x });
    });
    // CNOT
    cnotGates.forEach((g, i) => {
        const qid = g.control;
        if (!combinedGroups[qid]) combinedGroups[qid] = [];
        combinedGroups[qid].push({ type: "cnot", index: i, x: g.x });
    });
    // CZ
    czGates.forEach((g, i) => {
        const qid = g.control;
        if (!combinedGroups[qid]) combinedGroups[qid] = [];
        combinedGroups[qid].push({ type: "cz", index: i, x: g.x });
    });
    // SWAP
    swapGates.forEach((g, i) => {
        const qid = Math.min(g.qubit1, g.qubit2);
        if (!combinedGroups[qid]) combinedGroups[qid] = [];
        combinedGroups[qid].push({ type: "swap", index: i, x: g.x });
    });
    // Measure Nth Qubit
    measureNthQubit.forEach((g, i) => {
        const qid = Math.round((g.y + gateSize / 2) / qubitSpacing) - 1;
        if (!combinedGroups[qid]) combinedGroups[qid] = [];
        combinedGroups[qid].push({ type: "measure", index: i, x: g.x });
    });

    const combinedOrders = {
        single: {},
        cnot: {},
        cz: {},
        swap: {},
        measure: {}
    };
    Object.keys(combinedGroups).forEach((qid) => {
        combinedGroups[qid].sort((a, b) => a.x - b.x);
        combinedGroups[qid].forEach((item, orderIndex) => {
            if (item.type === "single") {
                combinedOrders.single[item.index] = orderIndex + 1;
            } else if (item.type === "cnot") {
                combinedOrders.cnot[item.index] = orderIndex + 1;
            } else if (item.type === "cz") {
                combinedOrders.cz[item.index] = orderIndex + 1;
            } else if (item.type === "swap") {
                combinedOrders.swap[item.index] = orderIndex + 1;
            } else if (item.type === "measure") {
                combinedOrders.measure[item.index] = orderIndex + 1;
            }
        });
    });

    // =======================
    // QUBIT LINE COMPONENT
    // =======================
    const QubitLine = ({ y, label }) => (
        <Group>
            <Text
                text={label}
                fontStyle="1000"
                fontSize={20}
                x={10}
                y={y - 20}
                fill="#4169E1"
                listening={true}
            />
            <Line
                points={[50, y, window.innerWidth ,y]}
                stroke="black"
                strokeWidth={2}
            />
        </Group>
    );

    // =======================
    // Helper: snap single-qubit gates to a line
    // =======================
    const snapY = (pointerY) => {
        const desiredCenter = Math.round(pointerY / qubitSpacing) * qubitSpacing;
        const clampedCenter = Math.max(
            qubitSpacing,
            Math.min(desiredCenter, numQubits * qubitSpacing)
        );
        return clampedCenter - gateSize / 2;
    };

    // =======================
    // DRAG & DROP LOGIC
    // =======================

    useEffect(() => {
        if (!stageRef.current) return;
        const container = stageRef.current.container();

        const handleDrop = (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const pointerX = e.clientX - rect.left;
            const pointerY = e.clientY - rect.top;
            const gateType = e.dataTransfer.getData("text/plain");
            if (!gateType) return;

            if (gateType === "CNOT") {
                setCnotModalOpen(true);
                setCnotX(pointerX);
            } else if (gateType === "CZ") {
                setCzModalOpen(true);
                setCzX(pointerX);
            } else if (gateType === "SWAP") {
                setSwapModalOpen(true);
                setSwapX(pointerX);
            } else if (["P", "Rx", "Ry", "Rz"].includes(gateType)) {
                const snappedY = snapY(pointerY);
                setRotationModalOpen(true);
                setRotationX(pointerX);
                setRotationY(snappedY);
                setRotationType(gateType);
                setRotationValue(45); // default value
            } else if (gateType === "M") {
                const snappedY = snapY(pointerY);
                setMeasureNthQubit((prev) => [
                    ...prev,
                    { x: pointerX, y: snappedY, },
                ]);
            } else {
                // Single-qubit gate
                const snappedY = snapY(pointerY);
                setGates((prev) => [
                    ...prev,
                    { x: pointerX, y: snappedY, text: gateType },
                ]);
            }
        };

        const handleDragOver = (e) => e.preventDefault();

        container.addEventListener("drop", handleDrop);
        container.addEventListener("dragover", handleDragOver);

        return () => {
            container.removeEventListener("drop", handleDrop);
            container.removeEventListener("dragover", handleDragOver);
        };
    }, [stageRef.current, numQubits]);

    // =======================
    // DRAG END HANDLERS
    // =======================
    const handleGateDragEnd = (e, index) => {
        const { x } = e.target.position();
        setGates((prev) => {
            const newGates = [...prev];
            newGates[index] = {
                ...newGates[index],
                x: clamp(x, canvasMinX, canvasMaxX),
            };
            return newGates;
        });
        setIsDragging(false);
    };

    const handleMeasureDragEnd = (e, index) => {
        const { x } = e.target.position();
        setMeasureNthQubit((prev) => {
            const newArr = [...prev];
            newArr[index] = {
                ...newArr[index],
                x: clamp(x, canvasMinX, canvasMaxX),
            };
            return newArr;
        });
        setIsDragging(false);
    }

    const handleCnotDragEnd = (e, index) => {
        const { x } = e.target.position();
        setCnotGates((prev) => {
            const newArr = [...prev];
            newArr[index].x = clamp(x, canvasMinX, canvasMaxX);
            return newArr;
        });
        setIsDragging(false);
    };

    const handleCzDragEnd = (e, index) => {
        const { x } = e.target.position();
        setCzGates((prev) => {
            const newArr = [...prev];
            newArr[index].x = clamp(x, canvasMinX, canvasMaxX);
            return newArr;
        });
        setIsDragging(false);
    };

    const handleSwapDragEnd = (e, index) => {
        const { x } = e.target.position();
        setSwapGates((prev) => {
            const newArr = [...prev];
            newArr[index].x = clamp(x, canvasMinX, canvasMaxX);
            return newArr;
        });
        setIsDragging(false);
    };

    // =======================
    // DELETE HANDLERS (Right-click)
    // =======================
    const handleDeleteGate = (index) => {
        setGates((prev) => prev.filter((_, i) => i !== index));
    };
    const handleDeleteCnot = (index) => {
        setCnotGates((prev) => prev.filter((_, i) => i !== index));
    };
    const handleDeleteCz = (index) => {
        setCzGates((prev) => prev.filter((_, i) => i !== index));
    };
    const handleDeleteSwap = (index) => {
        setSwapGates((prev) => prev.filter((_, i) => i !== index));
    };
    const handleDeleteMeasure = (index) => {
        setMeasureNthQubit((prev) => prev.filter((_, i) => i !== index));
    }

    // =======================
    // TOOLTIP HANDLERS
    // =======================
    const handleTooltipEnter = (e, gate) => {
        if (isDragging) return;
        const rect = e.target.getBoundingClientRect();
        setTooltip({
            visible: true,
            x: rect.left + 120,
            y: rect.bottom - 100,
            desc: gateTooltips[gate].desc,
            latex: gateTooltips[gate].latex,
        });
    };

    const handleTooltipLeave = () => {
        setTooltip({ visible: false, x: 0, y: 0, desc: "", latex: "" });
    };

    const handleDragStart = () => {
        setIsDragging(true);
        setTooltip((prev) => ({ ...prev, visible: false }));
    };

    // =======================
    // ROTATION/PHASE GATE MODAL HANDLERS
    // =======================
    const validateRotationValue = (value) => (value === 0 ? 1 : value);
    const handleRotationConfirm = () => {
        const validTheta = validateRotationValue(rotationValue);
        setGates((prev) => [
            ...prev,
            {
                x: rotationX,
                y: rotationY,
                text: rotationType,
                params: { theta: validTheta },
            },
        ]);
        setRotationModalOpen(false);
    };
    const handleRotationCancel = () => {
        setRotationModalOpen(false);
    };
    const handleRotationInputChange = (e) => {
        const val = parseFloat(e.target.value) || 1;
        setRotationValue(val === 0 ? 1 : val);
    };
    const getRotationModalContent = () => {
        switch (rotationType) {
            case "Rx":
                return {
                    title: "Rotation around X-axis (θ)",
                    latex:
                        "$$R_x(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -i\\sin(\\theta/2) \\\\ -i\\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}$$",
                };
            case "Ry":
                return {
                    title: "Rotation around Y-axis (θ)",
                    latex:
                        "$$R_y(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -\\sin(\\theta/2) \\\\ \\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}$$",
                };
            case "Rz":
                return {
                    title: "Rotation around Z-axis (θ)",
                    latex:
                        "$$R_z(\\theta) = \\begin{pmatrix} e^{-i\\theta/2} & 0 \\\\ 0 & e^{i\\theta/2} \\end{pmatrix}$$",
                };
            default:
                return {
                    title: "Phase Angle (θ)",
                    latex:
                        "$$P(\\theta) = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\theta} \\end{pmatrix}$$",
                };
        }
    };

    // =======================
    // CNOT MODAL HANDLERS
    // =======================
    const handleCnotConfirm = () => {
        if (cnotControl === cnotTarget) {
            alert("Control and target qubits must be different!");
            return;
        }
        setCnotGates((prev) => [
            ...prev,
            { x: cnotX, control: cnotControl, target: cnotTarget },
        ]);
        setCnotModalOpen(false);
    };
    const handleCnotCancel = () => {
        setCnotModalOpen(false);
    };

    // =======================
    // CZ MODAL HANDLERS
    // =======================
    const handleCzConfirm = () => {
        if (czControl === czTarget) {
            alert("Control and target qubits must be different!");
            return;
        }
        setCzGates((prev) => [
            ...prev,
            { x: czX, control: czControl, target: czTarget },
        ]);
        setCzModalOpen(false);
    };
    const handleCzCancel = () => {
        setCzModalOpen(false);
    };

    // =======================
    // SWAP MODAL HANDLERS
    // =======================
    const handleSwapConfirm = () => {
        if (swapQubit1 === swapQubit2) {
            alert("SWAP requires two distinct qubits!");
            return;
        }
        setSwapGates((prev) => [
            ...prev,
            { x: swapX, qubit1: swapQubit1, qubit2: swapQubit2 },
        ]);
        setSwapModalOpen(false);
    };
    const handleSwapCancel = () => {
        setSwapModalOpen(false);
    };

    // =======================
    // Add or Remove Qubits
    // =======================
    const handleAddQubit = () => {
        let q = numQubits + 1;
        setNumQubits(q);
        setMeasurementHist([]);
    }

    const handleDeleteQubit = () => {
        const newNumQubits = numQubits - 1;

        if (newNumQubits < 1) {
            setDelQubError(true);
            return;
        }

        setGates(prevGates =>
            prevGates.filter(g => {
                const gateQubit = Math.round((g.y + gateSize / 2) / qubitSpacing) - 1;
                return gateQubit < newNumQubits;
            })
        );

        setMeasureNthQubit(prevMeasures =>
            prevMeasures.filter(g => {
                const gateQubit = Math.round((g.y + gateSize / 2) / qubitSpacing) - 1;
                return gateQubit < newNumQubits;
            })
        );

        setCnotGates(prevCnot =>
            prevCnot.filter(g => g.control < newNumQubits && g.target < newNumQubits)
        );
        setCzGates(prevCz =>
            prevCz.filter(g => g.control < newNumQubits && g.target < newNumQubits)
        );

        setSwapGates(prevSwap =>
            prevSwap.filter(g => g.qubit1 < newNumQubits && g.qubit2 < newNumQubits)
        );

        setNumQubits(newNumQubits);

        setMeasurementHist([]);
    }
const [Dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const boxRef = useRef(null);

  const startDrag = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!Dragging) return;
    setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (Dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [Dragging, offset]);

    return (
        <MathJaxContext>
            <div className="p-4">
                {/* Tab Buttons */}
                <div className="sticky top-0 left-[220px] right-0 bg-white z-50 flex space-x-4 border-b mb-4 py-2 px-4">
                    {["Circuit", "Result", "Measurement", "Probability", "Log"].map((tab) => (
                        <button
                            key={tab}
                            className={`p-2 transition-all ${activeTab === tab
                                ? "border-b-2 border-blue-500 font-bold text-blue-500"
                                : "text-gray-500 hover:text-blue-500"
                                }`}
                            style={{
                                cursor: "pointer",
                                userSelect: "none"
                            }}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Left Menu: single box with gates on top and 3 buttons below */}
                
                <div  
                    style={{
                       position: "absolute", // important for dragging
                        left: position.x,
                        top: position.y,
                        width: "18%",
                        height:"350px",
                        border: "3px solid black",
                        borderRadius: "5px",
                        background: "white",
                        paddingBottom: "10px",
                        paddingRight: "10px",
                        paddingLeft: "10px",
                        zIndex: 100, // keep above the stage
                        resize: "vertical",
                        overflowY: "auto",
                        cursor: Dragging ? "grabbing" : "grab",
                        scrollbarWidth: "none"

                    }}
                >
                    <div ref={boxRef} onMouseDown={startDrag}
                    style={{
                        position:"sticky",
                        top:"0",
                        width:"100%",
                        background:"#fff",
                        paddingTop:"10px"
                        
                    }}>
                    <h2 className="text-l font-bold text-gray-800" style={{ userSelect: "none", textAlign: "center" }}>Quantum Gates</h2>
                    </div>
                    {/* Gates box */}
                    <div
                        style={{
                            border: "1px solid black",
                            borderRadius: "5px",
                            width: "100%",
                            height:"250px",
                            padding: "5px",
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            marginBottom: "10px",
                            overflowY: "auto",
                            scrollbarWidth:"none",
                        }}
                    >
                        {gatesList.map((gate, index) => {
                            // Hide multi-qubit gates if only 1 qubit
                            if (numQubits < 2 && ["CNOT", "CZ", "SWAP"].includes(gate)) {
                                return null;
                            }

                            const isActive = activeTab === "Circuit";
                            const defaultBackground = isActive ? "white" : "#eee";

                            return (
                                <div
                                    key={index}
                                    style={{
                                        width: gateSize - 1,
                                        height: gateSize - 1,
                                        userSelect: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "2px solid black",
                                        borderRadius: "5px",
                                        cursor: isActive ? "grab" : "not-allowed",
                                        background: defaultBackground,
                                        fontFamily: "Fira Code, monospace",
                                        transition: "background-color 0.2s ease",
                                        margin: "5px",
                                        opacity: isActive ? 1 : 0.5,
                                        pointerEvents: isActive ? "auto" : "none", // prevent interaction when locked
                                    }}
                                    draggable={isActive}
                                    onDragStart={(e) => {
                                        if (isActive) {
                                            e.dataTransfer.setData("text/plain", gate);
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        if (isActive) handleTooltipEnter(e, gate);
                                    }}
                                    onMouseMove={(e) => {
                                        if (isActive) {
                                            e.currentTarget.style.background = "oklch(80.9% 0.105 251.813)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = defaultBackground;
                                        if (isActive) handleTooltipLeave(e);
                                    }}
                                >
                                    {gate}
                                </div>
                            );
                        })}
                    </div>

                    {/* Buttons under gates */}
                    <SendToBackEnd_Calculate gates={gates}
                        cnotGates={cnotGates}
                        czGates={czGates}
                        swapGates={swapGates}
                        measureNthQ={measureNthQubit}
                        numQubits={numQubits}
                        setLog={setResultData}
                        setProbData={setProbData}
                        setEdgesResultGraph={setEdgesResultGraph}
                        setVerticesResultGraph={setVerticesResultGraph}
                        setMeasuredValue={setMeasuredValue}
                        setMeasurementHist={setMeasurementHist}
                        funcAddQubits={handleAddQubit}
                        funcRemoveQubits={handleDeleteQubit} />
                </div>

                {/* Right Content: depends on active tab */}
                <div
                    style={{
                        width:"100%",
                        flex:1,
                        position: "relative",
                        float:"right",
                    }}
                >
                    {/* TOOLTIP */}
                    {!isDragging && tooltip.visible && (
                        <div
                            style={{
                                position: "fixed",
                                top: tooltip.y,
                                left: tooltip.x,
                                background: "rgba(255,255,255,0.97)",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                zIndex: 1000,
                                boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    marginBottom: "4px",
                                    textAlign: "center",
                                    userSelect: "none"
                                }}
                            >
                                {tooltip.desc}
                            </div>
                            <MathJax dynamic inline>
                                {tooltip.latex}
                            </MathJax>
                        </div>
                    )}
                    {activeTab === "Circuit" ? (
                        <>
                            {/* STAGE: QUBIT LINES & GATES */}
                            <Stage
                                key={activeTab}
                                ref={stageRef}
                                width={window.innerWidth-50}
                                height={(numQubits + 1) * qubitSpacing}
                                style={{
                                    border: "3px solid black",
                                    background: "white",
                                    borderRadius: "5px",
                                    overflow: "auto",
                                }}
                            >
                                <Layer>
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <QubitLine
                                            key={i}
                                            y={(i + 1) * qubitSpacing}
                                            label={`Q${i}`}
                                        />
                                    ))}
                                    {/* Render single-qubit gates */}
                                    {gates.map((g, i) => (
                                        <QuantumGate
                                            key={i}
                                            x={g.x}
                                            y={g.y}
                                            text={g.text}
                                            params={g.params}
                                            draggable
                                            fixedY={g.y}
                                            onDragStart={handleDragStart}
                                            onDragEnd={(e) => handleGateDragEnd(e, i)}
                                            onRightClick={() => handleDeleteGate(i)}
                                            order={combinedOrders.single[i]}
                                        />
                                    ))}
                                    {/* Render CNOT gates */}
                                    {cnotGates.map((g, i) => (
                                        <CNOTGate
                                            key={i}
                                            x={g.x}
                                            control={g.control}
                                            target={g.target}
                                            draggable
                                            onDragStart={handleDragStart}
                                            onDragEnd={(e) => handleCnotDragEnd(e, i)}
                                            onRightClick={() => handleDeleteCnot(i)}
                                            order={combinedOrders.cnot[i]}
                                        />
                                    ))}
                                    {/* Render CZ gates */}
                                    {czGates.map((g, i) => (
                                        <CZGate
                                            key={i}
                                            x={g.x}
                                            control={g.control}
                                            target={g.target}
                                            draggable
                                            onDragStart={handleDragStart}
                                            onDragEnd={(e) => handleCzDragEnd(e, i)}
                                            onRightClick={() => handleDeleteCz(i)}
                                            order={combinedOrders.cz[i]}
                                        />
                                    ))}
                                    {/* Render SWAP gates */}
                                    {swapGates.map((g, i) => (
                                        <SWAPGate
                                            key={i}
                                            x={g.x}
                                            qubit1={g.qubit1}
                                            qubit2={g.qubit2}
                                            draggable
                                            onDragStart={handleDragStart}
                                            onDragEnd={(e) => handleSwapDragEnd(e, i)}
                                            onRightClick={() => handleDeleteSwap(i)}
                                            order={combinedOrders.swap[i]}
                                        />
                                    ))}
                                    {/* Render Measure Nth Component */}
                                    {measureNthQubit.map((g, i) => (
                                        <MeasureNthComponent
                                            key={i}
                                            x={g.x}
                                            y={g.y}
                                            fixedY={g.y}
                                            draggable
                                            onDragEnd={(e) => handleMeasureDragEnd(e, i)}
                                            onRightClick={() => handleDeleteMeasure(i)}
                                            onDragStart={handleDragStart}
                                            order={combinedOrders.measure[i]}
                                        />
                                    ))}
                                </Layer>
                            </Stage>
                        </>
                    ) : activeTab === "Result" ? (
                        <HilbertSpaceResult nodes={new DataSet(verticesResultGraph)} edges={new DataSet(edgesResultGraph)} measuredValue={measuredValue} />
                    ) : activeTab === "Measurement" ? (
                        <MeasurementChart hist={measurementHist} />
                    ) : activeTab === "Probability" ? (
                        // an interactive graph
                        <ProbGraph probs={probData} />
                    ) : activeTab === "Log" ? (
                        <textarea
                            style={{
                                width: "100%",
                                height: "calc(100vh - 185px)",
                                overflow: "auto",
                                fontSize: "16px",
                                padding: "10px",
                                fontFamily: "monospace, monospace",
                                resize: "none"
                            }}
                            readOnly={true}
                            placeholder="Log Data from Backend"
                            value={resultData}
                        ></textarea>
                    ) : (null)}
                </div>
            </div>

            {/* Error Modal */}
            {delQubError && (
                <div
                    onClick={() => { setDelQubError(false); }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        userSelect: "none"
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            textAlign: "center",
                            minWidth: "300px",
                        }}
                    >
                        <p style={{ color: "red", fontFamily: "monospace, monospace", fontWeight: "normal", marginBottom: "10px" }}>
                            Number of Qubits must be greater than or equal to 1.
                        </p>
                        <div style={{ margin: "20px 0" }}>
                            <MathJax>{"$$\\text{numQubits}\\geq1$$"}</MathJax>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDelQubError(false);
                            }}
                            style={{ marginRight: "10px" }}
                        >
                            Okay
                        </Button>
                    </div>
                </div>
            )
            }

            {/* ROTATION/PHASE GATE MODAL */}
            {
                rotationModalOpen && (
                    <div
                        onClick={handleRotationCancel}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1001,
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center",
                                minWidth: "300px",
                            }}
                        >
                            <h2>{getRotationModalContent().title}</h2>
                            <div style={{ margin: "20px 0" }}>
                                <MathJax>{getRotationModalContent().latex}</MathJax>
                            </div>
                            <div
                                style={{
                                    margin: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <label style={{ marginRight: "10px" }}>θ (degrees): </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="360"
                                    value={rotationValue}
                                    onChange={handleRotationInputChange}
                                    style={{ width: "80px", padding: "4px" }}
                                />
                            </div>
                            <div style={{ margin: "10px" }}>
                                <input
                                    type="range"
                                    min="1"
                                    max="360"
                                    step="1"
                                    value={rotationValue}
                                    onChange={handleRotationInputChange}
                                    style={{ width: "100%" }}
                                />
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#666",
                                        marginTop: "5px",
                                    }}
                                >
                                    Note: Angle must be between 1° and 360°
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleRotationConfirm}
                                style={{ marginRight: "10px" }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outline" onClick={handleRotationCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )
            }

            {/* CNOT MODAL */}
            {
                cnotModalOpen && (
                    <div
                        onClick={handleCnotCancel}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center",
                                minWidth: "300px",
                            }}
                        >
                            <h2>Select Control and Target Qubit</h2>
                            <div style={{ margin: "10px" }}>
                                <label>Control Qubit: </label>
                                <select
                                    value={cnotControl}
                                    onChange={(e) => setCnotControl(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ margin: "10px" }}>
                                <label>Target Qubit: </label>
                                <select
                                    value={cnotTarget}
                                    onChange={(e) => setCnotTarget(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleCnotConfirm}
                                style={{ marginRight: "10px" }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outline" onClick={handleCnotCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )
            }

            {/* CZ MODAL */}
            {
                czModalOpen && (
                    <div
                        onClick={handleCzCancel}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center",
                                minWidth: "300px",
                            }}
                        >
                            <h2>Select Control and Target Qubit (CZ)</h2>
                            <div style={{ margin: "10px" }}>
                                <label>Control Qubit: </label>
                                <select
                                    value={czControl}
                                    onChange={(e) => setCzControl(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ margin: "10px" }}>
                                <label>Target Qubit: </label>
                                <select
                                    value={czTarget}
                                    onChange={(e) => setCzTarget(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleCzConfirm}
                                style={{ marginRight: "10px" }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outline" onClick={handleCzCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )
            }

            {/* SWAP MODAL */}
            {
                swapModalOpen && (
                    <div
                        onClick={handleSwapCancel}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center",
                                minWidth: "300px",
                            }}
                        >
                            <h2>Select Qubits to SWAP</h2>
                            <div style={{ margin: "10px" }}>
                                <label>Qubit A: </label>
                                <select
                                    value={swapQubit1}
                                    onChange={(e) => setSwapQubit1(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ margin: "10px" }}>
                                <label>Qubit B: </label>
                                <select
                                    value={swapQubit2}
                                    onChange={(e) => setSwapQubit2(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleSwapConfirm}
                                style={{ marginRight: "10px" }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outline" onClick={handleSwapCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )
            }
        </MathJaxContext >
    );
};

export default QuantumCircuit;
