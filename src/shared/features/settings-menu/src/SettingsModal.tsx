"use client";

import { Button, Title } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { settingsApi } from "@app/lib/client";
import { SettingsModalMessages } from "@app/messages-contract";

import { LogoutButton } from "./LogoutButton/LogoutButton";
import { RestartButton } from "./RestartButton";
import { ToggleSwitch } from "./ToggleSwitch";

import styles from "./SettingsModal.module.css";

export const SettingsModal = () => {
  const { settings, refreshSettings } = useSettings();

  const handleClose = async () => {
    await settingsApi.toggleSettingsModal();
    await refreshSettings();
  };

  const handleToggleQuiz = async () => {
    await settingsApi.toggleQuizMode();
    await refreshSettings();
  };

  const handleToggleSkip = async () => {
    await settingsApi.toggleSkipMode();
    await refreshSettings();
  };

  if (!settings || !settings.settingsOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
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
        <Button
          size={"medium"}
          onClick={handleClose}
          label="Close"
          mode="close"
        />
      </div>
    </div>
  );
};
