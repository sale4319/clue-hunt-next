import cx from "classnames";
import { Button, SpacerElement, Title } from "clue-hunt-ui";
import { useSettings } from "src/shared/context/SettingsContext";

import styles from "./LevelCompleted.module.css";

export const LevelCompleted = ({
  handleContinue,
}: {
  handleContinue: () => Promise<void>;
}) => {
  const { settings } = useSettings();

  return (
    <div className={cx(styles.contentBox, styles[settings?.theme || "dark"])}>
      <Title
        label="Level completed! You can continue."
        titleSize="small"
        color="#75f8e2"
        align="center"
      />
      <Button
        size="medium"
        isLocked={false}
        primary={false}
        onClick={handleContinue}
        label="Continue"
      />
    </div>
  );
};
