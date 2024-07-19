import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/provider/theme-provider";
import ModalProvider from "@/components/provider/modal-provider";
import QueryProvider from "@/components/provider/query-provider";
import { SocketProvider } from "@/components/provider/socket-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Colab App",
  description: "You can colaboration your idea's"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(
          inter.className,
          "bg-white dark:bg-[#313338]"
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="colab-theme"
          >
          
          
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
       
          <SignedIn>
            
          {/* <header className="flex-justify-between">
            <UserButton  afterSignOutUrl="/" />
            </header> */}
          {/* <ModeToggle /> */}
         
         
          </SignedIn>
            <SocketProvider>
              <ModalProvider /> 
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider>
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

