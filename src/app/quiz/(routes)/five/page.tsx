import "server-only";

import { Page } from "@app/page-component";

import { validateQuizAccess } from "../../_utils/checkQuizAccess";
import QuizFive from "../../_components/QuizFive";

export default async function page() {
  await validateQuizAccess("five");

  return (
    <Page>
      <QuizFive />
    </Page>
  );
}
