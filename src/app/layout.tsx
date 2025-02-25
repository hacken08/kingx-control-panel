import { ReactNode } from "react";
import localFont from "next/font/local";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "@/components/AppProvider";
import { Toaster } from "@/components/ui/toaster"

type Props = {
  children: ReactNode;
};
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>{children}</AppProvider>
        <Toaster/>
      </body>
    </html>
  );
}
