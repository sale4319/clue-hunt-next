import "server-only";
import { Container } from "clue-hunt-ui";
import styles from "./Page.module.css";

type PageProps = {
  children: React.ReactNode;
};

export default function Home({ children }: PageProps) {
  return (
    <Container>
      <div className={styles.page}>{children}</div>
    </Container>
  );
}
