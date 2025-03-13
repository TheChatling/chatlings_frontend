"use client";
import { ReduxAlertState } from "@/dataTypes";
import React from "react";
import { useSelector } from "react-redux";

const AlertWrapper = ({ children }: { children: React.ReactNode }) => {
  const alert = useSelector((state: ReduxAlertState) => state.alertData.alert);
  return (
    <>
      {alert.isVisible && (
        <div className="z-50 absolute bottom-20 left-0 right-0 text-center flex items-center justify-center">
          <h2
            className={`${
              alert.state === "green" ? "bg-green-500" : "bg-red-500"
            } text-gray-200 py-1 px-3 rounded-lg bg-opacity-75 text-lg`}
          >
            {alert.message}
          </h2>
        </div>
      )}

      {children}
    </>
  );
};

export default AlertWrapper;
