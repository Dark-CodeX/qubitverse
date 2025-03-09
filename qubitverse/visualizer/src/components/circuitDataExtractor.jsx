import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// This function extracts circuit data from the gates state
export function extractCircuitData(gates, cnotGates) {
  // Process single-qubit gates
  const processedGates = gates.map((gate) => {
    // Calculate which qubit this gate is on based on y position
    const qubitIndex = Math.round((gate.y + 20) / 50) - 1; // 20 is half of gateSize, 50 is qubitSpacing

    return {
      type: "single",
      gateType: gate.text, // X, Y, H, etc.
      qubit: qubitIndex,
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

  // Combine all gates and sort by position (x coordinate)
  const allGates = [...processedGates, ...processedCnotGates].sort(
    (a, b) => a.position - b.position
  );

  // Create a map of gates by qubit
  const gatesByQubit = {};
  for (let i = 0; i < 5; i++) {
    // numQubits = 5
    gatesByQubit[`Q${i}`] = allGates
      .filter(
        (gate) =>
          (gate.type === "single" && gate.qubit === i) ||
          (gate.type === "cnot" && (gate.control === i || gate.target === i))
      )
      .sort((a, b) => a.position - b.position);
  }

  // Create the final circuit data object
  return {
    numQubits: 5,
    gates: allGates,
    gatesByQubit,
    // Add execution order for each qubit
    executionOrder: Object.keys(gatesByQubit).reduce((acc, qubit) => {
      acc[qubit] = gatesByQubit[qubit].map((gate) => {
        if (gate.type === "single") {
          return {
            operation: gate.gateType,
            qubit: gate.qubit,
            position: gate.position,
          };
        } else {
          return {
            operation: "CNOT",
            control: gate.control,
            target: gate.target,
            position: gate.position,
          };
        }
      });
      return acc;
    }, {}),
  };
}

export default function CircuitDataExtractor({ gates, cnotGates }) {
  const [isOpen, setIsOpen] = useState(false);
  const [circuitData, setCircuitData] = useState(null);

  const handleExtractData = () => {
    const data = extractCircuitData(gates, cnotGates);
    setCircuitData(data);
    setIsOpen(true);
  };

  const handleCopyToClipboard = () => {
    if (circuitData) {
      navigator.clipboard
        .writeText(JSON.stringify(circuitData, null, 2))
        .then(() => {
          alert("Circuit data copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleDownloadJSON = () => {
    if (circuitData) {
      const dataStr = JSON.stringify(circuitData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", dataUri);
      downloadLink.setAttribute("download", "quantum-circuit.json");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button 
        onClick={handleExtractData}
        className="flex items-center gap-2 mt-4"
      >
        Extract Circuit Data
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Quantum Circuit Data (JSON)</DialogTitle>
            <DialogDescription>
              This is the extracted data representation of your quantum circuit
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-4 rounded-md overflow-auto max-h-[60vh]">
            <pre className="text-sm">
              {circuitData ? JSON.stringify(circuitData, null, 2) : ""}
            </pre>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              Copy to Clipboard
            </Button>
            <Button onClick={handleDownloadJSON}>Download JSON</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
