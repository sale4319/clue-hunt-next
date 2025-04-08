'use client";';
import { useEffect } from "react";
import { Button, Title } from "clue-hunt-ui";
import { useGameSettings } from "@app/context";
import { ToggleSwitch } from "./ToggleSwitch";

import { SettingsModalMessages } from "@app/messages-contract";

import styles from "./SettingsModal.module.css";

type SettingsModalProps = {
  onRequestClose?: () => void;
};

export const SettingsModal = ({ onRequestClose }: SettingsModalProps) => {
  const { quizMode, skipMode, setSkipMode, setQuizMode, darkMode } =
    useGameSettings();
  // Use useEffect to add an event listener to the document
  useEffect(() => {
    function onKeyEsc(event: { keyCode: number }) {
      if (event.keyCode === 27) {
        // Close the modal when the Escape key is pressed
        onRequestClose && onRequestClose();
      }
    }

    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyEsc);

    // Clear things up when unmounting this component
    return () => {
      document.body.style.overflow = "visible";
      document.removeEventListener("keydown", onKeyEsc);
    };
  });

  const mode = darkMode ? styles.dark : styles.light;

  const handleQuizMode = () => setQuizMode(!quizMode);
  const handleSkipMode = () => setSkipMode(!skipMode);
  return (
    <div className={styles.modalBackdrop}>
      <div className={[styles.modalContainer, mode].join(" ")}>
        <Title
          titleSize="medium"
          label={SettingsModalMessages.TITLE}
          theme={darkMode}
        />
        <Title
          titleSize="small"
          label={SettingsModalMessages.INFO}
          theme={darkMode}
        />
        <ToggleSwitch
          onChange={handleQuizMode}
          defaultChecked={quizMode}
          toggle={quizMode}
          label="Quiz mode"
        />
        <ToggleSwitch
          onChange={handleSkipMode}
          defaultChecked={quizMode}
          toggle={skipMode}
          label="Skip mode"
        />
        <Button
          size={"medium"}
          onClick={onRequestClose}
          label="Close"
          mode="close"
        />
      </div>
    </div>
  );
};
