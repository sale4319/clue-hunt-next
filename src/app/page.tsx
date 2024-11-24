import Start from "../shared/levels/Start/Start";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Start</h1>
      </main>
      <Start />
    </div>
  );
}
