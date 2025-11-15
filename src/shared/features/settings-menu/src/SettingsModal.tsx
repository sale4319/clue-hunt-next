"use client";

import { Button, Title } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { settingsApi } from "@app/lib/client";
import { SettingsModalMessages } from "@app/messages-contract";

import { LogoutButton } from "./LogoutButton/LogoutButton";
import { RestartButton } from "./RestartButton";
import { ToggleSwitch } from "./ToggleSwitch";

import styles from "./SettingsModal.module.css";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { settings, refreshSettings } = useSettings();

  const handleToggleQuiz = async () => {
    await settingsApi.toggleQuizMode();
    await refreshSettings();
  };

  const handleToggleSkip = async () => {
    await settingsApi.toggleSkipMode();
    await refreshSettings();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !settings) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} onMouseDown={handleBackdropClick}>
      <div
        className={[styles.modalContainer, styles[settings.theme]].join(" ")}
      >
        <Title
          titleSize="medium"
          label={SettingsModalMessages.TITLE}
          theme={settings.theme}
        />
        <div className={styles.modalWrapper}>
          <div className={styles.modalContentColumn}>
            <LogoutButton />
            <RestartButton />
          </div>
          <div className={styles.modalContentColumn}>
            <ToggleSwitch
              onChange={handleToggleQuiz}
              toggle={settings.quizMode}
              label="Quiz mode"
            />
            <ToggleSwitch
              onChange={handleToggleSkip}
              toggle={settings.skipMode}
              label="Skip mode"
            />
          </div>
        </div>
        <Button size={"medium"} onClick={onClose} label="Close" mode="close" />
      </div>
    </div>
  );
};
