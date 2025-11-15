import "server-only";

import { Page } from "@app/page-component";

import { validateQuizAccess } from "../../_utils/checkQuizAccess";
import QuizThree from "../../_components/QuizThree";

export default async function page() {
  await validateQuizAccess("three");

  return (
    <Page>
      <QuizThree />
    </Page>
  );
}
