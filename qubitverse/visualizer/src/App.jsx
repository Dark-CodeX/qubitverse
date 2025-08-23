import React, { useState } from "react";
import QuantumCircuit from "./components/QuantumCircuit";
import "./App.css";
import Navbar from "./components/Navbar";
import NQubitInput from "./components/NQubitInput";
import BlochSphere from "./components/BlochSphere";

function App() {
  const [nQubits, setNQubits] = useState(null);
  const [showBloch, setShowBloch] = useState(false);

  return (
    <>
      <Navbar
        onBlochToggle={() => setShowBloch(!showBloch)}
        isBlochActive={showBloch}
      />
      {showBloch ? (
        <BlochSphere key="bloch-sphere" />
      ) : nQubits === null ? (
        <NQubitInput numQubits={nQubits} setQubits={setNQubits} />
      ) : (
        <QuantumCircuit numQubits={nQubits} setNumQubits={setNQubits} />
      )}
    </>
  );
}

export default App;