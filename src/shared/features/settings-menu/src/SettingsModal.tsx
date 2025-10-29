"use client";

import { Button, Title } from "clue-hunt-ui";

import { ToggleSwitch } from "./ToggleSwitch";

import { SettingsModalMessages } from "@app/messages-contract";

import styles from "./SettingsModal.module.css";
import { getClientSessionId } from "src/shared/lib/clientSession";
import { settingsApi } from "src/shared/lib/api/settings";
import { useSettings } from "@app/context";

export const SettingsModal = () => {
  const { settings, refreshSettings } = useSettings();

  const handleClose = async () => {
    const sessionId = getClientSessionId();
    await settingsApi.toggleSettingsModal(sessionId);
    await refreshSettings();
  };

  const handleToggleQuiz = async () => {
    const sessionId = getClientSessionId();
    await settingsApi.toggleQuizMode(sessionId);
    await refreshSettings();
  };

  const handleToggleSkip = async () => {
    const sessionId = getClientSessionId();
    await settingsApi.toggleSkipMode(sessionId);
    await refreshSettings();
  };

  if (!settings) {
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
        <Title
          titleSize="small"
          label={SettingsModalMessages.INFO}
          theme={settings.theme}
        />
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
