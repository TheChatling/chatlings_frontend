import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import AlertProvider from "@/components/AlertProvider";

export const metadata: Metadata = {
  title: "Chatling",
  description: "Chat with ease and effortlessly connect with others for free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AlertProvider>{children}</AlertProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
