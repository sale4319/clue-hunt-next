import "server-only";

import { Page } from "@app/page-component";

import { validateQuizAccess } from "../../_utils/checkQuizAccess";
import QuizFour from "../../_components/QuizFour";

export default async function page() {
  await validateQuizAccess("four");

  return (
    <Page>
      <QuizFour />
    </Page>
  );
}
