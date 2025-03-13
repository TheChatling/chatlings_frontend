import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-center">
      <AiOutlineLoading3Quarters className="w-16 h-16 animate-spin" />
    </div>
  );
};

export default Loading;
