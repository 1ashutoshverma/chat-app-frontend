// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

export function Providers({ children }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
