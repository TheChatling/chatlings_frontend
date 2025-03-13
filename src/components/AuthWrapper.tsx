"use client";

import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ReduxUserState } from "@/dataTypes";
import { fetchUserAsync } from "@/features/user/userSlice";
import { AppDispatch } from "@/store";

const AuthWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = useSelector((state: ReduxUserState) => state.userData.user);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        if (pathname !== "/chat") router.push("/chat");
        setIsLoading(false);
        return;
      }
      try {
        await dispatch(fetchUserAsync()).unwrap();
        if (pathname !== "/chat") router.push("/chat");
        setIsLoading(false);
      } catch {
        if (pathname !== "/") router.push("/");
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [user, dispatch, pathname, router]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
