import "server-only";

import { Page } from "@app/page-component";
import LevelThree from "../../_components/LevelThree";
import { cookies } from "next/headers";

export default async function page() {
  const theme = (await cookies()).get("theme")?.value;
  const quizMode = (await cookies()).get("quiz")?.value === "true";
  const skipMode = (await cookies()).get("skip")?.value === "true";
  return (
    <Page>
      <LevelThree theme={theme} quizMode={quizMode} skipMode={skipMode} />
    </Page>
  );
}
