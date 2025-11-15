"use client";

import { Button } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useAuth } from "@app/context/client";
import { useSettings } from "@app/context/client";
import { useStatistics } from "@app/context/client";
import { quizApi, settingsApi, statisticsApi } from "@app/lib/client";

import styles from "./RestartButton.module.css";

export function RestartButton() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshSettings } = useSettings();
  const { refreshStatistics } = useStatistics();

  const handleRestart = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "restart" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to restart game (${response.status})`
        );
      }

      await statisticsApi.resetStatistics();
      await quizApi.resetAllProgress();
      await settingsApi.clearTimerEndDate();

      await refreshSettings();
      await refreshStatistics();

      router.push("/level/start");
    } catch (error) {
      console.error("Restart error:", error);
      alert(
        `Failed to restart game: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className={styles.restartContainer}>
      <Button
        onClick={handleRestart}
        mode="close"
        size="small"
        label="Restart"
      />
    </div>
  );
}
