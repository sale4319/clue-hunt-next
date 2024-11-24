import Link from "next/link";
import { getRoute } from "@/utils";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href={`${getRoute(false, "start")}`}>Start</Link>
      </main>
      <footer className={styles.footer}>Footer</footer>
    </div>
  );
}
