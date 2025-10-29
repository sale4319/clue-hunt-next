"use client";

import { AppMenu, Container } from "clue-hunt-ui";
import { SettingsModal } from "@app/settings-menu";
import { SettingsButton } from "../../settings-button/SettingsButton";
import { useSettings } from "@app/context";

import styles from "./Page.module.css";
import { DarkModeButton } from "@app/dark-mode-button";

type PageProps = {
  children: React.ReactNode;
};

export default function Home({ children }: PageProps) {
  const { settings } = useSettings();

  return (
    <Container theme={settings?.theme}>
      <div className={styles.page}>
        <AppMenu theme={settings?.theme}>
          <DarkModeButton />
        </AppMenu>
        {children}
        {settings?.settingsOpen && <SettingsModal />}
        <SettingsButton className={styles.settingsButton}>
          <i className={styles.settingsIcon} />
        </SettingsButton>
      </div>
    </Container>
  );
}
