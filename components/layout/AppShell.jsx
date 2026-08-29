"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";
import SessionWelcome from "@/components/auth/SessionWelcome";

export default function AppShell({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SessionWelcome />
      <div className="h-screen w-screen overflow-hidden flex bg-(--color-bg)">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <Topbar onMenuClick={() => setIsOpen(true)} />
          <main className="flex-1 overflow-y-auto flex flex-col relative">
            <div className="flex-1 flex flex-col px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto w-full">
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
}
