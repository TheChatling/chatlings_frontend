"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../utils/api";
import Link from "next/link";
import createAlert from "@/utils/createAlert";
import { useDispatch } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SignUp = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [repeatPasswordValue, setRepeatPasswordValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (passwordValue !== repeatPasswordValue) return;
      const response = await apiClient.post("/signup", {
        name: usernameValue,
        password: passwordValue,
        email: emailValue,
      });

      if (response.data.conflict) {
        setIsLoading(false);
        createAlert(dispatch, response.data.message, "red");
        return;
      }
      router.push("/chat");

      setIsLoading(false);
    } catch {
      setIsLoading(false);
      createAlert(dispatch, "There was an error pelase try again later", "red");
    }
  };
  return (
    <div className="relative w-full h-screen bottom-0 border-2 border-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex-col items-center justify-center px-3 w-80 py-5 border-sky-600 border-2 mb-20 bg-gray-700 rounded-lg relative"
      >
        <label htmlFor="Username">Username</label>
        <input
          required
          type="text"
          name="Username"
          value={usernameValue}
          className="bg-transparent border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-sky-400 transition rounded-none"
          onChange={(e) => setUsernameValue(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          required
          type="email"
          name="email"
          value={emailValue}
          className="bg-transparent border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-sky-400 transition rounded-none"
          onChange={(e) => setEmailValue(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          required
          type="password"
          name="password"
          value={passwordValue}
          className="bg-transparent border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-sky-400 transition rounded-none"
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        <label htmlFor="repeatPassword">Repeat Your Password</label>
        <input
          required
          type="password"
          name="repeatPassword"
          value={repeatPasswordValue}
          className="bg-transparent border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-sky-400 transition rounded-none"
          onChange={(e) => setRepeatPasswordValue(e.target.value)}
        />
        <button
          disabled={isLoading}
          type="submit"
          className=" bg-green-600 disabled:bg-green-700 hover:bg-green-700 transition font-bold text-white shadow-sm rounded-md w-full py-3"
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="mx-auto w-6 h-6 text-gray-200 animate-spin" />
          ) : (
            "Sign Up"
          )}
        </button>
        <div className="absolute left-0 -bottom-10">
          <h2 className="text-gray-300">
            Have An Account Already?{" "}
            <Link href="/login" className="text-sky-400">
              Login
            </Link>
          </h2>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
