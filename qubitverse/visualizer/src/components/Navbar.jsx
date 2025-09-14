import React, { useState, useEffect } from "react";

const Navbar = ({ onBlochToggle, isBlochActive, darkTheme, setDarkTheme }) => {


 
  return (
    <nav className="flex  items-center justify-between px-6 py-2  z-10 sticky  dark:bg-nav-darkbg dark:shadow-[0_8px_15px_-5px_rgba(48,225,225,0.6)] ">
      <h1
        className="text-2xl font-bold text-gray-800 dark:text-white"
        style={{ userSelect: "none" }}
      >
        <div className=" rounded-lg flex text-white px-2.5 py-2.5 cursor-pointer float-left justify-center gap-1.5 items-center dark:bg-nav-darkbg bg-zinc-300 "
          // style={{
          //   // backgroundColor: "rgba(50, 61, 76, 0.2)",
          //   borderRadius: "8px",  
          //   display: "flex",
          //   color: "#fff",
          //   padding: "10px 10px",
          //   cursor: "pointer",
          //   float: "left",
          //   justifyContent: "center",
          //   gap: "5px",
          //   alignItems: "center",
          // }}
        >
          <img src="/icon.png" width={64} height={64} alt="Logo" />
          <code className="dark:text-primary-dark-text-green tracking-widest">QubitVerse</code>
        </div>
      </h1>

      <div className="flex items-center space-x-5">
      

             <button onClick={() => setDarkTheme(prev => !prev)}>
            {darkTheme ? "Light Mode" : "Dark Mode"}
        </button>


        <button
          onClick={() => location.reload()}
          className="px-4 py-2 bg-gray-200   text-gray-800  rounded focus:outline-none
            dark:border-1
            dark:bg-secondary-darkbg
           dark:text-primary-dark-button-green 
            dark:hover:text-primary-darkbg 
            dark:border-primary-dark-button-green
            dark:hover:border-primary-darkbg
            dark:hover:bg-primary-dark-button-green
          "
          style={{ userSelect: "none" }}
        >
          Clear Circuit
        </button>

        {/* Bloch Sphere toggle button */}
        <button
          onClick={onBlochToggle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none
          border-2 
            dark:border-primary-dark-border-green `
            dark:text-primary-dark-text-green
             dark:bg-primary-darkbg
             dark:hover:bg-primary-dark-text-green
             dark:hover:text-primary-darkbg dark:hover:border-primary-darkbg
          "
          style={{ userSelect: "none" }}
        >
          {isBlochActive ? "Back to Circuit" : "Bloch Sphere"}
        </button>

        <a
          href="https://github.com/QubitStorm-HackStacy/QubitStorm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 dark:text-green-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
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
