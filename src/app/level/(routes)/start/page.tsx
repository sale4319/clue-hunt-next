import "server-only";

import { cookies } from "next/headers";
import { Page } from "@app/page-component";
import LevelStart from "../../_components/LevelStart";

export default async function Home() {
  const theme = (await cookies()).get("theme")?.value;
  const quizMode = (await cookies()).get("quiz")?.value === "true";
  const skipMode = (await cookies()).get("skip")?.value === "true";

  return (
    <Page>
      <LevelStart theme={theme} quizMode={quizMode} skipMode={skipMode} />
    </Page>
  );
}
