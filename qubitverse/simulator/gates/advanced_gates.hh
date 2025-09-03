/**
 * @file advanced_gates.hh
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#ifndef SIMULATOR_ADVANCED_GATES
#define SIMULATOR_ADVANCED_GATES

#include <complex>
#include <vector>
#include <cmath>
#include <algorithm>
#include "./gates.hh"

namespace simulator
{
    /**
     * @brief Apply Toffoli Gate (CCX - Controlled-Controlled-X) to the quantum state
     * @param state Pointer to the quantum state vector
     * @param len Length of the state vector (must be 2^n for n qubits)
     * @param ctrl1 First control qubit index
     * @param ctrl2 Second control qubit index
     * @param target Target qubit index
     */
    void apply_toffoli_gate(std::complex<double>*& state, const std::size_t len,
                           const std::size_t ctrl1, const std::size_t ctrl2, const std::size_t target);

    /**
     * @brief Apply Fredkin Gate (CSWAP - Controlled-SWAP) to the quantum state
     * @param state Pointer to the quantum state vector
     * @param len Length of the state vector (must be 2^n for n qubits)
     * @param ctrl Control qubit index
     * @param target1 First target qubit index
     * @param target2 Second target qubit index
     */
    void apply_fredkin_gate(std::complex<double>*& state, const std::size_t len,
                           const std::size_t ctrl, const std::size_t target1, const std::size_t target2);

    /**
     * @brief Apply Multi-Controlled X Gate to the quantum state
     * @param state Pointer to the quantum state vector
     * @param len Length of the state vector (must be 2^n for n qubits)
     * @param controls Vector of control qubit indices
     * @param target Target qubit index
     */
    void apply_multi_controlled_x(std::complex<double>*& state, const std::size_t len,
                                 const std::vector<std::size_t>& controls, const std::size_t target);

    /**
     * @brief Apply Multi-Controlled Z Gate to the quantum state
     * @param state Pointer to the quantum state vector
     * @param len Length of the state vector (must be 2^n for n qubits)
     * @param controls Vector of control qubit indices
     * @param target Target qubit index
     */
    void apply_multi_controlled_z(std::complex<double>*& state, const std::size_t len,
                                 const std::vector<std::size_t>& controls, const std::size_t target);

    /**
     * @brief Apply Quantum Fourier Transform (QFT) to specified qubits
     * @param state Pointer to the quantum state vector
     * @param len Length of the state vector (must be 2^n for n qubits)
     * @param qubits Vector of qubit indices to apply QFT to
     * @param inverse If true, applies inverse QFT
     */
    void apply_qft(std::complex<double>*& state, const std::size_t len,
                  const std::vector<std::size_t>& qubits, bool inverse = false);

    /**
     * @brief Apply Quantum Fourier Transform using decomposed gates (more efficient for large systems)
     * @param state Pointer to the quantum state vector
     * @param len Length of the state vector (must be 2^n for n qubits)
     * @param qubits Vector of qubit indices to apply QFT to
     * @param inverse If true, applies inverse QFT
     */
    void apply_qft_decomposed(std::complex<double>*& state, const std::size_t len,
                             const std::vector<std::size_t>& qubits, bool inverse = false);

    /**
     * @brief Helper function to check if all control qubits are in |1⟩ state
     * @param index Current state vector index
     * @param controls Vector of control qubit indices
     * @return true if all controls are set, false otherwise
     */
    bool are_controls_set(std::size_t index, const std::vector<std::size_t>& controls);

    /**
     * @brief Helper function to compute the phase factor for QFT
     * @param k First index
     * @param n Second index
     * @param N Total number of qubits in the QFT
     * @return Complex phase factor
     */
    std::complex<double> qft_phase_factor(std::size_t k, std::size_t n, std::size_t N);

} // namespace simulator

#endif