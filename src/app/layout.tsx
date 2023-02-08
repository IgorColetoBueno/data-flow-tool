"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from "./head";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./layout.css";

const light = createTheme({ palette: { mode: "light" } });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Head />
      <body>
        <ThemeProvider theme={light}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
