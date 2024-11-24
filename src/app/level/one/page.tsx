import LevelOne from "./_components/LevelOne/LevelOne";

import styles from "../../page.module.css";

export default function page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Level one</h1>
      </main>
      <LevelOne />
    </div>
  );
}
