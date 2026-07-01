import React, { useState, useEffect } from "react";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-2 bg-gray-100 dark:bg-gray-800 shadow">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white" style={{ userSelect: "none" }}>
                <div style={{
                    backgroundColor: "rgba(50, 61, 76, 0.2)",
                    borderRadius: "8px",
                    display: "flex",
                    color: "#fff",
                    padding: "10px 10px 10px 10px",
                    cursor: "pointer",
                    float: "left",
                    justifyContent: "center",
                    gap: "5px",
                    alignItems: "center"
                }}>
                    <img src="/icon.png" width={64} height={64}></img>
                    <code>QubitVerse</code>
                </div></h1>
            <div className="flex items-center space-x-5">
                <span style={{ fontSize: "0.875rem", color: "rgba(230, 50, 50, 0.8)", userSelect: "none", marginRight: "10px" }}>
                    NOTE: This is a demo version, you may experience 30-40 seconds delay on first run due to inactivity on the server.
                </span>
                <button
                    onClick={() => location.reload()}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded focus:outline-none"
                    style={{ userSelect: "none" }}
                >
                    Clear Circuit
                </button>
                <a
                    href="https://github.com/Dark-CodeX/qubitverse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    style={{ userSelect: "none" }}
                >
                    <img src="/Octicons-mark-github.svg" width={38} height={38} style={{ filter: "invert(1)", userSelect: "none" }}></img>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
