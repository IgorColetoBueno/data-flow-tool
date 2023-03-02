"use client";
import DftProvider from "@/store/provider";
import "./global.css";
import Head from "./head";
import "./layout.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Head />
      <body>
        <DftProvider>{children}</DftProvider>
      </body>
    </html>
  );
}
