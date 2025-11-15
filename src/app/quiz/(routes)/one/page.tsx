import "server-only";

import { Page } from "@app/page-component";

import { validateQuizAccess } from "../../_utils/checkQuizAccess";
import QuizOne from "../../_components/QuizOne";

export default async function page() {
  await validateQuizAccess("one");

  return (
    <Page>
      <QuizOne />
    </Page>
  );
}
