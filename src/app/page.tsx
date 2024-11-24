import { getRoute } from "@/utils";

import styles from "./page.module.css";
import { DefaultButton } from "@/components/DefaultButton/DefaultButton";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Start</h1>
      </main>
      <DefaultButton href={`${getRoute(false, "start")}`} label="Start" />
    </div>
  );
}
