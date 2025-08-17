⚛️ Quantum Gate Simulator & GUI Visualizer

A simple quantum gate simulator implemented in C++, designed to simulate and visualize quantum gate operations on qubits.
It features a C++ backend for quantum computations and a Node.js-based GUI for interactive visualization.

📖 Overview

This project is divided into two core components:

🔹 1. Quantum Gate Simulator (C++)

Implements basic quantum mechanics concepts such as qubit state representation and quantum gate operations.

Provides a library of common gates:

Identity (I)

Pauli-X, Pauli-Y, Pauli-Z

Hadamard (H)

Phase (S)

T-Gate

Uses manual matrix operations (no external libraries like Eigen) for evolving quantum states.

🔹 2. GUI Visualizer (Node.js)

A frontend interface that communicates with the C++ backend.

Allows users to drag-and-drop quantum gates onto qubits to build circuits.

Visualizes quantum states using:

Bloch spheres

Probability histograms


🛠️ Tech Stack

Frontend: React, Tailwind CSS

Backend: Node.js, Express.js

Real-time Communication: Socket.IO

Version Control: Git & GitHub

✨ Features

✔️ Quantum Gate Storage – Store and manage a set of common quantum gates.
✔️ State Evolution – Apply gates to a qubit state and observe transformations.
✔️ Extensible Backend – Flexible design to expand support for multi-qubit systems and advanced gates (like CNOT).
✔️ Interactive GUI – Planned Node.js frontend for a visual, user-friendly experience.
✔️ Separation of Concerns –

C++ → Handles quantum computation.

Node.js → Handles visualization and user interaction.

📂 Project Structure
Quantum-Gate-Simulator/
│── src/                # C++ source code for quantum simulator
│── gui/                # Node.js GUI frontend (planned)
│── include/            # Header files for quantum gates & states
│── docs/               # Documentation and design notes
│── examples/           # Example circuits and test cases
│── README.md           # Project documentation

🚀 Getting Started
🔧 Build C++ Simulator
g++ -o quantum_simulator main.cpp
./quantum_simulator

🌐 Run GUI (Planned)
cd gui
npm install
npm start

📊 Roadmap

 Add multi-qubit support

 Implement entanglement & CNOT gate

 Enhance GUI with real-time Bloch sphere visualizations

 Export circuits as JSON / QASM

🤝 Contributing

Contributions are welcome! 🎉

Fork the repo

Create a feature branch

Submit a Pull Request

📜 License

This project is licensed under the MIT License.