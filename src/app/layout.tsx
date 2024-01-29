import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import Provider from "./context/Provider";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Link Shortener",
  description: "Shorten your link in seconds",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" className="light">


      <body className={`font-sans ${inter.variable}  min-h-screen box-content`}>
        <Provider session={session}>
    <Toaster/>
          <Navbar/>
        {children}
       
        </Provider>
        </body>
    </html>
  );
}
