import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  return (
    open && (
      <div className=" inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6">
          <button
            className="absolute top-2 right-2 text-xl"
            onClick={() => onOpenChange(false)}
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    )
  );
};

export const DialogContent = ({ children }) => <div>{children}</div>;

export const DialogHeader = ({ children }) => (
  <div className="text-lg font-semibold">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <div className="text-xl font-bold">{children}</div>
);

export const DialogDescription = ({ children }) => (
  <div className="text-sm text-gray-500">{children}</div>
);
