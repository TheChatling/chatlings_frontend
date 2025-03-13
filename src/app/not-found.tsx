"use client";
import React from "react";
import Image from "next/image";
import notFoundImg from "@/assets/404.png";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen flex-col text-2xl">
      <Image src={notFoundImg} alt="notFoundImg" className="w-48 h-48" />
      404 Sorry we couldn&apos;t find the page try again later
    </div>
  );
};

export default NotFound;
