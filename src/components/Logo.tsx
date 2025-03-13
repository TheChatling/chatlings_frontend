import React, { useState, useEffect, useRef } from "react";
import Eye from "./Eye";
import logo from "@/assets/chatling.png";
import Image from "next/image";
import { motion, useSpring } from "framer-motion";
const Logo = ({ mousePos }: { mousePos: { x: number; y: number } }) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const [eyePositions, setEyePositions] = useState({
    leftEye: { x: 0, y: 0 },
    rightEye: { x: 0, y: 0 },
  });
  const [relativeMousePos, setRelativeMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      const leftEye = { x: rect.width * 0.3, y: rect.height * 0.3 };
      const rightEye = { x: rect.width * 0.7, y: rect.height * 0.3 };
      setEyePositions({ leftEye, rightEye });
    }
  }, [logoRef]);

  useEffect(() => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      const relativeX = mousePos.x - rect.left;
      const relativeY = mousePos.y - rect.top - 10;
      setRelativeMousePos({ x: relativeX, y: relativeY });
    }
  }, [mousePos]);

  const xSpring = useSpring(mousePos.x, { stiffness: 5, damping: 2 });
  const ySpring = useSpring(mousePos.y, { stiffness: 5, damping: 2 });

  useEffect(() => {
    xSpring.set(mousePos.x);
    ySpring.set(mousePos.y);
  }, [mousePos.x, mousePos.y, xSpring, ySpring]);

  const style = {
    x: xSpring,
    y: ySpring,
    transform: "translate(-50%, -50%)",
  };
  return (
    <motion.div
      ref={logoRef}
      className="w-32 h-32 -left-16 -top-14 fixed overflow-hidden"
      style={style}
    >
      <div className="absolute top-6 right-6 left-6 bottom-6 rounded-full bg-pink-500 blur-lg -z-50"></div>
      <Image src={logo} alt="Animal" className="w-full h-full object-cover" />
      <div className="absolute flex top-11 left-[2.1rem] right-0 gap-5">
        <Eye
          mouseX={relativeMousePos.x}
          mouseY={relativeMousePos.y}
          centerX={eyePositions.leftEye.x}
          centerY={eyePositions.leftEye.y}
        />
        <Eye
          mouseX={relativeMousePos.x + 8}
          mouseY={relativeMousePos.y}
          centerX={eyePositions.rightEye.x}
          centerY={eyePositions.rightEye.y}
        />
      </div>
    </motion.div>
  );
};

export default Logo;
