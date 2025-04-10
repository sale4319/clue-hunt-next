import "server-only";

import { cookies } from "next/headers";
import { AppMenu, Container } from "clue-hunt-ui";
import { SettingsModal } from "@app/settings-menu";
import { setSettingsCookie } from "@app/actions";

import styles from "./Page.module.css";
import { DarkModeButton } from "@app/dark-mode-button";

type PageProps = {
  children: React.ReactNode;
};

export default async function Home({ children }: PageProps) {
  const theme = (await cookies()).get("theme")?.value;
  const isModalOpen = (await cookies()).get("settings")?.value === "true";

  return (
    <Container theme={theme}>
      <div className={styles.page}>
        <AppMenu theme={theme}>
          <DarkModeButton />
        </AppMenu>
        {children}
        {isModalOpen && <SettingsModal onRequestClose={setSettingsCookie} />}
        <button
          className={styles.settingsButton}
          onClick={setSettingsCookie}
          type="button"
        >
          <i className={styles.settingsIcon} />
        </button>
      </div>
    </Container>
  );
}
