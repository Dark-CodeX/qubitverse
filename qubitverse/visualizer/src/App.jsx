import React, { useState, useRef } from 'react';
import QuantumCircuit from "./components/QuantumCircuit";
import Navbar from "./components/Navbar";
import NQubitInput from "./components/NQubitInput";

function App() {
  const [nQubits, setNQubits] = useState(null);

  return (
    <>
      <Navbar />
      {nQubits === null ? (
        <NQubitInput numQubits={nQubits} setQubits={setNQubits} />
      ) : (
        <QuantumCircuit numQubits={nQubits} setNumQubits={setNQubits} />
      )}
    </>
  );
}

export default App;
