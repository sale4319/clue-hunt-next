import "server-only";

import { Page } from "@app/page-component";

import { validateQuizAccess } from "../../_utils/checkQuizAccess";
import QuizSix from "../../_components/QuizSix";

export default async function page() {
  await validateQuizAccess("six");

  return (
    <Page>
      <QuizSix />
    </Page>
  );
}
