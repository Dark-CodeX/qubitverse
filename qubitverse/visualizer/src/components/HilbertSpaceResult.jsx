import React, { useEffect, useCallback, useState } from "react";
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    MarkerType,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";

// NODE_TYPES must be defined outside the component so the reference is stable
// and React Flow doesn't re-register (and flicker) on every render.

function CustomNode({ data }) {
    return (
        <div
            style={{
                padding: "8px 12px",
                fontFamily: "monospace",
                fontSize: 13,
                background: data.highlighted ? "#edf7ed" : "#fff",
                border: `1.5px solid ${data.highlighted ? "#36802D" : "#b0b0b0"}`,
                borderRadius: "5px",
                boxSizing: "border-box",
                userSelect: "none",
                minWidth: 80,
                transition: "border-color 0.15s, background 0.15s",
            }}
        >
            {/* Edges coming IN attach here */}
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: "#888", width: 8, height: 8 }}
            />

            {data.label}

            {/* Edges going OUT attach here */}
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: "#888", width: 8, height: 8 }}
            />
        </div>
    );
}

const NODE_TYPES = { custom: CustomNode };

function HilbertSpaceResult({ nodes, edges, measuredValue }) {
    const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
    const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);
    const [panelNode, setPanelNode] = useState(null); // node data shown in right panel

    useEffect(() => {
        const nodeArray = nodes ?? [];
        const edgeArray = edges ?? [];

        const convertedNodes = nodeArray.map((node, i) => ({
            id: String(node.id),
            type: "custom",
            position: {
                x: node.x ?? (i % 5) * 220,
                y: node.y ?? Math.floor(i / 5) * 160,
            },
            data: {
                label: node.label ?? String(node.id),
                originalLabel: node.originalLabel ?? node.label ?? String(node.id),
                values: node.values ?? [],
                highlighted: false,
            },
        }));

        const convertedEdges = edgeArray.map((edge) => ({
            id: String(
                edge.id ?? `${edge.from ?? edge.source}-${edge.to ?? edge.target}`
            ),
            source: String(edge.from ?? edge.source),
            target: String(edge.to ?? edge.target),
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "#888" },
        }));

        setRfNodes(convertedNodes);
        setRfEdges(convertedEdges);
        setPanelNode(null);
    }, [nodes, edges, setRfNodes, setRfEdges]);

    const onNodeDoubleClick = useCallback(
        (_event, node) => {
            // Highlight the clicked node, un-highlight all others
            setRfNodes((nds) =>
                nds.map((n) => ({
                    ...n,
                    data: { ...n.data, highlighted: n.id === node.id },
                }))
            );
            setPanelNode(node.data);
        },
        [setRfNodes]
    );

    const closePanel = useCallback(() => {
        setPanelNode(null);
        // Remove all highlights
        setRfNodes((nds) =>
            nds.map((n) => ({ ...n, data: { ...n.data, highlighted: false } }))
        );
    }, [setRfNodes]);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Graph + panel row */}
            <div
                style={{
                    display: "flex",
                    height: "calc(100vh - 225px)",
                    border: "solid 2px",
                    borderRadius: "5px",
                    overflow: "hidden",
                }}
            >
                {/* React Flow canvas */}
                <div style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
                    <ReactFlow
                        nodes={rfNodes}
                        edges={rfEdges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeDoubleClick={onNodeDoubleClick}
                        nodeTypes={NODE_TYPES}
                        fitView
                        nodesDraggable
                        nodesConnectable={false}
                        elementsSelectable
                        proOptions={{ hideAttribution: true }}
                    >
                        <Background
                            variant={BackgroundVariant.Lines}
                            gap={25}
                            color="rgba(0,0,0,0.05)"
                        />
                        <Controls showInteractive={false} />
                    </ReactFlow>
                </div>

                {/* Right-side detail panel */}
                {panelNode && (
                    <div
                        style={{
                            width: 300,
                            borderLeft: "2px solid #ddd",
                            backgroundColor: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            flexShrink: 0,
                        }}
                    >
                        {/* Panel header */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px 14px",
                                borderBottom: "1px solid #e0e0e0",
                                backgroundColor: "#f5f5f5",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "monospace",
                                    fontWeight: "bold",
                                    fontSize: 13,
                                    color: "#222",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    marginRight: 8,
                                }}
                                title={panelNode.originalLabel}
                            >
                                {panelNode.originalLabel}
                            </span>
                            <button
                                onClick={closePanel}
                                title="Close"
                                style={{
                                    background: "none",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: 14,
                                    lineHeight: 1,
                                    color: "#555",
                                    padding: "3px 7px",
                                    flexShrink: 0,
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Values table */}
                        <div style={{ overflowY: "auto", flex: 1 }}>
                            {panelNode.values && panelNode.values.length > 0 ? (
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        fontFamily: "monospace",
                                        fontSize: 13,
                                    }}
                                >
                                    <thead>
                                        <tr
                                            style={{
                                                backgroundColor: "#f0f0f0",
                                                borderBottom: "2px solid #ddd",
                                                position: "sticky",
                                                top: 0,
                                            }}
                                        >
                                            <th
                                                style={{
                                                    padding: "8px 14px",
                                                    textAlign: "left",
                                                    color: "#444",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Qubit
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px 14px",
                                                    textAlign: "left",
                                                    color: "#444",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {panelNode.values.map((row, i) => (
                                            <tr
                                                key={i}
                                                style={{
                                                    backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                                                    borderBottom: "1px solid #eee",
                                                }}
                                            >
                                                <td style={{ padding: "7px 14px", color: "#36802D", fontWeight: 500 }}>
                                                    {row.qubit}
                                                </td>
                                                <td style={{ padding: "7px 14px", color: "#222" }}>
                                                    {row.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p
                                    style={{
                                        padding: "20px 14px",
                                        color: "#999",
                                        fontFamily: "monospace",
                                        fontSize: 13,
                                    }}
                                >
                                    No values available.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Measurement footer */}
            <h1
                className="text-xl font-bold text-gray-800"
                style={{ userSelect: "none", color: "#36802D", paddingTop: "15px" }}
            >
                Measurement: {measuredValue}
            </h1>
        </div>
    );
}

export default HilbertSpaceResult;