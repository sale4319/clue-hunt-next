import "server-only";
import { Page } from "@app/page-component";
import QuizOne from "../../_components/QuizOne";

export default function page() {
  return (
    <Page title="Level one">
      <QuizOne />
    </Page>
  );
}
