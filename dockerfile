# Build stage
FROM ubuntu:24.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    g++ \
    make \
    cmake \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

# Adjust this command according to your build system
RUN g++ \
    -std=c++23 \
    -O3 \
    -DNDEBUG \
    -march=native \
    -mtune=native \
    -masm=intel \
    -funroll-all-loops \
    -pthread \
    qubitverse/simulator/simulator/simulator.cc \
    qubitverse/simulator/lexer/lexer.cc \
    qubitverse/simulator/parser/parser.cc \
    qubitverse/simulator/gates/gates.cc \
    -o \
    simulator    

# Runtime stage
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/simulator .

EXPOSE 9080

CMD ["./simulator"]