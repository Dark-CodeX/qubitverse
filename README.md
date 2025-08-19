# ⚛️ Quantum Gate Simulator & GUI Visualizer

A powerful and educational **Quantum Gate Simulator** implemented in **C++**, with an interactive **Node.js-based GUI** for visualizing quantum circuits.  
This project aims to help learners and researchers **experiment with quantum mechanics** in an accessible and visual way.  

---

## 📖 Overview

This project is divided into two main components:

### 🔹 1. Quantum Gate Simulator (C++)
- Implements fundamental **quantum mechanics** concepts:
  - Qubit state representation  
  - Quantum gate matrix operations  
- Supports **common quantum gates**:
  - Identity (I), Pauli-X, Pauli-Y, Pauli-Z  
  - Hadamard (H)  
  - Phase (S)  
  - T-Gate  
- Uses **manual matrix operations** (no external libraries like Eigen).  
- Designed to be **extensible** for multi-qubit systems and advanced gates (CNOT, SWAP, etc.).  

### 🔹 2. GUI Visualizer (Node.js)
- Interactive **drag-and-drop** circuit builder.  
- Real-time communication with the C++ backend.  
- State visualization tools:
  - Bloch sphere 🌐  
  - Probability histograms 📊  
- Makes **quantum learning intuitive** and engaging.  

---

## ✨ Features

- 🎯 **Quantum Gate Storage:** Store and manage reusable quantum gates.  
- 🔄 **State Evolution:** Apply gates to qubits and observe transformations.  
- 🧩 **Extensible Backend:** Support for future multi-qubit & controlled gates.  
- 🖥️ **Interactive GUI:** Real-time visual quantum circuits.  
- 🧹 **Separation of Concerns:**  
  - C++ → Quantum computation  
  - Node.js → Visualization & UI  

---

## 🛠️ Tech Stack

- **C++17** → Core quantum gate simulator  
- **Node.js** → GUI backend & API  
- **JavaScript (ES6+)** → Frontend logic  
- **HTML + CSS + D3.js** → Data visualization (Bloch spheres, histograms)  

---

## 🚀 Getting Started

### 🔧 Prerequisites
- C++17 or later  
- Node.js (v16+ recommended)  
- npm (comes with Node.js)  

### 📥 Installation

Clone the repository:
```bash
git clone https://github.com/<your-username>/quantum-gate-simulator.git
cd quantum-gate-simulator
1️⃣ Build the C++ Backend
bash
Copy
Edit
cd simulator
g++ simulator.cpp -o simulator
2️⃣ Setup the GUI (Node.js)
bash
Copy
Edit
cd ../gui
npm install
npm run dev
Now open http://localhost:3000 in your browser 🚀

📂 Project Structure
bash
Copy
Edit
Quantum-Gate-Simulator/
│── simulator/         # C++ backend (quantum computation)
│   └── simulator.cpp
│── gui/                 # Node.js frontend (visualizer)
│   ├── src/
│   ├── public/
│   └── package.json
│── docs/                # Documentation & design notes
│── README.md
│── LICENSE
│── CONTRIBUTING.md
│── CODE_OF_CONDUCT.md

🗺️ Roadmap
 Add support for multi-qubit systems

 Implement controlled gates (CNOT, SWAP, Toffoli)

 Extend visualization to quantum entanglement

 Add export/import of circuits

 Publish as NPM package for wider use

🤝 Contributing
We ❤️ contributions!

Fork the repo

Create a new branch (feature/my-feature)

Make your changes

Submit a PR 🎉

📌 Check out CONTRIBUTING.md before contributing.
Also, please read our Code of Conduct.

📜 License
This project is licensed under the MIT License – see LICENSE for details.

🙌 Acknowledgments
Inspired by fundamental quantum computing principles.

Built to help beginners visualize and experiment with quantum mechanics.

Inspired by IBM Qiskit, Quantum Playground, and other educational tools.

🌟 Support
If you like this project, give it a ⭐ on GitHub!
Your support motivates us to keep improving.