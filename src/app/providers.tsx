"use client";

import { SWRConfig } from "swr";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SWRConfig
        value={{
          dedupingInterval: 2000,
          errorRetryCount: 2,
        }}
      >
        {children}
      </SWRConfig>
    </ThemeProvider>
  );
}
