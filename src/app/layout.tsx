import Head from "./head";
import "./layout.css";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Head />
      <body>{children}</body>
    </html>
  );
}
