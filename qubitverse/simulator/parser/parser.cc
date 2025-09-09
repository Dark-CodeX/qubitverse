/**
 * @file parser.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include "./parser.hh"

namespace simulator
{
    bool parser::perform(std::vector<token> &toks)
    {
        std::size_t i = 0;
        if (toks[i].M_val == "n")
            i += 2; // skips n at 0, then ':' at 1
        this->M_nqubs = std::stoul(toks[i++].M_val, (std::size_t *)0, 10);
        this->M_gatelist.reserve(this->M_nqubs);

        for (; i < toks.size();)
        {
            if (toks[i].M_val == "type")
            {
                i += 2; // skips type type and :
                if (toks[i].M_val == "single")
                {
                    i++; // skips single
                    std::string g_type;
                    std::size_t qub;
                    double theta;

                    i += 2; // skips gateType
                    g_type = toks[i++].M_val;
                    i += 2; // skips qubit
                    qub = std::stoul(toks[i++].M_val);
                    i += 2; // skips theta
                    theta = std::stod(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_single_gate_node(std::move(g_type), qub, theta));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "cnot")
                {
                    i++; // skips cnot
                    std::size_t ctrl, tar;

                    i += 2; // skips control
                    ctrl = std::stoul(toks[i++].M_val);
                    i += 2; // skips target
                    tar = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_cnot_gate_node(ctrl, tar));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "cz")
                {
                    i++; // skips cz
                    std::size_t ctrl, tar;

                    i += 2; // skips control
                    ctrl = std::stoul(toks[i++].M_val);
                    i += 2; // skips target
                    tar = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_cz_gate_node(ctrl, tar));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "swap")
                {
                    i++; // skips swap
                    std::size_t q1, q2;

                    i += 2; // skips qubit1
                    q1 = std::stoul(toks[i++].M_val);
                    i += 2; // skips qubit2
                    q2 = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_swap_gate_node(q1, q2));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "measurenth")
                {
                    i++; // skips measurenth
                    std::size_t q;

                    i += 2; // skips qubit
                    q = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_measure_nth_node(q));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "toffoli")
                {
                    i++; // skips toffoli
                    std::size_t ctrl1, ctrl2, target;

                    i += 2; // skips control1
                    ctrl1 = std::stoul(toks[i++].M_val);
                    i += 2; // skips control2
                    ctrl2 = std::stoul(toks[i++].M_val);
                    i += 2; // skips target
                    target = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_toffoli_gate_node(ctrl1, ctrl2, target));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "fredkin")
                {
                    i++; // skips fredkin
                    std::size_t ctrl, target1, target2;

                    i += 2; // skips control
                    ctrl = std::stoul(toks[i++].M_val);
                    i += 2; // skips target1
                    target1 = std::stoul(toks[i++].M_val);
                    i += 2; // skips target2
                    target2 = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_fredkin_gate_node(ctrl, target1, target2));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "mcnot")
                {
                    i++; // skips mcnot
                    std::vector<std::size_t> controls;
                    std::size_t target;

                    i += 2; // skips controls
                    // Parse control qubits (comma-separated)
                    std::string controls_str = toks[i++].M_val;
                    std::size_t pos = 0;
                    std::string token;
                    while ((pos = controls_str.find(',')) != std::string::npos) {
                        token = controls_str.substr(0, pos);
                        controls.push_back(std::stoul(token));
                        controls_str.erase(0, pos + 1);
                    }
                    controls.push_back(std::stoul(controls_str));

                    i += 2; // skips target
                    target = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_multi_controlled_x_gate_node(std::move(controls), target));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "mcz")
                {
                    i++; // skips mcz
                    std::vector<std::size_t> controls;
                    std::size_t target;

                    i += 2; // skips controls
                    // Parse control qubits (comma-separated)
                    std::string controls_str = toks[i++].M_val;
                    std::size_t pos = 0;
                    std::string token;
                    while ((pos = controls_str.find(',')) != std::string::npos) {
                        token = controls_str.substr(0, pos);
                        controls.push_back(std::stoul(token));
                        controls_str.erase(0, pos + 1);
                    }
                    controls.push_back(std::stoul(controls_str));

                    i += 2; // skips target
                    target = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_multi_controlled_z_gate_node(std::move(controls), target));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "qft")
                {
                    i++; // skips qft
                    std::vector<std::size_t> qubits;
                    bool inverse = false;

                    i += 2; // skips qubits
                    // Parse qubits (comma-separated)
                    std::string qubits_str = toks[i++].M_val;
                    std::size_t pos = 0;
                    std::string token;
                    while ((pos = qubits_str.find(',')) != std::string::npos) {
                        token = qubits_str.substr(0, pos);
                        qubits.push_back(std::stoul(token));
                        qubits_str.erase(0, pos + 1);
                    }
                    qubits.push_back(std::stoul(qubits_str));

                    i += 2; // skips inverse
                    inverse = (toks[i++].M_val == "true");
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_qft_gate_node(std::move(qubits), inverse));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else
                    return false;
            }
            else
                return false;
        }
        toks.clear();
        return true;
    }

    std::vector<std::unique_ptr<ast_node>> &parser::get()
    {
        return this->M_gatelist;
    }

    const std::size_t &parser::get_no_qubits() const
    {
        return this->M_nqubs;
    }

    void parser::debug_print() const
    {
        for (const auto &i : this->M_gatelist)
        {
            if (i->get_gate_type() == gate_type::SINGLE_GATE)
            {
                auto *casted = dynamic_cast<ast_single_gate_node *>(i.get());
                std::printf("SINGLE_GATE: [GATE: %s, QUBIT: %zu, THETA: %lf]\n",
                            casted->M_gate.c_str(),
                            casted->M_qubit,
                            casted->M_theta);
            }
            else if (i->get_gate_type() == gate_type::CNOT_GATE)
            {
                auto *casted = dynamic_cast<ast_cnot_gate_node *>(i.get());
                std::printf("CNOT_GATE: [CONTROL: %zu, TARGET: %zu]\n",
                            casted->M_control,
                            casted->M_target);
            }
            else if (i->get_gate_type() == gate_type::CZ_GATE)
            {
                auto *casted = dynamic_cast<ast_cz_gate_node *>(i.get());
                std::printf("CZ_GATE: [CONTROL: %zu, TARGET: %zu]\n",
                            casted->M_control,
                            casted->M_target);
            }
            else if (i->get_gate_type() == gate_type::SWAP_GATE)
            {
                auto *casted = dynamic_cast<ast_swap_gate_node *>(i.get());
                std::printf("SWAP_GATE: [QUBIT1: %zu, QUBIT2: %zu]\n",
                            casted->M_qubit1,
                            casted->M_qubit2);
            }
            else if (i->get_gate_type() == gate_type::TOFFOLI_GATE)
            {
                auto *casted = dynamic_cast<ast_toffoli_gate_node *>(i.get());
                std::printf("TOFFOLI_GATE: [CTRL1: %zu, CTRL2: %zu, TARGET: %zu]\n",
                            casted->M_ctrl1,
                            casted->M_ctrl2,
                            casted->M_target);
            }
            else if (i->get_gate_type() == gate_type::FREDKIN_GATE)
            {
                auto *casted = dynamic_cast<ast_fredkin_gate_node *>(i.get());
                std::printf("FREDKIN_GATE: [CTRL: %zu, TARGET1: %zu, TARGET2: %zu]\n",
                            casted->M_ctrl,
                            casted->M_target1,
                            casted->M_target2);
            }
            else if (i->get_gate_type() == gate_type::MULTI_CONTROLLED_X_GATE)
            {
                auto *casted = dynamic_cast<ast_multi_controlled_x_gate_node *>(i.get());
                std::printf("MULTI_CONTROLLED_X_GATE: [CONTROLS: ");
                for (size_t j = 0; j < casted->M_controls.size(); ++j) {
                    std::printf("%zu", casted->M_controls[j]);
                    if (j < casted->M_controls.size() - 1) std::printf(",");
                }
                std::printf(", TARGET: %zu]\n", casted->M_target);
            }
            else if (i->get_gate_type() == gate_type::MULTI_CONTROLLED_Z_GATE)
            {
                auto *casted = dynamic_cast<ast_multi_controlled_z_gate_node *>(i.get());
                std::printf("MULTI_CONTROLLED_Z_GATE: [CONTROLS: ");
                for (size_t j = 0; j < casted->M_controls.size(); ++j) {
                    std::printf("%zu", casted->M_controls[j]);
                    if (j < casted->M_controls.size() - 1) std::printf(",");
                }
                std::printf(", TARGET: %zu]\n", casted->M_target);
            }
            else if (i->get_gate_type() == gate_type::QFT_GATE)
            {
                auto *casted = dynamic_cast<ast_qft_gate_node *>(i.get());
                std::printf("QFT_GATE: [QUBITS: ");
                for (size_t j = 0; j < casted->M_qubits.size(); ++j) {
                    std::printf("%zu", casted->M_qubits[j]);
                    if (j < casted->M_qubits.size() - 1) std::printf(",");
                }
                std::printf(", INVERSE: %s]\n", casted->M_inverse ? "true" : "false");
            }
        }
    }
}