import "server-only";

import { cookies } from "next/headers";
import { Page } from "@app/page-component";
import QuizStart from "../../_components/QuizStart";

export default async function page() {
  const theme = (await cookies()).get("theme")?.value;
  const skipMode = (await cookies()).get("skip")?.value === "true";
  return (
    <Page>
      <QuizStart theme={theme} skipMode={skipMode} />
    </Page>
  );
}
