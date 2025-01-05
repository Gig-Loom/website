'use client';

import { NextUIProvider } from "@nextui-org/system";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Toaster 
        position="bottom-right" 
      />
      {children}
    </NextUIProvider>
  );
}
