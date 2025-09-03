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
            params: {
                theta: gate.params.theta ?? 0,
                phi: gate.params.phi ?? 0,
                lambda: gate.params.lambda ?? 0,
            },
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

    // Process Toffoli (CCX) gates - placeholder for now
    const processedToffoliGates = [];

    // Process Fredkin (CSWAP) gates - placeholder for now
    const processedFredkinGates = [];

    // Process Multi-controlled gates - placeholder for now
    const processedMCXGates = [];
    const processedMCZGates = [];

    // Process QFT gates - placeholder for now
    const processedQFTGates = [];

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
    const allGates = [...processedGates, ...processedCnotGates, ...processedCZGates, ...processedSwapGates, ...processedToffoliGates, ...processedFredkinGates, ...processedMCXGates, ...processedMCZGates, ...processedQFTGates, ...measureNthQubits].sort(
        (a, b) => a.position - b.position
    );

    // Create the final circuit data object
    return {
        numQubits: nQ,
        gates: allGates,
    };
}

function quantum_encode(cktData, feature) {
    let s = "";
    for (let i = 0; i < cktData.gates.length; i++) {
      const gate = cktData.gates[i];
      for (const key in gate) {
        if (Object.hasOwn(gate, key)) {
          if (key === "params") {
            for (const p in gate.params) {
              if (Object.hasOwn(gate.params, p)) {
                s += p + ":" + gate.params[p] + "\n";
              }
            }
          } else {
            s += key + ":" + gate[key] + "\n";
          }
        }
      }
      s += "@\n"; 
    }
    return s;
}

export function SendToBackEnd_Calculate({ gates, cnotGates, czGates, swapGates, measureNthQ, numQubits, setLog, setProbData, setEdgesResultGraph, setVerticesResultGraph, setMeasuredValue, setMeasurementHist, funcAddQubits, funcRemoveQubits }) {
    const request_backend = async (dat) => {
        try {
            const response = await fetch('http://localhost:9080/api/endpoint', {
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