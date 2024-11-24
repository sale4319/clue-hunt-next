import { DefaultButton } from "@/shared/components/DefaultButton";
import { getRoute } from "@/utils";

import styles from "../../page.module.css";

export default function page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Level two</h1>
      </main>
      <DefaultButton
        size="medium"
        href={`${getRoute(true, "start")}`}
        label="Recycle"
      />
    </div>
  );
}
