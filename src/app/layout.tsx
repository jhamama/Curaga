import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import "./globals.css";

import { Metadata } from "next";
import { cn } from "./utils/ui/shadcn";
import { Navbar } from "./components/Navbar/Navbar";
import { TRPCReactProvider } from "./utils/trpc/react";
import { LoadingProvider } from "./components/LoadingOverlay/LoadingOverlay";
import { PageWrapper } from "./components/PageWrapper/PageWrapper";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BackgroundBoxesDefault } from "./components/BackgroundBoxes/BackgroundBoxes";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Julian Things",
  description: "A site with my things",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cupcake">
      <head />
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider>
          <Navbar />
          <LoadingProvider>
            <PageWrapper>
              <TooltipProvider
                disableHoverableContent
                delayDuration={500}
                skipDelayDuration={0}
              >
                {/* Background boxes absolute */}
                <div className="feather-bottom absolute left-1/2 top-0 h-1/2 w-screen -translate-x-1/2 overflow-hidden">
                  <div style={{ width: "100%", height: "40rem" }}>
                    <BackgroundBoxesDefault />
                  </div>
                </div>
                <div className="z-30 flex w-full justify-center">
                  {children}
                </div>
              </TooltipProvider>
            </PageWrapper>
          </LoadingProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
