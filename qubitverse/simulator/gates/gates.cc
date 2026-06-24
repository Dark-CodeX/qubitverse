/**
 * @file gates.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include "./gates.hh"

namespace simulator
{
    void qubit::apply_predefined_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &qubit_target)
    {
        const std::size_t stride = 1ULL << qubit_target; // Distance between paired indices
        std::size_t g_index;
        if (__g_type == gate_type::SQRT_OF_X_V)
            g_index = 7;
        else if (__g_type == gate_type::ADJ_SQRT_OF_X_V)
            g_index = 8;
        else
            g_index = static_cast<std::size_t>(__g_type);

        for (std::size_t i = 0; i < _len; i += 2 * stride)
        {
            for (std::size_t j = 0; j < stride; ++j)
            {
                std::size_t idx0 = i + j;
                std::size_t idx1 = i + j + stride;

                // Apply the gate to the two elements
                complex a = __s[idx0];
                complex b = __s[idx1];

                __s[idx0] = pre_defined_qgates[g_index].matrix[0][0] * a + pre_defined_qgates[g_index].matrix[0][1] * b;
                __s[idx1] = pre_defined_qgates[g_index].matrix[1][0] * a + pre_defined_qgates[g_index].matrix[1][1] * b;
            }
        }
    }

    qubit::qgate_2x2 &qubit::get_theta_gate(qgate_2x2 &__g, const gate_type &__g_type, const double &__theta)
    {
        __g.type = __g_type;
        switch (__g_type)
        {
        case gate_type::PHASE_GENERAL_SHIFT:
            __g.matrix[0][0] = 1.0;
            __g.matrix[0][1] = 0.0;
            __g.matrix[1][0] = 0.0;
            __g.matrix[1][1] = std::polar(1.0, __theta);
            break;

        case gate_type::ROTATION_X:
            __g.matrix[0][0] = std::cos<double>(__theta / 2.0);
            __g.matrix[0][1] = (complex){0.0, -1.0} * std::sin<double>(__theta / 2.0);
            __g.matrix[1][0] = (complex){0.0, -1.0} * std::sin<double>(__theta / 2.0);
            __g.matrix[1][1] = std::cos<double>(__theta / 2.0);
            break;

        case gate_type::ROTATION_Y:
            __g.matrix[0][0] = std::cos<double>(__theta / 2.0);
            __g.matrix[0][1] = -std::sin<double>(__theta / 2.0);
            __g.matrix[1][0] = std::sin<double>(__theta / 2.0);
            __g.matrix[1][1] = std::cos<double>(__theta / 2.0);
            break;

        case gate_type::ROTATION_Z:
            __g.matrix[0][0] = std::polar(1.0, -__theta / 2.0);
            __g.matrix[0][1] = 0.0;
            __g.matrix[1][0] = 0.0;
            __g.matrix[1][1] = std::polar(1.0, __theta / 2.0);
            break;

        default:
            std::fprintf(stderr, "error: invalid gate selected '%u'\n", (unsigned)__g_type);
            std::exit(EXIT_FAILURE);
        }
        return __g;
    }

    void qubit::apply_theta_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const double &__theta, const std::size_t &qubit_target)
    {
        const std::size_t stride = 1ULL << qubit_target; // Distance between paired indices
        qgate_2x2 __g;
        __g = qubit::get_theta_gate(__g, __g_type, __theta);

        for (std::size_t i = 0; i < _len; i += 2 * stride)
        {
            for (std::size_t j = 0; j < stride; ++j)
            {
                std::size_t idx0 = i + j;
                std::size_t idx1 = i + j + stride;

                // Apply the gate to the two elements
                complex a = __s[idx0];
                complex b = __s[idx1];

                __s[idx0] = __g.matrix[0][0] * a + __g.matrix[0][1] * b;
                __s[idx1] = __g.matrix[1][0] * a + __g.matrix[1][1] * b;
            }
        }
    }

    void qubit::apply_2qubit_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &q_control, const std::size_t &q_target)
    {
        if (std::log2(_len) < 2.0)
        {
            std::fprintf(stderr, "error: specified gate operation requires a minimum of 2 qubit-system, but it was %zu qubit-system.\n", (std::size_t)std::log2(_len));
            std::exit(EXIT_FAILURE);
        }

        if (__g_type == gate_type::CONTROLLED_NOT)
        {
            for (std::size_t i = 0; i < _len; i++)
            {
                if ((i & (1ULL << q_control)) != 0)
                { // If control qubit is 1
                    std::size_t target_bit_flipped_index = i ^ (1ULL << q_target);
                    // Only swap once per pair.
                    if (i < target_bit_flipped_index)
                    {
                        std::swap(__s[i], __s[target_bit_flipped_index]);
                    }
                }
            }
        }
        else if (__g_type == gate_type::CONTROLLED_Z)
        {
            for (std::size_t i = 0; i < _len; i++)
            {
                if (((i >> q_control) & 1) && ((i >> q_target) & 1))
                {
                    __s[i] *= -1;
                }
            }
        }
        else if (__g_type == gate_type::SWAP_GATE)
        {
            for (std::size_t i = 0; i < _len; ++i)
            {
                // Extract the bits at positions q_control and q_target.
                const std::size_t bit_q1 = (i >> q_control) & 1;
                const std::size_t bit_q2 = (i >> q_target) & 1;

                // Only need to swap if the bits differ.
                if (bit_q1 != bit_q2)
                {
                    // Flip the bits at q_control and q_target.
                    std::size_t j = i ^ ((1ULL << q_control) | (1ULL << q_target));
                    // To avoid double swapping, swap only if i < j.
                    if (i < j)
                    {
                        std::swap(__s[i], __s[j]);
                    }
                }
            }
        }
    }

    qubit::qubit(const std::size_t &n)
    {
        if (n < 1)
        {
            std::fprintf(stderr, "error: at-least 1 qubit must be present in a valid quantum circuit\n");
            std::exit(EXIT_FAILURE);
        }
        this->M_no_qubits = n;
        this->M_len = 1ULL << n;
        this->M_qubits = new complex[this->M_len]();
        this->M_qubits[0] = {1, 0}; // initial state |0> = 1 + 0i, 0 + 0i, 0 + 0i, ..., 0 + 0i
    }

    qubit::qubit(const qubit &q)
    {
        this->M_len = q.M_len;
        this->M_no_qubits = q.M_no_qubits;
        this->M_qubits = new complex[this->M_len]();

        for (std::size_t i = 0; i < this->M_len; i++)
        {
            this->M_qubits[i] = q.M_qubits[i];
        }
    }

    qubit::qubit(qubit &&q) noexcept(true)
    {
        this->M_len = q.M_len;
        this->M_no_qubits = q.M_no_qubits;
        this->M_qubits = q.M_qubits;

        q.M_len = q.M_no_qubits = 0;
        q.M_qubits = nullptr;
    }

    qubit &qubit::apply_identity(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::IDENTITY, q_target);
        return *this;
    }

    qubit &qubit::apply_pauli_x(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PAULI_X, q_target);
        return *this;
    }

    qubit &qubit::apply_pauli_y(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PAULI_Y, q_target);
        return *this;
    }

    qubit &qubit::apply_pauli_z(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PAULI_Z, q_target);
        return *this;
    }

    qubit &qubit::apply_hadamard(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::HADAMARD, q_target);
        return *this;
    }

    qubit &qubit::apply_phase_pi_2_shift(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PHASE_PI_2_SHIFT, q_target);
        return *this;
    }

    qubit &qubit::apply_phase_pi_4_shift(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PHASE_PI_4_SHIFT, q_target);
        return *this;
    }

    qubit &qubit::apply_phase_general_shift(const double &_theta, const std::size_t &q_target)
    {
        qubit::apply_theta_gate(this->M_qubits, this->M_len, gate_type::PHASE_GENERAL_SHIFT, _theta, q_target);
        return *this;
    }

    qubit &qubit::apply_rotation_x(const double &_theta, const std::size_t &q_target)
    {
        qubit::apply_theta_gate(this->M_qubits, this->M_len, gate_type::ROTATION_X, _theta, q_target);
        return *this;
    }

    qubit &qubit::apply_rotation_y(const double &_theta, const std::size_t &q_target)
    {
        qubit::apply_theta_gate(this->M_qubits, this->M_len, gate_type::ROTATION_Y, _theta, q_target);
        return *this;
    }

    qubit &qubit::apply_rotation_z(const double &_theta, const std::size_t &q_target)
    {
        qubit::apply_theta_gate(this->M_qubits, this->M_len, gate_type::ROTATION_Z, _theta, q_target);
        return *this;
    }

    qubit &qubit::apply_v(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::SQRT_OF_X_V, q_target);
        return *this;
    }

    qubit &qubit::apply_adj_v(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::ADJ_SQRT_OF_X_V, q_target);
        return *this;
    }

    qubit &qubit::apply_cnot(const std::size_t &q_control, const std::size_t &q_target)
    {
        qubit::apply_2qubit_gate(this->M_qubits, this->M_len, gate_type::CONTROLLED_NOT, q_control, q_target);
        return *this;
    }

    qubit &qubit::apply_cz(const std::size_t &q_control, const std::size_t &q_target)
    {
        qubit::apply_2qubit_gate(this->M_qubits, this->M_len, gate_type::CONTROLLED_Z, q_control, q_target);
        return *this;
    }

    qubit &qubit::apply_swap(const std::size_t &qubit_1, const std::size_t &qubit_2)
    {
        qubit::apply_2qubit_gate(this->M_qubits, this->M_len, gate_type::SWAP_GATE, qubit_1, qubit_2);
        return *this;
    }

    void qubit::get_bloch_data(double (&__cord)[3], const std::size_t &nth) const
    {
        // __cord[0] = x
        // __cord[1] = y
        // __cord[2] = z

        complex S = {0, 0};
        double Z = 0;

        for (std::size_t i = 0; i < this->M_len; i++)
        {
            std::size_t bit = (i >> nth) & 1;
            if (bit == 1)
                continue;

            std::size_t j = i ^ (1ULL << nth);

            qubit::complex a = this->M_qubits[i], b = this->M_qubits[j];

            S += a * std::conj(b);
            Z += (std::norm(a) - std::norm(b));
        }

        __cord[0] = 2.0 * S.real();
        __cord[1] = 2.0 * S.imag();
        __cord[2] = Z;
    }

    const qubit::complex *qubit::get_qubits() const
    {
        return this->M_qubits;
    }

    const std::size_t &qubit::get_size() const
    {
        return this->M_len;
    }

    const std::size_t qubit::memory_consumption() const
    {
        return sizeof(complex) * (this->M_len);
    }

    const std::size_t &qubit::no_of_qubits() const
    {
        return this->M_no_qubits;
    }

    void qubit::get_nth_qubit(complex (&__s)[2], const std::size_t &nth) const
    {
        std::size_t mask = 1ULL << (this->M_no_qubits - nth - 1);
        for (std::size_t i = 0; i < this->M_len; i++)
        {
            if (i & mask)
                __s[1] += this->M_qubits[i];
            else
                __s[0] += this->M_qubits[i];
        }
        double norm = std::sqrt((std::abs(__s[0]) * std::abs(__s[0])) + (std::abs(__s[1]) * std::abs(__s[1])));

        if (norm > 0)
        {
            __s[0] /= norm;
            __s[1] /= norm;
        }
    }

    double *&qubit::compute_probabilities(double *&probs) const
    {
        if (!probs)
            return probs;
        for (std::size_t i = 0; i < this->M_len; i++)
        {
            probs[i] = std::norm(this->M_qubits[i]);
        }
        return probs;
    }

    std::size_t qubit::measure()
    {
        double tot_prob = 0.0;
        for (std::size_t i = 0; i < this->M_len; i++)
        {
            tot_prob += std::norm(this->M_qubits[i]);
        }

        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution dist(0.0, tot_prob);
        double r = dist(gen);

        double accum = 0.0;
        std::size_t res = 0;
        for (std::size_t i = 0; i < this->M_len; i++)
        {
            accum += std::norm(this->M_qubits[i]);
            if (accum >= r)
            {
                res = i;
                break;
            }
        }

        for (std::size_t i = 0; i < this->M_len; i++)
        {
            this->M_qubits[i] = (i == res) ? (complex){1.0, 0.0} : (complex){0.0, 0.0};
        }

        return res;
    }

    std::size_t qubit::measure_nth_qubit(const std::size_t &nth)
    {
        double prob0 = 0.0, prob1 = 0.0;

        for (std::size_t i = 0; i < this->M_len; i++)
        {
            int bit = (i >> nth) & 1;
            double ampSquared = std::norm(this->M_qubits[i]); // norm = |amplitude|^2
            if (bit == 0)
                prob0 += ampSquared;
            else
                prob1 += ampSquared;
        }

        double totalProb = prob0 + prob1;
        if (std::abs(totalProb - 1.0) > 1.0E-6)
        {
            std::fprintf(stderr, "warning: state is not normalized, total probability = %lf\n", totalProb);
        }

        // Randomly choose measurement outcome based on the computed probabilities.
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution<> dis(0.0, 1.0);
        double rnd = dis(gen);

        int outcome = (rnd < prob0) ? 0 : 1;

        // Collapse the state vector: set amplitudes incompatible with the outcome to zero.
        double normFactor = (outcome == 0) ? std::sqrt(prob0) : std::sqrt(prob1);
        if (normFactor == 0)
        {
            std::fprintf(stderr, "error: measured probability is zero.");
            return -1;
        }

        for (std::size_t i = 0; i < this->M_len; i++)
        {
            int bit = (i >> nth) & 1;
            if (bit != outcome)
            {
                this->M_qubits[i] = 0;
            }
            else
            {
                this->M_qubits[i] /= normFactor; // renormalize amplitude
            }
        }

        return outcome;
    }

    qubit &qubit::operator=(const qubit &q)
    {
        if (this != &q)
        {
            if (this->M_qubits)
                delete[] this->M_qubits;

            this->M_len = q.M_len;
            this->M_no_qubits = q.M_no_qubits;
            this->M_qubits = new complex[this->M_len]();

            for (std::size_t i = 0; i < this->M_len; i++)
            {
                this->M_qubits[i] = q.M_qubits[i];
            }
        }
        return *this;
    }

    qubit &qubit::operator=(qubit &&q) noexcept(true)
    {
        if (this != &q)
        {
            if (this->M_qubits)
                delete[] this->M_qubits;

            this->M_len = q.M_len;
            this->M_no_qubits = q.M_no_qubits;
            this->M_qubits = q.M_qubits;

            q.M_len = q.M_no_qubits = 0;
            q.M_qubits = nullptr;
        }
        return *this;
    }

    qubit::~qubit()
    {
        if (this->M_qubits)
            delete[] this->M_qubits;
    }
}