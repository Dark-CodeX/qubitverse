/**
 * @file simulator.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include <iostream>
#include "../gates/gates.hh"
#include "../lexer/lexer.hh"
#include "../parser/parser.hh"
#include "../dep/httplib.h"

double deg_to_rad(const double &deg)
{
    return deg * (M_PI / 180.0);
}

void set_quantum_states(const simulator::qubit &q, std::string &__s, const std::string &gate)
{
    const simulator::qubit::complex *vec_space = q.get_qubits();
    std::stringstream ss;
    ss << gate << "\n";
    for (std::size_t i = 0; i < q.get_size(); i++)
    {
        ss << i << "=" << vec_space[i] << "\n";
    }
    __s.append(ss.str());
}

std::string get_quantum_info(const std::size_t &nQ, const std::vector<std::unique_ptr<simulator::ast_node>> &gates, const char &operation)
{
    /*
    operation:
    0 -> normal calculations (0)
    1 -> prob (0, 1)
    2 -> measure (0, 1, 2)
    */
    simulator::qubit qsys(nQ);
    std::string ret_val;

    std::puts("System is on initial state:");
    set_quantum_states(qsys, ret_val, "+"); // + indicates initial state
    for (const std::unique_ptr<simulator::ast_node> &i : gates)
    {
        if (i->get_gate_type() == simulator::gate_type::SINGLE_GATE)
        {
            auto *casted = dynamic_cast<simulator::ast_single_gate_node *>(i.get());
            if (casted->M_gate == "I")
            {
                std::printf("Applying Identity Gate on Qubit %zu:\n", casted->M_qubit);
                qsys.apply_identity(casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "X")
            {
                std::printf("Applying Pauli-X Gate on Qubit %zu:\n", casted->M_qubit);
                qsys.apply_pauli_x(casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "Y")
            {
                std::printf("Applying Pauli-Y Gate on Qubit %zu:\n", casted->M_qubit);
                qsys.apply_pauli_y(casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "Z")
            {
                std::printf("Applying Pauli-Z Gate on Qubit %zu:\n", casted->M_qubit);
                qsys.apply_pauli_z(casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "H")
            {
                std::printf("Applying Hadamard Gate on Qubit %zu:\n", casted->M_qubit);
                qsys.apply_hadamard(casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "S")
            {
                std::printf("Applying Phase Shift Gate by pi/2 on Qubit %zu:\n", casted->M_qubit);
                qsys.apply_phase_pi_2_shift(casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "T")
            {
                std::printf("Applying Phase Shift Gate by pi/4 on Qubit %zu:\n", casted->M_qubit);
                qsys.apply_phase_pi_4_shift(casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "P")
            {
                std::printf("Applying General Phase Shift Gate by %lf rad on Qubit %zu:\n", deg_to_rad(casted->M_theta), casted->M_qubit);
                qsys.apply_phase_general_shift(deg_to_rad(casted->M_theta), casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "Rx")
            {
                std::printf("Applying Rotation-X Gate by %lf rad on Qubit %zu:\n", deg_to_rad(casted->M_theta), casted->M_qubit);
                qsys.apply_rotation_x(deg_to_rad(casted->M_theta), casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "Ry")
            {
                std::printf("Applying Rotation-Y Gate by %lf rad on Qubit %zu:\n", deg_to_rad(casted->M_theta), casted->M_qubit);
                qsys.apply_rotation_y(deg_to_rad(casted->M_theta), casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "Rz")
            {
                std::printf("Applying Rotation-Z Gate by %lf rad on Qubit %zu:\n", deg_to_rad(casted->M_theta), casted->M_qubit);
                qsys.apply_rotation_z(deg_to_rad(casted->M_theta), casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "V")
            {
                std::printf("Applying V Gate on Qubit %zu:\n", casted->M_qubit);
                qsys.apply_v(casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
            else if (casted->M_gate == "adjV")
            {
                std::printf("Applying V^-1 Gate on Qubit %zu:\n", casted->M_qubit);
                qsys.apply_adj_v(casted->M_qubit);
                set_quantum_states(qsys, ret_val, casted->M_gate);
            }
        }
        else if (i->get_gate_type() == simulator::gate_type::CNOT_GATE)
        {
            auto *casted = dynamic_cast<simulator::ast_cnot_gate_node *>(i.get());
            std::printf("Applying CNOT Gate [Control Qubit: %zu, Target Qubit: %zu]:\n", casted->M_control, casted->M_target);
            qsys.apply_cnot(casted->M_control, casted->M_target);
            set_quantum_states(qsys, ret_val, "cnot");
        }
        else if (i->get_gate_type() == simulator::gate_type::CZ_GATE)
        {
            auto *casted = dynamic_cast<simulator::ast_cz_gate_node *>(i.get());
            std::printf("Applying CZ Gate [Control Qubit: %zu, Target Qubit: %zu]:\n", casted->M_control, casted->M_target);
            qsys.apply_cz(casted->M_control, casted->M_target);
            set_quantum_states(qsys, ret_val, "cz");
        }
        else if (i->get_gate_type() == simulator::gate_type::SWAP_GATE)
        {
            auto *casted = dynamic_cast<simulator::ast_swap_gate_node *>(i.get());
            std::printf("Applying SWAP Gate [Qubit1: %zu, Qubit2: %zu]:\n", casted->M_qubit1, casted->M_qubit2);
            qsys.apply_swap(casted->M_qubit1, casted->M_qubit2);
            set_quantum_states(qsys, ret_val, "swap");
        }
        else if (i->get_gate_type() == simulator::gate_type::MEASURE_NTH)
        {
            auto *casted = dynamic_cast<simulator::ast_measure_nth_node *>(i.get());
            std::printf("Measuring the Qubit %zu:\n", casted->M_qubit);
            qsys.measure_nth_qubit(casted->M_qubit);
            set_quantum_states(qsys, ret_val, "measureNth");
        }
    }

    ret_val.append("bloch\n");
    for (std::size_t i = 0; i < qsys.no_of_qubits(); i++)
    {
        double bloch[3];
        qsys.get_bloch_data(bloch, i);
        ret_val.append(std::to_string(bloch[0]) + "," + std::to_string(bloch[1]) + "," + std::to_string(bloch[2]) + "\n");
    }

    if (operation == '0')
        return ret_val;
    else if (operation == '1')
    {
        ret_val.append("prob\n");
        double *vec_prob = new double[qsys.get_size()]();
        std::puts("Computing Probabilities:");
        qsys.compute_probabilities(vec_prob);

        std::stringstream ss;
        for (std::size_t i = 0; i < qsys.get_size(); i++)
        {
            ss << i << "=" << vec_prob[i] << "\n";
        }
        ret_val.append(ss.str());
        delete[] vec_prob;
        return ret_val;
    }
    else if (operation == '2')
    {
        ret_val.append("prob\n");
        double *vec_prob = new double[qsys.get_size()]();
        std::puts("Computing Probabilities:");
        qsys.compute_probabilities(vec_prob);

        std::stringstream ss;
        for (std::size_t i = 0; i < qsys.get_size(); i++)
        {
            ss << i << "=" << vec_prob[i] << "\n";
        }

        std::puts("Measuring the states:");
        ss << "measure\n"
           << qsys.measure() << "\n";

        ret_val.append(ss.str());
        delete[] vec_prob;
        return ret_val;
    }
}

int main(void)
{
    httplib::Server svr;
    svr.Post("/api/endpoint", [](const httplib::Request &req, httplib::Response &res)
             {
                char feature = req.body[0];
                simulator::lexer lex;
                lex.perform(req.body.substr(1));

                simulator::parser parser;
                parser.perform(lex.get());
                parser.debug_print();

                std::string reply = get_quantum_info(parser.get_no_qubits(), parser.get(), feature);

                // Set CORS header
                res.set_header("Access-Control-Allow-Origin", "https://qubitverse-lpa4.onrender.com");

                // Set the response content as plain text
                res.set_content(reply, "text/plain");
                std::puts("---------------------------------------------------------------------"); });

    // Start the server on port 9080
    svr.listen("0.0.0.0", 9080);

    return EXIT_SUCCESS;
}
