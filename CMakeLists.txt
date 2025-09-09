cmake_minimum_required(VERSION 3.10)

project(qubitverse)

# Set compiler options
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -O3 -DNDEBUG -march=native -mtune=native -masm=intel -funroll-all-loops -s")

# Add include directories
include_directories(
    ./qubitverse/simulator
)

# Add source files
set(SOURCES
    ./qubitverse/simulator/simulator/simulator.cc
    ./qubitverse/simulator/lexer/lexer.cc
    ./qubitverse/simulator/parser/parser.cc
    ./qubitverse/simulator/gates/gates.cc
    ./qubitverse/simulator/gates/advanced_gates.cc
)

# Add test executable
add_executable(grover_test ./qubitverse/simulator/grover_test.cc)

# Create the executable target
add_executable(${PROJECT_NAME} ${SOURCES})