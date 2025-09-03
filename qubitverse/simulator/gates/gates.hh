/**
 * @file gates.hh
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#ifndef SIMULATOR_GATES
#define SIMULATOR_GATES

#include <complex>
#include <random>
#include <cmath> // for sqrt and M_PI

namespace simulator
{
    class qubit
    {
      public:
        using complex = std::complex<double>;

      public:
        enum gate_type : unsigned char
        {
            IDENTITY,            // Identity gate: leaves the qubit unchanged.
            PAULI_X,             // Pauli-X gate (NOT gate): flips the qubit state.
            PAULI_Y,             // Pauli-Y gate: rotates the qubit about the Y-axis.
            PAULI_Z,             // Pauli-Z gate: performs a phase flip.
            HADAMARD,            // Hadamard gate: creates superposition.
            PHASE_PI_2_SHIFT,    // S-gate: applies a π/2 phase shift.
            PHASE_PI_4_SHIFT,    // T-gate: applies a π/4 phase shift.
            PHASE_GENERAL_SHIFT, // General phase shift gate: parameterized phase shift.
            ROTATION_X,          // Rotation around the X-axis, by theta angle.
            ROTATION_Y,          // Rotation around the Y-axis, by theta angle.
            ROTATION_Z,          // Rotation around the Z-axis, by theta angle.
            SQRT_OF_X_V,         // Square-root of NOT Gate (alias for √X)
            ADJ_SQRT_OF_X_V,     // Adjoint of the V gate (alias for (√X)^-1)
            CONTROLLED_NOT,      // Controlled-NOT (CNOT) gate: flips target qubit based on control, creates the state of entanglement between two qubits.
            CONTROLLED_Z,        // Controlled-Z gate: applies a phase flip conditional on the control.
            SWAP_GATE            // SWAP gate: exchanges the states of two qubits.
        };

      private:

        struct qgate_2x2
        {
            gate_type type;
            complex matrix[2][2]; // 2x2 matrix that stores various types of gates
        };

        static constexpr qgate_2x2 pre_defined_qgates[9] = {
            {IDENTITY, {{1, 0}, {0, 1}}},
            {PAULI_X, {{0, 1}, {1, 0}}},
            {PAULI_Y, {{0, {0, -1}}, {{0, 1}, 0}}},
            {PAULI_Z, {{1, 0}, {0, -1}}},
            {HADAMARD, {{M_SQRT1_2, M_SQRT1_2}, {M_SQRT1_2, -M_SQRT1_2}}},
            {PHASE_PI_2_SHIFT, {{1, 0}, {0, {0, 1}}}},                 // e^(i * pi/2) = i
            {PHASE_PI_4_SHIFT, {{1, 0}, {0, {M_SQRT1_2, M_SQRT1_2}}}}, // e^(i * pi/4) = (sqrt(2)/2) + i(sqrt(2)/2)
            {SQRT_OF_X_V, {{(complex){0.5, 0.5}, (complex){0.5, -0.5}}, {(complex){0.5, -0.5}, (complex){0.5, 0.5}}}},
            {ADJ_SQRT_OF_X_V, {{(complex){0.5, -0.5}, (complex){0.5, 0.5}}, {(complex){0.5, 0.5}, (complex){0.5, -0.5}}}}};

        static void apply_predefined_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &qubit_target);
        static qgate_2x2 &get_theta_gate(qgate_2x2 &__g, const gate_type &__g_type, const double &__theta);
        static void apply_theta_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const double &__theta, const std::size_t &qubit_target);
        static void apply_2qubit_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &q_control, const std::size_t &q_target);

      public:
        // Public static functions for external access
        static void apply_predefined_gate_public(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &qubit_target) {
            apply_predefined_gate(__s, _len, __g_type, qubit_target);
        }
        static void apply_theta_gate_public(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const double &__theta, const std::size_t &qubit_target) {
            apply_theta_gate(__s, _len, __g_type, __theta, qubit_target);
        }
        static void apply_2qubit_gate_public(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &q_control, const std::size_t &q_target) {
            apply_2qubit_gate(__s, _len, __g_type, q_control, q_target);
        }

        // a vector-space (hilbert-space) defined over complex numbers C
        // 1 << M_no_qubits translates to 2^N, where N is the number of qubit the hilbert-space(quantum-system) supports
        // memory consumption on x86_64 architecture for N-qubit system is: f(N) = 16 * 2^abs(N) bytes, that is exponential growth
        // Initially, the hilbert-space is defined as 1 + 0i, 0 + 0i, 0 + 0i, 0 + 0i, 0 + 0i, ..., 0 + 0i
        complex *M_qubits;
        std::size_t M_len, M_no_qubits;

      public:
        qubit() = delete;
        qubit(const std::size_t &n);
        qubit(const qubit &q);
        qubit(qubit &&q) noexcept(true);
        qubit &apply_identity(const std::size_t &q_target);
        qubit &apply_pauli_x(const std::size_t &q_target);
        qubit &apply_pauli_y(const std::size_t &q_target);
        qubit &apply_pauli_z(const std::size_t &q_target);
        qubit &apply_hadamard(const std::size_t &q_target);
        qubit &apply_phase_pi_2_shift(const std::size_t &q_target);
        qubit &apply_phase_pi_4_shift(const std::size_t &q_target);
        qubit &apply_phase_general_shift(const double &_theta, const std::size_t &q_target);
        qubit &apply_rotation_x(const double &_theta, const std::size_t &q_target);
        qubit &apply_rotation_y(const double &_theta, const std::size_t &q_target);
        qubit &apply_rotation_z(const double &_theta, const std::size_t &q_target);
        qubit &apply_v(const std::size_t &q_target);
        qubit &apply_adj_v(const std::size_t &q_target);
        qubit &apply_cnot(const std::size_t &q_control, const std::size_t &q_target);
        qubit &apply_cz(const std::size_t &q_control, const std::size_t &q_target);
        qubit &apply_swap(const std::size_t &qubit_1, const std::size_t &qubit_2);
        const complex *get_qubits() const;
        const std::size_t &get_size() const;
        const std::size_t memory_consumption() const;
        const std::size_t &no_of_qubits() const;
        void get_nth_qubit(complex (&__s)[2], const std::size_t &nth) const;
        double *&compute_probabilities(double *&probs) const;
        std::size_t measure();
        std::size_t measure_nth_qubit(const std::size_t &nth);
        qubit &operator=(const qubit &q);
        qubit &operator=(qubit &&q) noexcept(true);
        ~qubit();
    };
}

#endif
