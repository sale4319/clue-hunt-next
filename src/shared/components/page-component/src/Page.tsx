import "server-only";

import { AppMenu, Container } from "clue-hunt-ui";

import { getServerSettings, getServerUserId } from "@app/context/server";
import { DarkModeButton } from "@app/dark-mode-button";
import { SettingsButton, SettingsModal } from "@app/settings-menu";

import styles from "./Page.module.css";

type PageProps = {
  children: React.ReactNode;
};

export default async function Home({ children }: PageProps) {
  const settings = await getServerSettings();
  const userId = await getServerUserId();
  const isAuthenticated = !!userId;
  const theme = settings?.theme || "dark";

  return (
    <Container theme={theme}>
      <div className={styles.page}>
        {isAuthenticated && (
          <AppMenu theme={theme}>
            <DarkModeButton />
          </AppMenu>
        )}
        {children}
        <SettingsModal />
        {isAuthenticated && (
          <SettingsButton className={styles.settingsButton}>
            <i className={styles.settingsIcon} />
          </SettingsButton>
        )}
      </div>
    </Container>
  );
}
