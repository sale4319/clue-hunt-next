import "server-only";

import { ContentWrapper } from "@app/content-wrapper";
import styles from "./Page.module.css";
import { cookies } from "next/headers";

type PageProps = {
  children: React.ReactNode;
};

export default async function Home({ children }: PageProps) {
  const theme = (await cookies()).get("theme");
  return (
    <ContentWrapper theme={theme?.value}>
      <div className={styles.page}>{children}</div>
    </ContentWrapper>
  );
}
