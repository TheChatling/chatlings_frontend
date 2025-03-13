"use client";
import React, { FormEvent, useState } from "react";
import apiClient from "../../utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import createAlert from "@/utils/createAlert";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";

const Login = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await apiClient.post("/login", {
        name: usernameValue,
        password: passwordValue,
      });
      if (response.status === 200) router.push("/chat");
      setIsLoading(false);
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error && error.status === 403) {
        createAlert(dispatch, "Unmatching Login Credentials", "red");
        setIsLoading(false);
        return;
      }
      createAlert(dispatch, "There was an error please try again later", "red");
      setIsLoading(false);
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
          onChange={(e) => setUsernameValue(e.target.value)}
          className="bg-transparent border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-sky-400 transition rounded-none"
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

        <button
          disabled={isLoading}
          type="submit"
          className=" bg-green-600 disabled:bg-green-700 hover:bg-green-700 transition font-bold text-white shadow-sm rounded-md w-full py-3"
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="mx-auto w-6 h-6 text-gray-200 animate-spin" />
          ) : (
            "Login"
          )}
        </button>
        <div className="absolute left-0 -bottom-10">
          <h2 className="text-gray-300">
            Dont Have An Account?{" "}
            <Link href="/signup" className="text-sky-400">
              Signup
            </Link>
          </h2>
        </div>
      </form>
    </div>
  );
};

export default Login;
