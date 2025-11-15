import "server-only";

import { Page } from "@app/page-component";

import { validateQuizAccess } from "../../_utils/checkQuizAccess";
import QuizStart from "../../_components/QuizStart";

export default async function page() {
  await validateQuizAccess("start");

  return (
    <Page>
      <QuizStart />
    </Page>
  );
}
