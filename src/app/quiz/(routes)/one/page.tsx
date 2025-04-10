import "server-only";

import { cookies } from "next/headers";
import { Page } from "@app/page-component";
import QuizOne from "../../_components/QuizOne";

export default async function page() {
  const theme = (await cookies()).get("theme")?.value;
  const skipMode = (await cookies()).get("skip")?.value === "true";
  return (
    <Page>
      <QuizOne theme={theme} skipMode={skipMode} />
    </Page>
  );
}
