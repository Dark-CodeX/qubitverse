/**
 * @file advanced_gates.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include "./advanced_gates.hh"

namespace simulator
{
    void apply_toffoli_gate(std::complex<double>*& state, const std::size_t len,
                           const std::size_t ctrl1, const std::size_t ctrl2, const std::size_t target)
    {
        if (std::log2(len) < 3.0) {
            std::fprintf(stderr, "error: Toffoli gate requires a minimum of 3 qubit-system, but it was %zu qubit-system.\n", (std::size_t)std::log2(len));
            std::exit(EXIT_FAILURE);
        }

        // Toffoli gate applies X to target only when both controls are |1⟩
        for (std::size_t i = 0; i < len; ++i) {
            // Check if both control qubits are in |1⟩ state
            bool ctrl1_set = (i >> ctrl1) & 1;
            bool ctrl2_set = (i >> ctrl2) & 1;

            if (ctrl1_set && ctrl2_set) {
                // Flip the target bit
                std::size_t flipped_index = i ^ (1ULL << target);
                // Swap amplitudes only if i < flipped_index to avoid double swapping
                if (i < flipped_index) {
                    std::swap(state[i], state[flipped_index]);
                }
            }
        }
    }

    void apply_fredkin_gate(std::complex<double>*& state, const std::size_t len,
                           const std::size_t ctrl, const std::size_t target1, const std::size_t target2)
    {
        if (std::log2(len) < 3.0) {
            std::fprintf(stderr, "error: Fredkin gate requires a minimum of 3 qubit-system, but it was %zu qubit-system.\n", (std::size_t)std::log2(len));
            std::exit(EXIT_FAILURE);
        }

        // Fredkin gate swaps target1 and target2 only when control is |1⟩
        for (std::size_t i = 0; i < len; ++i) {
            // Check if control qubit is in |1⟩ state
            bool ctrl_set = (i >> ctrl) & 1;

            if (ctrl_set) {
                // Swap target1 and target2 bits
                std::size_t swapped_index = i ^ (1ULL << target1) ^ (1ULL << target2);
                // Swap amplitudes only if i < swapped_index to avoid double swapping
                if (i < swapped_index) {
                    std::swap(state[i], state[swapped_index]);
                }
            }
        }
    }

    void apply_multi_controlled_x(std::complex<double>*& state, const std::size_t len,
                                 const std::vector<std::size_t>& controls, const std::size_t target)
    {
        std::size_t num_qubits = static_cast<std::size_t>(std::log2(len));
        if (num_qubits < controls.size() + 1) {
            std::fprintf(stderr, "error: Multi-controlled X gate requires at least %zu qubits, but system has %zu qubits.\n",
                        controls.size() + 1, num_qubits);
            std::exit(EXIT_FAILURE);
        }

        // Apply X to target only when all controls are |1⟩
        for (std::size_t i = 0; i < len; ++i) {
            if (are_controls_set(i, controls)) {
                // Flip the target bit
                std::size_t flipped_index = i ^ (1ULL << target);
                // Swap amplitudes only if i < flipped_index to avoid double swapping
                if (i < flipped_index) {
                    std::swap(state[i], state[flipped_index]);
                }
            }
        }
    }

    void apply_multi_controlled_z(std::complex<double>*& state, const std::size_t len,
                                 const std::vector<std::size_t>& controls, const std::size_t target)
    {
        std::size_t num_qubits = static_cast<std::size_t>(std::log2(len));
        if (num_qubits < controls.size() + 1) {
            std::fprintf(stderr, "error: Multi-controlled Z gate requires at least %zu qubits, but system has %zu qubits.\n",
                        controls.size() + 1, num_qubits);
            std::exit(EXIT_FAILURE);
        }

        // Apply phase of -1 when all controls are |1⟩ and target is |1⟩
        for (std::size_t i = 0; i < len; ++i) {
            if (are_controls_set(i, controls)) {
                bool target_set = (i >> target) & 1;
                if (target_set) {
                    state[i] *= -1.0;
                }
            }
        }
    }

    void apply_qft(std::complex<double>*& state, const std::size_t len,
                  const std::vector<std::size_t>& qubits, bool inverse)
    {
        std::size_t num_qubits = static_cast<std::size_t>(std::log2(len));
        std::size_t n = qubits.size();

        if (n == 0) return;

        // Create a copy of the state for transformation
        std::vector<std::complex<double>> new_state(len, 0.0);

        // QFT matrix implementation
        double normalization = 1.0 / std::sqrt(static_cast<double>(1ULL << n));

        for (std::size_t output = 0; output < (1ULL << n); ++output) {
            for (std::size_t input = 0; input < (1ULL << n); ++input) {
                std::complex<double> phase = qft_phase_factor(output, input, n);
                if (inverse) {
                    phase = std::conj(phase);
                }

                // Map qubits to actual indices
                std::size_t full_input = 0;
                std::size_t full_output = 0;

                for (std::size_t i = 0; i < num_qubits; ++i) {
                    bool is_in_qft = std::find(qubits.begin(), qubits.end(), i) != qubits.end();
                    if (is_in_qft) {
                        std::size_t qft_idx = std::distance(qubits.begin(),
                                                          std::find(qubits.begin(), qubits.end(), i));
                        bool bit = (input >> qft_idx) & 1;
                        if (bit) full_input |= (1ULL << i);

                        bit = (output >> qft_idx) & 1;
                        if (bit) full_output |= (1ULL << i);
                    }
                }

                new_state[full_output] += state[full_input] * phase * normalization;
            }
        }

        // Copy back to original state
        for (std::size_t i = 0; i < len; ++i) {
            state[i] = new_state[i];
        }
    }

    void apply_qft_decomposed(std::complex<double>*& state, const std::size_t len,
                             const std::vector<std::size_t>& qubits, bool inverse)
    {
        std::size_t n = qubits.size();
        if (n == 0) return;

        // Apply Hadamard gates and controlled phase rotations
        for (std::size_t i = 0; i < n; ++i) {
            // Apply Hadamard to qubit i
            qubit::apply_predefined_gate_public(state, len, qubit::gate_type::HADAMARD, qubits[i]);

            // Apply controlled phase rotations
            for (std::size_t j = i + 1; j < n; ++j) {
                double angle = (inverse ? -1.0 : 1.0) * M_PI / static_cast<double>(1ULL << (j - i));
                qubit::apply_theta_gate_public(state, len, qubit::gate_type::PHASE_GENERAL_SHIFT, angle, qubits[i]);
                // Note: This is a simplified implementation. In practice, controlled rotations would be needed.
            }
        }

        // Apply SWAP gates to reverse qubit order (for standard QFT)
        if (!inverse) {
            for (std::size_t i = 0; i < n / 2; ++i) {
                qubit::apply_2qubit_gate_public(state, len, qubit::gate_type::SWAP_GATE, qubits[i], qubits[n - 1 - i]);
            }
        }
    }

    bool are_controls_set(std::size_t index, const std::vector<std::size_t>& controls)
    {
        for (std::size_t ctrl : controls) {
            if (((index >> ctrl) & 1) == 0) {
                return false;
            }
        }
        return true;
    }

    std::complex<double> qft_phase_factor(std::size_t k, std::size_t n, std::size_t N)
    {
        double angle = 2.0 * M_PI * static_cast<double>(k * n) / static_cast<double>(1ULL << N);
        return std::complex<double>(std::cos(angle), std::sin(angle));
    }

} // namespace simulator