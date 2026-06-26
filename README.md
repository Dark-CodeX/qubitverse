# QubitVerse

QubitVerse is a comprehensive quantum circuit simulator featuring a C++ backend for high-performance computation and an interactive React-based frontend for intuitive circuit design and visualization. This project allows users to build, simulate, and analyze quantum circuits by dragging and dropping gates, observing state evolution, and exploring quantum phenomena through various graphical representations.

## Core Components

The repository is structured into two main parts:

1.  **Simulator (Backend)**: A powerful quantum simulation engine built in C++. It features:
    *   A custom lexer and parser to interpret quantum circuit descriptions.
    *   An implementation of multi-qubit systems and their state evolution using complex vector spaces (Hilbert space).
    *   A lightweight HTTP server (`httplib.h`) that exposes a single API endpoint (`/api/endpoint`) to receive circuit data and return simulation results.
    *   Support for a wide range of single-qubit, parametric, and multi-qubit gates.

2.  **Visualizer (Frontend)**: A modern and responsive user interface built with React and Vite. It provides:
    *   An interactive drag-and-drop canvas for building quantum circuits.
    *   Modals for configuring multi-qubit and parametric gates.
    *   A tabbed interface to display various simulation results.
    *   Rich visualizations including Bloch spheres, probability distributions, measurement histograms, and a Hilbert space evolution graph.

## Features

- **Interactive Circuit Builder**: Drag and drop gates from a palette onto qubit lines to construct your quantum circuit.
- **Wide Range of Gates**:
  - **Single-Qubit Gates**: Identity (`I`), Pauli (`X`, `Y`, `Z`), Hadamard (`H`), Phase (`S`, `T`), `V`, and `V†`.
  - **Parametric Gates**: General Phase (`P`) and Rotations (`Rx`, `Ry`, `Rz`).
  - **Multi-Qubit Gates**: `CNOT`, `CZ`, and `SWAP`.
- **Measurement Operations**: Perform full-system or single-qubit measurements to collapse the quantum state.
- **Advanced Visualizations**:
  - **Bloch Sphere**: View the state of any individual qubit on a 3D Bloch sphere.
  - **Probability Graph**: See the probability distribution of all possible measurement outcomes.
  - **Measurement Chart**: Visualize the frequency of outcomes from repeated measurements.
  - **Hilbert Space View**: Trace the evolution of the quantum state vectors through each gate operation in a flow chart.
  - **Raw Log**: Inspect the raw complex vector data returned from the backend.
- **Efficient C++ Backend**: All quantum calculations are handled by a highly optimized C++ engine for speed and efficiency.
- **Client-Server Architecture**: The React frontend communicates with the C++ backend via a simple HTTP API, ensuring a clean separation of concerns.

## Getting Started

### Prerequisites

- **Backend**:
  - A C++23 compatible compiler (e.g., `g++` 13 or newer)
  - `CMake` (version 3.10 or newer)
  - `make` (or another build tool compatible with CMake)
- **Frontend**:
  - `Node.js` (version 18.x or newer)
  - `npm`

Alternatively, you can use **Docker** to run the backend without installing C++ dependencies locally.

### Backend Setup

#### Using CMake (Recommended)
1. Clone the repository:
   ```sh
   git clone https://github.com/Dark-CodeX/qubitverse.git
   cd qubitverse
   ```
2. Configure the build files using CMake:
   ```sh
   cmake -B build -DCMAKE_BUILD_TYPE=Release
   ```
3. Build the executable:
   ```sh
   cmake --build build --config Release
   ```
4. Run the simulator server:
   ```sh
   ./build/qubitverse
   ```
   The backend server will start on `http://0.0.0.0:9080`.

#### Using Docker
1. Ensure Docker is installed and running.
2. Build and run the Docker container from the root of the repository:
   ```sh
   docker build -t qubitverse-simulator .
   docker run -p 9080:9080 qubitverse-simulator
   ```
   The backend server will start and be accessible on `http://localhost:9080`.

### Frontend Setup

1. Navigate to the visualizer directory:
   ```sh
   cd qubitverse/visualizer
   ```
2. Install the required Node.js packages:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```
   The frontend will be available at the URL provided in your terminal (usually `http://localhost:5173`).

## Usage

1.  **Launch**: Ensure both the backend and frontend servers are running.
2.  **Set Qubits**: Open the frontend URL in your browser. You will be prompted to enter the number of qubits for your circuit. The interface also displays a graph illustrating the exponential memory growth with each additional qubit.
3.  **Build Circuit**: On the **Circuit** tab, drag gates from the left-hand palette and drop them onto the qubit lines. For multi-qubit or parametric gates, a modal will appear to configure the target qubits or rotation angles.
4.  **Simulate**: Use the buttons in the left-hand menu to run the simulation:
    - **Calculate**: Simulates the circuit and prepares data for all visualization tabs without performing a measurement.
    - **Probability**: Runs the simulation and computes the final probability distribution.
    - **Measure**: Simulates the circuit and then performs a full-system measurement, collapsing the state to a single outcome.
5.  **Analyze Results**: Switch between the tabs to explore the output:
    - **Result**: View the Hilbert space state evolution. Double-click any node to inspect the complex vector components.
    - **Measurement**: See a histogram of measurement outcomes if you have run multiple "Measure" simulations.
    - **Probability**: A bar chart showing the probability of measuring each state.
    - **Bloch Sphere**: An interactive 3D sphere to visualize the state of each qubit.
    - **Log**: The raw text output from the C++ backend, useful for debugging.

## License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for full details.