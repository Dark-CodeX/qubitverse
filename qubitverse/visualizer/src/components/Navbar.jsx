import React, { useState, useEffect } from "react";

const Navbar = ({ onBlochToggle, isBlochActive }) => {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkTheme]);

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-gray-100 dark:bg-gray-800 shadow">
      <h1
        className="text-2xl font-bold text-gray-800 dark:text-white"
        style={{ userSelect: "none" }}
      >
        <div
          style={{
            backgroundColor: "rgba(50, 61, 76, 0.2)",
            borderRadius: "8px",
            display: "flex",
            color: "#fff",
            padding: "10px 10px",
            cursor: "pointer",
            float: "left",
            justifyContent: "center",
            gap: "5px",
            alignItems: "center",
          }}
        >
          <img src="/icon.png" width={64} height={64} alt="Logo" />
          <code>QubitVerse</code>
        </div>
      </h1>

      <div className="flex items-center space-x-5">
        {/* Dark mode toggle - uncomment if needed */}
        {/* <button
          onClick={() => setDarkTheme((prev) => !prev)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded focus:outline-none"
          style={{ userSelect: "none" }}
        >
          {darkTheme ? "Light Mode" : "Dark Mode"}
        </button> */}

        <button
          onClick={() => location.reload()}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded focus:outline-none"
          style={{ userSelect: "none" }}
        >
          Clear Circuit
        </button>

        {/* Bloch Sphere toggle button */}
        <button
          onClick={onBlochToggle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          style={{ userSelect: "none" }}
        >
          {isBlochActive ? "Back to Circuit" : "Bloch Sphere"}
        </button>

        <a
          href="https://github.com/QubitStorm-HackStacy/QubitStorm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          style={{ userSelect: "none" }}
        >
          <img
            src="/Octicons-mark-github.svg"
            width={38}
            height={38}
            style={{ filter: "invert(1)", userSelect: "none" }}
            alt="GitHub"
          />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
