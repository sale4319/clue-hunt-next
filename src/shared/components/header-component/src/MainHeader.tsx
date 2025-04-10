import "server-only";

import { AppMenu } from "clue-hunt-ui";
import { DarkModeButton } from "@app/dark-mode-button";

type ThemeType = { theme: string | undefined };

export const MainHeader = ({ theme }: ThemeType) => {
  return (
    <AppMenu theme={theme}>
      <DarkModeButton />
    </AppMenu>
  );
};
