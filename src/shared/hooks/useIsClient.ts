"use client";

import { useState, useEffect } from "react";

export function useIsClient() {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
