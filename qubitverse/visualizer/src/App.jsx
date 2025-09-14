import React, { useState, useEffect } from "react";
import QuantumCircuit from "./components/QuantumCircuit";
import "./App.css";
import Navbar from "./components/Navbar";
import NQubitInput from "./components/NQubitInput";
import BlochSphere from "./components/BlochSphere";
import './index.css';
function App() {
  const [nQubits, setNQubits] = useState(null);
  const [showBloch, setShowBloch] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(()=>{
    if(darkTheme){
      document.documentElement.classList.add("dark");
    }else{
      document.documentElement.classList.remove("dark");
    }
  }, [darkTheme]);

  return (
    <>
      <Navbar
        onBlochToggle={() => setShowBloch(!showBloch)}
        isBlochActive={showBloch}
        darkTheme={darkTheme}
        setDarkTheme={setDarkTheme}
      />
      {showBloch ? (
        <BlochSphere key="bloch-sphere" />
      ) : nQubits === null ? (
        <NQubitInput numQubits={nQubits} setQubits={setNQubits} darkTheme={darkTheme} />
      ) : (
        <QuantumCircuit numQubits={nQubits} setNumQubits={setNQubits} />
      )}
    </>
  );
}

export default App;