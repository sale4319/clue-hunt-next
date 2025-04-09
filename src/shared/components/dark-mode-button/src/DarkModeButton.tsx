import "server-only";

import "./DarkModeButton.css";
import { toggleThemeCookie } from "src/shared/actions/setThemeCookie";

export const DarkModeButton = () => {
  return <button id={"darkMode"} onClick={toggleThemeCookie} />;
};
