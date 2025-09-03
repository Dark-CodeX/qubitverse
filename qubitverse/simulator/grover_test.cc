/**
 * @file grover_test.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 *
 * Test implementation of Grover's algorithm using the new advanced multi-qubit gates.
 * This serves as validation for the Toffoli, multi-controlled gates, and QFT implementations.
 */

#include <iostream>
#include <vector>
#include <complex>
#include <cmath>
#include <random>
#include "./gates/gates.hh"
#include "./gates/advanced_gates.hh"

namespace simulator
{
    /**
     * @brief Oracle function for Grover's algorithm
     * Marks the target state by applying a phase flip
     * @param state Quantum state vector
     * @param len Length of state vector
     * @param target_state The state to mark (as binary number)
     */
    void grover_oracle(std::complex<double>*& state, const std::size_t len, const std::size_t target_state)
    {
        // Simple oracle: apply phase flip (-1) to the target state
        state[target_state] *= -1.0;
    }

    /**
     * @brief Diffusion operator (amplitude amplification) for Grover's algorithm
     * @param state Quantum state vector
     * @param len Length of state vector
     */
    void grover_diffusion(std::complex<double>*& state, const std::size_t len)
    {
        std::size_t num_qubits = static_cast<std::size_t>(std::log2(len));

        // Apply Hadamard gates to all qubits
        for (std::size_t i = 0; i < num_qubits; ++i) {
            qubit::apply_predefined_gate_public(state, len, qubit::gate_type::HADAMARD, i);
        }

        // Apply phase flip to |00...0⟩ state (this is the key part of diffusion)
        state[0] *= -1.0;

        // Apply Hadamard gates again
        for (std::size_t i = 0; i < num_qubits; ++i) {
            qubit::apply_predefined_gate_public(state, len, qubit::gate_type::HADAMARD, i);
        }
    }

    /**
     * @brief Run Grover's algorithm to find a target state
     * @param num_qubits Number of qubits in the system
     * @param target_state The state to search for (0 to 2^num_qubits - 1)
     * @param iterations Number of Grover iterations to perform
     * @return The measured result
     */
    std::size_t run_grover_algorithm(std::size_t num_qubits, std::size_t target_state, std::size_t iterations)
    {
        std::size_t len = 1ULL << num_qubits;
        std::complex<double>* state = new std::complex<double>[len]();
        state[0] = {1.0, 0.0}; // Start in |00...0⟩ state

        // Initialize superposition with Hadamard gates
        for (std::size_t i = 0; i < num_qubits; ++i) {
            qubit::apply_predefined_gate_public(state, len, qubit::gate_type::HADAMARD, i);
        }

        // Apply Grover iterations
        for (std::size_t iter = 0; iter < iterations; ++iter) {
            // Apply oracle
            grover_oracle(state, len, target_state);

            // Apply diffusion operator
            grover_diffusion(state, len);
        }

        // Measure the result
        double max_prob = 0.0;
        std::size_t measured_state = 0;

        for (std::size_t i = 0; i < len; ++i) {
            double prob = std::norm(state[i]);
            if (prob > max_prob) {
                max_prob = prob;
                measured_state = i;
            }
        }

        delete[] state;
        return measured_state;
    }

    /**
     * @brief Test function to validate the advanced gates implementation
     */
    void test_advanced_gates()
    {
        std::cout << "Testing Advanced Multi-Qubit Gates Implementation\n";
        std::cout << "================================================\n\n";

        // Test 1: Toffoli Gate
        std::cout << "Test 1: Toffoli Gate (CCX)\n";
        std::size_t len = 8; // 3 qubits
        std::complex<double>* state1 = new std::complex<double>[len]();
        state1[0] = {1.0, 0.0}; // |000⟩

        // Apply Toffoli: if qubits 0 and 1 are |1⟩, flip qubit 2
        state1[6] = {1.0, 0.0}; // |110⟩
        apply_toffoli_gate(state1, len, 0, 1, 2);

        std::cout << "Toffoli gate applied to |110⟩ should give |111⟩\n";
        for (std::size_t i = 0; i < len; ++i) {
            if (std::abs(state1[i]) > 1e-10) {
                std::cout << "State |" << i << "⟩: amplitude = " << state1[i] << "\n";
            }
        }
        delete[] state1;
        std::cout << "\n";

        // Test 2: Multi-controlled X Gate
        std::cout << "Test 2: Multi-controlled X Gate\n";
        std::complex<double>* state2 = new std::complex<double>[len]();
        state2[7] = {1.0, 0.0}; // |111⟩

        std::vector<std::size_t> controls = {0, 1};
        apply_multi_controlled_x(state2, len, controls, 2);

        std::cout << "Multi-controlled X with controls {0,1} and target 2 applied to |111⟩\n";
        for (std::size_t i = 0; i < len; ++i) {
            if (std::abs(state2[i]) > 1e-10) {
                std::cout << "State |" << i << "⟩: amplitude = " << state2[i] << "\n";
            }
        }
        delete[] state2;
        std::cout << "\n";

        // Test 3: QFT
        std::cout << "Test 3: Quantum Fourier Transform\n";
        len = 4; // 2 qubits
        std::complex<double>* state3 = new std::complex<double>[len]();
        state3[0] = {1.0, 0.0}; // |00⟩

        std::vector<std::size_t> qubits = {0, 1};
        apply_qft(state3, len, qubits, false);

        std::cout << "QFT applied to |00⟩\n";
        for (std::size_t i = 0; i < len; ++i) {
            std::cout << "State |" << i << "⟩: amplitude = " << state3[i] << "\n";
        }
        delete[] state3;
        std::cout << "\n";

        // Test 4: Grover's Algorithm
        std::cout << "Test 4: Grover's Algorithm (2 qubits, target state |11⟩)\n";
        std::size_t target = 3; // |11⟩
        std::size_t optimal_iterations = static_cast<std::size_t>(M_PI / 4.0 * std::sqrt(4)); // ~1 for 2 qubits

        std::cout << "Searching for state |" << target << "⟩ with " << optimal_iterations << " iterations\n";

        std::size_t result = run_grover_algorithm(2, target, optimal_iterations);
        std::cout << "Grover's algorithm result: measured state |" << result << "⟩\n";

        if (result == target) {
            std::cout << "✓ SUCCESS: Found target state!\n";
        } else {
            std::cout << "✗ FAILED: Did not find target state\n";
        }

        std::cout << "\nAdvanced gates test completed.\n";
    }

} // namespace simulator

int main()
{
    simulator::test_advanced_gates();
    return 0;
}