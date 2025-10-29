"use client";

import { AppMenu, Container } from "clue-hunt-ui";

import { useAuth,useSettings } from "@app/context";
import { DarkModeButton } from "@app/dark-mode-button";
import { SettingsButton,SettingsModal } from "@app/settings-menu";

import styles from "./Page.module.css";

type PageProps = {
  children: React.ReactNode;
};

export default function Home({ children }: PageProps) {
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();

  return (
    <Container theme={settings?.theme}>
      <div className={styles.page}>
        {isAuthenticated && (
          <AppMenu theme={settings?.theme}>
            <DarkModeButton />
          </AppMenu>
        )}
        {children}
        {settings?.settingsOpen && <SettingsModal />}
        {isAuthenticated && (
          <SettingsButton className={styles.settingsButton}>
            <i className={styles.settingsIcon} />
          </SettingsButton>
        )}
      </div>
    </Container>
  );
}
