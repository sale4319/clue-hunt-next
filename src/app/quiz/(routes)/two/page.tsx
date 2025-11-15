import "server-only";

import { Page } from "@app/page-component";

import { validateQuizAccess } from "../../_utils/checkQuizAccess";
import QuizTwo from "../../_components/QuizTwo";

export default async function page() {
  await validateQuizAccess("two");

  return (
    <Page>
      <QuizTwo />
    </Page>
  );
}
