import React, { useState, useRef, useEffect } from "react";
import {
  LineChart,
  Legend,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Button } from "./ui/button";

function NQubitInput({ setQubits, darkTheme }) {
  const [tempQ, setTempQ] = useState("");
  const [error, setError] = useState("");
  const [lineData, setLineData] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
  console.log(darkTheme);

    inputRef.current?.focus();
  }, []);

  const validate_input = (x) => {
    if (/^\d+$/.test(x.trim()) === false) {
      setError("Please enter a valid and positive number.");
      setQubits(null);
      inputRef.current.focus();
      return null;
    }
    const parsedValue = parseInt(x.trim(), 10);

    if (isNaN(parsedValue) || parsedValue < 1 || !isFinite(parsedValue)) {
      setError("Please enter a number greater than or equal to 1.");
      setQubits(null);
      inputRef.current.focus();
    } else {
      setError("");
    }

    return parsedValue;
  };

  const handleChange = (e) => {
    setTempQ(e.target.value);
    const parsed = validate_input(e.target.value);

    if (error == "" || parsed !== null) {
      const newData = [];
      for (let i = 1; i <= parsed; i++) {
        newData.push({
          name: `Qubit ${i}`,
          qubits: i,
          bytes: Math.pow(2, i) * 16,
        });
      }
      setLineData(newData);
    } else setLineData([]);
  };

  const handleConfirm = () => {
    if (tempQ.trim() === "") {
      setError("");
      return;
    }

    const x = validate_input(tempQ);
    if (error == "" && x !== null) {
      setLineData([]);
      setQubits(x);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };
  return (
    
    <div
      className="dark:bg-primary-darkbg"
      style={{
        display: "flex",
      }}
    >
      <div style={{ height: "600px", width: "50%" }}>
        <div style={{ height: "480px", width: "100%", marginLeft: "20px" }}>
          {lineData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
              style={{ marginTop: "100px", marginLeft: "30px" }}
            >
              <LineChart
                data={lineData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3"  />
                <XAxis

                 stroke= { darkTheme? "var(--color-primary-dark-neon-cyan)":""}
                  dataKey="qubits"
                  label={{
                    value: "Qubits",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                    stroke= { darkTheme? "var(--color-primary-dark-neon-cyan)":""}
                  label={{
                    value: "",
                    angle: -90,
                    position: "insideLeft",
                    offset: 50,
                  }}
                  tickFormatter={(val) => {
                    if (val >= 1e15) return `${(val / 1e15).toFixed(1)} PB`;
                    if (val >= 1e12) return `${(val / 1e12).toFixed(1)} TB`;
                    if (val >= 1e9) return `${(val / 1e9).toFixed(1)} GB`;
                    if (val >= 1e6) return `${(val / 1e6).toFixed(1)} MB`;
                    if (val >= 1e3) return `${(val / 1e3).toFixed(1)} KB`;
                    return `${val} B`;
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: darkTheme?"var(--color-primary-darkbg)": "#fff",
                    
                    borderRadius: "5px",
                    color: darkTheme? "var(--color-primary-dark-text-green)":"#000",
                    padding: "10px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                  }}
                  formatter={(val) => [
                    val >= 1e15
                      ? `Mem. Required: ${(val / 1e15).toFixed(1)} PB`
                      : val >= 1e12
                      ? `Mem. Required: ${(val / 1e12).toFixed(1)} TB`
                      : val >= 1e9
                      ? `Mem. Required: ${(val / 1e9).toFixed(1)} GB`
                      : val >= 1e6
                      ? `Mem. Required: ${(val / 1e6).toFixed(1)} MB`
                      : val >= 1e3
                      ? `Mem. Required: ${(val / 1e3).toFixed(1)} KB`
                      : `${val} B`,
                  ]}
                  labelFormatter={(name) => [`Qubits: ${name}`]}
                />
                <Legend />
                <Line type="monotone" dataKey="bytes" stroke={darkTheme? "var(--color-primary-dark-text-green)" :"#82ca9d"}  dot />
              </LineChart>
              <code className="dark:text-primary-dark-button-green"
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  
                  marginLeft: "37%",
                }}
              >
                Memory Requirements
              </code>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Chart will appear here once you enter a number.
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          width: "50%",
          height: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/*  -----ENTER NUMBER OF QUBITS------- */}
        <div
          className="flex flex-col gap-2.5 select-none w-full max-w-[500px] items-center justify-center border-3 rounded-lg p-8
            shadow-[0px_4px_12px_rgba(0,0,0,0.15)] bg-white dark:bg-secondary-darkbg  dark:border-1 
             dark:border-secondary-darkbg 
             adark:shadow-[0_8px_15px_rgba(0,0,0,0.6),_0_0_15px_3px_rgba(48,225,225,0.6),_0_4px_6px_rgba(124,111,255,0.15)]

"

          // style={{
          //     display: "flex",
          //     flexDirection: "column",
          //     gap: "10px",
          //     userSelect: "none",
          //     width: "100%",
          //     maxWidth: "500px",
          //     alignItems: "center",
          //     justifyContent: "center",
          //     border: "solid 3px",
          //     borderRadius: "8px",
          //     padding: "2rem",
          //     boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          //     backgroundColor: "#fff",
          // }}
        >
          <h1 className="text-2xl tracking-wider font-semibold mb-4 text-center text-primary-darkbg dark:text-primary-dark-text-green">
            Enter Number of Qubits
          </h1>
          <input
            ref={inputRef}
            type="number"
            value={tempQ}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-300 dark:bg-primary-darkbg dark:border-0 
             rounded focus:outline-none focus:ring-2 dark:focus:ring-primary-dark-border-green
             focus:ring-blue-500 dark:text-primary-dark-text-green "
            placeholder="Number of Qubits"
            min="1"
          />
          <Button
            variant="outline"
            className="w-full py-2 
            dark:border-primary-dark-border-green `
            dark:text-primary-dark-text-green
             dark:bg-primary-darkbg
             dark:hover:bg-primary-dark-text-green
             dark:hover:text-primary-darkbg dark:hover:border-primary-darkbg"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="ghost"
            className="w-full text-sm text-gray-500 
            dark:text-primary-dark-button-green 
            dark:hover:text-primary-darkbg 
            dark:border-primary-dark-button-green
            dark:hover:border-primary-dark-border-green
            dark:hover:bg-primary-dark-button-green
            dark:hover:text-md
            "
            onClick={() => {
              setTempQ("");
              setError("");
              setQubits(null);
              inputRef.current.focus();
            }}
          >
            Reset
          </Button>
          {error.length > 0 && (
            <p
              className="text-red-500 text-sm mt-2"
              style={{ fontFamily: "monospace, monospace" }}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NQubitInput;
