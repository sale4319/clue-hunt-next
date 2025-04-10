import "server-only";

import { Page } from "@app/page-component";
import LevelTwo from "../../_components/LevelTwo";
import { cookies } from "next/headers";

export default async function page() {
  const theme = (await cookies()).get("theme")?.value;
  const quizMode = (await cookies()).get("quiz")?.value === "true";
  const skipMode = (await cookies()).get("skip")?.value === "true";
  return (
    <Page>
      <LevelTwo theme={theme} quizMode={quizMode} skipMode={skipMode} />
    </Page>
  );
}
