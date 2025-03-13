"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={(e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      }}
      className="flex items-center justify-center w-screen h-screen"
    >
      <div
        className={`-z-50 absolute top-0 left-0 right-0 bottom-0 duration-1000 ${
          mousePos.x === 0 && mousePos.y === 0 ? "opacity-0" : "opacity-100"
        }`}
      >
        <Logo mousePos={mousePos} />
      </div>

      <div className="w-[80%] min-w-[500px] mx-auto text-center">
        <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl lg:leading-snug">
          Chat with ease and effortlessly connect with others for free
        </h1>
        <p className="text-gray-400 mt-3 mb-5">
          This app is a demo and not a complete version, created specifically
          for my portfolio
        </p>
        <Link
          href="/signup"
          className="px-8 py-3 w-64 hover:bg-green-700 transition bg-green-600 rounded-md font-semibold text-xl text-gray-100"
        >
          SignUp For Free
        </Link>
      </div>
    </div>
  );
};

export default Hero;
