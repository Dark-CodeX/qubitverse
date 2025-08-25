⚛️ Quantum Gate Simulator & GUI Visualizer

A powerful and educational Quantum Gate Simulator implemented in C++, with an interactive Node.js-based GUI for visualizing quantum circuits.
This project helps learners and researchers experiment with quantum mechanics in an accessible and visual way.

📖 Overview

This project is divided into two main components:

🔹 1. Quantum Gate Simulator (C++)

Implements quantum mechanics concepts:

Qubit state representation

Quantum gate matrix operations

Supports common quantum gates:

Identity (I), Pauli-X, Pauli-Y, Pauli-Z

Hadamard (H)

Phase (S)

T-Gate

Uses manual matrix operations (no Eigen).

Extensible for multi-qubit systems and advanced gates (CNOT, SWAP, Toffoli).

🔹 2. GUI Visualizer (Node.js)

Interactive drag-and-drop circuit builder.

Real-time communication with the C++ backend.

Visualization tools:

Bloch sphere 🌐

Probability histograms 📊

Makes quantum learning intuitive and engaging.

✨ Features

🎯 Quantum Gate Storage – Store & manage reusable gates

🔄 State Evolution – Apply gates to qubits and see transformations

🧩 Extensible Backend – Future support for multi-qubit & controlled gates

🖥️ Interactive GUI – Real-time circuit visualization

🧹 Separation of Concerns –

C++ → Quantum computation

Node.js → Visualization & UI

🛠️ Tech Stack

C++17 → Quantum simulator backend

Node.js (v16+) → GUI backend & API

JavaScript (ES6+) → Frontend logic

HTML + CSS + D3.js → Visualization

🚀 Getting Started
🔧 Prerequisites

C++17 or later

Node.js (16+)

npm

📥 Installation
# Clone repo
git clone https://github.com/<your-username>/qubitverse.git
cd qubitverse


1️⃣ Build C++ Backend

cd simulator
g++ simulator.cpp -o simulator


2️⃣ Run GUI

cd ../visualizer
npm install
npm run dev


Open http://localhost:3000
 in your browser 🚀

📂 Project Structure
qubitverse/
│── simulator/         # C++ quantum simulator
│── visualizer/        # Node.js frontend (GUI)
│── docs/              # Documentation
│── README.md
│── LICENSE
│── CONTRIBUTING.md
│── CODE_OF_CONDUCT.md

🗺️ Roadmap

 Multi-qubit support

 Controlled gates (CNOT, SWAP, Toffoli)

 Entanglement visualization

 Export/import circuits

 Hosted demo

🤝 Contributing

We ❤️ contributions!

Fork repo

Create branch (feature/my-feature)

Commit changes

Submit PR 🎉

👉 Read CONTRIBUTING.md
 & CODE_OF_CONDUCT.md

📜 License

Licensed under the MIT License.

🙌 Acknowledgments

Inspired by Quantum Computing principles

References: Nielsen & Chuang – Quantum Computation and Quantum Information

Inspired by IBM Qiskit & Quantum Playground