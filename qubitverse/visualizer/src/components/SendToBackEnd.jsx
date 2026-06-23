import { Button } from "@/components/ui/button";
import ParseResultData from "./ParseResultData";

// This function extracts circuit data from the gates state
function extractCircuitData(gates, cnotGates, czGates, swapGates, measureNthQ, nQ) {
    // Process single-qubit gates
    const processedGates = gates.map((gate) => {
        // Calculate which qubit this gate is on based on y position
        const qubitIndex = Math.round((gate.y + 20) / 50) - 1; // 20 is half of gateSize, 50 is qubitSpacing
        return {
            type: "single",
            gateType: (gate.text === "V†" ? "adjV" : gate.text), // X, Y, H, etc.
            qubit: qubitIndex,
            theta: Object.hasOwn(gate, "params") === false ? -1 : gate.params.theta,
            position: gate.x,
        };
    });

    // Process CNOT gates
    const processedCnotGates = cnotGates.map((gate) => {
        return {
            type: "cnot",
            control: gate.control,
            target: gate.target,
            position: gate.x,
        };
    });

    // Process CZ gates
    const processedCZGates = czGates.map((gate) => {
        return {
            type: "cz",
            control: gate.control,
            target: gate.target,
            position: gate.x,
        };
    });

    // Process SWAP gates
    const processedSwapGates = swapGates.map((gate) => {
        return {
            type: "swap",
            qubitA: gate.qubit1,
            qubitB: gate.qubit2,
            position: gate.x,
        };
    });

    // Process Measurement
    const measureNthQubits = measureNthQ.map((gate) => {
        const qubitIndex = Math.round((gate.y + 20) / 50) - 1; // 20 is half of gateSize, 50 is qubitSpacing
        return {
            type: "measurenth",
            qubit: qubitIndex,
            position: gate.x,
        }
    });

    // Combine all gates and sort by position (x coordinate)
    const allGates = [...processedGates, ...processedCnotGates, ...processedCZGates, ...processedSwapGates, ...measureNthQubits].sort(
        (a, b) => a.position - b.position
    );

    // Create the final circuit data object
    return {
        numQubits: nQ,
        gates: allGates,
    };
}

function quantum_encode(cktData, feature) {
    let s = feature + "n:" + cktData.numQubits + "\n";
    for (let i = 0; i < cktData.gates.length; i++) {
        for (const key in cktData.gates[i]) {
            if (Object.hasOwn(cktData.gates[i], key)) {
                s += key + ":" + cktData.gates[i][key] + "\n";
            }
        }
        s += "@\n";
    }
    return s;
}

export function SendToBackEnd_Calculate({ gates, cnotGates, czGates, swapGates, measureNthQ, numQubits, setLog, setProbData, setEdgesResultGraph, setVerticesResultGraph, setMeasuredValue, setMeasurementHist, funcAddQubits, funcRemoveQubits }) {
    const request_backend = async (dat) => {
        try {
            const response = await fetch('https://cppqubitverse.onrender.com/api/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: dat
            });
            return await response.text();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    };

    const sendCalculate = () => {
        request_backend(
            quantum_encode(extractCircuitData(gates, cnotGates, czGates, swapGates, measureNthQ, numQubits), "0")
        ).then(responseText => { setLog(responseText); ParseResultData({ data: responseText, setProbData, setEdgesResultGraph, setVerticesResultGraph, setMeasuredValue, setMeasurementHist }) });


    };

    const sendProbability = () => {
        request_backend(
            quantum_encode(extractCircuitData(gates, cnotGates, czGates, swapGates, measureNthQ, numQubits), "1")
        ).then(responseText => { setLog(responseText); ParseResultData({ data: responseText, setProbData, setEdgesResultGraph, setVerticesResultGraph, setMeasuredValue, setMeasurementHist }) });
    };

    const sendMeasure = () => {
        request_backend(
            quantum_encode(extractCircuitData(gates, cnotGates, czGates, swapGates, measureNthQ, numQubits), "2")
        ).then(responseText => { setLog(responseText); ParseResultData({ data: responseText, setProbData, setEdgesResultGraph, setVerticesResultGraph, setMeasuredValue, setMeasurementHist }) });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px", // equal spacing between buttons
                userSelect: "none"
            }}>
            <Button
                variant="outline"
                style={{
                    width: "100%",
                    padding: "10px",
                }}
                onClick={sendCalculate}
            >
                Calculate
            </Button>
            <Button
                variant="outline"
                style={{
                    width: "100%",
                    padding: "10px",
                }}
                onClick={sendProbability}
            >
                Probability
            </Button>
            <Button
                variant="outline"
                style={{
                    width: "100%",
                    padding: "10px",
                }}
                onClick={sendMeasure}
            >
                Measure
            </Button>
            <Button
                variant="outline"
                style={{
                    width: "100%",
                    padding: "10px",
                }}
                onClick={funcAddQubits}
            >
                Add Qubit
            </Button>
            <Button
                variant="outline"
                style={{
                    width: "100%",
                    padding: "10px",
                }}
                onClick={funcRemoveQubits}
            >
                Delete Qubit
            </Button>
        </div>
    );
};

export default SendToBackEnd_Calculate;