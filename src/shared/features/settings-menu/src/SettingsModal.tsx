import "server-only";

import { Button, Title } from "clue-hunt-ui";

import { ToggleSwitch } from "./ToggleSwitch";

import { SettingsModalMessages } from "@app/messages-contract";

import styles from "./SettingsModal.module.css";
import { cookies } from "next/headers";
import { toggleQuizCookie, toggleSkipCookie } from "@app/actions";

type SettingsModalProps = {
  onRequestClose?: () => void;
};

export const SettingsModal = async ({ onRequestClose }: SettingsModalProps) => {
  const theme = (await cookies()).get("theme")?.value;
  const quizMode = (await cookies()).get("quiz")?.value === "true";
  const skipMode = (await cookies()).get("skip")?.value === "true";

  return (
    <div className={styles.modalBackdrop}>
      <div
        className={[styles.modalContainer, styles[theme || "dark"]].join(" ")}
      >
        <Title
          titleSize="medium"
          label={SettingsModalMessages.TITLE}
          theme={theme}
        />
        <Title
          titleSize="small"
          label={SettingsModalMessages.INFO}
          theme={theme}
        />
        <ToggleSwitch
          onChange={toggleQuizCookie}
          toggle={quizMode}
          label="Quiz mode"
        />
        <ToggleSwitch
          onChange={toggleSkipCookie}
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
