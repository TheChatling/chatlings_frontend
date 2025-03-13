import React from "react";

interface EyeProps {
  mouseX: number;
  mouseY: number;
  centerX: number;
  centerY: number;
}

const Eye: React.FC<EyeProps> = ({ mouseX, mouseY, centerX, centerY }) => {
  const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
  const x = Math.cos(angle) * 5;
  const y = Math.sin(angle) * 5;

  return (
    <div className="w-5 h-5 rounded-full  border-black flex justify-center items-center">
      <div
        className="w-3 h-3 rounded-full bg-black"
        style={{ transform: `translate(${x}px, ${y}px)` }}
      ></div>
    </div>
  );
};

export default Eye;
