import "server-only";

import { Page } from "@app/page-component";

import QuizFour from "../../_components/QuizFour";
import { validateQuizAccess } from "../../_utils/checkQuizAccess";

type Props = {
  searchParams?: Promise<{ skip?: string; progress?: string }>;
};

export default async function page(props: Props) {
  const searchParams = await props.searchParams;
  const skip = searchParams?.skip === "true";
  const progress = searchParams?.progress === "true";
  await validateQuizAccess("four", skip, progress);

  return (
    <Page>
      <QuizFour />
    </Page>
  );
}
