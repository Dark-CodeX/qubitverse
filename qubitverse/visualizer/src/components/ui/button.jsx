import React from "react";

export const Button = ({
  variant = "default",
  onClick,
  children,
  className = "",
}) => {
  // Define button styles based on the variant
  const baseStyles =
    "p-2 rounded-md font-semibold text-sm transition-all duration-200 ease-in-out border-2";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline:
      "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white mr-1 ml-1",
    // Add more variants as needed
  };

  return (
    <button
      className={`${baseStyles} ${
        variantStyles[variant]
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
