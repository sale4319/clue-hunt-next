import "server-only";

import styles from "./Page.module.css";

type PageProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Home({ children, title }: PageProps) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>{title}</h1>
      </main>
      {children}
    </div>
  );
}
