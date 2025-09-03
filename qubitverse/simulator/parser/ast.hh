/**
 * @file ast.hh
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#ifndef SIMULATOR_AST
#define SIMULATOR_AST

#include <string>
#include <vector>

namespace simulator
{
    enum gate_type : unsigned char
    {
        SINGLE_GATE,
        CNOT_GATE,
        CZ_GATE,
        SWAP_GATE,
        MEASURE_NTH,
        TOFFOLI_GATE,
        FREDKIN_GATE,
        MULTI_CONTROLLED_X_GATE,
        MULTI_CONTROLLED_Z_GATE,
        QFT_GATE
    };

    class ast_node
    {
      public:
        virtual ~ast_node() = default;
        virtual gate_type get_gate_type() const = 0;
    };

    class ast_single_gate_node : public ast_node
    {
      public:
        std::string M_gate;
        std::size_t M_qubit;
        double M_theta;

        ast_single_gate_node(std::string &&_g, const std::size_t &_q, const double &_t)
            : M_gate(std::move(_g)), M_qubit(_q), M_theta(_t) {}

        gate_type get_gate_type() const override { return gate_type::SINGLE_GATE; }
    };

    class ast_cnot_gate_node : public ast_node
    {
      public:
        std::size_t M_control;
        std::size_t M_target;

        ast_cnot_gate_node(const std::size_t &ctrl, const std::size_t &tar)
            : M_control(ctrl), M_target(tar) {}

        gate_type get_gate_type() const override { return gate_type::CNOT_GATE; }
    };

    class ast_cz_gate_node : public ast_node
    {
      public:
        std::size_t M_control;
        std::size_t M_target;

        ast_cz_gate_node(const std::size_t &ctrl, const std::size_t &tar)
            : M_control(ctrl), M_target(tar) {}

        gate_type get_gate_type() const override { return gate_type::CZ_GATE; }
    };

    class ast_swap_gate_node : public ast_node
    {
      public:
        std::size_t M_qubit1;
        std::size_t M_qubit2;

        ast_swap_gate_node(const std::size_t &q1, const std::size_t &q2)
            : M_qubit1(q1), M_qubit2(q2) {}

        gate_type get_gate_type() const override { return gate_type::SWAP_GATE; }
    };

    class ast_measure_nth_node : public ast_node
    {
      public:
        std::size_t M_qubit;

        ast_measure_nth_node(const std::size_t &q) : M_qubit(q) {}

        gate_type get_gate_type() const override { return gate_type::MEASURE_NTH; }
    };

    class ast_toffoli_gate_node : public ast_node
    {
      public:
        std::size_t M_ctrl1;
        std::size_t M_ctrl2;
        std::size_t M_target;

        ast_toffoli_gate_node(const std::size_t &c1, const std::size_t &c2, const std::size_t &t)
            : M_ctrl1(c1), M_ctrl2(c2), M_target(t) {}

        gate_type get_gate_type() const override { return gate_type::TOFFOLI_GATE; }
    };

    class ast_fredkin_gate_node : public ast_node
    {
      public:
        std::size_t M_ctrl;
        std::size_t M_target1;
        std::size_t M_target2;

        ast_fredkin_gate_node(const std::size_t &c, const std::size_t &t1, const std::size_t &t2)
            : M_ctrl(c), M_target1(t1), M_target2(t2) {}

        gate_type get_gate_type() const override { return gate_type::FREDKIN_GATE; }
    };

    class ast_multi_controlled_x_gate_node : public ast_node
    {
      public:
        std::vector<std::size_t> M_controls;
        std::size_t M_target;

        ast_multi_controlled_x_gate_node(std::vector<std::size_t> &&controls, const std::size_t &t)
            : M_controls(std::move(controls)), M_target(t) {}

        gate_type get_gate_type() const override { return gate_type::MULTI_CONTROLLED_X_GATE; }
    };

    class ast_multi_controlled_z_gate_node : public ast_node
    {
      public:
        std::vector<std::size_t> M_controls;
        std::size_t M_target;

        ast_multi_controlled_z_gate_node(std::vector<std::size_t> &&controls, const std::size_t &t)
            : M_controls(std::move(controls)), M_target(t) {}

        gate_type get_gate_type() const override { return gate_type::MULTI_CONTROLLED_Z_GATE; }
    };

    class ast_qft_gate_node : public ast_node
    {
      public:
        std::vector<std::size_t> M_qubits;
        bool M_inverse;

        ast_qft_gate_node(std::vector<std::size_t> &&qubits, bool inverse = false)
            : M_qubits(std::move(qubits)), M_inverse(inverse) {}

        gate_type get_gate_type() const override { return gate_type::QFT_GATE; }
    };
}

#endif