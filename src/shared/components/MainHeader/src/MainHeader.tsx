import "server-only";

import styles from "./MainHeader.module.css";

export const MainHeader = () => (
  <header>
    <div className={styles.storybookHeader}>
      <div>
        <h1>Acme</h1>
      </div>
      <div></div>
    </div>
  </header>
);
