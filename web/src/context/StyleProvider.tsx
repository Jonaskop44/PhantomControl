"use client";

import { HeroUIProvider } from "@heroui/react";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import { Toaster } from "sonner";

interface StyleProviderProps {
  children: React.ReactNode;
}

const StyleProvider: React.FC<StyleProviderProps> = ({ children }) => {
  return (
    <>
      <HeroUIProvider>
        <NextTopLoader />
        {children}
        <Toaster position="bottom-right" richColors />
      </HeroUIProvider>
    </>
  );
};

export default StyleProvider;
