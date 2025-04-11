"use client";

import { useSearchParams } from "next/navigation";

export function useFeatureToggle(featureName: string): boolean {
  const searchParams = useSearchParams();
  const featureToggle = searchParams?.get(featureName) ?? null;

  return featureToggle === "true";
}
