import React, { useEffect, useState } from "react";
import { Title } from "clue-hunt-ui";

import { type Highscore, highscoreApi } from "@app/lib/client";

import styles from "./HighscoreList.module.css";

interface HighscoreListProps {
  theme?: "light" | "dark";
  limit?: number;
  showTitle?: boolean;
}

export function HighscoreList({
  theme = "dark",
  limit = 10,
  showTitle = true,
}: HighscoreListProps) {
  const [highscores, setHighscores] = useState<Highscore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHighscores = async () => {
      try {
        const scores = await highscoreApi.getTopHighscores(limit);
        console.log("Loaded highscores:", scores);
        setHighscores(scores);
      } catch (err) {
        setError("Failed to load highscores");
        console.error("Failed to load highscores:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHighscores();
  }, [limit]);

  if (isLoading) {
    return (
      <Title label="Loading highscores..." theme={theme} titleSize="small" />
    );
  }

  if (error) {
    return <Title label={error} theme={theme} titleSize="small" />;
  }

  if (highscores.length === 0) {
    return <Title label="No highscores yet!" theme={theme} titleSize="small" />;
  }

  return (
    <div style={{ marginTop: showTitle ? "20px" : "0" }}>
      {showTitle && (
        <Title label="🏆 Top Highscores" theme={theme} titleSize="medium" />
      )}
      <div style={{ marginTop: "10px" }}>
        {highscores.map((score, index) => (
          <div
            key={score.userId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
              marginBottom: "5px",
              backgroundColor: index < 3 ? "#75f8e2" : "transparent",
              color: index < 3 ? "#000" : "#75f8e2",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: "bold", minWidth: "20px" }}>
                {index + 1}.
              </span>
              <span>{score.username || `User ${score.userId.slice(-4)}`}</span>
            </div>
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <span style={{ fontWeight: "bold" }}>
                {score.score.toLocaleString()}
              </span>
              <span style={{ fontSize: "12px", opacity: 0.8 }}>
                {Math.floor(score.completionTimeInSeconds / 60)}m{" "}
                {score.completionTimeInSeconds % 60}s
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
