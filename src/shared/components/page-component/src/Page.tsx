import "server-only";

import { ContentWrapper } from "@app/content-wrapper";
import styles from "./Page.module.css";

type PageProps = {
  children: React.ReactNode;
};

export default function Home({ children }: PageProps) {
  return (
    <ContentWrapper>
      <div className={styles.page}>{children}</div>
    </ContentWrapper>
  );
}
