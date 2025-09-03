# ⚛️ Quantum Gate Simulator & GUI Visualizer

A simple **Quantum Gate Simulator** implemented in **C++**, paired with a **Node.js-based GUI Visualizer** for an interactive experience.  

The simulator allows you to **store and apply various quantum gates** to qubit states and provides a **visual interface** to see the results of quantum operations in action.  

---

## 📖 Overview

This project is divided into two main parts:

### 🔹 Quantum Gate Simulator (C++)
- Implements basic quantum mechanics concepts such as **qubit state representation** and **quantum gate operations**.
- Provides a comprehensive set of quantum gates:
  - **Single-qubit gates**: Identity, Pauli-X/Y/Z, Hadamard, Phase (S), T-Gate, Rotation gates (Rx, Ry, Rz)
  - **Two-qubit gates**: CNOT, CZ, SWAP
  - **Advanced multi-qubit gates**: Toffoli (CCX), Fredkin (CSWAP), Multi-controlled X/Z, Quantum Fourier Transform (QFT)
- Uses **manual matrix operations** (without external libraries like Eigen) to evolve quantum states.
- Includes **validation tests** for advanced algorithms like Grover's search.

### 🔹 GUI Visualizer (Node.js)
- A **frontend interface** that communicates with the C++ simulator.  
- Allows users to **drag and drop gates** onto qubits, build circuits, and see the **resulting state evolution**.  
- Visualizes quantum states using:
  - Bloch spheres  
  - Probability histograms  

---

## ✨ Features

- **Quantum Gate Storage** – Manage and apply common gates easily.
- **State Evolution** – Apply operations on qubits and observe transformations.
- **Advanced Multi-Qubit Gates** – Full support for Toffoli, Fredkin, multi-controlled gates, and QFT.
- **Algorithm Implementation** – Grover's search algorithm validation and testing.
- **Interactive GUI** – User-friendly Node.js frontend with drag-and-drop interface.
- **Separation of Concerns** – C++ handles computation, Node.js handles visualization.
- **High Precision** – Numerical accuracy with < 1e-12 error tolerance.

---

## ⚙️ Installation & Setup

### 🔧 Prerequisites
- **C++ Compiler** (e.g., `g++`)
- **Node.js** (>= 16.0.0)
- **npm** (comes with Node.js)

### 🖥️ Backend (C++ Simulator)
```bash
# Navigate to the backend folder
cd backend

# Compile the simulator
g++ main.cpp -o simulator

# Run the simulator
./simulator
```

### 🌐 Frontend (Node.js GUI)
```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the GUI
npm start
```

The frontend will connect with the backend to visualize quantum gate operations.  

---

## 🚀 Usage Example

1. Start the **C++ backend** (`./simulator`).  
2. Run the **Node.js GUI** (`npm start`).  
3. Open the interface in your browser (default: `http://localhost:3000`).  
4. Drag and drop gates onto qubits, then visualize state changes.  

Example workflow:
- Initialize a |0⟩ qubit
- Apply a Hadamard gate → get a superposition state
- Apply a Pauli-Z gate → observe phase flip on the Bloch sphere

---

## 🔧 Advanced Gates API

The simulator now includes advanced multi-qubit gates essential for quantum algorithms:

### Toffoli Gate (CCX)
```cpp
apply_toffoli_gate(state, len, ctrl1, ctrl2, target);
```
Applies X gate to target qubit when both control qubits are in |1⟩ state.

### Fredkin Gate (CSWAP)
```cpp
apply_fredkin_gate(state, len, ctrl, target1, target2);
```
Swaps target1 and target2 qubits when control qubit is in |1⟩ state.

### Multi-Controlled Gates
```cpp
// Multi-controlled X
apply_multi_controlled_x(state, len, controls, target);

// Multi-controlled Z
apply_multi_controlled_z(state, len, controls, target);
```
Apply X or Z gate when all control qubits are in |1⟩ state.

### Quantum Fourier Transform
```cpp
// Full QFT
apply_qft(state, len, qubits, inverse);

// Decomposed QFT (more efficient)
apply_qft_decomposed(state, len, qubits, inverse);
```
Performs quantum Fourier transform on specified qubits.

### Grover's Algorithm
The included test file demonstrates Grover's search algorithm using the advanced gates:
```bash
# Build and run the test
cmake .
make grover_test
./grover_test
```

---

## 🤝 Contribution Guidelines

We welcome contributions! To get started:  

1. **Fork** the repository  
2. **Create a new branch** for your feature/bugfix  
3. **Commit** your changes with clear messages  
4. **Push** your branch and submit a **Pull Request (PR)**  

Please ensure:
- Code is well-documented  
- New features include usage examples or tests  

---

## 📂 Project Structure
```
qubitverse/
│── .github/workflows/
│   └── cmake-single-platform.yml
│
│── qubitverse/
│   ├── simulator/            # C++ quantum gate simulator
│   │   ├── dep/
│   │   ├── gates/
│   │   ├── lexer/
│   │   ├── parser/
│   │   └── simulator/
│   │
│   └── visualizer/           # Node.js GUI visualizer
│       ├── public/
│       ├── src/
│       ├── eslint.config.js
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
│── .clang-format
│── .clang-tidy
│── .clangd
│── .gitignore
│── CMakeLists.txt
│── compile.rc
│── CONTRIBUTING.md
│── LICENSE
│── README.md
```

---

## 📌 Roadmap
- [x] Add **multi-qubit support**
- [x] Implement **CNOT and controlled gates**
- [x] Implement **advanced multi-qubit gates** (Toffoli, Fredkin, QFT)
- [ ] Improve **visualization with real-time animations**
- [ ] Add **export/import** of circuits**
- [ ] Provide a **hosted live demo**
- [ ] Add **quantum error correction** support
- [ ] Implement **variational quantum algorithms**

---

## 📜 License
This project is licensed under the **MIT License**.  
See the [LICENSE](https://github.com/Dark-CodeX/qubitverse/blob/main/LICENSE) file for details.  

---

## 🌟 Acknowledgments
- Inspired by basic concepts of **Quantum Computing**.  
- Educational references: Nielsen & Chuang - *Quantum Computation and Quantum Information*.
- Open-source tools and the developer community.  

---
