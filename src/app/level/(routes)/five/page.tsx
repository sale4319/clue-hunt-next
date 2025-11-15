import "server-only";

import { Suspense } from "react";

import { Page } from "@app/page-component";

import LevelFive from "../../_components/LevelFive";
import { validateLevelAccess } from "../../_utils/checkLevelAccess";

type Props = {
  searchParams?: Promise<{ skip?: string; progress?: string }>;
};

export default async function page(props: Props) {
  const searchParams = await props.searchParams;
  const skip = searchParams?.skip === "true";
  const progress = searchParams?.progress === "true";
  await validateLevelAccess("five", skip, progress);

  return (
    <Page>
      <Suspense fallback={<div>Loading...</div>}>
        <LevelFive />
      </Suspense>
    </Page>
  );
}
